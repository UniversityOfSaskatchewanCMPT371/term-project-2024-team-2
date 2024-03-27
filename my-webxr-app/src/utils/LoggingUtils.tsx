import Rollbar from 'rollbar';

/**
 * Define the configuration for Rollbar.
 */
export const rollbarConfig: Rollbar.Configuration = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        // TODO: Set the project's release version to see it reflected in Rollbar's error stats
        code_version: 'ID5.0.0',
        source_map_enabled: true,
      },
    },
  },
  transmit: import.meta.env.VITE_ROLLBAR_ENVIRONMENT === 'production',
  reportLevel: (import.meta.env.VITE_ROLLBAR_ENVIRONMENT === 'production') ? 'warning' : 'debug',
  // This callback runs whenever something is logged in Rollbar. We can tie in our own custom
  // behaviour.
  onSendCallback: (
    _isUncaught: boolean,
    _args: Rollbar.LogArgument,
    payload: Rollbar.Payload,
  ) => {
    // Only capture logs on the client-side when NOT in production (in development/staging).
    if (import.meta.env.VITE_ROLLBAR_ENVIRONMENT !== 'production') {
      // These console statements relay the logs from Rollbar when NOT in production (in
      // development/staging).
      switch (payload.level) {
        case 'debug':
        case 'info':
          // eslint-disable-next-line no-console
          console.log(`Rollbar@${payload.level}: ${payload.body.message.body}`);
          break;
        case 'warning':
        case 'error':
        case 'critical':
          // eslint-disable-next-line no-console
          console.error(`Rollbar@${payload.level}: ${payload.body.message.body}`);
          break;
        default:
          break;
      }
    }
  },
};

/**
 * Define an instance of rollbar for use when not in React.
 * If in React, use the getRollbar() hook.
 */
export const rollbar = new Rollbar(rollbarConfig);
