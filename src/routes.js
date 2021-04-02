import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './containers/dashboard/Dashboard/dashboard.component';
import Login from './containers/authentication/Login/login.component';

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/login" exact component={Login} />
    </Switch>
  );
}

export default Routes;
