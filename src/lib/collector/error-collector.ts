import {Context} from '../context';
import * as StackTrace from 'stacktrace-js';
import { StackFrame } from 'stacktrace-js';
import { ErrorDetail } from './error-detail';

export class ErrorCollector {

  private errors: ErrorDetail[] = [];
  private errorsLimit = 5;

  constructor(_context: Context) {
    let originErrorHandler: ErrorEventHandler;
    if (window.onerror) {
      originErrorHandler = window.onerror;
    }

    window.onerror = (message, source, lineNumber, columnNumber, error) => {
      this.logError(error, message);

      if (originErrorHandler) {
        originErrorHandler(message, source, lineNumber, columnNumber, error);
      }

      return false;
    };

    _context.exposeFunction('logError', (error: Error, message?: string) => this.logError(error, message));
  }

  public logError(error: Error, message?: string) {
    let detail = new ErrorDetail();
    detail.timestamp = Date.now();
    detail.message = message;

    StackTrace.fromError(error).then(
      (frames) => {
        detail.frames = frames;
        this.appendError(detail);
      },
      () => {
        detail.frames = []; // TODO find out how to privide more infomation
        this.appendError(detail);
      })
  }

  private appendError(error: ErrorDetail) {
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
