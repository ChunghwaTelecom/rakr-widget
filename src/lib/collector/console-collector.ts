export class ConsoleCollector {

  private logs: LogEntry[] = [];
  private logsLimit = 50;

  constructor() {
    this.warpLogFunction('log', LogLevel.LOG);
    this.warpLogFunction('info', LogLevel.INFO);
    this.warpLogFunction('warn', LogLevel.WARN);
    this.warpLogFunction('error', LogLevel.ERROR);
  }

  private warpLogFunction(funcationName: string, level: LogLevel) {
    if (console && console[funcationName]) {
      let log = console[funcationName];

      console[funcationName] = (...args) => {
        log.apply(console, args);
        this.log(level, args);
      };
    }
  }

  public log(level: LogLevel, args: any[]): void {
    let log = new LogEntry();
    log.level = level;
    log.args = JSON.stringify(args);
    this.logs.push(log);

    while (this.logs.length > this.logsLimit) {
      this.logs.shift();
    }
  }

  public setLogsLimit(logsLimit) {
    this.logsLimit = logsLimit;
  }

  public getLogs(): Promise<LogEntry[]> {
    return new Promise((resolve, reject) => {
      resolve(this.logs);
    });
  }
}

export class LogEntry {
  timestamp: number;
  level: LogLevel;
  args: string;

  constructor() {
    this.timestamp = new Date().getTime();
  }
}

export enum LogLevel {
  LOG, INFO, WARN, ERROR
}
