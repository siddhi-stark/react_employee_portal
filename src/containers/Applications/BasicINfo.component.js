import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// Import section
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddBasicInfo.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function BasicInformation() {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    console.log('roleId ',roleId );
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
  console.log('section basic ---',section);

      const s = {...section};
      s.fields = section.fields.map((item) => {
        const itemData = item;
         if(item.name === 'name' || item.name === 'position' || item.name === 'technology' || item.name === 'education' || item.name === 'email' || item.name === 'mobile') itemData.disabled = true;
         return itemData;
      })
      return s;
    })
  updateJsonSchema([...updatedSchema]);        
  } 
  }, [currentUser]);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);

    const { data } = await AuthApi.postDataToServer(
      Api.employeeUrl,
      formValues
      );
    if (!data) {
      // show error
      return; // eslint-disable-line
    }
    // Perform success actions
  };

  const getTechnology = async () => {
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
      technology: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getTechnology();
  }, []);

  return (
    // Usage
    <StarkFormBuilder
    containerClass="mt-3"
    formHeaderClass=""
    formSections={FormSections || jsonSchema}
    formHeading="Basic Information"
    onFormSubmit={(formValues) => {
      submitForm(formValues);
    }}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText={Number(currentUser) === 4 ? '' : 'Save'}
    btnContainerClass={`form-submit-buttons ${Number(currentUser) === 4 ? 'd-none' : ''}`}
    showResetBtn={false}
    resetBtnText="Clear"
    isStepForm={false}
    onFormReset={() => {
      console.log('form reset callback');
    }}
    />
    );
}

export default withRouter(BasicInformation);
