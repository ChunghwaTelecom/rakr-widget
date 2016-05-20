import {Context} from '../context';
import {HttpRequest} from '../utils/http-request';

import {ScreenCapturer} from './screen-capturer';

export class Reporter {

  constructor(private context: Context) {
  }

  report(): Promise<String> {
    return new ScreenCapturer().capture()
      .then((canvas) => {

        let data = JSON.stringify({
          imageDataUrls: [canvas.toDataURL()]
        });

        let url = this.context.resolveFullPath('/api/snippets');

        return HttpRequest.post(url, data);
      });
  }
}