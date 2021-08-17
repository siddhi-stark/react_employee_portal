import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './educationalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';


function EducationalDetails(props) {
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

  const fileUpload = async (formValues) => { // eslint-disable-line
    
    const formData = new FormData();

    formData.append('file_name', formValues[0]);
    formData.append('employee_name', nameProps); 
    formData.append('employee_email', emailProps);
    formData.append('folder_name', 'Educational');
    formData.append('email_hash', tokenProps);
    formData.append('password', passwordProps);

    const { data } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,formData
    );
    if (data) {
      return data.data;
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    let sscfileUrl = '';
    let hscfileUrl ='';
    let graduatefileUrl ='';
    let postfileUrl ='';

    if(formValues.doc_link_graduate){
      graduatefileUrl =  await fileUpload(formValues.doc_link_graduate);
    }
    if(formValues.doc_link_hsc){
      hscfileUrl =  await fileUpload(formValues.doc_link_hsc);
    }
    if(formValues.doc_link_post_graduate){
      postfileUrl = await fileUpload(formValues.doc_link_post_graduate);
    }
    if(formValues.doc_link_ssc){
      sscfileUrl = await fileUpload(formValues.doc_link_ssc);
    }
    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      doct_type: 1,
      applicant_documents: [
        {
          doc_title: 'SSC',
          doc_link: sscfileUrl.file_url,
        },
        {
          doc_title: 'HSC',
          doc_link: hscfileUrl.file_url,
        },
        {
          doc_title: 'Graduate',
          doc_link: graduatefileUrl.file_url,
        },
        {
          doc_title: 'Post Graduate',
          doc_link: postfileUrl.file_url,
        },
      ],
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.applicantDocumentUrl,
      postData
    );
    
   if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        updateDefaultValues({});
        swal.close();
      });
      // show error
      // return;
    } else {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        props.onEducationalInfo(true);
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
