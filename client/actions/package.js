import axios from 'axios';
import * as constants from '../constants';

export function fetchPackages() {
  const baseUrl = window.config.BASE_API_URL;

  return {
    type: constants.FETCH_PACKAGES,
    payload: {
      promise: axios.get(`${baseUrl}/api/packages`, {
        responseType: 'json'
      })
    }
  };
}
