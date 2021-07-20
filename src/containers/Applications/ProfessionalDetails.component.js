import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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
  const[id,setId] = useState('');

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
         if(item.name === 'total' || item.name === 'relevant' || item.name === 'current' || item.name === 'expected' || item.name === 'resume' || item.name === 'reference' || item.name === 'upload') itemData.disabled = true;
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
    const {data } = await AuthApi.getDataFromServer(`${Api.applicantsUrl}${ApplicantId}/`);
      
     //  data.data.confirmation_date = data.data.confirmation_date ? new Date(customFunctions.getDate(data.data.confirmation_date)) : '';
     //  data.data.relieving_date = data.data.relieving_date ? new Date(customFunctions.getDate(data.data.relieving_date)) : '';
     //  data.data.dob = data.data.dob ? new Date(customFunctions.getDate(data.data.dob)) : '';
     //  data.data.joined_date = data.data.joined_date ? new Date(customFunctions.getDate(data.data.joined_date)) : '';
      
     // const ds = data.data.applied_for_id ? {
     //    label: data.data.applied_for_name,
     //    value: data.data.applied_for_id
     //  } : ''

     if(data) {
     const obj = {
       ...data.data,
       // applied_for: ds
     };

     updateDefaultValues({...obj})    // updateDefaultValues(data);
      } 

  };

  useEffect(() => {
    const idd = props.match.params.ID;
    setId(idd);
    getData();
  },[])


  // Submit Form
   const submitForm = async (formValues) => {
    const applicantId = customFunctions.getLocalStorage('applicantId');


    let postData = {
      ...formValues
    }

    postData ={
      ...postData,
      resume_source: formValues.resume_source ? formValues.resume_source.value : '',
    }

    const { data } = await AuthApi.putDataToServer(
      `${Api.applicantsUrl}${applicantId}/`,
      postData
    );

    if (data) {
      console.log('data',data.data.id);
      console.log('............');
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
      // btnContainerClass={`form-submit-buttons ${Number(currentUser) === 4 ? 'd-none' : ''}`}
         btnContainerClass={`form-submit-buttons ${id ? 'd-none' : ''}`}
      isStepForm={false}
      onFormReset={() => {
        console.log('form reset callback');
      }}
    />
  );
}

export default withRouter(ProfessionalDetails);
