interface RakrWindow extends Window {
  RakrWidgetObject: string;
}

declare var window: RakrWindow;

export class Context {

  rakrUrl: string;
  clientId: string;
  display: Context.Display;

  constructor() {
    this.settleMandatoryArguments();
    this.parseDisplayArguments();
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
    let positionArguments: string[] = this.findArgumentsQueue('position');
    if (positionArguments.length > 0) {
      let position = Context.Position[positionArguments[0]];
      if (position === undefined) {
        console.warn(`Unknown position value: "${positionArguments[0]}".`);
      } else {
        display.position = position;
      }
    }

    if (display.position === undefined) {
      display.position = Context.Position.BottomRight;
    }

    // parse "theme"
    let themeArguments: string[] = this.findArgumentsQueue('theme');
    if (themeArguments.length > 0 && !!themeArguments[0]) {
      display.theme = themeArguments[0].toLowerCase();
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
