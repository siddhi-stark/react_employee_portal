/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './note.json';

function AddNote(props) {
  const { show, leaveId, statusId, isRevert, note, onStatusUpdate, handleModalCLose } =
    props;

  const value = customFunctions.getLocalStorage('isClicked');
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [leaveIds, setLeaveId] = useState(null);
  const [statusIds, setStatusId] = useState(null);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    const reasonLabel = statusIds === 2 ? 'approve' : 'decline';
    
    const postData = {
      id: leaveIds,
      // declined_reason: formValues ? formValues.notes : '',
    };
    
    if (!isRevert){
      postData.status = Number(statusIds),
      postData.declined_reason = formValues ? formValues.notes : ''
    }else{
      postData.revert_declined_reason = formValues ? formValues.notes : ''
      postData.revert_status = Number(statusIds)
      postData.is_revert_after_approved = true
    }

    onCancelButton();

    swal({
      title: 'Are you sure?',
      text: `You want to ${reasonLabel} the leave ?`,
      icon: 'warning',
      dangerMode: true,
      buttons: true,
      closeOnClickOutside: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result) {
        const { data, message } = await AuthApi.putDataToServer(
          Api.leavesUrl,
          postData
        );

        if (!data) {
          swal(message, '', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
            buttons: false,
            timer: 2000,
          }).then(() => {
            swal.close();
          });
        } else {
          swal(data && data.message[0], '', 'success', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          }).then(() => {
            onCancelButton();
            onStatusUpdate();
            swal.close();
          });
        }
      }
    });
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
    setLeaveId(leaveId);
    setStatusId(statusId);
  }, []);

  const onCancelButton = () => {
    handleModalCLose(false);
  };

  return (
    <>
      <ModalInput
        size="sm"
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
              onFormReset={() => {}}
            />
          </>
        }
      />
    </>
  );
}

export default withRouter(AddNote);
