/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import SimpleReactValidator from 'simple-react-validator';


function AddWfhNote(props) {
    const validator = useRef(new SimpleReactValidator());
    const { show, leaveId, statusId, prevData, note, handleModalCLose, callBack } =
        props;

    const value = customFunctions.getLocalStorage('isClicked');
    const [showNote, setShowNote] = useState(false);
    const [leaveIds, setLeaveId] = useState(null);
    const [statusIds, setStatusId] = useState(null);
    const [reason, setReason] = useState(null)
    const [oldData, setOldData] = useState(null)
    const [count, forceUpdate] = useState(0)
    const [currentUser, updateCurrentUser] = useState(0);

    useEffect(() => {
        getUserRole();
    }, []);

    const getUserRole = async () => {
        const roleId = await localStorage.getItem('group');
        updateCurrentUser(Number(roleId));
      };
    
    const submitForm = async () => {
        const reasonLabel = statusIds === 1 ? 'approve' : 'decline';
        let postData = oldData
        
        postData.note = reason
        postData.status = statusIds

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
                    `${Api.wfh}${leaveIds}/`,
                    postData
                );

                if (!data) {
                    swal(message, '', 'error', {
                        closeOnClickOutside: false,
                        allowOutsideClick: false,
                        buttons: false,
                        timer: 2000,
                    }).then(() => {
                        // swal.close();
                        callBack()
                    });
                } else {
                    swal(data && data.message[0], '', 'success', {
                        closeOnClickOutside: false,
                        allowOutsideClick: false,
                    }).then(() => {                        
                        callBack()
                        onCancelButton();
                    });
                }
            }
        });
    };

    useEffect(() => {
        setShowNote(show);
        setLeaveId(leaveId);
        setStatusId(statusId);
        setOldData(prevData)
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
                        <div>
                            <Form>
                                <Form.Group controlId='formSupervision' key={10}>
                                    <Form.Label>
                                        Reason<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        style={{ height: '100px' }}
                                        type='text'
                                        placeholder='Enter Reason'
                                        name='reason'
                                        value={reason}
                                        onChange={(e) => {
                                            setReason(e?.target?.value)
                                        }}
                                    />

                                </Form.Group>
                                <Form.Group controlId={`formSupervision`}></Form.Group>
                                <p className='text-danger'>
                                    {validator.current.message(
                                        'Reason',
                                        reason,
                                        'required'
                                    )}
                                </p>
                            </Form>

                            <Button variant="primary" onClick={(e)=>{
                                if (validator.current.allValid()) {
                                    validator.current.hideMessages()
                                    submitForm();
                            
                                  } else {
                                    validator.current.showMessages()
                                    forceUpdate(count + 1)
                                  }
                            }}>Submit</Button>
                        </div>
                    </>
                }
            />
        </>
    );
}

export default withRouter(AddWfhNote);
