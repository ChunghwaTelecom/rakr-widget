import {Context} from '../context';
import {HttpRequest} from '../utils/http-request';
import {Prompter} from '../utils/prompter';

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

      let classes = [];
      // base style class
      classes.push(require('./login-panel.css').loginPanel);

      // theme style class
      try {
        classes.push(require(`./login-panel.theme.${this.context.display.theme}.css`).loginPanel);
      } catch (e) {
        console.warn(`Failed to load theme "${this.context.display.theme}".`, e);
      }
      loginPanel.className = classes.join(' ');

      // attach to dom
      document.body.appendChild(loginPanel);

      // bind submit event
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

      // bind close event
      document.getElementById('rakr-login-close').onclick = () => {
        document.body.removeChild(loginPanel);
        reject('取消登入');
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