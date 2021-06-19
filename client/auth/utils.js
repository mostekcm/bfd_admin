import { Auth0Client } from '@auth0/auth0-spa-js';
import Promise from 'bluebird';
const RETURN_TO = 'AUTH0_RETURN_TO';

let auth0Instance = null;

const getAuth0 = () => {
  if (window.config.AUTH0_CLIENT_ID && !auth0Instance) {
    auth0Instance = new Auth0Client({
      connection: 'google-oauth2',
      scope: 'openid profile picture name nickname email read:reports read:displays update:orders delete:orders' +
        ' create:orders read:orders' +
        ' read:cases sync:crm read:companies',
      redirect_uri: `${window.config.BASE_URL}/callback`,
      audience: window.config.BFD_AUDIENCE,
      domain: window.config.AUTH0_DOMAIN,
      client_id: window.config.AUTH0_CLIENT_ID,
      useRefreshTokens: true,
      cacheLocation: 'localstorage'
    });
  }

  return auth0Instance;
};

export const getBaseUrl = (location) => {
  const fullUrl = window.location.href;
  const index = fullUrl.indexOf(location.pathname);
  return fullUrl.substr(0, index);
};

export const a0Logout = (location) => {
  const webAuth = getAuth0();
  return webAuth.logout({ returnTo: window.config.BASE_URL });
};

const getReturnToFromLocation = location => (location && location.query && location.query.returnUrl);

export const getUser = async (location) => {
  const webAuth = getAuth0();
  if (!webAuth) {
    throw new Error('Unable to create webAuth.');
  }

  return {
    user: await webAuth.getUser(),
    returnTo: getReturnToFromLocation(location) || sessionStorage.getItem(RETURN_TO)
  }
};

export const handleRedirectCallback = async () => {
  const webAuth = getAuth0();
  if (!webAuth) {
    throw new Error('Unable to create webAuth.');
  }

  await webAuth.handleRedirectCallback();

  return getUser();
};

export const redirectLogin = async (location) => {
  const webAuth = getAuth0();
  if (!webAuth) {
    throw new Error('Unable to create webAuth.');
  }

  sessionStorage.setItem(RETURN_TO, getReturnToFromLocation(location) || '/');

  await webAuth.loginWithRedirect();
};

export const getTokenSilently = async () => {
  const webAuth = getAuth0();
  if (!webAuth) {
    throw new Error('Unable to create webAuth.');
  }

  return webAuth.getTokenSilently();
};
