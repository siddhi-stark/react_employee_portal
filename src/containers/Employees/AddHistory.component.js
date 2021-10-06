import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './AddHistory.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function AddHistory(props) {
  // Variable declarations
    const history = customFunctions.getLocalStorage('hisotryID');
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };
 
 const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  useEffect(() => {
    getUserRole();
  }, []);

  
  const submitForm = async (formValues) => {
    setShowLoader(true);
    const employeeId = customFunctions.getLocalStorage('id');
    const postData = {
      employee: Number(employeeId),
      designation: formValues.designation ? formValues.designation.label : '',
      company_name: formValues.company_name,
      start_date: formValues.start_date ? customFunctions.getDate(formValues.start_date) : '',
      end_date: formValues.end_date ? customFunctions.getDate(formValues.end_date) : '',
    };
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
      setShowLoader(false);
      swal({
        title: data.message[0],
        icon: 'success',
      })
        .then(okAction => {
          if (okAction) {
       props.handleModalCLose(false);
       props.onChanges();
       customFunctions.removeLocalStorage('hisotryID');
          }
        });
    }
  };
  
  const getData = async (id, designation) => {
    setShowLoader(true);
     const { data } = await AuthApi.getDataFromServer(`${Api.historyUrl}${id}/`);
     let des = {};
     if(data){
     setShowLoader(false);
     await designation.map((ds) => {
       if(data.data.designation.toString() === ds.name.toString()) {
         des = {
           label: ds.name,
           value: ds.id
         };
       }
       return ds;
     });
     data.data.start_date = data.data.start_date ? new Date(customFunctions.getDate(data.data.start_date)) : '';
     data.data.end_date = data.data.end_date ? new Date(customFunctions.getDate(data.data.end_date)) : '';
     const obj = {
       ...data.data,
       designation: des
     };
     updateDefaultValues({...obj});    // updateDefaultValues(data);
     }
  };

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
    if (!data) {
      return;
    }

 const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };

    });
    options.designation = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});

    if(history) {
    getData(history,data.data);
    }
  };

  useEffect(() => {
    getDesignation();
  }, [history]);

  const onClear = () => {
    props.handleModalCLose(false);
  };

  return (
    <>
    <Loader showLoader={isShowLoader} needFullPage={false} />
    <StarkFormBuilder
      containerClass="mt-4 mb-3"
      formHeaderClass=""
      formSections={formSchema}
      onFormSubmit={(formValues) => {
        submitForm(formValues);
      }}
      options={options}
      callbacks={{}}
      defaultFormValues={defaultValues}
      currentUser={currentUser}
      submitBtnText="Submit"
      showResetBtn={true} // eslint-disable-line
      showBtnClass={true}
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

export default withRouter(AddHistory);
