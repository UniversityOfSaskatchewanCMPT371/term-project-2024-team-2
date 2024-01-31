import * as log4js from 'log4js';

jest.mock('log4js', () => ({
    configure: jest.fn(),
}));

describe('log4js configuration', () => {
    it('should configure log4js correctly', () => {
        require('../src/log-config');

        expect(log4js.configure).toHaveBeenCalledWith({
            appenders: {
                everything: { type: 'file', filename: '../../log/info-file-logger.log' },
                errors: { type: 'file', filename: '../../log/error-file-logger.log' }
            },
            categories: {
                default: { appenders: [ 'everything' ], level: 'info' },
                error: { appenders: [ 'everything', 'errors' ], level: 'error' }
            }
        });
    });
});