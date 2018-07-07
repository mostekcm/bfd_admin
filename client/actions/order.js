import axios from 'axios';
import moment from 'moment';
import { routeActions } from 'redux-simple-router';

import * as constants from '../constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Search for orders.
 */
export function fetchOrders(search = '', reset = false, page = 0, actionType) {
  return (dispatch) => {
    dispatch({
      type: actionType || constants.FETCH_ORDERS,
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
        search,
        page
      }
    });
  };
}

/*
 * Get Show Orders
 */
export function fetchShowOrders(show, year) {
  year = year || moment().year();
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_SHOW_ORDERS,
      payload: {
        promise: axios.get(`${baseUrl}/api/orders/show/${show}/${year}`, {
          responseType: 'json'
        })
      },
      meta: {
        show,
        year
      }
    });
  };
}

export function resetShowOrders(show, year) {
  return {
    type: constants.RESET_SHOW_ORDERS,
    meta: {
      show,
      year
    }
  }
}

/*
 * Create a order.
 */
export function createOrder(order, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.CREATE_ORDER,
      meta: {
        order: order,
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
export function updateOrder(orderId, data, onSuccess, actionType) {
  return (dispatch) => {
    dispatch({
      type: actionType || constants.UPDATE_ORDER,
      meta: {
        orderId,
        onSuccess: (response) => {
          if (onSuccess) {
            return onSuccess(response);
          }
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, data, {
          responseType: 'json'
        })
      },
      meta: {
        orderId,
        data
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

/*
 * Get confirmation to update discount.
 */
export function requestUpdateDiscount(order) {
  return {
    type: constants.REQUEST_UPDATE_DISCOUNT,
    order
  };
}

/*
 * Cancel the discount update.
 */
export function cancelUpdateDiscount() {
  return {
    type: constants.CANCEL_UPDATE_DISCOUNT
  };
}

/*
 * Change discount.
 */
export function updateDiscount(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_DISCOUNT,
      meta: {
        orderId,
        onSuccess: () => {
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, { discount: data }, { responseType: 'json' })
      }
    });
  };
}

/*
 * Sync Company.
 */
export function updateCompany(order) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_COMPANY,
      meta: {
        orderId: order.id,
        onSuccess: () => {
          dispatch(fetchOrderDetail(order.id));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${order.id}/company`, {}, { responseType: 'json' })
      }
    });
  };
}


/*
 * Get confirmation to update discount.
 */
export function requestUpdateLineItems(order) {
  return {
    type: constants.REQUEST_UPDATE_LINE_ITEMS,
    order
  };
}

/*
 * Cancel the discount update.
 */
export function cancelUpdateLineItems() {
  return {
    type: constants.CANCEL_UPDATE_LINE_ITEMS
  };
}

/*
 * Change username.
 */
export function updateLineItems(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_LINE_ITEMS,
      meta: {
        orderId,
        onSuccess: () => {
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, { lineItems: data }, { responseType: 'json' })
      }
    });
  };
}

/*
 * Get confirmation to update discount.
 */
export function requestUpdateDisplayItems(order) {
  return {
    type: constants.REQUEST_UPDATE_DISPLAY_ITEMS,
    order
  };
}

/*
 * Cancel the discount update.
 */
export function cancelUpdateDisplayItems() {
  return {
    type: constants.CANCEL_UPDATE_DISPLAY_ITEMS
  };
}

/*
 * Change username.
 */
export function updateDisplayItems(orderId, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_DISPLAY_ITEMS,
      meta: {
        orderId,
        onSuccess: () => {
          dispatch(fetchOrderDetail(orderId));
        }
      },
      payload: {
        promise: axios.patch(`${baseUrl}/api/orders/${orderId}`, { displayItems: data }, { responseType: 'json' })
      }
    });
  };
}