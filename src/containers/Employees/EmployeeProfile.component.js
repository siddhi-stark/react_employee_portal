/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Image, Row, Col } from 'react-bootstrap';
import { Link, useHistory, withRouter, useNavigate } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
// import { Col, Card, Button, Image } from 'react-bootstrap';
import { Helmet, ModalInput, Datepicker } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import AddBondHistory from './AddBondHistory.component';
import AddHistory from './AddHistory.component';
import EditPersonalDetails from './EditPersonalDetails.component';
import AddReview from './AddReview.component';

function EmployeeProfile(props) {
  // console.log('employeee profileeee');
  const { match } = props;
  const [showEmployee, setShowEMployee] = useState(false);
  const [dataa, setData] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  // console.log('showPersonalDetails', showPersonalDetails);
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
  const [reviewData, setReviewData] = useState('');
  const [reviewId, setReviewId] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const employeeID = match.params.id;
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];
  const history = useHistory();
  // const navigate = useNavigate()

  // console.log('employeeDetails++++++++++', employeeDetails);

  useEffect(() => {
    if (currentUserId) {
      getReview();
    }
  }, [currentUserId]);
  useEffect(() => {
    setCurrentUserId(customFunctions.getLocalStorage('id'));
  }, [currentUserId]);

  const getEmployeeDetails = async () => {
    setShowLoader(true);
    const employeeId = match.params.id;
    // console.log('employeeIdemployeeId', employeeId);
    customFunctions.setLocalStorage('id', employeeId);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${employeeId}/`
    );
    if (data) {
      // console.log('dataa-------', data);
      setShowLoader(false);
      setEmployeeDetails(data.data);
      getEmployeeDocument(data.data && data.data.full_name);
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

  const personalColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => {
        // eslint-disable-line
        return (
          <>
            <a
              href={document_url}
              target="_blank" // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const educationalColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => {
        // eslint-disable-line
        return (
          <>
            <a
              href={document_url}
              target="_blank" // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const employmentColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => {
        // eslint-disable-line
        return (
          <>
            <a
              href={document_url}
              target="_blank" // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const otherColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => {
        // eslint-disable-line
        return (
          <>
            <a
              href={document_url}
              target="_blank" // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const getEmployeeDocument = async (name) => {
    setShowLoader(true);
    const formData = new FormData();

    formData.append('employee_name', name);

    const endPoint = `${Api.driveUploadDocumentUrl}`;
    const { data, message } = await AuthApi.postDataToServer(
      endPoint,
      formData
    );
    if (data) {
      setShowLoader(false);
      setEmployeeDocument(data.data);
      data.data &&
        data.data.map((document) => {
          if (document.title === 'Personal') {
            setRowPersonalData(document.files);
          } else if (document.title === 'Educational') {
            setRowEducationalData(document.files);
          } else if (document.title === 'Employment') {
            setRowEmploymentData(document.files);
          } else if (document.title === 'Other Documents') {
            setRowOtherData(document.files);
          }
          return document;
        });
    }
    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

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

  // console.log('employeeDetails',employeeDetails);

  const getReview = async () => {
    // setShowLoader(true);
    const endPoint = `${Api.employeeReviewUrl}?employee=${currentUserId}`;
    // const params ={
    //     employee_id:currentUserId,
    // }
    const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data && data.success === true) {
      setShowLoader(false);
      // console.log('reviewData', data.data);
      const review_data = [];
      data.data &&
        data.data.length > 0 &&
        data.data.filter((item) => {
          // console.log('filterdata------', item.employee.id);
          // console.log(
          //   "customFunctions.getLocalStorage('candidateId')",
          //   customFunctions.getLocalStorage('id')
          // );
          if (item.employee.id == customFunctions.getLocalStorage('id')) {
            review_data.push(item);
          }
        });
      setReviewData(review_data);
      // setReviewId(data.data)
    }
  };

  const submitForm = async () => {
    setShowLoader(true);
    // const id = customFunctions.getLocalStorage('id');

    // {
    //   "full_name": "omkar",
    //   "email": "tests10@starkdigital.net",
    //   "mobile": "9877533210",
    //   "emp_code": 127,
    //   "tw_emp": 28,
    //   "role": 4,
    //   "designation": 6,
    //   "department": 6,
    //   "status": "active",
    //   "dob": "1994-07-24",
    //   "team_leads": [
    //   109
    //   ],
    //   "managers": [
    //   147
    //   ],
    //   "notice_period_date": "2021-01-01",
    //   "confirmation_date": "2021-01-01",
    //   "relieving_date": "2021-01-01",
    //   "last_working_date": "2021-01-01"
    //   }

    const managers = [];
    const teamLeds = [];

    employeeDetails?.assigned_managers.map((item) => {
      return managers.push(item);
    });

    // console.log('managers',managers);

    employeeDetails?.assigned_team_leads.map((item) => {
      return teamLeds.push(item);
    });

    // console.log('teamLeds',teamLeds)

    const postData = {
      full_name: employeeDetails?.full_name,
      email: employeeDetails.email,
      mobile: employeeDetails?.mobile ? employeeDetails?.mobile : null,
      emp_code: employeeDetails?.emp_code,
      tw_emp: employeeDetails?.tw_id,
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
      confirmation_date:
        employeeDetails && employeeDetails.confirmation_date
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

    // console.log('postData', postData);
    // return;
    const { data } = await AuthApi.putDataToServer(
      `${Api.employeeUrl}${employeeDetails?.id}/`,
      postData
    );
    // console.log('data',data);
    if (data) {
      setShowLoader(false);
      swal(data && data.message[0]);
      setShowModal(false);
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
              <div className="mt-4 card">
                <div className="card-body">
                  <div className=" d-flex align-items-center justify-content-between mb-2">
                    <div className="date-edit-option d-flex align-items-center justify-content-between w-100">
                      <h6 className="me-5">
                        DOB -{' '}
                        {employeeDetails.dob
                          ? customFunctions.getDMYDate(employeeDetails.dob)
                          : ''}
                      </h6>
                      <a
                        href="javascript:void()"
                        onClick={() => {
                          setShowPersonalDetails(true);
                        }}
                      >
                        {!employeeDetails.relieved && (
                          <Image
                            src="/images/edit-button.svg"
                            alt="Edit Profile"
                          />
                        )}
                      </a>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <h6>
                        Joining Date -{' '}
                        {employeeDetails.date_joined
                          ? customFunctions.getDMYDate(
                              employeeDetails.date_joined
                            )
                          : ''}
                      </h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Email - {employeeDetails.email}</h6>
                    </div>
                    <div className="col-md-5">
                      <h6>Personal Email - {employeeDetails.personal_email}</h6>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-3">
                      <h6>Contact No - {employeeDetails.mobile}</h6>
                    </div>
                    <div className="col-md-4">
                      {employeeDetails.on_notice_period ? (
                        <h6>
                          Expected Relieving Date -{' '}
                          {employeeDetails.last_working_date
                            ? customFunctions.getDMYDate(
                                employeeDetails.last_working_date
                              )
                            : ''}
                        </h6>
                      ) : employeeDetails.relieved === true ? (
                        <h6>
                          Relieved Date -{' '}
                          {customFunctions.getDMYDate(
                            employeeDetails.relieving_date
                          )}
                        </h6>
                      ) : employeeDetails.probation_date ? (
                        <h6>
                          Probation End Date -{' '}
                          {customFunctions.getDMYDate(
                            employeeDetails.probation_date
                          )}
                        </h6>
                      ) : (
                        <h6>
                          {employeeDetails.confirmation_date
                            ? `Confirmation Date -`
                            : `Expected Confirmation Date-`}
                          {employeeDetails.confirmation_date
                            ? customFunctions.getDMYDate(
                                employeeDetails.confirmation_date
                              )
                            : employeeDetails.expected_confirmation_date &&
                              customFunctions.getDMYDate(
                                employeeDetails.expected_confirmation_date
                              )}
                        </h6>
                      )}
                    </div>
                    {employeeDetails?.on_notice_period ? (
                      <Button
                        onClick={() => {
                          setShowModal(true);
                          // console.log('data123test');
                        }}
                        type="button"
                        className="btn btn-primary col-1"
                      >
                        Relieve Now
                      </Button>
                    ) : null}
                    <div className="col-md-5">
                      {employeeDetails &&
                        !employeeDetails.confirmation_date &&
                        !employeeDetails.relieving_date &&
                        !employeeDetails?.on_notice_period && (
                          <button
                            onClick={() => {
                              history.push('/confirmation', {
                                employeeID: Number(employeeID),
                              });
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            Confirm Now
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="profile-details">
            <div className="row">
              <div className="col-sm-12">
                {!employeeDetails.relieved && (
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-4">
                        {showReview && (
                          <div className="mt-2">
                            <h5>Add Review</h5>
                          </div>
                        )}
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
                      </div>
                      <hr />
                      {showReview && (
                        <div className="mt-4 card">
                          <AddReview
                            handleModalCLose={(e) => {
                              setShowReview(e);
                              getReview();
                              setPageType('');
                              setReviewId('');
                            }}
                            reviewEdit={editReview}
                            pageType={pagetype}
                            reviewId={reviewId}
                          />
                        </div>
                      )}
                      <div>
                        {/* <h5 className="ml-3 mt-5">First Review</h5> */}
                      </div>
                      {reviewData &&
                        reviewData.length > 0 &&
                        reviewData.map((item) => (
                          <>
                            <div className="ml-5">
                              <p>
                                Review Date -{' '}
                                {customFunctions.getDMYDate(item.review_date)}
                              </p>
                            </div>
                            <div className="ml-5 mt-3 mb-3">
                              <Row>
                                <Col>
                                  <h5>{item.reviewer.full_name} </h5>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                  <p>
                                    Status -{' '}
                                    {item.status === 1 ? 'Pending' : 'Complete'}
                                  </p>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                  {item && item.status_name === 'Pending' ? (
                                    <Image
                                      style={{ height: '20px', width: '20px' }}
                                      title="Edit Review"
                                      src="/images/edit.png"
                                      onClick={() => {
                                        setShowReview(true);
                                        setEditReview(true);
                                        setPageType('edit');
                                        setReviewId(item.id);
                                      }}
                                    />
                                  ) : null}
                                </Col>
                              </Row>
                              { item.comments &&
                                <div className="mt-4">
                                <Row>
                                  <Col>
                                      <p>
                                        Comment - <small>{item.comments}</small>
                                      </p>
                                  </Col>
                                </Row>
                              </div>}
                              <hr />
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                )}
                {!employeeDetails.relieved && (
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-4">
                        {!companyList.length < 1 && (
                          <h5 className="card-title">Experience</h5>
                        )}

                        {!employeeDetails.relieved && (
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
                        )}
                      </div>
                      {showEmployee && (
                        <div className="mt-4 card">
                          <AddHistory
                            optionsData={dataa}
                            handleModalCLose={(e) => setShowEMployee(e)}
                            onChanges={() => {
                              onChangeInHistory();
                            }}
                          />
                        </div>
                      )}
                      {companyList &&
                        companyList.map((comp) => (
                          <>
                            <div className="d-flex align-items-start justify-content-between">
                              <div className="media">
                                <Image
                                  src={
                                    comp.company_name === 'Stark Digital'
                                      ? '/images/stark-logo.png'
                                      : '/images/sample-logo.png'
                                  }
                                  className="mr-3"
                                  alt="image"
                                />
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
                          bondList.map((bond) => (
                            <>
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="media">
                                  <div className="media-body">
                                    <p>
                                      Start Date:{' '}
                                      {bond.start_date &&
                                        customFunctions.getDMYDate(
                                          bond.start_date
                                        )}{' '}
                                      &nbsp; End Date:{' '}
                                      {bond.end_date &&
                                        customFunctions.getDMYDate(
                                          bond.end_date
                                        )}{' '}
                                      <br />
                                      Document Link:
                                      <Link
                                        className="mt-3 ms-2"
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

                {employeeDocument && employeeDocument.length > 0 ? (
                  <>
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                          <h5 className="card-title mb-0 mt-2 ">Documents</h5>
                          <button
                            onClick={() => {
                              setShowBond(true);
                              history.push(
                                `/addemployement-history/${employeeID}`,
                                {
                                  email: employeeDetails.email,
                                  name: employeeDetails.full_name,
                                }
                              );
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            Add Documents
                          </button>
                        </div>
                        <hr />
                        <div className="row">
                          {employeeDocument &&
                            employeeDocument.map((document) => (
                              <>
                                {document.title === 'Personal' && (
                                  <div className="col-md-4">
                                    <h5 className="mb-3">Personal</h5>
                                    <CustomTable
                                      tableContainerClass="mt-2"
                                      columns={personalColumns}
                                      rows={rowPersonalData}
                                      tableClass="table-striped"
                                      showPagination={true}
                                      emptyRender={() => {
                                        return 'No record found.';
                                      }}
                                    />
                                  </div>
                                )}
                                {document.title === 'Educational' && (
                                  <div className="col-md-4">
                                    <h5 className="mb-3">Educational</h5>
                                    <CustomTable
                                      tableContainerClass="mt-2"
                                      columns={educationalColumns}
                                      rows={rowEducationalData}
                                      tableClass="table-striped"
                                      showPagination={true}
                                      emptyRender={() => {
                                        return 'No record found.';
                                      }}
                                    />
                                  </div>
                                )}
                                {document.title === 'Employment' && (
                                  <div className="col-md-4">
                                    <h5 className="mb-3">
                                      Previous Employment
                                    </h5>
                                    <CustomTable
                                      tableContainerClass="mt-2"
                                      columns={employmentColumns}
                                      rows={rowEmploymentData}
                                      tableClass="table-striped"
                                      showPagination={true}
                                      emptyRender={() => {
                                        return 'No record found.';
                                      }}
                                    />
                                  </div>
                                )}
                                {document.title === 'Other Documents' && (
                                  <div className="col-md-4">
                                    <h5 className="mb-3">Other Documents</h5>
                                    <CustomTable
                                      tableContainerClass="mt-2"
                                      columns={otherColumns}
                                      rows={rowOtherData}
                                      tableClass="table-striped"
                                      showPagination={true}
                                      emptyRender={() => {
                                        return 'No record found.';
                                      }}
                                    />
                                  </div>
                                )}
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}
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
