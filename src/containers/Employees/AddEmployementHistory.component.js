/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import { saveAs } from 'file-saver';
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
import FormSections from './AddEmployementHistory.json.json';
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

function AddEmployementHistory(props) {
  const { getParentsData, personalInfo } = props;
  const { state } = useLocation();
  const history = useHistory();
  const [fileToDelete, setFileToDelete] = useState(null); // State to track the file to delete
  const accProps = { props };
  const employeeId = accProps?.props?.match?.params?.id;
  const applicantId = accProps?.props?.applicantId;
  const empId = accProps?.props?.personalInfo?.id;
  const passwordProps = accProps?.props?.password;
  const tokenProps = accProps?.props?.token;
  const nameProps = accProps?.props?.name;
  const emailProps = accProps?.props?.email;
  const uploadRef = useRef();
  const personalRef = useRef();
  const educationalRef = useRef();
  const idProps = accProps?.props?.match?.params?.ID;
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [document, setDocument] = useState(null);
  const [isShowLoader, setShowLoader] = useState(false);
  const [stepOneKey, setStepOneKey] = useState('1');
  const [stepTwoKey, setStepTwoKey] = useState('0');
  const [stepThreeKey, setStepThreeKey] = useState('0');
  const [stepFourKey, setStepFourkey] = useState('0');
  const [selectedDocument, setSelectedDocument] = useState({
    personalDoc: '',
    educationalDoc: '',
    employmentHistory: '',
  });
  const [isFresher, setIsFresher] = useState(null);
  const [personalUniqueArray, setPersonalUniqueArray] = useState();
  const [educationalUniqueArray, setEducationalUniqueArray] = useState('');
  const [employementUniqueArray, setEmployementUniqueArray] = useState('');
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [personalDocuments, setPersonalDocuments] = useState([
    {
      label: 'Pan Card',
      value: 'panCard',
      type: 'panCard',
      // file_id: '',
      personal_document_type: 1,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Aadhar Card',
      value: 'aadharCard',
      type: 'aadharCard',
      // file_id: '',
      personal_document_type: 2,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Photo',
      value: 'photo',
      type: 'photo',
      // file_id: '',
      personal_document_type: 3,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
  ]);

  const [educationalDocuments, setEducationalDocuments] = useState([
    {
      label: 'SSC',
      value: 'ssc',
      type: 'ssc',
      // file_id: '',
      educational_document_type: 1,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'HSC/ Diploma',
      value: 'hsc',
      type: 'hsc',
      // file_id: '',
      educational_document_type: 2,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Graduation',
      value: 'graduation',
      type: 'graduation',
      // file_id: '',
      educational_document_type: 3,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Post Graduation',
      value: 'postgraduation',
      type: 'postgraduation',
      // file_id: '',
      educational_document_type: 4,
      // url: '',
      isUploaded: false,
      primaryId: '',
    },
  ]);

  const [previousEmployement, setPreviousEmployement] = useState([
    {
      label: 'Salary Slip 1',
      value: 'salary_slip_1',
      file_id: '',
      url: '',
      employment_document_type: 1,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Salary Slip 2',
      value: 'salary_slip_2',
      file_id: '',
      url: '',
      employment_document_type: 2,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Salary Slip 3',
      value: 'salary_slip_3',
      file_id: '',
      url: '',
      employment_document_type: 3,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Relieving Letter',
      value: 'relieving_letter',
      file_id: '',
      url: '',
      employment_document_type: 4,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Experience Letter',
      value: 'experience_letter',
      file_id: '',
      url: '',
      employment_document_type: 5,
      isUploaded: false,
      primaryId: '',
    },
  ]);

  const clearFileInput = () => {
    if (uploadRef.current) {
      uploadRef.current.value = null;
    }
    if (personalRef.current) {
      personalRef.current.value = null;
    }
    if (educationalRef.current) {
      educationalRef.current.value = null;
    }
  };

  useEffect(() => {
    const unique =
      personalDocuments &&
      personalDocuments?.filter((item) => item?.isUploaded == false);
    setPersonalUniqueArray(unique);
  }, [personalDocuments]);

  useEffect(() => {
    const unique =
      educationalDocuments &&
      educationalDocuments?.filter((item) => item?.isUploaded == false);
    setEducationalUniqueArray(unique);
  }, [educationalDocuments]);

  useEffect(() => {
    const unique =
      previousEmployement &&
      previousEmployement?.filter((item) => item?.isUploaded == false);
    setEmployementUniqueArray(unique);
  }, [previousEmployement]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };
  useEffect(() => {
    getUserRole();
    if (employeeId) {
      getUploadedDocuments();
    }
  }, [employeeId]);

  useEffect(() => {
    const formSchema = [...FormSections];
    const updatedSchema = formSchema?.[0]?.fields?.[0]?.fields?.map((item) => {
      const itemData = item;
      if (item?.name === 'start_date' || item?.name === 'end_date') {
        const maxdate = new Date();
        itemData.maxDate = maxdate;
      }
      return itemData;
    });
    updateJsonSchema([...updatedSchema, ...formSchema]);
  }, [defaultValues]);

  const handelChange = async (type) => {
    setShowLoader(true);
    const formData = new FormData();
    formData.append('file_name', document);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const { data, message } = await axios.post(endPoint, formData, {});
    if (data && data.success == true) {
      setShowLoader(false);
      if (selectedDocument?.personalDoc?.personal_document_type) {
        const updatedDocumentsList = personalDocuments.find(
          (item) =>
            item?.personal_document_type ==
            selectedDocument?.personalDoc?.personal_document_type
        );
        updatedDocumentsList.file_id = data?.data?.id;
        updatedDocumentsList.fileName = data?.data?.image;
        updatedDocumentsList.isUploaded = true;
        const tempArray = personalDocuments?.filter(
          (item) =>
            item?.personal_document_type !=
            updatedDocumentsList?.personal_document_type
        );
        setPersonalDocuments([...tempArray, updatedDocumentsList]);
      }

      if (selectedDocument?.educationalDoc?.educational_document_type) {
        const updateEducationDoc = educationalDocuments?.find(
          (itm) =>
            itm?.educational_document_type ==
            selectedDocument?.educationalDoc?.educational_document_type
        );
        updateEducationDoc.file_id = data?.data?.id;
        updateEducationDoc.fileName = data?.data?.image;
        updateEducationDoc.isUploaded = true;
        const eduArray = educationalDocuments?.filter(
          (it) =>
            it?.educational_document_type !=
            updateEducationDoc?.educational_document_type
        );

        setEducationalDocuments([...eduArray, updateEducationDoc]);
      }

      if (selectedDocument?.employmentHistory?.employment_document_type) {
        const updateEmployementDoc = previousEmployement?.find(
          (dt) =>
            dt?.employment_document_type ==
            selectedDocument?.employmentHistory?.employment_document_type
        );
        updateEmployementDoc.file_id = data?.data?.id;
        updateEmployementDoc.fileName = data?.data?.image;
        updateEmployementDoc.isUploaded = true;

        const previousDocArray = previousEmployement?.filter(
          (data) =>
            data?.employment_document_type !=
            updateEmployementDoc?.employment_document_type
        );
        setPreviousEmployement([...previousDocArray, updateEmployementDoc]);
      }
      // setEmpId(data?.data?.emp_id);
      swal('Document uploaded successfully', '', 'success').then(() => {
        // const tempData = { ...selectedDocument }
        // tempData.personalDoc = ''
        // setSelectedDocument(tempData)

        setSelectedDocument({
          personalDoc: '',
          educationalDoc: '',
          employmentHistory: '',
        });
        getUploadedDocuments();
        setDocument(null);
        clearFileInput();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };
  const getUploadedDocuments = async () => {
    setShowLoader(true);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const idParam = employeeId
      ? { employee_id: employeeId }
      : { applicant: applicantId };

    const params = {
      // applicant: applicantId,
      ...idParam,
      type: 'all',
    };
    const token = customFunctions.getLocalStorage('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await axios.get(url, {
      headers: headers,
    });
    if (data && data.success == true) {
      const temData = [];
      const educationData = [];
      const employementData = [];

      const updatedDocumentsList = personalDocuments.map((doc) => {
        const uploadedDoc = data?.data?.find(
          (item) => doc.personal_document_type === item.personal_document_type
        );
        if (uploadedDoc) {
          temData.push({
            ...doc,
            fileName: uploadedDoc?.image_url,
            personal_document_type: uploadedDoc?.personal_document_type
              ? uploadedDoc?.personal_document_type
              : personalDocuments?.personal_document_type,
            file_id: uploadedDoc?.document,
            isUploaded: true,
            primaryId: uploadedDoc?.id,
          });
        } else {
          temData.push(doc);
        }
      });
      setPersonalDocuments(temData);

      const updateEducationDoc = educationalDocuments.map((dt) => {
        const uploadDoc = data?.data?.find((item) => {
          return (
            dt.educational_document_type == item?.educational_document_type
          );
        });
        if (uploadDoc) {
          educationData.push({
            ...dt,
            fileName: uploadDoc?.image_url,
            educational_document_type: uploadDoc?.educational_document_type
              ? uploadDoc?.educational_document_type
              : educationalDocuments?.educational_document_type,
            file_id: uploadDoc?.document,
            isUploaded: true,
            primaryId: uploadDoc?.id,
          });
        } else {
          educationData.push(dt);
        }
      });
      setEducationalDocuments(educationData);

      const updateEmployementDoc = previousEmployement.map((dt) => {
        const updateEmployement = data?.data?.find((item) => {
          return dt?.employment_document_type == item?.employment_document_type;
        });
        if (updateEmployement) {
          employementData.push({
            ...dt,
            fileName: updateEmployement?.image_url,
            employment_document_type:
              updateEmployement?.employment_document_type,
            file_id: updateEmployement?.document,
            isUploaded: true,
            primaryId: updateEmployement?.id,
          });
        } else {
          employementData.push(dt);
        }
      });
      setPreviousEmployement(employementData);
      setShowLoader(false);
    } else {
      setShowLoader(false);
    }
  };
  const submitDocumentsData = async (type) => {
    setShowLoader(true);
    const headers = {
      'Content-Type': 'application/json',
    };
    const postData = {
      // applicant: applicantId,
      employee: Number(employeeId),
    };
    const personal = [];
    const educational = [];
    const employement = [];

    if (type == 'personal') {
      personalDocuments &&
        personalDocuments?.map((item) => {
          if (item?.file_id) {
            personal.push({
              file_id: item?.file_id,
              personal_document_type: item?.personal_document_type,
            });
          }
        });
    }

    if (type == 'educational') {
      educationalDocuments &&
        educationalDocuments?.map((item) => {
          if (item?.file_id) {
            educational.push({
              file_id: item?.file_id,
              educational_document_type: item?.educational_document_type,
            });
          }
        });
    }

    if (type == 'employement') {
      previousEmployement &&
        previousEmployement?.map((item) => {
          if (item?.file_id) {
            employement.push({
              file_id: item?.file_id,
              employment_document_type: item?.employment_document_type,
            });
          }
        });
    }

    if (type == 'personal') {
      postData.doc_type = 2;
      postData.personal_documents = personal;
    }

    if (type == 'educational') {
      postData.doc_type = 1;
      postData.educational_documents = educational;
    }

    if (type == 'employement') {
      postData.doc_type = 3;
      postData.employment_documents = employement;
    }
    const url = `${Api.postDocumentData}`;

    const { data, message } = await axios.post(url, postData, {
      headers: headers,
    });
    if (data && data.success == true) {
      setFileToDelete(null);
      setShowLoader(false);
      swal('Documents submitted successfully', '', 'success').then(() => {
        getUploadedDocuments();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const deleteDocument = async (id, type, doc_type) => {
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
            `${Api.postDocumentData}${id}/`
          );
          if (data && data?.success == true) {
            setShowLoader(false);
            swal(data && data.message[0], '', 'success', {}).then(() => {
              // window.location.reload();
              // getUploadedDocuments();
              const personalData = [];
              const educationalData = [];
              const employementData = [];

              if (type == 'personal') {
                personalDocuments &&
                  personalDocuments?.map((item) => {
                    if (id == item?.primaryId) {
                      personalData.push({
                        label: item?.label,
                        value: item?.value,
                        type: item?.type,
                        // file_id: '',
                        personal_document_type: item?.personal_document_type,
                        // url: '',
                        isUploaded: false,
                        primaryId: item?.primaryId,
                      });
                    } else {
                      personalData.push(item);
                    }
                  });
                setPersonalDocuments(personalData);
              }
              if (type == 'educational') {
                educationalDocuments &&
                  educationalDocuments?.map((item) => {
                    if (id == item?.primaryId) {
                      educationalData.push({
                        label: item?.label,
                        value: item?.value,
                        type: item?.type,
                        educational_document_type:
                          item?.educational_document_type,
                        isUploaded: false,
                        primaryId: item?.primaryId,
                      });
                    } else {
                      educationalData.push(item);
                    }
                  });
                setEducationalDocuments(educationalData);
              }
              if (type == 'employement') {
                previousEmployement &&
                  previousEmployement?.map((item) => {
                    if (id == item?.primaryId) {
                      employementData.push({
                        label: item?.label,
                        value: item?.value,
                        file_id: '',
                        url: '',
                        employment_document_type:
                          item?.employment_document_type,
                        isUploaded: false,
                        primaryId: item?.primaryId,
                      });
                    } else {
                      employementData.push(item);
                    }
                  });
                setPreviousEmployement(employementData);
              }
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

    // const endPoint = employeeId
    //   ? `${Api.applicantInfoUrl}?employee_id=${employeeId}`
    //   : `${Api.applicantInfoUrl}`;
    // const endPoint = state?.state?.applicantId
    //   ? `${Api.applicantInfoUrl}?employee_id=${state?.state?.employeeId}`
    //   : state?.state?.employeeId
    //   ? `${Api.employeeInfo}?employee_id=${state?.state?.employeeId}`
    //   : `${Api.employeeInfo}`;
    let endPoint;
    if (state?.state?.applicantId) {
      endPoint = `${Api.applicantInfoUrl}?employee_id=${state?.state?.employeeId}`;
    } else if (state?.state?.employeeId) {
      endPoint = `${Api.employeeInfo}?employee_id=${state?.state?.employeeId}`;
    } else {
      endPoint = `${Api.employeeInfo}`;
    }

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
    };

    // const { data, message } = applicantId
    //   ? await AuthApi.postDataToServer(endPoint, postData)
    //   : await AuthApi.postDataToServer(endPoint);
    let response;
    if (state?.state?.applicantId) {
      response = await AuthApi.postDataToServer(endPoint, postData);
    } else {
      response = await AuthApi.getDataFromServer(endPoint);
    }

    const { data, message } = response;

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setIsFresher(data?.data?.is_fresher);
      data?.data &&
        data?.data?.applicant_history &&
        data?.data?.applicant_history?.length > 0 &&
        data?.data?.applicant_history.map((doc) => {
          const reportingData = {};
          doc?.reportings &&
            doc?.reportings?.length > 0 &&
            doc?.reportings.map((report) => {
              if (report?.is_hr) {
                reportingData.reporting_person_hr = report?.reporting_person;
                reportingData.hr_email = report?.email;
                reportingData.hr_mobile = report?.mobile;
              } else {
                reportingData.reporting_person_manager =
                  report?.reporting_person || '';
                reportingData.manager_email = report?.email || '';
                reportingData.manager_mobile = report?.mobile || '';
              }
              return report;
            });

          addmoreData.push({
            company_name: doc?.company_name && doc?.company_name,
            designation: doc?.designation && doc?.designation,
            company_url: doc?.company_url && doc?.company_url,
            start_date: doc?.start_date && new Date(doc?.start_date),
            end_date: doc?.end_date && new Date(doc?.end_date),
            duration: doc?.duration && doc?.duration,
            location: doc?.location && doc?.location,
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
    if (
      stepThreeKey == '1' ||
      state?.state?.employeeId ||
      state?.state?.applicantId
    ) {
      getData();
    }
  }, [stepThreeKey, state]);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
      employee: Number(idProps),
      // employee_id: employeeId,
    };
    const postData = [];

    const report = {};

    await formValues.addmore.map((rp, i) => {
      report[i] = [];
      const hrReport = {};
      const managerReport = {};
      if (rp?.reporting_person_hr) {
        hrReport.reporting_person = rp?.reporting_person_hr;
        hrReport.email = rp?.hr_email;
        hrReport.mobile = rp?.hr_mobile;
        hrReport.is_hr = true;
        report[i].push(hrReport);
      }

      if (rp?.reporting_person_manager) {
        managerReport.reporting_person = rp?.reporting_person_manager;
        managerReport.email = rp?.manager_email;
        managerReport.mobile = rp?.manager_mobile;
        report[i].push(managerReport);
      }
      return rp;
    });
    const addEntry = formValues.addmore.entries();
    for (const [index, history] of addEntry) {
      // eslint-disable-line
      const candidateHistory = {
        designation: history?.designation,
        company_name: history?.company_name,
        company_url: history?.company_url,
        start_date: history?.start_date
          ? customFunctions.getDate(history?.start_date)
          : '',
        end_date: history?.end_date
          ? customFunctions.getDate(history?.end_date)
          : '',
        location: history?.location,
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
      swal(data && data?.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        if (employeeId) {
          getData();
        }
        swal.close();
        props.callback();
      });
    }
  };
  const downloadCSVPDF = async (image_url) => {
    let filename = image_url.split('/');
    let len = filename[filename.length - 1];
    saveAs(image_url, len);
    // window.open(data.data.file, '_blank');
  };
  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-2 mb-5 me-3 ms-3">
          {/* <Accordion activeKey={stepOneKey}> */}
            {/* <Card> */}
              <div className="logout-btn pull-right d-flex justify-content-end">
                <Button
                  variant="primary"
                  onClick={() => {
                    sessionStorage.clear();
                    if (state?.state?.employeeId) {
                      history.push(
                        `/employee-profile/${state?.state?.employeeId}`
                      );
                    } else {
                      history.push('/login');
                    }
                  }}
                >
                  {state?.state?.employeeId ? 'Back' : 'Logout'}
                </Button>
              </div>

          {isFresher === false && (
            <Accordion activeKey={stepThreeKey} eventKey="1">
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
                      formSections={jsonSchema}
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
          )}
          
        </div>
      </section>
    </>
  );
}

export default withRouter(AddEmployementHistory);
