import { ErrorDetail } from '../collector/error-detail';
import { XhrLog } from '../collector/xhr-log';

export class Snippet {
  clientInfo: any;
  imageDataUrls: string[];
  errors: ErrorDetail[];
  xhrs: XhrLog[];
}
