import { fromJS } from 'immutable';
import moment from 'moment';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

import { getEstimatedShipping } from '../../utils';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  record: {},
  paymentTerms: null,
  autoUpdateDueDate: false
};

export default createReducer(fromJS(initialState), {
  [constants.REQUEST_UPDATE_SHIPPING_INFO]: (state, action) =>
    state.merge({
      ...initialState,
      record: {
        orderId: action.order.id,
        shippedDate: action.order.shippedDate,
        dueDate: action.order.dueDate,
        shipping: action.order.shipping || getEstimatedShipping(action.order.totals.product)
      },
      autoUpdateDueDate: !action.order.shippedDate,
      paymentTerms: action.order.store.paymentTerms,
      requesting: true,
      error: !action.order.store.paymentTerms ? 'You must update the store before you can mark as shipped to get' +
        ' payment terms' : null
    }),
  [constants.CANCEL_UPDATE_SHIPPING_INFO]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_SHIPPING_INFO_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      record: action.meta.order
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
