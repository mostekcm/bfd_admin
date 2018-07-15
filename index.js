const path = require('path');
const nconf = require('nconf');

const server = require('./server');
const logger = require('./server/lib/logger');


// Handle uncaught.
process.on('uncaughtException', (err) => {
  logger.error(err);
});

// Initialize configuration.
nconf
  .argv()
  .env()
  .file('./server/config.json')
  .defaults({
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3000,
    TITLE: 'Beauty Full Day LLC Order Management'
  });

const staticDir = nconf.get('STATIC_DIR');
if (!staticDir) throw new Error('Configuration is broken, no STATIC_DIR defined');

// Start the server.
const app = server(key => nconf.get(key), null);
const port = nconf.get('PORT');
app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Express listening on http://localhost:${port}`);
  }
});
