import axios from 'axios';
import { routeActions } from 'redux-simple-router';

import * as constants from '../constants';

// TODO: Grab from config from server
const baseUrl = 'http://localhost:3002';

/*
 * Search for orders.
 */
export function fetchOrders(search = '', reset = false, page = 0) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_ORDERS,
      payload: {
        promise: axios.get(`${baseUrl}/api/orders`, {
          params: {
            search,
            page
          },
          responseType: 'json'
        })
      },
      meta: {
        page
      }
    });
  };
}

/*
 * Create a order.
 */
export function createOrder(order, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.CREATE_ORDER,
      meta: {
        order,
        onSuccess: (payload) => {
          if (onSuccess) {
            onSuccess(payload);
          } else {
            dispatch(routeActions.push(`/orders/${payload.data.id}`));
          }
        }
      },
      payload: {
        promise: axios.post(`${baseUrl}/api/orders/`, order, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Show dialog to create a order.
 */
export function requestCreateOrder() {
  return (dispatch) => {
    dispatch({
      type: constants.REQUEST_CREATE_ORDER
    });
  };
}

/*
 * Cancel creating a order.
 */
export function cancelCreateOrder() {
  return {
    type: constants.CANCEL_CREATE_ORDER
  };
}

/*
 * Fetch the order details.
 */
export function fetchOrderDetail(orderId, onSuccess) {
  return {
    type: constants.FETCH_ORDER,
    meta: {
      orderId,
      onSuccess
    },
    payload: {
      promise: axios.get(`${baseUrl}/api/orders/${orderId}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Fetch the complete order object.
 */
export function fetchOrder(orderId) {
  return (dispatch) => {
    dispatch(fetchOrderDetail(orderId));
  };
}

/*
 * Update the order details.
 */
export function updateOrder(orderId, data, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_ORDER,
      meta: {
        orderId,
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.put(`${baseUrl}/api/orders/${orderId}`, data, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Get confirmation to delete a order.
 */
export function requestDeleteOrder(order) {
  return {
    type: constants.REQUEST_DELETE_ORDER,
    order
  };
}

/*
 * Cancel the delete process.
 */
export function cancelDeleteOrder() {
  return {
    type: constants.CANCEL_DELETE_ORDER
  };
}

/*
 * Delete order.
 */
export function deleteOrder() {
  return (dispatch, getState) => {
    const { orderId } = getState().orderDelete.toJS();
    dispatch({
      type: constants.DELETE_ORDER,
      payload: {
        promise: axios.delete(`${baseUrl}/api/orders/${orderId}`)
      },
      meta: {
        orderId,
        onSuccess: () => {
          dispatch(routeActions.push('/orders'));
        }
      }
    });
  };
}
