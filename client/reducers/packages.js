import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_PACKAGES_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_PACKAGES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the packages: ${action.errorMessage}`
    }),
  [constants.FETCH_PACKAGES_FULFILLED]: (state, action) => {
    const result = action.payload.data;

    if (result.error) {
      return state.merge({
        loading: false,
        error: `A (${result.error}) error occurred while loading the packages: ${result.message}`
      });
    }

    return state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    });
  }
});
