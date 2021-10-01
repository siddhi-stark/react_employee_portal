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
    const id = await props.match.params.stackId;
    await getUserRole();
    await getEmployee();
    await getTechnology();
    if(id) {
    await getData(id);
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    const technologyStack = [];
    // const technoData = {};

    formValues.addmore.map((tech) => {
      let obj = {};
      obj = {

      techstack: tech.technology.value ? tech.technology.value : '',
      is_interviewer: tech.isINterviewer.toString() === 'Yes' ? true : false, // eslint-disable-line
      };
    technologyStack.push(obj);
      return tech;
    });

    const postData = {
      employee: formValues.employee && Boolean(formValues.employee.value) ? formValues.employee.value : '',
      data: technologyStack
    };

    const payload = customFunctions.cleanObject(postData);
    const callback = 
      AuthApi.postDataToServer;
    const endPoint =
      Api.employeeStack;

    const {
      data,
    } = await callback(endPoint, payload);
    if (data) {
      history.push('/emp-stack');
    }
  };

   const getData = async (stackId) => {
    const techId = stackId;
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeStack}${techId}/`);
    if(data.data) {

    const techData = [];

    await data.data.tech_stack_ids.map((e) => {
      const find = options.technology.find(x => x.value === e);
      if (find) {

      techData.push({
        isINterviewer : data.data.is_interviewer,
        technology:{
        label: find.label,
        value: find.value
      }
      });
      }
      return e;
    });
    updateDefaultValues({
      addmore: techData,
      employee:  data.data.id && {
        label: data.data.full_name,
        value: data.data.id
      }

    });
    }
  };
    
  const getEmployee = async () => {
    // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all&is_dropdown=1`);
     const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };
    });
    options.employee = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };
      
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

    options.technology = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});

  }; 
  return (
    <>
    <div className="mt-5">

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
        showBtnClass={true}
        resetBtnText="Cancel"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}
        onFormReset={() => {}}
      />
    </div>
    </>
  );
}

export default withRouter(AddTechnologyStack);