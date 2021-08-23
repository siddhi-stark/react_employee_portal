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
import SelectedCandidate from './containers/Confirmation/SelectedCandidate.component';
import SelectedCandidateListing from './containers/Confirmation/SelectedCandidateListing.component';
import EmailTemplates from './containers/EmailTemplates/emailTemplates.component';
import RecruitmentApplication from './containers/Recruitment/recruitmentApplication.component';
import InterviewerRoundStatus from './containers/Applications/InterviewerRoundsStatus.component';
import HrReports from './containers/HrReports/hrReports.component';
import HRListing from './containers/Employee/HRListing.component';
import Quotes from './containers/Quotes/quotes.component';
import AddQuotes from './containers/Quotes/addQuotes.component';
import GenerateOfferLetter from './containers/Applications/GenerateOfferLetter.component';
import AcceptInviteLink from './containers/Applications/AcceptInviteLink.component';
import CandidateListing from './containers/Applications/CandidateListing.component';
import RequiredDocument from './containers/TemporaryAccount/RequiredDocument.component';
import TemporaryAccount from './containers/TemporaryAccount/temporaryAccount.component';
import OnBoard from './containers/TemporaryAccount/OnBoard.component';
import AddEvent from './containers/Events/AddEvent.component';
import Holidays from './containers/Holidays/Holidays.component';
import AddHoliday from './containers/Holidays/AddHoliday.component';
import Leaves from './containers/Leaves/Leaves.component';
import AddLeave from './containers/Leaves/AddLeave.component';

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
      <Route path="/event" exact component={Events} />
      <Route path="/holidays" exact component={Holidays} />
      <Route path="/add-holiday" exact component={AddHoliday} />
      <Route path="/view-holiday/:viewID" exact component={AddHoliday} />
      <Route path="/edit-holiday/:ID" exact component={AddHoliday} />
      <Route path="/add-event" exact component={AddEvent} />
      <Route path="/technology" exact component={Technology} />
      <Route path="/emp-stack" exact component={EmployeeTechListing} />
      <Route path="/employee-list" exact component={EmployeeList} />
      <Route path="/emp-timesheet/" exact component={EmployeeTimesheet} />
      <Route path="/edit-employee/:employeeId" exact component={EditEmployee} />
      <Route path="/employees" exact component={Employees} />
      <Route path="/applications" exact component={Applications} />
       <Route path="/applications/:ID" exact component={Applications} />
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
       <Route path="/recruitment/:id" exact component={Applications} />
       <Route path="/hr-reports" exact component={HrReports} />
       <Route path='/hr-listing' exact component={HRListing} />
       <Route path='/quotes' exact component={Quotes} />
       <Route path='/add-quotes' exact component={AddQuotes} />
       <Route path='/edit-quotes/:qid' exact component={AddQuotes} />
       <Route path='/generate-offerletter' exact component={GenerateOfferLetter} />
       <Route path='/verify/offer/:offerToken' exact component={AcceptInviteLink} />
       <Route path='/candidates' exact component={CandidateListing} />
       <Route path='/temporary/account/:token' exact component={RequiredDocument} />
      <Route path="/candidates/:ID" exact component={TemporaryAccount} />
      <Route path="/onboard/:ID" exact component={OnBoard} />
      <Route path="/leaves" exact component={Leaves} />
      <Route path="/add-leave" exact component={AddLeave} />
      <Route path="/edit-leave/:leaveId" exact component={AddLeave} />


      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;
