import React, { useState, useEffect } from 'react';
import { withRouter, useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Jumbotron, Card, Button, Row, Col, Image } from 'react-bootstrap';
import { Helmet, ModalInput, TextInput } from '../../../components/FormInputs';
import Breadcrumb from '../../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';
import ToDoList from '../../ToDoList/toDoList.component';
import customFunctions from '../../../helper/customFunctions';
import Table from '../../../components/ReactTable/simpletable.component';
import UserRestrictions from '../../../components/UserRestrictions/userrestrictions.component';
import SharedService from '../../../services/SharedService/sharedServices';
import Loader from '../../../components/Loader/index';
import EmployeeListComponent from '../../Employee/employeeList.component';
import SupportTicket from '../../SupportTicket/supportTicket.component';

function Dashboard() {
  const [signInTime, setSignInTime] = useState('');
  const [showClockIn, setShowClockIn] = useState(false);
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState('');
  const [pending, setPending] = useState('');
  const [remaining, setRemaining] = useState('');
  const [rows, setRows] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [time, setTime] = useState('');
  const [show, setShow] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [morningMail, setMorningMail] = useState(false);
  const [quotesContent, setQuotesContent] = useState('');
  const [totalHrs, setTotalHrs] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [socialMedia, setSocialMediaData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [anniversary, setAnniversary] = useState([]);
  const [appreciationData, setAppriciation] = useState([]);
  const [image, setImage] = useState('');
  const [birthdayArr, setBirthdayArray] = useState([]);
  const history = useHistory();
  const viewHoliday = new Event('ViewHolidayButtonChange', { isUpdated: true });
  const viewLeaves = new Event('ViewLeavesButtonChange', { isUpdated: true });
  const isBirthday = customFunctions.getLocalStorage('birthday');
  const EmployeeID = JSON.parse(customFunctions.getLocalStorage('Employee'));
  const UserID = customFunctions.getLocalStorage('userId');
  const [leavesUpdate, setLeavesUpdate] = useState([]);
  const [interviewsUpdate, setInterviewsUpdate] = useState([]);
  const [, setCount] = useState(''); // eslint-disable-line
  const [newBirthdayData, setNewBirthdayData] = useState([]);
  const [broadcastDescription, setBroadcastDescription] = useState([]);
  const [confirmationEmployee, setConfirmationEmployee] = useState([]);

  const d = new Date();
  const day = d.getDate(); // eslint-disable-line
  const m_names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const n = m_names[d.getMonth()];

  const DayMonth = day + ' ' + n; // eslint-disable-line

  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const viewButton = new Event('ViewBtnChange', { isUpdated: true });

  const columns = [
    {
      id: 'date',
      label: 'Date',
      roleAccess: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'clockin',
      label: 'In',
      roleAccess: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'clockout',
      label: 'Out',
      roleAccess: [2, 3, 4, 5, 6],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [2, 3, 4, 5, 6],
    },
  ];

  const getDailyActivity = async () => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (!customFunctions.checkIfEmpty(data, 'O') && data.success) {
      setMorningMail(data.data.morning_mail);
      if (data.data.clock_in_time && data.data.clocked_in) {
        customFunctions.setLocalStorage('clockinTime', data.data.clock_in_time);
        customFunctions.setLocalStorage('userclockedin', true);
        setSignInTime(data.data.clock_in_time);
        customFunctions.setLocalStorage('clockInDate', data.data.clock_in_date);
        setShowClockIn(true);
        SharedService.clockIn.next(true);
        setShowLoader(false);
      } else {
        setShowLoader(false);
      }
    } else {
      setShowLoader(false);
    }
  };

  const getTimeSheetList = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.timeSheetUrl}?limit=5`
    );
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        current_page: data.paginator ? Number(data.paginator.current_page) : 0,
        activePage: data.paginator ? data.paginator.current_page : 0,
        itemsPerPage: data.paginator ? data.paginator.limit : 0,
        totalItems: data.paginator ? data.paginator.total_count : 0,
      });
      const row = [];

      data.data.map((timesheet) => {
        const setRowData = {
          date: customFunctions.getDMYDate(timesheet.created_at),
          clockin: timesheet.sign_in,
          clockout: timesheet.sign_out,
          total: `${timesheet.estimation} Hrs`,
        };
        row.push(setRowData);
        return timesheet;
      });
      setRows(row);
    }
  };

  const getWeeklyStatus = async (key) => {
    const endPoint = `${Api.weeklyStatusUrl}?mode=${key}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);

    if (!customFunctions.checkIfEmpty(data && data.data, 'O')) {
      setCompleted(data.data.completed);
      setPending(data.data.pending);
      setRemaining(data.data.upcoming);
    }
  };

  const getAnniversary = async () => {
    const endPoint = `${Api.birthdayUrl}?is_anniversary=true`;
    const { data } = await AuthApi.getDataFromServer(endPoint);

    if (!customFunctions.checkIfEmpty(data && data.data, 'O')) {
      const avsrArr = [];
      (await data.data) &&
        data.data.length > 0 &&
        data.data.map((anvs) => {
          const dayMonth =
            anvs.date_of_joined && anvs.date_of_joined.substring(5, 11);
          const todayDate = new Date();
          const currentYear = todayDate.getFullYear();
          const todayFormattedDate = customFunctions.getDate(todayDate);
          const todayDayMonth = todayFormattedDate.substring(5, 11);
          const joiningDateYear = new Date(anvs.date_of_joined).getFullYear();
          // const JoiningDate = new Date(anvs.date_of_joined);
          // const newDate = JoiningDate.getFullYear() + 1;
          // const newJoiningDate = `${newDate}-${dayMonth}`;
          if (dayMonth === todayDayMonth && joiningDateYear < currentYear) {
            avsrArr.push(anvs);
          }

          // if(newJoiningDate === customFunctions.getDate(todayDate)){
          //   avsrArr.push(anvs);
          // }
          setAnniversary(avsrArr);
          return anvs;
        });
    }
  };

  const getAppreciation = async () => {
    const endPoint = `${Api.birthdayUrl}?is_appreciation=true`;
    const { data } = await AuthApi.getDataFromServer(endPoint);

    if (data && data.data) {
      setAppriciation(data.data);
    }
  };

  const getProfile = async () => {
    const userToken = customFunctions.getLocalStorage('access_token');
    if (!userToken) return false;

    const { data } = await AuthApi.getDataFromServer(`${Api.profileUrl}`);

    if (data && data.data) {
      setEmployeeName(data.data.full_name);
    }
    return true;
  };

  const getClockOutTime = () => {
    const localTime = customFunctions.getLocalStorage('time');
    setTime(localTime);
  };

  const getUpcomingHoliday = async () => {
    const endPoint = `${Api.holidayUrl}?sort_by=date&sort_direction=ascending&limit=2`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setHolidays(data.data);
    }
  };

  const getAppliedLeaves = async () => {
    const endPoint = `${Api.leavesApplied}?sort_by=leave_from_date&limit=2`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setLeaves(data.data);
    }
  };

  const getInstagramPost = async () => {
    const endPoint = `${Api.socialMediaUrl}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setSocialMediaData(data.data);
    }
  };

  useEffect(() => {
    const LoginToken = customFunctions.getLocalStorage('access_token');
    if (LoginToken) {
      getUpcomingHoliday();
      getAppliedLeaves();
      getInstagramPost();
      getAnniversary();
      getAppreciation();
      getUpcomingConfirmationEmployee();
    }
    document.addEventListener('ProfileUpdate', () => {
      getProfile();
    });

    SharedService.clockOut.subscribe((value) => {
      if (value) {
        getClockOutTime();
      }
    });

    getClockOutTime();
    getProfile();
    getDailyActivity();
    getWeeklyStatus('this_week');
    getTimeSheetList();
    getWorkingHrs();
    getBroadcastData();
    setTitle('Dashboard');
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    const quote = customFunctions.getLocalStorage('quote');
    setQuotesContent(quote);
    const userclockedin = customFunctions.getLocalStorage('userclockedin');
    if (userclockedin) setShowClockIn(userclockedin);
    const birthdayArrr =
      EmployeeID &&
      EmployeeID.filter(
        (e) =>
          Number(e.id) !== Number(UserID) &&
          e.is_birthday &&
          Number(e.dob) >= day
      );
    setBirthdayArray(birthdayArrr);
    if (Number(uRole) !== 4) {
      getLeavesUpdate();
    }
    getInterviewsUpdate();
  }, []);

  const onViewButtonClick = () => {
    document.dispatchEvent(viewButton);
    return true;
  };

  const getWorkingHrs = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.workingHrsUrl}`);

    if (data && data.data) {
      setTotalHrs(data.data.duration);
    }
    return true;
  };

  const onViewHoliday = () => {
    document.dispatchEvent(viewHoliday);
    return true;
  };

  const onViewLeaves = () => {
    document.dispatchEvent(viewLeaves);
    return true;
  };

  const onCancel = () => {
    setModalShow(false);
  };

  const getLeavesUpdate = async () => {
    const endPoint = `${Api.leavesUrl}?show_dashboard=true`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setLeavesUpdate(data.data);
    }
  };

  const getInterviewsUpdate = async () => {
    const endPoint = `${Api.applicantsUrl}?show_dashboard=true`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setInterviewsUpdate(data.data);
    }
  };

  const postGreetingMessage = async (id, GreetingId, type = '') => {
    const newGreetData =
      newBirthdayData && newBirthdayData.filter((i) => i.id === id);
    if (!newGreetData[0].message) return;
    const newData =
      newBirthdayData &&
      newBirthdayData[0] &&
      newBirthdayData[0].employee_data &&
      newBirthdayData[0].employee_data.filter((i) => i.id === id);
    const postData = {
      wish_to: Number(id),
      greeting: GreetingId,
      message:
        newData && newData.length && newData[0].greetMessage
          ? newData &&
            newData.length &&
            newData[0].greetMessage &&
            newData[0].greetMessage
          : newGreetData && newGreetData.length && newGreetData[0].message,
    };

    const endPoint = Api.greetingWishesUrl;
    const { data } = await AuthApi.postDataToServer(endPoint, postData);
    if (data) {
      swal(data.message[0], '', 'success');
      if (type === 'birthday') {
        birthdayArr &&
          birthdayArr.map((i) => {
            const dt = i;
            if (dt.id === id) {
              dt.message = '';
            }
            return i;
          });
        setBirthdayArray(birthdayArr);
      } else if (type === 'anniversary') {
        anniversary &&
          anniversary.map((i) => {
            const dt = i;
            if (dt.id === id) {
              dt.message = '';
            }
            return i;
          });
        setAnniversary(anniversary);
      } else {
        appreciationData &&
          appreciationData.map((i) => {
            i.employee_data &&
              i.employee_data.map((appData) => {
                const dt = appData;
                if (dt.id === id) {
                  dt.greetMessage = '';
                }
                return appData;
              });
            return i;
          });
        setAppriciation(appreciationData);
      }
      setCount('');
    }
  };

  const getBroadcastData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.broadcastUrl}?upcoming=true&limit=1`
    );
    if (!data) {
      swal(message, '', 'error');
    }
    if (data && data.data) {
      data.data.map((broad) => {
        setBroadcastDescription(broad.title);
        return broad;
      });
    }
  };

  const getUpcomingConfirmationEmployee = async () => {
    const endPoint = `${Api.employeeUrl}?show_dashboard=true`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setConfirmationEmployee(data.data);
    }
  };

  return (
    <>
      <Helmet title={title} />
      {userRole !== 5 && userRole !== 6 && userRole !== 1 && (
        <div className="row">
          {broadcastDescription.length > 0 && (
            <div className="regular-text-slider mt-4">
              <div>
                <p>{broadcastDescription}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Dashboard</h2>
          <Breadcrumb />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Row>
          <Col xl={8} id="main-content">
            <Jumbotron className="welcome-box">
              <Row className="align-items-center w-100">
                <Col md={5}>
                  <div className="welcome-text">
                    <h1>
                      Welcome{' '}
                      <strong>
                        {employeeName && employeeName.split(' ').length > 1
                          ? employeeName.split(' ')[0]
                          : employeeName}
                        ,
                      </strong>
                    </h1>

                    <blockquote className="blockquote quote">
                      <p className="mb-0">
                        {isBirthday === 'true' && (
                          <>
                            'Today is your birthday.'
                            <Button
                              onClick={() => {
                                history.push('wishes');
                                customFunctions.setLocalStorage(
                                  'EmpID',
                                  UserID
                                );
                              }}
                            >
                              Click Here
                            </Button>
                          </>
                        )}

                        {isBirthday === 'false' && <>{quotesContent} </>}
                      </p>
                    </blockquote>
                  </div>
                </Col>
                <Col
                  md={3}
                  className="d-flex justify-content-space-between flex-wrap"
                >
                  <UserRestrictions
                    permittedUsers={[2, 3, 4, 5, 6]}
                    roleId={userRole}
                  >
                    <div className="check-in">
                      {showClockIn && (
                        <div className="time-count text-center">
                          <span>
                            <h4>
                              {/* ClockIn Time
                              <br /> */}
                              {signInTime || '00:00'}
                            </h4>
                          </span>
                        </div>
                      )}

                      {time && (
                        <div className="time-count text-center">
                          <span>
                            <h4>
                              {/* Clockout Time */}
                              {time || '00:00'}
                            </h4>
                          </span>
                        </div>
                      )}

                      {!showClockIn && (
                        <Button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setShowClockIn(true);
                            customFunctions.setLocalStorage(
                              'userclockedin',
                              true
                            );
                          }}
                        >
                          Clock In
                        </Button>
                      )}
                    </div>
                  </UserRestrictions>
                </Col>
                <Col md={4}>
                  <div className="welcome-img text-right">
                    <img src="/images/welcome-img.svg" alt="img" />
                  </div>
                </Col>
              </Row>
            </Jumbotron>
            {showClockIn && (
              <UserRestrictions
                permittedUsers={[2, 3, 4, 5, 6]}
                roleId={userRole}
              >
                <div className="p-3 mb-3 bg-success mt-3 bg-success-main log-time-bar">
                  <div className="img-text">
                    Today's Logged Time: {`${totalHrs}`}
                  </div>
                </div>
              </UserRestrictions>
            )}

            <Row className="birthday-wish-section-row mt-3 justify-content-center">
              {birthdayArr && birthdayArr.length > 0 && (
                <>
                  {birthdayArr &&
                    birthdayArr.length > 0 &&
                    birthdayArr.map((emp) => (
                      <Col>
                        <Card className="dark-blue-bg">
                          <Card.Body>
                            <div className="media birthday-wish-section align-items-center">
                              <img
                                className="mr-3 birth-wish-profile"
                                src={emp.profile_image_url}
                                alt="img"
                              />
                              <div className="media-body">
                                <div className="birthtitle d-flex align-items-center">
                                  <img
                                    className="mr-2"
                                    src="/images/birthday-cake-icon.svg"
                                    alt="img"
                                  />
                                  <a
                                    href="/wishes"
                                    onClick={() => {
                                      customFunctions.setLocalStorage(
                                        'isAnniversary',
                                        emp.is_anniversary
                                      );
                                      customFunctions.setLocalStorage(
                                        'isBirthday',
                                        emp.is_birthday
                                      );
                                      if (emp.greeting) {
                                        customFunctions.setLocalStorage(
                                          'employeeId',
                                          emp.id
                                        ); // eslint-disable-line
                                        customFunctions.setLocalStorage(
                                          'gId',
                                          emp.greeting
                                        ); // eslint-disable-line
                                        customFunctions.setLocalStorage(
                                          'comment-allow',
                                          emp.comment_allow
                                        );
                                        customFunctions.setLocalStorage(
                                          'EmpID',
                                          emp.id
                                        );
                                        customFunctions.setLocalStorage(
                                          'EmpName',
                                          emp.name
                                        );
                                      } else {
                                        customFunctions.removeLocalStorage(
                                          'employeeId'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'gId'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'comment-allow'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'EmpID'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'EmpName'
                                        );
                                      }
                                    }}
                                  >
                                    <h4>
                                      Happy Birthday <br />
                                      {emp.name}
                                    </h4>
                                  </a>
                                </div>
                                {(emp.comment_allow &&
                                  Number(emp.id) === Number(UserID)) ||
                                  (emp.comment_allow &&
                                    Number(emp.id) !== Number(UserID) && (
                                      <div className="birth-input-field mt-3">
                                        <TextInput
                                          onInputChange={(e) => {
                                            emp.message = e.target.value; // eslint-disable-line
                                            setCount(e.target.value);
                                            setNewBirthdayData(birthdayArr);
                                          }}
                                          containerClass="mb-0"
                                          type="text"
                                          value={emp.message}
                                          name="firstNameTitle"
                                          placeholder="Type Here to wish"
                                        />
                                        <a
                                          href="#"
                                          onClick={() => {
                                            postGreetingMessage(
                                              emp.id,
                                              emp.greeting,
                                              'birthday'
                                            );
                                          }}
                                          className="birth-input-arrow"
                                        >
                                          <img
                                            src="/images/arrow-post.svg"
                                            alt="Profile"
                                          />
                                        </a>
                                      </div>
                                    ))}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </>
              )}
              {anniversary && anniversary.length > 0 && (
                <>
                  {anniversary &&
                    anniversary.length > 0 &&
                    anniversary.map((emp) => (
                      <Col>
                        <Card className="dark-blue-bg">
                          <Card.Body>
                            <div className="media birthday-wish-section align-items-center">
                              <img
                                className="mr-3 birth-wish-profile"
                                src={emp.profile_image_url}
                                alt="img"
                              />
                              <div className="media-body">
                                <div className="birthtitle d-flex align-items-center">
                                  <img
                                    className="mr-2"
                                    src="/images/anniversary-icon.svg"
                                    alt="img"
                                  />
                                  <a
                                    href="/wishes"
                                    onClick={() => {
                                      // eslint-disable-line
                                      customFunctions.setLocalStorage(
                                        'isAnniversary',
                                        emp.is_anniversary
                                      );
                                      customFunctions.setLocalStorage(
                                        'isBirthday',
                                        emp.is_birthday
                                      );
                                      if (emp.greeting_anniversary) {
                                        customFunctions.setLocalStorage(
                                          'employeeId',
                                          emp.id
                                        );
                                        customFunctions.setLocalStorage(
                                          'gId',
                                          emp.greeting_anniversary
                                        );
                                        customFunctions.setLocalStorage(
                                          'EmpID',
                                          emp.id
                                        );
                                        customFunctions.setLocalStorage(
                                          'comment-allow',
                                          emp.comment_allow
                                        );
                                        customFunctions.setLocalStorage(
                                          'EmpName',
                                          emp.name
                                        );
                                      } else {
                                        customFunctions.removeLocalStorage(
                                          'employeeId'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'gId'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'comment-allow'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'EmpID'
                                        );
                                        customFunctions.removeLocalStorage(
                                          'EmpName'
                                        );
                                      }
                                    }}
                                  >
                                    <h4>
                                      Work Anniversary
                                      <br />
                                      {emp.name}
                                    </h4>
                                  </a>
                                </div>
                                {(emp.comment_allow &&
                                  Number(emp.id) === Number(UserID)) ||
                                  (emp.comment_allow &&
                                    Number(emp.id) !== Number(UserID) && (
                                      <div className="birth-input-field mt-3">
                                        <TextInput
                                          onInputChange={(e) => {
                                            setCount(e.target.value);
                                            emp.message = e.target.value; // eslint-disable-line
                                            setNewBirthdayData(anniversary);
                                          }}
                                          containerClass="mb-0"
                                          type="text"
                                          value={emp.message}
                                          name="firstNameTitle"
                                          placeholder="Type Here to wish"
                                        />
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            postGreetingMessage(
                                              emp.id,
                                              emp.greeting_anniversary,
                                              'anniversary'
                                            );
                                          }}
                                          className="birth-input-arrow"
                                        >
                                          <img
                                            src="/images/arrow-post.svg"
                                            alt="Profile"
                                          />
                                        </a>
                                      </div>
                                    ))}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </>
              )}
              {userRole ===7 &&  
            <>
            <section>
            <Card>
                <Card.Body>
                  <SupportTicket/>
                </Card.Body>
              </Card>
              </section>  
            </>
          }
              {appreciationData && appreciationData.length > 0 && (
                <>
                  {appreciationData &&
                    appreciationData.length > 0 &&
                    appreciationData.map((appr) => (
                      <Col>
                        <Card className="dark-blue-bg">
                          <Card.Body>
                            {appr.employee_data &&
                              appr.employee_data.map((empdata) => (
                                <>
                                  <div className="media birthday-wish-section align-items-center">
                                    <img
                                      className="mr-3 birth-wish-profile"
                                      src={empdata.profile_url}
                                      alt="img"
                                    />
                                    <div className="media-body">
                                      <div className="birthtitle d-flex align-items-center">
                                        <img
                                          className="mr-2"
                                          src="/images/appreciation-icon.svg"
                                          alt="img"
                                        />
                                        <a
                                          href="/wishes"
                                          onClick={() => {
                                            if (appr.id) {
                                              customFunctions.setLocalStorage(
                                                'employeeId',
                                                appr.id
                                              );
                                              customFunctions.setLocalStorage(
                                                'gId',
                                                appr.id
                                              );
                                              customFunctions.setLocalStorage(
                                                'EmpID',
                                                empdata.id
                                              );
                                              customFunctions.setLocalStorage(
                                                'EmpName',
                                                empdata.full_name
                                              );
                                              customFunctions.setLocalStorage(
                                                'comment-allow',
                                                appr.comment_allow
                                              );
                                            } else {
                                              customFunctions.removeLocalStorage(
                                                'employeeId'
                                              );
                                              customFunctions.removeLocalStorage(
                                                'gId'
                                              );
                                              customFunctions.removeLocalStorage(
                                                'comment-allow'
                                              );
                                              customFunctions.removeLocalStorage(
                                                'EmpID'
                                              );
                                              customFunctions.removeLocalStorage(
                                                'EmpName'
                                              );
                                            }
                                          }}
                                        >
                                          <h4>
                                            Appreciate
                                            <br />
                                            {empdata.full_name}
                                          </h4>
                                        </a>
                                      </div>

                                      {(appr.comment_allow &&
                                        Number(empdata.id) ===
                                          Number(UserID)) ||
                                        (appr.comment_allow &&
                                          Number(empdata.id) !==
                                            Number(UserID) && (
                                            <div className="birth-input-field mt-3">
                                              <TextInput
                                                onInputChange={(e) => {
                                                  setCount(e.target.value);
                                                  empdata.greetMessage = e.target.value; // eslint-disable-line
                                                  setNewBirthdayData(
                                                    appreciationData
                                                  );
                                                }}
                                                containerClass="mb-0"
                                                type="text"
                                                value={empdata.greetMessage}
                                                name="firstNameTitle"
                                                placeholder="Type Here to wish"
                                              />
                                              <a
                                                href="#"
                                                className="birth-input-arrow"
                                                onClick={() => {
                                                  postGreetingMessage(
                                                    empdata.id,
                                                    appr.id
                                                  );
                                                }}
                                              >
                                                <img
                                                  src="/images/arrow-post.svg"
                                                  alt="Profile"
                                                />
                                              </a>
                                            </div>
                                          ))}
                                    </div>
                                  </div>
                                </>
                              ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </>
              )}
            </Row>

            <div classNameName="row">
              {leavesUpdate && leavesUpdate.length > 0 && (
                <div classnamename="dark-blue-bg mb-4 col-md-12 card">
                  <UserRestrictions
                    permittedUsers={[1, 2, 3, 5, 6]}
                    roleId={userRole}
                  >
                    <div classnamename="pie-chart-graph card today-pending-leaves-interviews">
                      <div className="purple-bg card-header">
                        <span>Today's Pending Leaves</span>
                      </div>
                      <div className="card-body">
                        <div className="birth-name d-flex align-items-center mb-0">
                          {leavesUpdate &&
                            leavesUpdate.length > 0 &&
                            leavesUpdate.map((empLeave, i) => (
                              <>
                                <div className="birthday-employees">
                                  <h5 className="card-title">
                                    <a
                                      className="mt-2"
                                      href="#"
                                      onClick={() => {
                                        if (Number(userRole) === 1) {
                                          history.push('/employee-leaves');
                                        } else if (
                                          Number(userRole) === 6 ||
                                          Number(userRole) === 3 ||
                                          Number(userRole) === 2 ||
                                          Number(userRole) === 5
                                        ) {
                                          history.push('/team-leaves');
                                        } else {
                                          history.push('/leaves');
                                        }
                                      }}
                                    >
                                      {i > 0 ? ', ' : ''} &nbsp;
                                      {empLeave.user_name}
                                    </a>
                                  </h5>
                                </div>
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </UserRestrictions>
                </div>
              )}
              {interviewsUpdate && interviewsUpdate.length > 0 && (
                <Card classNameName="dark-blue-bg mb-4 col-md-12">
                  <div classNameName="pie-chart-graph card today-pending-leaves-interviews">
                    {interviewsUpdate && interviewsUpdate.length > 0 ? (
                      <div className="purple-bg card-header">
                        <span>Today's Interviews</span>
                      </div>
                    ) : (
                      ''
                    )}

                    <div className="card-body">
                      <div className="birth-name d-flex align-items-center mb-0">
                        {interviewsUpdate &&
                          interviewsUpdate.length > 0 &&
                          interviewsUpdate.map((empInterview, i) => (
                            <>
                              <div className="birthday-employees">
                                <h5 className="card-title">
                                  <a className="mt-2" href={`/applications/${empInterview.id}`}>
                                    {i > 0 ? ', ' : ''} &nbsp;
                                    {empInterview.name}
                                  </a>
                                </h5>
                              </div>
                            </>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              <UserRestrictions permittedUsers={[1, 5, 6]} roleId={userRole}>
                {confirmationEmployee && confirmationEmployee.length > 0 && (
                  <Card classNameName="dark-blue-bg mb-4 col-md-12">
                    <div classNameName="pie-chart-graph card today-pending-leaves-interviews">
                      {confirmationEmployee &&
                      confirmationEmployee.length > 0 ? (
                        <div className="purple-bg card-header">
                          <span>Upcoming Confirmation</span>
                        </div>
                      ) : (
                        ''
                      )}

                      <div className="card-body">
                        <div className="birth-name d-flex align-items-center mb-0">
                          {confirmationEmployee &&
                            confirmationEmployee.length > 0 &&
                            confirmationEmployee.map((confEmp, i) => (
                              <>
                                <div className="birthday-employees">
                                  <h5 className="card-title">
                                    <Link
                                      className="mt-2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push(
                                          `/employee-profile/${confEmp.id}`
                                        );
                                        customFunctions.setLocalStorage(
                                          'employeeName',
                                          confEmp.full_name
                                        );
                                        customFunctions.setLocalStorage(
                                          'title',
                                          confEmp.designation_name
                                        );
                                        customFunctions.setLocalStorage(
                                          'candidateId',
                                          confEmp.id
                                        );
                                      }}
                                    >
                                      {i > 0 ? ', ' : ''} &nbsp;
                                      {confEmp.full_name}
                                    </Link>
                                  </h5>
                                </div>
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </UserRestrictions>
            </div>
            <UserRestrictions permittedUsers={[5, 6]} roleId={userRole}>
              <div className="mt-0">
                <EmployeeListComponent />
              </div>
            </UserRestrictions>

            <UserRestrictions
              permittedUsers={[2, 3, 4, 5, 6]}
              roleId={userRole}
            >
              {showClockIn && !morningMail && (
                <div className="p-3 mb-4 bg-danger text-white mt-1 bg-danger-main table-red-bg">
                  <div className="img-text">
                    <img src="/images/fail.svg" alt="Success" /> Please select
                    below task and send morning scrum.
                  </div>
                </div>
              )}
            </UserRestrictions>

            {showClockIn && (
              <ToDoList
                onMorningSendScrum={getDailyActivity}
                onClockoutReport={getTimeSheetList}
                totalHrs={totalHrs}
              />
            )}
          </Col>
          <Col xl={4} id="right-sidebar">
            <UserRestrictions permittedUsers={[1, 2, 3, 4]} roleId={userRole}>
              <Card className="flex-fill w-100 weekly-status-box">
                <Card.Body>
                  <Row>
                    <Col md>
                      <h5 className="card-title mb-0">Weekly Status</h5>
                      <div className="weekly-status">
                        <ul className="list-unstyled p-0">
                          <li>
                            <p className="status-label">Completed</p>
                            <span className="bluebg">{completed}%</span>
                          </li>
                          <li>
                            <p className="status-label">Pending</p>
                            <span className="pinkbg"> {pending}% </span>
                          </li>
                          <li>
                            <p className="status-label">Remaining</p>
                            <span className="yellowbg">{remaining}% </span>
                          </li>
                        </ul>
                      </div>
                    </Col>
                    <div className="last-week">
                      {!show ? (
                        <a
                          href="javascript:void()"
                          onClick={() => {
                            setShow(true);
                            getWeeklyStatus('last_week');
                          }}
                        >
                          <img src="/images/previous.svg" alt="week" /> Last
                          Week
                        </a>
                      ) : (
                        <a
                          href="javascript:void()"
                          onClick={() => {
                            setShow(false);
                            getWeeklyStatus('this_week');
                          }}
                        >
                          <img src="/images/previous.svg" alt="week" /> This
                          Week
                        </a>
                      )}
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </UserRestrictions>
            <UserRestrictions
              permittedUsers={[2, 3, 4, 5, 6]}
              roleId={userRole}
            >
              <div className="table-projects time-sheet-table">
                <div className="card">
                  <div className="card-body">
                    <div className="table-title">
                      <h5 className="card-title">Timesheet</h5>
                      <Image
                        className="up-leaves"
                        src="/images/redirect.png"
                        onClick={() => {
                          history.push('/report');
                          onViewButtonClick();
                        }}
                      />
                    </div>
                    <br />
                    <div className="table-responsive">
                      <Table
                        columns={columns}
                        rows={rows}
                        paginationProps={{
                          ...pagination,
                          activePage: pagination.current_page,
                          onPageChange: (pageNo) => {
                            getTimeSheetList(pageNo);
                          },
                        }}
                        tableClass="table-striped mb-0"
                        dropdownContainerClass="mb-3"
                        emptyRender={() => (
                          <p className="text-center mb-0">No record found</p>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </UserRestrictions>

            <div className="holidays-applied">
              <div className="row">
                <div className="col-xl-6">
                  <div className="upcoming-bg">
                    <div className="upcoming-event-box">
                      <div className="upcoming-event-img upcoming-event-img-edit">
                        <img
                          src="/images/leaves-holiday.svg"
                          alt="Upcoming event"
                        />
                        <p>Holidays</p>
                      </div>

                      {holidays && holidays.length >= 1 ? (
                        <>
                          {holidays &&
                            holidays.map((hd) => (
                              <>
                                <div className="event-title align-items-center date text-red">
                                  <p>
                                    <span>{hd.date}</span>
                                  </p>
                                  <p className="ms-1">
                                    <a
                                      href="/holidays"
                                      onClick={() => {
                                        onViewHoliday();
                                      }}
                                    >
                                      <span>{hd.occasion}</span>

                                      <Image
                                        className="up-holday"
                                        src="/images/next.svg"
                                      />
                                    </a>
                                  </p>
                                </div>
                              </>
                            ))}
                        </>
                      ) : (
                        'No upcoming holidays.'
                      )}
                    </div>
                  </div>
                </div>

                <UserRestrictions
                  permittedUsers={[2, 3, 4, 5, 6]}
                  roleId={userRole}
                >
                  <div className="col-xl-6">
                    <div className="upcoming-bg faint-orange">
                      <div className="upcoming-event-box">
                        <div className="upcoming-event-img upcoming-event-img-edit">
                          <img
                            className="up-leaves1"
                            src="/images/leaves-holiday.svg"
                            alt="Upcoming event"
                          />
                          <p>Leaves</p>
                        </div>

                        {leaves && leaves.length >= 1 ? (
                          <>
                            {leaves &&
                              leaves.map((lv) => (
                                <>
                                  <div className="event-title">
                                    <p> {lv.leave_type}</p>
                                  </div>
                                  <div className="date">
                                    <a
                                      href="#"
                                      onClick={() => {
                                        onViewLeaves();
                                        if (Number(userRole) === 1) {
                                          history.push('/employee-leaves');
                                        } else if (
                                          Number(userRole) === 6 ||
                                          Number(userRole) === 3 ||
                                          Number(userRole) === 2 ||
                                          Number(userRole) === 5
                                        ) {
                                          history.push('/my-leaves');
                                        } else {
                                          history.push('/leaves');
                                        }
                                      }}
                                    >
                                      <span>
                                        {lv.leave_from_date} To{' '}
                                        {lv.leave_to_date}
                                        <Image
                                          className="up-leaves"
                                          src="/images/next.svg"
                                        />
                                      </span>
                                    </a>
                                  </div>
                                </>
                              ))}
                          </>
                        ) : (
                          'No future leaves.'
                        )}
                      </div>
                    </div>
                  </div>
                </UserRestrictions>
              </div>
            </div>

            <div className="social-media">
              <div className="card flex-fill w-100">
                <div className="card-body">
                  <div className="table-title">
                    <h5 className="card-title mb-0">Social Media</h5>
                  </div>
                  <div className="weekly-status">
                    <ul className="list-unstyled p-0 d-flex align-items-center justify-content-start">
                      {socialMedia &&
                        socialMedia.map((sm) => (
                          <>
                            <li>
                              <a href="#">
                                <Image
                                  className="up-leaves"
                                  src={sm.post_image}
                                  onClick={() => {
                                    setModalShow(true);
                                    setImage(sm.post_image);
                                  }}
                                />
                              </a>
                            </li>
                          </>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>
      <ModalInput
        size="md"
        centered
        show={modalShow}
        onHide={onCancel}
        id="contained-modal-title-vcenter"
        modalBody={
          <>
            <Image className="up-leaves" src={image} />
          </>
        }
      />
    </>
  );
}

export default withRouter(Dashboard);
