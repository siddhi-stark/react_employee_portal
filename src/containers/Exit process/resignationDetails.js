/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import {
  Helmet,
  DropdownInput,
  TextInput,
  Datepicker,
} from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const ResignationDetails = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const location = useLocation();
  const { state } = location;
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);
  const [managerDeclineToggle, setManagerDeclineToggle] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [roleId, setRoleId] = useState();
  const [managerDeclineReason, setManagerDeclineReason] = useState('');
  const [approveReason, setApproveReason] = useState('');
  const [document, setDocument] = useState(null);
  const [relievingData, setRelievingDate] = useState();
  const [relievingDateReason, setRelievingDateReason] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');

  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation-details' }];

  const [documentsList, setDocumentList] = useState([
    {
      name: 'Exit Form',
      isCheck: false,
      id: 1,
    },
    {
      name: 'Feedback Form',
      isCheck: false,
      id: 2,
    },
    {
      name: 'Handover Document',
      isCheck: false,
      id: 3,
    },
    {
      name: 'Experience Letter',
      isCheck: false,
      id: 4,
    },
    {
      name: 'Exit Interview Documents',
      isCheck: false,
      id: 5,
    },
    {
      name: 'Relieving Document',
      isCheck: false,
      id: 6,
    },
    {
      name: 'Other Document',
      isCheck: false,
      id: 7,
    },
  ]);

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    ,
  ];

  useEffect(() => {
    setRoleId(customFunctions.getLocalStorage('group'));
  }, [roleId]);

  useEffect(() => {
    if (state?.state?.resignationId) {
      getResignationDetails();
    }
  }, [state?.state?.resignationId]);

  const getResignationDetails = async () => {
    setShowLoader(true);
    const endPoint = `${Api.getResignationListUrl}${state?.state?.resignationId}`;

    const url = customFunctions.generateUrl(endPoint);
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

  const approveResignation = async () => {
    setShowLoader(true);
    const postData = {
      resign_remark: approveReason,
      resignation_status: 1,
    };

    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal('Resignation approve successfully', '', 'success');
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const declineResignation = async () => {
    setShowLoader(false);
    const postData = {
      resignation_decline_note: managerDeclineReason,
      resignation_status: 2,
    };
    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal('Resignation decline successfully', '', 'success');
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const uploadDocuments = async () => {
    // setShowLoader(true);
    // if (document) {
    console.log('document', document);
    var formData = new FormData();
    formData.append('file', document);
    console.log('formData-----', formData);
    // }

    const postData = {
      image: formData,
      document_type: selectedDocument,
      user_id: '',
    };
    const callback = AuthApi.postDataToServer;
    const endPoint = `${Api.uploadDocumentsUrl}`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      console.log('data------', data);
    }
  };

  const allValid = () => {
    let isValid = true;

    // isValid = false;
    // validator.current.errorMessages.options = null;
    // validator.current.fields.options = tr;

    if (validator.current.allValid()) {
      return;
      approveResignation();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      // setDisableButton(false);
    }
  };

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Resignation From Employees
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col sm={4}>
              <h5>Employee details</h5>
              <div className="table-responsive employee-table">
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Employee Id</th>
                      <td>
                        {rowData?.user?.full_name
                          ? rowData?.user?.full_name
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Employee Name</th>
                      <td>
                        {rowData?.user?.emp_code
                          ? rowData?.user?.emp_code
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Employee Designation</th>
                      <td>
                        {rowData?.user?.designation_name
                          ? rowData?.user?.designation_name
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Joining Date</th>
                      <td>
                        {rowData?.user?.designation_name
                          ? rowData?.user?.designation_name
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Department</th>
                      <td>
                        {rowData?.user?.department_name
                          ? rowData?.user?.department_name
                          : '-'}
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
              {!managerDeclineToggle &&
                roleId == '1' &&
                rowData?.resignation_status == '3' && (
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
                    }}
                    errorMessage={validator.current.message(
                      'approve reason',
                      approveReason,
                      'required'
                    )}
                  />
                )}
              {roleId == '5' && (
                <div>
                  <h6>
                    <b>Remarks form the reporting manager</b>
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
              {!managerDeclineToggle &&
                roleId == '1' &&
                rowData?.resignation_status == '3' && (
                  <Row>
                    <Col>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          allValid();
                        }}
                      >
                        Approve
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setManagerDeclineToggle(true);
                        }}
                      >
                        Decline
                      </Button>
                    </Col>
                  </Row>
                )}
            </Col>
          </Row>
          {roleId == '1' && rowData?.resignation_status != '3' && (
            <Alert className="d-flex justify-content-center" variant="info">
              <Alert.Heading>
                <h4>
                  {' '}
                  {rowData?.resignation_status == '1'
                    ? 'Resignation Approve'
                    : 'Resignation Decline'}{' '}
                </h4>
              </Alert.Heading>
            </Alert>
          )}
          <Row className="mt-3">
            {managerDeclineToggle && (
              <>
                <TextInput
                  label="Reason for decline"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={managerDeclineReason}
                  onInputChange={(e) => {
                    setManagerDeclineReason(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'Decline reason',
                    managerDeclineReason,
                    'required'
                  )}
                />
                <Row>
                  <Col>
                    <Button
                      onClick={() => {
                        allValid();
                      }}
                    >
                      Submit
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setManagerDeclineToggle(false);
                      }}
                    >
                      Cancle
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            <hr />

            {/* Hr Resignation form  */}

            {roleId == '5' && (
              <Row>
                <Col sm={6}>
                  <h5>Upload Exit Documents</h5>
                  <Card>
                    <Card.Body>
                      {documentsList &&
                        documentsList.map((item, index) => (
                          <ul>
                            <input
                              className=""
                              type={'checkbox'}
                              value={item?.isCheck}
                              checked={item?.isCheck}
                              // disabled={index === 1 ? false : true}
                              id="flexCheckDefaultBeneficiary"
                              onChange={(e) => {
                                let temData = [];
                                documentsList &&
                                  documentsList.map((dt, ind) => {
                                    if (index == ind) {
                                      temData.push({
                                        name: dt.name,
                                        id: dt?.id,
                                        isCheck: true,
                                      });
                                      setSelectedDocument(dt?.id);
                                    } else {
                                      temData.push({
                                        name: dt.name,
                                        id: dt?.id,
                                        isCheck: false,
                                      });
                                    }
                                  });
                                setDocumentList(temData);
                                forceUpdate(count + 1);
                              }}
                            />{' '}
                            &nbsp;
                            {item?.name}
                          </ul>
                        ))}
                    </Card.Body>
                  </Card>
                  <input
                    className="mb-3"
                    type="file"
                    onChange={(e) => {
                      setDocument(e.target.files[0]);
                    }}
                  />
                  <Button
                    onClick={() => {
                      uploadDocuments();
                    }}
                  >
                    Upload
                  </Button>
                </Col>
                <Col sm={6}>
                  <h5>Enter Relieving Date</h5>
                  <Datepicker
                    className="form-control"
                    selected={relievingData}
                    onChange={(e) => {
                      setRelievingDate(e);
                    }}
                    autoComplete="off"
                    name="startDate"
                    dateFormat="dd/MM/yyyy"
                    placeholder="Select relieving date"
                    maxDate={new Date()}
                  />
                  <TextInput
                    className="mt-5"
                    placeholder="Enter reason for relieving date"
                    type="text"
                    as="textarea"
                    rows="5"
                    value={relievingDateReason}
                    onInputChange={(e) => {
                      setRelievingDateReason();
                    }}
                  />

                  <Button className="mr-5 mb-3">Approve</Button>

                  <Button
                    className="ml-5 mb-3"
                    variant="secondary"
                    onClick={() => {
                      setManagerDeclineToggle(true);
                    }}
                  >
                    Decline
                  </Button>
                  {managerDeclineToggle && (
                    <TextInput
                      placeholder="Enter reason for decline"
                      type="text"
                      as="textarea"
                      rows="5"
                    />
                  )}
                </Col>
              </Row>
            )}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ResignationDetails;
