import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './formschema.json';
import { ModalInput } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function AppovalStatus(props) {

  const [currentUser, updateCurrentUser] = useState(0);
  const [show, setShow] = useState(false);
  const [statusId, setStatusId] = useState(null);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    const postData = {
      ids: [statusId],
      status: formValues && Number(formValues.approval_status),
    };

    onCancelButton();

    swal({
      title: 'Are you sure?',
      text: `You want to change approval status the policy?`,
      icon: 'warning',
      dangerMode: true,
      buttons: true,
      closeOnClickOutside: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result) {
        const { data, message } = await AuthApi.putDataToServer(
          Api.policyStatusUrl,
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
            props.onStatusUpdate();
            swal.close();
          });
        }
      }
    });
  };

  useEffect(() => {
    setShow(props.show);
    setStatusId(props.approvalId);
  }, []);

  const onCancelButton = () => {
    props.handleModalCLose(false);
  };

  return (
    <>
      <ModalInput
        size="md"
        centered
        show={show}
        onHide={onCancelButton}
        className="status-reason-popup"
        id="contained-modal-title-center"
        label="Approval Status"
        modalBody={
          <>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              formHeading="Approval Status"
              onFormSubmit={(formValues) => {
                submitForm(formValues);
              }}
              callbacks={{}}
              currentUser={currentUser}
              submitBtnText="Submit"
              showResetBtn={true}
              resetBtnText="Cancel"
              btnContainerClass=" filter-apply-btns"
              showBtnClass={false}
              isStepForm={false}
              onFormReset={() => {
                onCancelButton();
              }}
            />
          </>
        }
      />
    </>
  );
}

export default withRouter(AppovalStatus);
