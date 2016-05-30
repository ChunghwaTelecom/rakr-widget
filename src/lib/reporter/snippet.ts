import { ErrorDetail } from '../collector/error-detail';
import { XhrLog } from '../collector/xhr-log';
import { LogEntry } from  '../collector/console-collector';

export class Snippet {
  clientInfo: any;
  imageDataUrls: string[];
  errors: ErrorDetail[];
  xhrs: XhrLog[];
  logs: LogEntry[];
}
