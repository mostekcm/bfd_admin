import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  orderId: null
};

export default createReducer(fromJS(initialState), {
  [constants.SAVE_ORDER_PDF_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      orderId: action.meta.orderId
    }),
  [constants.SAVE_ORDER_PDF_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while saving the PDF: ${action.errorMessage}`
    }),
  [constants.SAVE_ORDER_PDF_FULFILLED]: (state, action) => state.merge({
      loading: false
    })
});
