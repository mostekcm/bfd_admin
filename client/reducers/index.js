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
import ordersForShow from './ordersForShow';
import commissionDueReport from './commissionDueReport';
import manageShowAndSalesRep from '../orders/ManageShowAndSalesRep/reducer';
import monthReport from './monthReport';
import packages from './packages';
import paymentsReport from './paymentsReport';
import sendOrderEmail from '../orders/Dialogs/SendOrderEmail/reducer';
import salesReport from './salesReport';
import shipmentsReport from './shipmentsReport';
import showReport from './showReport';
import updateCompany from './updateCompany';
import updateDates from '../orders/Dialogs/UpdateDatesAndNotes/reducer';
import updateDiscount from './updateDiscount';
import updateDisplayItems from './updateDisplayItems';
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
  manageShowAndSalesRep,
  order,
  orderCreate,
  orderDelete,
  orders,
  ordersForShow,
  salesReport,
  showReport,
  monthReport,
  packages,
  paymentsReport,
  sendOrderEmail,
  shipmentsReport,
  commissionDueReport,
  updateCompany,
  updateDates,
  updateDiscount,
  updateDisplayItems,
  updateLineItems,
  updatePayments,
  payCommission,
  payCommissions,
  updateShipping,
  updateShippingInfo,
  updateDealStage,
  form: formReducer
});
