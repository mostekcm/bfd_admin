import axios from 'axios';
import { routeActions } from 'redux-simple-router';

import * as constants from './constants';
import { redirectLogin, handleRedirectCallback, getTokenSilently, getUser, a0Logout } from './utils';

export function logout(location) {
  return (dispatch) => {
    sessionStorage.clear();
    sessionStorage.clear();

    return dispatch({
      type: constants.LOGOUT,
      payload: {
        promise: a0Logout(location)
      }
    });
  };
}

export function dispatchLoginSuccess(dispatch, payload) {
  dispatch({
    type: constants.LOGIN_SUCCESS,
    payload
  });

  axios.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${await getTokenSilently()}`;
    return config;
  }, async (error) => {
    throw error;
  });

  return dispatch(routeActions.push(payload.returnTo));
}

export function handleRedirect() {
  return async (dispatch, getState) => {
    try {
      const payload = await handleRedirectCallback();

      return dispatchLoginSuccess(dispatch, payload);
    } catch (e) {
      dispatch({
        type: constants.LOGIN_FAILED,
        payload: {
          error: e.getMessage()
        }
      })
    }
  };
}

export function redirectForLogin(location) {
  return async (dispatch, getState) => {
    dispatch({
      type: constants.LOGIN_PENDING
    });

    const payload = await getUser(location);

    // First check and see if we are already logged in
    if (payload.user) {
      return dispatchLoginSuccess(dispatch, payload);
    }

    try {
      await redirectLogin(location);
    } catch (e) {
      dispatch({
        type: constants.LOGIN_FAILED,
        error: e.getMessage()
      })
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

export function authorizeHubSpot() {
  const baseUrl = window.config.BASE_API_URL;
  axios.defaults.withCredentials = true;

  return {
    type: constants.AUTHORIZE_HUB_SPOT,
    meta: {
    },
    payload: {
      promise: axios.post(`${baseUrl}/crm/authorize`)
        .then(response => (window.location = response.data.url))
    }
  };
}
