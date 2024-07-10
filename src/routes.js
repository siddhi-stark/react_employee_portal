import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PerformanceReport from './containers/performance Report/performanceReport';
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
import TeamLeaves from './containers/Leaves/TeamLeaves.component';
import AddLeave from './containers/Leaves/AddLeave.component';
import TeamAddLeave from './containers/Leaves/TeamAddLeave.component';
import EmployeeTeamLeaves from './containers/Leaves/EmployeeTeamLeaves.component';
import AddBirthday from './containers/Birthday/AddBirthday.component';
import BirthdayWishes from './containers/Birthday/BirthdayWishes.component';
import Greetings from './containers/Birthday/Greetings.component';
import MyInterviews from './containers/Recruitment/MyInterviews.component';
import Project from './containers/Project/project.component';
import EditProject from './containers/Project/EditProject.component';
import TeamProject from './containers/Project/teamProject.component';
import Team from './containers/Project/team.component';
import TeamMemberProject from './containers/Project/teamMemberProject.component';
import ProjectScheduler from './containers/ProjectScheduler/projectScheduler.component';
import TeamProjectScheduler from './containers/ProjectScheduler/teamProjectScheduler.component';
import ProjectFetch from './containers/ProjectScheduler/projectFetch.component';
import ArchivedProject from './containers/Project/archivedProject.component';
import AddEmployementHistory from './containers/Employees/AddEmployementHistory.component';
import Broadcast from './containers/Broadcast/broadcast.component';
import AddBroadcast from './containers/Broadcast/addBroadcast.component';
import Policy from './containers/Policy/policy.component';
import AddPolicy from './containers/Policy/addPolicy.component';
import Workload from './containers/Employee/workload.component';
import EmployeeActivity from './containers/Employee/employeeActivity.component';
import PolicyCategory from './containers/Policy/category.component';
import AddCategory from './containers/Policy/addCategory.component';
import EmployeeDetails from './containers/Leaves/EmployeeDetails.component';
import SupportTicketComponent from './containers/SupportTicket/supportTicket.component';
import AddSupportTicket from './containers/SupportTicket/addSupportTicket.component';
import EmployeeExitForm from './containers/Exit process/EmployeeExitForm';
import EmployeeResignationList from './containers/Exit process/employeeResignationList';
import ResignationDetails from './containers/Exit process/resignationDetails';
import LeaveListingForAccountant from './containers/Leaves/LeaveListingForAccountant';
import AccountAddleaveComponent from './containers/Leaves/AccountAddleave.component';
import ResignationDetailsComponent from './containers/Exit process/resignationDetailsComponent';
import AbscoundComponent from './containers/Exit process/Abscound.component';
import AbscondTable from './containers/TerminationAndAbscoud/AbscondTable';
import FormAbscondTermination from './containers/TerminationAndAbscoud/FormAbscondTermination';
import FAQListing from './containers/FAQs/FAQListing';
import FAQForm from './containers/FAQs/FAQForm';
import EmployeeWorkload from './containers/Employee Workload/employeeWorkload';
import CompletedProject from './containers/Project/completedProject';
// import TemporayDocument from './containers/Employees/TemporayDocument';
import AddDocuments from './containers/Employees/AddDocuments';

function Routes() {
  return (
    <Switch>
      {/* <Route path='*' element={<NotFound />} /> */}
      <Route path="/" exact component={Dashboard} />
      <Route path="/login" exact component={Login} />
      <Route path="/forget-password" exact component={ForgetPassword} />
      <Route path="/password/reset/:token" exact component={ResetPassword} />
      <Route path="/reports" exact component={AllReports} />
      <Route path="/employee-report" exact component={AllReports} />
      <Route path="/daily-report/:date/:id" exact component={Reports} />
      <Route path="/right" exact component={RightContainer} />
      <Route path="/projects" exact component={Projects} />
      <Route path="/designation" exact component={Designation} />
      <Route path="/employee" exact component={Employee} />
      <Route path="/report" exact component={MyReports} />
      <Route path="/my-report" exact component={MyReports} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/manage-password" exact component={ManagePassword} />
      <Route path="/team-report" exact component={TeamReport} />
      <Route path="/event" exact component={Events} />
      <Route path="/holidays" exact component={Holidays} />
      <Route path="/add-holiday" exact component={AddHoliday} />
      <Route path="/view-holiday/:viewID" exact component={AddHoliday} />
      <Route path="/edit-holiday/:ID" exact component={AddHoliday} />
      <Route path="/add-event" exact component={AddEvent} />
      <Route path="/edit-event/:event" exact component={AddEvent} />
      <Route path="/view-event/:viewEvent" exact component={AddEvent} />
      <Route path="/technology" exact component={Technology} />
      <Route path="/emp-stack" exact component={EmployeeTechListing} />
      <Route path="/employee-list" exact component={EmployeeList} />
      <Route path="/emp-timesheet/" exact component={EmployeeTimesheet} />
      <Route path="/edit-employee/:employeeId" exact component={EditEmployee} />
      <Route path="/employees" exact component={Employees} />
      <Route path="/applications" exact component={Applications} />
      <Route path="/applications/:ID" exact component={Applications} />
      <Route path="/batch-upload" exact component={RecruitmentFileComponent} />
      <Route path="/abscond-table" exact component={AbscondTable} />
      <Route path="/abscond-form" exact component={FormAbscondTermination} />
      <Route
        path="/edit-abscond-form/:aid"
        exact
        component={FormAbscondTermination}
      />
      <Route path="/faq-listing" exact component={FAQListing} />
      <Route path="/faq-form" exact component={FAQForm} />
      <Route path="/edit-faq/:fid" exact component={FAQForm} />
      <Route
        path="/add-technology-stack"
        exact
        component={AddTechnologyStack}
      />
      <Route
        path="/edit-technology-stack/:stackId"
        exact
        component={AddTechnologyStack}
      />
      <Route path="/employee-profile/:id" exact component={EmployeeProfile} />
      <Route path="/add-document/:id" exact component={AddDocuments} />

      <Route path="/confirmation" exact component={Confirmation} />
      <Route
        path="/interviewer-round"
        exact
        component={InterviewerRoundStatus}
      />
      <Route path="/selected" exact component={SelectedCandidate} />
      <Route
        path="/candidate-listing"
        exact
        component={SelectedCandidateListing}
      />
      <Route path="/email-templates" exact component={EmailTemplates} />
      <Route path="/recruitment" exact component={RecruitmentApplication} />
      <Route path="/recruitment/:id" exact component={Applications} />
      <Route path="/recruitments" exact component={RecruitmentApplication} />
      <Route path="/recruitments/:id" exact component={Applications} />
      <Route path="/hr-reports" exact component={HrReports} />
      <Route path="/hr-listing" exact component={HRListing} />
      <Route path="/quotes" exact component={Quotes} />
      <Route path="/add-quotes" exact component={AddQuotes} />
      <Route path="/edit-quotes/:qid" exact component={AddQuotes} />
      <Route
        path="/generate-offerletter"
        exact
        component={GenerateOfferLetter}
      />
      <Route
        path="/verify/offer/:offerToken"
        exact
        component={AcceptInviteLink}
      />
      <Route path="/candidates" exact component={CandidateListing} />
      <Route
        path="/temporary/account/:token"
        exact
        component={RequiredDocument}
      />
      <Route path="/candidates/:ID" exact component={TemporaryAccount} />
      <Route path="/onboard/:ID" exact component={OnBoard} />
      <Route path="/leaves" exact component={Leaves} />
      <Route path="/my-leaves" exact component={Leaves} />
      <Route path="/add-leave" exact component={AddLeave} />
      <Route path="/edit-leave/:leaveId" exact component={AddLeave} />
      <Route path="/view-leave/:viewLeaveId" exact component={TeamAddLeave} />
      <Route path="/team-leaves" exact component={TeamLeaves} />
      <Route path="/employee-leaves" exact component={EmployeeTeamLeaves} />
      <Route path="/add-greetings" exact component={AddBirthday} />
      <Route path="/edit-greetings/:bdayId" exact component={AddBirthday} />
      <Route path="/wishes" exact component={BirthdayWishes} />
      <Route path="/greetings" exact component={Greetings} />
      <Route path="/interview-listing" exact component={MyInterviews} />
      <Route path="/current-project" exact component={Project} />

      <Route path="/edit-project/:projectId" exact component={EditProject} />
      <Route path="/view-project/:projectId" exact component={EditProject} />
      <Route
        path="/team-project/:teamProjectId"
        exact
        component={TeamProject}
      />
      <Route path="/team/:teamId" exact component={Team} />
      <Route
        path="/my-project/:teamMemberId"
        exact
        component={TeamMemberProject}
      />
      <Route path="/scheduler" exact component={ProjectScheduler} />
      <Route path="/team-scheduler" exact component={TeamProjectScheduler} />
      <Route path="/project-fetch" exact component={ProjectFetch} />
      <Route path="/archived-project" exact component={ArchivedProject} />
      <Route path="/completed-project" exact component={CompletedProject} />
      <Route
        path="/addemployement-history/:ID"
        exact
        component={AddEmployementHistory}
      />
      <Route path="/broadcast" exact component={Broadcast} />
      <Route path="/add-broadcast" exact component={AddBroadcast} />
      <Route path="/edit-broadcast/:broadid" exact component={AddBroadcast} />
      <Route path="/policy" exact component={Policy} />
      <Route path="/add-policy" exact component={AddPolicy} />
      <Route path="/edit-policy/:policyId" exact component={AddPolicy} />
      <Route path="/workload" exact component={Workload} />
      <Route path="/employee-activity" exact component={EmployeeActivity} />
      <Route path="/policy-category" exact component={PolicyCategory} />
      <Route path="/add-policy-category" exact component={AddCategory} />
      <Route
        path="/edit-policy-category/:categoryId"
        exact
        component={AddCategory}
      />
      <Route
        path="/employee-leaves-report/:viewId"
        exact
        component={EmployeeDetails}
      />
      <Route path="/support-ticket" exact component={SupportTicketComponent} />
      <Route path="/add-support-ticket" exact component={AddSupportTicket} />
      <Route
        path="/view-support-ticket/:supportId"
        exact
        component={AddSupportTicket}
      />
      <Route path="/performance-report" exact component={PerformanceReport} />
      <Route path="/employee-workload" exact component={EmployeeWorkload} />
      <Route
        path="/resignation-application"
        exact
        component={EmployeeExitForm}
      />
      <Route
        path="/resignation-applications"
        exact
        component={EmployeeResignationList}
      />
      <Route
        path="/resignation-details/:id"
        exact
        component={ResignationDetails}
      />
      <Route
        path="/accountant-leaves"
        exact
        component={LeaveListingForAccountant}
      />
      <Route
        path="/accountant-add-leaves"
        exact
        component={AccountAddleaveComponent}
      />
      <Route
        path="/resignation-detail/:id"
        exact
        component={ResignationDetailsComponent}
      />
      <Route component={NotFound} />
      <Route path="/terminate-process" exact component={AbscoundComponent} />
    </Switch>
  );
}

export default Routes;
