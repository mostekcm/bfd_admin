import axios from 'axios';

import { fetchOrderDetail } from '../../../actions/order';
import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get confirmation to update shipping.
 */
export function requestUpdateDealStage(order) {
  return {
    type: constants.REQUEST_UPDATE_DEAL_STAGE,
    order
  };
}

/*
 * Cancel the shipping update.
 */
export function cancelUpdateDealStage() {
  return {
    type: constants.CANCEL_UPDATE_DEAL_STAGE
  };
}

/*
 * Change username.
 */
export function updateDealStage(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_DEAL_STAGE,
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
