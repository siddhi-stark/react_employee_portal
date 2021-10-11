import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './AddBondHistory.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function AddBondHistory(props) {
  // Variable declarations
  const history = customFunctions.getLocalStorage('bondHistoryID');
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };
 
  useEffect(() => {
    if(history) {
      getData(history);
    }
    getUserRole();
  }, []);
  
  const submitForm = async (formValues) => {
    setShowLoader(true);
    const employeeId = customFunctions.getLocalStorage('id');
    const postData = {
      employee: Number(employeeId),
      attachments: formValues.attachments ? formValues.attachments : '',
      bond_start_date: formValues.bond_start_date ? customFunctions.getDate(formValues.bond_start_date) : '',
      bond_end_date: formValues.bond_end_date ? customFunctions.getDate(formValues.bond_end_date) : '',
    };
     const callback = history
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = history
      ? `${Api.historyUrl}`
      : Api.historyUrl;

       if (history) {
         postData.id = history;
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
             customFunctions.removeLocalStorage('bondHistoryID');
          }
        });
    }
  };
  
  const getData = async (id) => {
    setShowLoader(true);
     const { data } = await AuthApi.getDataFromServer(`${Api.historyUrl}${id}/`);
     if(data){
     setShowLoader(false);
     data.data.bond_start_date = data.data.bond_start_date ? new Date(customFunctions.getDate(data.data.bond_start_date)) : '';
     data.data.bond_end_date = data.data.bond_end_date ? new Date(customFunctions.getDate(data.data.bond_end_date)) : '';
     const obj = {
       ...data.data,
       attachments: data.data.attachments
     };
     updateDefaultValues({...obj});    // updateDefaultValues(data);
     }
  };

  const onClear = () => {
    props.handleModalCLose(false);
  };

  return (
    <>
    <Loader showLoader={isShowLoader} needFullPage={false} />
    <StarkFormBuilder
      containerClass="mt-4 mb-3"
      formHeaderClass=""
      formSections={FormSections}
      onFormSubmit={(formValues) => {
        submitForm(formValues);
      }}
      callbacks={{}}
      defaultFormValues={defaultValues}
      currentUser={currentUser}
      submitBtnText="Submit"
      showResetBtn={true}
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

export default withRouter(AddBondHistory);
