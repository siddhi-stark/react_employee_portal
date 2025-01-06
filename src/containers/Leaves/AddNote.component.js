/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './note.json';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { DropdownInput } from '../../components/FormInputs';
import SimpleReactValidator from 'simple-react-validator';



function AddNote(props) {
  const { show, leaveId, statusId, isRevert, isSub, leavePaymentType, note, onStatusUpdate, handleModalCLose } =
    props;

  const history = useHistory();
  const validator = useRef(new SimpleReactValidator());
  const value = customFunctions.getLocalStorage('isClicked');
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [leaveIds, setLeaveId] = useState(null);
  const [statusIds, setStatusId] = useState(null);
  // const [leavesPaymentType, setLeavesPaymentType] = useState('')
  const [reasonNote, setReasonNote] = useState('');
  const [count, forceUpdate] = useState(0)



  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // const leavesPaymentStatus = [
  //   { label: "Paid", value: 1 },
  //   { label: "Unpaid", value: 2 },
  //   {}
  // ]
  const submitForm = async () => {
    const reasonLabel = statusIds === 2 ? 'approve' : 'decline';

    const postData = {
      id: leaveIds,
      // declined_reason: formValues ? formValues.notes : '',
    };

    if (!isRevert) {
      postData.status = Number(statusIds),
        postData.declined_reason = reasonNote ? reasonNote : ''
      // postData.leave_payment_type = leavesPaymentType?.value
    } else {
      postData.revert_declined_reason = reasonNote ? reasonNote : ''
      postData.revert_status = Number(statusIds)
      postData.is_revert_after_approved = true
      // postData.leave_payment_type= leavePaymentType?.value
    }

    console.log("postData", postData);

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
        console.log("data.message[0]", data.message[0]);
        console.log("data.message[0]", data);


        if (!data) {
          swal(message, '', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
            buttons: false,
            timer: 2000,
          }).then(() => {
            if (isSub) {
              history.push("/employee-leaves", {})
            } else {
              swal.close();
            }
          });
        } else {
          swal("Leave status change successfully.", '', 'success', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          }).then(() => {
            onCancelButton();
            onStatusUpdate();
            if (isSub) {
              history.push("/employee-leaves", {})
            } else {
              swal.close();
            }
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
    // setLeavesPaymentType(leavePaymentType)
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
            {/* <StarkFormBuilder
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
              onFormReset={() => { }}
            /> */}
            <Row>
              <Col >
                <Form>
                  <Form.Group controlId='formSupervision' key={10}>
                    <Form.Label>
                      Note<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as='textarea'
                      style={{ height: '100px' }}
                      type='text'
                      placeholder='Type'
                      name='reason'
                      value={reasonNote}
                      onChange={(e) => {
                        setReasonNote(e?.target?.value)
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId={`formSupervision`}></Form.Group>
                  <p className='text-danger'>
                    {validator.current.message(
                      'Note',
                      reasonNote,
                      'required'
                    )}
                  </p>
                </Form>
              </Col >
            </Row>

            {/* <Row>
              <Col >
                <DropdownInput
                  label="Leave Type"
                  asterisk="*"
                  options={leavesPaymentStatus}
                  defaultValue={leavesPaymentType}
                  onSelectHandler={(select) => {
                    setLeavesPaymentType(select);
                    // setSelectedEmployeeId(select?.value);
                  }}
                  errorMessage={validator.current.message(
                    'Leave Type',
                    leavesPaymentType,
                    'required'
                  )}
                />
              </Col>
            </Row> */}

            <Row>
              <Col>
                <Button variant="primary" onClick={(w) => {
                  if (validator.current.allValid()) {
                    validator.current.hideMessages()
                    submitForm()

                  } else {
                    validator.current.showMessages()
                    forceUpdate(count + 1)
                  }
                }}>Submit</Button>
              </Col>
            </Row>

          </>
        }
      />
    </>
  );
}

export default withRouter(AddNote);
