import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Jumbotron, Button } from 'react-bootstrap';
// import Breadcrumb from '../../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import ToDoList from '../../containers/ToDoList/toDoList.component';

function WelcomeScreen() {
  const [signInTime, setSignInTime] = useState('');
  const [showClockButton, setShowClockButton] = useState(true);
  const [showScrumBtn, setShowScrumBtn] = useState(false);
  const path = window.location.pathname;

  const getDailyActivity = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (data) {
      if (data.data.clock_in_time) {
        const stime = data.data.clock_in_time.split(' ');
        const newtime = stime[0];
        setSignInTime(newtime);
        if (data.data.morning_mail === true) {
          setShowScrumBtn(true);
        } else {
          setShowScrumBtn(false);
        }
        if (data.data.clock_in_time) {
          setShowClockButton(false);
        }
      } else {
        setShowClockButton(true);
      }
    }
  };

  const getClockInTime = async () => {
    const endPoint = `${Api.clockInUrl}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setSignInTime(data.data.sign_in_time);
    }
    getDailyActivity();
  };

  useEffect(() => {
    getDailyActivity();
  });

  return (
    <>
      <Jumbotron className="welcome-box">
        <Row className="align-items-center">
          <Col md={5}>
            <div className="welcome-text">
              <h1>
                Welcome <strong>Alexa,</strong>
              </h1>
              <blockquote className="blockquote quote">
                <p className="mb-0">
                  The secret of your success is determined by your daily agenda
                </p>
              </blockquote>
            </div>
          </Col>
          <Col md={2}>
            <div className="check-in">
              <div className="time-count text-center">
                <span>{signInTime}</span>
              </div>
              {showClockButton === true && (
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
      {path === '/'
        ? showClockButton === false && <ToDoList showScrum={showScrumBtn} />
        : ''}
    </>
  );
}
export default withRouter(WelcomeScreen);
