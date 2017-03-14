import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  nextDiscount: null,
  originalDiscount: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_DISCOUNT]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      nextDiscount: action.order.discount,
      originalDiscount: action.order.discount,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_DISCOUNT]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_DISCOUNT_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_DISCOUNT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the discount: ${action.errorMessage}`
    }),
  [constants.UPDATE_DISCOUNT_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
