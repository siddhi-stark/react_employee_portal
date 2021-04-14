import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, Card, Button, Row, Col, Image, Container } from 'react-bootstrap';
import Breadcrumb from '../../../components/Breadcrumb/breadcrumb.component';
import Table from '../../../components/Table/simpletable.component';
import materialnew from '../../../helper/materialnew';
import TaskData from '../../../helper/TaskData';
import {
  ModalInput, TextInput
  } from '../../../components/FormInputs';
// import AuthApi from '../../../helper/authApi';
// import Api from '../../../helper/api';

const columns = [
{
    id: 'date',
    label: 'Date',
},
{
    id: 'clockin',
    label: 'Clock-in',
},
{
    id: 'clockout',
    label: 'Clock-out',
},
{
    id: 'totalworking',
    label: 'Total Working',
}
];

const columnsnew = [
{
    id: 'todo',
    label: 'To Do Tasks',
},
{
    id: 'projects',
    label: 'Projects',
},
{
    id: 'status',
    label: 'status',
},
{
    id: 'eta',
    label: 'ETA',
},
{
    id: 'at',
    label: 'AT',
}
];

function Dashboard() {
  // const getClockInTime = async () => {
  //   const endPoint = `${Api.clockInUrl}`;
  //   const { data } = await AuthApi.getDataFromServer(endPoint);
  //   // if(data && data.data){
  //   }
 
 const [rows, setRows] = useState('');
 const [taskRows, setTaskRows] = useState('');
 const [modalShow, setModalShow] = useState(false);

  const getTableData = async () => {

      const row = [];  
      // data.map((dt, i) => {
      materialnew.map((mat) => {
      console.log('mat', mat); //eslint-disable-line
        row.push({
          date: mat.date,
          clockin: mat.startime,
          clockout: mat.endtime,
          totalworking: mat.total,
          
          action: (
            <>
              <a
                href="/"
                className="pl-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
               <Image src="images/edit.svg" />
              </a>
              <a
                href="/"
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
               <Image src="images/edit.svg" />
              </a>
            </>
          ),
        });
        return mat;
      });
      setRows(row);
    // }
  };

  const getTaskData = async () => {

      const row = [];  
      // data.map((dt, i) => {
      TaskData.map((mat) => {
      console.log('mat', mat); //eslint-disable-line
        row.push({
          todo: mat.date,
          projects: mat.startime,
          status: mat.endtime,
          eta: mat.total,
          at: mat.at
        
        });
        return mat;
      });
      setTaskRows(row);
    // }
  };

  useEffect(() => {
    getTableData();
    getTaskData();
  },[]);

  return (
    <>
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Welcome To Dashboard
          </h2>
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
                    <img src="images/welcome-img.svg" alt="img" />
                  </div>
                </Col>
              </Row>

            </Jumbotron>
            <hr />
            <Row className='mt-3'>
            <div>
            To Do
              <div className="float-end">
              <Button
                size="sm"
                variant="primary"
                type="submit"
                onClick={() => setModalShow(true)}
              >
                Add Task
              </Button>
            </div>
            </div>
            <div className='mt-3'>
              
             <Table
                  columns={columnsnew}
                  rows={taskRows}
                  showPagination="true"
                  showCheckbox="true"
                   />
            </div>

            <div>
            <div className="float-end">
              
              <Button
                size="sm"
                variant="primary"
                type="submit"
               
              >
               ClockIn & ClockOut
              </Button>
            </div>
            </div>

            </Row>
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
                      <img src="images/persentage-circle.svg" alt="img" />
                    </div>
                  </Col>
                </Row>
                <div className="last-week">
                  <a href="#">
                    <img src="images/previous.svg" alt="" /> Last Week
                  </a>
                </div>
              </Card.Body>
            </Card>
            <div className="table-projects time-sheet-table">
          
           <ModalInput
            size="sm"
            // aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow}
            label="Add Task"
            id="contained-modal-title-vcenter"
            // closebutton="closeButton"
            modalBody={
              <Container>
               <Row>
               <Col sm={6}>
               <TextInput
               label="Add Task Name" 
              // containerClass="form-group"
              inputClass="form-control form-control-lg"
              type="email"
              name="email"
            // onInputChange={(e) => handleInputChange(e)}
           
            placeholder="Enter your Email and instructions will be sent to you!"
           
          />
               </Col>

               <Col sm={6}>
               <TextInput
               label="Project Name" 
              // containerClass="form-group"
              inputClass="form-control form-control-lg"
              type="email"
              name="email"
            // onInputChange={(e) => handleInputChange(e)}
           
            placeholder="Enter your Email and instructions will be sent to you!"
           
          />
               </Col>
               </Row> 

               <Row>
                 <Col sm={2}>
                 <TextInput
               label="Start Time" 
              // containerClass="form-group"
              inputClass="form-control form-control-lg"
              type="time"
              name="email"
            // onInputChange={(e) => handleInputChange(e)
           
          />
                 </Col>

                 <Col sm={2}>
                    <TextInput
               label="End Time" 
              // containerClass="form-group"
              inputClass="form-control form-control-lg"
              type="time"
              name="email"
            // onInputChange={(e) => handleInputChange(e)}
           
          />
                 </Col>
                 <Col sm={2}>
                     <TextInput
               label="Time Spent" 
              // containerClass="form-group"
              inputClass="form-control form-control-lg"
              type="email"
              name="email"
            // onInputChange={(e) => handleInputChange(e)}
           
          />
                 </Col>

                 <Col sm={4}>
                     <TextInput
               label="Progress" 
              // containerClass="form-group"
              inputClass="form-control form-control-lg"
              type="email"
              name="email"
            // onInputChange={(e) => handleInputChange(e)}
           
          />
                 </Col>

                 <Col sm={2}>
                    <Button
                  variant="secondary"
                  type="submit"
                  // className="ms-4"
                  // // onClick={(e) => addData(e)}
                >
                  Cancel
                </Button>
                 </Col>
               </Row>

              </Container>
            }
            modalFooter={
               <div className="float-end">
               <Button variant="secondary" onClick={() => setModalShow(false)}>
              Cancel
            </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="ms-4"
                  // onClick={(e) => addData(e)}
                >
                  Submit
                </Button>
              </div>
            }
          />


              <Card>
                <div className="table-title">
                  <Card.Title>Time Sheet</Card.Title>
                </div>
                <Table
                  columns={columns}
                  rows={rows}
                  showPagination="true"
                  showCheckbox="true"
                   />
                   
              </Card>
            </div>
            <div className="holidays-applied">
              <Row>
                <Col xl={6}>
                  <div className="upcoming-bg">
                    <div className="upcoming-event-box">
                      <div className="upcoming-event-img">
                        <img
                          src="images/leaves-holiday.svg"
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
                </Col>
                <Col xl={6}>
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
                </Col>
              </Row>
            </div>
            <div className="social-media">
              <Card flex-fill w-100>
                <Card.Body>
                  <div className="table-title">
                    <h5 className="card-title mb-0">Social Media</h5>
                  </div>
                  <div className="weekly-status">
                    <ul className="list-unstyled p-0 d-flex align-items-center justify-content-between">
                      <li>
                        <a href="#">
                          <img src="images/social-media4.png" alt="img" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="images/social-media4.png" alt="img" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="images/social-media4.png" alt="img" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="images/social-media4.png" alt="img" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(Dashboard);
