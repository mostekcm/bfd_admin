import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  nextShippedDate: null,
  nextShippingCost: null,
  nextDueDate: null,
  originalShippedDate: null,
  originalShippingCost: null,
  originalDueDate: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_SHIPPING_INFO]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      nextShippedDate: action.order.shippedDate,
      nextShippingCost: action.order.shipping,
      nextDueDate: action.order.dueDate,
      originalShippedDate: action.order.shippedDate,
      originalShippingCost: action.order.shipping,
      originalDueDate: action.order.dueDate,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_SHIPPING_INFO]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_SHIPPING_INFO_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_SHIPPING_INFO_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the shipping info: ${action.errorMessage}`
    }),
  [constants.UPDATE_SHIPPING_INFO_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
