import * as log4js from 'log4js';
import * as fs from 'fs';
import path from 'path';

describe('Logger', () => {
    beforeAll(() => {
        // Import the logger configuration
        require('../src/log-config');
    });

    it('should write info and warn logs to info-file-logger.log', () => {
        const logger = log4js.getLogger();
        logger.info('Test info log');
        logger.warn('Test warn log');

        const logOutput = fs.readFileSync(path.resolve(__dirname, '../../log/info-file-logger.log'), 'utf8');
        expect(logOutput).toContain('Test info log');
        expect(logOutput).toContain('Test warn log');
    });

    it('should write error and fatal logs to both log files', () => {
        const logger = log4js.getLogger();
        logger.error('Test error log');
        logger.fatal('Test fatal log');

        const infoLogOutput = fs.readFileSync(path.resolve(__dirname, '../../log/info-file-logger.log'), 'utf8');
        const errorLogOutput = fs.readFileSync(path.resolve(__dirname, '../../log/error-file-logger.log'), 'utf8');

        expect(infoLogOutput).toContain('Test error log');
        expect(infoLogOutput).toContain('Test fatal log');
        expect(errorLogOutput).toContain('Test error log');
        expect(errorLogOutput).toContain('Test fatal log');
    });
});