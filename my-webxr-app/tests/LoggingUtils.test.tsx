import Rollbar from 'rollbar';
import { logAppender, LogTableType, rollbarConfig } from '../src/utils/LoggingUtils';

describe('Logger Configuration', () => {
  const rollbar = new Rollbar(rollbarConfig);

  // Ensure all tables are cleared
  beforeEach(async () => {
    await logAppender.clearLogs(LogTableType.info);
    await logAppender.clearLogs(LogTableType.error);
    await logAppender.clearLogs(LogTableType.test);
  });

  afterEach(async () => {
    await logAppender.clearLogs(LogTableType.info);
    await logAppender.clearLogs(LogTableType.error);
    await logAppender.clearLogs(LogTableType.test);
  });

  test('Local loggers should function correctly', async () => {
    // Write log messages to logger
    rollbar.debug('Test info message from INFO and above log config test');
    rollbar.info('Test info message from INFO and above log config test');
    rollbar.warn('Test warn message from INFO and above log config test');
    rollbar.error('Test error message from INFO and above log config test');
    rollbar.critical('Test fatal message from INFO and above log config test');

    // Verify each severity level is found in the correct type of logger.
    expect(await logAppender.getLogs(LogTableType.info)).toEqual([
      {
        level: 'info',
        message: 'Test info message from INFO and above log config test',
        time: undefined,
        id: 1,
      },
      {
        level: 'warning',
        message: 'Test warn message from INFO and above log config test',
        time: undefined,
        id: 2,
      },
      {
        level: 'error',
        message: 'Test error message from INFO and above log config test',
        time: undefined,
        id: 3,
      },
      {
        level: 'critical',
        message: 'Test fatal message from INFO and above log config test',
        time: undefined,
        id: 4,
      },
    ]);

    expect(await logAppender.getLogs(LogTableType.error)).toEqual([
      {
        level: 'error',
        message: 'Test error message from INFO and above log config test',
        time: undefined,
        id: 3,
      },
      {
        level: 'critical',
        message: 'Test fatal message from INFO and above log config test',
        time: undefined,
        id: 4,
      },
    ]);

    expect(await logAppender.getLogs(LogTableType.test)).toEqual([
      {
        level: 'debug',
        message: 'Test info message from INFO and above log config test',
        time: undefined,
        id: 1,
      },
    ]);
  });
});
