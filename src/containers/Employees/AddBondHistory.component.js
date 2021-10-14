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
  const [attachmentId, setAttachmentId] = useState(null);

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

  const fileUpload = async (formValues) => { // eslint-disable-line
    const formData = new FormData();

    formData.append('file_name', formValues[0]);

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.fileUploadUrl}`,formData
    );
    if(customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success) { 
      return data.data.id;
    }
  };

  const submitForm = async (formValues) => {
    let fileUrlId ='';
    if(formValues.attachments){
       fileUrlId = (typeof formValues.attachments === 'object') && await fileUpload(formValues.attachments);
     }

    setShowLoader(true);
    const employeeId = customFunctions.getLocalStorage('id');
    const postData = {
      employee: Number(employeeId),
      attachement: fileUrlId ? Number(fileUrlId) : Number(attachmentId),
      start_date: formValues.bond_start_date ? customFunctions.getDate(formValues.bond_start_date) : '',
      end_date: formValues.bond_end_date ? customFunctions.getDate(formValues.bond_end_date) : '',
    };
     const callback = history
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = history
      ? `${Api.employeeBondDetailsUrl}`
      : Api.employeeBondDetailsUrl;

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
     const { data } = await AuthApi.getDataFromServer(`${Api.employeeBondDetailsUrl}${id}/`);
     if(data){
     setShowLoader(false);
     data.data.bond_start_date = data.data.start_date ? new Date(customFunctions.getDate(data.data.start_date)) : '';
     data.data.bond_end_date = data.data.end_date ? new Date(customFunctions.getDate(data.data.end_date)) : '';
     const obj = {
       ...data.data,
       attachments: data.data.file_name
     };
     setAttachmentId(data && data.data && data.data.attachement_id);
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
