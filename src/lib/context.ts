interface RakrWindow extends Window {
  RakrWidgetObject: string;
}

declare var window: RakrWindow;

export class Context {

  rakrUrl: string;
  clientId: string;
  display: Context.Display;
  shortcuts: string[];

  constructor() {
    this.settleMandatoryArguments();
    this.parseDisplayArguments();

    this.shortcuts = this.findArgumentsQueue('shortcut');
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
      if (id.indexOf('RAKR-') === 0) {
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
    if (display.position === undefined) {
      display.position = Context.Position.BottomRight;
    }

    // parse "theme"
    let theme = this.findArgument('theme');
    if (!!theme) {
      display.theme = theme.toLowerCase();
    } else {
      display.theme = 'dark';
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
}

export module Context {
  export enum Position {
    TopRight,
    BottomRight,
    BottomLeft,
    TopLeft
  }

  export class Display {
    position: Context.Position;
    theme: string;
  }
}
