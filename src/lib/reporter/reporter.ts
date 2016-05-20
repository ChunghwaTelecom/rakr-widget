import * as html2canvas from 'html2canvas';

import {Context} from '../context';
import {HttpRequest} from '../utils/http-request';

export class Reporter {

  constructor(private context: Context) {
  }

  report(): Promise<String> {
    return html2canvas(window.document.body)
      .then((canvas) => {

        let data = JSON.stringify({
          imageDataUrls: [canvas.toDataURL()]
        });

        let url = this.context.resolveFullPath('/api/snippets');

        return HttpRequest.post(url, data);
      });
  }
}