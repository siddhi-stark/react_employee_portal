import { Component } from 'react';

export default class Api extends Component {
  static baseUrl = Api.getBaseUrl();

  static s3UrlnoProfile =
    'https://empportal-serverless.s3.ap-south-1.amazonaws.com/noProfile.jpeg';

  static s3Url = 'https://empportal-serverless.s3.amazonaws.com/media/';

  static loginUrl = `${Api.baseUrl}login/`;

  static clockInUrl = `${Api.baseUrl}clock-in/`;

  static forgetPasswordUrl = `${Api.baseUrl}forget-password/`;

  static resetPasswordUrl = `${Api.baseUrl}reset-password/`;

  static verifyToken = `${Api.baseUrl}password/find/`;

  static taskUrl = `${Api.baseUrl}tasks/`;

  static reportUrl = `${Api.baseUrl}send-report/`;

  static dailyActivityUrl = `${Api.baseUrl}daily-activity/`;

  static getProjects = `${Api.baseUrl}projects/`;

  static getProjectDetails = `${Api.baseUrl}project-details/`;

  static reportListingUrl = `${Api.baseUrl}report/`;

  static teamTimesheetExportUrl = `${Api.baseUrl}employee-timesheet-export-csv/`;

  static dailyReportUrl = `${Api.baseUrl}daily-report/`;

  static designationUrl = `${Api.baseUrl}designations/`;

  static employeeUrl = `${Api.baseUrl}employee/`;

  static personalDetails = `${Api.baseUrl}personal-details/`;

  static employeeListUrl = `${Api.baseUrl}employee-list/`;

  static employeePerformanceUrl = `${Api.baseUrl}employee-performance/`;

  static TwEmployeeUrl = `${Api.baseUrl}tw-employee/`;

  static roleUrl = `${Api.baseUrl}roles/`;

  static weeklyStatusUrl = `${Api.baseUrl}weekly-status/`;

  static timeSheetUrl = `${Api.baseUrl}timesheet-list/`;

  static profileUrl = `${Api.baseUrl}profile/`;

  static fileUploadUrl = `${Api.baseUrl}upload/`;

  static changePasswordUrl = `${Api.baseUrl}change-password/`;

  static teamUrl = `${Api.baseUrl}my-team/`;

  static bulkEmployee = `${Api.baseUrl}employee-bulk/`;

  static bullkDesignation = `${Api.baseUrl}designation-bulk/`;

  static employeeStackUrl = `${Api.baseUrl}technologystack/`;

  static employeeStack = `${Api.baseUrl}employeetechstack/`;

  static emailTemplates = `${Api.baseUrl}emailtemplates/`;

  static placeholders = `${Api.baseUrl}placeholders/`;

  static employeeTimesheet = `${Api.baseUrl}employee-timesheet/`;

  static historyUrl = `${Api.baseUrl}employementhistory/`;

  static applicantsUrl = `${Api.baseUrl}applicants/`;

  static roundsUrl = `${Api.baseUrl}applicant-rounds/`;

  static interviewUrl = `${Api.baseUrl}interviewer/`;

  static generateContentUrl = `${Api.baseUrl}generate-content/`;

  static sendMailUrl = `${Api.baseUrl}send-email/`;

  static batchUploadUrl = `${Api.baseUrl}batch-upload/`;

  static bulkStatusUrl = `${Api.baseUrl}applicants-bulk-status/`;

  static hrReportUrl = `${Api.baseUrl}report-count/`;

  static offerUrl = `${Api.baseUrl}offer-list/`;

  static InterviewRoundsUrl = `${Api.baseUrl}constants/`;

  static notificationUrl = `${Api.baseUrl}notification/`;

  static notificationCountUrl = `${Api.baseUrl}notification-count/`;

  static quotesUrl = `${Api.baseUrl}quotes/`;

  static randomQuotesUrl = `${Api.baseUrl}random-quotes/`;

  static timesheetDetailsUrl = `${Api.baseUrl}employee-timesheet-detail/`;

  static applicantHistoryUrl = `${Api.baseUrl}applicant-history/`;

  static offerTokenUrl = `${Api.baseUrl}verify/offer/`;

  static offerStatusUrl = `${Api.baseUrl}offer-status/`;

  static offerUpdateUrl = `${Api.baseUrl}offer-update/`;

  static temporaryAccountUrl = `${Api.baseUrl}verify/account/`;

  static applicantDocumentUrl = `${Api.baseUrl}applicant-document/`;

  static applicantInfoUrl = `${Api.baseUrl}applicant-information/`;

  static employeeInfo = `${Api.baseUrl}employee-information/`;

  static googleFileUploadUrl = `${Api.baseUrl}google-upload/`;

  static workingHrsUrl = `${Api.baseUrl}working-hours/`;

  static holidayUrll = `${Api.baseUrl}holiday/`;

  static eventsUrl = `${Api.baseUrl}events/`;

  static employeeTask = `${Api.baseUrl}employee-task/`;

  static applicantPercentageUrl = `${Api.baseUrl}applicant-percentage/`;

  static birthdayUrl = `${Api.baseUrl}upcoming-birthday/`;

  static holidayUrl = `${Api.baseUrl}upcoming-holiday/`;

  static leavesApplied = `${Api.baseUrl}leave-applied/`;

  static socialMediaUrl = `${Api.baseUrl}instagram-post/`;

  static driveUploadDocumentUrl = `${Api.baseUrl}google-drive-list/`;

  static leavesUrl = `${Api.baseUrl}leave/`;

  static leavesDetailsUrl = `${Api.baseUrl}get-leaves-details/`;

  static birthdayUrl = `${Api.baseUrl}upcoming-birthday/`;

  static greetingsUrl = `${Api.baseUrl}greetings/`;

  static greetingWishesUrl = `${Api.baseUrl}greeting-wishes/`;

  static projectSchedularUrl = `${Api.baseUrl}project-schedular/`;

  static departmentReportUrl = `${Api.baseUrl}department-report/`;

  static projectDetails = `${Api.baseUrl}projects-details/`;

  static projectListUrl = `${Api.baseUrl}project-dropdown-list/`;

  static fetchTeamworkDataUrl =
    'https://developmentapi.starkdigital.in/api2/fetch/tw-projects/';

  static projectsMilestonesUrl = `${Api.baseUrl.replace('/api/v1/', '/api2/')}projects-milestones/`;

  static deliverablesUrl = `${Api.baseUrl.replace('/api/v1/', '/api2/')}deliverables/`;

  static employeeBondDetailsUrl = `${Api.baseUrl}employee-bond-details/`;

  static taskProgressUrl = `${Api.baseUrl}progress-tasks/`;

  static tasksActivityUrl = `${Api.baseUrl}tasks-activity/`;

  static broadcastUrl = `${Api.baseUrl}broadcast/`;

  static policyUrl = `${Api.baseUrl}policy/`;

  static policyStatusUrl = `${Api.baseUrl}policy-bulk-status/`;

  static leavesCountUrl = `${Api.baseUrl}leave-count/`;

  static leaveCheckUrl = `${Api.baseUrl}leave-check/`;

  static leaveValidateUrl = `${Api.baseUrl}leave-validate/`;

  static workloadUrl = `${Api.baseUrl}workload/`;

  static employeeActivityUrl = `${Api.baseUrl}employee-activity/`;

  static policyCategoryUrl = `${Api.baseUrl}policy-categories/`;

  static teamMemberUrl = `${Api.baseUrl}team-member/`;

  static teamworkAuthUrl = `${Api.baseUrl}teamwork-auth/`;

  static leaveExportCSVUrl = `${Api.baseUrl}leave-export-csv/`;

  static leavesCountDataUrl = `${Api.baseUrl}leave-data/`;

  static projectSummaryUrl = `${Api.baseUrl}project-summary/`;

  static projectProgressUrl = `${Api.baseUrl}project-progress/`;

  static supportTicketUrl = `${Api.baseUrl}support-ticket/`;

  static employeeReviewUrl = `${Api.baseUrl}employee_review/`;

  static employeeSpeificReviewUrl = `${Api.baseUrl}specific-review-list/`;

  static employeeReportUrl = `${Api.baseUrl}dashboard-report/`;

  static employeeResignationUrl = `${Api.baseUrl}employee-resignation/`;

  static getResignationListUrl = `${Api.baseUrl}employee-resignation/`;

  static uploadDocumentsUrl = `${Api.baseUrl}upload-document/`;

  static uploadDocumentsUrls = `${Api.baseUrl}upload-documents/`;

  static uploadDocumentsUrls = `${Api.baseUrl}upload-documents/`;

  static onBoardingDocUpload = `${Api.baseUrl}document-upload/`;

  static postDocumentData = `${Api.baseUrl}file-upload/`;

  static allEmployeePerformanceUrl = `${Api.baseUrl}performance-report/`;

  static applicantRounds = `${Api.baseUrl}applicant-interview-rounds/`;

  static faqUrl = `${Api.baseUrl}faq/`;

  static workLoad = `${Api.baseUrl}work-load-report/`;

  static employeeAdd = `${Api.baseUrl}employee-account/`;

  static bugCountProject = `${Api.baseUrl}bugs-count-project-dashboard/`;

  static allDepartmentProject = `${Api.baseUrl}all-department-project-details/`;

  static departmentReport = `${Api.baseUrl}department-project-details/`;

  static employeeDetail = `${Api.baseUrl}employee-project-details/`;

  static employeeAbscond = `${Api.baseUrl}employee-abscound/`;

  static employeeOnboard = `${Api.baseUrl}employee-onboard/`;

  static employeeVerificationUrl = `${Api.baseUrl}employee-bgv/`;
  
  static employeeCurrentReport = `${Api.baseUrl}real-time-data/`;

  static feedbackQuestionUrl = `${Api.baseUrl}employee-feedback-review/`

  static empFeedbackUrl = `${Api.baseUrl}employee-feedback-review/`

  static questionUrl = `${Api.baseUrl}questionnaire/`
  
  static kraKpiUrl = `${Api.baseUrl}kra-kpi-forms/`
  
  static kraKpiQuestionnaire = `${Api.baseUrl}kra-kpi-questionnaire/`

  static kraKpiAdd = `${Api.baseUrl}kra-kpi/`

  static projectTaskList = `${Api.baseUrl}report-task-lists/`

  static generateTaskList = `${Api.baseUrl}project-reports/`
  
  static reportTaskList = `${Api.baseUrl}days-task-lists/`

  static generateTaskTeports = `${Api.baseUrl}generate-report/`

  static getProjectsEmployee = `${Api.baseUrl}get-projects-employee/`

  static getEmployees = `${Api.baseUrl}get-employees/`

  static taskDetails = `${Api.baseUrl}tasks-details/`

  static milestonesDetails = `${Api.baseUrl}milestones-details/`
  
  static wfh = `${Api.baseUrl}wfh/`

  static selfEvaluationForm = `${Api.baseUrl}self-evaluation-form/`

  static trainingReviewerForm = `${Api.baseUrl}training-reviewer-form/`

  static probationReviewerForm = `${Api.baseUrl}probation-reviewer-form/`
  
  static sentFormsReminder = `${Api.baseUrl}sent-forms-reminder/`

  static lateMarks = `${Api.baseUrl}late-marks/`

  static prediction = `${Api.baseUrl}predict-project-quality/`

  static predictionDetails = `${Api.baseUrl}get-reports-details/`

  static deletePredictionReports = `${Api.baseUrl}delete-reports/`

  static configureSetting = `${Api.baseUrl}configure-setting/`

  static interviewQuestionsUrl = `${Api.baseUrl}ai-interview-questions/`
  static exportTasksUrl = `${Api.baseUrl}export-tasks/`


  // Get base URL of APIs
  static getBaseUrl() {
    // const env = 'local';
    const env = 'production';

    let url = '';
    switch (env) {
      case 'local':
        url = 'http://127.0.0.1:8000/api/v1/';
        break;
      case 'production':
        url = 'https://portalsapi.starkdigital.in/api/v1/';
        // url = 'https://stage-portalsapi.starkdigital.in/api/v1/';
        // url = 'https://liveapi.starkdigital.in/api/v1/'; // for emp Production
        // url = 'https://api.pms-portal.reviewtestlink.com/api/v1/'; // for emp Production
        // url = 'https://portalsapi.reviewtestlink.com/api/v1/';
        break;
      case 'stage':
        url = 'https://stage-portalsapi.starkdigital.in/api/v1/';
        // url = 'https://developmentapi.starkdigital.in/api/v1/';
        // url = 'https://api.pms-portal.reviewtestlink.com/api/v1/';
        break;
      case 'dev':
        url = 'https://developmentapi.starkdigital.in/api/v1/';
        // url = 'https://developmentapi.starkdigital.in/api/v1/';
        // url = 'https://api.pms-portal.reviewtestlink.com/api/v1/';
        break;
      default:
        // url = 'http://92.204.146.45:1337/api/v1/';
        url = 'https://developmentapi.starkdigital.in/api/v1/';
        break;
    }
    return url;
  }

  environment;

  constructor(props) {
    super(props);
    this.state = {};
    this.getBaseUrl = this.getBaseUrl.bind(this);
  }
}
