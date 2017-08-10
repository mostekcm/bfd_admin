import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestPayCommission(order) {
  return {
    type: constants.REQUEST_PAY_COMMISSION,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelPayCommission() {
  return {
    type: constants.CANCEL_PAY_COMMISSION
  };
}

/*
 * Change username.
 */
export function payCommission(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.PAY_COMMISSION,
      meta: {
        orderId,
        commissions: data.commissions,
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
