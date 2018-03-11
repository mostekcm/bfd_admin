import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';
import logger from '../lib/logger';

export default () => {
  const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <title><%= config.TITLE %></title>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />
  <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
  <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.<%= assets.version %>.css" /><% } %>
  <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.auth0.com/js/lock/10.11.0/lock.min.js"></script>
  <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
  <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
  <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
  <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
  <% if (assets.version) { %>
  <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.vendors.<%= assets.version %>.js"></script>
  <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.<%= assets.version %>.js"></script>
  <% } %>
</body>
</html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const settings = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('EXTENSION_CLIENT_ID'),
      BASE_URL: urlHelpers.getBaseUrl(req),
      BASE_PATH: urlHelpers.getBasePath(req),
      TITLE: config('TITLE'),
      BASE_API_URL: config('BASE_API_URL'),
      BFD_AUDIENCE: config('BFD_AUDIENCE'),
      HUBSPOT_CLIENT_ID: config('HUBSPOT_CLIENT_ID')
    };

    if (settings.BASE_URL.indexOf('ngrok') >= 0) {
      settings.BASE_URL = settings.BASE_URL.replace('http', 'https');
    }

    // Render from CDN.
    const clientVersion = config('CLIENT_VERSION');
    if (clientVersion) {
      logger.info('carlos: settings: ', settings);
      return res.send(ejs.render(template, {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          version: clientVersion
        }
      }));
    }

    // Render locally.
    return fs.readFile(config('MANIFEST_FILE'), 'utf8', (err, manifest) => {
      const locals = {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          app: 'bundle.js'
        }
      };

      if (!err && manifest) {
        locals.assets = {
          customCss: config('CUSTOM_CSS'),
          ...JSON.parse(manifest)
        };
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
