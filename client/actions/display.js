import axios from 'axios';
import * as constants from '../constants';


export function fetchDisplays() {
  const baseUrl = window.config.BASE_API_URL;

  return {
    type: constants.FETCH_DISPLAYS,
    payload: {
      promise: axios.get(`${baseUrl}/api/displays`, {
        responseType: 'json'
      })
    }
  };
}
