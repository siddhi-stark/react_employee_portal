import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './editEmployee.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';    
import customFunctions from '../../helper/customFunctions';

function EditPersonalDetails(props) {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
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
        return; // eslint-disable-line
      }
      // Perform success actions
      
  };
    

  // Get data for form
  const getData = async () => {
    const id = customFunctions.getLocalStorage('id');
    const {data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}${id}/`);
    console.log('data',data);
    if(!data) {
      // show error
      return;
    }
    updateDefaultValues({
      full_name: data.data.full_name
    });
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

  const onClear = () => {
    props.handleModalCLose(false)
  } 

	return (

  <StarkFormBuilder
    containerClass=''
    formHeaderClass=''
    formSections={FormSections}
    formHeading="Employee"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
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
      console.log('form reset callback')
      onClear();
    }}
  />
    

    

		)
}

export default withRouter(EditPersonalDetails);