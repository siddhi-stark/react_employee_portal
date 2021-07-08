import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './candidate.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function SelectedCandidate() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
    

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    
      const { data } = await AuthApi.postDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
        return; // eslint-disable-line
      }
      // Perform success actions
      
  };
    
  const getDesignation = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.designationUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      designation: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getDesignation();
  }, []);
      

	return (

  <div className="justify-content-between mt-3">

  <StarkFormBuilder
    containerClass=''
    formHeaderClass=''
    formSections={FormSections}
    formHeading="Selected Candidate"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText="Submit"
    showResetBtn={false}
    resetBtnText="Clear"
    btnContainerClass="form-submit-buttons"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
  </div>
    

		)
}

export default withRouter(SelectedCandidate);