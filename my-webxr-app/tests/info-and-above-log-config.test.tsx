import * as log4js from "log4js";
import * as fs from 'fs';
import { logConfig } from '../src/log-config';

describe('Logger Configuration', () => {
    let logger: log4js.Logger;

    beforeAll(() => {
        // Apply the config from the config file
        log4js.configure(logConfig);
        logger = log4js.getLogger();
    });

    it('should log message correctly', (done) => {
        // Write log messages to log file
        logger.info('Test info message from INFO and above log config test');
        logger.warn('Test warn message from INFO and above log config test');
        logger.error('Test error message from INFO and above log config test');
        logger.fatal('Test fatal message from INFO and above log config test');

        // Read log file and check the written log messages
        log4js.shutdown(() => {
            // Calling log4js.shutdown to make sure all the logs are written before
            // reading the log file.
            const infoLogContent = fs.readFileSync('../logs/info-file-logger.log', 'utf8');
            expect(infoLogContent).toContain('Test info message from INFO and above log config test');
            expect(infoLogContent).toContain('Test warn message from INFO and above log config test');
            expect(infoLogContent).toContain('Test error message from INFO and above log config test');
            expect(infoLogContent).toContain('Test fatal message from INFO and above log config test');

            done();
        });
    });
});