import axios from 'axios';
import * as constants from '../constants';

export function fetchCases() {
  return {
    type: constants.FETCH_CASES,
    payload: {
      promise: axios.get('http://localhost:3002/api/cases', {
        responseType: 'json'
      })
    }
  };
}
