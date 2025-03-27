import winston, { Logger, createLogger } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { config } from '@work-whiz/configs/config';

type Environment = 'development' | 'production';
type LoggerAccessToken = string;

/**
 * Logger utility class to create and manage loggers.
 * Implements the singleton pattern.
 */
class LoggerUtil {
  private static instance: LoggerUtil;

  /**
   * Gets the singleton instance of LoggerUtil.
   * @returns {LoggerUtil} The singleton instance.
   */
  public static getInstance(): LoggerUtil {
    if (!LoggerUtil.instance) {
      LoggerUtil.instance = new LoggerUtil();
    }
    return LoggerUtil.instance;
  }

  /**
   * Creates a logger based on the environment.
   * @param {LoggerAccessToken} accessToken - The access token for Logtail.
   * @returns {Logger} The created logger.
   */
  public createLogger(accessToken: LoggerAccessToken): Logger {
    const environment: Environment =
      (process.env.NODE_ENV as Environment) || 'development';

    const transports =
      environment === 'development'
        ? new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
              winston.format.json(),
              winston.format.prettyPrint()
            ),
          })
        : new LogtailTransport(new Logtail(accessToken));

    return createLogger({ transports });
  }
}

/**
 * The logger instance created using LoggerUtil.
 * @type {Logger}
 */
export const logger: Logger = LoggerUtil.getInstance().createLogger(
  config?.logger?.logtail.accessToken
);
