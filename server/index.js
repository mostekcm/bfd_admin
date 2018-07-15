import Express from 'express';
import morgan from 'morgan';

import bodyParser from 'body-parser';

import htmlRoute from './routes/html';
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

  // Configure routes.
  app.use('/app', Express.static(config('STATIC_DIR')));

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  return app;
};
