/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Image, Row, Card, Table, Col, Modal } from 'react-bootstrap';
import { Link, useHistory, withRouter } from 'react-router-dom';
// import CustomTable from 'stark-custom-datatable';
import axios from 'axios';
import swal from 'sweetalert';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet, ModalInput, Datepicker } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import { Tabs, Tab } from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AddBondHistory from './AddBondHistory.component';
import AddHistory from './AddHistory.component';
import EditPersonalDetails from './EditPersonalDetails.component';
import AddReview from './AddReview.component';
import CustomTable from 'stark-custom-datatable';
import AddEmployeeComponent from './addEmpolyeeComponent';

function EmployeeProfile(props) {
  const { match, accProps } = props;
  const empId = props.match.params.id;
  const [showEmployee, setShowEMployee] = useState(false);
  const [dataa, setData] = useState({});
  const [totalCount, setTotalCount] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeDetails, setEmployeeDetails] = useState({});
  console.log("🚀 ~ EmployeeProfile ~ employeeDetails:", employeeDetails)
  const [employeeBGVDetails, setEmployeeBGVDetails] = useState(null);
  console.log("🚀 ~ EmployeeProfile ~ employeeBGVDetails:", employeeBGVDetails)
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [empHistoryId, setEmpHistoryId] = useState('');
  const [title, setTitle] = useState('');
  const [employeeDocument, setEmployeeDocument] = useState([]);
  const [rowEducationalData, setRowEducationalData] = useState([]);
  const [rowPersonalData, setRowPersonalData] = useState([]);
  const [rowEmploymentData, setRowEmploymentData] = useState([]);
  const [rowOtherData, setRowOtherData] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);
  const [showBond, setShowBond] = useState(false);
  const [bondList, setBondList] = useState([]);
  const [bondData, setBondData] = useState({});
  const [modalShow, setShowModal] = useState(false);
  const [modalShowTable, setShowTableModal] = useState(false);
  const [lastworkingDate, setLastWorkingDate] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [editReview, setEditReview] = useState(false);
  const [pagetype, setPageType] = useState('');
  const [bondType, setBondType] = useState('');
  const [refreshData, setRefreshData] = useState(false);
  const [reviewData, setReviewData] = useState('');
  const [reviewId, setReviewId] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [rowData, setRowData] = useState([]);

  const employeeID = match.params.id;
  const [applicatId, setApplicatId] = useState('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [defaultValues, updateDefaultValues] = useState({});
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];
  const history = useHistory();
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [key, setKey] = useState('personalDocument');
  const [detailsKeys, setDetailsKeys] = useState('personalInfo');
  console.log("🚀 ~ EmployeeProfile ~ detailsKeys****:", detailsKeys)
  const [currentTab, setCurrentTab] = useState('personalInfo');
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleModalClose = () => setShowModalHistory(false);

  const handleModalOpen = () => setShowModalHistory(true);
  // const handleModalOpen = async () => {
  //   await getEmployeeHistory();
  //   setShowTableModal(true);
  // };
  const probationEndDate = new Date(employeeDetails?.probation_date);
  const currentDate = new Date();
  const isProbationEndDateToday =
    currentDate.getFullYear() === probationEndDate.getFullYear() &&
    currentDate.getMonth() === probationEndDate.getMonth() &&
    currentDate.getDate() === probationEndDate.getDate();

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

  // const navigate = useNavigate()
  // Retrieve applicant ID from localStorage

  const handleSelect = (doc) => {
    if (doc === 'personalDocument') {
      setKey('personalDocument');
    } else if (doc === 'educationalDocument') {
      setKey('educationalDocument');
    } else if (doc === 'previouDocument') {
      setKey('previouDocument');
    }
  };

  const handleSelectDetails = (det) => {
    if (det === 'personalInfo') {
      setDetailsKeys('personalInfo');
    } else if (det === 'officialInfo') {
      setDetailsKeys('officialInfo');
    } else if (det === 'empVerificationInfo') {
      setDetailsKeys('empVerificationInfo');
    }
  };
  // const handleSelectDetails = (key) => {
  //   setCurrentTab(key); // Update state to reflect the current tab
  // };

  useEffect(() => {
    if (currentUserId) {
      getRowData();
    }
  }, [currentUserId]);

  useEffect(() => {
    setCurrentUserId(customFunctions?.getLocalStorage('id'));
  }, [currentUserId]);

  useEffect(() => {
    getEmployeeDetails();
    getData();
  }, [refreshData]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };
  const validate = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Full Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.mobile) errors.mobile = 'Mobile Number is required';
    if (!formData.dob) errors.dob = 'Date of Birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Submit form data
    } else {
      setErrors(validationErrors);
    }
  };
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleClear = () => {
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      dob: '',
      gender: '',
    });
    setErrors({});
  };
  const handleActionCallback = (row) => {
    return (
      <>
        {row?.status_name == 'Completed' && (
          <a
            href="/"
            className="pl-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowReview(true);
              setEditReview(true);
              setPageType('view');
              setReviewId(row.id);
            }}
          >
            <Image alt="view" src="/images/eye.svg" title="View Review" />
          </a>
        )}
        {row.status_name != 'Completed' ? (
          <div className="d-flex">
            <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowReview(true);
                setEditReview(true);
                setPageType('edit');
                setReviewId(row.id);
              }}
            >
              <Image src="/images/edit-button.svg" title="Edit Review" />
            </a>
            <a href="javascript:void()" className="mx-3">
              <Image
                src="/images/delete.png"
                title="delete"
                onClick={() => {
                  deleteReview(row?.id);
                }}
              />
            </a>
          </div>
        ) : null}
      </>
    );
  };

  const tableColumn = [
    {
      id: 'full_name',
      label: 'Reviewer Name',
      render: (rowData) => {
        return <>{rowData?.reviewer?.full_name}</>;
      },
    },
    {
      id: 'review_date',
      label: 'Review Date',
    },
    {
      id: 'review_time',
      label: 'Review Time',
    },
    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: 'comments',
      label: 'Comments',
      render: (rowData) => {
        return (
          <div title={rowData?.comments}>
            {rowData?.comments.length > 30
              ? `${rowData?.comments.slice(0, 25)}...`
              : rowData?.comments}
          </div>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  const getEmployeeDetails = async () => {
    setShowLoader(true);
    const employeeId = match.params.id;
    customFunctions.setLocalStorage('id', employeeId);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${employeeId}/`
    );

    if (data) {
      setShowLoader(false);
      setApplicatId(data?.data?.applicant_id);
      setFullName(data?.data?.full_name);
      setDesignation(data?.data?.designation_name);
      setEmployeeDetails(data.data);

      // getEmployeeDocument(data.data && data.data.full_name);
    }
  };

  useEffect(() => {
    if (empId) {
      getUploadedDocuments();
    }
  }, [empId]);

  const getUploadedDocuments = async () => {
    setShowLoader(true);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const idParam = employeeID
      ? { employee_id: employeeID }
      : { applicant: applicatId };

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
      const currentEmpData = [];

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

      const updateCurrentEmpDoc = currentEmpDocument.map((dt) => {
        const updateCurrentEmployement = data?.data?.find((item) => {
          return (
            dt?.current_employment_document_type ==
            item?.current_employment_document_type
          );
        });
        if (updateCurrentEmployement) {
          currentEmpData.push({
            ...dt,
            fileName: updateCurrentEmployement?.image_url,
            current_employment_document_type:
              updateCurrentEmployement?.current_employment_document_type,
            file_id: updateCurrentEmployement?.document,
            isUploaded: true,
            primaryId: updateCurrentEmployement?.id,
          });
        } else {
          currentEmpData.push(dt);
        }
      });
      setCurrentEmpDocument(currentEmpData);
      setShowLoader(false);
    } else {
      setShowLoader(false);
    }
  };

  // useEffect(() => {
  //   if (applicatId || empId) {
  //     getData();
  //   }
  // }, [applicatId, empId]);

  const getData = async () => {
    setShowLoader(true);

    const addmoreData = [];
    const endPoint = applicatId
      ? `${Api.applicantInfoUrl}?employee_id=${empId}`
      : empId
      ? `${Api.employeeInfo}?employee_id=${empId}`
      : `${Api.employeeInfo}`;

    const postData = {
      // email_hash: tokenProps,
      // password: passwordProps,
    };

    let response;
    if (applicatId) {
      response = await AuthApi.postDataToServer(endPoint, postData);
    } else {
      response = await AuthApi.getDataFromServer(endPoint);
    }

    const { data, message } = response;
    // const { data, message } = state?.state?.empId
    // const { data, message } = state?.state?.applicantId || state?.state?.empId
    //   ? await AuthApi.postDataToServer(endPoint, postData)
    //   : await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      data?.data &&
        data?.data?.applicant_history &&
        data?.data?.applicant_history?.length > 0 &&
        data?.data?.applicant_history.map((doc) => {
          // const reportingData = {};
          // doc?.reportings &&
          //   doc?.reportings?.length > 0 &&
          //   doc?.reportings.map((report) => {
          //     if (report?.is_hr) {
          //       reportingData.reporting_person_hr = report?.reporting_person;
          //       reportingData.hr_email = report?.email;
          //       reportingData.hr_mobile = report?.mobile;
          //     } else {
          //       reportingData.reporting_person_manager =
          //         report?.reporting_person || '';
          //       reportingData.manager_email = report?.email;
          //       reportingData.manager_mobile = report?.mobile || '';
          //     }
          //     return report;
          //   });
          addmoreData.push({
            company_name: doc?.company_name && doc?.company_name,
            designation: doc?.designation && doc?.designation,
            company_url: doc?.company_url && doc?.company_url,
            start_date: doc?.start_date && new Date(doc?.start_date),
            end_date: doc?.end_date && new Date(doc?.end_date),
            duration: doc?.duration && doc?.duration,
            location: doc?.location && doc?.location,
            // reporting_person_hr: reportingData.reporting_person_hr,
            employement_history_id:
              doc?.employement_history_id && doc?.employement_history_id,
            hr_name: doc?.hr_name && doc?.hr_name,
            hr_email: doc?.hr_email && doc?.hr_email,
            hr_mobile: doc?.hr_mobile && doc?.hr_mobile,
            manager_name: doc?.manager_name && doc?.manager_name,
            manager_email: doc?.manager_email && doc?.manager_email,
            manager_mobile: doc?.manager_mobile && doc?.manager_mobile,
          });
          return doc;
        });

      updateDefaultValues({ addmore: [...addmoreData] });
      setCompanyList(addmoreData);
      setEmpHistoryId(
        data?.data?.applicant_history?.[0]?.employement_history_id
      );
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
              const currentData = [];

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
              if (type == 'current') {
                currentEmpDocument &&
                  currentEmpDocument?.map((item) => {
                    if (id == item?.primaryId) {
                      currentData.push({
                        label: item?.label,
                        value: item?.value,
                        file_id: '',
                        url: '',
                        current_employment_document_type:
                          item?.current_employment_document_type,
                        isUploaded: false,
                        primaryId: item?.primaryId,
                      });
                    } else {
                      currentData.push(item);
                    }
                  });
                setCurrentEmpDocument(currentData);
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
    getData();
    getEnployeeBGVDetails();

    getEmployeeDetails();
    getBondHistory();
    setTitle('Employee Profile');
  }, []);

  const onChangeInHistory = () => {
    getData();
    getEmployeeDetails();
  };

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.employeeReviewUrl}`;
    const params = {
      page: page,
      limit: 10,
      employee: currentUserId,
      sort_direction: 'descending',
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
    }
    if (data && data.success === true) {
      setShowLoader(false);
      const review_data = [];
      data.data &&
        data.data.length > 0 &&
        data.data.filter((item) => {
          if (item.employee.id == customFunctions.getLocalStorage('id')) {
            review_data.push(item);
          }
        });
      setRowData(review_data);
      // setReviewId(data.data)
    }
  };

  const onEmployeePersonalDetails = () => {
    getEmployeeDetails();
  };

  const deleteEmployeeHistory = (empHistoryId) => {
    if (empHistoryId) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the employee history?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        // window.location.reload();
        // swal.close();
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.historyUrl}${empHistoryId}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getData();
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

  const getBondHistory = async () => {
    setShowLoader(true);
    const employeeId = match.params.id;
    const endPoint = `${Api.employeeBondDetailsUrl}?sort_direction=descending&employee_id=${employeeId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setShowLoader(false);
      setBondList(data.data);
    }
  };

  const onChangeInBondHistory = () => {
    getBondHistory();
  };

  const deleteBondHistory = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the bond history?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.employeeBondDetailsUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getBondHistory();
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

  const deleteReview = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the review?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.employeeReviewUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getRowData();
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

  const getEnployeeBGVDetails = async () => {
    setShowLoader(true);

    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.employeeVerificationUrl}?employee=${empId}`
    );
    console.log('data: ', data);
    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        swal.close();
      });
    }
    const bgvDetails = data?.data?.[0];
    console.log('bgvDetails: ', bgvDetails);

    if (data && data?.success) {
      setEmployeeBGVDetails(data?.data?.[0]);
      setEmployeeDetails({ ...employeeDetails, bgvDetails });
    }
  };

  const submitForm = async () => {
    setShowLoader(true);

    const managers = [];
    const teamLeds = [];

    employeeDetails?.assigned_managers.map((item) => {
      return managers.push(item);
    });

    employeeDetails?.assigned_team_leads.map((item) => {
      return teamLeds.push(item);
    });

    const postData = {
      full_name: employeeDetails?.full_name,
      email: employeeDetails.email,
      mobile: employeeDetails?.mobile ? employeeDetails?.mobile : null,
      emp_code: employeeDetails?.emp_code,
      // tw_emp: employeeDetails?.tw_id,
      role: employeeDetails?.role_id,
      department: employeeDetails?.department_id,
      status: employeeDetails?.status,
      team_leads: teamLeds ? teamLeds : null,
      managers: managers ? managers : null,
      notice_period_date: employeeDetails?.notice_period_date
        ? customFunctions.getDate(employeeDetails?.notice_period_date)
        : null,
      designation: employeeDetails ? employeeDetails.designation_id : null,
      joining_date:
        employeeDetails && employeeDetails.date_joined
          ? customFunctions.getDate(employeeDetails.date_joined)
          : '',
      confirmation_date: employeeDetails?.confirmation_date
        ? customFunctions.getDate(employeeDetails.confirmation_date)
        : null,
      confirmed:
        employeeDetails && employeeDetails.confirmation_date ? true : false, // eslint-disable-line
      relieving_date: lastworkingDate
        ? customFunctions.getDate(lastworkingDate)
        : null,
      relieved: lastworkingDate ? true : false, // eslint-disable-line
      dob: employeeDetails.dob
        ? customFunctions.getDate(employeeDetails.dob)
        : null,
      last_relieving_date: lastworkingDate
        ? customFunctions.getDate(lastworkingDate)
        : null,
      last_working_date: lastworkingDate
        ? customFunctions.getDate(lastworkingDate)
        : null,
      is_relieved: lastworkingDate ? true : false,
    };

    const { data } = await AuthApi.putDataToServer(
      `${Api.employeeUrl}${employeeDetails?.id}/`,
      postData
    );
    if (data) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success');
      setShowModal(false);
      getEmployeeDetails();
      //   // onPersonalDetailChanges();
    } else {
      swal(data && data.message[0]);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section d-flex justify-content-between">
          <div>
            <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
            <Breadcrumb items={items} />
          </div>
          <div>
            <Loader showLoader={isShowLoader} needFullPage={false} />
            <Button
              className="float-end mt-2 mb-2 mr-3"
              onClick={() => history.push('/employees')}
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="col-xl-12" id="main-content">
        <Card className="mt-4 mb-3 rounded-1 shadow-none">
          <Card.Body>
            <h3>{employeeDetails.full_name}</h3>
            <h5>{employeeDetails.designation_name}</h5>
          </Card.Body>
        </Card>

        <Card className="mt-3 mb-3 rounded-1 shadow-none employeeDetails">
          <Card.Body>
            <div className="text-end">
              <a
                href="javascript:void()"
                title="Edit"
                onClick={() => {
                  setShowPersonalDetails(true);
                }}
              >
                {!employeeDetails.relieved && (
                  <Image
                    src="/images/edit-button.svg"
                    alt="Edit Profile"
                    onClick={() => {
                      history.push(
                        `/edit-employee-info/${employeeDetails?.id}`
                      );
                    }}
                  />
                )}
              </a>
            </div>
            <Tabs
              defaultActiveKey="personalInfo"
              onSelect={(e) => handleSelectDetails(e)}
            >
              <hr />
              <Tab eventKey="personalInfo" title="Personal Details">
                {detailsKeys === 'personalInfo' && (
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <ul className="list-unstyled d-flex w-100 flex-wrap employeeDetailsInner">
                        <li className="p-0 border-bottom border-1 mx-2">
                          <label>
                            <strong>Email</strong>
                          </label>
                          <p>{employeeDetails?.personal_email}</p>
                        </li>
                        <li className="p-0 border-bottom border-1 mt-2 mx-2">
                          <label>
                            <strong>DOB</strong>
                          </label>
                          <p>
                            {employeeDetails?.dob
                              ? customFunctions.getDMYDate(employeeDetails?.dob)
                              : ''}
                          </p>
                        </li>
                        <li className="p-0 mx-1 mt-3 mx-2">
                          <label>
                            <strong>Contact No</strong>
                          </label>
                          <p>{employeeDetails?.mobile}</p>
                        </li>
                        <li className="p-0 mt-3 mx-2">
                          <label>
                            <strong>Gender</strong>
                          </label>
                          <p>{employeeDetails?.gender_name}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </Tab>
              <Tab eventKey="officialInfo" title="Official Details">
                {detailsKeys === 'officialInfo' && (
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <ul className="list-unstyled d-flex w-100 flex-wrap employeeDetailsInner">
                        <li className="p-0 border-bottom border-1 mx-2">
                          <label>
                            <strong>Employee Code</strong>
                          </label>
                          <p>{employeeDetails?.emp_code}</p>
                        </li>
                        <li className="p-0 border-bottom border-1 mx-2">
                          <label>
                            <strong>Team</strong>
                          </label>
                          <p>{employeeDetails?.team_name}</p>
                        </li>
                        <li className="p-0 border-bottom border-1 mt-3 mx-2">
                          <label>
                            <strong>Role</strong>
                          </label>
                          <p>{employeeDetails?.role_name}</p>
                        </li>
                        <li className="p-0 border-bottom border-1 mt-3 mx-2">
                          <label>
                            <strong>Team Lead</strong>
                          </label>
                          <p>
                            {Array.isArray(employeeDetails?.assigned_team_leads)
                              ? employeeDetails?.assigned_team_leads
                                  .map((mentor) => mentor?.name)
                                  .join(', ')
                              : ' '}
                          </p>
                        </li>
                        <li className="p-0 border-bottom border-1 mt-3 mx-2">
                          <label>
                            <strong>Department</strong>
                          </label>
                          <p>{employeeDetails.department_name}</p>
                        </li>
                        <li className="p-0 border-bottom border-1 mt-3 mx-2">
                          <label>
                            <strong>Joining Date</strong>
                          </label>
                          <p>
                            {employeeDetails.date_joined
                              ? customFunctions.getDMYDate(
                                  employeeDetails.date_joined
                                )
                              : ''}
                          </p>
                        </li>
                        <li className="p-0 border-bottom border-1 mt-3 mx-2">
                          <label>
                            <strong>Reporting Person</strong>
                          </label>
                          <p>
                            {Array.isArray(employeeDetails?.assigned_mentors)
                              ? employeeDetails?.assigned_mentors
                                  .map((mentor) => mentor?.name)
                                  .join(', ')
                              : ' '}
                          </p>
                        </li>
                        {employeeDetails?.on_notice_period ? (
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Expected Relieving Date</strong>
                            </label>
                            <p>
                              {employeeDetails?.relieving_date
                                ? customFunctions.getDMYDate(
                                    employeeDetails?.relieving_date
                                  )
                                : ''}
                            </p>
                          </li>
                        ) : employeeDetails?.relieved ? (
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Relieved Date</strong>
                            </label>
                            <p>
                              {customFunctions.getDMYDate(
                                employeeDetails?.relieving_date
                              )}
                            </p>
                          </li>
                        ) : employeeDetails?.probation_date ? (
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Probation End Date</strong>
                            </label>
                            <p>
                              {customFunctions.getDMYDate(
                                employeeDetails?.probation_date
                              )}
                            </p>
                          </li>
                        ) : (
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Confirmation Date</strong>
                            </label>
                            <p>
                              {customFunctions.getDMYDate(
                                employeeDetails?.confirmation_date
                              )}
                            </p>
                            <label>
                              <strong>Joining Date</strong>
                            </label>
                            <p>
                              {employeeDetails?.date_joined
                                ? customFunctions.getDMYDate(
                                    employeeDetails?.date_joined
                                  )
                                : ''}
                            </p>
                          </li>
                        )}
                        <li className="p-0 mt-3 mx-2">
                          <label>
                            <strong>Email</strong>
                          </label>
                          <p>{employeeDetails?.email}</p>
                        </li>
                      </ul>
                      {/* <div className='text-end'>
                          {employeeDetails &&
                            !employeeDetails.confirmation_date &&
                            !employeeDetails.relieving_date &&
                            !employeeDetails?.on_notice_period &&
                            isProbationEndDateToday && (
                              <button
                                onClick={() => {
                                  history.push('/confirmation', {
                                    employeeID: Number(employeeID),
                                  });
                                }}
                                type="button"
                                className="btn btn-primary"
                              >
                                Confirm Employee
                              </button>
                            )}
                        </div> */}
                    </div>
                  </div>
                )}
              </Tab>
              {employeeDetails?.status == 'inactive' && (
                <Tab
                  eventKey="empVerificationInfo"
                  title="Employee Verification Details"
                >
                  {detailsKeys === 'empVerificationInfo' && (
                    <div className="row mt-3 mx-5">
                      <div className="col-md-12 d-flex">
                       
                        <ul className="list-unstyled d-flex w-100 flex-wrap employeeDetailsInner">
                          <li className="p-0 border-bottom border-1 mx-2">
                            <label>
                              <strong>Employee Annual Compensation</strong>
                            </label>
                            <p>{employeeBGVDetails?.annual_compensation ? employeeBGVDetails?.annual_compensation : 'N/A'}</p>
                          </li>
                          <li className="p-0 border-bottom border-1 mx-2">
                            <label>
                              <strong>Reason Of Leaving</strong>
                            </label>
                            <p>{employeeBGVDetails?.reason_of_leaving ? employeeBGVDetails?.reason_of_leaving : 'N/A'}</p>
                          </li>
                          <li className="p-0 border-bottom border-1 mx-2">
                            <label>
                              <strong>Employee Status</strong>
                            </label>
                            <p>{employeeBGVDetails?.employee_status_name ? employeeBGVDetails?.employee_status_name : 'N/A'}</p>
                          </li>
                          <li className="p-0 border-bottom border-1 mx-2">
                            <label>
                              <strong>Final Settlement Status Name</strong>
                            </label>
                            <p>
                              {employeeBGVDetails?.final_settlement_status_name ? employeeBGVDetails?.final_settlement_status_name : 'N/A'}
                            </p>
                          </li>
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Final Settlement Reason</strong>
                            </label>
                            <p>{employeeBGVDetails?.final_settlement_reason ? employeeBGVDetails?.final_settlement_reason : 'N/A'}</p>
                          </li>
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Eligible For Rehire</strong>
                            </label>
                            <p>
                              {employeeBGVDetails?.eligible_for_rehire
                                ? 'Yes'
                                : 'No'}
                            </p>
                          </li>
                          <li className="p-0 border-bottom border-1 mt-3 mx-2">
                            <label>
                              <strong>Eligible For Rehire Reason</strong>
                            </label>
                            <p>
                              {employeeBGVDetails?.eligible_for_rehire_reason ? employeeBGVDetails?.eligible_for_rehire_reason : 'N/A'}
                            </p>
                          </li>
                        </ul>
                        <div>
                        {employeeBGVDetails ? (
                          <Button
                          variant='link'
                          onClick={() =>{
                            history.push(`/employee-verification/${empId}`,{
                              state: {
                                employeeId: Number(empId),
                                  applicantId: applicatId,
                                  employeeName: fullName,
                                  employeeDesignation: designation,
                                  edit: 'edit',
                              }
                            });
                          }}
                          >
                            <Image
                            src="/images/edit-button.svg"
                            alt="Edit Profile"
                            onClick={() => {
                              // history.push(`/employee-verification/${empId}`, {
                              //   state: {
                              //     employeeId: Number(empId),
                              //     applicantId: applicatId,
                              //     employeeName: fullName,
                              //     employeeDesignation: designation,
                              //     edit: 'edit',
                              //   },
                              // });
                            }}
                          />
                          </Button>
                        ) : (
                          <div>
                            <Button
                              className="px-2 text center"
                              variant="primary"
                              onClick={() => {
                                history.push(
                                  `/employee-verification/${empId}`,
                                  {
                                    state: {
                                      employeeId: Number(empId),
                                      applicantId: applicatId,
                                      employeeName: fullName,
                                      employeeDesignation: designation,
                                    },
                                  }
                                );
                              }}
                            >
                              Add Employee verification
                            </Button>
                          </div>
                        )}
                      </div>
                      </div>
                    </div>
                  )}
                </Tab>
              )}
            </Tabs>
          </Card.Body>
          {employeeDetails &&
            !employeeDetails.confirmation_date &&
            !employeeDetails.relieving_date &&
            !employeeDetails?.on_notice_period &&
            isProbationEndDateToday && (
              <Card.Body>
                <div className="text-end">
                  <button
                    onClick={() => {
                      history.push('/confirmation', {
                        employeeID: Number(employeeID),
                      });
                    }}
                    type="button"
                    className="btn btn-primary"
                  >
                    Confirm Employee
                  </button>
                </div>
              </Card.Body>
            )}
        </Card>
        {/* card not show when the employee is fresher */}
        {!employeeDetails.is_fresher && (
          <Card className="mt-3 mb-3 rounded-1 shadow-none employementHistory">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mt-2 text-primary">Employement History</h4>
                {!employeeDetails.is_fresher && (
                  <button
                    onClick={handleModalOpen}
                    type="button"
                    className="btn btn-primary py-0 h-100"
                  >
                    Add / Edit History
                  </button>
                )}
              </div>
              {companyList.length > 0 && (
                <ul className="list-unstyled mt-3 d-flex w-100 flex-wrap  employeeDetailsInner">
                  {companyList.map((item, index) => (
                    <li
                      className={
                        companyList?.length > 2
                          ? 'p-0 border-bottom border-1 mx-2'
                          : 'p-0 border-1 mx-2'
                      }
                      // className="p-0 border-bottom border-1 mx-2"
                      key={index}
                    >
                      <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                          <Image
                            alt="Company icon"
                            src="../company-icon.svg"
                            className="mxW-50"
                          />
                        </div>
                        <div class="flex-grow-1 ms-3">
                          <h5 className="fw-bold text-primary">
                            {item?.designation}
                          </h5>
                          <h5 className="d-flex fw-normal">
                            {item?.company_name}
                            {/* POOINFOTECH · Full-time */}
                          </h5>
                          <p className="fw-lighter">
                            {new Date(item?.start_date).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}{' '}
                            -{' '}
                            {new Date(item?.end_date).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}{' '}
                            · {item?.duration} <br></br>
                            {item?.location}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {/* // ) : (
                            //   <p>No company data available</p> */}
                </ul>
              )}
            </Card.Body>
          </Card>
        )}

        <Card className="mt-3 mb-3 rounded-1 shadow-none reviewHistory">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-3 mt-2 text-primary">Review</h4>
              {showReview && (
                <div className="mt-3">
                  <h5>{pagetype === 'edit' ? 'Edit Review' : 'Add Review'}</h5>
                </div>
              )}
              {!showReview && (
                <button
                  onClick={() => {
                    setShowReview(true);
                    setPageType('add');
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Add Review
                </button>
              )}
            </div>
            {showReview && (
              <div className="mt-4 card">
                <AddReview
                  handleModalCLose={(e) => {
                    setShowReview(e);
                    getRowData();
                    setPageType('');
                    setReviewId('');
                    setRefreshData(true);
                  }}
                  reviewEdit={editReview}
                  pageType={pagetype}
                  reviewId={reviewId}
                  empId={empId}
                  callbackBtn={(e) => {}}
                />
              </div>
            )}
            <div className="table-responsive employeeTable mt-3">
              <CustomTable
                columns={tableColumn}
                rows={rowData}
                // role={1}
                showPagination={true}
                tableClass="table-bordered"
                paginationProps={{
                  totalItems: totalCount,
                  itemsPerPage: limit,
                  activePage: currentPage,
                  onPageChange: (pageNo) => {
                    getRowData(pageNo);
                  },
                }}
                // emptyRender={() => {
                //   return 'No record found.';
                // }}
              />
              {/* <Table bordered hover>
                <thead>
                  <tr>
                    <th>Reviewers Name</th>
                    <th>Review Date</th>
                    <th>Review Time</th>
                    <th>Status</th>
                    <th>Comments</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.length > 0 ? (
                    rowData?.map((item,index) => (
                      <tr key={index}>
                      <td>{item?.reviewer?.full_name}</td>
                      <td>{item?.review_date}</td>
                      <td>{item?.review_time}</td>
                      <td>{item?.status_name}</td>
                      <td>
                       {item?.comments}
                      </td>
                      <td>
                        <a href="/" class="pl-2">
                          <Image
                            alt="view"
                            src="/images/eye.svg"
                            title="View Review"
                            class=""
                          ></Image>
                        </a>
                      </td>
                    </tr>
                    ))
                   ) : (
                              <p>No review data available</p>
                            )}
                  
                </tbody>
              </Table> */}
            </div>
          </Card.Body>
        </Card>
        <Card className="mt-3 mb-3 rounded-1 shadow-none">
          <Card.Body>
            <div className="d-flex align-items-start justify-content-between">
              {/* {!bondList.length < 1 && ( */}
              {/* <h4 className="mt-2 text-primary">Training Argument</h4> */}
              <h4 className="mt-2 text-primary">Bond History</h4>
              {/* )} */}

              {bondType == 'editBond' ? (
                <h5 className="me-3">Edit Bond</h5>
              ) : (
                <button
                  onClick={() => {
                    setShowBond(true);
                    customFunctions.removeLocalStorage('bondHistoryID');
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Add contract
                </button>
              )}
            </div>
            {showBond && (
              <div className="mt-2 card">
                <AddBondHistory
                  optionsData={bondData}
                  handleModalCLose={(e) => setShowBond(e)}
                  onChanges={() => {
                    onChangeInBondHistory();
                    setBondType('');
                  }}
                  bondType={bondType}
                  setBondType={setBondType}
                />
              </div>
            )}

            {bondList.length > 0 && (
              <div className="table-responsive employeeTable mt-3">
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Document Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bondList?.map((bond, index) => (
                      <tr key={index}>
                        <td>
                          {bond.start_date &&
                            customFunctions.getDMYDate(bond.start_date)}
                        </td>
                        <td>
                          {bond.end_date &&
                            customFunctions.getDMYDate(bond.end_date)}
                        </td>
                        <td>
                          <a
                            className="mt-3 ms-2 text-primary text-decoration-underline"
                            title="Preview Link"
                            href={bond.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Preview
                          </a>
                        </td>
                        <td>
                          <a href="javascript:void()">
                            <Image
                              src="/images/edit-button.svg"
                              title="Edit Profile"
                              className="me-3"
                              onClick={() => {
                                setBondData(bond);
                                setShowBond(true);
                                setBondType('editBond');
                                customFunctions.setLocalStorage(
                                  'bondHistoryID',
                                  bond.id
                                );
                              }}
                            />
                          </a>
                          <a href="javascript:void()">
                            <Image
                              src="/images/delete.png"
                              title="delete"
                              onClick={() => {
                                deleteBondHistory(bond.id);
                              }}
                            />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
        <Card className="mt-3 mb-3 rounded-1 shadow-none">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 mt-2 text-primary">Documents</h4>
              <button
                onClick={() => {
                  setShowBond(true);
                  history.push(`/add-document/${empId}`, {
                    state: {
                      employeeId: Number(empId),
                      applicantId: applicatId,
                      employeeName: fullName,
                      employeeDesignation: designation,
                    },
                  });
                }}
                type="button"
                className="btn btn-primary"
              >
                Add Documents
              </button>
            </div>
            <Row className="mt-4">
              <Col md={6}>
                <h5 className="mb-4 mt-3 text-black text-center">
                  Personal Document
                </h5>
                <ul className="list-unstyled m-0 p-0">
                  {personalDocuments?.length &&
                    personalDocuments?.map((item, index) => (
                      <li
                        className="d-flex justify-content-between"
                        key={index}
                      >
                        <div className="d-flex align-items-center">
                          {item?.isUploaded ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#51B773"
                              class="bi bi-check-square-fill me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#666"
                              class="bi bi-check-square me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                            </svg>
                          )}

                          <a href={item?.fileName} target="_blank">
                            {item?.label}
                          </a>
                        </div>
                        {item?.isUploaded && (
                          <a href="javascript:void()">
                            <Image
                              src="/images/delete.png"
                              title="delete"
                              onClick={() => {
                                if (item?.primaryId) {
                                  deleteDocument(item?.primaryId, 'personal');
                                } else {
                                  const temData = [...personalDocuments];
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
                    ))}
                </ul>
              </Col>
              <Col
                md={6}
                className="border-1 border-start border-secondary pb-3"
              >
                <h5 className="mb-4 mt-3 text-black text-center">
                  Educational Document
                </h5>
                <ul className="list-unstyled m-0 p-0">
                  {educationalDocuments?.length &&
                    educationalDocuments?.map((item, index) => (
                      <li
                        className="d-flex justify-content-between"
                        key={index}
                      >
                        <div className="d-flex align-items-center">
                          {item?.isUploaded ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#51B773"
                              class="bi bi-check-square-fill me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#666"
                              class="bi bi-check-square me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                            </svg>
                          )}

                          <a href={item?.fileName} target="_blank">
                            {item?.label}
                          </a>
                        </div>
                        {item?.isUploaded && (
                          <a href="javascript:void()">
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
                                  const temData = [...educationalDocuments];
                                  temData[index].fileName = '';
                                  temData[index].isUploaded = false;
                                  setEducationalDocuments(temData);
                                }
                              }}
                            />
                          </a>
                        )}
                      </li>
                    ))}
                </ul>
              </Col>
            </Row>
            <hr />
            <Row className="">
              <Col md={6}>
                <h5 className="mb-4 mt-3 text-black text-center">
                  Previous Employement Document
                </h5>
                <ul className="list-unstyled m-0 p-0">
                  {previousEmployement?.length &&
                    previousEmployement?.map((item, index) => (
                      <li
                        className="d-flex justify-content-between"
                        key={index}
                      >
                        <div className="d-flex align-items-center">
                          {item?.isUploaded ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#51B773"
                              class="bi bi-check-square-fill me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#666"
                              class="bi bi-check-square me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                            </svg>
                          )}

                          <a href={item?.fileName} target="_blank">
                            {item?.label}
                          </a>
                        </div>
                        {item?.isUploaded && (
                          <a href="javascript:void()">
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
                                  const temData = [...previousEmployement];
                                  temData[index].fileName = '';
                                  temData[index].isUploaded = false;
                                  setPreviousEmployement(temData);
                                }
                              }}
                            />
                          </a>
                        )}
                      </li>
                    ))}
                </ul>
              </Col>

              <Col
                md={6}
                className="border-1 border-start border-secondary pb-3"
              >
                <h5 className="mb-4 mt-3 text-black text-center">
                  Current Employement Document
                </h5>
                <ul className="list-unstyled m-0 p-0">
                  {currentEmpDocument?.length &&
                    currentEmpDocument?.map((item, index) => (
                      <li
                        className="d-flex justify-content-between"
                        key={index}
                      >
                        <div className="d-flex align-items-center">
                          {item?.isUploaded ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#51B773"
                              class="bi bi-check-square-fill me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#666"
                              class="bi bi-check-square me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                            </svg>
                          )}

                          <a href={item?.fileName} target="_blank">
                            {item?.label}
                          </a>
                        </div>
                        {item?.isUploaded && (
                          <a href="javascript:void()">
                            <Image
                              src="/images/delete.png"
                              title="delete"
                              onClick={() => {
                                if (item?.primaryId) {
                                  deleteDocument(item?.primaryId, 'current');
                                } else {
                                  const temData = [...currentEmpDocument];
                                  temData[index].fileName = '';
                                  temData[index].isUploaded = false;
                                  setCurrentEmpDocument(temData);
                                }
                              }}
                            />
                          </a>
                        )}
                      </li>
                    ))}
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3 mb-3 rounded-1 shadow-none">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 mt-2 text-primary">Documents</h4>
              <button
                onClick={() => {
                  setShowBond(true);
                  history.push(`/add-document/${empId}`, {
                    state: {
                      employeeId: Number(empId),
                      applicantId: applicatId,
                      employeeName: fullName,
                      employeeDesignation: designation,
                    },
                  });
                }}
                type="button"
                className="btn btn-primary"
              >
                Employee verification
              </button>
            </div>
            <Row className="mt-4">
              <Col md={6}></Col>
            </Row>
          </Card.Body>
        </Card>

        {/* <div className="employee-new-profile">
          <div className="profile-details">
            <div className="mt-3 row">
              <div className="col-sm-12"> */}

        {/* {!employeeDetails.relieved && ( */}
        {/* <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-4">
                      {showReview && (
                        <div className="mt-3">
                          <h5>
                            {pagetype === 'edit' ? 'Edit Review' : 'Add Review'}
                          </h5>
                        </div>
                      )}
                      {!showReview && (
                        <button
                          onClick={() => {
                            setShowReview(true);
                            setPageType('add');
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Add Review
                        </button>
                      )}
                    </div>
                    {showReview && (
                      <div className="mt-4 card">
                        <AddReview
                          handleModalCLose={(e) => {
                            setShowReview(e);
                            getRowData();
                            setPageType('');
                            setReviewId('');
                            setRefreshData(true);
                          }}
                          reviewEdit={editReview}
                          pageType={pagetype}
                          reviewId={reviewId}
                          empId={empId}
                          callbackBtn={(e) => {}}
                        />
                      </div>
                    )}
                    <Card>
                      <Card.Body>
                        <CustomTable
                          columns={tableColumn}
                          rows={rowData}
                          // role={1}
                          showPagination={true}
                          tableClass="table-striped"
                          paginationProps={{
                            totalItems: totalCount,
                            itemsPerPage: limit,
                            activePage: currentPage,
                            onPageChange: (pageNo) => {
                              getRowData(pageNo);
                            },
                          }}
                          emptyRender={() => {
                            return 'No record found.';
                          }}
                        />
                      </Card.Body>
                    </Card>
                  </div>
                </div> */}
        {/* )} */}

        {/* {!employeeDetails.is_fresher && (
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-4">
                        <h3 className="card-title mb-0 mt-2 text-primary ">
                          Employement History
                        </h3>

                        {!employeeDetails.is_fresher && (
                          <button
                            onClick={handleModalOpen}
                            type="button"
                            className="btn btn-primary"
                          >
                            Add History
                          </button>
                        )}
                      </div>
                      <Modal
                        show={showModalHistory}
                        onHide={handleModalClose}
                        backdrop="static"
                        dialogClassName="modal-lg"
                      >
                        <Modal.Header closeButton>
                          <div>
                            <h3>{employeeDetails.full_name}</h3>
                            <h5>{employeeDetails.designation_name}</h5>
                          </div>
                        </Modal.Header>
                        <Modal.Body>
                          <AddHistory
                            applicantId={applicatId}
                            employeeId={empId}
                            optionsData={dataa}
                            handleModalClose={(value) => {
                              handleModalClose();
                            }}
                            onChanges={onChangeInHistory}
                          />
                        </Modal.Body>
                      </Modal>
                      <>
                        <div className="">
                          <hr />
                          <Table className="table-striped">
                            <thead>
                              <tr>
                                <th>Sr No.</th>
                                <th>Company Name</th>
                                <th>Designation</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Duration of Date</th>
                                <th>Location</th>
                                <th>Hr Name</th>
                                <th>Hr Email</th>
                                <th>Hr Contact</th>
                                <th>Manager Name</th>
                                <th>Manager Email</th>
                                <th>Manager Contact</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {companyList.length > 0 ? (
                                companyList.map((comp, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{comp.company_name}</td>
                                    <td>{comp.designation}</td>
                                    <td>
                                      {new Date(
                                        comp.start_date
                                      ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </td>
                                    <td>
                                      {new Date(
                                        comp.end_date
                                      ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </td>

                                    <td>{comp.duration}</td>
                                    <td>{comp.location}</td>
                                    <td>{comp.hr_name ? comp.hr_name : '-'}</td>
                                    <td>
                                      {comp.hr_email ? (
                                        <>
                                          {comp.hr_email.slice(0, 5)}
                                          <br />
                                          {comp.hr_email.slice(5)}
                                        </>
                                      ) : (
                                        '-'
                                      )}
                                    </td>

                                    <td>
                                      {comp.hr_mobile ? comp.hr_mobile : '-'}
                                    </td>
                                    <td>
                                      {comp.manager_name
                                        ? comp.manager_name
                                        : '-'}
                                    </td>
                                    <td>
                                      {comp.manager_email ? (
                                        <>
                                          {comp.manager_email.slice(0, 5)}
                                          <br />
                                          {comp.manager_email.slice(5)}
                                        </>
                                      ) : (
                                        '-'
                                      )}
                                    </td>
                                    <td>
                                      {comp.manager_mobile
                                        ? comp.manager_mobile
                                        : '-'}
                                    </td>
                                    <td>
                                      <a href="javascript:void()">
                                        <Image
                                          src="/images/edit-button.svg"
                                          title="Edit Profile"
                                          onClick={handleModalOpen}
                                        />
                                      </a>
                                      <a href="javascript:void()">
                                        <Image
                                          src="/images/delete.png"
                                          title="delete"
                                          onClick={() => {
                                            deleteEmployeeHistory(
                                              comp?.employement_history_id
                                            );
                                          }}
                                        />
                                      </a>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="14" className="text-center">
                                    No Records Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                        <hr />
                      </>
                    </div>
                  </div>
                )}
                 */}

        {/* )} */}

        {/* {employeeDocument && employeeDocument.length > 0 ? ( */}
        <>
          {/* <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="card-title mb-0 mt-2 text-primary ">
                          Documents
                        </h3>
                        <button
                          onClick={() => {
                            setShowBond(true);
                            history.push(`/add-document/${empId}`, {
                              state: {
                                employeeId: Number(empId),
                                applicantId: applicatId,
                                employeeName: fullName,
                                employeeDesignation: designation,
                              },
                            });
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Add Documents
                        </button>
                      </div>
                      <hr />
                      <div className="row">
                        <Card>
                          <Card.Body>
                            <Tabs
                              defaultActiveKey="personalDocument"
                              onSelect={(e) => handleSelect(e)}
                            >
                              <Tab
                                eventKey="personalDocument"
                                title=" Personal Document"
                              >
                                {key === 'personalDocument' && (
                                  <ul className="border-0">
                                    {personalDocuments &&
                                    personalDocuments.length > 0 ? (
                                      personalDocuments.map((item, index) => (
                                        <li
                                          key={index}
                                          className="mb-2 ms-5 ps-5 d-flex justify-content-between text-primary"
                                        >
                                          {item?.fileName && (
                                            <div className="col-md-4">
                                              {item?.fileName ? (
                                                <h5>{item?.label}</h5>
                                              ) : (
                                                item?.label
                                              )}
                                            </div>
                                          )}
                                          {item?.fileName && (
                                            <div
                                              style={{ marginRight: '90px' }}
                                              className=" col-md-4 btn-wrapper"
                                            >
                                              <a
                                                href={item?.fileName}
                                                target="_blank"
                                                className="me-5 pe-5 text-underline "
                                                rel="noopener noreferrer"
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
                                                    temData[index].fileName =
                                                      '';
                                                    temData[index].file_id = '';
                                                    temData[
                                                      index
                                                    ].isUploaded = false;
                                                    setPersonalDocuments(
                                                      temData
                                                    );
                                                  }
                                                }}
                                                className="text-underline"
                                              >
                                                Delete
                                              </a>
                                            </div>
                                          )}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-center text-muted">
                                        No record found
                                      </li>
                                    )}
                                  </ul>
                                )}
                              </Tab>
                              <Tab
                                eventKey="educationalDocument"
                                title="Educational Document"
                              >
                                {key === 'educationalDocument' && (
                                  <ul className="border-0">
                                    {educationalDocuments &&
                                    educationalDocuments.length > 0 ? (
                                      educationalDocuments?.map(
                                        (item, index) => (
                                          <li
                                            key={index}
                                            className="mb-2 ms-5 ps-5 d-flex justify-content-between"
                                          >
                                            {item?.fileName && (
                                              <div className="col-md-4">
                                                {item?.fileName &&
                                                item?.fileName ? (
                                                  <h5>{item?.label}</h5>
                                                ) : (
                                                  item?.label
                                                )}
                                              </div>
                                            )}
                                            {item?.fileName && (
                                              <div
                                                style={{ marginRight: '90px' }}
                                                className=" col-md-4 btn-wrapper"
                                              >
                                                <a
                                                  href={item?.fileName}
                                                  target="_blank"
                                                  onClick={() => {
                                                    window.open(item?.fileName);
                                                  }}
                                                  className="me-5 pe-5 text-underline "
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
                                                      temData[index].fileName =
                                                        '';
                                                      temData[
                                                        index
                                                      ].isUploaded = false;
                                                      setEducationalDocuments(
                                                        temData
                                                      );
                                                    }
                                                  }}
                                                  className="text-underline "
                                                >
                                                  Delete
                                                </a>
                                              </div>
                                            )}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="text-center text-muted">
                                        No record found
                                      </li>
                                    )}
                                  </ul>
                                )}
                              </Tab>
                              {!employeeDetails.is_fresher && (
                                <Tab
                                  eventKey="previouDocument"
                                  title="Previous Employement Document"
                                >
                                  {key === 'previouDocument' && (
                                    <ul className="border-0">
                                      {previousEmployement &&
                                        previousEmployement?.map(
                                          (item, index) => (
                                            <li
                                              key={index}
                                              className="mb-2 ms-5 ps-5 d-flex justify-content-between"
                                            >
                                              {item?.fileName && (
                                                <div className="col-md-4">
                                                  {item?.fileName ? (
                                                    <h5>{item?.label}</h5>
                                                  ) : (
                                                    item?.label
                                                  )}
                                                </div>
                                              )}
                                              {item?.fileName && (
                                                <div
                                                  style={{
                                                    marginRight: '90px',
                                                  }}
                                                  className="col-md-4 btn-wrapper"
                                                >
                                                  <a
                                                    href={item?.fileName}
                                                    target="_blank"
                                                    onClick={() => {
                                                      window.open(
                                                        item?.fileName
                                                      );
                                                    }}
                                                    className="me-5 pe-5 text-underline "
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
                                                        temData[
                                                          index
                                                        ].fileName = '';
                                                        temData[
                                                          index
                                                        ].isUploaded = false;
                                                        setPreviousEmployement(
                                                          temData
                                                        );
                                                      }
                                                    }}
                                                    className="text-underline"
                                                  >
                                                    Delete
                                                  </a>
                                                </div>
                                              )}
                                            </li>
                                          )
                                        )}
                                    </ul>
                                  )}
                                </Tab>
                              )}
                            </Tabs>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  </div> */}
        </>
        {/* </div>
            </div>
          </div>
        </div> */}
      </div>

      <Modal
        show={showModalHistory}
        onHide={handleModalClose}
        backdrop="static"
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton>
          <div>
            <h3>{employeeDetails.full_name}</h3>
            <h5>{employeeDetails.designation_name}</h5>

            {/* <Modal.Title>Add History</Modal.Title> */}
          </div>
        </Modal.Header>
        <Modal.Body>
          <AddHistory
            applicantId={applicatId}
            employeeId={empId}
            optionsData={dataa}
            handleModalClose={(value) => {
              handleModalClose();
            }}
            onChanges={onChangeInHistory}
          />
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
                            variant="secondary"
                            onClick={handleModalClose}
                          >
                            Close
                          </Button> */}
        </Modal.Footer>
      </Modal>
      <ModalInput
        size="md"
        centered
        show={modalShow}
        onHide={() => setShowModal(false)}
        className="event-image-popup"
        id="contained-modal-title-center"
        modalHeaderClass="reson-text-title d-flex align-items-center"
        label={<h5>Last Releaving Date</h5>}
        modalBody={
          <Row>
            <div className="event-img">
              <Datepicker
                label="Select last releaving date"
                className="form-control"
                selected={lastworkingDate}
                onChange={(e) => {
                  setLastWorkingDate(e);
                }}
                autoComplete="off"
                // minDate={fromDate}
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select Date"
                // maxDate={new Date()}
              />
            </div>
          </Row>
        }
        modalFooter={
          <span>
            <Button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                submitForm();
              }}
            >
              Approval
            </Button>
          </span>
        }
      />
    </>
  );
}

export default withRouter(EmployeeProfile);
