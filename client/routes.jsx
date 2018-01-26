import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import RequireAuthentication from './auth/containers/RequireAuthentication';
import Login from './auth/containers/Login';
import AuthorizeCrm from './auth/containers/AuthorizeCrm';
import * as containers from './containers';
import PaymentReport from './containers/Reports/Payments';
import ShipmentReport from './containers/Reports/Shipments';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(containers.App)}>
      <IndexRedirect to="/orders" />
      <Route path="orders" component={containers.Orders} />
      <Route path="orders/:id" component={containers.Order} />
      <Route path="report/payments" component={PaymentReport} />
      <Route path="report/shipments" component={ShipmentReport} />
      <Route path="report/show/:name" component={containers.ShowReport} />
      <Route path="report/month/:month" component={containers.MonthReport} />
      <Route path="report/commission/due/:name" component={containers.CommissionDueReport} />
      <Route path="authorizeCrm" component={AuthorizeCrm} />
    </Route>
    <Route path="/login" component={Login} />
  </Router>;
