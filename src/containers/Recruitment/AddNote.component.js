/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './note.json';

function AddNote(props) {
  const { note, handleModalCLose, onStatusUpdate, show, statusId, statusData } =
    props;
  const value = customFunctions.getLocalStorage('isClicked');
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [id, setStatusId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const postData = {
      notes: formValues ? formValues.notes : '',
      ids: [id],
      status: statusData.label === 'Declined' ? 6 : 2,
    };

    const { data } = await AuthApi.putDataToServer(
      `${Api.bulkStatusUrl}`,
      postData
    );

    if (data) {
      setShowLoader(false);
      handleModalCLose(false);
      swal({
        title: data.message[0],
        icon: 'success',
      }).then((okAction) => {
        if (okAction) {
          handleModalCLose(false);
          onStatusUpdate();
        }
      });
    }
  };

  const getData = async () => {
    const NotesData = {
      notes: note && note,
    };
    updateDefaultValues(NotesData);
  };

  useEffect(() => {
    if (value === 'true') {
      getData();
    }
    setShowNote(show);
    setStatusId(statusId);
  }, []);

  const onCancelButton = () => {
    handleModalCLose(false);
    customFunctions.removeLocalStorage('isClicked');
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <ModalInput
        size="md"
        centered
        show={showNote}
        onHide={onCancelButton}
        className="status-reason-popup"
        id="contained-modal-title-center"
        modalHeaderClass="reson-text-title d-flex align-items-center"
        label="Reason"
        modalBody={
          <>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              onFormSubmit={(formValues) => {
                submitForm(formValues);
              }}
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Submit"
              showResetBtn={false}
              showBtnClass={true}
              resetBtnText="Cancel"
              btnContainerClass={!value ? 'form-submit-buttons' : 'd-none'}
              isStepForm={false}
            />
          </>
        }
      />
    </>
  );
}

export default withRouter(AddNote);
