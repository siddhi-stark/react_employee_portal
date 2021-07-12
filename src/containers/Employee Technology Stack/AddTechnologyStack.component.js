import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './techstack.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function AddTechnologyStack(props) {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({
    employee : [],
    technology : []
  });
  const [currentUser, updateCurrentUser] = useState(0);
  const history = useHistory();


  
  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    onInit();
  }, []);

  const onInit = async () => {
    await getUserRole();
    await getEmployee();
    await getTechnology();
  }

  // Submit Form
  const submitForm = async (formValues) => {
     // console.log('formValues',formValues);
    const technologyStack = [];
    // const technoData = {};

    formValues.addmore.map((tech) => {
      let obj = {};
      obj = {

      techstack: tech.technology.value ? tech.technology.value : '',
      is_interviewer: tech.isINterviewer.toString() === 'true' ? true : false, // eslint-disable-line
      }
    technologyStack.push(obj);
      return tech;
    })
   

    const postData = {
      employee: formValues.employee && Boolean(formValues.employee.value) ? formValues.employee.value : '',
      data: technologyStack
    }

    // console.log('postData',postData);
    const payload = customFunctions.cleanObject(postData);
    const callback = 
      AuthApi.postDataToServer;
    const endPoint =
      Api.employeeStack;

    const {
      data,
      
    } = await callback(endPoint, payload);
    if (data) {
      // console.log('data', data, message);
      history.push('/emp-stack');
    }
      
  };

   const getData = async (stackId, technology) => {
     console.log('stackid',stackId);
    const technoData = technology;
    console.log(technoData,'technology');
    const techId = stackId;
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeStack}${techId}/`);
    console.log('data',data);
    // let techData = {};

    // await technoData.map((tech) => {
    //   if(data.data.name === tech.name) {
    //     techData = {
    //       label : tech.name,
    //       value : tech.id,

    //     }

    //   }
    //   return tech;
    // })
    // updateDefaultValues({
    //   technology: techData
    // });
  };
    
  const getEmployee = async () => {
    const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all`);
     if(id) {
        let emp = {};
        data.data.map((employee) => {
          if(Number(id) === Number(employee.id)) {
            emp = {
              label : employee.full_name,
              value : employee.id
            }
          }
          updateDefaultValues({
            employee : emp
          })

          return employee;
        })
      }
    
     const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };

    });
    options.employee = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  }
      
   const getTechnology = async () => {
      const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if(!data) {
      // show error
      return;
    }
    
 const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technology = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
    if(id) {

    await getData(id,data.data);
    await getEmployee();
    }

  }   

  return (
    <>
  <StarkFormBuilder
    containerClass=''
    formHeaderClass=''
    formSections={FormSections}
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText="Submit"
    showResetBtn={true}
    resetBtnText="Clear"
    btnContainerClass="form-submit-buttons"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
    


    </>
  );
}

export default withRouter(AddTechnologyStack);