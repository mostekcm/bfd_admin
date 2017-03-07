import nonce from 'nonce';
import auth0Js from 'auth0-js';
import Promise from 'bluebird';

let lockInstance = null;

function getLock() {
  if (window.config.AUTH0_CLIENT_ID && !lockInstance) {
    lockInstance = new Auth0Lock(window.config.AUTH0_CLIENT_ID, window.config.AUTH0_DOMAIN);  // eslint-disable-line no-undef
  }

  return lockInstance;
}

// export function getProfile(token, callback) {
//   // initialize lock
//   getLock();
//   localStorage.getItem('profile');
// }

export function parseHash(hash) {
  // initialize lock
  getLock();

  const webAuth = new auth0Js.WebAuth({
    domain: window.config.AUTH0_DOMAIN,
    clientID: window.config.AUTH0_CLIENT_ID
  });

  const getUserInfo = Promise.promisify(webAuth.client.userInfo, { context: webAuth.client });
  const parseHashPromise = Promise.promisify(webAuth.parseHash, { context: webAuth });
  return parseHashPromise(hash)
    .then((authResult) => {
      localStorage.setItem('apiToken', authResult.accessToken);
      return { accessToken: authResult.accessToken, idToken: authResult.idToken };
    })
    .then(tokens => getUserInfo(tokens.accessToken)
      .then((user) => {
        // Now you have the user's information
        localStorage.setItem('profile', user);
        return tokens;
      })
    );
}

export function show(returnUrl) {
  const lock = getLock();
  if (!lock) {
    throw new Error('Unable to create the Lock.');
  }

  lock.show({
    closable: false,
    callbackURL: `${window.config.BASE_URL}/login`,
    callbackOnLocationHash: true,
    auth: {
      params: {
        response_type: 'token id_token',
        audience: 'https://bfd_admin.beautyfullday.com/api/v1',
        state: returnUrl,
        scope: 'openid read:cases read:orders create:orders delete:orders update:orders',
        nonce: nonce()
      }
    }
  });
}
