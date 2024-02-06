/**
 * Configuration object for log4js.
 *
 * This configuration object specifies how log4js should handle log messages. It includes two appenders for writing to
 * files ('everything' and 'errors') and two appenders for filtering log messages based on their level ('errorFilter'
 * and 'infoFilter').
 *
 * The 'everything' appender writes log messages to the file '../logs/info-file-logger.log'.
 * The 'errors' appender writes log messages to the file '../logs/error-file-logger.log'.
 *
 * The 'errorFilter' appender filters out any log messages below the 'error' level and sends them to the 'errors'
 * appender.
 * The 'infoFilter' appender filters out any log messages below the 'info' level and sends them to the 'everything'
 * appender.
 *
 * The 'default' category is configured to use both of these logLevelFilter appenders, and its level is set to 'debug'
 * to ensure that all log messages (including 'debug', 'info', 'warn', 'error', and 'fatal') are processed.
 *
 * Refer log config test files in src/tests to see logging example usage.
 */

export const logConfig = {
    appenders: {
        everything: { type: 'file', filename: '../logs/info-file-logger.log' },
        errors: { type: 'file', filename: '../logs/error-file-logger.log' },
        errorFilter: { type: 'logLevelFilter', appender: 'errors', level: 'error' },
        infoFilter: { type: 'logLevelFilter', appender: 'everything', level: 'info' }
    },
    categories: {
        default: { appenders: [ 'infoFilter', 'errorFilter' ], level: 'debug' }
    }
};