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
  [constants.REQUEST_UPDATE_SHIPPED_DATE]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      nextValue: action.order.shippedDate,
      originalValue: action.order.shippedDate,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_SHIPPED_DATE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_SHIPPED_DATE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_SHIPPED_DATE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the shippedDate: ${action.errorMessage}`
    }),
  [constants.UPDATE_SHIPPED_DATE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
