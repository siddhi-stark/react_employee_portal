import React, { useState,useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './note.json';
import {ModalInput} from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';    
import customFunctions from '../../helper/customFunctions';

function AddNote(props) {
  const note = props.note; //eslint-disable-line

  const value = customFunctions.getLocalStorage('isClicked');
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote,setShowNote] = useState(false);
  // const [id,setStatusId] = useState('');
  // const [status,setStatusData] = useState('');

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form

  const submitForm = async (formValues) => { // eslint-disable-line
    const postData = {
      // id: leaveId,
      status: 3,
      declined_reason: formValues ? formValues.notes :''
    };

    onCancelButton();

    swal({
      title: 'Are you sure?',
      text: `You want to declined the leave ?`,
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
          // updateDefaultValues({});
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
          swal.close();
        });
       }
      }
    });
    // Perform success actions
  };
    

  const getData = async () => {
    const NotesData = {
      notes: note && note
    }
    updateDefaultValues(NotesData);
  };

  useEffect(() => {
    if(value === 'true') {
     getData();
    }
    setShowNote(props.show);
    // setStatusId(props.statusId);
    // setStatusData(props.statusData);
    // setNoteData(props.note);
  }, []);

  const onCancelButton = () => {
  	props.handleModalCLose(false);
  }
      

	return (
		<>
       <ModalInput
        size="sm"
        centered
        show={showNote}
        onHide={onCancelButton}
        className= "status-reason-popup"
        id="contained-modal-title-center"
        modalHeaderClass="reson-text-title d-flex align-items-center"
        label="Reason"
        modalBody={
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
    submitBtnText= 'Submit'
    showResetBtn={false}
    resetBtnText="Cancel"
    btnContainerClass={!value ? 'form-submit-buttons' : 'd-none'}
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
    </>

        }
        />
		</>
		)
}

export default withRouter(AddNote);