export const logConfig = {
    appenders: {
        everything: { type: 'file', filename: '../logs/info-file-logger.log' },
        errors: { type: 'file', filename: '../logs/error-file-logger.log' }
    },
    categories: {
        default: { appenders: [ 'everything' , 'errors' ], level: 'info' }
    }
};