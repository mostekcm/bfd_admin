import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  nextValue: null,
  originalValue: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_SHIPPING]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      nextValue: action.order.shipping,
      originalValue: action.order.shipping,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_SHIPPING]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_SHIPPING_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_SHIPPING_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the shipping: ${action.errorMessage}`
    }),
  [constants.UPDATE_SHIPPING_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
