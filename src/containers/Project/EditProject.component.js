import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import FormSections from './EditProject.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function EditProject() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const title = 'Edit Project';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Edit Project' }];

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    
      const { data, message } = await AuthApi.putDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
      // Perform success actions
  };
    
  // Get data for form
  const getData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);
      
  const getCoordinator = async () => {
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
      coordinator: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getCoordinator();
  }, []);
      

	return (
		<>
		 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Edit Project</h2>
        <Breadcrumb items={items} />
      </div>
		<div className='mt-5'>
    <Card>
      <StarkFormBuilder
        containerClass='mt-4'
        formHeaderClass=''
        formSections={FormSections}
        onFormSubmit={(formValues) => {submitForm(formValues);}}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={true}
        resetBtnText="Cancel"
        btnContainerClass="form-submit-buttons mb-3"
        isStepForm={false}
        onFormReset={() => {
          history.push('/project');
        }}
      />
    </Card>
		</div>
		</>

		)
}

export default withRouter(EditProject);