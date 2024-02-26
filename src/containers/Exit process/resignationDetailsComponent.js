/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
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
import {
  Card,
  Row,
  Col,
  Button,
  Alert,
  Container,
  Accordion,
} from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

const ResignationDetailsComponent = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const { match } = props;
  const location = useLocation();
  const { state } = location;
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);
  const [managerDeclineToggle, setManagerDeclineToggle] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [retainReason, setRetainReason] = useState('');
  const [roleId, setRoleId] = useState();
  const [approveReason, setApproveReason] = useState('');
  const [document, setDocument] = useState(null);
  const [relievingDate, setRelievingDate] = useState('');
  const [relievingDateReason, setRelievingDateReason] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [isDocumentSelected, setDocumentSelected] = useState(false);
  const [userId, setUserId] = useState();
  const [buyBackReason, setBuyBackReason] = useState('');
  const [shoeError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const items = props.data
    ? null
    : [
        { to: '/', label: 'Home' },
        { to: '/resignation-applications', label: 'Resignation applications' },
        { label: 'Applications details' },
      ];

  const [documentsList, setDocumentList] = useState([
    {
      name: 'Exit Form',
      isCheck: false,
      id: 1,
      doc_id: '',
      label: 'Exit Form',
    },
    {
      name: 'Feedback Form',
      isCheck: false,
      id: 2,
      doc_id: '',
      label: 'Feedback Form',
    },
    {
      name: 'Handover Document',
      isCheck: false,
      id: 3,
      doc_id: '',
      label: 'Handover Document',
    },
    {
      name: 'Experience Letter',
      isCheck: false,
      id: 4,
      doc_id: '',
      label: 'Experience Letter',
    },
    {
      name: 'Exit Interview Documents',
      isCheck: false,
      id: 5,
      doc_id: '',
      label: 'Exit Interview Documents',
    },
    {
      name: 'Relieving Document',
      isCheck: false,
      id: 6,
      doc_id: '',
      label: 'Relieving Document',
    },
    {
      name: 'Other Document',
      isCheck: false,
      id: 7,
      doc_id: '',
      label: 'Other Document',
    },
  ]);
  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <Button
            className="float-end mb-4 mr-6"
            style={{ minWidth: '80px' }}
            variant="btn btn-sm btn-primary"
            onClick={() => {
              history.push('/resignation-applications');
            }}
          >
            Back
          </Button>
          <h2 className="main-content-title tx-24 mg-b-5">
            Application Details
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
      </div>

      <section className="content-area">
        <div className="mt-5">
          <Accordion defaultActiveKey="1">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="text-primary m-0">Step 1</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img src="/images/downarrow-18.svg" alt="" />
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Card.Title>
                    <Form onSubmit={(e) => {}}></Form>
                  </Card.Title>
                  <Row>
                    <Col sm={4}>
                      <h5>Employee Details</h5>
                      <div className="table-responsive employee-table">
                        <table className="table">
                          <tbody>
                            <tr>
                              <th scope="row">Employee Name</th>
                              <td>
                                {rowData?.user?.full_name
                                  ? rowData?.user?.full_name
                                  : 'Akshay Chavan'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Employee Id</th>
                              <td>
                                {rowData?.user?.emp_code
                                  ? rowData?.user?.emp_code
                                  : '298'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Employee Designation</th>
                              <td>
                                {rowData?.user?.designation_name
                                  ? rowData?.user?.designation_name
                                  : 'Jr.Software developer'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Joining Date</th>
                              <td>
                                {rowData?.user?.date_joined
                                  ? rowData?.user?.date_joined
                                  : '7/11/23'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Department</th>
                              <td>
                                {rowData?.user?.department_name
                                  ? rowData?.user?.department_name
                                  : 'Development'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Reporting Person</th>
                              <td>
                                {rowData?.reporting_manager?.manager_name
                                  ? rowData?.reporting_manager?.manager_name
                                  : 'Sanjay Mangalaram'}
                              </td>
                            </tr>
                            {/* {rowData?.user?.relieving_date && ( */}
                            <tr>
                              <th scope="row">Relieving Date</th>
                              <td>
                                {rowData?.user?.relieving_date
                                  ? customFunctions.getDMYDate(
                                      rowData?.user?.relieving_date
                                    )
                                  : '1/1/2024'}
                                <a className="ms-2" href="#">
                                 <u> Update Date</u>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Relieving Status</th>
                              <td>
                                {rowData?.user?.relieving_date
                                  ? customFunctions.getDMYDate(
                                      rowData?.user?.relieving_date
                                    )
                                  : 'Pending'}
                              </td>
                            </tr>
                            {/* )} */}
                            {rowData?.buy_back_date && (
                              <tr>
                                <th scope="row">Buy Back Date</th>
                                <td>
                                  {rowData?.buy_back_date
                                    ? customFunctions.getDMYDate(
                                        rowData?.buy_back_date
                                      )
                                    : '-'}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <th scope="row">Updated By</th>
                              <td>
                                {rowData?.user?.relieving_date
                                  ? customFunctions.getDMYDate(
                                      rowData?.user?.relieving_date
                                    )
                                  : 'Sanjay Mangalaram'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Updated Date</th>
                              <td>
                                {rowData?.user?.relieving_date
                                  ? customFunctions.getDMYDate(
                                      rowData?.user?.relieving_date
                                    )
                                  : '01/02/2024 5:30 PM'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <h5 className="d-flex justify-content-start">
                        Resignation Intimation
                      </h5>
                      <h6 className="d-flex justify-content-start">
                        <b>
                          The reason {rowData?.user?.full_name} has applied for
                          resignation
                        </b>
                      </h6>
                      <Alert className="" variant="secondary">
                        <Alert.Heading>
                          <h6>{rowData?.resignation_reason}</h6>
                        </Alert.Heading>
                      </Alert>
                      {(rowData?.resign_remark ||
                        rowData?.resignation_decline_note) && (
                        <div>
                          <h6>
                            <b>Remarks</b>
                          </h6>
                          <Alert className="" variant="secondary">
                            <Alert.Heading>
                              <h6>
                                {rowData?.resign_remark
                                  ? rowData?.resign_remark
                                  : rowData?.resignation_decline_note
                                  ? rowData?.resignation_decline_note
                                  : ''}
                              </h6>
                            </Alert.Heading>
                          </Alert>
                        </div>
                      )}
                      {rowData?.retain_status == '3' &&
                        !rowData?.user?.relieved && (
                          <>
                            <h5 className="d-flex justify-content-start">
                              Retention Reason
                            </h5>
                            <Alert className="" variant="secondary">
                              <Alert.Heading>
                                <h6>{rowData?.retention_reason}</h6>
                              </Alert.Heading>
                            </Alert>
                            <>
                              <TextInput
                                label="Enter Remarks"
                                placeholder="Type Retain reason here.."
                                type="text"
                                asterisk="*"
                                as="textarea"
                                rows="5"
                                value={retainReason}
                                maxlength={100}
                                onInputChange={(e) => {
                                  setRetainReason(e.target.value);
                                  setShowError(false);
                                }}
                              />
                              {shoeError && (
                                <span style={{ color: 'red' }}>
                                  Reason field is required
                                </span>
                              )}
                            </>
                            <Row className="mt-3 mb-3">
                              <Col>
                                <Button
                                  onClick={() => {
                                    // retainRequest(1);
                                    isValid('admin_retain', 'accept_retain');
                                  }}
                                >
                                  Accept Retention
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    // retainRequest(2);
                                    isValid('admin_retain', 'decline_retain');
                                  }}
                                >
                                  Decline
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                      {rowData?.retain_status == 1 && (
                        <>
                          <h6 className="d-flex justify-content-start">
                            <b> Retention Reason</b>
                          </h6>
                          <Alert className="" variant="secondary">
                            <Alert.Heading>
                              <h6>{rowData?.retention_reason}</h6>
                            </Alert.Heading>
                          </Alert>
                        </>
                      )}
                      {[1, 2].includes(rowData?.retain_status) && (
                        <>
                          <h6 className="d-flex justify-content-start">
                            <b> Retention Remark</b>
                          </h6>
                          <Alert className="" variant="secondary">
                            <Alert.Heading>
                              <h6>
                                {rowData?.retention_acceptance_reason
                                  ? rowData?.retention_acceptance_reason
                                  : rowData?.retention_decline_reason
                                  ? rowData?.retention_decline_reason
                                  : ''}
                              </h6>
                            </Alert.Heading>
                          </Alert>
                        </>
                      )}
                      {rowData?.buy_back_status == '3' &&
                        !rowData?.user?.relieved && (
                          <>
                            <h5 className="d-flex justify-content-start">
                              Buy Back Reason
                            </h5>
                            <Alert className="" variant="secondary">
                              <Alert.Heading>
                                <h6>{rowData?.buy_back_apply_reason}</h6>
                              </Alert.Heading>
                            </Alert>
                            <TextInput
                              label="Enter Remark"
                              asterisk="*"
                              type="text"
                              as="textarea"
                              rows="4"
                              value={buyBackReason}
                              onInputChange={(e) => {
                                setBuyBackReason(e.target.value);
                                setShowError(false);
                              }}
                            />
                            {shoeError && (
                              <span style={{ color: 'red' }}>
                                Buy back reason field is required
                              </span>
                            )}
                            <Row className="mt-0 mb-3">
                              <Col>
                                <Button
                                  onClick={() => {
                                    // buyBackRequest(1);
                                    isValid('buy_back', 'accept');
                                  }}
                                >
                                  Accept
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    // buyBackRequest(2);
                                    isValid('buy_back', 'decline');
                                  }}
                                >
                                  Decline
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                      {/* {rowData?.buy_back_apply_reason && (
                <>
                  <h6 className="d-flex justify-content-start">
                    <b>Buy Back Reason</b>
                  </h6>
                  <Alert className="" variant="secondary">
                    <Alert.Heading>
                      <h6>{rowData?.buy_back_apply_reason}</h6>
                    </Alert.Heading>
                  </Alert>
                </>
              )} */}
                      {[1, 2].includes(rowData?.buy_back_status) && (
                        <>
                          <h6 className="d-flex justify-content-start">
                            <b> Buy Back Remark</b>
                          </h6>
                          <Alert className="" variant="secondary">
                            <Alert.Heading>
                              <h6>
                                {rowData?.buy_back_acceptance_reason
                                  ? rowData?.buy_back_acceptance_reason
                                  : rowData?.buy_back_decline_reason
                                  ? rowData?.buy_back_decline_reason
                                  : ''}
                              </h6>
                            </Alert.Heading>
                          </Alert>
                        </>
                      )}
                      {!managerDeclineToggle &&
                        roleId == '1' &&
                        rowData?.resignation_status == '3' && (
                          <>
                            <TextInput
                              label="Enter Remarks"
                              placeholder="Type remark here.."
                              type="text"
                              asterisk="*"
                              as="textarea"
                              rows="5"
                              value={approveReason}
                              maxlength={100}
                              onInputChange={(e) => {
                                setApproveReason(e.target.value);
                                setShowError(false);
                              }}
                            />
                            {shoeError && (
                              <span style={{ color: 'red' }}>
                                Reason field is required
                              </span>
                            )}
                          </>
                        )}

                      {!managerDeclineToggle &&
                        roleId == '1' &&
                        rowData?.resignation_status == '3' && (
                          <Row>
                            <Col>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  // approveResignation();
                                  isValid('admin', 'approve_resign');
                                }}
                              >
                                Approve
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  // setManagerDeclineToggle(true);
                                  // isValid('admin', 'decline_resign');
                                }}
                              >
                                Decline
                              </Button>
                            </Col>
                          </Row>
                        )}
                    </Col>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="text-primary m-0">Step 2</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img src="/images/downarrow-18.svg" alt="" />
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Card.Title>
                    <Form onSubmit={(e) => {}}></Form>
                  </Card.Title>
                  {/* <Row>
                    <Col>
                      <h4>Last working date of employee name is: 22/2/22</h4>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        Update date
                      </a>
                    </Col>
                  </Row> */}
                  <Row className="mt-3">
                    <Col sm={3}>
                      <DropdownInput
                        label="Select Document"
                        options={documentsList}
                      />
                    </Col>
                    <Col>
                      <TextInput
                        className="mb-3"
                        label="Upload  document"
                        type="file"
                        onInputChange={(e) => {
                          if (!e?.target?.files || e?.target?.files?.length < 1)
                            return;
                          if (
                            ['docx', 'pdf'].includes(
                              e?.target?.files[0].name?.split('.').pop()
                            )
                          ) {
                            if (e?.target?.files[0].size > 1086147) {
                              swal('File size is too big', '', 'error');
                            } else {
                              setDocument(e.target.files[0]);
                            }
                          } else {
                            swal(
                              'File extension is not supported',
                              '',
                              'error'
                            );
                          }
                        }}
                      />
                    </Col>
                    <Col className="mt-4 ms-3" sm={5}>
                      <Card>
                        <Card.Body>
                          {documentsList &&
                            documentsList.map((item, index) => (
                              <Row>
                                <Col sm={9}>
                                  <ul>
                                    &nbsp;
                                    <del>{item?.name}</del>
                                  </ul>
                                </Col>
                                <Col sm={3}>
                                  {/* {item.isDiseable == true && ( */}
                                  <>
                                    <a href={item?.url} target="_blank">
                                      <img
                                        title="Download Document"
                                        style={{ cursor: 'pointer' }}
                                        src="/images/download1.svg"
                                        alt="download-icon"
                                        className="me-3"
                                      />
                                    </a>

                                    <a
                                      href="javascript:void(0)"
                                      onClick={() => {
                                        deleteDocument(item?.doc_id);
                                      }}
                                    >
                                      <img
                                        title="Remove Document"
                                        style={{ cursor: 'pointer' }}
                                        src="/images/delete.png"
                                        alt="download-icon"
                                      />
                                    </a>
                                  </>
                                  {/* )} */}
                                </Col>
                              </Row>
                            ))}
                          <h6 style={{ marginLeft: '36px' }}>Exit Form</h6>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <div className="mt-3 mb-3">
            <Row>
              <Col 
              className='d-flex justify-content-end'
              >
              {/* <h6>
                Please{' '}
                <a href="#">
                  {' '}
                  <u>Click here</u>{' '}
                </a>{' '}
                to relieve Akshay Chavan
              </h6> */}
              <Button>Relieve Employee</Button>
              </Col>
            </Row>
          </div>
        </div>
      </section>
      <ModalInput
        size="md"
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false), setShowError(false);
          // isClear();
        }}
        className="event-image-popup"
        id="contained-modal-title-center"
        modalHeaderClass="reson-text-title d-flex align-items-center"
        label="Update Relieving Date"
        modalBody={
          <div className="">
            <Datepicker
              className="form-control"
              label="Date"
              selected={relievingDate}
              onChange={(e) => {
                setRelievingDate(e);
              }}
              autoComplete="off"
              name="startDate"
              dateFormat="dd/MM/yyyy"
              placeholder="Select relieving date"
              minDate={new Date()}
            />
            <TextInput label="Reason" />
            <Button className="me-3">Update</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        }
      />
    </>
  );
};

export default ResignationDetailsComponent;
