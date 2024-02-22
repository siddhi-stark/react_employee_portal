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
import { Card, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

const ResignationDetails = (props) => {
  const { match } = props;
  const [pageTitle, setPageTitle] = useState('Resignation');
  const location = useLocation();
  const { state } = location;
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);
  const [managerDeclineToggle, setManagerDeclineToggle] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [retainReason, setRetainReason] = useState('');
  const [roleId, setRoleId] = useState();
  console.log('🚀 ~ ResignationDetails ~ roleId:', roleId);
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

  const history = useHistory();

  useEffect(() => {
    if (roleId == '4') {
      swal({
        title: 'Unauthorized access',
        text: '',
        icon: 'error',
        // confirmBtnBsStyle: 'btn btn-primary btn-lg',
        // cancelBtnBsStyle: 'btn btn-lg btn-secondary',
        dangerMode: true,
        buttons: false,
        closeOnClickOutside: false,
        allowOutsideClick: false,
        timer: 3000,
      }).then(() => {
        localStorage.clear();
        window.location.href = '/login';
      });
    }
  }, [roleId]);

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
    },
    {
      name: 'Feedback Form',
      isCheck: false,
      id: 2,
      doc_id: '',
    },
    {
      name: 'Handover Document',
      isCheck: false,
      id: 3,
      doc_id: '',
    },
    {
      name: 'Experience Letter',
      isCheck: false,
      id: 4,
      doc_id: '',
    },
    {
      name: 'Exit Interview Documents',
      isCheck: false,
      id: 5,
      doc_id: '',
    },
    {
      name: 'Relieving Document',
      isCheck: false,
      id: 6,
      doc_id: '',
    },
    {
      name: 'Other Document',
      isCheck: false,
      id: 7,
      doc_id: '',
    },
  ]);

  useEffect(() => {
    setRoleId(customFunctions.getLocalStorage('group'));
  }, [roleId]);

  useEffect(() => {
    if (match?.params?.id) {
      getResignationDetails();
    }
  }, [match?.params?.id]);

  useEffect(() => {
    if (userId) {
      getUploadedDocuments();
    }
  }, [userId]);

  const getResignationDetails = async () => {
    setShowLoader(true);
    const endPoint = `${Api.getResignationListUrl}${match?.params?.id}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      setRowData(data?.data);
      setUserId(data?.data?.user?.id);
      setRelievingDate(
        data?.data?.user?.relieving_date
          ? new Date(data?.data?.user?.relieving_date)
          : ''
      );
      setShowLoader(false);
    } else {
      setShowLoader(false);
      if (message == 'Employee resignation not found.') {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
    }
  };

  const approveResignation = async (status) => {
    setShowLoader(true);
    setShowError(false);

    const postData = {
      resignation_status: status,
    };

    if (status == 1) {
      postData.resign_remark = approveReason;
    } else {
      postData.resignation_decline_note = approveReason;
    }
    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal(
        status == 1
          ? 'Resignation approved successfully'
          : 'Resignation declined successfully',
        '',
        'success'
      ).then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getUploadedDocuments = async () => {
    setShowLoader(true);
    const endPoint = `https://developmentapi.starkdigital.in/api/v1/upload-document/`;
    const params = {
      user: userId,
    };
    const token = customFunctions.getLocalStorage('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await axios.get(url, {
      // headers: headers,
    });
    if (data && data.success == true) {
      setShowLoader(false);
      let uploadedDoc = [];
      const updatedDocumentsList = documentsList.map((doc) => {
        const uploadedDoc = data?.data?.find(
          (item) => doc.id === item.document_type
        );

        if (uploadedDoc) {
          return {
            ...doc,
            isCheck: true,
            isDiseable: true,
            url: uploadedDoc?.s3_url,
            doc_id: uploadedDoc?.id,
          };
        } else {
          return {
            ...doc,
            isCheck: false,
            isDiseable: false,
          };
        }
      });

      setDocumentList(updatedDocumentsList);
    } else {
      swal(message, '', 'error');
    }
  };

  const handleSubmit = async (e) => {
    setShowLoader(true);
    const formData = new FormData();
    if (document) {
      formData.append('image', document);
      formData.append('document_type', Number(selectedDocument));
      formData.append('user_id', Number(userId));
    }

    // const callback = AuthApi.postDataToServer;
    const endPoint = `${Api.uploadDocumentsUrl}`;
    const token = customFunctions.getLocalStorage('access_token');
    const headers = {
      accept: 'application/json',
      platform: 'web',
      version: '1.0',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      Authorization: `Bearer ${token}`,
      maxBodyLength: Infinity,
      // 'Content-Type': 'multipart/form-data',
    };
    const { data, message } = await axios.post(endPoint, formData, {
      // headers: headers,
    });
    if (data && data.success == true) {
      setShowLoader(false);
      getUploadedDocuments();
      swal('document uploaded successfully', '', 'success').then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const retainRequest = async (status) => {
    setShowLoader(true);
    setShowError(false);
    const postData = {
      retain_status: status,
    };
    if (status == 1) {
      postData.retention_acceptance_reason = retainReason;
    } else {
      postData.retention_decline_reason = retainReason;
    }

    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal(
        status == 1
          ? 'Retention approved successfully'
          : 'Retention declined successfully',
        '',
        'success'
      ).then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const buyBackRequest = async (status) => {
    setShowLoader(true);
    setShowError(false);
    const postData = {
      buy_back_status: status,
    };

    if (status == 1) {
      postData.buy_back_acceptance_reason = buyBackReason;
    } else {
      postData.buy_back_decline_reason = buyBackReason;
    }

    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal(
        status == 1
          ? 'Buy back request approved successfully'
          : 'Buy back request declined successfully',
        '',
        'success'
      ).then(() => {
        window.location.reload();
      });
    } else {
      setShowError(false);
      swal(message, '', 'error');
    }
  };

  const resignationRequestHr = async (status) => {
    setShowLoader(true);
    setShowError(false);
    const postData = {
      resignation_status: status,
    };
    if (status == 1) {
      postData.resign_remark = approveReason;
    } else {
      postData.resignation_decline_note = approveReason;
    }

    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);

      swal(
        status == 1
          ? 'Resignation approved successfully'
          : 'Resignation declined successfully',
        '',
        'success'
      ).then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const isValid = (type, status) => {
    if (type == 'admin') {
      if (status == 'approve_resign' && approveReason) {
        approveResignation(1);
      } else if (status == 'decline_resign' && approveReason) {
        approveResignation(2);
      } else {
        setShowError(true);
      }
    }
    if (type == 'hr') {
      if (status == 'approve_resign' && approveReason) {
        resignationRequestHr(1);
      } else if (status == 'decline_resign' && approveReason) {
        resignationRequestHr(2);
      } else {
        setShowError(true);
      }
    }

    if (type == 'admin_retain') {
      if (status == 'accept_retain' && retainReason) {
        retainRequest(1);
      } else if (status == 'decline_retain' && retainReason) {
        retainRequest(2);
      } else {
        setShowError(true);
      }
    }

    if (type == 'buy_back') {
      if (status == 'accept' && buyBackReason) {
        buyBackRequest(1);
      } else if (status == 'decline' && buyBackReason) {
        buyBackRequest(2);
      } else {
        setShowError(true);
      }
    }
  };

  const changeRelievingData = async () => {
    setShowLoader(true);
    const postData = {
      relieving_date: customFunctions.getDate(relievingDate),
      relieving_date_update_reason: relievingDateReason,
    };
    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);

      swal('Relieving date changed successfully', '', 'success').then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const isRelived = async () => {
    setShowLoader(true);
    const postData = {
      is_relived: true,
    };
    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.employeeResignationUrl}${state?.state?.resignationId}/`;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal('Employee release successfully', '', 'success').then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const deleteDocument = async (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure, do you want to remove the document ?',
        icon: 'warning',
        confirmBtnBsStyle: 'btn btn-primary btn-lg',
        cancelBtnBsStyle: 'btn btn-lg btn-secondary',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          setShowLoader(true);
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.uploadDocumentsUrl}${id}/`
          );
          if (data) {
            setShowLoader(false);
            swal(data && data.message[0], '', 'success', {
              // closeOnClickOutside: false,
              // allowOutsideClick: false,
              // buttons: false,
              // timer: 2000,
            }).then(() => {
              window.location.reload();
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

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
                      <th scope="row">Employee Name</th>
                      <td>
                        {rowData?.user?.full_name
                          ? rowData?.user?.full_name
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Employee Id</th>
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
                        {rowData?.user?.date_joined
                          ? rowData?.user?.date_joined
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
                    <tr>
                      <th scope="row">Reporting Person</th>
                      <td>
                        {rowData?.reporting_manager?.manager_name
                          ? rowData?.reporting_manager?.manager_name
                          : '-'}
                      </td>
                    </tr>
                    {rowData?.user?.relieving_date && (
                      <tr>
                        <th scope="row">Relieving Date</th>
                        <td>
                          {rowData?.user?.relieving_date
                            ? customFunctions.getDMYDate(
                                rowData?.user?.relieving_date
                              )
                            : '-'}
                        </td>
                      </tr>
                    )}
                    {rowData?.buy_back_date && (
                      <tr>
                        <th scope="row">Buy Back Date</th>
                        <td>
                          {rowData?.buy_back_date
                            ? customFunctions.getDMYDate(rowData?.buy_back_date)
                            : '-'}
                        </td>
                      </tr>
                    )}
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
              {rowData?.retain_status == '3' && !rowData?.user?.relieved && (
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
              {rowData?.buy_back_status == '3' && !rowData?.user?.relieved && (
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
                          isValid('admin', 'decline_resign');
                        }}
                      >
                        Decline
                      </Button>
                    </Col>
                  </Row>
                )}
            </Col>
          </Row>
          {!rowData?.user?.relieved && rowData?.resignation_status != '3' && (
            <Alert className="text-center p-4" variant="info">
              <Alert.Heading>
                <h4>
                  {' '}
                  {rowData?.resignation_status == '1'
                    ? 'Resignation Approved'
                    : rowData?.resignation_status == '4'
                    ? 'Resignation Cancelled'
                    : 'Resignation Declined'}{' '}
                </h4>
              </Alert.Heading>
            </Alert>
          )}

          {/* {rowData?.user?.relieved == true && (
            <Alert className="text-center p-4" variant="info">
              <Alert.Heading>
                <h4>
                 Employee Relieved
                </h4>
              </Alert.Heading>
            </Alert>
          )} */}
          <Row className="mt-3">
            <hr />

            {/* Hr Resignation form  */}

            {rowData?.resignation_status != 2 && rowData?.retain_status != 1 && (
              <Row>
                <Col sm={6}>
                  {rowData?.user?.relieving_date <=
                    customFunctions.getDate(new Date()) && (
                    <>
                      <>
                        <h5>Upload Exit Documents</h5>
                        <Card>
                          <Card.Body>
                            {documentsList &&
                              documentsList.map((item, index) => (
                                <Row>
                                  <Col sm={9}>
                                    <ul>
                                      <input
                                        className=""
                                        type={'checkbox'}
                                        value={item?.isCheck}
                                        checked={item?.isCheck}
                                        id="flexCheckDefaultBeneficiary"
                                        onChange={(e) => {
                                          setDocumentSelected(true);
                                          let temData = [];
                                          documentsList &&
                                            documentsList.map((dt, ind) => {
                                              if (dt?.isDiseable == true) {
                                                temData.push({
                                                  ...dt,
                                                });
                                              } else {
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
                                              }
                                            });
                                          setDocumentList(temData);
                                          forceUpdate(count + 1);
                                        }}
                                        disabled={item?.isDiseable == true}
                                      />{' '}
                                      &nbsp;
                                      {item?.name}
                                    </ul>
                                  </Col>
                                  <Col sm={3}>
                                    {item.isDiseable == true && (
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
                                    )}
                                  </Col>
                                </Row>
                              ))}
                          </Card.Body>
                        </Card>
                      </>
                      <TextInput
                        className="mb-3"
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
                      <Button
                        onClick={(e) => {
                          handleSubmit();
                        }}
                        disabled={!isDocumentSelected || document == null}
                      >
                        Upload
                      </Button>
                      {/* <center className="mb-4 mt-3"> */}
                      <h6 className="mt-5" style={{ fontSize: 'smaller' }}>
                        <b>Note:</b>
                      </h6>
                      <h6 style={{ fontSize: 'smaller' }}>
                        1. Maximum upload file size limit is 1 MB.
                      </h6>
                      <h6 style={{ fontSize: 'smaller' }}>
                        2. File supported extension is pdf , docx
                      </h6>

                      {/* </center> */}
                    </>
                  )}
                </Col>
                <Col sm={6}>
                  {rowData?.user?.relieved != true &&
                    rowData?.resignation_status == 1 && (
                      <>
                        <h5>Relieving Date</h5>
                        <TextInput
                          label=" Reason to update relieving date"
                          placeholder="Enter reason for changing relieving date..."
                          asterisk="*"
                          type="text"
                          as="textarea"
                          rows="3"
                          value={relievingDateReason}
                          onInputChange={(e) => {
                            setRelievingDateReason(e.target.value);
                          }}
                        />
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
                        <Row>
                          <Col sm={4}>
                            <Button
                              className="mr-5 mb-3 mt-2"
                              disabled={!relievingDateReason}
                              onClick={() => {
                                swal({
                                  title: 'Are you sure?',
                                  text: 'You want to change relieving date',
                                  icon: 'warning',
                                  buttons: true,
                                  dangerMode: true,
                                }).then((willDelete) => {
                                  if (willDelete) {
                                    changeRelievingData();
                                  }
                                });
                              }}
                            >
                              Update
                            </Button>
                          </Col>
                          <Col sm={8}></Col>
                        </Row>
                      </>
                    )}

                  {rowData?.relieving_date_update_reason && (
                    <>
                      <p>Reason of changing relieving date</p>
                      <Alert className="" variant="secondary">
                        <Alert.Heading>
                          <h6>{rowData?.relieving_date_update_reason}</h6>
                        </Alert.Heading>
                      </Alert>
                    </>
                  )}

                  {rowData?.user?.relieving_date ==
                    customFunctions.getDate(new Date()) && (
                    <Form>
                      {['checkbox'].map((type) => (
                        <div
                          key={`default-${type}`}
                          className="mb-3 mt-3 float-end"
                        >
                          <Form.Check // prettier-ignore
                            type={type}
                            id={`default-${type}`}
                            label={
                              rowData?.user?.relieved == true
                                ? 'Employee Relieved'
                                : `Click here to relieved employee`
                            }
                            // value={item?.isCheck}
                            disabled={rowData?.user?.relieved == true}
                            checked={rowData?.user?.relieved == true}
                            onChange={(e) => {
                              swal({
                                title: 'Are you sure?',
                                text: 'You want to relive this employee',
                                icon: 'warning',
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  isRelived();
                                }
                              });
                            }}
                          />
                        </div>
                      ))}
                    </Form>
                  )}
                  {rowData?.resignation_status == '3' && roleId == '5' && (
                    <>
                      <Row>
                        <TextInput
                          label="Resignation remark"
                          placeholder="Enter reason"
                          type="text"
                          as="textarea"
                          asterisk="*"
                          rows="5"
                          value={approveReason}
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
                      </Row>
                    </>
                  )}
                  {/* {rowData?.buy_back_status == '3' && (
                    <TextInput
                      className="mt-5"
                      placeholder="Enter reason for relieving date"
                      type="text"
                      as="textarea"
                      rows="5"
                      value={approveReason}
                      onInputChange={(e) => {
                        setApproveReason();
                      }}
                    />
                  )} */}

                  <>
                    {rowData?.resignation_status == '3' && roleId == '5' && (
                      <>
                        <Button
                          className="mr-5 mb-3"
                          onClick={() => {
                            // resignationRequestHr(1);
                            isValid('hr', 'approve_resign');
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          className="ml-5 mb-3"
                          variant="secondary"
                          onClick={() => {
                            // resignationRequestHr(2);
                            isValid('hr', 'decline_resign');
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                  </>
                </Col>
              </Row>
            )}
          </Row>

          {/* {rowData?.user?.relieved == true &&
          <div
          className='float-end'
          >
          <h5>Employee Relived</h5>
          </div>
          } */}
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
        modalBody={<div className=""></div>}
      />
    </>
  );
};

export default ResignationDetails;
