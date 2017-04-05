import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  record: null,
  validationErrors: {}
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_CREATE_ORDER]: (state, action) =>
    state.merge({
      ...initialState
    })
      .merge({
        record: {
        }
      }),
  [constants.CANCEL_CREATE_ORDER]: state =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_ORDER_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      record: action.meta.order
    }),
  [constants.CREATE_ORDER_REJECTED]: (state, action) => {
    const errorMessage = action.error ? action.errorMessage : null;
    return state.merge({
      loading: false,
      validationErrors: {},
      error: `An error occurred while creating the order: ${errorMessage}`
    });
  },
  [constants.CREATE_ORDER_FULFILLED]: (state, action) =>
    state.merge({
      ...initialState
    })
});
