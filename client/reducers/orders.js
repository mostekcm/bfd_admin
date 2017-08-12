import _ from 'lodash';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  query: '',
  stores: [],
  records: [],
  total: 0
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_ORDERS_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      query: action.meta.search,
      records: action.meta.page === 0 ? [] : state.get('records')
    }),
  [constants.FETCH_ORDERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while retrieving list of orders: ${action.errorMessage}, ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`
    }),
  [constants.FETCH_ORDERS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    const stores = _(data).map(order => order.store).uniqBy(store => store.name).sortBy(store => store.name).value();
    return state.merge({
      loading: false,
      // total: data.total,
      // nextPage: action.meta.page + 1,
      records: state.get('records').concat(fromJS(data.map(order => ({
        ...order
      })))),
      stores: state.get('stores').concat(fromJS(stores))
    });
  }
});
