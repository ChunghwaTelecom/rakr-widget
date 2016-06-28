import {Context} from '../context';

export class ReportButton {

  private reportButton: HTMLDivElement;
  private createdIssuesBadge: HTMLDivElement;
  private relatedIssuesBadge: HTMLDivElement;
  private loginButton: HTMLDivElement;

  constructor(private context: Context) {
    this.createButton();
  }

  /**
   * Create report button.
   */
  private createButton(): void {
    let reportButton: HTMLDivElement = document.createElement('div');

    reportButton.innerHTML = this.context.display.content;

    let classes = [];
    // base style class
    classes.push(require('./report-button.css').reportPanel);

    // position style class
    let positionClass;
    switch (this.context.display.position) {
      case Context.Position.BottomLeft:
        positionClass = require('./report-button.position.bottom-left.css').reportPanel;
        break;

      case Context.Position.TopLeft:
        positionClass = require('./report-button.position.top-left.css').reportPanel;
        break;

      case Context.Position.TopRight:
        positionClass = require('./report-button.position.top-right.css').reportPanel;
        break;

      case Context.Position.BottomRight:
      /* fallthrough */
      default:
        positionClass = require('./report-button.position.bottom-right.css').reportPanel;
    }

    classes.push(positionClass)

    // theme style class
    try {
      classes.push(require(`./report-button.theme.${this.context.display.theme}.css`).reportPanel);
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

  public onClick(onclick: (event: MouseEvent) => any) {
    this.reportButton.onclick = onclick;
  }

  public loginButtonOnClick(onclick: (event: MouseEvent) => any) {
    this.loginButton.onclick = onclick;
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
