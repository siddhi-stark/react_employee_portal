import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddTechStack.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function AddTechnologyStack() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  // Get user role
  const getUserRole = async () => {
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
    if (!data) {
      // show error
      return; // eslint-disable-line
    }
    // Perform success actions
  };

  // Get data for form
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      employee: dpOptions
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployee();
  }, []);

  

  const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technology = dpOptions;
    const allOptions = options;
    await updateOptions(allOptions);
  };

  useEffect(() => {
    getTechnology();
  }, []);

  return (
    <>
      <StarkFormBuilder
        containerClass=''
        formHeaderClass=''
        formSections={FormSections}
        onFormSubmit={(formValues) => { submitForm(formValues); }}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={true} // eslint-disable-line
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}

        onFormReset={() => {
          console.log('form reset callback');
        }}
      />
    </>
  );
}

export default withRouter(AddTechnologyStack);