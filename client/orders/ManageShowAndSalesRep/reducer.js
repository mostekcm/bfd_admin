import { fromJS } from 'immutable';

import * as constants from './constants';
import createReducer from '../../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  message: null,
  orders: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_MANAGESHOW_ORDERS_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      orders: action.meta.page === 0 ? [] : state.get('orders')
    }),
  [constants.FETCH_MANAGESHOW_ORDERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      message: null,
      error: `An error occurred while retrieving list of orders: ${action.errorMessage}, ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`
    }),
  [constants.FETCH_MANAGESHOW_ORDERS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      message: null,
      orders: state.get('orders').concat(fromJS(data.map(order => ({
        ...order
      }))))
    });
  },
  [constants.UPDATE_MANAGESHOW_ORDER_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      error: null,
      message: null
    }),
  [constants.UPDATE_MANAGESHOW_ORDER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      message: null,
      error: `An error occurred while updating order: ${action.errorMessage}, ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`
    }),
  [constants.UPDATE_MANAGESHOW_ORDER_FULFILLED]: (state, action) => {
    const orders = state.get('orders').toJS();
    const order = _.find(orders, order => order.id === action.meta.orderId);
    _.assign(order, action.meta.data);
    return state.merge({
      loading: false,
      error: null,
      message: `successfully updated ${action.meta.orderId}`,
      orders: fromJS(orders)
    });
  }
});
