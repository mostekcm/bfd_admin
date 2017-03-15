import axios from 'axios';
import { routeActions } from 'redux-simple-router';

import * as constants from '../constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

/*
 * Search for orders.
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
