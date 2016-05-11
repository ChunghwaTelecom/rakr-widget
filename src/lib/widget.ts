import {Promise} from 'es6-promise';
import * as html2canvas from 'html2canvas';

import {HttpRequest} from './http-request';
import {Context} from './context';

declare function require(module: string): any;

export class Widget {
  context: Context;
  loggedIn = false;

  constructor() {
    this.context = new Context();
    this.createButton();
  }

  /**
   * Prepare data and report.
   */
  reportIssue() {
    this.isLoggedIn().then(
      () => this.performReport(),
      () => {
        return this.login().then(
          () => this.performReport()
        );
      }
    ).then((id) => {
      var newWindow = window.open(this.context.resolveFullPath(`/issues/new/5?snippet=${id}`));
      if (!newWindow) {
        this.prompt('請允許開啟彈跳式視窗。');
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

  isLoggedIn() {
    return HttpRequest.get(this.context.resolveFullPath('/api/login/success'));
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

  performLogin() {
    let data = JSON.stringify({
      'username': (<HTMLInputElement> document.getElementById('rakr-username')).value,
      'password': (<HTMLInputElement> document.getElementById('rakr-password')).value
    });

    let url = this.context.resolveFullPath('/login');

    return HttpRequest.post(url, data).then(
      // FIXME: I don't know why we can got the correct xhr.status here.
      // So just request server one more time to check if login is success.
      () => this.isLoggedIn(),
      () => this.isLoggedIn()
    );
  }

  /**
   * Popup login panel for performing login.
   */
  login() {
    return new Promise((resolve, reject) => {
      var loginForm = document.createElement('form');
      loginForm.innerHTML = require('./login-form.html');
      loginForm.style.display = 'inline-block';

      var loginPanel = document.createElement('div');
      loginPanel.appendChild(loginForm);
      loginPanel.style.zIndex = '10000';
      loginPanel.style.textAlign = 'center';
      loginPanel.style.position = 'absolute';
      loginPanel.style.top = '50%';
      loginPanel.style.left = '50%';
      loginPanel.style.marginTop = '-50px';
      loginPanel.style.marginLeft = '-50px';
      loginPanel.style.padding = '10px';
      loginPanel.style.width = '250px';
      loginPanel.style.height = '100px';
      loginPanel.style.backgroundColor = 'gray';

      loginForm.onsubmit = (event) => {
        event.preventDefault();

        this.performLogin().then(
          () => {
            document.body.removeChild(loginPanel);
            resolve();
          },
          (message) => {
            this.prompt(!message ? '登入失敗' : '登入失敗' + message);
          }
        );
      };

      document.body.appendChild(loginPanel);

      document.getElementById('rakr-login-close').onclick = () => {
        document.body.removeChild(loginPanel);
        reject();
      };
    });
  }

  prompt(message) {
    alert(message);
  }
}