import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import * as containers from './containers';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={containers.RequireAuthentication(containers.App)}>
      <IndexRedirect to="/orders" />
      <Route path="orders" component={containers.Orders} />
      <Route path="orders/:id" component={containers.Order} />
      <Route path="report/show/:name" component={containers.ShowReport} />
      <Route path="report/month/:month" component={containers.MonthReport} />
      <Route path="report/commission/due" component={containers.CommissionDueReport} />
    </Route>
    <Route path="/login" component={containers.Login} />
  </Router>;
