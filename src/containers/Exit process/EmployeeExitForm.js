/* eslint-disable */
import React, { useState, useRef } from 'react';
import {
  Helmet,
  DropdownInput,
  TextInput,
  ModalInput,
  Datepicker,
} from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { useEffect } from 'react';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';

const EmployeeExitForm = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const [isShowLoader, setShowLoader] = useState(false);
  const [resignationReason, setResignationReason] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [retainNote, setRetainNote] = useState('');
  const [rowData, setRowData] = useState([]);
  const [modalType, setModalType] = useState('');
  const [buyBackDate, setBuyBackDate] = useState('');
  const [buyBackReason, setBuyBackReason] = useState('');
  const [shoeError, setShowError] = useState(false);
  const [resignation, setResignation] = useState(false);
  const history = useHistory();

  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation application' }];
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);

  useEffect(() => {
    setUserId(customFunctions.getLocalStorage('userId'));
  }, []);

  useEffect(() => {
    if (userId) {
      getResignationList();
    }
  }, [userId]);

  const columns = [
    // {
    //   id: 'no',
    //   label: 'Sr. No',
    //   roleAccess: [1, 2, 3, 4, 5, 6, 7],
    // },
    {
      id: 'emp_code',
      label: 'Employee Id',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,8],
      // isDisplay: false,
      render: (row) => {
        const rowdata = row;
        return `SDMS-${rowdata.user.emp_code}`;
      },
    },
    {
      id: 'resignation_status',
      label: 'Resignation Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,8],
      render: (row) => {
        const rowdata = row;
        return rowdata.resignation_status == '3'
          ? 'Pending'
          : rowdata.resignation_status == '2'
          ? 'Declined'
          : rowdata.resignation_status == '4'
          ? 'Cancelled'
          : 'Approved';
      },
    },
    {
      id: 'date_joined',
      label: 'Joining Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,8],
      render: (row) => {
        const rowdata = row;
        return customFunctions.getDMYDate(rowdata.user.date_joined);
      },
    },
    {
      id: 'resignation_reason',
      label: 'Resignation Reason',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,8],
      render: (row) => {
        const rowdata = row;
        return rowdata?.resignation_reason.length > 15 ? (
          <span title={rowdata?.resignation_reason}>
            {' '}
            {rowdata?.resignation_reason.slice(0, 15) + '' + '...'}
          </span>
        ) : (
          <span title={rowdata?.resignation_reason}>
            {rowdata?.resignation_reason}
          </span>
        );
      },
    },
    {
      id: 'relieving_date',
      label: 'Relieving Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,8],
      render: (row) => {
        const rowdata = row;
        return [2, 4].includes(rowdata?.resignation_status)
          ? '-'
          : rowdata?.user?.relieving_date
          ? customFunctions.getDMYDate(rowdata?.user?.relieving_date)
          : '-';
      },
    },
    ,
  ];

  const addEmployeeResignation = async () => {
    setShowLoader(true);
    const postData = {
      resignation_reason: resignationReason,
      personal_email: personalEmail,
    };
    const callback = AuthApi.postDataToServer;
    const endPoint = `${Api.employeeResignationUrl}`;

    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success').then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getResignationList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.getResignationListUrl}`;
    const params = {
      sort_direction: 'descending',
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      setRowData(data.data);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const retainMe = async () => {
    setShowLoader(true);
    const postData = {
      retain_me: true,
      retention_reason: retainNote,
    };

    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${rowData?.[0]?.id}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowModal(false);
      setShowLoader(false);
      swal(data && data.message[0], '', 'success').then(() =>
        window.location.reload()
      );
    } else {
      setShowModal(false);
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const buyBackMe = async () => {
    const postData = {
      is_buy_back: true,
      buy_back_date: customFunctions.getDate(buyBackDate),
      buy_back_apply_reason: buyBackReason,
    };
    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${rowData?.[0]?.id}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowModal(false);
      setShowLoader(false);
      swal('Buy back request send successfully', '', 'success').then(() =>
        window.location.reload()
      );
    } else {
      setShowModal(false);
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const onSubmit = () => {
    if (validator.current.allValid()) {
      addEmployeeResignation();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      // setDisableButton(false);
    }
  };

  const isValid = (type) => {
    if (type == 'retain_me') {
      if (retainNote) {
        retainMe();
      } else {
        setShowError(true);
      }
    } else {
      if (buyBackDate && buyBackReason) {
        buyBackMe();
      } else {
        setShowError(true);
      }
    }
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  const isClear = () => {
    setShowError(false);
    setRetainNote('');
    setBuyBackDate('');
    setBuyBackReason('');
  };

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <div className="d-flex">
            <h2 className="main-content-title tx-24 mg-b-5">
              Resignation Application
            </h2>
          </div>
          <Breadcrumb items={items} />
          {rowData && rowData?.length > 0 && (
            <div className="d-flex justify-content-end mb-3">
              {rowData?.[0]?.retain_status == null &&
              rowData?.[0]?.resignation_status == 1 ? (
                <Button
                  onClick={() => {
                    setModalType('Retain me');
                    setShowModal(true);
                  }}
                >
                  Retain Me
                </Button>
              ) : (
                <h6></h6>
              )}
            </div>
          )}
          <div className="d-flex justify-content-end mb-3">
            {rowData?.[0]?.resignation_status == 1 &&
              rowData?.[0]?.retain_status == null &&
              rowData?.[0]?.buy_back_status == null && (
                <Button
                  onClick={() => {
                    setModalType('Buy back');
                    setShowModal(true);
                  }}
                >
                  Buy Back
                </Button>
              )}
          </div>
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div>
          {resignation == true && (
            <Card>
              <Card.Body>
                <Row>
                  <Col sm={5}>
                    <h6>
                      {' '}
                      <b> Resignation Intimation </b>{' '}
                    </h6>
                    <Row>
                      <Col>
                        <h6>
                          Why do you want to resign from Stark Digital Media
                          Services Pvt Ltd?
                        </h6>
                      </Col>
                    </Row>
                  </Col>

                  <Col sm={7}>
                    <TextInput
                      label="Personal Email"
                      asterisk="*"
                      placeholder="Enter your email"
                      type="text"
                      maxlength={50}
                      value={personalEmail}
                      onInputChange={(e) => {
                        setPersonalEmail(e.target.value);
                      }}
                      errorMessage={validator.current.message(
                        'email',
                        personalEmail,
                        'required|email'
                      )}
                    />
                    <TextInput
                      placeholder="I want to resign because..."
                      label="Reason for resignation"
                      asterisk="*"
                      type="text"
                      as="textarea"
                      rows="5"
                      value={resignationReason}
                      maxlength={100}
                      onInputChange={(e) => {
                        setResignationReason(e.target.value);
                      }}
                      errorMessage={validator.current.message(
                        'reason',
                        resignationReason,
                        'required'
                      )}
                    />
                    <h6 className="content-title text-count-box float-end">
                      {`${resignationReason?.length}/100`}
                    </h6>
                    <Row>
                      <Col>
                        <Button
                          onClick={() => {
                            swal({
                              title: 'Are you sure?',
                              text: 'You want to resign?',
                              icon: 'warning',
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                onSubmit();
                              }
                            });
                          }}
                        >
                          Submit
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setResignation(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              {/* <hr /> */}
            </Card>
          )}
          <Card>
            <Card.Body>
              {!resignation && (
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-3 mt-2 ">My Resignation </h5>
                  {[3, 1].includes(rowData[0]?.resignation_status) ? (
                    ''
                  ) : (
                    <a
                      href="#"
                      className="d-flex justify-content-end btn-link"
                      onClick={() => {
                        setResignation(true);
                      }}
                    >
                      Apply For Resignation
                    </a>
                  )}
                </div>
              )}
              <Row>
                {rowData?.[0]?.retain_status != null && (
                  <Col className="d-flex justify-content-end">
                    <h6>Retain Status: </h6>
                    {rowData?.[0]?.retain_status == '1' ? (
                      <h6 bg="success">
                        {' '}
                        <b>Approved </b>{' '}
                      </h6>
                    ) : rowData?.[0]?.retain_status == '2' ? (
                      <h6 bg="secondary">
                        {' '}
                        <b>Declined</b>{' '}
                      </h6>
                    ) : (
                      <h6 bg="secondary">
                        {' '}
                        <b>Pending</b>{' '}
                      </h6>
                    )}
                  </Col>
                )}
              </Row>
              <Row>
                {rowData?.[0]?.buy_back_status != null && (
                  <Col className="d-flex justify-content-end">
                    <h6>Buy Back Status: </h6> &nbsp;
                    {rowData?.[0]?.buy_back_status == '1' ? (
                      <h6 bg="success">
                        {' '}
                        <b>Approved </b>{' '}
                      </h6>
                    ) : rowData?.[0]?.buy_back_status == '2' ? (
                      <h6 bg="secondary">
                        {' '}
                        <b>Declined</b>{' '}
                      </h6>
                    ) : (
                      <h6 bg="secondary">
                        {' '}
                        <b>Pending</b>{' '}
                      </h6>
                    )}
                  </Col>
                )}
              </Row>
              <hr />
              <Row>
                <Table
                  columns={columns}
                  rows={rowData}
                  showPagination
                  tableClass="table-striped"
                  dropdownContainerClass="mb-3"
                  emptyRender={() => (
                    <p className="text-center mb-0">No record found</p>
                  )}
                />
              </Row>
            </Card.Body>
          </Card>
          <ModalInput
            size="md"
            centered
            show={showModal}
            onHide={() => {
              setShowModal(false), setShowError(false);
              isClear();
            }}
            className="event-image-popup"
            id="contained-modal-title-center"
            modalHeaderClass="reson-text-title d-flex align-items-center"
            // label={eventDetails.eventTitle}
            modalBody={
              <div className="">
                {modalType == 'Retain me' && (
                  <>
                    <TextInput
                      label="Why do you want to retain?"
                      type="text"
                      as="textarea"
                      asterisk="*"
                      rows="5"
                      value={retainNote}
                      maxlength={100}
                      onInputChange={(e) => {
                        setRetainNote(e.target.value);
                        setShowError(false);
                      }}
                    />
                    {shoeError && (
                      <span style={{ color: 'red' }}>
                        Retain reason field is required
                      </span>
                    )}
                    <h6 className="content-title text-count-box float-end">
                      {`${retainNote?.length}/100`}
                    </h6>
                  </>
                )}
                {modalType == 'Buy back' && (
                  <>
                    <Row>
                      <Datepicker
                        className="form-control"
                        label="Select date"
                        asterisk="*"
                        selected={buyBackDate}
                        onChange={(e) => {
                          setBuyBackDate(e);
                          setShowError(false);
                        }}
                        autoComplete="off"
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select buy back date"
                        minDate={currentDate}
                      />
                      {shoeError && !buyBackDate && (
                        <span style={{ color: 'red' }}>
                          Buy back date field is required
                        </span>
                      )}
                    </Row>
                    <Row>
                      <Col>
                        <TextInput
                          label="Buy back reason"
                          placeholder="Enter reason for buy back"
                          type="text"
                          asterisk="*"
                          as="textarea"
                          rows="5"
                          maxlength={100}
                          value={buyBackReason}
                          onInputChange={(e) => {
                            setBuyBackReason(e.target.value);
                            setShowError(false);
                          }}
                        />
                        {shoeError && !buyBackReason && (
                          <span style={{ color: 'red' }}>
                            Buy back reason field is required
                          </span>
                        )}
                        <h6 className="content-title text-count-box float-end">
                          {`${buyBackReason?.length}/100`}
                        </h6>
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col className="d-flex justify-content-center mt-3">
                    <Button
                      className=""
                      onClick={() => {
                        if (modalType == 'Retain me') {
                          // retainMe();
                          isValid('retain_me');
                        } else {
                          // buyBackMe()
                          isValid('buy_back');
                        }
                      }}
                    >
                      {modalType == 'Retain me' ? 'Retain Me' : 'Buy Back Me'}
                    </Button>
                  </Col>
                </Row>
              </div>
            }
            // modalFooter={
            //   eventDetails.eventDescription && (
            //     <span className="modal-description">
            //       Description: {eventDetails.eventDescription}
            //     </span>
            //   )
            // }
          />
        </div>
      </section>
    </>
  );
};

export default EmployeeExitForm;
