import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  options: null,
  report: { }
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_SALES_REPORT_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      options: action.meta.options
    }),
  [constants.FETCH_SALES_REPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the SALES report: ${action.errorMessage}`
    }),
  [constants.FETCH_SALES_REPORT_FULFILLED]: (state, action) => {
    const { data } = action.payload;

    return state.merge({
      loading: false,
      report: fromJS(data)
    });
  }
});
