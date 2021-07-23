import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddProfessional.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function ProfessionalDetails(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, [currentUser]);

  useEffect(() => {
    if(Number(currentUser) !== 4) return; 
    if(Number(currentUser) === 4){
      const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section)=>{

      const s = {...section};
      s.fields = section.fields.map((item) => {
        const itemData = item;
         if(item.name === 'total_exp' || item.name === 'rel_exp' || item.name === 'current_ctc' || item.name === 'expected_ctc' || item.name === 'resume' || item.name === 'reference'|| item.name === 'resume_source' || item.name === 'upload') itemData.disabled = true;
         return itemData;
      })
      return s;
    })
  updateJsonSchema([...updatedSchema]);        
  } 
  }, [currentUser]);

   const getData = async (designation) => {
    console.log(designation);
    const ApplicantId = props.match.params.ID;
    const { data } = await AuthApi.getDataFromServer(`${Api.applicantsUrl}${ApplicantId}/`);
      
     //  data.data.confirmation_date = data.data.confirmation_date ? new Date(customFunctions.getDate(data.data.confirmation_date)) : '';
     //  data.data.relieving_date = data.data.relieving_date ? new Date(customFunctions.getDate(data.data.relieving_date)) : '';
     //  data.data.dob = data.data.dob ? new Date(customFunctions.getDate(data.data.dob)) : '';
     //  data.data.joined_date = data.data.joined_date ? new Date(customFunctions.getDate(data.data.joined_date)) : '';
      
     // const ds = data.data.applied_for_id ? {
     //    label: data.data.applied_for_name,
     //    value: data.data.applied_for_id
     //  } : ''

     if(data) {
     localStorage.setItem('InterviewId',data.data.id);
     const obj = {
       ...data.data,
       // applied_for: ds
     };
     props.onProfDetInfo(data.data.id);
       if (Number(data.data.resume_source) === 1){
          obj.resume_source = {label:'Naukri' ,value:data.data.resume_source}
       } else if (Number(data.data.resume_source) === 2){
          obj.resume_source = {label:'Indeed' ,value:data.data.resume_source}
       } else if (Number(data.data.resume_source) === 3){
          obj.resume_source = {label:'Linkedin' ,value:data.data.resume_source}
       }
     updateDefaultValues({...obj})    // updateDefaultValues(data);
      } 

  };

  useEffect(() => {
    getData();
  },[])


  // Submit Form
   const submitForm = async (formValues) => {
    const applicantId = customFunctions.getLocalStorage('applicantId');
    console.log('applicantId',applicantId);

    let postData = {
      ...formValues
    }

    postData ={
      ...postData,
      resume_source: formValues.resume_source ? formValues.resume_source.value : '',
    }

    const { data, message } = await AuthApi.putDataToServer(
      `${Api.applicantsUrl}${applicantId}/`,
      postData
    );
      if (data) {
        swal(data && data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          swal.close();
        localStorage.setItem('InterviewId',data.data.id);
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
    // Perform success actions
  };

  const getResume = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.undefined);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      resume: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getResume();
  }, []);

  return (
    // Usage
    <StarkFormBuilder
      containerClass="mt-3"
      formHeaderClass=""
      formSections={FormSections || jsonSchema}
      formHeading="Professional Details"
      onFormSubmit={(formValues) => {
        submitForm(formValues);
      }}
      options={options}
      callbacks={{}}
      defaultFormValues={defaultValues}
      currentUser={currentUser}
      submitBtnText="Save"
      showResetBtn={false}
      resetBtnText="Clear"
      btnContainerClass={`form-submit-buttons ${Number(currentUser) === 4 ? 'd-none' : ''}`}
      // btnContainerClass={`form-submit-buttons ${id ? 'd-none' : ''}`}
      isStepForm={false}
      onFormReset={() => {
        console.log('form reset callback');
      }}
    />
  );
}

export default withRouter(ProfessionalDetails);
