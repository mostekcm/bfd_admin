import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestUpdateDates(order) {
  return {
    type: constants.REQUEST_UPDATE_DATES,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelUpdateDates() {
  return {
    type: constants.CANCEL_UPDATE_DATES
  };
}

/*
 * Change username.
 */
export function updateDates(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_DATES,
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
