import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
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
    const id = customFunctions.getLocalStorage('id');
    console.log(formValues);

    const postData = {
      full_name: formValues.name,
      designation: formValues.designation ? formValues.designation.value : null,
      joining_date: formValues.joining_date ? customFunctions.getDate(formValues.joining_date) : '',
      personal_email: formValues.personal_id,
      email: formValues.company_id,
      mobile: formValues.number,
      confirmation_date: formValues.confirm_date ? customFunctions.getDate(formValues.confirm_date) : null,
      confirmed: formValues.confirm_date ? true : false, // eslint-disable-line
      relieving_date: formValues.relieving_date ? customFunctions.getDate(formValues.relieving_date) : null,
      relieved: formValues.relieving_date ? true : false, // eslint-disable-line
      dob: formValues.dob ? customFunctions.getDate(formValues.dob) : null,
      
    }

    console.log('postdata',postData);

    
      const { data } = await AuthApi.putDataToServer(`${Api.employeeUrl}${id}/`, postData);
      if(data) {
       console.log('message',data.message[0]);
       swal(data && data.message[0]);
       props.handleModalCLose(false);
       
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
      name: data.data.full_name,
      joining_date: data.data.date_joined ? new Date(customFunctions.getDate(data.data.date_joined)) : '' ,
      personal_id: data.data.personal_email,
      company_id: data.data.email,
      number: data.data.mobile,
      confirm_date : data.data.confirmation_date ? new Date(customFunctions.getDate(data.data.confirmation_date)) : '',
      relieving_date: data.data.relieving_date ? new Date(customFunctions.getDate(data.data.relieving_date)) : '',
      dob: data.data.dob ? new Date(customFunctions.getDate(data.data.dob)) : '',
    });
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);


  const getDesignation = async () => {
    // const id = props.match.params.stackId;
  const {data} = await AuthApi.getDataFromServer(Api.designationUrl);
  if(!data) {
    // show error
    return;
  }
  
const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
    return { label: op.name, value: op.id };
  });

  options.designation = dpOptions;
  const allOptions = options;
  await updateOptions({...allOptions});

}  


  useEffect(() => {
    getDesignation();
  },[])

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