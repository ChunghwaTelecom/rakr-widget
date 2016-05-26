declare function require(module: string): any;

declare module 'stacktrace-js' {
  export = StackTrace;
}

declare module 'xhook' {

  export var xhook: XHookStatic;
}

declare interface XHookStatic {

  /**
   * Modifying any property of the request object will modify the underlying XHR before it is sent.
   * 
   * To make the handler is asynchronous, just include the optional callback function, which accepts an optional response object.
   * 
   * To provide a fake response, return or callback() a response object.
   */
  before(handler: (request: XHookRequest, callback?: () => XHookResponse) => void, index?: number): void;

  /**
   * Modifying any property of the response object will modify the underlying XHR before it is received.
   * 
   * To make the handler is asynchronous, just include the optional callback function.
   */
  after(handler: (request: XHookRequest, response: XHookResponse, callback?: () => any) => void, index?: number): void;

  /**
   * Enables XHook (swaps out the native XMLHttpRequest class). XHook is enabled be default.
   */
  enable(): void;

  /**
   * Disables XHook (swaps the native XMLHttpRequest class back in).
   */
  disable(): void;
}

declare class XHookRequest {
  method: string;
  url: string;
  body: string;
  headers: { [name: string]: string; };
  timeout: number;
  type: string;
  withCredentials: string;
}

declare class XHookResponse {
  status: number;
  statusText: string;
  text: string;
  headers: { [name: string]: string };
  xml: any;
  data: any;
}
