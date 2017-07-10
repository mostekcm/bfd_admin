import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestUpdateShippingInfo(order) {
  return {
    type: constants.REQUEST_UPDATE_SHIPPING_INFO,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelUpdateShippingInfo() {
  return {
    type: constants.CANCEL_UPDATE_SHIPPING_INFO
  };
}

/*
 * Change username.
 */
export function updateShippingInfo(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SHIPPING_INFO,
      meta: {
        orderId,
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
