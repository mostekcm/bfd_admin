import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestUpdateShippedDate(order) {
  return {
    type: constants.REQUEST_UPDATE_SHIPPED_DATE,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelUpdateShippedDate() {
  return {
    type: constants.CANCEL_UPDATE_SHIPPED_DATE
  };
}

/*
 * Change username.
 */
export function updateShippedDate(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SHIPPED_DATE,
      meta: {
        orderId,
        onSuccess: () => {
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, { shippedDate: data }, { responseType: 'json' })
      }
    });
  };
}
