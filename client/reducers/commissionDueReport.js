import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_COMMISSION_DUE_REPORT_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true
    }),
  [constants.FETCH_COMMISSION_DUE_REPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the commission due report: ${action.errorMessage}`
    }),
  [constants.FETCH_COMMISSION_DUE_REPORT_FULFILLED]: (state, action) => {
    const { data } = action.payload;

    return state.merge({
      loading: false,
      records: fromJS(data)
    });
  }
});
