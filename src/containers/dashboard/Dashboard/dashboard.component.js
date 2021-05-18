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

function Dashboard() {
  const [signInTime, setSignInTime] = useState('');
  const [showClockButton, setShowClockButton] = useState(true);
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState('');
  const [pending, setPending] = useState('');
  const [remaining, setRemaining] = useState('');
  const [rows, setRows] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [time, setTime] = useState('');
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
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [1, 2, 3, 4],
    },
  ];

  const getDailyActivity = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      if (data.data.clock_in_time) {
        customFunctions.setLocalStorage('clockinTime', data.data.clock_in_time);
        const stime = data.data.clock_in_time.split(' ');
        const newtime = stime[0];
        setSignInTime(newtime);
        if (data.data.clock_in_time) {
          setShowClockButton(false);
        }
      } else {
        setShowClockButton(true);
      }
    }
  };

  const getTimeSheetList = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.timeSheetUrl}`);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
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

  const getClockInTime = async () => {
    const endPoint = `${Api.clockInUrl}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setSignInTime(data.data.sign_in_time);
    }
    getDailyActivity();
  };

  const getWeeklyStatus = async () => {
    const endPoint = `${Api.weeklyStatusUrl}?mode=this_week`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setCompleted(data.data.completed);
      setPending(data.data.pending);
      setRemaining(data.data.upcoming);
    }
  };

  useEffect(() => {
    getDailyActivity();
    getWeeklyStatus();
    getTimeSheetList();
    setTitle('Dashboard');
    const empName = customFunctions.getLocalStorage('name');
    const localTime = customFunctions.getLocalStorage('time');
    setEmployeeName(empName);
    setTime(localTime);
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
                        {employeeName.split(' ')[0]
                          ? employeeName.split(' ')[0]
                          : ''}
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
                  <Col md={6}>
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
                  <Col md={6}>
                    <div className="persentage-circle">
                      <img src="/images/persentage-circle.svg" alt="img" />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
            </div>
            <div className="social-media">
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
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(Dashboard);
