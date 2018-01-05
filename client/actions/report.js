import axios from 'axios';
import Promise from 'bluebird';

import * as constants from '../constants';
import { getPaidCommissionData } from '../orders/utils';

// Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Get Show Report.
 */
export function fetchShowReport(showName) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_SHOW_REPORT,
      payload: {
        promise: axios.get(`${baseUrl}/api/reports/show/${showName}`, {
          responseType: 'json'
        })
      },
      meta: {
        showName: showName
      }
    });
  };
}

/*
 * Get Month Report.
 */
export function fetchMonthReport(month) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_MONTH_REPORT,
      payload: {
        promise: axios.get(`${baseUrl}/api/reports/month/${month}`, {
          responseType: 'json'
        })
      },
      meta: {
        month: month
      }
    });
  };
}

/*
 * Get Commission Due Report.
 */
export function fetchCommissionDueReport(name) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_COMMISSION_DUE_REPORT,
      payload: {
        promise: axios.get(`${baseUrl}/api/reports/commission/due/${name}`, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Get Shipments Report
 */
export function fetchShipmentsByDate(startDate, endDate) {
  if (!startDate) startDate = moment().format('Y-m-d');
  const startDateQueryString = `startDate=${startDate}`;
  const endDateQueryString = endDate ? `&endDate=${endDate}` : '';
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_SHIPMENTS_REPORT,
      payload: {
        promise: axios.get(`${baseUrl}/api/reports/shipments?startDate=${startDateQueryString}${endDateQueryString}`, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Cancel downloading CSV.
 */
export function requestShipmentsForm() {
  return {
    type: constants.REQUEST_SHIPMENTS_FORM
  };
}

/*
 * Get Payments Report
 */
export function fetchPaymentsByDate(startDate, endDate) {
  if (!startDate) startDate = moment().format('Y-m-d');
  const startDateQueryString = `startDate=${startDate}`;
  const endDateQueryString = endDate ? `&endDate=${endDate}` : '';
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_PAYMENTS_REPORT,
      payload: {
        promise: axios.get(`${baseUrl}/api/reports/payments?startDate=${startDateQueryString}${endDateQueryString}`, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Cancel downloading CSV.
 */
export function requestPaymentsForm() {
  return {
    type: constants.REQUEST_PAYMENTS_FORM
  };
}



/*
 * Mark orders as paid
 */
export function payCommissions(payee, commissionReports, onSuccess) {
  return (dispatch) => {
    const orderData = [];
    const paidDate = moment().format('X');
    commissionReports.forEach(report => {
      report.orders.forEach(order => {

        const data = getPaidCommissionData(order.commissions, order.commissionInfo, payee, paidDate, order.id);

        orderData.push({ orderId: order.id, data });
      });
    });

    dispatch({
      type: constants.PAY_COMMISSIONS,
      meta: {
        payee,
        paidDate,
        commissionReports,
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchCommissionDueReport(payee));
        }
      },
      payload: {
        promise: Promise.mapSeries(orderData, info => axios.patch(`${baseUrl}/api/orders/${info.orderId}`, info.data, {
          responseType: 'json'
        }))
      }
    });
  };
}