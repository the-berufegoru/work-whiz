import dotenv from 'dotenv';
import http from 'http';
import ip from 'ip';
import os from 'os';
import { logger } from '@work-whiz/utils';
import { sequelize } from '@work-whiz/libs';
import { Application } from 'express';

dotenv.config();

/**
 * Starts the HTTP server and connects to the database.
 *
 * @param {Application} app - The Express application.
 * @param {number} [port=8080] - The port number to listen on.
 * @returns {Promise<void>} - A promise that resolves when the server starts.
 */
export const startServer = async (
  app: Application,
  port = 8080
): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    const server: http.Server = http.createServer(app);

    server.listen(port, () => {
      logger.info({
        host: `http://${ip.address()}:${port}`,
        platform: os.platform(),
      });
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error('Failed to establish connection to database.', {
      error_name: error.constructor.name,
      error_message: `${error}`,
      error_stack: error.stack,
    });
    process.exit(1);
  }
};
