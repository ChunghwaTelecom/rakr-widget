import * as html2canvas from 'html2canvas';

import {HttpRequest} from './http-request';
import {LoginPanel} from './login-panel';
import {Context} from './context';
import {Prompter} from './prompter';
import {ReportButton} from './report-button/report-button';

export class Widget {
  private context: Context;
  private reportButton: ReportButton;
  private loginPanel: LoginPanel;
  
  loggedIn = false;

  constructor() {
    this.context = new Context();
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
    });
  }

  /**
   * Collect data and report issue.
   *
   * @returns Promise which resolves with submitted snippet id.
   */
  private performReport(): Promise<string> {
    return html2canvas(window.document.body)
      .then((canvas) => {
        let data = JSON.stringify({
          imageDataUrls: [canvas.toDataURL()]
        });

        let url = this.context.resolveFullPath('/api/snippets');

        return HttpRequest.post(url, data);
      });
  }
}
