import fs from 'fs';
import ejs from 'ejs';

import config from '../lib/config';
import logger from '../lib/logger';

const url = require('url');

const getBasePathBase = function(originalUrl, path) {
  var basePath = url.parse(originalUrl).pathname || '';
  basePath = basePath.replace(path, '')
    .replace(/^\/|\/$/g, '');
  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }
  return basePath;
};

const getBasePath = function(req) {
  return getBasePathBase(req.originalUrl || '', req.path);
};

const getBaseUrl = function(req, protocol) {
  var urlProtocol = protocol;

  const originalUrl = url.parse(req.originalUrl || '').pathname || '';
  if (!urlProtocol && process.env.NODE_ENV === 'development') {
    urlProtocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  }
  logger.info(`Url Protocol: ${originalUrl}, ${req.headers['x-forwarded-proto']}, ${req.protocol}, ${urlProtocol}`);
  return url.format({
    protocol: urlProtocol || 'https',
    host: req.headers.host,
    pathname: originalUrl.replace(req.path, '').replace(/\/$/g, '')
  });
};

export default () => {
  const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <title><%= config.TITLE %></title>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="/app/css/zocial.css" />
  <link rel="stylesheet" type="text/css" href="/app/css/auth0-manage.0.3.1672.css" />
  <link rel="stylesheet" type="text/css" href="/app/css/auth0-styleguide.4.6.13.css" />
  <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
</head>
<body>
  <div id="app"></div>
  <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
  <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
  <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
</body>
</html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const settings = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('AUTH0_CLIENT_ID'),
      BASE_URL: getBaseUrl(req),
      BASE_PATH: getBasePath(req),
      TITLE: config('TITLE'),
      BASE_API_URL: config('BASE_API_URL'),
      BFD_AUDIENCE: config('BFD_AUDIENCE'),
      HUBSPOT_CLIENT_ID: config('HUBSPOT_CLIENT_ID')
    };

    // Render locally.
    const locals = {
      config: settings,
      assets: {
        app: 'client.js',
        style: 'main.css'
      }
    };

    // Render the HTML page.
    res.send(ejs.render(template, locals));
  };
};
