export const logConfig = {
    appenders: {
        everything: { type: 'file', filename: '../logs/info-file-logger.log' },
        errors: { type: 'file', filename: '../logs/error-file-logger.log' }
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'info' },
        error: { appenders: ['errors'], level: 'error'}
    }
};

/*
Note: Must specify categories (default/errors) for logger so that the logs are 
    written to the correct log file. i.e, try to log info and/or warn with 
    errorLogger will get the logs written to none of two .log files.

Example use of logger:

    let defaultLogger = log4js.getLogger('default');
    let errorLogger = log4js.getLogger('errors');


    defaultLogger.info(' info message ');
    defaultLogger.warn(' warn message' );
    defaultLogger.error(' error message ');
    defaultLogger.fatal(' fatal message ');

    errorLogger.error(' error message ');
    errorLogger.fatal(' fatal message ');

The snipet above make sure error and fatal messages are in both log files,
while info and warn only appear in info-file-logger.log
*/
