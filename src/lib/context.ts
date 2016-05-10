interface RakrWindow extends Window {
  RakrWidgetObject: string;
}

declare var window: RakrWindow;

export class Context {

  rakrUrl: string;
  clientId: string;

  constructor() {
    if (window.RakrWidgetObject && window[window.RakrWidgetObject].q && window[window.RakrWidgetObject].q[0]) {
      var argumentsQueue = window[window.RakrWidgetObject].q;
      var url = argumentsQueue[0][0];
      if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0)) {
        this.rakrUrl = url;
      }
      var id = argumentsQueue[0][1];
      if (id.indexOf('RAKR-') === 0) {
        this.clientId = id;
      }
    }

    if (!this.rakrUrl || !this.clientId) {
      throw new Error("Rakr Widget not initialized properly.");
    }
  }

  public resolveFullPath(path: string): string {
    return this.rakrUrl + path;
  }
}
