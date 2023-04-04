import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
// import swal from 'sweetalert';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet, TextInput, DropdownInput } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function AddSupportTicket(props) {
  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        ticket_status: 'The ticket status field is required.',
      },
    })
  );
  const { match } = props;
  const history = useHistory();
  const id = match.params.supportId;
  const [title, setTitle] = useState('');

  const items = [
    { to: '/', label: 'Home' },
    { label: id ? 'Edit Support Ticket' : 'Add Support Ticket' },
  ];

  // Variable declarations
  const [supportDetails, setSupportDetails] = useState({
    title: '',
    ticket_type: null,
    description: '',
    comment: '',
    status: '',
    admin_status: '',
  });
  const [count, forceUpdate] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [currentUser, updateCurrentUser] = useState(0);
  const [user, setUser] = useState(0);
  const [supportId, setSupportId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const userId = localStorage.getItem('userId');

  const [status, setStatus] = useState([
    { label: 'Open', value: 1 },
    { label: 'Close', value: 2 },
    { label: 'Resolve', value: 4 },
  ]);
  const ticketType = [
    {
      label: 'Infrastructure',
      value: '1',
    },
    {
      label: 'Laptop/Dekstop',
      value: '2',
    },
    {
      label: 'Accessories',
      value: '3',
    },
    {
      label: 'System OS',
      value: '4',
    },
    {
      label: 'Other',
      value: '5',
    },
  ];
  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async () => {
    setShowLoader(true);
    const postData = {
      title: supportDetails.title,
      description: supportDetails.description,
      ticket_type: supportDetails.ticket_type
        ? supportDetails.ticket_type.value
        : '',
      comment: supportDetails.comment,
      status: supportDetails.status
        ? Number(supportDetails.status)
        : Number(supportDetails.admin_status),
    };
    if (supportId) postData.id = supportId;
    console.log('status postData', postData);
    return; // eslint-disable-line
    // const callback = supportId
    //   ? AuthApi.putDataToServer
    //   : AuthApi.postDataToServer;
    // const endPoint = supportId
    //   ? `${Api.supportTicketUrl}${supportId}/`
    //   : Api.supportTicketUrl;
    // const { data, message } = await callback(endPoint, postData);

    // if (!data) {
    //   setShowLoader(false);
    //   swal(message, '', 'error');
    // }

    // setShowLoader(false);
    // swal(data && data.message[0], '', 'success').then((result) => {
    //   if (result) {
    //     setShowLoader(false);
    //     history.push('/support-ticket');
    //   }
    // });
  };

  const getData = async (editId) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.supportTicketUrl}${editId}/`
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
        ? [3,4].includes(Number(currentUser)) && statusCondition ? statusCondition : null
        : data.data.status_id,
      admin_status: data.data.admin_status,
      ticket_type: {
        label: data.data.ticket_type_name,
        value: data.data.ticket_type,
      },
    });
  };
  useEffect(() => {
    if (id) {
      setSupportId(id);
      getData(id);
      setTitle('Edit Support Ticket');
    } else {
      setTitle('Add Support Ticket');
    }
  }, [currentUser]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (
      !(
        (Number(user) !== Number(userId) && supportId) ||
        ([3, 4].includes(Number(currentUser)) && supportDetails.admin_status) ||
        ([3, 4].includes(Number(currentUser)) && supportDetails.admin_status)
      ) &&
      !supportDetails.comment
    ) {
      validator.current.fields.comment = true;
      validator.current.errorMessages.comment = null;
    }
    if (
      !(
        (Number(user) !== Number(userId) && supportId !== null) ||
        ([3, 4].includes(Number(currentUser)) && supportDetails.admin_status)
      )
    ) {
      validator.current.fields.ticket_status = true;
      validator.current.errorMessages.ticket_status = null;
    }
    if (validator.current.allValid()) {
      submitForm();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  const onCancel = () => {
    validator.current.hideMessages();
    setSupportDetails({
      title: '',
      ticket_type: null,
      description: '',
      comment: '',
      status: '',
      admin_status: '',
    });
    history.push('/support-ticket');
  };

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Form
          onSubmit={(e) => {
            onSubmit(e);
          }}
          autocomplete="off"
        >
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">{title}</h5>
              </div>
              <hr />
              <Row>
                <Col sm={6} md={6} lg={6}>
                  <TextInput
                    onInputChange={(e) =>
                      setSupportDetails({
                        ...supportDetails,
                        title: e.target.value,
                      })
                    }
                    label="Title"
                    asterisk="*"
                    containerClass="form-group"
                    type="text"
                    name="title"
                    disabled={
                      supportId && Number(supportDetails.admin_status) === 4
                    }
                    value={supportDetails.title}
                    placeholder="Enter title"
                    errorMessage={validator.current.message(
                      'title',
                      supportDetails.title,
                      'required'
                    )}
                  />
                </Col>
                <Col sm={6} md={6} lg={6}>
                  <DropdownInput
                    label="Ticket Type"
                    asterisk="*"
                    name="ticketType"
                    options={ticketType}
                    defaultValue={supportDetails.ticket_type}
                    disabled={
                      supportId && Number(supportDetails.admin_status) === 4
                    }
                    onSelectHandler={(select) =>
                      setSupportDetails({
                        ...supportDetails,
                        ticket_type: select,
                      })
                    }
                    placeholder="Select ticket type"
                    errorMessage={validator.current.message(
                      'ticket type',
                      supportDetails.ticket_type,
                      'required'
                    )}
                  />
                </Col>
                <Col sm={6} md={6} lg={6}>
                  <TextInput
                    label="Description"
                    containerClass="form-group"
                    disabled={
                      supportId && Number(supportDetails.admin_status) === 4
                    }
                    onInputChange={(e) =>
                      setSupportDetails({
                        ...supportDetails,
                        description: e.target.value,
                      })
                    }
                    as="textarea"
                    rows={3}
                    asterisk="*"
                    name="description"
                    value={supportDetails.description}
                    placeholder="Enter description"
                    errorMessage={validator.current.message(
                      'description',
                      supportDetails.description,
                      'required'
                    )}
                  />
                </Col>
                {((Number(user) !== Number(userId) && supportId) ||
                  ([3, 4].includes(Number(currentUser)) &&
                    supportDetails.admin_status)) && (
                  <Col sm={6} md={6} lg={6}>
                    <TextInput
                      label="Comment"
                      containerClass="form-group"
                      onInputChange={(e) =>
                        setSupportDetails({
                          ...supportDetails,
                          comment: e.target.value,
                        })
                      }
                      as="textarea"
                      rows={3}
                      asterisk="*"
                      name="comment"
                      disabled={[3, 4, 5, 6].includes(currentUser)}
                      value={supportDetails.comment}
                      placeholder="Enter comment"
                      errorMessage={validator.current.message(
                        'comment',
                        supportDetails.comment,
                        'required'
                      )}
                    />
                  </Col>
                )}
                {(Number(user) !== Number(userId) && supportId) ||
                ([3, 4].includes(Number(currentUser)) &&
                  supportDetails.admin_status) ? (
                  <Col sm={6} md={6} lg={6}>
                    <p>
                      Ticket Status <span className="text-danger">*</span>
                    </p>
                    {status.map((st) => {
                      return (
                        <>
                          <input
                            onChange={(e) =>
                              setSupportDetails({
                                ...supportDetails,
                                status: e.target.value,
                                admin_status: e.target.value,
                              })
                            }
                            name={st.label}
                            type="radio"
                            disabled={
                              !supportDetails.admin_status &&
                              [3, 4].includes(currentUser)
                            }
                            checked={
                              Number(supportDetails.status) === st.value
                                ? true
                                : false
                            } // eslint-disable-line
                            id="status"
                            className="ms-3"
                            value={
                              supportDetails.admin_status === st.value
                                ? supportDetails.admin_status
                                : st.value
                            }
                          />
                          <span className="ml-2">{st.label}</span>
                        </>
                      );
                    })}
                    {(!supportDetails.admin_status &&
                    [1, 2].includes(Number(currentUser)))
                      ? validator.current.message(
                          'ticket_status',
                          supportDetails.admin_status,
                          'required',
                          {
                            className: 'text-danger',
                          }
                        )
                      : validator.current.message(
                          'ticket_status',
                          supportDetails.status,
                          'required',
                          {
                            className: 'text-danger',
                          }
                        )}
                  </Col>
                ) : null}
              </Row>
              <div className="float-end">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={disableButton}
                >
                  {supportId ? 'Update' : 'Add'}
                </Button>
                <Button
                  variant="secondary"
                  className="ms-4"
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Form>
      </section>
    </>
  );
}

export default withRouter(AddSupportTicket);
