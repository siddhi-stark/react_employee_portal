import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddProfessional.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function ProfessionalDetails() {
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
         if(item.name === 'total' || item.name === 'relevant' || item.name === 'current' || item.name === 'expected' || item.name === 'resume' || item.name === 'reference' || item.name === 'upload') itemData.disabled = true;
         return itemData;
      })
      return s;
    })
  updateJsonSchema([...updatedSchema]);        
  } 
  }, [currentUser]);

  // Submit Form
  const submitForm = async (formValues) => {

    let postData = {
      ...formValues
    }

    postData ={
      ...postData,
      resume_source: formValues.resume_source ? formValues.resume_source.value : '',
    }

    const { data } = await AuthApi.postDataToServer(
      Api.applicantsUrl,
      postData
    );

    if (data) {
      console.log('data',data.data.id);
      console.log('............');
      customFunctions.setLocalStorage('applicantId',data.data.id);
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
      isStepForm={false}
      onFormReset={() => {
        console.log('form reset callback');
      }}
    />
  );
}

export default withRouter(ProfessionalDetails);
