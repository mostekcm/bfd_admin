import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_CASES_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_CASES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the cases: ${action.errorMessage}`
    }),
  [constants.FETCH_CASES_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
