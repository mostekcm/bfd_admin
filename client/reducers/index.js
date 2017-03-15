import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routeReducer } from 'redux-simple-router';

import auth from './auth';
import cases from './cases';
import displays from './displays';
import order from './order';
import orderCreate from './orderCreate';
import orderDelete from './orderDelete';
import orders from './orders';
import showReport from './showReport';
import updateDiscount from './updateDiscount';
import updateShipping from './updateShipping';

function lastAction(state = null, action) {
  return action;
}

export default combineReducers({
  routing: routeReducer,
  auth,
  cases,
  displays,
  lastAction,
  order,
  orderCreate,
  orderDelete,
  orders,
  showReport,
  updateDiscount,
  updateShipping,
  form: formReducer
});
