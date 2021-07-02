import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './containers/dashboard/Dashboard/dashboard.component';
import Login from './containers/authentication/Login/login.component';
import ForgetPassword from './containers/authentication/Forget/forgetPassword.component';
import ResetPassword from './containers/authentication/Forget/resetPassword.component';
import AllReports from './containers/Reports/allReports.component';
import Reports from './containers/Reports/reports.component';
import RightContainer from './components/RightContainer/RightContainer.component';
import Projects from './containers/Projects/Projects.component';
import Designation from './containers/Designations/designation.component';
import Employee from './containers/Employee/employee.component';
import MyReports from './containers/Reports/myReports.component';
import Profile from './containers/Profile/profile.component';
import ManagePassword from './containers/Profile/changePassword.component';
import TeamReport from './containers/Reports/teamReport.component';
import NotFound from './containers/not-found/notFound.component';
import Events from './containers/Events/events.component';
import Technology from './containers/Technology/technology.component';
import EmployeeList from './containers/Employee/employeeList.component';
import EmployeeTimesheet from './containers/Employee/employeeTimesheet.component';
import EditEmployee from './containers/Employee/editEmployee.component';
import Employees from './containers/Employees/Employees.component';
import Applications from './containers/Applications/applications.component';
import RecruitmentFileComponent from './containers/Recruitment/recruitmentFile.component';

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/login" exact component={Login} />
      <Route path="/forget-password" exact component={ForgetPassword} />
      <Route path="/password/reset/:token" exact component={ResetPassword} />
      <Route path="/reports" exact component={AllReports} />
      <Route path="/daily-report/:date/:id" exact component={Reports} />
      <Route path="/right" exact component={RightContainer} />
      <Route path="/projects" exact component={Projects} />
      <Route path="/designation" exact component={Designation} />
      <Route path="/employee" exact component={Employee} />
      <Route path="/report" exact component={MyReports} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/manage-password" exact component={ManagePassword} />
      <Route path="/team-report" exact component={TeamReport} />
      <Route path="/events" exact component={Events} />
      <Route path="/technology" exact component={Technology} />
      <Route path="/employee-list" exact component={EmployeeList} />
      <Route path="/emp-timesheet" exact component={EmployeeTimesheet} />
      <Route path="/edit-employee" exact component={EditEmployee} />
      <Route path="/employees" exact component={Employees} />
      <Route path="/applications" exact component={Applications} />
      <Route path="/batch-upload" exact component={RecruitmentFileComponent} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;
