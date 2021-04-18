import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Jumbotron, Card, Button, Row, Col } from 'react-bootstrap';
import Breadcrumb from '../Breadcrumb/breadcrumb.component';
import Projects from '../../containers/Projects/Projects.component';
import Designations from '../../containers/Designations/designation.component';
import Employee from '../../containers/Employee/employee.component';

function DashboardNew() {
  const [showDesignation, setShowDesignation] = useState(false);
  const [showEmployee, setShowEmployee] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function data(){
      // const urlSegement =  props.match.url.split('/');
      // console.log('urllllllllll',urlSegement);
      // if (urlSegement && urlSegement.includes('designation')) {
      //   setShowDesignation(true);
      //   setShowEmployee(false);
      //   setShowProject(false);
      // }else if(urlSegement && urlSegement.includes('employee')) {
      //   setShowEmployee(true);
      //   setShowDesignation(false);
      //   setShowProject(false);
      // }else if(urlSegement && urlSegement.includes('projects')) {
      //   setShowProject(true);
      //   setShowDesignation(false);
      //   setShowEmployee(false);
      // }
    return history.listen((location) => {
      console.log('location', location);
      if (location.pathname === '/designation') {
        setShowDesignation(true);
        setShowEmployee(false);
        setShowProject(false);
      } else if (location.pathname === '/employee') {
        setShowEmployee(true);
        setShowDesignation(false);
        setShowProject(false);
        
      } else if (location.pathname === '/projects') {
        setShowProject(true);
        setShowDesignation(false);
        setShowEmployee(false);
      }
    });
  }
  data();
  }, [history]);

  return (
    <>
    { console.log('showDesignation', showDesignation) }
    { console.log('showEmployee', showEmployee) }
    { console.log('showProject', showProject) }
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
                      Welcome <strong>Alexa,</strong>
                    </h1>
                    <blockquote className="blockquote quote">
                      <p className="mb-0">
                        The secret of your success is determined by your daily
                        agenda
                      </p>
                    </blockquote>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="check-in">
                    <div className="time-count text-center">
                      <span>00 : 00</span>
                    </div>
                    <Button type="button" className="btn btn-primary">
                      Clock In
                    </Button>
                  </div>
                </Col>
                <Col md={5}>
                  <div className="welcome-img text-right">
                    <img src="/images/welcome-img.svg" alt="img" />
                  </div>
                </Col>
              </Row>
            </Jumbotron>
            {/* {
              showDesignation === true ? <Designations /> : 
              showEmployee === true ? <Employee /> :
               <Projects  />
            } */}
            
            {(showDesignation === true && showEmployee === false && showProject === false) ? <Designations /> : '' }
            {(showEmployee === true && showDesignation === false && showProject === false) ? <Employee /> :'' }
            {(showProject === true && showDesignation === false && showEmployee === false)? <Projects /> :''}

            {/* {showDesignation === true ? <Designations /> : <Projects  />}
            {(!showDesignation && showEmployee) && (
              <Employee />
            )} */}
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
                          Completed <span className="bluebg">65%</span>
                        </li>
                        <li>
                          Pending <span className="pinkbg">25%</span>
                        </li>
                        <li>
                          Remaining <span className="yellowbg">10%</span>
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
                <div className="last-week">
                  <a href="#">
                    <img src="/images/previous.svg" alt="" /> Last Week
                  </a>
                </div>
              </Card.Body>
            </Card>
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

export default withRouter(DashboardNew);
