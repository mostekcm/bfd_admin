import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  paidDate: null,
  payee: null
};

export default createReducer(fromJS(initialState), {
  [constants.PAY_COMMISSIONS_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      payee: action.meta.payee,
      paidDate: action.meta.paidDate,
      commissionReports: action.meta.commissionReports
    }),
  [constants.PAY_COMMISSIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while attempting to pay the commissions for ${state.payee}: ${action.errorMessage}`
    }),
  [constants.PAY_COMMISSIONS_FULFILLED]: (state) => {
    return state.merge({
      loading: false
    });
  }
});
