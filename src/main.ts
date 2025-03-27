/**
 *
 *
 *
 */
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { configureMiddlewares } from '@work-whiz/middlewares';
import { startServer } from './server';

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const app: Application = express();

const PORT = Number(process.env.PORT) || 8080;

/**
 * Configures middlewares for the Express application.
 * @param {Application} app - The Express application instance.
 */
configureMiddlewares(app);

/**
 * Starts the Express server.
 * @param {Application} app - The Express application instance.
 * @param {number} port - The port number on which the server will listen.
 */
startServer(app, PORT);
