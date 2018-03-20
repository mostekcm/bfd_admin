import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false
};

export default createReducer(fromJS(initialState), {
  [constants.UPDATE_COMPANY_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_COMPANY_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the company: ${action.errorMessage}`
    }),
  [constants.UPDATE_COMPANY_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
