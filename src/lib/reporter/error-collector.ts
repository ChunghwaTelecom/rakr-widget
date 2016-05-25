import * as StackTrace from 'stacktrace-js';
import {StackFrame} from 'stacktrace-js';
import {ErrorDetail} from './snippet';

export class ErrorCollector {

  private errors: ErrorDetail[] = [];

  constructor() {
    let originErrorHandler: ErrorEventHandler;
    if (window.onerror) {
      originErrorHandler = window.onerror;
    }

    window.onerror = (message, source, lineNumber, columnNumber, error) => {
      if (error instanceof Error) {
        StackTrace.fromError(error).then(
          (frames) => {
            let detail = new ErrorDetail();
            detail.timestamp = Date.now();
            detail.message = message;
            detail.frames = frames;

            this.errors.push(detail);
          })
      } else {
        let detail = new ErrorDetail();
        detail.timestamp = Date.now();
        detail.message = message;
        detail.frames = []; // TODO find out how to privide more infomation

        this.errors.push(detail);
      }

      if (originErrorHandler) {
        originErrorHandler(message, source, lineNumber, columnNumber, error);
      }

      return false;
    };
  }

  public getErrors(): Promise<ErrorDetail[]> {
    return new Promise((resolve, reject) => {
      resolve(this.errors)
    });
  }
}
