import {Context} from '../context';

export class WidgetPanel {

  private reportButton: HTMLDivElement;
  private createdIssuesBadge: HTMLDivElement;
  private relatedIssuesBadge: HTMLDivElement;
  private loginButton: HTMLDivElement;

  constructor(private context: Context) {
    this.createPanel();
  }

  /**
   * Create report button.
   */
  private createPanel(): void {
    let reportButton: HTMLDivElement = document.createElement('div');

    reportButton.innerHTML = this.context.display.content;

    let classes = [];
    // base style class
    classes.push(require('./widget-panel.css').widgetPanel);

    // position style class
    let positionClass;
    switch (this.context.display.position) {
      case Context.Position.BottomLeft:
        positionClass = require('./widget-panel.position.bottom-left.css').widgetPanel;
        break;

      case Context.Position.TopLeft:
        positionClass = require('./widget-panel.position.top-left.css').widgetPanel;
        break;

      case Context.Position.TopRight:
        positionClass = require('./widget-panel.position.top-right.css').widgetPanel;
        break;

      case Context.Position.BottomRight:
      /* fallthrough */
      default:
        positionClass = require('./widget-panel.position.bottom-right.css').widgetPanel;
    }

    classes.push(positionClass)

    // theme style class
    try {
      classes.push(require(`./widget-panel.theme.${this.context.display.theme}.css`).widgetPanel);
    } catch (e) {
      console.warn(`Failed to load theme "${this.context.display.theme}".`, e);
    }

    // done
    reportButton.className = classes.join(' ');
    document.body.appendChild(reportButton);

    let relatedIssuesBadge = document.createElement('div');
    relatedIssuesBadge.classList.add('badge');
    relatedIssuesBadge.classList.add('related');
    relatedIssuesBadge.title = '跟我有關的問題';
    relatedIssuesBadge.style.display = 'none';
    reportButton.appendChild(relatedIssuesBadge);
    this.relatedIssuesBadge = relatedIssuesBadge;
    this.setRelatedIssuesCount(0);

    let createdIssuesBadge = document.createElement('div');
    createdIssuesBadge.classList.add('badge');
    createdIssuesBadge.classList.add('created');
    createdIssuesBadge.title = '我回報的問題';
    createdIssuesBadge.style.display = 'none';
    reportButton.appendChild(createdIssuesBadge);
    this.createdIssuesBadge = createdIssuesBadge;
    this.setCreatedIssuesCount(0);

    let loginButton = document.createElement('div');
    loginButton.classList.add('login');
    loginButton.title = '登入 Rakr';
    loginButton.innerHTML = require('./ic_account_circle_black_24px.svg');
    loginButton.style.display = 'none';
    reportButton.appendChild(loginButton);
    this.loginButton = loginButton;

    this.reportButton = reportButton;
  }

  public reportButtonOnClick(onclick: (event: MouseEvent) => any) {
    this.reportButton.onclick = onclick;
  }

  public loginButtonOnClick(onclick: (event: MouseEvent) => any) {
    this.loginButton.onclick = onclick;
  }

  public relatedIssuesBadgeOnClick(onclick: (event: MouseEvent) => any) {
    this.relatedIssuesBadge.onclick = onclick;
  }

  public createdIssuesBadgeOnClick(onclick: (event: MouseEvent) => any) {
    this.createdIssuesBadge.onclick = onclick;
  }

  public loginButtonShow() {
    this.loginButton.style.display = null;
  }

  public loginButtonHide() {
    this.loginButton.style.display = 'none';
  }

  public show(): void {
    this.reportButton.hidden = false;
  }

  public hide(): void {
    this.reportButton.hidden = true;
  }

  public setRelatedIssuesCount(count: number): void {
    this.relatedIssuesBadge.innerText = count.toString();
    this.relatedIssuesBadge.style.display = count > 0 ? null : 'none';
  }

  public setCreatedIssuesCount(count: number): void {
    this.createdIssuesBadge.innerText = count.toString();
    this.createdIssuesBadge.style.display = count > 0 ? null : 'none';  }
}
