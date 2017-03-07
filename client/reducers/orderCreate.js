import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  record: null,
  loading: false,
  validationErrors: { }
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_CREATE_ORDER]: state =>
    state.merge({
      ...initialState,
      record: {
      }
    }),
  [constants.CANCEL_CREATE_ORDER]: state =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_ORDER_PENDING]: state =>
    state.merge({
      loading: true
    }),
  [constants.CREATE_ORDER_REJECTED]: (state, action) => {
    const errorMessage = action.error ? action.errorMessage : null;
    return state.merge({
      loading: false,
      validationErrors: {},
      error: `An error occurred while creating the order: ${errorMessage}`
    });
  },
  [constants.CREATE_ORDER_FULFILLED]: state =>
    state.merge({
      ...initialState
    })
});
