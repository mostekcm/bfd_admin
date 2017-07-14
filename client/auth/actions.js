import axios from 'axios';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { routeActions } from 'redux-simple-router';

import * as constants from './constants';
import { redirect, parseHash, a0Logout } from './utils';

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

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
      if (!tokens) {
        /* Must be a bad authorization */
        dispatch({
          type: constants.LOGIN_FAILED,
          payload: {
            error: 'Unauthorized'
          }
        });
        return dispatch(routeActions.push('/login'));
      }

      const idToken = tokens.idToken;
      const accessToken = tokens.accessToken;
      const decodedToken = jwtDecode(idToken);
      if (isExpired(decodedToken)) {
        dispatch({
          type: constants.LOGIN_FAILED,
          payload: {
            error: 'Expired Token'
          }
        });
        return dispatch(routeActions.push('/login'));
      }

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

        if (value.status === 401 && value.data.message === 'TokenExpired') {
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

      if (refreshing) {
        return dispatchSuccess(dispatch, idToken, accessToken, decodedToken, expiresAt, tokens.returnTo);
      }

      dispatchSuccess(dispatch, idToken, accessToken, decodedToken, expiresAt, tokens.returnTo);

      return dispatch(routeActions.push(tokens.returnTo));
    })
    .catch((err) => {
      console.error('Error Loading Credentials: ', err);
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
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

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

    return Promise.resolve();
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
