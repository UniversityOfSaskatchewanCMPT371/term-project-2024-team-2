import Dexie from 'dexie';
import Rollbar from 'rollbar';

/**
 * The LogObject is what gets stored for each log in IndexedDB.
 */
export type LogObject = {
  level: string;
  message: string;
  time?: number;
  id?: number;
};

/**
 * LogTableType specifies an option for which LogTable to perform an operation on.
 */
export enum LogTableType {
  info,
  error,
  test,
}

/**
 * LogAppender takes in logs and stores them for viewing in IndexedDB.
 */
export default class LogAppender extends Dexie {
  /**
   * infoTable holds logs of type info, warn, error, and critical.
   */
  private infoTable!: Dexie.Table<LogObject, number>;

  /**
   * errorTable holds logs of type error and critical.
   */
  private errorTable!: Dexie.Table<LogObject, number>;

  /**
   * testTable holds logs of type debug.
   */
  private testTable!: Dexie.Table<LogObject, number>;

  constructor() {
    super('loggingDB');

    if (this.infoTable) {
      this.infoTable.clear();
    }

    if (this.errorTable) {
      this.errorTable.clear();
    }

    if (this.testTable) {
      this.testTable.clear();
    }

    this.version(1).stores({
      infoTable: '++id',
      errorTable: '++id',
      testTable: '++id',
    });

    this.open();
  }

  /**
   * Append a log to a LogTable based on its level.
   * @param log The log to store.
   */
  async appendLog(log: LogObject) {
    if (log.level === 'info' || log.level === 'warning' || log.level === 'error' || log.level === 'critical') {
      await this.infoTable.add(log);
    }
    if (log.level === 'error' || log.level === 'critical') {
      await this.errorTable.add(log);
    }
    if (log.level === 'debug') {
      await this.testTable.add(log);
    }
  }

  /**
   * Get all the logs from a certain table.
   * @param logTableType The type of table to get logs from.
   */
  async getLogs(logTableType: LogTableType) {
    switch (logTableType) {
      case LogTableType.info:
        return this.infoTable.toArray();
      case LogTableType.error:
        return this.errorTable.toArray();
      case LogTableType.test:
        return this.testTable.toArray();
      default:
        throw new Error('Invalid LogTableType ENUM type');
    }
  }

  /**
   * Clear all the logs from a certain table.
   * @param logTableType The type of table to clear.
   */
  async clearLogs(logTableType: LogTableType) {
    switch (logTableType) {
      case LogTableType.info:
        this.infoTable.clear();
        break;
      case LogTableType.error:
        this.errorTable.clear();
        break;
      case LogTableType.test:
        this.testTable.clear();
        break;
      default:
        break;
    }
  }
}

export const logAppender = new LogAppender();
export const rollbarConfig: Rollbar.Configuration = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        // Set code_version to the project's release version to see it reflected in Rollbar.
        code_version: 'ID4.0.0',
        source_map_enabled: true,
      },
    },
  },
  transmit: import.meta.env.VITE_ROLLBAR_ENVIRONMENT === 'production',
  reportLevel: (import.meta.env.VITE_ROLLBAR_ENVIRONMENT === 'production') ? 'warning' : 'debug',
  onSendCallback: (
    _isUncaught: boolean,
    _args: Rollbar.LogArgument,
    payload: Rollbar.Payload,
  ) => {
    if (import.meta.env.VITE_ROLLBAR_ENVIRONMENT !== 'production') {
      logAppender.appendLog({
        level: payload.level,
        message: payload.body.message.body,
        time: payload?.client?.timestamp,
      }).then(); // Wait for the promise to return; can't 'await' since this isn't asynchronous.
    }
  },
};
