import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  commissions: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_PAY_COMMISSION]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      commissions: action.order.commissions,
      commissionInfo: action.order.totals.commissionInfo,
      requesting: true
    }),
  [constants.CANCEL_PAY_COMMISSION]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.PAY_COMMISSION_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      commissions: action.meta.commissions
    }),
  [constants.PAY_COMMISSION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while attempting to mark commissions paid: ${action.errorMessage}`
    }),
  [constants.PAY_COMMISSION_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
