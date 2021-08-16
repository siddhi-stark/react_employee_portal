import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './employmentFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function PreviousEmployement(props) {
  const accProps = { props };
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

  let filterOptions = {};
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
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
    const fileArr = [];
    // fileArr.push(formValues.file_upload);
    for (let i = 0; i < formValues.file_upload.length; i++) { // eslint-disable-line
       fileArr.push(formValues.file_upload[i])
      }
    console.log('formValues.file_upload',fileArr);
    const formData = new FormData();
    formData.append('file_name', fileArr);

    formData.append('employee_name', nameProps); 
    formData.append('employee_email', emailProps);
      console.log('------',formData);

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
    console.log('formValues',formValues);
    if(formValues){
      fileUpload(formValues);
     }
   

  const documents = [];
  const doc = {};
  if(formValues.employee) {
    doc.doc_title = formValues.employee.label
    doc.doc_link = formValues.file_upload
  }
  documents.push(doc);

  const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      doc_type: 2,
      applicant_documents: documents
    };
    console.log('postData', postData);
    const { data, message } = await AuthApi.postDataToServer(
      Api.applicantDocumentUrl,
      postData
    );

   // props.onHistoryInfo(data.data.id);
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

  const getEmployee = async () => {
    const postData = {
      email_hash:tokenProps,
      password: passwordProps,
    };

    const { data } = await AuthApi.postDataToServer(Api.applicantInfoUrl,postData);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data && data.data.applicant_history.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.company_name, value: op.company_name });
      return op;
    });
    const allOptions = {
      ...options,
      ...filterOptions,
      employee: dpOptions,
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <>
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Previous Employment"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        options={options}
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

export default withRouter(PreviousEmployement);
