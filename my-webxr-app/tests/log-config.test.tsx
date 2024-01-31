import * as log4js from "log4js";
import * as fs from 'fs';
import { logConfig } from '../src/log-config';

describe('Logger Configuration', () => {
    let logger;

    // Apply the config from the config file
    beforeAll(() => {
        log4js.configure(logConfig);
        logger = log4js.getLogger();
    });

    it('should log message correctly', (done) => {
        logger.info('Test info message');
        logger.warn('Test warn message');
        logger.error('Test error message');
        logger.fatal('Test fatal message');

        log4js.shutdown(() => {
            const infoLogContent = fs.readFileSync('../logs/info-file-logger.log', 'utf8');
            expect(infoLogContent).toContain('Test info message');
            expect(infoLogContent).toContain('Test warn message');
            expect(infoLogContent).toContain('Test error message');
            expect(infoLogContent).toContain('Test fatal message');

            const errorLogContent = fs.readFileSync('../logs/error-file-logger.log', 'utf8');
            expect(errorLogContent).toContain('Test error message');
            expect(errorLogContent).toContain('Test fatal message');

            done();
        });
    });
});