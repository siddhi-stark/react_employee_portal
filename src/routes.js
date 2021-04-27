import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './containers/dashboard/Dashboard/dashboard.component';
import Login from './containers/authentication/Login/login.component';
import ForgetPassword from './containers/authentication/Forget/forgetPassword.component';
import ResetPassword from './containers/authentication/Forget/resetPassword.component';
import DashboardNew from './components/Dashboard/dashboard.component';
import AllReports from './containers/Reports/allReports.component';
import Reports from './containers/Reports/reports.component';

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/login" exact component={Login} />
      <Route path="/forget-password" exact component={ForgetPassword} />
      <Route path="/password/reset/:token" exact component={ResetPassword} />
      <Route path="/projects" exact component={DashboardNew} />
      <Route path="/reports" exact component={AllReports} />
      <Route path="/daily-report" exact component={Reports} />
    </Switch>
  );
}

export default Routes;
