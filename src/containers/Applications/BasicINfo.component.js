import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddBasicInfo.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BasicInformation() {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

  
    // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    console.log('roleId ',roleId );
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


   // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);


      let postData = {
      ...formValues,
    };

    postData = {
      ...postData,
      technologies_stack: formValues.technology ? formValues.technology.value : '',
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
    getTechnology();
    getDesignation();
  }, []);
      


  return (


  // // Usage
  // <StarkFormBuilder
  //   containerClass=''
  //   formHeaderClass=''
  //   formSections={FormSections}
  //   formHeading="Add Form"
  //   onFormSubmit={(formValues) => {submitForm(formValues);}}
  //   options={options}
  //   callbacks={{}}
  //   defaultFormValues={defaultValues}
  //   currentUser={currentUser}
  //   submitBtnText="Submit"
  //   showResetBtn={false}
  //   resetBtnText="Clear"
  //   btnContainerClass="form-submit-buttons"
  //   isStepForm={false}
    
  //   onFormReset={() => {
  //     console.log('form reset callback')
  //   }}
  // />
    


    // Usage
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
    submitBtnText={Number(currentUser) === 4 ? '' : 'Save'}
    btnContainerClass={`form-submit-buttons ${Number(currentUser) === 4 ? 'd-none' : ''}`}
    showResetBtn={false}
    resetBtnText="Clear"
    isStepForm={false}
    onFormReset={() => {
      console.log('form reset callback');
    }}
    />
    );
}

export default withRouter(BasicInformation);
