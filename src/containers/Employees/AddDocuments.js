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
  Image
} from 'react-bootstrap';
import axios from 'axios';

function AddDocuments(props) {
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
  const currentDocRef = useRef();
  const idProps = accProps?.props?.match?.params?.ID;
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [document, setDocument] = useState(null);
  const [isShowLoader, setShowLoader] = useState(false);
  const [stepOneKey, setStepOneKey] = useState('1');
  const [stepTwoKey, setStepTwoKey] = useState('0');
  const [stepThreeKey, setStepThreeKey] = useState('0');
  const [stepFourKey, setStepFourkey] = useState('0');
  const [stepFiveKey, setStepFiveKey] = useState('0');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [selectedDocument, setSelectedDocument] = useState({
    personalDoc: '',
    educationalDoc: '',
    employmentHistory: '',
    currentEmpDoc: '',
  });
  const [isFresher, setIsFresher] = useState(null);
  const [personalUniqueArray, setPersonalUniqueArray] = useState();
  const [educationalUniqueArray, setEducationalUniqueArray] = useState('');
  const [employementUniqueArray, setEmployementUniqueArray] = useState('');
  const [currentEmpUniqueArray, setCurrentEmpUniqueArray] = useState('');
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
    // {
    //   label: 'SSC',
    //   value: 'ssc',
    //   type: 'ssc',
    //   // file_id: '',
    //   educational_document_type: 1,
    //   // url: '',
    //   isUploaded: false,
    //   primaryId: '',
    // },
    // {
    //   label: 'HSC/ Diploma',
    //   value: 'hsc',
    //   type: 'hsc',
    //   // file_id: '',
    //   educational_document_type: 2,
    //   // url: '',
    //   isUploaded: false,
    //   primaryId: '',
    // },
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

  const [currentEmpDocument, setCurrentEmpDocument] = useState([
    {
      label: 'Offer Letter',
      value: 'offerLetter',
      file_id: '',
      url: '',
      current_employment_document_type: 1,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Appointment Letter',
      value: 'appointmentLetter',
      file_id: '',
      url: '',
      current_employment_document_type: 2,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Confirmation Letter',
      value: 'confirmationLetter',
      file_id: '',
      url: '',
      current_employment_document_type: 3,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Relieving Letter',
      value: 'relievingLetter',
      file_id: '',
      url: '',
      current_employment_document_type: 4,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'PIP Letter',
      value: 'pipLetter',
      file_id: '',
      url: '',
      current_employment_document_type: 5,
      isUploaded: false,
      primaryId: '',
    },
    {
      label: 'Final Settlement Letter',
      value: 'finalSettlementLetter',
      file_id: '',
      url: '',
      current_employment_document_type: 6,
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
    if (currentDocRef.current) {
      currentDocRef.current.value = null;
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

  useEffect(() => {
    const unique =
      currentEmpDocument &&
      currentEmpDocument?.filter((item) => item?.isUploaded == false);
    setCurrentEmpUniqueArray(unique);
  }, [currentEmpDocument]);

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

      if (selectedDocument?.currentEmpDoc?.current_employment_document_type) {
        const updateCurrentDoc = currentEmpDocument?.find(
          (itm) =>
            itm?.current_employment_document_type ==
            selectedDocument?.currentEmpDoc?.current_employment_document_type
        );
        updateCurrentDoc.file_id = data?.data?.id;
        updateCurrentDoc.fileName = data?.data?.image;
        updateCurrentDoc.isUploaded = true;
        const currentArray = currentEmpDocument?.filter(
          (it) =>
            it?.current_employment_document_type !=
            updateCurrentDoc?.current_employment_document_type
        );

        setCurrentEmpDocument([...currentArray, updateCurrentDoc]);
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
          currentEmpDoc: '',
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
      const currentData = [];

      const updatedDocumentsList = personalDocuments.map((doc) => {
        const uploadedDoc = data?.data?.find(
          (item) => doc.personal_document_type === item.personal_document_type
        );
        setFullName(uploadedDoc?.employee_name);
        setDesignation(uploadedDoc?.designation_name);
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

      const updatedCurrentList = currentEmpDocument.map((doc) => {
        const uploadedDoc = data?.data?.find(
          (item) => doc.current_employment_document_type === item.current_employment_document_type
        );
        setFullName(uploadedDoc?.employee_name);
        setDesignation(uploadedDoc?.designation_name);
        if (uploadedDoc) {
          currentData.push({
            ...doc,
            fileName: uploadedDoc?.image_url,
            current_employment_document_type: uploadedDoc?.current_employment_document_type
              ? uploadedDoc?.current_employment_document_type
              : currentEmpDocument?.current_employment_document_type,
            file_id: uploadedDoc?.document,
            isUploaded: true,
            primaryId: uploadedDoc?.id,
          });
        } else {
          currentData.push(doc);
        }
      });
      setCurrentEmpDocument(currentData);

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
    const current = [];

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
    if (type == 'current') {
      currentEmpDocument &&
        currentEmpDocument?.map((item) => {
          if (item?.file_id) {
            current.push({
              file_id: item?.file_id,
              current_employment_document_type: item?.current_employment_document_type,
            });
          }
        });
    }
    if (type == 'current') {
      postData.doc_type = 4;
      postData.current_employment_documents = current;
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
            reporting_person_hr: doc?.reporting_person_hr,
            hr_name: doc?.hr_name,
            hr_email: doc?.hr_email,
            hr_mobile: doc?.hr_mobile,
            reporting_person_manager: doc?.reporting_person_manager,
            manager_email: doc?.manager_email,
            manager_name: doc?.manager_name,
            manager_mobile: doc?.manager_mobile,
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
    };
  
    const postData = formValues.addmore.map((history) => {
      return {
        designation: history?.designation,
        company_name: history?.company_name,
        company_url: history?.company_url,
        hr_name: history?.hr_name,
        hr_email: history?.hr_email,
        hr_mobile: history?.hr_mobile,
        manager_name: history?.manager_name,
        manager_email: history?.manager_email,
        manager_mobile: history?.manager_mobile,
        start_date: history?.start_date
          ? customFunctions.getDate(history?.start_date)
          : '',
        end_date: history?.end_date
          ? customFunctions.getDate(history?.end_date)
          : '',
        location: history?.location,
      };
    });
  
    payload.applicant_history = postData;
    payload.employee = employeeId;
  
    try {
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
        swal(data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          if (employeeId) {
            getData();
          }
          swal.close();
          props.callback();
        });
  
        // // Handling the response and updating the state with the received data
        // const employeeData = data.employee;
        // const applicantHistory = data.applicant_history;
        // const applicantDocuments = data.applicant_documents;
        // const isFresher = data.is_fresher;
        // const completion = data.completion;
  
        // // Update your state or handle the received data as needed
        // console.log('data===>',{
        //   employeeData,
        //   applicantHistory,
        //   applicantDocuments,
        //   isFresher,
        //   completion,
        // });
      }
    } catch (error) {
      setShowLoader(false);
      swal('An error occurred', '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };
  

  // const submitForm = async (formValues) => {
  //   setShowLoader(true);
  //   const payload = {
  //     email_hash: tokenProps,
  //     password: passwordProps,
  //     employee: Number(idProps),
  //     // employee_id: employeeId,
  //   };
  //   const postData = [];

  //   const report = {};

  //   await formValues.addmore.map((rp, i) => {
  //     report[i] = [];
  //     const hrReport = {};
  //     const managerReport = {};
  //     if (rp?.reporting_person_hr) {
  //       hrReport.reporting_person = rp?.reporting_person_hr;
  //       hrReport.email = rp?.hr_email;
  //       hrReport.mobile = rp?.hr_mobile;
  //       hrReport.is_hr = true;
  //       report[i].push(hrReport);
  //     }

  //     if (rp?.reporting_person_manager) {
  //       managerReport.reporting_person = rp?.reporting_person_manager;
  //       managerReport.email = rp?.manager_email;
  //       managerReport.mobile = rp?.manager_mobile;
  //       report[i].push(managerReport);
  //     }
  //     return rp;
  //   });

  //   const addEntry = formValues.addmore.entries();
  //   for (const [index, history] of addEntry) {
  //     // eslint-disable-line
  //     const candidateHistory = {
  //       designation: history?.designation,
  //       company_name: history?.company_name,
  //       company_url: history?.company_url,
  //       start_date: history?.start_date
  //         ? customFunctions.getDate(history?.start_date)
  //         : '',
  //       end_date: history?.end_date
  //         ? customFunctions.getDate(history?.end_date)
  //         : '',
  //       location: history?.location,
  //       reportings: report[index],
  //     };
  //     postData.push(candidateHistory);
  //   }
  //   payload.applicant_history = postData;
  //   payload.employee = employeeId;
  //   const { data, message } = await AuthApi.postDataToServer(
  //     `${Api.applicantHistoryUrl}`,
  //     payload
  //   );

  //   if (!data) {
  //     setShowLoader(false);
  //     swal(message, '', 'error', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //       buttons: false,
  //       timer: 2000,
  //     }).then(() => {
  //       swal.close();
  //     });
  //   } else {
  //     setShowLoader(false);
  //     swal(data && data?.message[0], '', 'success', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //     }).then(() => {
  //       if (employeeId) {
  //         getData();
  //       }
  //       swal.close();
  //       props.callback();
  //     });
  //   }
  // };


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
        <div className=" mt-3 mb-3 card p-3">
              <h3>{state?.state?.employeeName}</h3>
              <h5>{state?.state?.employeeDesignation}</h5>
              {/* <h5>{employeeDetails.designation_name}</h5> */}
            </div>
        <Card className='roundedCard'>
          <Card.Body>
            <div className="logout-btn pull-right d-flex justify-content-end w-100">
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
            <div className="">
            
            <Accordion activeKey={stepOneKey}>
              <Card>
                <Card.Header className="position-relative bg-primary">
                  <div
                    className="d-flex align-items-center justify-content-between"
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
                          defaultValue={selectedDocument.personalDoc}
                          onSelectHandler={(select) => {
                            const tempObject = { ...selectedDocument };
                            tempObject.personalDoc = select;
                            setSelectedDocument(tempObject);
                          }}
                          // disabled={uniqueDocumentOptions.length <= 0}
                        />
                      </Col>
                      <Col>
                        <div className="add-document-field">
                          <input
                            style={{ marginBottom: '22px' }}
                            type="file"
                            className="form-control"
                            ref={personalRef}
                            onChange={(e) => {
                              if (
                                !e?.target?.files ||
                                e?.target?.files?.length < 1
                              )
                                return;
                              if (
                                ['png', 'jpeg', 'jpg', 'svg', 'pdf'].includes(
                                  e?.target?.files[0].name?.split('.').pop()
                                )
                              ) {
                                if (e?.target?.files[0].size > 1086147) {
                                  swal('File size is too big', '', 'error');
                                } else {
                                  setDocument(e?.target?.files[0]);
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
                        </div>
                      </Col>
                      <Col>
                        <Button
                          className="mt-4 mb-4"
                          onClick={(e) => {
                            handelChange(selectedDocument?.personalDoc?.value);
                          }}
                          disabled={
                            selectedDocument?.personalDoc == '' ||
                            document == null
                          }
                        >
                          Upload
                        </Button>
                      </Col>
                    </Row>
                    <span>
                      <div className="mt-3 ms-4">
                        
                        <h6 style={{ fontSize: 'smaller' }}>
                          <b>Note:</b>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          1. Maximum upload file size limit is less then 1 MB.
                          <span className="text-danger">*</span>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          2. File supported extension is jpg , png , svg , jpeg ,
                          pdf.<span className="text-danger">*</span>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          3. Please provide the front and back photo in PDF
                          formate of your Aadhaar card and a photo of your PAN
                          card. These are mandatory.
                          <span className="text-danger">*</span>
                        </h6>
                        <h6 
                        // className='smaller'
                        style={{ fontSize: 'smaller' }}
                        >
                          4. After uploading the document, please click on submit button.
                          <span className="text-danger">*</span>
                        </h6>
                      </div>
                    </span>
                    <Row className="mt-4">
                      <Col sm={6}>
                        <Card className="border-0 ">
                          <Card.Body>
                            <ul className='list-unstyled m-0 mb-4 p-0'>
                            {personalDocuments?.length &&  (
                                personalDocuments?.map((item,index) => (
                              <li 
                              key={index}
                              className={index == 0 ? 'd-flex justify-content-between'
                                : 'd-flex justify-content-between border-1 border-top border-secondary mt-2 pt-2'}
                              // className='d-flex justify-content-between'
                              >
                                <div className='d-flex align-items-center'>
                                {item?.isUploaded ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#51B773" class="bi bi-check-square-fill me-2" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                        </svg>
                                      :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#666" class="bi bi-check-square me-2" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                        </svg> }
                                  <a href={item?.fileName} target="_blank">{item?.label}</a>
                                </div>
                                {item?.isUploaded && (
                              <a 
                              href="javascript:void(0)"
                              >
                                <Image
                                  src="/images/delete.png"
                                  title="delete"
                                  onClick={() => {
                                    if (item?.primaryId) {
                                      deleteDocument(
                                        item?.primaryId,
                                        'personal'
                                      );
                                    } else {
                                      const temData = [
                                        ...personalDocuments,
                                      ];
                                      temData[index].fileName = '';
                                      temData[index].file_id = '';
                                      temData[index].isUploaded = false;
                                      setPersonalDocuments(temData);
                                    }
                                  }}
                                />
                                </a>
                                )}
                              </li>
                               )) )}
                            </ul>
                            {/* <ul className="border-0">
                              {personalDocuments &&
                                personalDocuments?.map((item, index) => (
                                  <li className="mb-2 d-flex justify-content-between">
                                    {item?.fileName ? (
                                      <del>{item?.label}</del>
                                    ) : (
                                      item?.label
                                    )}
                                    {item?.fileName && (
                                      <div
                                        style={{ marginRight: '90px' }}
                                        className="btn-wrapper"
                                      >
                                        <a
                                          href={item?.fileName}
                                          target="_blank"
                                          className="me-3 text-underline "
                                        >
                                          View
                                        </a>

                                        <a
                                          href="javascript:void(0)"
                                          onClick={() => {
                                            if (item?.primaryId) {
                                              deleteDocument(
                                                item?.primaryId,
                                                'personal'
                                              );
                                            } else {
                                              const temData = [
                                                ...personalDocuments,
                                              ];
                                              temData[index].fileName = '';
                                              temData[index].file_id = '';
                                              temData[index].isUploaded = false;
                                              setPersonalDocuments(temData);
                                            }
                                          }}
                                          className="text-underline "
                                        >
                                          Delete
                                        </a>
                                        {/* <a
                                          href={'/'}
                                          target="_blank"
                                          className="ms-3 text-underline "
                                        >
                                          <img
                                            title="Download Document"
                                            src="/images/download1.svg"
                                            alt="download-icon"
                                            onClick={() => {
                                              downloadCSVPDF(item?.fileName);
                                            }}
                                            className="me-3"
                                          />
                                        </a> */}
                                      {/* </div>
                                    )}
                                  </li>
                                ))}
                            </ul> */}

                            <div>
                              <Button
                                onClick={() => {
                                  submitDocumentsData('personal');
                                }}
                                // disabled={
                                //   personalDocuments?.every((dt) => !dt?.file_id)||
                                //   (personalDocuments &&
                                //     personalDocuments.every(
                                //       (item) => item?.primaryId
                                //     ))
                                // }
                                // disabled={
                                //   personalDocuments &&
                                //   personalDocuments.every(
                                //     (item) => item.primaryId && item.file_id
                                //   )
                                // }
                              >
                                Submit Documents
                              </Button>
                            </div>
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
                          defaultValue={selectedDocument?.educationalDoc}
                          onSelectHandler={(select) => {
                            const tempObject = { ...selectedDocument };
                            tempObject.educationalDoc = select;

                            setSelectedDocument(tempObject);
                          }}
                          // disabled={uniqueDocumentOptions.length <= 0}
                        />
                      </Col>
                      <Col>
                        <div className="add-document-field">
                          <input
                            style={{ marginBottom: '22px' }}
                            type="file"
                            className="form-control"
                            ref={educationalRef}
                            onChange={(e) => {
                              if (
                                !e?.target?.files ||
                                e?.target?.files?.length < 1
                              )
                                return;
                              if (
                                ['png', 'jpeg', 'jpg', 'svg', 'pdf'].includes(
                                  e?.target?.files[0].name?.split('.').pop()
                                )
                              ) {
                                if (e?.target?.files[0].size > 1086147) {
                                  swal('File size is too big', '', 'error');
                                } else {
                                  setDocument(e?.target?.files[0]);
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
                        </div>
                      </Col>
                      <Col>
                        <Button
                          className="mt-4 mb-4"
                          onClick={(e) => {
                            handelChange(selectedDocument?.educationalDoc?.value);
                          }}
                          disabled={
                            selectedDocument?.educationalDoc == '' ||
                            document == null
                          }
                        >
                          Upload
                        </Button>
                      </Col>
                    </Row>
                    <span>
                      <div className="mt-3">
                        <h6 style={{ fontSize: 'smaller' }}>
                          <b>Note:</b>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          1. Maximum upload file size limit is less then 1 MB.
                          <span className="text-danger">*</span>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          2. File supported extension is jpg , png , svg , jpeg,
                          pdf.
                          <span className="text-danger">*</span>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          3. After uploading the document, please click on submit button.
                          <span className="text-danger">*</span>
                        </h6>
                      </div>
                    </span>
                    <Row className="mt-4">
                      <Col sm={6}>
                        <Card className="border-0">
                          <Card.Body>
                            {/* <ul className="border-0">
                              {educationalDocuments &&
                                educationalDocuments?.map((item, index) => (
                                  <li className="mb-2 d-flex justify-content-between">
                                    {item?.fileName && item?.fileName ? (
                                      <del>{item?.label}</del>
                                    ) : (
                                      item?.label
                                    )}
                                    {item?.fileName && item?.fileName && (
                                      <div
                                        style={{ marginRight: '90px' }}
                                        className="btn-wrapper"
                                      >
                                        <a
                                          href={item?.fileName}
                                          target="_blank"
                                          onClick={() => {
                                            window.open(item?.fileName);
                                          }}
                                          className="me-3 text-underline "
                                        >
                                          View
                                        </a>

                                        <a
                                          href="javascript:void(0)"
                                          onClick={() => {
                                            if (item?.primaryId) {
                                              deleteDocument(
                                                item?.primaryId,
                                                'educational'
                                              );
                                            } else {
                                              const temData = [
                                                ...educationalDocuments,
                                              ];
                                              temData[index].fileName = '';
                                              temData[index].isUploaded = false;
                                              setEducationalDocuments(temData);
                                            }
                                          }}
                                          className="text-underline "
                                        >
                                          Delete
                                        </a>
                                        {/* <a
                                          href={'/'}
                                          target="_blank"
                                          className="ms-3 text-underline "
                                        >
                                          <img
                                            title="Download Document"
                                            src="/images/download1.svg"
                                            alt="download-icon"
                                            onClick={() => {
                                              downloadCSVPDF(item?.fileName);
                                            }}
                                            className="me-3"
                                          />
                                        </a> */}
                                      {/* </div>
                                    )}
                                  </li>
                                ))}
                            </ul> */} 
                              <ul className='list-unstyled m-0 mb-4 p-0'>
                              {educationalDocuments?.length &&  (
                                educationalDocuments?.map((item,index) => (
                              <li 
                              key={index}
                              className={index == 0 ? 'd-flex justify-content-between'
                                : 'd-flex justify-content-between border-1 border-top border-secondary mt-2 pt-2'}
                              >
                                <div className='d-flex align-items-center'>
                                {item?.isUploaded ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#51B773" class="bi bi-check-square-fill me-2" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                        </svg>
                                      :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#666" class="bi bi-check-square me-2" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                        </svg> }
                                  <a href={item?.fileName} target="_blank">{item?.label}</a>
                                </div>
                                {item?.isUploaded && (
                              <a 
                              href="javascript:void(0)"
                              >
                                <Image
                                  src="/images/delete.png"
                                  title="delete"
                                  onClick={() => {
                                    if (item?.primaryId) {
                                      deleteDocument(
                                        item?.primaryId,
                                        'educational'
                                      );
                                    } else {
                                      const temData = [
                                        ...educationalDocuments,
                                      ];
                                      temData[index].fileName = '';
                                      temData[index].isUploaded = false;
                                      setEducationalDocuments(temData);
                                    }
                                  }}
                                />
                                </a>
                                )}
                              </li>
                               )) )}
                               </ul>
                            <div
                            className=''>
                              <Button
                                onClick={() => {
                                  submitDocumentsData('educational');
                                }}
                                // disabled={
                                //   // (educationalDocuments &&
                                //   //   educationalDocuments?.every(
                                //   //     (item) => item?.primaryId
                                //   //   )) ||
                                //   (educationalDocuments &&
                                //     educationalDocuments?.every(
                                //       (dt) => !dt?.file_id
                                //     ))
                                // }
                              >
                                Submit Documents
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            {/* {personalInfo && !personalInfo.is_fresher && ( */}
            {isFresher === false && isFresher === true && (
              <Accordion activeKey={stepThreeKey}>
                <Card>
                  <Card.Header className="position-relative bg-primary">
                    <div
                      className="d-flex align-items-center justify-content-between"
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
            {/* {personalInfo && !personalInfo.is_fresher && ( */}
            {isFresher === false && (
              <Accordion activeKey={stepFourKey}>
                <Card>
                  <Card.Header className="position-relative bg-primary">
                    <div
                      className="d-flex align-items-center justify-content-between"
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
                      <Row className=" d-flex align-items-end">
                        <Col sm={3}>
                          <DropdownInput
                            label="Select Document"
                            options={employementUniqueArray}
                            defaultValue={selectedDocument?.employmentHistory}
                            onSelectHandler={(select) => {
                              const tempObject = { ...selectedDocument };
                              tempObject.employmentHistory = select;
                              setSelectedDocument(tempObject);
                            }}
                            // disabled={uniqueDocumentOptions.length <= 0}
                          />
                        </Col>
                        <Col>
                          <div className="add-document-field">
                            <input
                              style={{ marginBottom: '22px' }}
                              type="file"
                              className="form-control"
                              ref={uploadRef}
                              onChange={(e) => {
                                if (
                                  !e?.target?.files ||
                                  e?.target?.files?.length < 1
                                )
                                  return;
                                if (
                                  ['png', 'jpeg', 'jpg', 'svg', 'pdf'].includes(
                                    e?.target?.files[0].name?.split('.').pop()
                                  )
                                ) {
                                  if (e?.target?.files[0].size > 1086147) {
                                    swal('File size is too big', '', 'error');
                                  } else {
                                    setDocument(e?.target?.files[0]);
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
                          </div>
                        </Col>
                        <Col>
                          <Button
                            className="mt-3 mb-4"
                            onClick={(e) => {
                              handelChange(
                                selectedDocument?.employmentHistory?.value
                              );
                            }}
                            disabled={
                              !selectedDocument?.employmentHistory ||
                              document == null
                            }
                          >
                            Upload
                          </Button>
                        </Col>
                      </Row>
                      <span>
                        <div className="mt-3">
                          <h6 style={{ fontSize: 'smaller' }}>
                            <b>Note:</b>
                          </h6>
                          <h6 style={{ fontSize: 'smaller' }}>
                            1. Maximum upload file size limit is less then 1 MB.
                            <span className="text-danger">*</span>
                          </h6>
                          <h6 style={{ fontSize: 'smaller' }}>
                            2. File supported extension is jpg , png , svg , jpeg
                            , pdf.
                            <span className="text-danger">*</span>
                          </h6>
                          <h6 style={{ fontSize: 'smaller' }}>
                            3. After uploading the document, please click on submit button.
                          <span className="text-danger">*</span>
                        </h6>
                        </div>
                      </span>
                      <Row className="mt-4">
                        <Col sm={6}>
                          <Card className="border-0">
                            <Card.Body>
                            <ul className='list-unstyled m-0 mb-4 p-0'>
                              {previousEmployement?.length &&  (
                                previousEmployement?.map((item,index) => (
                              <li 
                              key={index}
                              className={index == 0 ? 'd-flex justify-content-between'
                                : 'd-flex justify-content-between border-1 border-top border-secondary mt-2 pt-2'}
                              >
                                <div className='d-flex align-items-center'>
                                {item?.isUploaded ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#51B773" class="bi bi-check-square-fill me-2" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                        </svg>
                                      :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#666" class="bi bi-check-square me-2" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                        </svg> }
                                  <a href={item?.fileName}
                                  target="_blank"
                                  onClick={() => {
                                    window.open(item?.fileName);
                                  }}
                                  >{item?.label}</a>
                                </div>
                                {item?.isUploaded && (
                              <a 
                              href="javascript:void(0)"
                              >
                                <Image
                                  src="/images/delete.png"
                                  title="delete"
                                  onClick={() => {
                                    if (item?.primaryId) {
                                      deleteDocument(
                                        item?.primaryId,
                                        'employement'
                                      );
                                    } else {
                                      const temData = [
                                        ...previousEmployement,
                                      ];
                                      temData[index].fileName = '';
                                      temData[index].isUploaded = false;
                                      setPreviousEmployement(temData);
                                    }
                                  }}
                                />
                                </a>
                                )}
                              </li>
                               )) )}
                               </ul>
                              {/* <ul>
                                {previousEmployement &&
                                  previousEmployement?.map((item, index) => (
                                    <li className="mb-2 d-flex justify-content-between">
                                      {item?.fileName ? (
                                        <del>{item?.label}</del>
                                      ) : (
                                        item?.label
                                      )}
                                      {item?.fileName && (
                                        <div
                                          style={{ marginRight: '90px' }}
                                          className="btn-wrapper"
                                        >
                                          <a
                                            href={item?.fileName}
                                            target="_blank"
                                            onClick={() => {
                                              window.open(item?.fileName);
                                            }}
                                            className="me-3 text-underline "
                                          >
                                            View
                                          </a>

                                          <a
                                            href="javascript:void(0)"
                                            onClick={() => {
                                              if (item?.primaryId) {
                                                deleteDocument(
                                                  item?.primaryId,
                                                  'employement'
                                                );
                                              } else {
                                                const temData = [
                                                  ...previousEmployement,
                                                ];
                                                temData[index].fileName = '';
                                                temData[index].isUploaded = false;
                                                setPreviousEmployement(temData);
                                              }
                                            }}
                                            className="text-underline"
                                          >
                                            Delete
                                          </a>
                                          {/* <a
                                            href={'/'}
                                            target="_blank"
                                            className="ms-3 text-underline "
                                          >
                                            <img
                                              title="Download Document"
                                              src="/images/download1.svg"
                                              alt="download-icon"
                                              onClick={() => {
                                                downloadCSVPDF(item?.fileName);
                                              }}
                                              className="me-3"
                                            />
                                          </a> */}
                                        {/* </div>
                                      )}
                                    </li>
                                  ))}
                              </ul> */} 
                              <div>
                                <Button
                                  onClick={() => {
                                    submitDocumentsData('employement');
                                  }}
                                  // disabled={
                                  //   (previousEmployement &&
                                  //     previousEmployement?.every(
                                  //       (item) => item?.primaryId
                                  //     )) ||
                                  //   (previousEmployement &&
                                  //     previousEmployement?.every(
                                  //       (dt) => !dt?.file_id
                                  //     ))
                                  // }
                                >
                                  Submit Documents
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            )}

            <Accordion activeKey={stepFiveKey}>
              <Card>
                <Card.Header className="position-relative bg-primary">
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <h6 className="text-white m-0"> Current Employment Documents</h6>
                    <div className="d-flex align-items-center justify-content-end">
                      <Accordion.Toggle
                        className="toggle-btn-accordion"
                        as={Button}
                        variant="link"
                        onClick={() => {
                          if (stepFiveKey == '0') {
                            setStepFiveKey('1');
                          } else {
                            setStepFiveKey('0');
                          }
                        }}
                      >
                        <img
                          src={
                            stepFiveKey == '0'
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
                          options={currentEmpUniqueArray}
                          defaultValue={selectedDocument?.currentEmpDoc}
                          onSelectHandler={(select) => {
                            const tempObject = { ...selectedDocument };
                            tempObject.currentEmpDoc = select;

                            setSelectedDocument(tempObject);
                          }}
                          // disabled={uniqueDocumentOptions.length <= 0}
                        />
                      </Col>
                      <Col>
                        <div className="add-document-field">
                          <input
                            style={{ marginBottom: '22px' }}
                            type="file"
                            className="form-control"
                            ref={currentDocRef}
                            onChange={(e) => {
                              if (
                                !e?.target?.files ||
                                e?.target?.files?.length < 1
                              )
                                return;
                              if (
                                ['png', 'jpeg', 'jpg', 'svg', 'pdf'].includes(
                                  e?.target?.files[0].name?.split('.').pop()
                                )
                              ) {
                                if (e?.target?.files[0].size > 1086147) {
                                  swal('File size is too big', '', 'error');
                                } else {
                                  setDocument(e?.target?.files[0]);
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
                        </div>
                      </Col>
                      <Col>
                        <Button
                          className="mt-4 mb-4"
                          onClick={(e) => {
                            handelChange(selectedDocument?.currentEmpDoc?.value);
                          }}
                          disabled={
                            selectedDocument?.currentEmpDoc == '' ||
                            document == null
                          }
                        >
                          Upload
                        </Button>
                      </Col>
                    </Row>
                    <span>
                      <div className="mt-3">
                        <h6 style={{ fontSize: 'smaller' }}>
                          <b>Note:</b>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          1. Maximum upload file size limit is less then 1 MB.
                          <span className="text-danger">*</span>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          2. File supported extension is jpg , png , svg , jpeg,
                          pdf.
                          <span className="text-danger">*</span>
                        </h6>
                        <h6 style={{ fontSize: 'smaller' }}>
                          3. After uploading the document, please click on submit button.
                          <span className="text-danger">*</span>
                        </h6>
                      </div>
                    </span>
                    <Row className="mt-4">
                      <Col sm={6}>
                        <Card className="border-0">
                          <Card.Body>
                              <ul className='list-unstyled m-0 mb-4 p-0'>
                              {currentEmpDocument?.length &&  (
                                currentEmpDocument?.map((item,index) => (
                              <li 
                              key={index}
                              className={index == 0 ? 'd-flex justify-content-between'
                                : 'd-flex justify-content-between border-1 border-top border-secondary mt-2 pt-2'}
                              >
                                <div className='d-flex align-items-center'>
                                {item?.isUploaded ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#51B773" class="bi bi-check-square-fill me-2" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                        </svg>
                                      :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#666" class="bi bi-check-square me-2" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                        </svg> }
                                  <a href={item?.fileName} target="_blank">{item?.label}</a>
                                </div>
                                {item?.isUploaded && (
                              <a 
                              href="javascript:void(0)"
                              >
                                <Image
                                  src="/images/delete.png"
                                  title="delete"
                                  onClick={() => {
                                    if (item?.primaryId) {
                                      deleteDocument(
                                        item?.primaryId,
                                        'current'
                                      );
                                    } else {
                                      const temData = [
                                        ...currentEmpDocument,
                                      ];
                                      temData[index].fileName = '';
                                      temData[index].isUploaded = false;
                                      setCurrentEmpDocument(temData);
                                    }
                                  }}
                                />
                                </a>
                                )}
                              </li>
                               )) )}
                              </ul>
                            <div
                            className=''>
                              <Button
                                onClick={() => {
                                  submitDocumentsData('current');
                                }}
                              >
                                Submit Documents
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}
export default withRouter(AddDocuments);
