import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Jumbotron, Card, Button, Row, Col } from 'react-bootstrap';
import { Helmet } from '../../../components/FormInputs';
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
  const [holidays,setHolidays] = useState([]);
  // const [leaves,setLeaves] = useState([]);
  const [socialMedia,setSocialMediaData] = useState([]);
  const history = useHistory();
  const viewHoliday = new Event('ViewHolidayButtonChange', { isUpdated: true });

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
      label: 'Clock In',
      roleAccess: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'clockout',
      label: 'Clock out',
      roleAccess: [2, 3, 4, 5, 6],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [2, 3, 4, 5, 6],
    },
  ];

  // const date = new Date();
  // const lastday = date.getDate() - (date.getDay() - 1) + 6;
  // const lastDayNew =  new Date(date.setDate(lastday));


// const curr = new Date; // get current date
// const first = curr.getDate() - curr.getDay() +1; // First day is the day of the month - the day of the week
// const last = first + 4; // last day is the first day + 6

// const firstday = new Date(curr.setDate(first)).toUTCString();
// const lastday = new Date(curr.setDate(last)).toUTCString();

// const FirstDay = customFunctions.getDate(firstday);
// const LastDay = customFunctions.getDate(lastday);

  const getDailyActivity = async () => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (!customFunctions.checkIfEmpty(data, 'O') && data.success) {
      setMorningMail(data.data.morning_mail);
      if (data.data.clock_in_time && data.data.clocked_in) {
        customFunctions.setLocalStorage('clockinTime', data.data.clock_in_time);
        customFunctions.setLocalStorage('userclockedin',true);
        setSignInTime(data.data.clock_in_time);
        customFunctions.setLocalStorage('clockInDate',data.data.clock_in_date);
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
    // const page = pageNo || pagination.current_page;
    const { data } = await AuthApi.getDataFromServer(`${Api.timeSheetUrl}`);
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
          date: customFunctions.getFormattedDate(timesheet.created_at),
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
    const endPoint = `${Api.holidayUrl}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if(data) {
      console.log(data.data);
      setHolidays(data.data);
    }
  }

// const getAppliedLeaves = async () => {
//     const endPoint = `${Api.leavesApplied}`;
//     const { data } = await AuthApi.getDataFromServer(endPoint);
//     if(data) {
//       console.log(data.data);
//       setLeaves(data.data);
//     }
//   }

const getInstagramPost = async () => {
  const endPoint = `${Api.socialMediaUrl}`;
  const { data } = await AuthApi.getDataFromServer(endPoint);
  if(data) {
    console.log('data',data.data);
    setSocialMediaData(data.data);
  }
}

  useEffect(() => {
    getUpcomingHoliday();
    // getAppliedLeaves();
    getInstagramPost();
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
    setTitle('Dashboard');
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    const quote = customFunctions.getLocalStorage('quote');
    setQuotesContent(quote);
    const userclockedin = customFunctions.getLocalStorage('userclockedin');
    if (userclockedin)
      setShowClockIn(userclockedin);
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



  return (
    <>
    {console.log('socialMedia',socialMedia)}
      <Helmet title={title} />
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
              <Row className="align-items-center">
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
                       "{quotesContent}"
                      </p>
                    </blockquote>
                  </div>
                </Col>
                <Col md={3} className='d-flex justify-content-space-between flex-wrap'>
                  <UserRestrictions permittedUsers={[2, 3, 4, 5, 6]} roleId={userRole}>
                    <div className="check-in">
                      {
                        showClockIn && (
                          <div className="time-count text-center">
                            <span><h4>ClockIn Time<br />{signInTime || '00:00'}</h4></span>
                          </div>
                        )
                      }

                      {time && (
                        <div className="time-count text-center">
                          <span><h4>Clockout Time{time || '00:00'}</h4></span>
                        </div>
                      )}

                      {!showClockIn && (
                        <Button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setShowClockIn(true);
                            customFunctions.setLocalStorage('userclockedin', true);
                          }}
                        >
                          Clock In
                        </Button>
                      )}
                    </div>
                  </UserRestrictions>
                  <UserRestrictions permittedUsers={[2, 3, 4, 5, 6]} roleId={userRole}>
                    <p className="text-primary mt-4"><i>Total Working Hrs: {totalHrs}</i></p>
                  </UserRestrictions>

                </Col>
                <Col md={4}>
                  <div className="welcome-img text-right">
                    <img src="/images/welcome-img.svg" alt="img" />
                  </div>
                </Col>
              </Row>
            </Jumbotron>
            <UserRestrictions permittedUsers={[5,6]} roleId={userRole}>
            <div className="mt-4">
              <EmployeeListComponent />
            </div>
            </UserRestrictions>

            <UserRestrictions permittedUsers={[2,3,4,5,6]} roleId={userRole}>
            {
              showClockIn && !morningMail && (
                <div className="p-3 mb-2 bg-danger text-white mt-4 bg-danger-main table-red-bg">
                  <div className="img-text">
                    <img src="/images/fail.svg" alt="Success" /> Please select below task and send morning scrum.
                </div>
                </div>
              )
            }
            </UserRestrictions>

            {showClockIn && <ToDoList onMorningSendScrum={getDailyActivity} onClockoutReport={getTimeSheetList} />}
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
                        <img src="/images/previous.svg" alt="week" /> Last Week
                      </a>
                    ) : (
                      <a
                        href="javascript:void()"
                        onClick={() => {
                          setShow(false);
                          getWeeklyStatus('this_week');
                        }}
                      >
                        <img src="/images/previous.svg" alt="week" /> This Week
                      </a>
                    )}
                  </div>
                </Row>
              </Card.Body>
            </Card>
            </UserRestrictions>
            <UserRestrictions permittedUsers={[2, 3, 4, 5, 6]} roleId={userRole}>

              <div className="table-projects time-sheet-table">
                <div className="card">
                  <div className="table-title">
                    <h5 className="card-title">Time Sheet</h5>
                  </div>
                  <br />
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      rows={rows}
                      // showPagination
                      paginationProps={{
                        ...pagination,
                        activePage: pagination.current_page,
                        onPageChange: (pageNo) => {
                          getTimeSheetList(pageNo);
                        },
                      }}
                      tableClass="table-striped"
                      dropdownContainerClass="mb-3"
                      emptyRender={() => (
                        <p className="text-center mb-0">No record found</p>
                      )}
                    />
                  </div>
                  <UserRestrictions permittedUsers={[5,6]} roleId={userRole}>
                  <div className="d-flex justify-content-end mr-3">
                    <Button onClick={()=> 
                      {history.push('/hr-listing',customFunctions.setLocalStorage('type','EmpType'));
                      onViewButtonClick();
                    }}>View All</Button>
                 </div>
                  </UserRestrictions>
                </div>
              </div>
            </UserRestrictions>

            <div className="holidays-applied">
              <div className="row">
                <div className="col-xl-6">
                  <div className="upcoming-bg">
                    <div className="upcoming-event-box">
                      <div className="upcoming-event-img">
                        <img
                          src="/images/leaves-holiday.svg"
                          alt="Upcoming event"
                        />
                        <p>Up Coming Holidays</p>
                      </div>
                      {holidays && holidays.map((hd) => (
                      <>
                      <div className="event-title">
                        <p>{hd.date}</p>
                      </div>
                      <div className="date">
                        <span>{hd.occasion}</span>
                      </div>
                      </>    
                        ))}
                        <Button onClick={() => {history.push('/holidays'); onViewHoliday();}  } >View All</Button>
                    </div>
                  </div>
                </div>
               <div className="col-xl-6">
                  <div className="upcoming-bg faint-orange">
                    <div className="upcoming-event-box">
                      <div className="upcoming-event-img">
                        <img
                          src="images/leaves-holiday.svg"
                          alt="Upcoming event"
                        />
                        <p>Leaves Applied</p>
                      </div>
                      <div className="event-title">
                        <p>2 Leaves</p>
                      </div>
                      <div className="date">
                        <span>26, 27 June (Casual)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="social-media">
              <div className="card flex-fill w-100">
                <div className="card-body">
                  <div className="table-title">
                    <h5 className="card-title mb-0">Social Media</h5>
                  </div>
                  <div className="weekly-status">

                    {socialMedia && socialMedia.map((social) => (
                      <>
                      {console.log('social',social.post_image)}
                    <ul className="list-unstyled p-0 d-flex align-items-center justify-content-between">
                       <li>
                        <a href="#">
                        {social.post_image ? (

                          <img src={social.post_image} alt="social" />
                          ) : ''}

                        </a>
                      </li>
                    </ul>
                      </>    
                        ))}
                  </div>
                </div>
              </div>
            </div> 
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(Dashboard);
