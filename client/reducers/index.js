import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routeReducer } from 'redux-simple-router';

import { auth, hubSpot } from '../auth/reducers';
import cases from './cases';
import companies from './companies';
import displays from './displays';
import order from './order';
import orderCreate from './orderCreate';
import orderDelete from './orderDelete';
import orders from './orders';
import commissionDueReport from './commissionDueReport';
import showReport from './showReport';
import monthReport from './monthReport';
import packages from './packages';
import paymentsReport from './paymentsReport';
import shipmentsReport from './shipmentsReport';
import updateDates from '../orders/Dialogs/UpdateDates/reducer';
import updateDiscount from './updateDiscount';
import updateLineItems from './updateLineItems';
import updateShipping from '../orders/Dialogs/UpdateShipping/reducer';
import updateShippingInfo from '../orders/Dialogs/UpdateShippingInfo/reducer';
import updateDealStage from '../orders/Dialogs/UpdateDealStage/reducer';
import updatePayments from '../orders/Dialogs/UpdatePaymentInfo/reducer';
import payCommission from '../orders/Dialogs/PayCommission/reducer';
import payCommissions from './payCommissions';

function lastAction(state = null, action) {
  return action;
}

export default combineReducers({
  routing: routeReducer,
  auth,
  hubSpot,
  cases,
  companies,
  displays,
  lastAction,
  order,
  orderCreate,
  orderDelete,
  orders,
  showReport,
  monthReport,
  packages,
  paymentsReport,
  shipmentsReport,
  commissionDueReport,
  updateDates,
  updateDiscount,
  updateLineItems,
  updatePayments,
  payCommission,
  payCommissions,
  updateShipping,
  updateShippingInfo,
  updateDealStage,
  form: formReducer
});
