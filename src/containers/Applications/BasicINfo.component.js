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
  const [appicantId,setAppicantId] = useState('');
  
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
         if(item.name === 'name' || item.name === 'position' || item.name === 'technologies_stack' || item.name === 'applied_for' || item.name === 'education' || item.name === 'email' || item.name === 'mobile') itemData.disabled = true;
         return itemData;
      })
      return s;
    })
  updateJsonSchema([...updatedSchema]);        
  } 
  }, [currentUser]);

   // Get data for form
  const getData = async (technology, id) => {
    // console.log('technology',technology);
    // const ApplicantId = id || props.match.params.ID;
    const {data } = await AuthApi.getDataFromServer(`${Api.applicantsUrl}${id}/`);
      // console.log('data',data);
     //  data.data.confirmation_date = data.data.confirmation_date ? new Date(customFunctions.getDate(data.data.confirmation_date)) : '';
     //  data.data.relieving_date = data.data.relieving_date ? new Date(customFunctions.getDate(data.data.relieving_date)) : '';
     //  data.data.dob = data.data.dob ? new Date(customFunctions.getDate(data.data.dob)) : '';
     //  data.data.joined_date = data.data.joined_date ? new Date(customFunctions.getDate(data.data.joined_date)) : '';
     
     const techStack = [];

    if(data) {

     if (data && data.data && data.data.tech_stack_ids && data.data.tech_stack_ids.length > 0 && technology && technology.length > 0) {
       const techStackIds = data.data.tech_stack_ids;
       await technology.map((tech) => {
       if (techStackIds.includes(tech.id)) {
         techStack.push({
           label : tech.name,
             value:  tech.id
         });
       }
       return tech;
     })
     }
    }


      if(data) {
        
     const ds = data.data.applied_for_id ? {
        label: data.data.applied_for_name,
        value: data.data.applied_for_id
      } : ''

     const obj = {
       ...data.data,
       applied_for: ds,
       technologies_stack: techStack
     };

     // props.onBasicInfo(data.data.id);

     updateDefaultValues({...obj})    // updateDefaultValues(data);
      customFunctions.setLocalStorage('applicantId',data.data.id);
      }

  };

  // useEffect(() => {
  //   getData();
  // }, [])

  useEffect(() => {
      const ApplicantId = props.match.params.id;
      setAppicantId(ApplicantId);
  },[])


   // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);

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


     const callback = appicantId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = appicantId
      ? `${Api.applicantsUrl}${appicantId}/`
      : Api.applicantsUrl;
    const { data } = await callback(endPoint, postData);


    // const { data } = await AuthApi.postDataToServer(
    //   Api.applicantsUrl,
    //   postData
    //   );

    if (data) {
      customFunctions.setLocalStorage('applicantId',data.data.id);
      //  const ApplicantId = props.match.params.id;
      //  console.log('ApplicantId',ApplicantId);
      //  if(ApplicantId) {

      // await getData(options.technologies_stack, ApplicantId);
      //  }
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
    // await getData();

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
   // console.log('applicantId',appicantId);
    if(appicantId) {

    await getData(data.data,appicantId);
    }

  }  

  useEffect(() => {
    getTechnology();
    getDesignation();
  }, [appicantId]);
      


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
    // btnContainerClass='form-submit-buttons'
    btnContainerClass={`form-submit-buttons ${Number(currentUser) === 4 ? 'd-none' : ''}`}
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
