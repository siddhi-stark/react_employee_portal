import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddHistory.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function AddHistory(props) {

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

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }
    const dpOptions = await data && data.data.length > 0 && data.data.map((op) => { // eslint-disable-line
      return { label: op.name, value: op.id };
    });

    options.designation = dpOptions;
    const allOptions = options;
    await updateOptions(allOptions);
  };

  useEffect(() => {
    getDesignation();
  }, []);

  const onClear = () => {
    props.handleModalCLose(false);
  };

  return (
    <StarkFormBuilder
      containerClass='mb-3'
      formHeaderClass=''
      formSections={FormSections}
      onFormSubmit={(formValues) => { submitForm(formValues); }}
      options={options}
      callbacks={{}}
      defaultFormValues={defaultValues}
      currentUser={currentUser}
      submitBtnText="Submit"
      showResetBtn={true}
      resetBtnText="Clear"
      btnContainerClass="form-submit-buttons"
      isStepForm={false}

      onFormReset={() => {
        console.log('form reset callback');
        onClear();
      }}
    />
  );
}

export default withRouter(AddHistory);