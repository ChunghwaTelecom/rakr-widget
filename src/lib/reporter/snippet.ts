export class Snippet {
  clientInfo: any;
  imageDataUrls: string[];
  errors: ErrorDetail[];
}

export class ErrorDetail {
  timestamp: number;
  message: string;
  frames: StackTrace.StackFrame[];
}
