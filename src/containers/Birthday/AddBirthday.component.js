import React, {useState,useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './birthday.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';


function AddBirthday() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Birthday' }]; 
    

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    setTitle('Add Birthday');
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
      
  const getType = async () => {
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
      type: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getType();
  }, []);
      
  const getEmployee = async () => {
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
      employee: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getEmployee();
  }, []);
      

	return (
		<>
		 <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div> 
		<div className="mt-5">
		<Card>

  <StarkFormBuilder
    containerClass='mt-4 mb-4'
    formHeaderClass=''
    formSections={FormSections}
    formHeading="tbirthday"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText="Submit"
    showResetBtn={true}
    resetBtnText="Cancel"
    btnContainerClass="form-submit-buttons"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
		</Card>
		</div>
    
		</>

		)
}

export default withRouter(AddBirthday);
