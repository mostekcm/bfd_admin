import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestUpdateShipping(order) {
  return {
    type: constants.REQUEST_UPDATE_SHIPPING,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelUpdateShipping() {
  return {
    type: constants.CANCEL_UPDATE_SHIPPING
  };
}

/*
 * Change username.
 */
export function updateShipping(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SHIPPING,
      meta: {
        orderId,
        onSuccess: () => {
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, { shipping: data }, { responseType: 'json' })
      }
    });
  };
}
