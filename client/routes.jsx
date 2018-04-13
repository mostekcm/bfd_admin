import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import RequireAuthentication from './auth/containers/RequireAuthentication';
import Login from './auth/containers/Login';
import AuthorizeCrm from './auth/containers/AuthorizeCrm';
import * as containers from './containers';
import OrderPackingSlip from './containers/Orders/PackingSlip';
import PaymentReport from './containers/Reports/Payments';
import ShipmentReport from './containers/Reports/Shipments';
import ShowReport from './containers/Reports/Show';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(containers.App)}>
      <IndexRedirect to="/orders" />
      <Route path="orders" component={containers.Orders} />
      <Route path="orders/:id" component={containers.Order} />
      <Route path="orders/packing/:id" component={OrderPackingSlip} />
      <Route path="report/payments" component={PaymentReport} />
      <Route path="report/shipments" component={ShipmentReport} />
      <Route path="report/show(/:show/:year)" component={ShowReport} />
      <Route path="report/month/:month" component={containers.MonthReport} />
      <Route path="report/commission/due/:name" component={containers.CommissionDueReport} />
      <Route path="authorizeCrm" component={AuthorizeCrm} />
    </Route>
    <Route path="/login" component={Login} />
  </Router>;
