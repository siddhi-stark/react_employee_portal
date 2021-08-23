import React, { useState,useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddLeave.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';   

function AddLeave() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
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
    
      const { data } = await AuthApi.putDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
        // return;
      }
      // Perform success actions
      
  };
    

  // Get data for form
  const getData = async () => {
    const {data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);
      
  const getLeaveType = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
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
      leave_type: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getLeaveType();
  }, []);
      
  const getLeaveFromType = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
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
      leave_from_type: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getLeaveFromType();
  }, []);
      
  const getLeaveToType = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
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
      leave_to_type: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getLeaveToType();
  }, []);
  
  const onLeaveTypeSubmit = (value) => {
  	console.log('value',value);
  }    

	return (
		
  <>
  <div className="mt-5">
	<StarkFormBuilder
    containerClass=''
    formHeaderClass=''
    formSections={FormSections}
    formHeading="Leave"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
   callbacks={{
onLeaveType: (value) => { onLeaveTypeSubmit(value) }
}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText="Check task"
    showResetBtn={true}
    resetBtnText="Clear"
    btnContainerClass="form-submit-buttons"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
  </div>
 </>   

		)
}

export default withRouter(AddLeave);