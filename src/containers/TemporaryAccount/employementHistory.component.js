import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './historyFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function EmployementHistory(props) {
  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  const applicantId = accProps.props.applicantId;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const idProps = accProps.props.match.params.ID;

  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [isShowLoader,setShowLoader] = useState(false);

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const getData = async () => {
    setShowLoader(true);

    const addmoreData = [];

    const endPoint = candidateId
      ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`
      : `${Api.applicantInfoUrl}`;

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
    };

    const { data, message } = applicantId
      ? await AuthApi.postDataToServer(endPoint, postData)
      : await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      data.data &&
        data.data.applicant_history &&
        data.data.applicant_history.length > 0 &&
        data.data.applicant_history.map((doc) => {
          const reportingData = {};
          doc.reportings &&
            doc.reportings.length > 0 &&
            doc.reportings.map((report) => {
              if (report.is_hr) {
                reportingData.reporting_person_hr = report.reporting_person;
                reportingData.hr_email = report.email;
                reportingData.hr_mobile = report.mobile;
              } else {
                reportingData.reporting_person_manager =
                  report.reporting_person || '';
                reportingData.manager_email = report.email || '';
                reportingData.manager_mobile = report.mobile || '';
              }
              return report;
            });

          addmoreData.push({
            company_name: doc.company_name && doc.company_name,
            designation: doc.designation && doc.designation,
            company_url: doc.company_url && doc.company_url,
            start_date: doc.start_date && new Date(doc.start_date),
            end_date: doc.end_date && new Date(doc.end_date),
            duration: doc.duration && doc.duration,
            location: doc.location && doc.location,
            reporting_person_hr: reportingData.reporting_person_hr,

            hr_email: reportingData.hr_email,
            hr_mobile: reportingData.hr_mobile,
            reporting_person_manager: reportingData.reporting_person_manager,
            manager_email: reportingData.manager_email,
            manager_mobile: reportingData.manager_mobile,
          });
          return doc;
        });
      updateDefaultValues({ addmore: [...addmoreData] });
    } else {
      setShowLoader(false);
      swal(message,'','error');
    }
  };

  useEffect(() => {
    if (candidateId || applicantId) {
      getData();
    }
  }, []);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: idProps,
    };
    const postData = [];

    const report = {};

    await formValues.addmore.map((rp, i) => {
      report[i] = [];
      const hrReport = {};
      const managerReport = {};
      if (rp.reporting_person_hr) {
        hrReport.reporting_person = rp.reporting_person_hr;
        hrReport.email = rp.hr_email;
        hrReport.mobile = rp.hr_mobile;
        hrReport.is_hr = true;
        report[i].push(hrReport);
      }

      if (rp.reporting_person_manager) {
        managerReport.reporting_person = rp.reporting_person_manager;
        managerReport.email = rp.manager_email;
        managerReport.mobile = rp.manager_mobile;
        report[i].push(managerReport);
      }
      return rp;
    });
    for (const [index, history] of formValues.addmore.entries()) { // eslint-disable-line
      const candidateHistory = {
        designation: history.designation,
        company_name: history.company_name,
        company_url: history.company_url,
        start_date: history.start_date
          ? customFunctions.getDate(history.start_date)
          : '',
        end_date: history.end_date
          ? customFunctions.getDate(history.end_date)
          : '',
        location: history.location,
        reportings: report[index],
      };
      postData.push(candidateHistory);
    }
    payload.applicant_history = postData;
    const { data, message } = await AuthApi.postDataToServer(
      `${Api.applicantHistoryUrl}`,
      payload
    );

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
      
    } else {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        if (candidateId) {
          getData();
        }
        swal.close();
      });
    }
  };

  return (
    <>
     <Loader showLoader={isShowLoader} needFullPage={false} />
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Employement History"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons mb-4"
        isStepForm={false}
      />
    </>
  );
}

export default withRouter(EmployementHistory);
