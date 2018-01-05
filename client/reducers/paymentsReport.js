import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_PAYMENTS_FORM]: state =>
    state.merge({
      ...initialState
    }),
  [constants.FETCH_PAYMENTS_REPORT_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true
    }),
  [constants.FETCH_PAYMENTS_REPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the payments report: ${action.errorMessage}`
    }),
  [constants.FETCH_PAYMENTS_REPORT_FULFILLED]: (state, action) => {
    const { data } = action.payload;

    return state.merge({
      loading: false,
      records: fromJS(data)
    });
  }
});
