import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './historyFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
// import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';

function EmployementHistory(props) {
  const accProps = { props };
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const idProps = accProps.props.id;

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  // const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);


  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id:idProps
    };
    const postData = [];

      const report = [];
      
      formValues.addmore.map((rp) => {
          const hrReport = {};
          const managerReport = {};
        if(rp.reporting_person_hr) {

          hrReport.reporting_person = rp.reporting_person_hr;
          hrReport.email = rp.hr_email;
          hrReport.mobile = rp.hr_mobile;
          hrReport.is_hr = true;
        }
        report.push(hrReport);

        if(rp.reporting_person_manager) {

          managerReport.reporting_person = rp.reporting_person_manager;
          managerReport.email = rp.manager_email;
          managerReport.mobile = rp.manager_mobile;
        }
        report.push(managerReport);


        return report;
        })
      console.log('report',report)
      for(const history of formValues.addmore) { // eslint-disable-line
      const candidateHistory = {
        designation: history.designation,
        company_name: history.company_name,
        company_url: history.company_url,
        start_date: history.start_date ? customFunctions.getDate(history.start_date) : '',
        end_date: history.end_date ? customFunctions.getDate(history.end_date) : '',
        location: history.location,
        reportings: report
      }
    postData.push(candidateHistory);
    }
    payload.applicant_history = postData;
    console.log('postData',payload);

    const { data } = await AuthApi.postDataToServer(
     `${Api.applicantHistoryUrl}`,
      payload
    );

    if (!data) {
      // show error
      // return;
    }
    // Perform success actions
  };

  return (
    <>
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Employement History"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        // options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons mb-4"
        isStepForm={false}
        onFormReset={() => {
          console.log('form reset callback');
        }}
      />
    </>
  );
}

export default withRouter(EmployementHistory);
