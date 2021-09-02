import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './note.json';
import { ModalInput } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function AddNote(props) {
  const note = props.note; //eslint-disable-line

  const value = customFunctions.getLocalStorage('isClicked');
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [leaveId, setLeaveId] = useState(null);
  const [statusId, setStatusId] = useState(null);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log('statusId',statusId);
    const reasonLabel = (statusId === 2) ? 'approve' : 'decline';
    const postData = {
      id: leaveId,
      status: Number(statusId),
      declined_reason: formValues ? formValues.notes : '',
    };

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
          // show error
          // return;
        } else {
          swal(data && data.message[0], '', 'success', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          }).then(() => {
            onCancelButton();
            props.onStatusUpdate();
            swal.close();
          });
        }
      }
    });
    // Perform success actions
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
    setShowNote(props.show);
    setLeaveId(props.leaveId);
    setStatusId(props.statusId);
  }, []);

  const onCancelButton = () => {
    props.handleModalCLose(false);
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
