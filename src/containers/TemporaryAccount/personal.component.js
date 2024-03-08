/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import {
  Helmet,
  DropdownInput,
  TextInput,
  ModalInput,
  Datepicker,
} from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './historyFormschema.json';

import {
  Card,
  Row,
  Col,
  Button,
  Alert,
  Container,
  Accordion,
  Form,
} from 'react-bootstrap';
import axios from 'axios';

function Personal(props) {
  const { getParentsData } = props;

  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  const applicantId = accProps.props.applicantId;
  const employeeId = accProps.props.ID;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

  const idProps = accProps.props.match.params.ID;

  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [document, setDocument] = useState('');
  console.log('🚀 ~ Personal ~ document:', document);
  const [isShowLoader, setShowLoader] = useState(false);
  const [stepOneKey, setStepOneKey] = useState('0');
  const [stepTwoKey, setStepTwoKey] = useState('0');
  const [stepThreeKey, setStepThreeKey] = useState('0');
  const [stepFourKey, setStepFourkey] = useState('0');
  const [selectedDocument, setSelectedDocument] = useState();
  console.log('🚀 ~ Personal ~ selectedDocument:', selectedDocument);
  const [personalUniqueArray, setPersonalUniqueArray] = useState();
  const [educationalUniqueArray, setEducationalUniqueArray] = useState('');

  const [personalDocuments, setPersonalDocuments] = useState([
    {
      label: 'Pan Card',
      value: 'panCard',
      type: 'panCard',
      // file_id: '',
      personal_document_type: 1,
      // url: '',
      isUploaded: false,
    },
    {
      label: 'Aadhar Card',
      value: 'aadharCard',
      type: 'aadharCard',
      // file_id: '',
      personal_document_type: 2,
      // url: '',
      isUploaded: false,
    },
    {
      label: 'Photo',
      value: 'photo',
      type: 'photo',
      // file_id: '',
      personal_document_type: 3,
      // url: '',
      isUploaded: false,
    },
  ]);
  console.log('personalDocuments', personalDocuments);

  const [educationalDocuments, setEducationalDocuments] = useState([
    {
      label: 'SSC',
      value: 'ssc',
      type: 'ssc',
      file_id: '',
      educational_document_type: 1,
      url: '',
    },
    {
      label: 'HSC',
      value: 'hsc',
      type: 'hsc',
      file_id: '',
      educational_document_type: 2,
      url: '',
    },
    {
      label: 'Graduation',
      value: 'graduation',
      type: 'graduation',
      file_id: '',
      educational_document_type: 3,
      url: '',
    },
    {
      label: 'Post Graduation',
      value: 'postgraduation',
      type: 'postgraduation',
      file_id: '',
      educational_document_type: 4,
      url: '',
    },
  ]);

  const [previousEmployement, setPreviousEmployement] = useState([
    {
      label: 'Salary Slip 1',
      value: 'salary_slip_1',
      file_id: '',
      url: '',
      employment_document_type: '',
    },
    {
      label: 'Salary Slip 2',
      value: 'salary_slip_2',
      file_id: '',
      url: '',
      employment_document_type: '',
    },
    {
      label: 'Salary Slip 3',
      value: 'salary_slip_3',
      file_id: '',
      url: '',
      employment_document_type: '',
    },
    {
      label: 'Relieving Letter',
      value: 'relieving_letter',
      file_id: '',
      url: '',
      employment_document_type: '',
    },
    {
      label: 'Experience Letter',
      value: 'experience_letter',
      file_id: '',
      url: '',
      employment_document_type: '',
    },
  ]);

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  useEffect(() => {
    const unique =
      personalDocuments &&
      personalDocuments?.filter((item) => item?.isUploaded == false);
    setPersonalUniqueArray(unique);
  }, [personalDocuments]);

  useEffect(() => {
    const unique =
      educationalDocuments &&
      educationalDocuments?.filter((item) => item?.url == '');
    setEducationalUniqueArray(unique);
  }, [educationalDocuments]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    if (applicantId) {
      getUploadedDocuments();
    }
  }, [applicantId]);

  const handelChange = async (type) => {
    setShowLoader(true);
    const formData = new FormData();
    formData.append('file_name', document);
    formData.append('document_type', selectedDocument?.personal_document_type);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const { data, message } = await axios.post(endPoint, formData, {});
    if (data && data.success == true) {
      console.log('🚀 ~ handelChange ~ data:', data?.data);
      setShowLoader(false);

      setPersonalDocuments(updatedDocumentsList);

      swal('document uploaded successfully', '', 'success').then(() => {
        // window.location.reload();
        getUploadedDocuments();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getUploadedDocuments = async () => {
    setShowLoader(true);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const params = {
      applicant: applicantId,
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
      const updatedDocumentsList = personalDocuments.map((item) => {
        const updateDoc = data?.data?.find(
          (doc) => item?.personal_document_type == doc?.personal_document_type
        );
        console.log('🚀 ~ ------------', updateDoc);
        if (updateDoc) {
          return {
            ...item,
            file_id: updateDoc?.id,
            url: updateDoc?.image_url,
            isUploaded: true,
          };
        } else {
          return {
            ...item,
          };
        }
      });

      const updateEduList = educationalDocuments?.map((itm) => {
        const educationDoc = data?.data?.find(
          (dt) =>
            itm?.educational_document_type == dt?.educational_document_type
        );
        if (educationDoc) {
          return {
            ...itm,
            file_id: educationDoc?.id,
            url: educationDoc?.image_url,
          };
        }
      });

      const updateEmployement = previousEmployement?.map((data) => {
        let employementDoc = data?.data?.find(
          (op) => data?.employment_document_type == op?.employment_document_type
        );
        if (employementDoc) {
          return {
            ...data,
            file_id: employementDoc?.id,
            url: employementDoc?.image_url,
          };
        }
      });
      setPreviousEmployement(updateEmployement);
      // setPersonalDocuments(updatedDocumentsList);
      setEducationalDocuments(updateEduList);
      setShowLoader(false);
    } else {
      setShowLoader(false);
    }
  };

  const submitPersonalDoc = async (type,) => {
    setShowLoader(true);
    const postData = {
      applicant: applicantId,

      doc_type: 2,
      personal_documents: [
        {
          file_id: panCardUrl?.file_id,
          personal_document_type: 1,
        },
        {
          file_id: aadharCardData?.file_id,
          personal_document_type: 2,
        },
        {
          file_id: photoData?.file_id,
          personal_document_type: 3,
        },
      ],
    };

    
    if (type == 'personal') {
      postData.doc_type = 2;
    }
    const url = `${Api.postDocumentData}`;

    const { data, message } = await axios.post(url, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal('Personal documents uploaded successfully', '', 'success').then(
        () => {
          props.callback('educational', true);
        }
      );
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
            `${Api.onBoardingDocUpload}${id}/`
          );
          if (data) {
            setShowLoader(false);
            swal(data && data.message[0], '', 'success', {}).then(() => {
              // window.location.reload();
              getUploadedDocuments();
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

  useEffect(() => {
    getUserRole();
  }, []);

  const getData = async () => {
    setShowLoader(true);

    const addmoreData = [];

    const endPoint = candidateId
      ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`
      : `${Api.applicantInfoUrl}`;

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
    };

    const { data, message } = applicantId
      ? await AuthApi.postDataToServer(endPoint, postData)
      : await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      data.data &&
        data.data.applicant_history &&
        data.data.applicant_history.length > 0 &&
        data.data.applicant_history.map((doc) => {
          const reportingData = {};
          doc.reportings &&
            doc.reportings.length > 0 &&
            doc.reportings.map((report) => {
              if (report.is_hr) {
                reportingData.reporting_person_hr = report.reporting_person;
                reportingData.hr_email = report.email;
                reportingData.hr_mobile = report.mobile;
              } else {
                reportingData.reporting_person_manager =
                  report.reporting_person || '';
                reportingData.manager_email = report.email || '';
                reportingData.manager_mobile = report.mobile || '';
              }
              return report;
            });

          addmoreData.push({
            company_name: doc.company_name && doc.company_name,
            designation: doc.designation && doc.designation,
            company_url: doc.company_url && doc.company_url,
            start_date: doc.start_date && new Date(doc.start_date),
            end_date: doc.end_date && new Date(doc.end_date),
            duration: doc.duration && doc.duration,
            location: doc.location && doc.location,
            reporting_person_hr: reportingData.reporting_person_hr,

            hr_email: reportingData.hr_email,
            hr_mobile: reportingData.hr_mobile,
            reporting_person_manager: reportingData.reporting_person_manager,
            manager_email: reportingData.manager_email,
            manager_mobile: reportingData.manager_mobile,
          });
          return doc;
        });
      updateDefaultValues({ addmore: [...addmoreData] });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    if (candidateId || applicantId || stepThreeKey == '1') {
      getData();
    }
  }, [stepThreeKey]);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: idProps,
    };
    const postData = [];

    const report = {};

    await formValues.addmore.map((rp, i) => {
      report[i] = [];
      const hrReport = {};
      const managerReport = {};
      if (rp.reporting_person_hr) {
        hrReport.reporting_person = rp.reporting_person_hr;
        hrReport.email = rp.hr_email;
        hrReport.mobile = rp.hr_mobile;
        hrReport.is_hr = true;
        report[i].push(hrReport);
      }

      if (rp.reporting_person_manager) {
        managerReport.reporting_person = rp.reporting_person_manager;
        managerReport.email = rp.manager_email;
        managerReport.mobile = rp.manager_mobile;
        report[i].push(managerReport);
      }
      return rp;
    });
    const addEntry = formValues.addmore.entries();
    for (const [index, history] of addEntry) {
      // eslint-disable-line
      const candidateHistory = {
        designation: history.designation,
        company_name: history.company_name,
        company_url: history.company_url,
        start_date: history.start_date
          ? customFunctions.getDate(history.start_date)
          : '',
        end_date: history.end_date
          ? customFunctions.getDate(history.end_date)
          : '',
        location: history.location,
        reportings: report[index],
      };
      postData.push(candidateHistory);
    }
    payload.applicant_history = postData;
    const { data, message } = await AuthApi.postDataToServer(
      `${Api.applicantHistoryUrl}`,
      payload
    );

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    } else {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        if (candidateId) {
          getData();
        }
        swal.close();
      });
    }
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5 mb-5 me-3 ms-3">
          <Accordion activeKey={stepOneKey}>
            <Card>
              <Card.Header className="position-relative bg-primary">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ minHeight: '30px' }}
                >
                  <h6 className="text-white m-0"> Personal Documents</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (stepOneKey == '0') {
                          setStepOneKey('1');
                        } else {
                          setStepOneKey('0');
                        }
                      }}
                    >
                      <img
                        src={
                          stepOneKey == '0'
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
                  <Row className="mt-3 d-flex align-items-end">
                    <Col sm={3}>
                      <DropdownInput
                        label="Select Document"
                        options={personalUniqueArray}
                        defaultValue={selectedDocument}
                        onSelectHandler={(select) => {
                          setSelectedDocument(select);
                        }}
                        // disabled={uniqueDocumentOptions.length <= 0}
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
                            ['png', 'jpeg', 'jpg'].includes(
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
                        // disabled={uniqueDocumentOptions.length <= 0}
                      />
                    </Col>
                    <Col>
                      <Button
                        className="mt-4 mb-4"
                        onClick={(e) => {
                          handelChange(selectedDocument?.value);
                        }}
                        // disabled={!selectedDocument || document == null}
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
                            {personalDocuments &&
                              personalDocuments?.map((item, index) => (
                                <li className="mb-2 d-flex justify-content-between">
                                  {item?.url ? (
                                    <del>{item?.label}</del>
                                  ) : (
                                    item?.label
                                  )}
                                  {item?.url && (
                                    <div
                                      style={{ marginRight: '90px' }}
                                      className="btn-wrapper"
                                    >
                                      <a
                                        href={item?.url}
                                        target="_blank"
                                        onClick={() => {
                                          window.open(item?.url);
                                        }}
                                        className="me-3"
                                      >
                                        View
                                      </a>

                                      <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                          deleteDocument(item?.file_id);
                                        }}
                                      >
                                        Delete
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
          <Accordion activeKey={stepTwoKey}>
            <Card>
              <Card.Header className="position-relative bg-primary">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ minHeight: '30px' }}
                >
                  <h6 className="text-white m-0"> Educational Documents</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (stepTwoKey == '0') {
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
                  <Row className="mt-3 d-flex align-items-end">
                    <Col sm={3}>
                      <DropdownInput
                        label="Select Document"
                        options={educationalUniqueArray}
                        defaultValue={selectedDocument}
                        onSelectHandler={(select) => {
                          setSelectedDocument(select);
                        }}
                        // disabled={uniqueDocumentOptions.length <= 0}
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
                            ['png', 'jpeg', 'jpg'].includes(
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
                        // disabled={uniqueDocumentOptions.length <= 0}
                      />
                    </Col>
                    <Col>
                      <Button
                        className="mt-4 mb-4"
                        onClick={(e) => {
                          handelChange(selectedDocument?.value);
                        }}
                        // disabled={!selectedDocument || document == null}
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
                            {educationalDocuments &&
                              educationalDocuments?.map((item, index) => (
                                <li className="mb-2 d-flex justify-content-between">
                                  {item?.url && item?.url ? (
                                    <del>{item?.label}</del>
                                  ) : (
                                    item?.label
                                  )}
                                  {item?.url && item?.url && (
                                    <div
                                      style={{ marginRight: '90px' }}
                                      className="btn-wrapper"
                                    >
                                      <a
                                        href={item?.url}
                                        target="_blank"
                                        onClick={() => {
                                          window.open(item?.url);
                                        }}
                                        className="me-3"
                                      >
                                        View
                                      </a>

                                      <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                          deleteDocument(item?.doc_id);
                                        }}
                                      >
                                        Delete
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
                  <h6 className="text-white m-0"> Employement History</h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (stepThreeKey == '0') {
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
                <Card.Body>
                  <Loader showLoader={isShowLoader} needFullPage={false} />
                  <StarkFormBuilder
                    containerClass=""
                    formHeaderClass=""
                    formSections={FormSections}
                    formHeading="Employement History"
                    onFormSubmit={(formValues) => {
                      submitForm(formValues);
                    }}
                    callbacks={{}}
                    defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={false}
                    showBtnClass={true}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons mb-4"
                    isStepForm={false}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Accordion activeKey={stepFourKey}>
            <Card>
              <Card.Header className="position-relative bg-primary">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ minHeight: '30px' }}
                >
                  <h6 className="text-white m-0">
                    {' '}
                    Previous Employment Documents
                  </h6>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle
                      className="toggle-btn-accordion"
                      as={Button}
                      variant="link"
                      onClick={() => {
                        if (stepFourKey == '0') {
                          setStepFourkey('1');
                        } else {
                          setStepFourkey('0');
                        }
                      }}
                    >
                      <img
                        src={
                          stepFourKey == '0'
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
                  <Row className="mt-3 d-flex align-items-end">
                    <Col sm={3}>
                      <DropdownInput
                        label="Select Document"
                        options={previousEmployement}
                        defaultValue={selectedDocument}
                        onSelectHandler={(select) => {
                          setSelectedDocument(select);
                        }}
                        // disabled={uniqueDocumentOptions.length <= 0}
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
                            ['png', 'jpeg', 'jpg'].includes(
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
                        // disabled={uniqueDocumentOptions.length <= 0}
                      />
                    </Col>
                    <Col>
                      <Button
                        className="mt-4 mb-4"
                        onClick={(e) => {
                          handelChange(selectedDocument?.value);
                        }}
                        // disabled={!selectedDocument || document == null}
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
                            {previousEmployement &&
                              previousEmployement?.map((item, index) => (
                                <li className="mb-2 d-flex justify-content-between">
                                  {item?.url ? (
                                    <del>{item?.label}</del>
                                  ) : (
                                    item?.label
                                  )}
                                  {item?.url && (
                                    <div
                                      style={{ marginRight: '90px' }}
                                      className="btn-wrapper"
                                    >
                                      <a
                                        href={item?.url}
                                        target="_blank"
                                        onClick={() => {
                                          window.open(item?.url);
                                        }}
                                        className="me-3"
                                      >
                                        View
                                      </a>

                                      <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                          deleteDocument(item?.doc_id);
                                        }}
                                      >
                                        Delete
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
        </div>
      </section>
    </>
  );
}

export default withRouter(Personal);
