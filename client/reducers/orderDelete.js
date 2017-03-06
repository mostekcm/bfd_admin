import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  orderName: null
};

export const orderDelete = createReducer(fromJS(initialState), {
  [constants.REQUEST_DELETE_ORDER]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.order_id,
      orderName: action.order.order_name || action.order.email,
      requesting: true
    }),
  [constants.CANCEL_DELETE_ORDER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_ORDER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_ORDER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while deleting the order: ${action.errorMessage}`
    }),
  [constants.DELETE_ORDER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
