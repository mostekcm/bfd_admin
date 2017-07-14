import auth0Js from 'auth0-js';
import Promise from 'bluebird';
import crypto from 'crypto';
import base64url from 'base64url';

const NONCE_SESSION_NAME = 'AUTH0_LAST_NONCE';

/** Sync */
const getNonce = (returnTo) => {
  const nonce = base64url(crypto.randomBytes(64));
  sessionStorage.setItem(NONCE_SESSION_NAME, JSON.stringify({
    nonce,
    returnTo
  }));
  return nonce;
};

const checkNonce = (nonce) => {
  const storedNonceObj = JSON.parse(sessionStorage.getItem(NONCE_SESSION_NAME));
  const success = nonce === storedNonceObj.nonce;
  sessionStorage.setItem(NONCE_SESSION_NAME, '');
  return success && storedNonceObj.returnTo;
};

let auth0Instance = null;

const getAuth0 = () => {
  if (window.config.AUTH0_CLIENT_ID && !auth0Instance) {
    auth0Instance = new auth0Js.WebAuth({
      domain: window.config.AUTH0_DOMAIN,
      clientID: window.config.AUTH0_CLIENT_ID
    });
  }

  return auth0Instance;
};

export const getBaseUrl = (location) => {
  const fullUrl = window.location.href;
  const index = fullUrl.indexOf(location.pathname);
  return fullUrl.substr(0, index);
};

const processAuthResult = (authResult) => {
  const webAuth = getAuth0();
  const getUserInfo = Promise.promisify(webAuth.client.userInfo, { context: webAuth.client });

  return new Promise((resolve, reject) => {
    /* Validate state */
    const state = authResult.state;
    const returnTo = checkNonce(state);
    if (!returnTo) {
      return reject(new Error('The state is not a valid state, please re-initiate login'));
    }

    localStorage.setItem('apiToken', authResult.accessToken);

    /* TODO: Validate ID token */
    return resolve({ accessToken: authResult.accessToken, idToken: authResult.idToken, returnTo, expiresIn: authResult.expiresIn });
  })
    .then(tokens => getUserInfo(tokens.accessToken)
      .then((user) => {
        // Now you have the user's information
        localStorage.setItem('profile', user);
        return tokens;
      }));
};

export const parseHash = (hash) => {
  // initialize auth0
  const webAuth = getAuth0();
  const parseHashPromise = Promise.promisify(webAuth.parseHash, { context: webAuth });

  return parseHashPromise(hash)
    .then(authResult => processAuthResult(authResult));
};

export const a0Logout = (location) => {
  const webAuth = getAuth0();
  return webAuth.logout({ returnTo: getBaseUrl(location) });
};

export const redirect = (location, state, prompt) => {
  const webAuth = getAuth0();
  if (!webAuth) {
    throw new Error('Unable to create webAuth.');
  }


  // TODO, should we be validating the state nonce here?
  let returnTo = (location && location.query && location.query.returnUrl) || '/';
  if (state) {
    returnTo = checkNonce(state);
  }

  const nonce = getNonce(returnTo);

  /* Get base URL */

  const options = {
    redirectUri: `${window.config.BASE_URL}/login`,
    responseType: 'token id_token',
    audience: window.config.BFD_AUDIENCE,
    state: nonce,
    scope: 'openid profile email read:reports read:displays update:orders delete:orders create:orders read:orders' +
    ' read:cases',
    nonce
  };

  if (prompt) {
    // options.usePostMessage = true;
    options.redirectUri = `${window.config.BASE_URL}/silent-callback`;

    const renewAuth = Promise.promisify(webAuth.renewAuth, { context: webAuth });

    return renewAuth(options)
      .then(authResult => processAuthResult(authResult));
  }

  return webAuth.authorize(options);
};
