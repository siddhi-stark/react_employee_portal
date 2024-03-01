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
  const [key, setKey] = useState('1');
  const [stepTwoKey, setStepTwoKey] = useState('0');
  const [stepThreeKey, setStepThreeKey] = useState('0');
  const [uniqueDocumentOptions, setUniqueDocumentOptions] = useState([]);
  console.log(
    '🚀 ~ ResignationDetailsComponent ~ uniqueDocumentOptions:',
    uniqueDocumentOptions
  );
  const [userId, setUserId] = useState();
  const [buyBackReason, setBuyBackReason] = useState('');
  const [shoeError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
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

  useEffect(() => {
    if (rowData?.user?.relieving_date <= customFunctions.getDate(new Date())) {
      setStepTwoKey('1');
    }
    if (rowData?.user?.relieved == true) {
      setStepThreeKey('1');
    }
  }, [rowData]);

  useEffect(() => {
    const unique =
      documentsList && documentsList?.filter((item) => item?.isCheck == false);
    setUniqueDocumentOptions(unique);
  }, [documentsList]);

  useEffect(() => {
    setRoleId(customFunctions.getLocalStorage('group'));
  }, [roleId]);

  useEffect(() => {
    if (match?.params?.id) {
      getResignationDetails();
    }
  }, [match?.params?.id]);

  useEffect(() => {
    // if (userId) {
    getUploadedDocuments();
    // }
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
        // localStorage.clear();
        // window.location.href = '/login';
        swal(message, '', 'error');
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
    const endPoint = `${Api.uploadDocumentsUrl}`;
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
      formData.append('document_type', Number(selectedDocument?.id));
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
      // relieving_date_update_reason: relievingDateReason,
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
            Application Details
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <div className="mt-5 mb-5 ">
          <Accordion activeKey={key}>
            <Card>
              <Card.Header className="position-relative bg-primary">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ minHeight: '30px' }}
                >
                  <h6 className="text-white m-0">
                    Step 1 (Resignation Process)
                  </h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (key == '1') {
                          setKey('0');
                        } else {
                          setKey('1');
                        }
                      }}
                    >
                      <img
                        src={
                          key == '0'
                            ? '/images/caret-down.svg'
                            : '/images/caret-up.svg'
                        }
                        className="forWhiteImg"
                        alt=""
                      />
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
                                  ? customFunctions.getDMYDate(
                                      rowData?.user?.date_joined
                                    )
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
                            {/* {rowData?.user?.relieving_date && ( */}
                            <tr>
                              <th scope="row">Resignation Status</th>
                              <td>
                                {rowData?.resignation_status_name
                                  ? rowData?.resignation_status_name
                                  : '-'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Last Working Date</th>
                              <td>
                                {rowData?.user?.relieving_date
                                  ? customFunctions.getDMYDate(
                                      rowData?.user?.relieving_date
                                    )
                                  : '-'}
                                <a
                                  className="d-block w-100"
                                  href="javascript:void(0)"
                                  onClick={() => {
                                    setShowModal(true);
                                  }}
                                >
                                  {rowData?.resignation_status == '1' && (
                                    <u> Update Date</u>
                                  )}
                                </a>
                              </td>
                            </tr>
                            {/* <tr>
                              <th scope="row">Relieving Status</th>
                              <td>
                                {rowData?.user?.relieved == true
                                  ? 'Approved'
                                  : 'Pending'}
                              </td>
                            </tr> */}
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
                                {rowData?.reliving_date_updated_by
                                  ? rowData?.reliving_date_updated_by
                                  : '-'}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Updated Date</th>
                              <td>
                                {rowData?.relieving_date_updated_on_date
                                  ? `${customFunctions.getDMYDate(
                                      rowData?.relieving_date_updated_on_date
                                    )} , ${customFunctions.formatAMPM(
                                      rowData?.relieving_date_updated_on_date
                                    )}`
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
                      {(rowData?.resign_remark ||
                        rowData?.resignation_decline_note) && (
                        <div>
                          <h6>
                            <b>Resignation remarks</b>
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
                                maxlength={255}
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
                              <h6 className="content-title text-count-box float-end">
                                {`${retainReason?.length}/255`}
                              </h6>
                            </>
                            <div style={{ marginLeft: '-12px' }}>
                              <Row className="mt-3 mb-3">
                                <Col>
                                  <Button
                                    className="me-3"
                                    onClick={() => {
                                      // retainRequest(1);
                                      isValid('admin_retain', 'accept_retain');
                                    }}
                                  >
                                    Accept Retention
                                  </Button>

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
                            </div>
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
                              maxlength={255}
                              value={buyBackReason}
                              onInputChange={(e) => {
                                setBuyBackReason(e.target.value);
                                setShowError(false);
                              }}
                            />
                            <h6 className="content-title text-count-box float-end">
                              {`${buyBackReason?.length}/255`}
                            </h6>
                            {shoeError && (
                              <span style={{ color: 'red' }}>
                                Buy back reason field is required
                              </span>
                            )}
                            <div style={{ marginLeft: '-12px' }}>
                              <Row className="mt-0 mb-3">
                                <Col>
                                  <Button
                                    onClick={() => {
                                      // buyBackRequest(1);
                                      isValid('buy_back', 'accept');
                                    }}
                                    className="me-3"
                                  >
                                    Accept
                                  </Button>
                                  {/* </Col>
                                <Col> */}
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
                            </div>
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
                              maxlength={255}
                              onInputChange={(e) => {
                                setApproveReason(e.target.value);
                                setShowError(false);
                              }}
                            />
                            <h6 className="content-title text-count-box float-end">
                              {`${approveReason?.length}/255`}
                            </h6>
                            {shoeError && (
                              <span style={{ color: 'red' }}>
                                Reason field is required
                              </span>
                            )}
                          </>
                        )}

                      {!managerDeclineToggle &&
                        rowData?.resignation_status == '3' && (
                          <div style={{ marginLeft: '-12px' }}>
                            <Row>
                              <Col>
                                <Button
                                  className="me-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // approveResignation();
                                    isValid('admin', 'approve_resign');
                                  }}
                                >
                                  Approve
                                </Button>
                                {/* </Col>
                            <Col> */}
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
                          </div>
                        )}
                    </Col>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <Accordion activeKey={stepTwoKey}>
            <Card>
              <Card.Header className="position-relative bg-primary">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ minHeight: '30px' }}
                >
                  <h6 className="text-white m-0"> Step 2 (Exit Process)</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (
                          stepTwoKey == '0' &&
                          rowData?.user?.relieving_date <=
                            customFunctions.getDate(new Date())
                        ) {
                          setStepTwoKey('1');
                        } else {
                          setStepTwoKey('0');
                        }
                      }}
                    >
                      <img
                        src={
                          stepTwoKey == '0'
                            ? '/images/caret-down.svg'
                            : '/images/caret-up.svg'
                        }
                        className="forWhiteImg"
                        alt=""
                      />
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
                  <Row className="mt-3 d-flex align-items-end">
                    <Col sm={3}>
                      <DropdownInput
                        label="Select Document"
                        options={uniqueDocumentOptions}
                        defaultValue={selectedDocument}
                        onSelectHandler={(select) => {
                          setSelectedDocument(select);
                        }}
                        disabled={uniqueDocumentOptions.length <= 0}
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
                        disabled={uniqueDocumentOptions.length <= 0}
                      />
                    </Col>
                    <Col>
                      <Button
                        className="mt-4 mb-4"
                        onClick={(e) => {
                          handleSubmit();
                        }}
                        disabled={!selectedDocument || document == null}
                      >
                        Upload
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col sm={6}>
                      <Card className="border-0">
                        <Card.Body>
                          <ul>
                            {documentsList &&
                              documentsList?.slice(0, 4)?.map((item, index) => (
                                <li className="mb-2 d-flex justify-content-between">
                                  {item.isDiseable == true ? (
                                    <del>{item?.name}</del>
                                  ) : (
                                    item?.name
                                  )}
                                  {item.isDiseable == true && (
                                    <div
                                      style={{ marginRight: '90px' }}
                                      className="btn-wrapper"
                                    >
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
                                    </div>
                                  )}
                                </li>
                              ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={6}>
                      <Card className="border-0">
                        <Card.Body>
                          <ul>
                            {documentsList &&
                              documentsList?.slice(4, 7)?.map((item, index) => (
                                <li className="mb-2 d-flex justify-content-between">
                                  {item.isDiseable == true ? (
                                    <del>{item?.name}</del>
                                  ) : (
                                    item?.name
                                  )}
                                  {item.isDiseable == true && (
                                    <div
                                      style={{ marginRight: '90px' }}
                                      className="btn-wrapper"
                                    >
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
                                          alt="delete-icon"
                                        />
                                      </a>
                                    </div>
                                  )}
                                </li>
                              ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <Accordion activeKey={stepThreeKey}>
            <Card>
              <Card.Header className="position-relative bg-primary">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ minHeight: '30px' }}
                >
                  <h6 className="text-white m-0">Step 3 (Relieving Process)</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (
                          stepThreeKey == '0' &&
                          rowData?.user?.relieving_date <=
                            customFunctions.getDate(new Date())
                        ) {
                          setStepThreeKey('1');
                        } else {
                          setStepThreeKey('0');
                        }
                      }}
                    >
                      <img
                        src={
                          stepThreeKey == '0'
                            ? '/images/caret-down.svg'
                            : '/images/caret-up.svg'
                        }
                        className="forWhiteImg"
                        alt=""
                      />
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card>
                  <Card.Body>
                    <div className="mt-3 mb-3">
                      <Row>
                        {!rowData?.user?.relieved ? (
                          <Col className="d-flex justify-content-start">
                            {/* <h6>
                Please{' '}
                <a href="#">
                  {' '}
                  <u>Click here</u>{' '}
                </a>{' '}
                to relieve Akshay Chavan
              </h6> */}

                            <Button
                              onClick={() => {
                                swal({
                                  title: 'Are you sure?',
                                  text: 'Do you want to relieve this employee today?',
                                  icon: 'warning',
                                  buttons: true,
                                  dangerMode: true,
                                }).then((willDelete) => {
                                  if (willDelete) {
                                    isRelived();
                                  }
                                });
                              }}
                            >
                              Relieve Employee
                            </Button>
                          </Col>
                        ) : (
                          <h4 className="d-flex justify-content-start">
                            Employee has relieved
                          </h4>
                        )}
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Accordion.Collapse>
            </Card>
          </Accordion>
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
            <TextInput
              label="Reason"
              value={relievingDateReason}
              onInputChange={(e) => {
                setRelievingDateReason(e.target.value);
              }}
            />
            <Button
              className="mr-5 mb-3 mt-2"
              // disabled={!relievingDateReason}
              onClick={() => {
                setShowModal(false);
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
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        }
      />
    </>
  );
};

export default ResignationDetailsComponent;
