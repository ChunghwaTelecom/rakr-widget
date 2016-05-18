import {Context} from '../context';

export class ReportButton {

  private reportButton: HTMLDivElement;

  constructor(private context: Context) {
    this.createButton();
  }

  /**
   * Create report button.
   */
  private createButton(): void {
    let reportButton: HTMLDivElement = document.createElement('div');
    reportButton.innerHTML = require('./report-button.html');

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

    this.reportButton = reportButton;
  }

  public onClick(onclick: (event: MouseEvent) => any) {
    this.reportButton.onclick = onclick;
  }

  public show(): void {
    this.reportButton.hidden = false;
  }

  public hide(): void {
    this.reportButton.hidden = true;
  }
}
