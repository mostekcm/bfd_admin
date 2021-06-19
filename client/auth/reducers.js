import url from 'url';
import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  expiresAt: null,
  isRefreshing: false,
  isAuthenticated: false,
  isAuthenticating: false,
  issuer: null,
  idToken: null,
  accessToken: null,
  user: null,
  returnTo: null
};

export const auth = createReducer(fromJS(initialState), {
  [constants.LOGIN_PENDING]: state =>
    state.merge({
      ...initialState,
      isAuthenticating: true
    }),
  [constants.LOGIN_FAILED]: (state, action) =>
    state.merge({
      isAuthenticating: false,
      isRefreshing: false,
      isAuthenticated: false,
      error: action.payload.error || 'Unknown Error'
    }),
  [constants.LOGIN_SUCCESS]: (state, action) =>
    state.merge({
      isRefreshing: false,
      isAuthenticated: true,
      isAuthenticating: false,
      user: action.payload.user,
      returnTo: action.payload.returnTo
    }),
  [constants.LOGOUT_PENDING]: state =>
    state.merge({
      ...initialState,
      isAuthenticating: true,
      returnTo: '/'
    }),
  [constants.LOGOUT_REJECTED]: (state, action) =>
    state.merge({
      isAuthenticating: false,
      error: action.payload.error || 'Unknown Error'
    }),
  [constants.LOGOUT_SUCCESS]: state =>
    state.merge({
      isAuthenticating: false
    })
});

const hubSpotInit = {
  error: null,
  loading: false,
  loaded: false
};

export const hubSpot = createReducer(fromJS(hubSpotInit), {
  [constants.AUTHORIZE_HUB_SPOT_PENDING]: state =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.AUTHORIZE_HUB_SPOT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      loaded: false,
      error: action.payload.error || 'Unknown Error'
    }),
  [constants.AUTHORIZE_HUB_SPOT_SUCCESS]: (state, action) =>
    state.merge({
      loading: false,
      loaded: true
    })
});
