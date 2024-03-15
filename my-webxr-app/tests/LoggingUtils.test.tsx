import Rollbar from 'rollbar';
import { logAppender, LogTableType, rollbarConfig } from '../src/utils/LoggingUtils';

describe('Logger Configuration', () => {
  const rollbar = new Rollbar(rollbarConfig);

  it('should log message correctly', async () => {
    // Write log messages to log file
    rollbar.debug('Test info message from INFO and above log config test');
    rollbar.info('Test info message from INFO and above log config test');
    rollbar.warn('Test warn message from INFO and above log config test');
    rollbar.error('Test error message from INFO and above log config test');
    rollbar.critical('Test fatal message from INFO and above log config test');

    expect(logAppender.getLogs(LogTableType.info)).toContain('Test info message from INFO and above log config'
      + ' test');
    expect(logAppender.getLogs(LogTableType.error)).toContain('Test warn message from INFO and'
      + ' above'
      + ' log config test');
    expect(logAppender.getLogs(LogTableType.test)).toContain('Test error message from INFO and'
      + ' above log config test');
  });
});
