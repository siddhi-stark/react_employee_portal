import { Component } from 'react';

export default class Api extends Component {
  static baseUrl = Api.getBaseUrl();
  
  static s3UrlnoProfile = 'https://empportal-serverless.s3.ap-south-1.amazonaws.com/noProfile.jpeg';
  
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

  static reportListingUrl = `${Api.baseUrl}report/`;

  static dailyReportUrl = `${Api.baseUrl}daily-report/`;

  static designationUrl = `${Api.baseUrl}designations/`;

  static employeeUrl = `${Api.baseUrl}employee/`;

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

  static interviewUrl =  `${Api.baseUrl}interviewer/`;

  static generateContentUrl = `${Api.baseUrl}generate-content/`;

  static sendMailUrl = `${Api.baseUrl}send-email/`;

  static batchUploadUrl =  `${Api.baseUrl}batch-upload/`;

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

  static temporaryAccountUrl = `${Api.baseUrl}verify/account/`;   

  static applicantDocumentUrl = `${Api.baseUrl}applicant-document-detail/`;

  static applicantInfoUrl = `${Api.baseUrl}applicant-information/`;

  static googleFileUploadUrl = `${Api.baseUrl}google-upload/`;

  // Get base URL of APIs
  static getBaseUrl() {
    const env = 'dev';
    let url = '';
    switch (env) {
      case 'production':
        url = 'https://fj67fd3njj.execute-api.ap-south-1.amazonaws.com/production/api/v1/';
        break;
      // Default: development server
      default:
        url =
          'https://mvwnj2rhk7.execute-api.ap-south-1.amazonaws.com/dev/api/v1/';
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
