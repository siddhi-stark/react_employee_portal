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
 console.log('noteinside function',note);

    const value = customFunctions.getLocalStorage('isClicked');
    console.log('value',value);
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote,setShowNote] = useState(false);
  const [id,setStatusId] = useState('');

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);

    const postData = {
    	notes:formValues ? formValues.notes : '',
    	ids: [id],
    	status: 6
    };
    
      const { data } = await AuthApi.putDataToServer(`${Api.bulkStatusUrl}`, postData);
      
      if(data) {
      	console.log('data',data);
         swal(data.message[0], '','success')
          props.handleModalCLose(false);
      }
      
  };
    

  // Get data for form
  const getData = async () => {
    const {data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}?is_dropdown=1`);
    if(!data) {
      // show error
      return;
    // const {data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    // if(!data) {
    //   // show error
    //   return;
    // }
    const NotesData = {
      notes: note && note
    }
    updateDefaultValues(NotesData);
  };

  // Call get data method on load
  useEffect(() => {
    if(value === 'true') {
     getData();
    }
    setShowNote(props.show);
    setStatusId(props.statusId);
    // setNoteData(props.note);
  }, []);

  const onCancelButton = () => {
  	props.handleModalCLose(false);
    customFunctions.removeLocalStorage('isClicked');
  }
      

	return (
		<>
		{console.log('defaultValues',defaultValues)}
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