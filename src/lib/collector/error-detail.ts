import { StackFrame } from 'stacktrace-js';

export class ErrorDetail {
  timestamp: number;
  message: string;
  frames: StackFrame[];
}
