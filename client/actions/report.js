import axios from 'axios';
import { routeActions } from 'redux-simple-router';

import * as constants from '../constants';

// TODO: Grab from config from server
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
export function fetchCommissionDueReport() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_COMMISSION_DUE_REPORT,
      payload: {
        promise: axios.get(`${baseUrl}/api/reports/commission/due`, {
          responseType: 'json'
        })
      }
    });
  };
}
