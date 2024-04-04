import Rollbar from 'rollbar';

/**
 * Generate an appropriate message, given a Rollbar log payload.
 * @param {Rollbar.Payload} payload the payload of the Rollbar log object.
 * @returns {string} a properly formatted message from the given payload.
 */
const generateLogMsg = ((payload: Rollbar.Payload): string => {
  // First case: a regular message
  if (payload?.body?.message?.body) {
    return payload.body.message.body;
  }

  // Second case: an exception
  if (payload?.body?.trace?.exception) {
    return `captured an error of type ${payload?.body?.trace?.exception?.class} with message: `
        + `${payload?.body?.trace?.exception?.message}`
        + `\nfrom: ${JSON.stringify(payload?.body?.trace?.frames, null, 2)}`;
  }

  // Otherwise, we don't know what kind of log this is; just sent it in JSON format.
  return JSON.stringify(payload.body);
}
);

/**
 * Define the configuration for Rollbar.
 */
export const rollbarConfig: Rollbar.Configuration = {
  // The access token to send logs to for Rollbar's API.
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  // The environment logs appear under.
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT,
  // Catch uncaught errors.
  captureUncaught: true,
  // Catch unhandled errors.
  captureUnhandledRejections: true,
  // Add custom versioning information to each reported log.
  payload: {
    client: {
      javascript: {
        // TODO: Set the project's release version to see it reflected in Rollbar's error stats
        code_version: 'ID5.0.0',
        source_map_enabled: true,
      },
    },
  },
  // Whether to transmit logs to the Rollbar API (only in production).
  transmit: import.meta.env.VITE_ROLLBAR_ENVIRONMENT === 'production',
  // What level of logs to report (warning+ in production; all in dev).
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
          console.log(`Rollbar@${payload.level}: ${generateLogMsg(payload)}`);
          break;
        case 'warning':
        case 'error':
        case 'critical':
          // eslint-disable-next-line no-console
          console.error(`Rollbar@${payload.level}: ${generateLogMsg(payload)}`);
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
