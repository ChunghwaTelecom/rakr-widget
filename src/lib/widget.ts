import * as mousetrap from 'mousetrap';
// TODO: Make Mousetrap not to export as global object hence inferning client application
// This is a dirty workaround to make Widget compatible with NTA projects
require('mousetrap/plugins/global-bind/mousetrap-global-bind');

import {Context} from './context';
import {LoginPanel} from './login-panel/login-panel';
import {ReportButton} from './report-button/report-button';
import {Reporter} from './reporter/reporter';
import {HttpRequest} from './utils/http-request';
import {Prompter} from './utils/prompter';

export class Widget {
  private context: Context;
  private reportButton: ReportButton;
  private loginPanel: LoginPanel;
  private reporter: Reporter;

  loggedIn = false;

  constructor() {
    this.context = new Context();
    if (this.context.shortcuts) {
      mousetrap.bind(this.context.shortcuts, () => this.reportIssue());
    }

    this.loginPanel = new LoginPanel(this.context);

    this.reportButton = new ReportButton(this.context);
    this.reportButton.onClick(() => this.reportIssue());

    this.reporter = new Reporter(this.context);
  }

  /**
   * Prepare data and report.
   */
  private reportIssue(): void {
    this.loginPanel.isLoggedIn().then(
      () => this.performReport(),
      () => {
        return this.loginPanel.login().then(
          () => this.performReport()
        );
      }
    ).then((id) => {
      let newWindow = window.open(this.context.resolveFullPath(`/issues/new/5?snippet=${id}`));
      if (!newWindow) {
        Prompter.prompt('請允許開啟彈跳式視窗。');
      }
    })
      .catch((reason) => {
        console.warn(reason);
        Prompter.prompt(`無法回報問題: ${reason}`);
      });
  }

  /**
   * Collect data and report issue.
   *
   * @returns Promise which resolves with submitted snippet id.
   */
  private performReport(): Promise<string> {
    this.reportButton.hide();

    return this.reporter.report().then(
      (snippetId) => {
        this.reportButton.show();
        return snippetId;
      },
      (error) => {
        this.reportButton.show();
        throw error;
      }
    );
  }
}
