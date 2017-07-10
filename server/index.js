import morgan from 'morgan';
import Express from 'express';
import forceSSL from 'express-force-ssl';

import bodyParser from 'body-parser';
import { middlewares } from 'auth0-extension-express-tools';

import htmlRoute from './routes/html';
import silentCallbackRoute from './routes/silentCallback';
import config from './lib/config';
import logger from './lib/logger';

module.exports = (cfg) => {
  config.setProvider(cfg);

  const app = new Express();

  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  if (false && config('NODE_ENV') !== 'development') {
    app.set('forceSSLOptions', {
      enable301Redirects: true,
      trustXFPHeader: false,
      httpsPort: 443,
      sslRequiredMessage: 'SSL Required.'
    });

    app.use(function(req, res, next) {
      if (!req.connection.encrypted) forceSSL(req, res, next);
      else next();
    });
  }

  // Configure routes.

  app.use('/app', Express.static(config('STATIC_DIR')));

  app.use('/silent-callback', silentCallbackRoute());

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(middlewares.errorHandler(logger.error));

  return app;
};
