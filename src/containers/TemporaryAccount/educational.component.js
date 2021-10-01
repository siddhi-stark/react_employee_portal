import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './educationalFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function EducationalDetails(props) {
  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  const applicantId = accProps.props.applicantId;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;
  const [docId, setDocId] = useState([]);
  const [isShowLoader,setShowLoader] = useState(false);
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const getData = async () => {
    let ssc = '';
    let hsc = '';
    let graduate = '';
    let postGraduate = '';
    const docIdArr = [];

    const endPoint = candidateId ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`:`${Api.applicantInfoUrl}`;

    const postData = {
        email_hash: tokenProps,
        password: passwordProps,
      };

    const { data, message } = applicantId ? await AuthApi.postDataToServer(endPoint,postData) :
    await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
       data.data && data.data.applicant_documents && data.data.applicant_documents.map((doc)=>{
        if(doc.doc_title === 'SSC'){
          ssc = doc.document_url;
        } else if(doc.doc_title === 'HSC'){
          hsc = doc.document_url;
        } else if(doc.doc_title === 'Graduation'){
          graduate = doc.document_url;
        } else if(doc.doc_title === 'Post Graduate'){
          postGraduate = doc.document_url;
        }

        docIdArr.push({name: doc.doc_title, id:doc.doc_id});

        return doc;
      });
      updateDefaultValues({
        doc_link_ssc: ssc,
        doc_link_hsc:hsc,
        doc_link_graduate:graduate,
        doc_link_post_graduate:postGraduate,
      });
      
      setDocId(docIdArr);
    } else {

       swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });

    }
  };

  useEffect(() => {
    if(candidateId || applicantId) {
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

  const submitForm = async (formValues) => {
    setShowLoader(true);

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
      }else if(document.name === 'Graduation'){
        graduatefileUrl = document.id;
      }else if(document.name === 'Post Graduate'){
        postfileUrl = document.id;
      }
      return document;
    });

    if(formValues.doc_link_graduate){
      graduatefileUrlId =  (typeof formValues.doc_link_graduate === 'object') && await fileUpload(formValues.doc_link_graduate);
    }
    if(formValues.doc_link_hsc){
      hscfileUrlId =  (typeof formValues.doc_link_hsc === 'object') && await fileUpload(formValues.doc_link_hsc);
    }
    if(formValues.doc_link_post_graduate){
      postfileUrlId = (typeof formValues.doc_link_post_graduate === 'object') && await fileUpload(formValues.doc_link_post_graduate);
    }
    if(formValues.doc_link_ssc){
      sscfileUrlId = (typeof formValues.doc_link_ssc === 'object') && await fileUpload(formValues.doc_link_ssc);
    }

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: candidateId ? Number(candidateId) :'',
      doc_type: 1,
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
          doc_title: 'Graduation',
          doc: graduatefileUrlId ? Number(graduatefileUrlId):graduatefileUrl,
        },
        {
          doc_title: 'Post Graduate',
          doc: postfileUrlId ? Number(postfileUrlId):postfileUrl,
        },
      ],
    };

   const { data, message } = (!customFunctions.checkIfEmpty(graduatefileUrlId) || graduatefileUrl && !customFunctions.checkIfEmpty(hscfileUrlId) || hscfileUrl && !customFunctions.checkIfEmpty(postfileUrlId) || postfileUrl && !customFunctions.checkIfEmpty(sscfileUrlId) || sscfileUrl) && await AuthApi.postDataToServer(
     `${Api.applicantDocumentUrl}`,
      postData
    );
   if (!data) {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
      
    } else {
      setShowLoader(false);
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
     <Loader showLoader={isShowLoader} needFullPage={false} />
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Educational Details"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        showBtnClass={true}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons mb-4"
        isStepForm={false}
      />
    </>
  );
}

export default withRouter(EducationalDetails);
