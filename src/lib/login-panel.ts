import {Promise} from 'es6-promise';

import {HttpRequest} from './http-request';
import {Context} from './context';
import {Prompter} from './prompter';

export class LoginPanel {

  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  /**
   * Popup login panel for performing login.
   */
  public login() {
    return new Promise((resolve, reject) => {
      let loginPanel = document.createElement('div');
      loginPanel.innerHTML = require('./login-panel.html');
      loginPanel.className = require('./login-panel.css').loginPanel;

      document.body.appendChild(loginPanel);

      document.getElementById('rakr-login-form').onsubmit = (event) => {
        event.preventDefault();

        this.performLogin().then(
          () => {
            document.body.removeChild(loginPanel);
            resolve();
          },
          (message) => {
            Prompter.prompt(!message ? '登入失敗' : '登入失敗' + message);
          }
        );
      };

      document.getElementById('rakr-login-close').onclick = () => {
        document.body.removeChild(loginPanel);
        reject();
      };
    });
  }

  public isLoggedIn() {
    return HttpRequest.get(this.context.resolveFullPath('/api/login/success'));
  }

  private performLogin() {
    let data = JSON.stringify({
      'username': (<HTMLInputElement>document.getElementById('rakr-username')).value,
      'password': (<HTMLInputElement>document.getElementById('rakr-password')).value
    });

    let url = this.context.resolveFullPath('/login');

    return HttpRequest.post(url, data).then(
      // FIXME: I don't know why we can got the correct xhr.status here.
      // So just request server one more time to check if login is success.
      () => this.isLoggedIn(),
      () => this.isLoggedIn()
    );
  }
}