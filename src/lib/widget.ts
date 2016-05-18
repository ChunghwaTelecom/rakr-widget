import * as html2canvas from 'html2canvas';
import * as mousetrap from 'mousetrap';

import {Context} from './context';
import {LoginPanel} from './login-panel/login-panel';
import {ReportButton} from './report-button/report-button';
import {HttpRequest} from './utils/http-request';
import {Prompter} from './utils/prompter';

export class Widget {
  private context: Context;
  private reportButton: ReportButton;
  private loginPanel: LoginPanel;

  loggedIn = false;

  constructor() {
    this.context = new Context();
    if (this.context.shortcuts) {
      mousetrap.bind(this.context.shortcuts, () => this.reportIssue());
    }

    this.loginPanel = new LoginPanel(this.context);

    this.reportButton = new ReportButton(this.context);
    this.reportButton.onClick(() => this.reportIssue());
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

    return html2canvas(window.document.body)
      .then((canvas) => {
        this.reportButton.show();

        let data = JSON.stringify({
          imageDataUrls: [canvas.toDataURL()]
        });

        let url = this.context.resolveFullPath('/api/snippets');

        return HttpRequest.post(url, data);

      }, (reason) => {
        this.reportButton.show();
        throw reason;
      });
  }
}
