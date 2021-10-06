import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './TeamAddLeave.json';
import { Helmet, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function TeamAddLeave(props) {
  const idProps = props;
  const leaveId = idProps.match.params.viewLeaveId;
  const employeeOptions = idProps.location.state ? idProps.location.state.employee : '';
  const viewOptions = idProps.location.state ? idProps.location.state.isView : '';

  const history = useHistory();
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    setTitle(!viewOptions ? 'Edit Leaves' : 'View Leaves');
  }, []);
 
  const submitForm = async (value) => { // eslint-disable-line
    const reasonLabel = (Number(value) === 2) ? 'accept': 'declined'; 
    const postData = {
      id: leaveId,
      status: Number(value),
      declined_reason: reason ? String(reason) :''
    };

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
          if(employeeOptions) {
            history.push('/employee-leaves'); 
          } else {
            history.push('/team-leaves');
          }
          swal.close();
        });
       }
      }
    });
  };
  
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.leavesUrl}${leaveId}/`
    );
    if (!data) {
      return;
    }
    if(data && data.data){
      setReason(data.data.declined_reason);
      setStatus(data.data.status_name);
      setName(data.data.user_name);
    }
    updateDefaultValues({
      leave_type: data.data.leave_type && data.data.leave_type,
      reason: data.data.reason && data.data.reason,
      leave_from_date:
        data.data.leave_from_date &&
        customFunctions.getDMYDate(data.data.leave_from_date),
      leave_from_type: data.data.leave_from_type_name && data.data.leave_from_type_name,
      leave_from_time: data.data.leave_from_time && data.data.leave_from_time,
      leave_to_date:
        data.data.leave_to_date &&
        customFunctions.getDMYDate(data.data.leave_to_date),
      leave_to_time: data.data.leave_to_time && data.data.leave_to_time,
      leave_to_type: data.data.leave_to_type_name && data.data.leave_to_type_name,
    });
  };
  
  useEffect(() => {
    if (leaveId) getData();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Leaves</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card body>
            <Button className="float-end" onClick= {() => viewOptions ? history.push('/team-leaves') : history.push('/employee-leaves')} >Back</Button>
          <p className="ms-4">Employee Name: {name} ({status})</p>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              formHeading="Leave"
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Check task"
              showResetBtn={true}
              showBtnClass={true}
              resetBtnText="Cancel"
              btnContainerClass= {Number(currentUser) === 4 ? 'form-submit-buttons':'d-none'}
              isStepForm={false}
              onFormReset={() => {
                history.push('/leaves');
              }}
            />
             
              <div className="container">
              <Row className="">

              <TextInput
                inputClass="form-control"
                onInputChange={(e) => {
                  setReason(e.target.value);
                }
                }
                label="Note"
                containerClass="form-group"
                type="textarea"
                disabled={true}
                name="reason"
                value={reason}
              />
              </Row>
             </div>      
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(TeamAddLeave);
