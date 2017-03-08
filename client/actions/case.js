import axios from 'axios';
import * as constants from '../constants';


export function fetchCases() {
  const baseUrl = window.config.BASE_API_URL;

  return {
    type: constants.FETCH_CASES,
    payload: {
      promise: axios.get(`${baseUrl}/api/cases`, {
        responseType: 'json'
      })
    }
  };
}
