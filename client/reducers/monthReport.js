import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  month: null,
  record: { }
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_MONTH_REPORT_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      month: action.meta.month
    }),
  [constants.FETCH_MONTH_REPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the month report: ${action.errorMessage}`
    }),
  [constants.FETCH_MONTH_REPORT_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  }
});
