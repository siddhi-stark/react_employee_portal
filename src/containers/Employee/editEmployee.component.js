import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './editEmployee.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function EditEmployee() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);

  const formSchema = [...FormSections];
    formSchema[0].fields.map((section)=>{
      console.log('section',section);
    // const sectionData = section;
    // if(sectionData.name === 'fromDate'){
    // const date = new Date();
    // sectionData.minDate = date;
    // }
    return section;
  });

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
    console.log('formValues',formValues);
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

  return (
    <div className="mt-">
    <Card body>
      <div className="d-flex justify-content-left mt-4">
        <p>Employee Name- Shubham Bhise</p>
        <p className='ms-4'>Employee Date- 20/02/2021</p>
      </div>
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
        showResetBtn={false}
        // resetBtnText="Clear"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}

        // onFormReset={() => {
        //   console.log('form reset callback');
        // }}
      />
    </Card>
    </div>
  );
}

export default withRouter(EditEmployee);

