import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_DISPLAYS_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_DISPLAYS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the displays: ${action.errorMessage}`
    }),
  [constants.FETCH_DISPLAYS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
