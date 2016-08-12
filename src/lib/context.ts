const DEFAULT_NEW_ISSUE_PATH = '/issues/new/1';

interface RakrWindow extends Window {
  RakrWidgetObject: string;
}

declare var window: RakrWindow;

export class Context {


  rakrUrl: string;
  newIssuePath: string;
  clientId: string;
  display: Context.Display;
  shortcuts: string[];

  constructor() {
    this.settleMandatoryArguments();
    this.parseDisplayArguments();

    this.shortcuts = this.findArgumentsQueue('shortcut');
    this.newIssuePath = this.findArgument('newIssuePath') || DEFAULT_NEW_ISSUE_PATH;
  }

  private settleMandatoryArguments(): void {
    let rakrUrl: string, clientId: string;
    if (window.RakrWidgetObject && window[window.RakrWidgetObject].q && window[window.RakrWidgetObject].q[0]) {
      var argumentsQueue = window[window.RakrWidgetObject].q;
      var url = argumentsQueue[0][0];
      if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0)) {
        rakrUrl = url;
      }
      var id = argumentsQueue[0][1];
      if (id) {
        clientId = id;
      }
    }

    if (!rakrUrl || !clientId) {
      throw new Error("Rakr Widget not initialized properly.");
    }

    this.rakrUrl = rakrUrl;
    this.clientId = clientId;
  }

  private parseDisplayArguments(): void {
    let display = new Context.Display();

    // parse "position"
    let positionValue = this.findArgument('position');
    if (positionValue) {
      let position = Context.Position[positionValue];
      if (position === undefined) {
        console.warn(`Unknown position value: "${positionValue}".`);
      } else {
        display.position = position;
      }
    }

    // parse "theme"
    let theme = this.findArgument('theme');
    if (!!theme) {
      display.theme = theme.toLowerCase();
    }

    // parse "content"
    let content = this.findArgument('content');
    if (content) {
      display.content = content;
    }

    // done
    this.display = display;
  }

  private findArgumentsQueue(key: string): string[] {
    if (window.RakrWidgetObject && window[window.RakrWidgetObject].q) {
      var argumentsQueue = <string[][]>window[window.RakrWidgetObject].q;
      for (let args of argumentsQueue) {
        if (args[0] === key) {
          return (args.length === 1 ? [] : Array.apply(null, args).slice(1));
        }
      }
    }

    return [];
  }

  private findArgument(key: string): string {
    let args: string[] = this.findArgumentsQueue(key);
    if (args.length > 0) {
      return args[0];
    } else {
      return undefined;
    }
  }

  public resolveFullPath(path: string): string {
    return this.rakrUrl + path;
  }

  /**
   * Add function to the exposed object, say {@code window.rakr} by default.
   * 
   * @param name function name.
   * @param fn exposed function.
   */
  public exposeFunction(name: string, fn: Function): void {
    window[window.RakrWidgetObject][name] = fn;
  }
}

export module Context {
  export enum Position {
    TopRight,
    BottomRight,
    BottomLeft,
    TopLeft
  }

  export class Display {
    position: Context.Position = Context.Position.BottomRight;
    theme: string = 'dark';
    content: string = '回報到 Rakr';
  }
}
