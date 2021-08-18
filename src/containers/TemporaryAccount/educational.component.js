import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './educationalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function EducationalDetails(props) {
  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  console.log('candidateId',candidateId);
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;
  const [docId, setDocId] = useState([]);

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
    const docIdArr = [];
    const endPoint = `${Api.applicantInfoUrl}?applicant_id=${candidateId}`;
   
    const { data, message } = await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      data.data && data.data.applicant_documents.map((doc)=>{
        updateDefaultValues({
            doc_link_ssc:(doc.doc_title === 'SSC') && doc.document_url,
            doc_link_hsc:(doc.doc_title === 'HSC') && doc.document_url,
            doc_link_graduate:(doc.doc_title === 'Graduate') && doc.document_url,
            doc_link_post_graduate:(doc.doc_title === 'Post Graduate') && doc.document_url,
        });
        docIdArr.push({name: doc.doc_title, id:doc.doc_id});
        return doc;
      })
        setDocId(docIdArr);
    } else {
      console.log('error', message);
      // swal(message, '', 'error');
    }
  };

  useEffect(() => {
    console.log('candidateId',candidateId)
    if(candidateId) {
      getData();
    }
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
      return data.data.id;
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {

    let sscfileUrl = '';
    let sscfileUrlId = '';
    let hscfileUrl ='';
    let hscfileUrlId ='';
    let graduatefileUrl ='';
    let graduatefileUrlId ='';
    let postfileUrl ='';
    let postfileUrlId ='';
    
    docId && docId.map((document)=>{
      if(document.name === 'SSC'){
        sscfileUrl = document.id;
      }else if(document.name === 'HSC'){
        hscfileUrl = document.id;
      }else if(document.name === 'Graduate'){
        graduatefileUrl = document.id;
      }else if(document.name === 'Post Graduate'){
        postfileUrl = document.id;
      }
      return document;
    })
    if(formValues.doc_link_graduate){
      graduatefileUrlId =  await fileUpload(formValues.doc_link_graduate);
    }
    if(formValues.doc_link_hsc){
      hscfileUrlId =  await fileUpload(formValues.doc_link_hsc);
    }
    if(formValues.doc_link_post_graduate){
      postfileUrlId = await fileUpload(formValues.doc_link_post_graduate);
    }
    if(formValues.doc_link_ssc){
      sscfileUrlId = await fileUpload(formValues.doc_link_ssc);
    }

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: candidateId ? Number(candidateId) :'',
      doct_type: 1,
      applicant_documents: [
        {
          doc_title: 'SSC',
          doc: sscfileUrlId ? Number(sscfileUrlId) : sscfileUrl,
        },
        {
          doc_title: 'HSC',
          doc: hscfileUrlId ? Number(hscfileUrlId):hscfileUrl,
        },
        {
          doc_title: 'Graduate',
          doc: graduatefileUrlId ? Number(graduatefileUrlId):graduatefileUrl,
        },
        {
          doc_title: 'Post Graduate',
          doc: postfileUrlId ? Number(postfileUrlId):postfileUrl,
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
        // updateDefaultValues({});
        swal.close();
      });
      // show error
      // return;
    } else {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        getData();
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
