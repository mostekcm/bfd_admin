import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  showName: null,
  record: { }
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_SHOW_REPORT_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      showName: action.meta.showName
    }),
  [constants.FETCH_SHOW_REPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the show report: ${action.errorMessage}`
    }),
  [constants.FETCH_SHOW_REPORT_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.showName !== state.get('showName')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  }
});
