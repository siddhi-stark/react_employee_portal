/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import { Row, Col, Form, Button } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';


function RevokeOffer(props) {
  const { show, applicantId, handleModalCLose, onStatusUpdate } =
    props;

  const history = useHistory();
  const validator = useRef(new SimpleReactValidator());
  const value = customFunctions.getLocalStorage('isClicked');
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [applicantIds, setApplicantId] = useState(null);
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

  const submitForm = async () => {

    const postData = {
      applicant_id: applicantIds,
      revoke_reason: reasonNote,
      offer_status: 4,
    };

    console.log("postData", postData);

    onCancelButton();

    swal({
      title: 'Are you sure?',
      text: `You want to revoke the offer ?`,
      icon: 'warning',
      dangerMode: true,
      buttons: true,
      closeOnClickOutside: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result) {
        const { data, message } = await AuthApi.putDataToServer(
          Api.offerUpdateUrl,
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

            history.push("/candidates", {})

          });
        } else {
          swal("Leave status change successfully.", '', 'success', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          }).then(() => {
            onCancelButton();
            onStatusUpdate();
            history.push("/candidates", {})

          });
        }
      }
    });
  };

  useEffect(() => {
    setShowNote(show);
    setApplicantId(applicantId);
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
            <Row>
              <Col >
                <Form>
                  <Form.Group controlId='formSupervision' key={10}>
                    <Form.Label>
                      Revoke Reason<span className="text-danger">*</span>
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

export default withRouter(RevokeOffer);
