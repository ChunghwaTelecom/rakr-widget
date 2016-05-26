import * as StackTrace from 'stacktrace-js';
import { StackFrame } from 'stacktrace-js';
import { ErrorDetail } from './error-detail';

export class ErrorCollector {

  private errors: ErrorDetail[] = [];
  private errorsLimit = 5;

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

            this.logError(detail);
          })

      } else {
        let detail = new ErrorDetail();
        detail.timestamp = Date.now();
        detail.message = message;
        detail.frames = []; // TODO find out how to privide more infomation

        this.logError(detail);
      }

      if (originErrorHandler) {
        originErrorHandler(message, source, lineNumber, columnNumber, error);
      }

      return false;
    };
  }

  public logError(error: ErrorDetail) {
    this.errors.push(error);

    while (this.errors.length > this.errorsLimit) {
      this.errors.shift();
    }
  }

  public setErrorsLimit(errorsLimit) {
    this.errorsLimit = errorsLimit;
  }

  public getErrors(): Promise<ErrorDetail[]> {
    return new Promise((resolve, reject) => {
      resolve(this.errors)
    });
  }
}
