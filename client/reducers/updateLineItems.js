import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  nextLineItems: null,
  originalLineItems: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_LINE_ITEMS]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      nextLineItems: JSON.parse(JSON.stringify(action.order.lineItems)),
      originalLineItems: action.order.lineItems,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_LINE_ITEMS]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_LINE_ITEMS_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_LINE_ITEMS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the discount: ${action.errorMessage}`
    }),
  [constants.UPDATE_LINE_ITEMS_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
