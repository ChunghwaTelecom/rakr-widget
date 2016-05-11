import {Promise} from 'es6-promise';
import * as html2canvas from 'html2canvas';

import {HttpRequest} from './http-request';
import {LoginPanel} from './login-panel';
import {Context} from './context';
import {Prompter} from './prompter';

export class Widget {
  context: Context;
  loginPanel: LoginPanel;
  loggedIn = false;

  constructor() {
    this.context = new Context();
    this.loginPanel = new LoginPanel(this.context);
    this.createButton();
  }

  /**
   * Prepare data and report.
   */
  reportIssue() {
    this.loginPanel.isLoggedIn().then(
      () => this.performReport(),
      () => {
        return this.loginPanel.login().then(
          () => this.performReport()
        );
      }
    ).then((id) => {
      var newWindow = window.open(this.context.resolveFullPath(`/issues/new/5?snippet=${id}`));
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
  performReport() {
    // TODO:
    // Fix compile error:
    //     TS2349: Cannot invoke an expression whose type lacks a call signature.
    // But this code is fully working right now.
    return html2canvas(window.document.body)
      .then((canvas) => {
        let data = JSON.stringify({
          imageDataUrls: [canvas.toDataURL()]
        });

        let url = this.context.resolveFullPath('/api/snippets');

        return HttpRequest.post(url, data);
      });
  }

  /**
   * Create report button.
   */
  createButton() {
    var reportButton = document.createElement('div');
    reportButton.innerHTML = require('./widget.html');
    let reportPanelClass = require('./widget.css').reportPanel;
    reportButton.className = reportPanelClass;

    reportButton.onclick = () => this.reportIssue();

    document.body.appendChild(reportButton);
  }
}
