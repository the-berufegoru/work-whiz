import { IConfig } from '@work-whiz/interfaces';

const {
  POSTGRES_DATABASE_NAME,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  REDIS_URL,
  LOGTAIL_ACCESS_TOKEN,
} = process.env;

/**
 * Application configuration object.
 * @type {IConfig}
 */
export const config: IConfig = {
  database: {
    postgres: {
      databaseName: POSTGRES_DATABASE_NAME || '',
      username: POSTGRES_USERNAME || '',
      password: POSTGRES_PASSWORD || '',
      host: POSTGRES_HOST || '',
    },
    redis: {
      uri: REDIS_URL || '',
    },
  },
  logger: {
    logtail: {
      accessToken: LOGTAIL_ACCESS_TOKEN || '',
    },
  },
};
