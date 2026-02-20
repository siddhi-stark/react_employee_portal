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
        // Close the modal immediately when user confirms
        setShowNote(false);
        setReasonNote('');
        handleModalCLose(false);
        
        try {
          const { data, message } = await AuthApi.putDataToServer(
            Api.leavesUrl,
            postData
          );
          console.log("API Response:", data);
          console.log("Message:", message);

          // Check if data exists and has success flag (code 200 means success in authApi)
          if (!data || (data.code !== 200 && data.code !== 201)) {
            const errorMessage = message || (data && data.message && Array.isArray(data.message) ? data.message[0] : 'Something went wrong. Please try again.');
            
            // Normalize error message for checking (ensure errorMessage exists)
            const normalizedError = (errorMessage || '').toLowerCase();
            
            // Check if it's a backend error (500) that might have still processed the request
            // If data is null, it's almost certainly a server error (500, 502, etc.)
            const isServerError = !data || // Null data = server error
                                 (errorMessage && errorMessage.includes('referenced before assignment')) || 
                                 (errorMessage && errorMessage.includes('Internal Server Error')) ||
                                 normalizedError.includes('server error') ||
                                 normalizedError.includes('500') ||
                                 normalizedError.includes('502') ||
                                 normalizedError.includes('503');
            
            // If leave is already approved/declined, or server error, refresh the list
            const shouldRefresh = normalizedError.includes('already approved') || 
                                  normalizedError.includes('already declined') ||
                                  normalizedError.includes('already') ||
                                  isServerError;
            
            // For server errors, verify if the leave was actually processed by checking its status
            if (isServerError && leaveIds) {
              try {
                // Quickly check the leave status to see if it was updated
                const { data: leaveData } = await AuthApi.getDataFromServer(
                  `${Api.leavesUrl}${leaveIds}/`
                );
                
                if (leaveData && leaveData.data) {
                  const leaveStatus = leaveData.data.status;
                  const expectedStatus = Number(statusIds);
                  
                  // If the leave status matches what we tried to set, it was successful
                  if (leaveStatus === expectedStatus) {
                    // Success! The leave was approved/declined despite the error
                    const successMessage = (leaveData.data.message && Array.isArray(leaveData.data.message)) 
                      ? leaveData.data.message[0] 
                      : `Leave ${expectedStatus === 2 ? 'approved' : 'declined'} successfully.`;
                    
                    swal(successMessage, '', 'success', {
                      closeOnClickOutside: false,
                      allowOutsideClick: false,
                      buttons: false,
                      timer: 2000,
                    }).then(() => {
                      swal.close();
                      if (onStatusUpdate) {
                        onStatusUpdate();
                      }
                      if (isSub) {
                        history.push("/employee-leaves", {});
                      }
                    });
                    return; // Exit early, don't show error
                  }
                }
              } catch (checkError) {
                // If check fails, proceed with warning message
                console.error("Error checking leave status:", checkError);
              }
            }
            
            // Show warning for server errors (may have succeeded), error for others
            const alertType = isServerError ? 'warning' : 'error';
            const alertTitle = isServerError 
              ? 'Processing...' 
              : 'Error';
            // For server errors, show a simpler message
            const alertText = isServerError
              ? 'A server error occurred, but your request may have been processed. Verifying status...'
              : errorMessage;
            
            swal({
              title: alertTitle,
              text: alertText,
              icon: alertType,
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: isServerError ? 2000 : 2000,
            }).then(() => {
              swal.close();
              // Always refresh on server errors or "already approved" type errors
              if (shouldRefresh && onStatusUpdate) {
                onStatusUpdate();
              }
              if (isSub) {
                history.push("/employee-leaves", {});
              }
            });
          } else {
            // Success - use the API response message
            const successMessage = (data && data.message && Array.isArray(data.message)) 
              ? data.message[0] 
              : 'Leave status changed successfully.';
            
            swal(successMessage, '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              // Refresh the leave list
              if (onStatusUpdate) {
                onStatusUpdate();
              }
              if (isSub) {
                history.push("/employee-leaves", {});
              }
            });
          }
        } catch (error) {
          console.error("Error submitting leave approval:", error);
          // On 500 errors, the backend might have still processed the request
          // So we'll show a warning but still refresh to check the actual status
          const errorMessage = error?.response?.data?.message 
            ? (Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message)
            : 'An error occurred, but the request may have been processed. Please refresh to verify.';
          
          swal({
            title: 'Warning',
            text: errorMessage,
            icon: 'warning',
            closeOnClickOutside: false,
            allowOutsideClick: false,
            buttons: {
              confirm: {
                text: 'OK',
                value: true,
              }
            },
          }).then(() => {
            swal.close();
            // Always refresh on error to check if the operation actually succeeded
            if (onStatusUpdate) {
              onStatusUpdate();
            }
            if (isSub) {
              history.push("/employee-leaves", {});
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
  }, [show, leaveId, statusId]);

  const onCancelButton = () => {
    setShowNote(false);
    setReasonNote('');
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
