import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { routeActions } from 'redux-simple-router';

import * as constants from '../constants';
import { show, parseHash } from '../utils/lock';

export function login(returnUrl) {
  show(returnUrl);

  return {
    type: constants.SHOW_LOGIN
  };
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    if (window.location.hash) {
      dispatch({
        type: constants.LOGIN_PENDING
      });
      parseHash(window.location.hash)
        .then((tokens) => {
          if (!tokens) {
            /* Must be a bad authorization */
            dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: 'Unauthorized'
              }
            });
            dispatch(routeActions.push('/login'));
            return;
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
            dispatch(routeActions.push('/login'));
            return;
          }

          const decodedAccessToken = jwtDecode(accessToken);
          if (isExpired(decodedAccessToken)) {
            dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: 'Expired Token'
              }
            });
            dispatch(routeActions.push('/login'));
            return;
          }

          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          dispatch({
            type: constants.LOADED_TOKEN,
            payload: {
              token: idToken
            }
          });

          dispatch({
            type: constants.LOGIN_SUCCESS,
            payload: {
              token: idToken,
              decodedToken,
              user: decodedToken
            }
          });
        });
    }
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
