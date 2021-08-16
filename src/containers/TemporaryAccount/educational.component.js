import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './educationalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

// import swal from 'sweetalert';

function EducationalDetails(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  // const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

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
    const postData = {
      email_hash: 'url',
      password: 'abc',
      doct_type: 1,
      applicant_documents: [
        {
          doc_title: 'SSC',
          doc_link: 'http://www.google.com',
        },
        {
          doc_title: 'HSC',
          doc_link: 'http://www.google.com',
        },
        {
          doc_title: 'Graduate',
          doc_link: 'http://www.google.com',
        },
        {
          doc_title: 'Post Graduate',
          doc_link: 'http://www.google.com',
        },
      ],
    };
    console.log('postData',postData);

    const { data } = await AuthApi.postDataToServer(
      Api.applicantDocumentUrl,
      formValues
    );
    props.onEducationalInfo(data.data.id);
    
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
        formHeading="Educational Details"
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

export default withRouter(EducationalDetails);
