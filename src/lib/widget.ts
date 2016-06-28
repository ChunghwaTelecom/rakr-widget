import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

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
  private socket: any;

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

    this.loginPanel.isLoggedIn().then(
      () => this.updateNotification(),
      () => {
        this.reportButton.loginButtonShow();
        this.reportButton.loginButtonOnClick(
          (event) => {
            event.stopPropagation();

            this.loginPanel.login().then(
              () => {
                this.reportButton.loginButtonHide();
                this.updateNotification();
              },
              (message) => Prompter.prompt(message)
            )
          });
      }
    )

    this.reporter = new Reporter(this.context);

    let webSocketRoot = document.head.querySelector('[name=backend-websocket-root]') ?
      (<HTMLMetaElement>document.head.querySelector('[name=backend-websocket-root]')).content :
      this.context.resolveFullPath('/websocket/issues');
    this.socket = new SockJS(webSocketRoot);
    let stompClient = Stomp.over(this.socket);
    stompClient.connect({}, function (frame) {
      stompClient.subscribe('/topic/issues',
        // TODO since we cannot filter message by user right now,
        //      issueing an full query again.
        // FIXME popup notification message (related to user).
        result => this.updateNotification()
      );
    });
  }

  private updateNotification() {
    HttpRequest.get(this.context.resolveFullPath('/api/issues/notification')).then(
      (result) => {
        let obj = JSON.parse(result);
        let created = obj.author;
        let related = obj.assignee;

        this.reportButton.setCreatedIssuesCount(created);
        this.reportButton.setRelatedIssuesCount(related);
      }
    );
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
      let newWindow = window.open(this.context.resolveFullPath(`${this.context.newIssuePath}?snippet=${id}`));
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
