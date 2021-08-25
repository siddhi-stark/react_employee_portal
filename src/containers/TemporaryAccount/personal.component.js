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
  const applicantId = accProps.props.applicantId;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  // const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [docId, setDocId] = useState(null);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const getData = async () => {
    let panCard = '';
    let adharCard = '';
    let photo = '';
    const docIdArr = [];

    const endPoint = candidateId ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`:`${Api.applicantInfoUrl}`;
    
    const postData = {
        email_hash: tokenProps,
        password: passwordProps,
      }

    const { data, message } = applicantId ? await AuthApi.postDataToServer(endPoint,postData) :
    await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      data.data && data.data.applicant_documents && data.data.applicant_documents.map((doc)=>{
        if(doc.doc_title === 'Pan'){
          panCard = doc.document_url;
        } else if(doc.doc_title === 'Aadhar'){
          adharCard = doc.document_url;
        } else if(doc.doc_title === 'Photo'){
          photo = doc.document_url;
        }

        docIdArr.push({name: doc.doc_title, id:doc.doc_id});

        return doc;
      })
      updateDefaultValues({
        doc_link_pan_card: panCard,
        doc_link_adhar_card:adharCard,
        doc_link_photo:photo,
      });
      setDocId(docIdArr);
    } else {
      console.log('error', message);
    }
  };

  useEffect(async() => {

    if(candidateId || applicantId) {
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

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,formData
    );
    if(customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success) { 
      return data.data.id;
    }
  };


  const getApplicantPercentage = async () => { // eslint-disable-line
    const endPoint = applicantId ? `${Api.applicantPercentageUrl}?applicant_id=${applicantId}`:`${Api.applicantPercentageUrl}?applicant_id=${candidateId}`;

    const { data, message } = await AuthApi.getDataFromServer(endPoint);
    
    if(customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success && data.data ) { 
      props.getParentsData(data.data.completion);
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    let pancardfileUrl ='';
    let pancardfileUrlId ='';
    let adharfileUrl ='';
    let adharfileUrlId ='';
    let photofileUrl ='';
    let photofileUrlId ='';
    
    docId && docId.map((document)=>{
      if(document.name === 'Pan'){
        pancardfileUrl = document.id;
      }else if(document.name === 'Aadhar'){
        adharfileUrl = document.id;
      }else if(document.name === 'Photo'){
        photofileUrl = document.id;
      }
      return document;
    })

    if(formValues.doc_link_pan_card){
       pancardfileUrlId = (typeof formValues.doc_link_pan_card === 'object') && await fileUpload(formValues.doc_link_pan_card);
     }
    if(formValues.doc_link_adhar_card){
      adharfileUrlId = (typeof formValues.doc_link_adhar_card === 'object') && await fileUpload(formValues.doc_link_adhar_card);
    }
    if(formValues.doc_link_photo){
      photofileUrlId = (typeof formValues.doc_link_photo === 'object') && await fileUpload(formValues.doc_link_photo);
    }
    
    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: candidateId ? Number(candidateId):'',
      doc_type: 2,
      applicant_documents: [
        {
          doc_title: 'Aadhar',
          doc: adharfileUrlId ? Number(adharfileUrlId):adharfileUrl,
        },
        {
          doc_title: 'Pan',
          doc: pancardfileUrlId ? Number(pancardfileUrlId): pancardfileUrl,
        },
        {
          doc_title: 'Photo',
          doc: photofileUrlId ? Number(photofileUrlId): photofileUrl,
        },
      ],
    };

    const { data, message } = (!customFunctions.checkIfEmpty(pancardfileUrlId) ||  pancardfileUrl && !customFunctions.checkIfEmpty(adharfileUrlId) || adharfileUrl && !customFunctions.checkIfEmpty(photofileUrlId) || photofileUrl) && await AuthApi.postDataToServer(
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
        swal.close();
      });
    } else {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        getApplicantPercentage();
        if(candidateId){
          getData();
        }
        swal.close();
      });
      }
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
