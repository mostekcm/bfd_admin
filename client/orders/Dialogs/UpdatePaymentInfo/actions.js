import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestUpdatePayments(order) {
  return {
    type: constants.REQUEST_UPDATE_PAYMENTS,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelUpdatePayments() {
  return {
    type: constants.CANCEL_UPDATE_PAYMENTS
  };
}

/*
 * Change username.
 */
export function updatePayments(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_PAYMENTS,
      meta: {
        orderId,
        payments: data.payments,
        onSuccess: () => {
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, data, { responseType: 'json' })
      }
    });
  };
}
