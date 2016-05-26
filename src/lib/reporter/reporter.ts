import {Context} from '../context';
import {HttpRequest} from '../utils/http-request';

import {Snippet} from './snippet.ts'

import {ScreenCapturer} from '../collector/screen-capturer';
import {ClientInfo} from '../collector/client-info';
import {ErrorCollector} from '../collector/error-collector';
import {XhrCollector, NopXhrCollector, XHookXhrCollector} from '../collector/xhr-collector';

export class Reporter {

  private screenCapturer = new ScreenCapturer();
  private clientInfo = new ClientInfo();
  private errorCollector = new ErrorCollector();
  private xhrCollector: XhrCollector = new NopXhrCollector();

  constructor(private context: Context) {
    setTimeout(() => {
      if (!window['Zone']) {
        // FIXME make it compatible with Angular 2
        console.log('Seems not runnings in Zone, using XHookXhrCollector to collect XHR information.');
        this.xhrCollector = new XHookXhrCollector();
      }
    }, 1000);
  }

  report(): Promise<String> {
    let snippet = new Snippet();

    return Promise.all([
      this.screenCapturer.capture()
        .then((canvas) => {
          snippet.imageDataUrls = [canvas.toDataURL()];
        })
      ,
      this.clientInfo.get()
        .then((clientInfo) => {
          snippet.clientInfo = clientInfo;
        })
      ,
      this.errorCollector.getErrors()
        .then((errors) => {
          snippet.errors = errors;
        })
      ,
      this.xhrCollector.get()
        .then((xhrLogs) => {
          snippet.xhrs = xhrLogs;
        })
    ]).then(() => {
      let url = this.context.resolveFullPath('/api/snippets');
      let data = JSON.stringify(snippet);
      return HttpRequest.post(url, data);
    });
  }
}
