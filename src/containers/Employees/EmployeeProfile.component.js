/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Image, Row, Card } from 'react-bootstrap';
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
import AddEmployeeComponent from './addEmployeeComponent';

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
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [companyList, setCompanyList] = useState([]);
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
  const [lastworkingDate, setLastWorkingDate] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [editReview, setEditReview] = useState(false);
  const [pagetype, setPageType] = useState('');
  const [refreshData, setRefreshData] = useState(false);
  const [reviewData, setReviewData] = useState('');
  const [reviewId, setReviewId] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [rowData, setRowData] = useState([]);
  const employeeID = match.params.id;
  const [applicatId, setApplicatId] = useState('');
  // const [empId, setEmpId] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];
  const history = useHistory();
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [key, setKey] = useState('personalDocument');

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

  useEffect(() => {
    if (currentUserId) {
      getRowData();
    }
  }, [currentUserId]);
  useEffect(() => {
    setCurrentUserId(customFunctions.getLocalStorage('id'));
  }, [currentUserId]);

  useEffect(() => {
    getEmployeeDetails();
    getEmployeeHIstory();
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
        ) : null}
      </>
    );
  };

  const tableColumn = [
    {
      id: 'id',
      label: 'Id',
    },
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

  // const personalColumns = [
  //   {
  //     id: 'personal_document_type_name',
  //     label: 'Name',
  //   },
  //   {
  //     id: 'action',
  //     label: 'Action',
  //     render: ({ personalDocuments }) => {
  //       console.log("🚀 ~ EmployeeProfile ~ personalDocuments:", personalDocuments)
  //       // eslint-disable-line
  //       return (
  //         <>
  //           <a
  //             href={document_url}
  //             target="_blank" // eslint-disable-line
  //           >
  //             <Image src="/images/download-file.svg" />
  //           </a>
  //         </>
  //       );
  //     },
  //   },
  // ];
  // const educationalColumns = [
  //   {
  //     id: 'title',
  //     label: 'Name',
  //   },
  //   {
  //     id: 'action',
  //     label: 'Action',
  //     render: ({ document_url }) => {
  //       // eslint-disable-line
  //       return (
  //         <>
  //           <a
  //             href={document_url}
  //             target="_blank" // eslint-disable-line
  //           >
  //             <Image src="/images/download-file.svg" />
  //           </a>
  //         </>
  //       );
  //     },
  //   },
  // ];

  // const employmentColumns = [
  //   {
  //     id: 'title',
  //     label: 'Name',
  //   },
  //   {
  //     id: 'action',
  //     label: 'Action',
  //     render: ({ document_url }) => {
  //       // eslint-disable-line
  //       return (
  //         <>
  //           <a
  //             href={document_url}
  //             target="_blank" // eslint-disable-line
  //           >
  //             <Image src="/images/download-file.svg" />
  //           </a>
  //         </>
  //       );
  //     },
  //   },
  // ];

  // const otherColumns = [
  //   {
  //     id: 'title',
  //     label: 'Name',
  //   },
  //   {
  //     id: 'action',
  //     label: 'Action',
  //     render: ({ document_url }) => {
  //       // eslint-disable-line
  //       return (
  //         <>
  //           <a
  //             href={document_url}
  //             target="_blank" // eslint-disable-line
  //           >
  //             <Image src="/images/download-file.svg" />
  //           </a>
  //         </>
  //       );
  //     },
  //   },
  // ];

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

  const getEmployeeHIstory = async () => {
    setShowLoader(true);
    const employeeId = match.params.id;
    const endPoint = `${Api.historyUrl}?sort_direction=descending&employee_id=${employeeId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setShowLoader(false);
      setCompanyList(data.data);
    }
  };

  // const getEmployeeDocument = async (name) => {
  //   setShowLoader(true);
  //   const formData = new FormData();

  //   formData.append('employee_name', name);

  //   const endPoint = `${Api.driveUploadDocumentUrl}`;
  //   const { data, message } = await AuthApi.postDataToServer(
  //     endPoint,
  //     formData
  //   );
  //   if (data) {
  //     setShowLoader(false);
  //     setEmployeeDocument(data.data);
  //     data.data &&
  //       data.data.map((document) => {
  //         if (document.title === 'Personal') {
  //           setRowPersonalData(document.files);
  //         } else if (document.title === 'Educational') {
  //           setRowEducationalData(document.files);
  //         } else if (document.title === 'Employment') {
  //           setRowEmploymentData(document.files);
  //         } else if (document.title === 'Other Documents') {
  //           setRowOtherData(document.files);
  //         }
  //         return document;
  //       });
  //   }
  //   if (!data) {
  //     setShowLoader(false);
  //     swal(message, '', 'error');
  //   }
  // };

  useEffect(() => {
    getEmployeeHIstory();
    getEmployeeDetails();
    getBondHistory();
    setTitle('Employee Profile');
  }, []);

  const onChangeInHistory = () => {
    getEmployeeHIstory();
    getEmployeeDetails();
  };

  const onEmployeePersonalDetails = () => {
    getEmployeeDetails();
  };

  const deleteEmployeeHistory = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the employee history?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.historyUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getEmployeeHIstory();
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
      setRowData(review_data || []);
      // setReviewId(data.data)
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
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Button
        className="float-end mt-2 mb-2 mr-3"
        onClick={() => history.push('/employees')}
      >
        Back
      </Button>
      <div className="col-xl-12" id="main-content">
        <div className="employee-new-profile">
          <div className="profile-bg">
            <Image src="/images/image.png" alt="image" />
            <div className="profile-img">
              <Image
                src={
                  employeeDetails.profile_image_url
                    ? `${employeeDetails.profile_image_url}`
                    : `${Api.s3UrlnoProfile}`
                }
                alt="Card image cap"
              />
            </div>
          </div>
          <h3>{employeeDetails.full_name}</h3>
          <h5>{employeeDetails.designation_name}</h5>
          <div className="table-projects">
            {showPersonalDetails ? (
              <div className="mt-4 card">
                <div className="card-body">
                  <EditPersonalDetails
                    handleModalCLose={(e) => setShowPersonalDetails(e)}
                    onPersonalDetailChanges={() => {
                      onEmployeePersonalDetails();
                    }}
                  />
                </div>
              </div>
            ) : (
              // <div className="mt-4 card">
              //   <div className="card-body">
              //     <div className=" d-flex align-items-center justify-content-between mb-2">
              //       <div className="date-edit-option d-flex align-items-center justify-content-between w-100">
              //         <h6 className="me-5">
              //           DOB -{' '}
              //           {employeeDetails.dob
              //             ? customFunctions.getDMYDate(employeeDetails.dob)
              //             : ''}
              //         </h6>
              //         <a
              //           href="javascript:void()"
              //           title='Edit'
              //           onClick={() => {
              //             setShowPersonalDetails(true);
              //           }}
              //         >
              //           {!employeeDetails.relieved && (
              //             <Image
              //               src="/images/edit-button.svg"
              //               alt="Edit Profile"
              //             />
              //           )}
              //         </a>
              //       </div>
              //     </div>
              //     <div className="row">
              //       <div className="col-md-3">
              //         <h6>
              //           Joining Date -{' '}
              //           {employeeDetails.date_joined
              //             ? customFunctions.getDMYDate(
              //                 employeeDetails.date_joined
              //               )
              //             : ''}
              //         </h6>
              //       </div>
              //       <div className="col-md-4">
              //         <h6>Email - {employeeDetails.email}</h6>
              //       </div>
              //       <div className="col-md-5">
              //         <h6>Personal Email - {employeeDetails.personal_email}</h6>
              //       </div>
              //     </div>
              //     <br />
              //     <div className="row">
              //       <div className="col-md-3">
              //         <h6>Contact No - {employeeDetails.mobile}</h6>
              //       </div>
              //       <div className="col-md-4">
              //         {employeeDetails.on_notice_period ? (
              //           <h6>
              //             Expected Relieving Date -{' '}
              //             {employeeDetails.last_working_date
              //               ? customFunctions.getDMYDate(
              //                   employeeDetails.last_working_date
              //                 )
              //               : ''}
              //           </h6>
              //         ) : employeeDetails.relieved === true ? (
              //           <h6>
              //             Relieved Date -{' '}
              //             {customFunctions.getDMYDate(
              //               employeeDetails.relieving_date
              //             )}
              //           </h6>
              //         ) : employeeDetails.probation_date ? (
              //           <h6>
              //             Probation End Date -{' '}
              //             {customFunctions.getDMYDate(
              //               employeeDetails.probation_date
              //             )}
              //           </h6>
              //         ) : (
              //           <>
              //             <h6>
              //               {employeeDetails.confirmation_date
              //                 ? `Confirmation Date -`
              //                 : `Expected Confirmation Date-`}
              //               {employeeDetails.confirmation_date != null ||
              //               employeeDetails.confirmation_date != ''
              //                 ? customFunctions.getDMYDate(
              //                     employeeDetails.confirmation_date
              //                   )
              //                 : employeeDetails.expected_confirmation_date &&
              //                   customFunctions.getDMYDate(
              //                     employeeDetails.expected_confirmation_date
              //                   )}
              //             </h6>
              //           </>
              //         )}
              //       </div>
              //       {/* {employeeDetails?.on_notice_period ? (
              //         <Button
              //           onClick={() => {
              //             setShowModal(true);
              //           }}
              //           type="button"
              //           className="btn btn-primary col-1"
              //         >
              //           Relieve Now
              //         </Button>
              //       ) : null} */}
              //       <div className="col-md-5">
              //         {employeeDetails &&
              //           !employeeDetails.confirmation_date &&
              //           !employeeDetails.relieving_date &&
              //           !employeeDetails?.on_notice_period && (
              //             <button
              //               onClick={() => {
              //                 history.push('/confirmation', {
              //                   employeeID: Number(employeeID),
              //                 });
              //               }}
              //               type="button"
              //               className="btn btn-primary"
              //             >
              //               Confirm Now
              //             </button>
              //           )}
              //       </div>
              //     </div>
              //   </div>
              // </div>
              <AddEmployeeComponent/>
            )}
          </div>
          <div className="profile-details">
            <div className="mt-3 row">
              <div className="col-sm-12">
                {!employeeDetails.relieved && (
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-4">
                        {showReview && (
                          <div className="mt-3">
                            <h5>
                              {pagetype === 'edit'
                                ? 'Edit Review'
                                : 'Add Review'}
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
                  </div>
                )}
                {!employeeDetails.is_fresher && (
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-4">
                        {!companyList.length < 1 && (
                          <h5 className="card-title">Experience</h5>
                        )}

                        {/* {!employeeDetails.is_fresher && (
                          <button
                            onClick={() => {
                              setShowEMployee(true);
                              customFunctions.removeLocalStorage('hisotryID');
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            Add History
                          </button>
                        )} */}
                      </div>
                      {/* {showEmployee &&  ( */}
                      {!employeeDetails.is_fresher && (
                        <div className="mt-4 card">
                          <AddHistory
                            employeeId={empId}
                            optionsData={dataa}
                            handleModalCLose={(e) => setShowEMployee(e)}
                            onChanges={() => {
                              onChangeInHistory();
                            }}
                          />
                        </div>
                      )}
                      {companyList &&
                        companyList.map((comp, i) => (
                          <>
                            <div
                              className="d-flex align-items-start justify-content-between"
                              key={i}
                            >
                              <div className="media">
                                {/* <Image
                                  src={
                                    comp.company_name === 'Stark Digital'
                                      ? '/images/stark-logo.png'
                                      : '/images/sample-logo.png'
                                  }
                                  className="mr-3"
                                  alt="image"
                                /> */}
                                <div className="media-body">
                                  <h5 className="mt-0">{comp.designation}</h5>
                                  <p>{comp.company_name}</p>
                                  <p>
                                    {comp.start_date_formate} -{' '}
                                    {comp.end_date_formate} {comp.date}|{' '}
                                    {comp.duration}
                                  </p>
                                  <h6>{comp.location}</h6>
                                </div>
                              </div>
                              <div className="address-edit-delete d-flex align-items-center">
                                <a href="javascript:void()">
                                  <Image
                                    src="/images/edit-button.svg"
                                    title="Edit Profile"
                                    onClick={() => {
                                      setData(comp);
                                      setShowEMployee(true);
                                      customFunctions.setLocalStorage(
                                        'hisotryID',
                                        comp.id
                                      );
                                      // history.push(`/profile-history/id=${comp.id}`)
                                    }}
                                  />
                                </a>
                                <a href="javascript:void()">
                                  <Image
                                    src="/images/delete.png"
                                    title="Edit Profile"
                                    onClick={() => {
                                      deleteEmployeeHistory(comp.id);
                                    }}
                                  />
                                </a>
                              </div>
                            </div>
                            <hr />
                          </>
                        ))}
                    </div>
                  </div>
                )}
                {!employeeDetails.on_notice_period &&
                  !employeeDetails.relieved && (
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between mb-4">
                          {!bondList.length < 1 && (
                            <h5 className="card-title">Bond History</h5>
                          )}

                          <button
                            onClick={() => {
                              setShowBond(true);
                              customFunctions.removeLocalStorage(
                                'bondHistoryID'
                              );
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            Add Bond
                          </button>
                        </div>
                        {showBond && (
                          <div className="mt-4 card">
                            <AddBondHistory
                              optionsData={bondData}
                              handleModalCLose={(e) => setShowBond(e)}
                              onChanges={() => {
                                onChangeInBondHistory();
                              }}
                            />
                          </div>
                        )}
                        {bondList &&
                          bondList.map((bond, i) => (
                            <>
                              <div
                                className="d-flex align-items-start justify-content-between"
                                key={i}
                              >
                                <div className="media">
                                  <div className="media-body">
                                    <p>
                                      <b>Start Date:</b>{' '}
                                      {bond.start_date &&
                                        customFunctions.getDMYDate(
                                          bond.start_date
                                        )}{' '}
                                      <br />
                                      <b>End Date:</b>{' '}
                                      {bond.end_date &&
                                        customFunctions.getDMYDate(
                                          bond.end_date
                                        )}{' '}
                                      <br />
                                      <b>Document Link:</b>
                                      <Link
                                        className="mt-3 ms-2 text-primary"
                                        title="Document Link"
                                        to={{ pathname: `${bond.file_name}` }}
                                        target="_blank"
                                      >
                                        {bond.file_name &&
                                          decodeURI(
                                            bond.file_name.split(
                                              decodeURI(Api.s3url)
                                            )
                                          ).substring(55)}
                                      </Link>
                                    </p>
                                  </div>
                                </div>
                                <div className="address-edit-delete d-flex align-items-center">
                                  <a href="javascript:void()">
                                    <Image
                                      src="/images/edit-button.svg"
                                      title="Edit Profile"
                                      onClick={() => {
                                        setBondData(bond);
                                        setShowBond(true);
                                        customFunctions.setLocalStorage(
                                          'bondHistoryID',
                                          bond.id
                                        );
                                        // history.push(`/profile-history/id=${comp.id}`)
                                      }}
                                    />
                                  </a>
                                  <a href="javascript:void()">
                                    <Image
                                      src="/images/delete.png"
                                      title="Edit Profile"
                                      onClick={() => {
                                        deleteBondHistory(bond.id);
                                      }}
                                    />
                                  </a>
                                </div>
                              </div>
                              <hr />
                            </>
                          ))}
                      </div>
                    </div>
                  )}

                {/* {employeeDocument && employeeDocument.length > 0 ? ( */}
                <>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title mb-0 mt-2 ">Documents</h5>
                        <button
                          onClick={() => {
                            setShowBond(true);
                            history.push(`/add-document/${empId}`, {
                              state: {
                                employeeId: Number(empId),
                                applicantId: applicatId,
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
                                      personalDocuments?.map((item, index) => (
                                        <li
                                          key={index}
                                          className="mb-2 ms-5 ps-5 d-flex justify-content-between"
                                        >
                                          <span>{index + 1}. </span>
                                          <span>
                                            {item?.fileName ? (
                                              <del>{item?.label}</del>
                                            ) : (
                                              item?.label
                                            )}
                                          </span>
                                          <div
                                            style={{ marginRight: '90px' }}
                                            className="btn-wrapper"
                                          >
                                            <a
                                              href={item?.fileName}
                                              target="_blank"
                                              className="me-5 pe-5 text-underline "
                                            >
                                              View
                                            </a>
                                          </div>
                                        </li>
                                      ))}
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
                                      educationalDocuments?.map(
                                        (item, index) => (
                                          <li
                                            key={index}
                                            className="mb-2 ms-5 ps-5 d-flex justify-content-between"
                                          >
                                            <span>{index + 1}. </span>
                                            <span>
                                              {item?.fileName &&
                                              item?.fileName ? (
                                                <del>{item?.label}</del>
                                              ) : (
                                                item?.label
                                              )}
                                            </span>
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
                                                className="me-5 pe-5 text-underline "
                                              >
                                                View
                                              </a>
                                            </div>
                                          </li>
                                        )
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
                                              <span>{index + 1}. </span>
                                              <span>
                                                {item?.fileName ? (
                                                  <del>{item?.label}</del>
                                                ) : (
                                                  item?.label
                                                )}
                                              </span>
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
                                                  className="me-5 pe-5 text-underline "
                                                >
                                                  View
                                                </a>
                                              </div>
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
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
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
