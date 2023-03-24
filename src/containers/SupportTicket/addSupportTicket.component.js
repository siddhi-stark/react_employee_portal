import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet, TextInput, DropdownInput } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

const validator = new SimpleReactValidator();

function AddSupportTicket(props) {
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
    { label: 'Closed', value: 2 },
    { label: 'Resolved', value: 4 },
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

    const callback = supportId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = supportId
      ? `${Api.supportTicketUrl}${supportId}/`
      : Api.supportTicketUrl;
    const { data, message } = await callback(endPoint, postData);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }

    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        history.push('/support-ticket');
      }
    });
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
    if ([1, 2].includes(currentUser) && Number(userId) !== data.data.user) {
      setStatus([{ label: 'Resolved', value: 4 }]);
      forceUpdate(count + 1);
    } else if (
      [1, 2].includes(currentUser) &&
      Number(userId) === data.data.user
    ) {
      setStatus([
        { label: 'Open', value: 1 },
        { label: 'Closed', value: 2 },
      ]);
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
      status: statusCondition === 4 ? data.data.status_id : statusCondition,
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
    if (validator.allValid()) {
      submitForm();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  const onCancel = () => {
    validator.hideMessages();
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
                <h5 className="card-title mb-0 mt-2 ">Add Support Ticket</h5>
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
                      supportId &&
                      [1, 2].includes(currentUser) &&
                      supportDetails.admin_status === 4
                    }
                    value={supportDetails.title}
                    placeholder="Enter title"
                    errorMessage={validator.message(
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
                      supportId &&
                      [1, 2].includes(currentUser) &&
                      supportDetails.admin_status === 4
                    }
                    onSelectHandler={(select) =>
                      setSupportDetails({
                        ...supportDetails,
                        ticket_type: select,
                      })
                    }
                    placeholder="Select ticket type"
                    errorMessage={validator.message(
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
                      supportId &&
                      [1, 2].includes(currentUser) &&
                      supportDetails.admin_status === 4
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
                    errorMessage={validator.message(
                      'description',
                      supportDetails.description,
                      'required'
                    )}
                  />
                </Col>
                {[1, 2].includes(currentUser) &&
                  Number(user) !== Number(userId) &&
                  supportId && (
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
                        value={supportDetails.comment}
                        placeholder="Enter comment"
                        errorMessage={validator.message(
                          'comment',
                          supportDetails.comment,
                          'required'
                        )}
                      />
                    </Col>
                  )}
                {supportId && (
                  <Col sm={6} md={6} lg={6}>
                    <p>Ticket Status</p>
                    {status.map((st) => {
                      return (
                        <>
                          <input
                            onChange={(e) =>
                              setSupportDetails({
                                ...supportDetails,
                                status: e.target.value,
                              })
                            }
                            name={st.label}
                            type="radio"
                            disabled={
                              !supportDetails.admin_status &&
                              [3, 4].includes(currentUser)
                            }
                            checked={Number(supportDetails.status) === st.value ? true : false } // eslint-disable-line
                            id="status"
                            className="ms-3"
                            value={
                              supportDetails.admin_status === 
                              st.value
                                ? supportDetails.admin_status
                                : st.value
                            }
                          />
                          <span className="ml-2">{st.label}</span>
                        </>
                      );
                    })}
                  </Col>
                )}
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
