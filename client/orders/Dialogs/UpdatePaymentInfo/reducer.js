import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  totalCost: 0,
  payments: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_PAYMENTS]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      payments: action.order.payments,
      totalCost: action.order.totals.total,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_PAYMENTS]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_PAYMENTS_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      payments: action.meta.payments
    }),
  [constants.UPDATE_PAYMENTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the shipping info: ${action.errorMessage}`
    }),
  [constants.UPDATE_PAYMENTS_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
