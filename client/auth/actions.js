import axios from 'axios';
import moment from 'moment';
import uuid from 'uuid';
import queryString from 'querystring';
import { routeActions } from 'redux-simple-router';

import * as constants from './constants';
import { redirect, parseHash, a0Logout } from './utils';

const refreshTokens = (dispatch, getState, location) => {
  if (getState().auth.get('isRefreshing')) {
    return Promise.reject(new Error('Need to handle multi-request for refresh'));
  }

  dispatch({
    type: constants.REFRESH_PENDING
  });

  // eslint-ignore-line no-use-before-define
  return handleTokens(dispatch, getState, redirect(location, null, 'none'), location, true); // eslint-disable-line no-use-before-define
};

const dispatchSuccess = (dispatch, idToken, accessToken, decodedToken, expiresAt, returnTo) => dispatch({
  type: constants.LOGIN_SUCCESS,
  payload: {
    idToken,
    accessToken,
    decodedToken,
    expiresAt,
    user: decodedToken,
    returnTo
  }
});

const handleTokens = (dispatch, getState, getTokensPromise, location, refreshing) =>
  getTokensPromise
    .then((tokens) => {
      if (!tokens.idToken || !tokens.accessToken) {
        /* Must be a bad authorization */
        dispatch({
          type: constants.LOGIN_FAILED,
          payload: {
            error: 'Unauthorized'
          }
        });
        localStorage.clear();
        return dispatch(routeActions.push('/login'));
      }

      const idToken = tokens.idToken;
      const accessToken = tokens.accessToken;

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      axios.interceptors.request.use((config) => {
        /* Proactively refresh expired tokens rather than waiting for a 401 */
        const aboutToRequestTime = moment().unix();
        const expiresAt = getState().auth.get('expiresAt');

        if (aboutToRequestTime >= expiresAt) {
          // renewToken performs authentication using username/password saved in sessionStorage/localStorage
          return refreshTokens(dispatch, getState, location)
            .then(() => {
              config.headers.Authorization = axios.defaults.headers.common.Authorization;
              return config;
            });
        }

        return config;
      }, (error) => {
        Promise.reject(error);
      });

      axios.interceptors.response.use(response => response, (error) => {
        const value = error.response;

        if (value && value.status === 401 && value.data.message === 'TokenExpired') {
          // renewToken performs authentication using username/password saved in sessionStorage/localStorage
          return refreshTokens(dispatch, getState, location)
            .then(() => {
              error.config.headers.Authorization = axios.defaults.headers.common.Authorization;
              return axios.request(error.config);
            });
        }

        return Promise.reject(error);
      });

      const now = moment().unix();
      const expiresIn = tokens.expiresIn > 70 ? tokens.expiresIn - 60 : 10;
      const expiresAt = now + expiresIn;

      const user = JSON.parse(localStorage.getItem('profile'));
      user.iss = user.iss || 'https://unknown.com';

      tokens.expiresAt = expiresAt;
      localStorage.setItem('tokens', JSON.stringify(tokens));

      if (refreshing) {
        return dispatchSuccess(dispatch, idToken, accessToken, user, expiresAt, tokens.returnTo);
      }

      dispatchSuccess(dispatch, idToken, accessToken, user, expiresAt, tokens.returnTo);

      return dispatch(routeActions.push(tokens.returnTo));
    })
    .catch((err) => {
      console.error('Error Loading Credentials: ', err);
      localStorage.clear();
      if (err.error) {
        /* Check for login_required, otherwise just fail */
        if (err.error === 'login_required') {
          redirect(location, err.state); // do NOT pass 'none' for prompt
        } else {
          return dispatch({
            type: constants.LOGIN_FAILED,
            payload: {
              error: `${err.error}: ${err.error_description}`
            }
          });
        }
      }

      return dispatch({
        type: constants.LOGIN_FAILED,
        payload: {
          error: err.message
        }
      });
    });

export function login(location, prompt) {
  return (dispatch, getState) => {
    dispatch({
      type: constants.LOGIN_PENDING
    });
    return handleTokens(dispatch, getState, redirect(location, null, prompt), location);
  };
}

export function logout(location) {
  return (dispatch) => {
    localStorage.clear();
    sessionStorage.clear();

    return dispatch({
      type: constants.LOGOUT,
      payload: {
        promise: a0Logout(location)
      }
    });
  };
}

export function loadCredentials(location) {
  return (dispatch, getState) => {
    if (window.location.hash) {
      dispatch({
        type: constants.LOGIN_PENDING
      });
      return handleTokens(dispatch, getState, parseHash(window.location.hash), location);
    }

    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.expiresAt && tokens.expiresAt > moment().unix()) {
        dispatch({
          type: constants.LOGIN_PENDING
        });
        tokens.returnTo = location && location.query && location.query.returnUrl;
        return handleTokens(dispatch, getState, Promise.resolve(tokens), location);
      }
    } catch (e) {
      console.warn('error reading tokens: ', e.message);
    }

    return dispatch(login(location));
  };
}

export function getAccessLevel(onSuccess) {
  return {
    type: constants.FETCH_ACCESS_LEVEL,
    meta: {
      onSuccess
    },
    payload: {
      promise: axios.get('/api/me', {
        responseType: 'json'
      })
    }
  };
}

export function getAppSettings(onSuccess) {
  return {
    type: constants.FETCH_SETTINGS,
    meta: {
      onSuccess
    },
    payload: {
      promise: axios.get('/api/settings', {
        responseType: 'json'
      })
    }
  };
}

export function authorizeHubSpot() {
  const state = uuid.v4();
  window.localStorage.setItem(constants.AUTHORIZE_HUB_SPOT_STATE, state);

  window.location = `https://app.hubspot.com/oauth/authorize?${queryString.stringify({
    client_id: window.config.HUBSPOT_CLIENT_ID,
    redirect_uri: `${window.config.BASE_URL}/authorizeCrm?state=${state}`,
    scope: 'contacts'
  })}`;
}

export function exchangeHubSpotCode(query) {
  const baseUrl = window.config.BASE_API_URL;

  const oldState = window.localStorage.getItem(constants.AUTHORIZE_HUB_SPOT_STATE);
  window.localStorage.removeItem(constants.AUTHORIZE_HUB_SPOT_STATE);

  if (oldState && oldState !== query.state) {
    return {
      type: constants.AUTHORIZE_HUB_SPOT,
      payload: {
        promise: Promise.reject(new Error('state mismatch'))
      }
    }
  }

  return dispatch => ({
    type: constants.AUTHORIZE_HUB_SPOT,
    payload: {
      promise: axios.post(`${baseUrl}/api/crm/callback`, {
        code: query.code,
        state: query.state
      }, {
        responseType: 'json'
      })
        .then(() => dispatch(routeActions.push('/orders')))
    }
  });
}
