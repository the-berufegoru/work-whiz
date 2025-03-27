/**
 * Interface representing the configuration settings.
 */
export interface IConfig {
  /**
   * Database configuration settings.
   */
  database: {
    postgres: {
      /** The name of the PostgreSQL database */
      databaseName: string;
      /** The username for accessing the PostgreSQL database */
      username: string;
      /** The password for accessing the PostgreSQL database */
      password: string;
      /** The host address of the PostgreSQL database */
      host: string;
    };
    redis: {
      /** The URI for connecting to the Redis instance */
      uri: string;
    };
  };
  /**
   * Logger configuration settings.
   */
  logger: {
    logtail: {
      /**
       * The Logtail access token.
       */
      accessToken: string;
    };
  };
}
