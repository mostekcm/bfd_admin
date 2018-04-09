import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  show: null,
  year: moment().year(),
  records: [],
  total: 0
};

export default createReducer(fromJS(initialState), {
  [constants.RESET_SHOW_ORDERS]: (state, action) =>
    state.merge({
      ...initialState,
      loading: false,
      show: action.meta.show,
      year: action.meta.year || moment().year(),
      records: []
    }),
  [constants.FETCH_SHOW_ORDERS_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      show: action.meta.show,
      year: action.meta.year,
      records: []
    }),
  [constants.FETCH_SHOW_ORDERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while retrieving list of show orders: ${action.errorMessage}, ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`
    }),
  [constants.FETCH_SHOW_ORDERS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      records: state.get('records').concat(fromJS(data.map(order => ({
        ...order
      })))),
    });
  }
});
