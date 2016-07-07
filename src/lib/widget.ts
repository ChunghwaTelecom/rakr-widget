import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

// restore what JSON3 (as a transitive dependency from sockjs-client) did to JSON object 
window['JSON3'] && window['JSON3']['noConflict'] &&
typeof window['JSON3']['noConflict'] === 'function' && window['JSON3']['noConflict']();

import * as mousetrap from 'mousetrap';
// TODO: Make Mousetrap not to export as global object hence inferning client application
// This is a dirty workaround to make Widget compatible with NTA projects
require('mousetrap/plugins/global-bind/mousetrap-global-bind');

import {Context} from './context';
import {LoginPanel} from './login-panel/login-panel';
import {WidgetPanel} from './widget-panel/widget-panel';
import {Reporter} from './reporter/reporter';
import {HttpRequest} from './utils/http-request';
import {Prompter} from './utils/prompter';
import {WindowOpener} from './utils/window-opener';

export class Widget {
  private socket: any;

  private context: Context;
  private widgetPanel: WidgetPanel;
  private loginPanel: LoginPanel;
  private reporter: Reporter;
  private windowOpener: WindowOpener;

  loggedIn = false;

  constructor() {
    this.context = new Context();
    if (this.context.shortcuts) {
      mousetrap.bind(this.context.shortcuts, () => this.reportIssue());
    }

    this.windowOpener = new WindowOpener(this.context);

    this.loginPanel = new LoginPanel(this.context);

    this.widgetPanel = new WidgetPanel(this.context);
    this.widgetPanel.reportButtonOnClick(() => this.reportIssue());

    this.loginPanel.isLoggedIn().then(
      () => this.updateNotification(),
      () => {
        this.widgetPanel.loginButtonShow();
        this.widgetPanel.loginButtonOnClick(
          (event) => {
            event.stopPropagation();

            this.loginPanel.login().then(
              () => {
                this.widgetPanel.loginButtonHide();
                this.updateNotification();
              },
              (message) => Prompter.prompt(message)
            )
          });
      }
    )
    this.widgetPanel.relatedIssuesBadgeOnClick(
      (event) => {
        event.stopPropagation();
        this.windowOpener.openRakr('/issues?type=query&criteria=assigned_to_me');
      }
    );
    this.widgetPanel.createdIssuesBadgeOnClick(
      (event) => {
        event.stopPropagation();
        this.windowOpener.openRakr('/issues?type=query&criteria=created_by_me');
      }
    );

    this.reporter = new Reporter(this.context);

    let webSocketRoot = document.head.querySelector('[name=backend-websocket-root]') ?
      (<HTMLMetaElement>document.head.querySelector('[name=backend-websocket-root]')).content :
      this.context.resolveFullPath('/websocket/issues');
    this.socket = new SockJS(webSocketRoot);
    let stompClient = Stomp.over(this.socket);
    let _self = this;
    stompClient.connect({}, function (frame) {
      stompClient.subscribe('/topic/issues',
        // TODO since we cannot filter message by user right now,
        //      issueing an full query again.
        // FIXME popup notification message (related to user).
        result => _self.updateNotification()
      );
    });
  }

  private updateNotification() {
    HttpRequest.get(this.context.resolveFullPath('/api/issues/notification')).then(
      (result) => {
        let obj = JSON.parse(result);
        let created = obj.author;
        let related = obj.assignee;

        this.widgetPanel.setCreatedIssuesCount(created);
        this.widgetPanel.setRelatedIssuesCount(related);
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
    ).then(
      (id) => this.windowOpener.openRakr(this.context.newIssuePath, { snippet: id })
    ).catch(
      (reason) => {
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
    this.widgetPanel.hide();

    return this.reporter.report().then(
      (snippetId) => {
        this.widgetPanel.show();
        return snippetId;
      },
      (error) => {
        this.widgetPanel.show();
        throw error;
      }
    );
  }
}
