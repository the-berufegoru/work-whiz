import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

export const configureMiddlewares = (app: Application): void => {
  app.set('trust proxy', 1);

  // Helmet Configuration
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'];
  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    })
  );

  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging Configuration
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    const stream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    });
    app.use(morgan('combined', { stream }));
  }
};
