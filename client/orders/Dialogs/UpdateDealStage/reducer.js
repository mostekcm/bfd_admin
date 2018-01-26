import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  orderId: null,
  shippedDate: null,
  originalDealStage: null,
  invoiceNumber: null
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_DEAL_STAGE]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.order.id,
      shippedDate: action.order.shippedDate,
      originalDealStage: action.order.dealStage,
      invoiceNumber: action.order.invoiceNumber,
      requesting: true
    }),
  [constants.CANCEL_UPDATE_DEAL_STAGE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_DEAL_STAGE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_DEAL_STAGE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the shipping info: ${action.errorMessage}`
    }),
  [constants.UPDATE_DEAL_STAGE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
