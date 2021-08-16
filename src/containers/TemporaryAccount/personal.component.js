import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './personalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function Personal(props) {
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
    console.log(
      'formValues doc_link_pan_card',
      formValues.doc_link_pan_card[0]
    );
    console.log(
      'formValues doc_link_adhar_card',
      formValues.doc_link_adhar_card[0]
    );
    console.log('formValues doc_link_photo', formValues.doc_link_photo[0]);
    const postData = {
      email_hash:
        'gAAAAABhE6bH7Vx0DOeO9AItGzKTT-ZUe7_TQC02ga8bPVmWNbnsHkZUPXNuA3yrLkGXRz1xjvjWtnmEhvDPiMwfEQTkk57MkWChl8N2DQZMlpHxbAcpOwk=',
      password: 'EkDZb6XaX2',
      doc_type: 2,
      applicant_documents: [
        {
          doc_title: 'Aadhar',
          doc_link: 'http://www.google.com',
        },
        {
          doc_title: 'Pan Card',
          doc_link: 'http://www.google.com',
        },
        {
          doc_title: 'Photo',
          doc_link: 'http://www.google.com',
        },
      ],
    };
    console.log('postData', postData);
    const { data, message } = await AuthApi.postDataToServer(
      Api.applicantDocumentUrl,
      postData
    );
    props.onPersonalInfo(data.data.id);
    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
      // show error
      // return;
    } else {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        swal.close();
      });
    }
    // Perform success actions
  };

  return (
    <>
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Personal Details"
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

export default withRouter(Personal);
