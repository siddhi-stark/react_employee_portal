import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './personalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function Personal(props) {
  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
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

  const getData = async () => {
    const endPoint = `${Api.applicantInfoUrl}?applicant_id=${candidateId}`;
   
    const { data, message } = await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      console.log('data.data',data.data.applicant_documents);
      data.data && data.data.applicant_documents.map((doc)=>{
        updateDefaultValues({
            doc_link_pan_card:(doc.doc_title === 'Pan Card') && doc.document_url,
            doc_link_adhar_card:(doc.doc_title === 'Aadhar') && doc.document_url,
            doc_link_photo:(doc.doc_title === 'Photo') && doc.document_url,
        });
        return doc;
      })
    } else {
      console.log('error', message);
      // swal(message, '', 'error');
    }
  };

  useEffect(() => {
    if(candidateId) {
      getData();
    }
  }, []);

  const fileUpload = async (formValues) => { // eslint-disable-line
    const formData = new FormData();

    formData.append('file_name', formValues[0]);
    formData.append('email_hash', tokenProps);
    formData.append('password', passwordProps);
    formData.append('employee_name', nameProps); 
    formData.append('employee_email', emailProps);
    formData.append('folder_name', 'Personal');

    const { data } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,formData
    );
    if (data) {
      return data.data;
    } 
  };

  // Submit Form
  const submitForm = async (formValues) => {
    let pancardfileUrl ='';
    let adharfileUrl ='';
    let photofileUrl ='';
    if(formValues.doc_link_pan_card){
       pancardfileUrl = await fileUpload(formValues.doc_link_pan_card);
     }
    if(formValues.doc_link_adhar_card){
      adharfileUrl = await fileUpload(formValues.doc_link_adhar_card);
    }
    if(formValues.doc_link_photo){
      photofileUrl = await fileUpload(formValues.doc_link_photo);
    }
    
    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: candidateId ? Number(candidateId):'',
      doc_type: 2,
      applicant_documents: [
        {
          doc_title: 'Aadhar',
          doc: adharfileUrl && adharfileUrl.id,
        },
        {
          doc_title: 'Pan Card',
          doc: pancardfileUrl && pancardfileUrl.id,
        },
        {
          doc_title: 'Photo',
          doc: photofileUrl && photofileUrl.id,
        },
      ],
    };

    const { data, message } = await AuthApi.postDataToServer(
     `${Api.applicantDocumentUrl}`,
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
        props.onPersonalInfo(true);
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
