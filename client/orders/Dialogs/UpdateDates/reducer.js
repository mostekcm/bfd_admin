import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  originalTargetShipDate: null,
  shippedDate: null,
  originalDate: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_DATES]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      originalTargetShipDate: action.order.targetShipDate,
      shippedDate: action.order.shippedDate,
      originalDate: action.order.date,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_DATES]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_DATES_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_DATES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the dates: ${action.errorMessage}`
    }),
  [constants.UPDATE_DATES_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
