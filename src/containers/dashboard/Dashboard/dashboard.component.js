import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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

function Dashboard() {
  const [signInTime, setSignInTime] = useState('');
  const [showClockButton, setShowClockButton] = useState(true);
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
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'date',
      label: 'Date',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'clockin',
      label: 'Clock In',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'clockout',
      label: 'Clock out',
      roleAccess: [2, 3, 4],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [2, 3, 4],
    },
  ];

  const getDailyActivity = async () => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      if (data.data.clock_in_time && data.data.clocked_in) {
        customFunctions.setLocalStorage('clockinTime', data.data.clock_in_time);
        const stime = data.data.clock_in_time.split(' ');
        const newtime = stime[0];
        setSignInTime(newtime);
        if (data.data.clock_in_time) {
          setShowClockButton(false);
          getClockInTime(false);
        }
      } else {
        setShowClockButton(true);
        setShowLoader(false);
      }
    }
  };

  const getTimeSheetList = async () => {
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
          total: timesheet.estimation,
        };
        row.push(setRowData);
        return timesheet;
      });
      setRows(row);
    }
  };

  const getClockInTime = async (loadActivity = true) => {
    // const event = new Event('TimeUpdate', { isUpdated: true });

    const endPoint = `${Api.clockInUrl}`;
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      // setShowLoader(false);
      setSignInTime(data.data.sign_in_time);
      // document.dispatchEvent(event);
    }
    if (loadActivity) {
      await getDailyActivity();
    }

    SharedService.clockIn.next(true);
    setShowLoader(false);
  };

  const getWeeklyStatus = async (key) => {
    const endPoint = `${Api.weeklyStatusUrl}?mode=${key}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
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

  useEffect(() => {
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
    setTitle('Dashboard');
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    // const empName = customFunctions.getLocalStorage('name');
   
  }, []);

  return (
    <>
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
                        "The secret of your success is determined by your daily
                        agenda"
                      </p>
                    </blockquote>
                  </div>
                </Col>
                <Col md={2}>
                  <UserRestrictions permittedUsers={[2, 3, 4]} roleId={userRole}>

                    <div className="check-in">
                      {signInTime && (
                        <div className="time-count text-center">
                          <span>{signInTime}</span>
                        </div>
                      )}

                      {time && (
                        <div className="time-count text-center">
                          <span>{time.split(' ')[0]}</span>
                        </div>
                      )}

                      {showClockButton && (
                        <Button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => getClockInTime()}
                        >
                          Clock In
                        </Button>
                      )}
                    </div>
                  </UserRestrictions>

                </Col>
                <Col md={5}>
                  <div className="welcome-img text-right">
                    <img src="/images/welcome-img.svg" alt="img" />
                  </div>
                </Col>
              </Row>
            </Jumbotron>
            {!showClockButton && <ToDoList />}
          </Col>
          <Col xl={4} id="right-sidebar">
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
                        <img src="/images/previous.svg" alt="week" /> Back
                      </a>
                    )}
                  </div>
                </Row>
              </Card.Body>
            </Card>
            <UserRestrictions permittedUsers={[2, 3, 4]} roleId={userRole}>

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
                      showPagination
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
                </div>
              </div>
            </UserRestrictions>

            {/* <div className="holidays-applied">
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
                      <div className="event-title">
                        <p>Monday 25 June, 2021</p>
                      </div>
                      <div className="date">
                        <span>Rakshabandhan</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="upcoming-bg faint-orange">
                    <div className="upcoming-event-box">
                      <div className="upcoming-event-img">
                        <img
                          src="/images/leaves-holiday.svg"
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
            </div> */}
            {/* <div className="social-media">
              <div className="card flex-fill w-100">
                <div className="card-body">
                  <div className="table-title">
                    <h5 className="card-title mb-0">Social Media</h5>
                  </div>
                  <div className="weekly-status">
                    <ul className="list-unstyled p-0 d-flex align-items-center justify-content-between">
                      <li>
                        <a href="#">
                          <img src="/images/social-media4.png" alt="img" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="/images/social-media4.png" alt="img" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="/images/social-media4.png" alt="img" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="/images/social-media4.png" alt="img" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(Dashboard);
