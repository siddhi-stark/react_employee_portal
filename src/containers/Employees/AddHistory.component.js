import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './AddHistory.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function AddHistory(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

//   {
// "employee": 2,
// "designation": "Front developer",
// "company_name": "TCS",
// "start_date": "2021-01-01",
// "end_date": "2022-01-3",
// "location": "Pune India",
// "employement_type": 2
// }


  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    const employeeId = customFunctions.getLocalStorage('id');
     const history = customFunctions.getLocalStorage('hisotryID');
    const postData = {
      employee: Number(employeeId),
      designation: formValues.designation ? formValues.designation.label : '',
      company_name: formValues.company_name,
      start_date: formValues.start_date ? customFunctions.getDate(formValues.start_date) : '',
      end_date: formValues.end_date ? customFunctions.getDate(formValues.end_date) : '',
      location: formValues.location,
    }
     const callback = history
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = history
      ? `${Api.historyUrl}`
      : Api.historyUrl;

       if (history) {
         postData.id = history;
         postData.employee = employeeId;
       } 

    const { data } = await callback(endPoint, postData);
    if(data) {
      swal({
        title: data.message[0],
        icon: 'success',
      })
        .then(okAction => {
          if (okAction) {
       props.handleModalCLose(false);
       props.onChanges();
       customFunctions.removeLocalStorage('id');
       customFunctions.removeLocalStorage('hisotryID');
          }
        });
    }
  };

  // Get data for form
  const getData = async (id, designation) => {
    console.log('getData',id);
    console.log('designation',designation);
     const { data } = await AuthApi.getDataFromServer(`${Api.historyUrl}${id}/`);
     console.log('data',data.data);
     let des = {};

     await designation.map((ds) => {
       console.log('data.data.designation === des.name',data.data.designation === ds.name);
       console.log('data.data.designation',data.data.designation);
       console.log('des.name',ds.id);
       if(data.data.designation.toString() === ds.name.toString()) {
         des = {
           label: ds.name,
           value: ds.id
         }
       }
       console.log('des',des);
       return ds;
     });
     data.data.start_date = data.data.start_date ? new Date(customFunctions.getDate(data.data.start_date)) : '';
     data.data.end_date = data.data.end_date ? new Date(customFunctions.getDate(data.data.end_date)) : '';
     const obj = {
       ...data.data,
       designation: des
     };
     updateDefaultValues({...obj})    // updateDefaultValues(data);
     console.log('obj', obj);
  };

  // Call get data method on load
  useEffect(() => {
    // const {optionsData} = props;
    // console.log('optionsData', optionsData);
    // optionsData.start_date = optionsData.start_date ? new Date(customFunctions.getDate(optionsData.start_date)) : '',
    // optionsData.end_date = optionsData.end_date ? new Date(customFunctions.getDate(optionsData.end_date)) : '',
    // updateDefaultValues({
    //   company_name: optionsData.company_name,
    //   designation: optionsData.designation,
    //   location: optionsData.location,
    // });
    }, []);

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }
    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        // eslint-disable-line
        return { label: op.name, value: op.id };
      });

    options.designation = dpOptions;
    const allOptions = options;
    await updateOptions(allOptions);
    const history = customFunctions.getLocalStorage('hisotryID');
    console.log('history',history);
    if(history) {

    getData(history,data.data);
    }
  };

  useEffect(() => {
    getDesignation();
  }, []);

  const onClear = () => {
    props.handleModalCLose(false);
  };

  return (
    <StarkFormBuilder
      containerClass="mb-3"
      formHeaderClass=""
      formSections={FormSections}
      onFormSubmit={(formValues) => {
        submitForm(formValues);
      }}
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
        console.log('form reset callback');
        onClear();
      }}
    />
  );
}

export default withRouter(AddHistory);
