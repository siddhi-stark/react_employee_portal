import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './NewInterviewRounds.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

// let filterOptions = {};
function NewInterviewRounds() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [options, updateOptions] = useState({});
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
    const id = customFunctions.getLocalStorage('applicantId');
    console.log('formValues',formValues.addmore[0].int_date);
    const postData = {

      int_date: formValues.addmore[0].int_date ? customFunctions.getDate(formValues.addmore[0].int_date) : '',
      int_time: formValues.addmore[0].int_time ? customFunctions.getTime(formValues.addmore[0].int_time) : '',
      round_status: formValues.addmore[0].round_status ? formValues.addmore[0].round_status.value : '',
      interviewer: formValues.addmore[0].interviewer ? formValues.addmore[0].interviewer.value : '',
      applicant: id
    }

    console.log('postData',postData);

    // console.log('postData',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      postData
    );
    if (data) {
      console.log('data',data);
    }
      
  };
    

  const getData = async () => {
    // console.log(designation);
    // const ApplicantId = props.match.params.ID;
    const Interview = customFunctions.getLocalStorage('InterviewId');
    const {data } = await AuthApi.getDataFromServer(`${Api.roundsUrl}?applicant_id=${Interview}`);
      console.log('data',data);
      if(data) {
        
    const intDate = data.data.int_date ? customFunctions.getDate(data.data.int_date) : '';
    data.data.int_date = intDate ? new Date(intDate) : '';
    const intTime = data.data.int_time ? new Date(intDate + ' ' + data.data.int_time) : ''; //eslint-disable-line
    console.log('inttime',intTime);

     const ds = data.data.interviewer_id ? {
        label: data.data.interviewer_name,
        value: data.data.interviewer_id
      } : ''   

       const interw = data.data.round_type ? {
        label: data.data.round_type_name,
        value: data.data.round_type
      } : ''  

    
     const obj = {
       int_date: data.data.int_date,
       int_time: intTime,
       interviewer: ds,
       round_status: interw
     };

     console.log('object',obj);

     updateDefaultValues({...[{addrounds:[{...obj}]}]})    // updateDefaultValues(data);
      }

  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);
      
  const getInterviewer = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getInterviewer();
  }, []);
      

const sampleObject = {
  addrounds : [{

   int_date: new Date(),
       int_time: new Date(),

  interviewer: {


label: 'Rahul Shinde',
value: 4
  },
  round_status: {
label: 'hr screening',
value: 1
}
}]
}

// const sampleObject = {
//   int_date: new Date(),
//        int_time: new Date(),

//   interviewer: {


// label: 'Rahul Shinde',
// value: '4'
//   },
//   round_status: {
// label: 'hr screening',
// value: 1
// }
// }
      

	return (
    <>
   

  <StarkFormBuilder
    containerClass=''
    formHeaderClass=''
    formSections={FormSections}
    formHeading="form"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
    callbacks={{}}
    defaultFormValues={sampleObject}
    currentUser={currentUser}
    submitBtnText="Submit"
    showResetBtn={false}
    resetBtnText="Clear"
    btnContainerClass="form-submit-buttons"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
  

  
    </>

    

    

		)
}

export default withRouter(NewInterviewRounds);