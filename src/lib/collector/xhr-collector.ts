import { XhrLog } from './xhr-log';
import { Context } from '../context';

export interface XhrCollector {
  get(): Promise<XhrLog[]>;
}

export class XHookXhrCollector implements XhrCollector {

  private logs: XhrLog[] = [];
  private logsLimit = 10;

  constructor(context: Context) {
    // import ... from ... clause will cause the xhook been load eagerly. 
    let xhook = <XHookStatic>require('xhook').xhook;

    xhook.before((request) => {
      let now = new Date().getTime();
      request['_xhrCreated'] = now;
    });

    xhook.after((request, response) => {
      if (request.url.startsWith(context.rakrUrl)) {
        // skip rakr requests

      } else {
        let now = new Date().getTime();
        let log = new XhrLog();

        log.created = request['_xhrCreated'];
        log.duration = now - log.created;

        log.headers = request.headers;
        log.method = request.method;
        log.url = request.url;

        log.status = response.status;

        this.log(log);
      }
    });
  }

  public log(log: XhrLog): void {
    this.logs.push(log);

    while (this.logs.length > this.logsLimit) {
      this.logs.shift();
    }
  }

  public setLogsLimit(logsLimit) {
    this.logsLimit = logsLimit;
  }

  public get(): Promise<XhrLog[]> {
    return new Promise((resolve, reject) => {
      resolve(this.logs);
    });
  }
}

export class NopXhrCollector implements XhrCollector {

  public get(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
}
