export class ClientInfo {
  public get(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        userAgent: navigator.userAgent,
        resolutionViewport: `${window.innerWidth}×${window.innerHeight}`,
        resolutionScreen: `${window.screen.width}×${window.screen.height}`,
        colorDepth: screen.colorDepth,
        // Parse timezone from date string, ex: Thu May 19 2016 17:47:30 GMT+0800 (CST)
        timeZone: /\((.*)\)/.exec(new Date().toString())[1]
      })
    });
  }
}
