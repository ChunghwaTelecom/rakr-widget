import {Context} from '../context';
import {HttpRequest} from '../utils/http-request';

import {Snippet} from './snippet.ts'

import {ScreenCapturer} from './screen-capturer';
import {ClientInfo} from './client-info';

export class Reporter {

  private screenCapturer = new ScreenCapturer()
  private clientInfo = new ClientInfo()

  constructor(private context: Context) {
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
    ]).then(() => {
      let url = this.context.resolveFullPath('/api/snippets');
      let data = JSON.stringify(snippet);
      return HttpRequest.post(url, data);
    });
  }
}
