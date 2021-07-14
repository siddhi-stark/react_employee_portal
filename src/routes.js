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
import EmployeeTechListing from './containers/Employee Technology Stack/EmployeeTechListing.component';
import EmployeeList from './containers/Employee/employeeList.component';
import EmployeeTimesheet from './containers/Employee/employeeTimesheet.component';
import EditEmployee from './containers/Employee/editEmployee.component';
import Employees from './containers/Employees/Employees.component';
import Applications from './containers/Applications/applications.component';
import RecruitmentFileComponent from './containers/Recruitment/recruitmentFile.component';
import AddTechnologyStack from './containers/Employee Technology Stack/AddTechnologyStack.component';
import EmployeeProfile from './containers/Employees/EmployeeProfile.component';
import Confirmation from './containers/Employees/confirmation.component';
import InterviewerRoundStatus from './containers/Applications/InterviewerRoundsStatus.component';
import SelectedCandidate from './containers/Confirmation/SelectedCandidate.component';
import SelectedCandidateListing from './containers/Confirmation/SelectedCandidateListing.component';
import EmailTemplates from './containers/EmailTemplates/emailTemplates.component';
import RecruitmentApplication from './containers/Recruitment/recruitmentApplication.component';

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
      <Route path="/emp-stack" exact component={EmployeeTechListing} />
      <Route path="/employee-list" exact component={EmployeeList} />
      <Route path="/emp-timesheet" exact component={EmployeeTimesheet} />
      <Route path="/edit-employee/:employeeId" exact component={EditEmployee} />
      <Route path="/employees" exact component={Employees} />
      <Route path="/applications" exact component={Applications} />
      <Route path="/batch-upload" exact component={RecruitmentFileComponent} />
      <Route path="/add-technology-stack" exact component={AddTechnologyStack} />
      <Route path="/edit-technology-stack/:stackId" exact component={AddTechnologyStack} />
      <Route path="/employee-profile/:id" exact component={EmployeeProfile} />
      <Route path="/confirmation" exact component={Confirmation} />
      <Route path="/interviewer-round" exact component={InterviewerRoundStatus} />
      <Route path="/selected" exact component={SelectedCandidate} />
      <Route path="/candidate-listing" exact component={SelectedCandidateListing} />
      <Route path="/email-templates" exact component={EmailTemplates} />
      <Route path="/recruitment" exact component={RecruitmentApplication} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;
