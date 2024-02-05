import * as log4js from "log4js";
import * as fs from 'fs';
import { logConfig } from '../src/log-config';

describe('Logger Configuration', () => {
    let logger;
    
    beforeAll(() => {
        // Apply the config from the config file
        log4js.configure(logConfig);
        // Define a logger of error category
        logger = log4js.getLogger('error');
    });

    it('should only log error and fatal message', (done) => {
        // Write log messages to log file (error-file-logger.log)
        logger.info('Test info message');
        logger.warn('Test warn message');
        logger.error('Test error message');
        logger.fatal('Test fatal message');

        // Read error-file-logger.log and check written log messages
        log4js.shutdown(() => {
        // Calling log4js.shutdown to make sure all the logs are written before 
        // reading the log file.
            const errorLogContent = fs.readFileSync('../logs/error-file-logger.log', 'utf8');
            expect(errorLogContent).not.toContain('Test info message');
            expect(errorLogContent).not.toContain('Test warn message');
            expect(errorLogContent).toContain('Test error message');
            expect(errorLogContent).toContain('Test fatal message');

            done();
        });
    });
});