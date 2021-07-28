import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './NewInterviewRounds.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

// const addMoreData = {
//   addmore: [
//     {
//       int_date: new Date,
//       int_time: new Date,
//       interviewer: { label: 'Prashant Mane', value: 2 },
//       round_status: { label: 'hr screening', value: '1' },
//     },
//   ],
// };

function NewInterviewRounds() {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [count, forceUpdate] = useState(0);

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
    console.log('formValues--', formValues);
    const id = customFunctions.getLocalStorage('applicantId');
    console.log('formValues', formValues.addmore[0].int_date);
    const postData = {
      int_date: formValues.addmore[0].int_date
        ? customFunctions.getDate(formValues.addmore[0].int_date)
        : '',
      int_time: formValues.addmore[0].int_time
        ? customFunctions.getTime(formValues.addmore[0].int_time)
        : '',
      round_status: formValues.addmore[0].round_status
        ? formValues.addmore[0].round_status.value
        : '',
      interviewer: formValues.addmore[0].interviewer
        ? formValues.addmore[0].interviewer.value
        : '',
      applicant: id,
    };

    console.log('postData', postData);

    // console.log('postData',postData);
    const { data, message } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      postData
    );
    customFunctions.removeLocalStorage('InterviewId');

    if (data) {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  const getData = async () => {
    // console.log(designation);
    // const ApplicantId = props.match.params.ID;
    const Interview = customFunctions.getLocalStorage('InterviewId');
    const { data } = await AuthApi.getDataFromServer(
      `${Api.roundsUrl}?applicant_id=${Interview}`
    );
    if (data) {
      const interviewData = [];
      data.data.map((dt) => {
        const newTime = new Date(`${dt.int_date}T${dt.int_time}Z`);
        const newDate = new Date(dt.int_date);
        return interviewData.push({
          interviewer: { label: dt.interviewer_name, value: dt.interviewer_id },
          round_status: {
            label: dt.round_type_name,
            value: String(dt.round_type),
          },
          int_date: newDate,
          int_time: newTime,
        });
      });

      updateDefaultValues({ addmore: [...interviewData] }); // updateDefaultValues(data);
      forceUpdate(count + 1);
    }
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

  const getInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getInterviewer();
  }, []);

  return (
    <>
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="form"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        refreshCounter={count}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}
        onFormReset={() => {
          console.log('form reset callback');
        }}
      />
    </>
  );
}

export default withRouter(NewInterviewRounds);
