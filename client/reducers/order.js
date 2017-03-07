import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  orderId: null,
  record: { }
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_ORDER_PENDING]: (state, action) =>
    state.merge({
      error: null,
      loading: true,
      orderId: action.meta.orderId
    }),
  [constants.FETCH_ORDER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the order: ${action.errorMessage}`
    }),
  [constants.FETCH_ORDER_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.order.order_id !== state.get('orderId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data.order)
    });
  }
});
