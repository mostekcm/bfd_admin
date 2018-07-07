import * as orderActions from '../../actions/order';
import * as constants from './constants';
import axios from 'axios';

const baseUrl = window.config.BASE_API_URL;

export function fetchOrders(startDate) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_MANAGESHOW_ORDERS,
      payload: {
        promise: axios.get(`${baseUrl}/api/orders/date`, {
          params: {
            from: startDate
          },
          responseType: 'json'
        })
      },
      meta: {
        page: 0
      }
    });
  };
}

export function updateOrder(orderId, data, onSuccess) {
  return orderActions.updateOrder(orderId, data, onSuccess, constants.UPDATE_MANAGESHOW_ORDER);
}
