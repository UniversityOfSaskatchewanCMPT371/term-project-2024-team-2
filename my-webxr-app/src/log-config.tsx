import * as log4js from "log4js";

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: '../../log/info-file-logger.log' },
        errors: { type: 'file', filename: '../../log/error-file-logger.log' }
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'info' },
        error: { appenders: [ 'everything', 'errors' ], level: 'error' }
    }
});