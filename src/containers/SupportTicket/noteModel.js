/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button,  } from 'react-bootstrap';
import { TextInput } from '../../components/FormInputs'; // eslint-disable-line
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Loader from '../../components/Loader';

const Addtask = (props) => {
  const { show, fromComponent, tId, callback, updateShow, data } = props; // eslint-disable-line

  // console.log('props data', data);
  const validator = useRef(new SimpleReactValidator());  // eslint-disable-line

  const [isShowLoader, setShowLoader] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [newDocument, setNewDocument] = useState('');
  const [user, setUser] = useState(0);
  const [currentUser, updateCurrentUser] = useState(0);
  const [fileId, setFileId] = useState();
  const [note, setNote] = useState('');
  const [supportId, setSupportId] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  const ticketData=props.data
  // console.log("ticketData",ticketData);
  const [supportDetails, setSupportDetails] = useState({
    title: '',
    ticket_type: null,
    description: '',
    comment: '',
    status: '',
    admin_status: '',
  });

  useEffect(()=>{
    getData()
    setSupportId(ticketData.id)
  },[])
 
// console.log("ticketData ==========>",supportId);
  const [status, setStatus] = useState([
    { label: 'Open', value: 1 },
    { label: 'Close', value: 2 },
    { label: 'Resolve', value: 4 },
    { label: 'Inprogress', value: 5 },
    { label: 'Reopen', value: 6 },
  ]);

  const submitForm = async () => {
      // console.log("formmmmms");
    // setShowLoader(true);
    const payload=ticketData;
    if(note){
        payload.comment=note;
    }
    // console.log("payload",payload);
    const postData = {
        id:ticketData.id,
      title:ticketData.title,
      description: ticketData.description,
      ticket_type: ticketData.ticket_type
        ? ticketData.ticket_type
        : '',
      comment:note,
      status: ticketData.status_id
        ? Number(ticketData.status_id)
        : Number(ticketData.admin_status),
    };
    // console.log('postData', postData);
    if (supportId) ticketData.id = supportId;
    setShowLoader(false);
// console.log("supportIdsupportId",supportId);
    // return; // eslint-disable-line
    const callback = supportId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = supportId
      ? `${Api.supportTicketUrl}${supportId}/`
      : Api.supportTicketUrl;
  //  console.log("endpointt",endPoint);
      const { data, message } = await callback(endPoint, postData);

      if (data && data.success === true) {
        setShowLoader(false);
        props.handleClose(false);
        swal(
            supportId
            ? "Support ticket updated successfully!"
            : "Support ticket created successfully!",
          "",
          "success"
        ).then(() => {
          
        });
      } else {
        setDisableButton(false);
        setShowLoader(false);
        swal(typeof message === "string" ? message : message[0], "", "error");
      }
    };

  const getData = async (editId) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.supportTicketUrl}`
    );
    if (!data) {
      return;
    }
    const statusArr = status.filter(
      (st) => st.value !== data.data.admin_status
    );
    if (Number(data.data.admin_status) === 4) {
      statusArr.splice(0, 1);
    }
    const employeeCondition =
      [1, 2].includes(currentUser) && Number(userId) === data.data.user;
    if ([1, 2].includes(currentUser) && Number(userId) !== data.data.user) {
      setStatus([{ label: 'Resolve', value: 4 }]);
      forceUpdate(count + 1);
    } else if (employeeCondition) {
      setStatus([{ label: 'Close', value: 2 }]);
      forceUpdate(count + 1);
    } else {
      setStatus(statusArr);
      forceUpdate(count + 1);
    }
    setUser(data.data.user);
    let statusCondition = null;
    if (data.data.admin_status) {
      statusCondition = data.data.admin_status;
    } else {
      statusCondition = 1;
    }
    setSupportDetails({
      ...supportDetails,
      title: data.data.title,
      comment: data.data.comment,
      description: data.data.description,
      status: !employeeCondition // eslint-disable-line
        ? [3, 4].includes(Number(currentUser)) && statusCondition
          ? statusCondition
          : null
        : data.data.status_id,
      admin_status: data.data.admin_status,
      ticket_type: {
        label: data.data.ticket_type_name,
        value: data.data.ticket_type,
      },
    });
  };
 

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Modal
        show={updateShow || show}
        onHide={props.handleClose} // eslint-disable-line
        // size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h5>Note</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
            <TextInput
              onInputChange={(e) => {
                setNote(e.target.value); 
              }}
              label="Note"
              asterisk="*"
              containerClass="form-group"
              type="text"
              as="textarea"
              name=""
              value={note}
              placeholder="Enter note"
              errorMessage={validator.current.message(
                'note',
                note,
                'required'
              )}
              autocomplete="new-files"
            />

          {/* {data[tId].is_file === true && (
            <TextInput
              onInputChange={(e) => {
                setNewDocument(e.target.files);
                if (e.target.value) {
                  uploadDocument();
                }
                forceUpdate(count + 1);
              }}
              label="Upload File"
              // asterisk="*"
              containerClass="form-group"
              type="file"
              name="file"
              // disabled={pageType == "view"}
              // value={newDocument}
              placeholder=""
              // errorMessage={validator.current.message(
              //   "document",
              //   newDocument,
              //   "required"
              // )}
              autocomplete="new-files"
            />
          )} */}
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => {
                submitForm();
              }}
            >
              Submit
            </Button>
            <Button
              className="ml-2"
              variant="secondary"
              onClick={() => {
                validator.current.hideMessages();
                // onCancel(e)
                props.handleClose(false); 
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Addtask;
