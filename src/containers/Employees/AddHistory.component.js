/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddEmployementHistory.json.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function AddHistory(props) {
  // const accProps = { props };
  const { state } = useLocation();
  const { employeeId, applicatId, accProps } = props;
  const passwordProps = accProps?.props?.password;
  const tokenProps = accProps?.props?.token;
  const idProps = accProps?.props?.match?.params?.ID;

  const [appId, setAppId] = useState('');

  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);
  const candidateId = localStorage.getItem('candidateId');

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (
      sectionData?.name === 'start_date' ||
      sectionData?.name === 'end_date'
    ) {
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

  useEffect(() => {
    if (appId) {
      setAppId(appId);
    }
  }, [appId]);

  const getData = async () => {
    setShowLoader(true);

    const addmoreData = [];
    const endPoint = state?.state?.applicantId
      ? `${Api.applicantInfoUrl}?employee_id=${state?.state?.empId}`
      : state?.state?.empId
      ? `${Api.employeeInfo}?employee_id=${state?.state?.empId}`
      : `${Api.employeeInfo}`;

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
    };

    let response;
    if (state?.state?.applicantId) {
      response = await AuthApi.postDataToServer(endPoint, postData);
    } else {
      response = await AuthApi.getDataFromServer(endPoint);
    }

    const { data, message } = response;
    // const { data, message } = state?.state?.empId
    // const { data, message } = state?.state?.applicantId || state?.state?.empId
    //   ? await AuthApi.postDataToServer(endPoint, postData)
    //   : await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      data?.data &&
        data?.data?.applicant_history &&
        data?.data?.applicant_history?.length > 0 &&
        data?.data?.applicant_history.map((doc) => {
          const reportingData = {};
          doc?.reportings &&
            doc?.reportings?.length > 0 &&
            doc?.reportings.map((report) => {
              if (report?.is_hr) {
                reportingData.reporting_person_hr = report?.reporting_person;
                reportingData.hr_email = report?.email;
                reportingData.hr_mobile = report?.mobile;
              } else {
                reportingData.reporting_person_manager =
                  report?.reporting_person || '';
                reportingData.manager_email = report?.email || '';
                reportingData.manager_mobile = report?.mobile || '';
              }
              return report;
            });

          addmoreData.push({
            company_name: doc?.company_name && doc?.company_name,
            designation: doc?.designation && doc?.designation,
            company_url: doc?.company_url && doc?.company_url,
            start_date: doc?.start_date && new Date(doc?.start_date),
            end_date: doc?.end_date && new Date(doc?.end_date),
            duration: doc?.duration && doc?.duration,
            location: doc?.location && doc?.location,
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
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    if (state?.state?.applicantId || state?.state?.empId) {
      getData();
    }
  }, [state]);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
      employee_id: Number(employeeId),
    };
    const postData = [];

    const report = {};

    await formValues.addmore.map((rp, i) => {
      report[i] = [];
      const hrReport = {};
      const managerReport = {};
      if (rp.reporting_person_hr) {
        hrReport.reporting_person = rp?.reporting_person_hr;
        hrReport.email = rp?.hr_email;
        hrReport.mobile = rp?.hr_mobile;
        hrReport.is_hr = true;
        report[i].push(hrReport);
      }

      if (rp?.reporting_person_manager) {
        managerReport.reporting_person = rp?.reporting_person_manager;
        managerReport.email = rp?.manager_email;
        managerReport.mobile = rp?.manager_mobile;
        report[i].push(managerReport);
      }
      return rp;
    });
    const addEntry = formValues.addmore.entries();
    for (const [index, history] of addEntry) {
      // eslint-disable-line
      const candidateHistory = {
        designation: history?.designation,
        company_name: history?.company_name,
        company_url: history?.company_url,
        start_date: history?.start_date
          ? customFunctions.getDate(history?.start_date)
          : '',
        end_date: history?.end_date
          ? customFunctions.getDate(history?.end_date)
          : '',
        location: history?.location,
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
      swal(data?.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        // Reload the page
        window.location.reload();
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
        formHeading="Add Document"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        showBtnClass={true}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons mb-4"
        isStepForm={false}
      />
    </>
  );
}

export default withRouter(AddHistory);
