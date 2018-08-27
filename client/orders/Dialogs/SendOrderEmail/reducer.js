import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  orderId: null,
  emailText: null,
  pdf: null,
  success: false
};

export default createReducer(fromJS(initialState), {
  [constants.CANCEL_SEND_ORDER_EMAIL]: (state, action) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUEST_SEND_ORDER_EMAIL_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      orderId: action.meta.orderId
    }),
  [constants.REQUEST_SEND_ORDER_EMAIL_REJECTED]: (state, action) =>
    state.merge({
      ...initialState,
      pdf: "garbage",
      error: `An error occurred while trying to generate a pdf: ${action.errorMessage}`
    }),
  [constants.REQUEST_SEND_ORDER_EMAIL_FULFILLED]: (state, action) => state.merge({
    pdf: action.payload
  }),
  [constants.SEND_ORDER_EMAIL_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      emailText: action.meta.emailText
    }),
  [constants.SEND_ORDER_EMAIL_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while sending the email: ${action.errorMessage}`
    }),
  [constants.SEND_ORDER_EMAIL_FULFILLED]: (state, action) => state.merge({
    ...initialState,
    success: true
  })
});
