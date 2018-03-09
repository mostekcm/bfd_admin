import _ from 'lodash';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_COMPANIES_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_COMPANIES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while retrieving list of companies: ${action.errorMessage}, ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`
    }),
  [constants.FETCH_COMPANIES_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      records: data
    });
  }
});
