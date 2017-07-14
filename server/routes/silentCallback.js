import ejs from 'ejs';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';

export default () => {
  const template = `<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.auth0.com/js/auth0/8.0.4/auth0.min.js"></script>
    <script type="text/javascript">
      var webAuth = new auth0.WebAuth({
        domain: '<%- domain %>',
        clientID: '<%- clientId %>'
      });
      var result = webAuth.parseHash(window.location.hash, function(err, data) {
        parent.postMessage(err || data, "<%- baseUrl %>");
      });
    </script>
  </head>
  <body></body>
</html>

  `;

  return (req, res) => {
    // Render the html page.
    console.log(urlHelpers.getBaseUrl(req));
    return res.send(ejs.render(template, { baseUrl: config('BASE_URL'), domain: config('AUTH0_DOMAIN'), clientId: config('AUTH0_CLIENT_ID') }));
  };
};
