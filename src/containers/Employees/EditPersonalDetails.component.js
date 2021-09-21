import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './editEmployee.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';    
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function EditPersonalDetails(props) {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);  
  const [isShowLoader, setShowLoader] = useState(false);


useEffect(() => {
  const employeeId = customFunctions.getLocalStorage('id');
    if(employeeId){
      const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section)=>{
      const s = {...section};
      s.fields = section.fields.map((item) => {
        const itemData = item;
         if(item.name === 'full_name') itemData.disabled = true;
         if(item.name === 'joining_date') itemData.disabled = true;
         if(item.name === 'email') itemData.disabled = true;
         if(item.name === 'mobile') itemData.disabled = true;
         if(item.name === 'confirmation_date') itemData.disabled = true;
         if(item.name === 'dob') {
        const currentdate = new Date();
        const maxdate = new Date(currentdate.setYear(currentdate.getFullYear() - 18));
        itemData.maxDate = maxdate;
         }
          if (item.name === 'confirmation_date' || item.name === 'relieving_date') {
      const date = new Date();
      itemData.minDate = date;
    }
         return itemData;
      });
      return s;
    });
  updateJsonSchema([...updatedSchema]);        
  } 
  }, []);

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
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('id');

    let postData = {
      ...formValues,
    };

    postData = {
      ...postData,
      designation: formValues.designation ? formValues.designation.value : null,
      joining_date: formValues.joining_date ? customFunctions.getDate(formValues.joining_date) : '',
      confirmation_date: formValues.confirm_date ? customFunctions.getDate(formValues.confirm_date) : null,
      confirmed: formValues.confirm_date ? true : false, // eslint-disable-line
      relieving_date: formValues.relieving_date ? customFunctions.getDate(formValues.relieving_date) : null,
      relieved: formValues.relieving_date ? true : false, // eslint-disable-line
      dob: formValues.dob ? customFunctions.getDate(formValues.dob) : null,
    };
    
    const { data } = await AuthApi.putDataToServer(`${Api.employeeUrl}${id}/`, postData);
    if(data) {
      setShowLoader(false);
     swal(data && data.message[0]);
     props.handleModalCLose(false);
     props.onPersonalDetailChanges();
    }
  };
    
  // Get data for form
  const getData = async () => {
    setShowLoader(true);

    const id = customFunctions.getLocalStorage('id');
    const {data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}${id}/`);
      if(data && data.success){
      setShowLoader(false);  
      data.data.confirmation_date = data.data.confirmation_date ? new Date(customFunctions.getDate(data.data.confirmation_date)) : '';
      data.data.relieving_date = data.data.relieving_date ? new Date(customFunctions.getDate(data.data.relieving_date)) : '';
      data.data.dob = data.data.dob ? new Date(customFunctions.getDate(data.data.dob)) : '';
      data.data.joining_date = data.data.date_joined ? new Date(customFunctions.getDate(data.data.date_joined)) : '';
     
     const ds = data.data.designation_id ? {
        label: data.data.designation_name,
        value: data.data.designation_id
      } : '';

     const obj = {
       ...data.data,
       designation: ds
     };
     updateDefaultValues({...obj});
   }
  };

  const getDesignation = async () => {
    // const id = props.match.params.stackId;
  const {data} = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
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
   getData();
}; 

  useEffect(() => {
    getDesignation();
  },[]);

  const onClear = () => {
    props.handleModalCLose(false);
  };

	return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <StarkFormBuilder
        containerClass=''
        formHeaderClass=''
        formSections={jsonSchema}
        formHeading="Employee"
        onFormSubmit={(formValues) => {submitForm(formValues);}}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={true} // eslint-disable-line
        resetBtnText="Cancel"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}
        
        onFormReset={() => {
          onClear();
        }}
      />
    </>
		);
}

export default withRouter(EditPersonalDetails);