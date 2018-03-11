import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  nextDisplayItems: null,
  originalDisplayItems: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_DISPLAY_ITEMS]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      nextDisplayItems: JSON.parse(JSON.stringify(action.order.displayItems)),
      originalDisplayItems: action.order.displayItems,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_DISPLAY_ITEMS]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_DISPLAY_ITEMS_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_DISPLAY_ITEMS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the display items: ${action.errorMessage}`
    }),
  [constants.UPDATE_DISPLAY_ITEMS_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
