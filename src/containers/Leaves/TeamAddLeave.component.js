import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
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
  const history = useHistory();
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  // const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');

  const [jsonSchema, updateJsonSchema] = useState(FormSections);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (
      sectionData.name === 'leave_from_date' ||
      sectionData.name === 'leave_to_date'
    ) {
      const date = new Date();
      sectionData.minDate = date;
    }
    return sectionData;
  });

  useEffect(() => {
    const formViewSchema = [...FormSections];
      const updatedSchema = formViewSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'team_leave_type' ||
            item.name === 'team_reason' ||
            item.name === 'leave_from_date' ||
            item.name === 'leave_from_type' ||
            item.name === 'leave_from_time' ||
            item.name === 'leave_to_date' ||
            item.name === 'leave_to_type' ||
            item.name === 'leave_to_time'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });

      updateJsonSchema([...updatedSchema]);
  }, [currentUser]);

  useEffect(() => {
    getUserRole();
    setTitle(leaveId ? 'Edit Leaves' : 'Add Leaves');
  }, []);

  // Submit Form
  const submitForm = async (value) => { // eslint-disable-line
  
    const postData = {
      id: leaveId,
      status: Number(value),
      declined_reason: reason ? String(reason) :''
    };

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
        history.push('/team-leaves');
        swal.close();
      });
    }
    // Perform success actions
  };

  // Get data for form
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.leavesUrl}${leaveId}/`
    );
    if (!data) {
      // show error
      return;
    }
    if(data && data.data){
      setReason(data.data.declined_reason);
      setStatus(data.data.status_name);
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

  // Call get data method on load
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
          <Card>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={jsonSchema}
              formHeading="Leave"
              // onFormSubmit={(formValues) => {
              //   submitForm(formValues);
              // }}
              // options={options}
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Check task"
              showResetBtn={true}
              resetBtnText="Cancel"
              btnContainerClass= {Number(currentUser) === 4 ? 'form-submit-buttons':'d-none'}
              isStepForm={false}
              onFormReset={() => {
                history.push('/leaves');
              }}
            />
              <Row className="text-center ms-2">
                { status === 'Pending' && (
                  <>
                <Col sm={2}>
                  <Button
                    onClick={() => {
                      submitForm(2)
                    }}
                    variant="primary"
                    className="mb-4"
                  >
                    Approve
                  </Button>
                </Col>
                <Col sm={2} className="ms-2">
                  <Button
                    onClick={() => {
                      submitForm(3)
                    }}
                    variant="secondary"
                    className="mb-4"
                  >
                    Decline
                  </Button>
                </Col>
                </>
                )}
              </Row>
              <Row className="mx-3">

              <TextInput
                inputClass="form-control"
                onInputChange={(e) => {
                  setReason(e.target.value);
                }
                }
                label="Declined Reason"
                containerClass="form-group"
                type="textarea"
                disabled={status !== 'Pending' && true}
                name="reason"
                value={reason}
              />
              </Row>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(TeamAddLeave);
