import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddBasicInfo.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BasicInformation(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
const[id,setId] = useState('');
  
    // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, [currentUser]);

  useEffect(() => {
    if(Number(currentUser) !== 4) return; 
    if(Number(currentUser) === 4){
    const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section)=>{

      const s = {...section};
      s.fields = section.fields.map((item) => {
        const itemData = item;
         if(item.name === 'name' || item.name === 'position' || item.name === 'technology' || item.name === 'education' || item.name === 'email' || item.name === 'mobile') itemData.disabled = true;
         return itemData;
      })
      return s;
    })
  updateJsonSchema([...updatedSchema]);        
  } 
  }, [currentUser]);

   // Get data for form
  const getData = async () => {
    const ApplicantId = props.match.params.ID;
    const {data } = await AuthApi.getDataFromServer(`${Api.applicantsUrl}${ApplicantId}/`);
      
     //  data.data.confirmation_date = data.data.confirmation_date ? new Date(customFunctions.getDate(data.data.confirmation_date)) : '';
     //  data.data.relieving_date = data.data.relieving_date ? new Date(customFunctions.getDate(data.data.relieving_date)) : '';
     //  data.data.dob = data.data.dob ? new Date(customFunctions.getDate(data.data.dob)) : '';
     //  data.data.joined_date = data.data.joined_date ? new Date(customFunctions.getDate(data.data.joined_date)) : '';
      if(data) {
        
     const ds = data.data.applied_for_id ? {
        label: data.data.applied_for_name,
        value: data.data.applied_for_id
      } : ''

     const obj = {
       ...data.data,
       applied_for: ds
     };

     updateDefaultValues({...obj})    // updateDefaultValues(data);
      }

  };

  // useEffect(() => {
  //   getData();
  // }, [])


   // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);

  const techId = [];

      let postData = {
      ...formValues,
    };
    if(formValues){
      formValues.technologies_stack.map((tech)=>{
          return techId.push(tech.value);
      });
    }

    postData = {
      ...postData,
      technologies_stack: techId,
      applied_for: formValues.applied_for ? formValues.applied_for.value : '',
    }

    console.log('data',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.applicantsUrl,
      postData
      );
    if (data) {
      console.log('data',data);
      customFunctions.setLocalStorage('applicantId',data.data.id);
    }
  };
    
  const getDesignation = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.designationUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    await data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.name, value: op.id});
      return op;
    });
    // const allOptions = {
    //   ...options,
    //   applied_for: dpOptions
    // };
    // updateOptions({...allOptions});

    options.applied_for = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
    await getData();

  }

 
      
 const getTechnology = async () => {
      // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if(!data) {
      // show error
      return;
    }
    
 const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technologies_stack = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});

  }  

  useEffect(() => {
    const idd = props.match.params.ID;
    setId(idd);
    getTechnology();
    getDesignation();
  }, []);
      


  return (

<>

    <StarkFormBuilder
    containerClass="mt-3"
    formHeaderClass=""
    formSections={FormSections || jsonSchema}
    formHeading="Basic Information"
    onFormSubmit={(formValues) => {
      submitForm(formValues);
    }}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText={(Number(currentUser) === 4)  ? '' : 'Save'}
    btnContainerClass={`form-submit-buttons ${(Number(currentUser) === 4) || id ? 'd-none' : ''}`}
    showResetBtn={false}
    resetBtnText="Clear"
    isStepForm={false}
    onFormReset={() => {
      console.log('form reset callback');
    }}
    />
</>
    );

}

export default withRouter(BasicInformation);
