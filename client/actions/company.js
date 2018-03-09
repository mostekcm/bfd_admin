import * as constants from '../constants';
import axios from 'axios';

const baseUrl = window.config.BASE_API_URL;

/*
 * Search for companies.
 */
export function fetchCompanies() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_COMPANIES,
      payload: {
        promise: axios.get(`${baseUrl}/api/companies`, {
          responseType: 'json'
        })
      }
    });
  };
}
