import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './personalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function Personal(props) {
  const accProps = { props };
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

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

  const fileUpload = async (formValues) => {
    
    const formData = new FormData();

    formData.append('file_name', formValues[0].name);
    formData.append('employee_name', nameProps); 
    formData.append('employee_email', emailProps);

    const { data } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,formData
    );
    if (data) {
      // setEmail(data.data.email);
      console.log('data', data);
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    if(formValues.doc_link_pan_card){
      fileUpload(formValues.doc_link_pan_card);
     }
    if(formValues.doc_link_adhar_card){
      fileUpload(formValues.doc_link_adhar_card);
    }
    if(formValues.doc_link_photo){
      fileUpload(formValues.doc_link_photo);
    }
  
    console.log('formValues doc_link_photo', formValues.doc_link_photo[0]);
    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
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
