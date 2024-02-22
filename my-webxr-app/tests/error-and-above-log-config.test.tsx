import * as log4js from 'log4js';
import * as fs from 'fs';
import logConfig from '../src/log-config';

describe('Logger Configuration', () => {
  let logger: log4js.Logger;

  beforeAll(() => {
    // Apply the config from the config file
    log4js.configure(logConfig);
    logger = log4js.getLogger();
  });

  it('should only log error and fatal message', (done) => {
    // Write log messages to log file (error-file-logger.log)
    logger.info('Test info message from ERROR and above log config test');
    logger.warn('Test warn message from ERROR and above log config test');
    logger.error('Test error message from ERROR and above log config test');
    logger.fatal('Test fatal message from ERROR and above log config test');

    // Read error-file-logger.log and check written log messages
    log4js.shutdown(() => {
      // Calling log4js.shutdown to make sure all the logs are written before
      // reading the log file.
      const errorLogContent = fs.readFileSync('../logs/error-file-logger.log', 'utf8');
      expect(errorLogContent).not.toContain('Test info message from ERROR and above log config test');
      expect(errorLogContent).not.toContain('Test warn message from ERROR and above log config test');
      expect(errorLogContent).toContain('Test error message from ERROR and above log config test');
      expect(errorLogContent).toContain('Test fatal message from ERROR and above log config test');

      done();
    });
  });
});
