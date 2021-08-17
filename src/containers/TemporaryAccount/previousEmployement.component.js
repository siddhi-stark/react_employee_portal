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
      console.log('data', data);
      return data.data;
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    let slip1fileUrl = '';
    let slip2fileUrl ='';
    let slip3fileUrl ='';
    let relivingfileUrl ='';

    if(formValues.salary_slip1){
      slip1fileUrl =  await fileUpload(formValues.salary_slip1);
    }
    if(formValues.salary_slip2){
      slip2fileUrl =  await fileUpload(formValues.salary_slip2);
    }
    if(formValues.salary_slip3){
      slip3fileUrl = await fileUpload(formValues.salary_slip3);
    }
    if(formValues.reliving_letter){
      relivingfileUrl = await fileUpload(formValues.reliving_letter);
    }

  const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      doc_type: 3,
      applicant_documents: [
        {
          doc_title: formValues.employee ? formValues.employee.label :'',
          doc_link: slip1fileUrl && slip1fileUrl.file_url,
        },
        {
          doc_title: formValues.employee ? formValues.employee.label :'',
          doc_link: slip2fileUrl && slip2fileUrl.file_url,
        },
        {
          doc_title: formValues.employee ? formValues.employee.label :'',
          doc_link: slip3fileUrl && slip3fileUrl.file_url,
        },
        {
          doc_title: formValues.employee ? formValues.employee.label :'',
          doc_link: relivingfileUrl && relivingfileUrl.file_url,
        },
      ],
    };
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
