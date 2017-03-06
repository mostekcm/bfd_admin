import nonce from 'nonce';
import auth0Js from 'auth0-js';
import Promise from 'bluebird';

let lockInstance = null;

function getLock() {
  if (window.config.AUTH0_CLIENT_ID && !lockInstance) {
    lockInstance = new Auth0Lock(window.config.AUTH0_CLIENT_ID, window.config.AUTH0_DOMAIN);  // eslint-disable-line no-undef

    console.log("Carlos 1");
    lockInstance.on("authenticated", function(authResult) {
      console.log("Carlos 2");
      lockInstance.getUserInfo(authResult.accessToken, function(error, profile) {
        console.log("Carlos 3");
        if (error) {
          console.log("Carlos 4");
          throw new Error(error);
        }
        console.log("Carlos 5");

        localStorage.setItem('apiToken', authResult.accessToken);
        console.log("Carlos 6");
        localStorage.setItem('profile', JSON.stringify(profile));
        console.log("Carlos 7");
      });
    });

    //lockInstance.interceptHash();

    console.log("Carlos 8");
  }

  return lockInstance;
}

export function getProfile(token, callback) {
  // initialize lock
  console.log("Carlos 9");
  getLock();
  console.log("Carlos 10");
  localStorage.getItem('profile');
}

export function parseHash(hash) {
  // initialize lock
  console.log("Carlos 11");
  getLock();
  console.log("Carlos 12");
  //return localStorage.getItem('apiToken');

  const webAuth = new auth0Js.WebAuth({domain: window.config.AUTH0_DOMAIN, clientID: window.config.AUTH0_CLIENT_ID});
  const parseHashPromise = Promise.promisify(webAuth.parseHash, { context: webAuth });
  return parseHashPromise(hash)
    .then((authResult) => {
      'use strict';
      console.log("Carlos, authResult:", authResult);
      localStorage.setItem('apiToken', authResult.accessToken);
      return { accessToken: authResult.accessToken, idToken: authResult.idToken };
    })
    .catch((e) => {
      'use strict';
      console.error(e);
    });
}

export function show(returnUrl) {
  const lock = getLock();
  if (!lock) {
    throw new Error('Unable to create the Lock.');
  }

  console.log("Carlos, return url: ",returnUrl);

  lock.show({
    closable: false,
    callbackURL: `${window.config.BASE_URL}/login`,
    callbackOnLocationHash: true,
    auth: {
      params: {
        response_type: 'token id_token',
        audience: 'https://bfd_admin.beautyfullday.com/api/v1',
        state: returnUrl,
        scope: 'read:cases read:orders create:orders delete:orders update:orders',
        nonce: nonce()
      }
    }
  });
}
