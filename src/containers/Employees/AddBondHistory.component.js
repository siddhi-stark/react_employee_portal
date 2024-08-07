import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './AddBondHistory.json';

function AddBondHistory(props) {
  const { handleModalCLose, onChanges, bondType, setBondType } = props;
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
    if (history) {
      getData(history);
    }
    getUserRole();
  }, []);

  const getData = async (id) => {
    try {
      setShowLoader(true);
      const { data } = await AuthApi.getDataFromServer(
        `${Api.employeeBondDetailsUrl}${id}/`
      );
      if (data) {
        setShowLoader(false);
        data.data.bond_start_date = data.data.start_date
          ? new Date(customFunctions.getDate(data.data.start_date))
          : '';
        data.data.bond_end_date = data.data.end_date
          ? new Date(customFunctions.getDate(data.data.end_date))
          : '';
        const obj = {
          ...data.data,
          attachments: data.data.file_name,
        };
        setAttachmentId(data && data.data && data.data.attachement_id);
        updateDefaultValues({ ...obj }); // updateDefaultValues(data);
      }
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
    }
  };

  const fileUpload = async (formValues) => {
    setShowLoader(true);
    const formData = new FormData();
    try {
      formData.append('file_name', formValues?.attachments[0]);

      const { data, message } = await AuthApi.postDataToServer(
        `${Api.fileUploadUrl}`,
        formData
      );

      if (!customFunctions.checkIfEmpty(data) && data.success) {
        setShowLoader(false);
        swal(
          data.message ? data.message[0] : 'File uploaded',
          '',
          'success'
        ).then(() => {
          submitForm(formValues, data?.data?.id);
        });
      } else {
        setShowLoader(false);
        swal(message || data?.data?.message[0], '', 'error');
      }
    } catch {
      setShowLoader(false);
      swal('File not uploaded', '', 'error');
    }
  };

  const submitForm = async (formValues, fileUrlId) => {
    try {
      setShowLoader(true);

      const employeeId = customFunctions.getLocalStorage('id');
      const postData = {
        employee: Number(employeeId),
        attachement: fileUrlId ? Number(fileUrlId) : Number(attachmentId),
        start_date: formValues.bond_start_date
          ? customFunctions.getDate(formValues.bond_start_date)
          : '',
        end_date: formValues.bond_end_date
          ? customFunctions.getDate(formValues.bond_end_date)
          : '',
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

      const { data, message } = await callback(endPoint, postData);
      if (data) {
        setShowLoader(false);
        swal({
          title: data.message[0],
          icon: 'success',
        }).then((okAction) => {
          if (okAction) {
            handleModalCLose(false);
            setBondType('');
            onChanges();
            customFunctions.removeLocalStorage('bondHistoryID');
          }
        });
      } else {
        swal({
          title: message,
          icon: 'error',
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then((okAction) => {
          if (okAction) {
            handleModalCLose(false);
            setBondType('');
            onChanges();
            customFunctions.removeLocalStorage('bondHistoryID');
          }
        });
      }
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
    }
  };

  const onClear = () => {
    handleModalCLose(false);
    setBondType('');
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <StarkFormBuilder
        containerClass="mt-4 mb-3"
        formHeaderClass=""
        formSections={FormSections}
        onFormSubmit={(formValues) => {
          // submitForm(formValues);
          fileUpload(formValues);
        }}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText={bondType ? 'Update' : 'Submit'}
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
