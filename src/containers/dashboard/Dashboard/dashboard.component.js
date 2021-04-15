import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, Card, Button, Row, Col, Image, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import Breadcrumb from '../../../components/Breadcrumb/breadcrumb.component';
import Table from '../../../components/Table/simpletable.component';
import {
  ModalInput, TextInput
} from '../../../components/FormInputs';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';

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

// const columnsnew = [
// {
//     id: 'todo',
//     label: 'To Do Tasks',
// },
// {
//     id: 'projects',
//     label: 'Projects',
// },
// {
//     id: 'status',
//     label: 'status',
// },
// {
//     id: 'eta',
//     label: 'ETA',
// },
// {
//     id: 'at',
//     label: 'AT',
// }
// ];

const validator = new SimpleReactValidator();

function Dashboard() {
  // const getClockInTime = async () => {
  //   const endPoint = `${Api.clockInUrl}`;
  //   const { data } = await AuthApi.getDataFromServer(endPoint);
  //   // if(data && data.data){
  //   }
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  // const [count, forceUpdate] = useState(0);
  // const [designationId, setDesignationId] = useState(null);
  // const [ShowDelete, setShowDelete] = useState(false);
  const [designation, setDesignation] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });


  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.designationUrl}?page=${page}&limit=${pagination.itemsPerPage}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((desgn) => {
        row.push({
          name: desgn.name,
          action: (
            <>
              <a
                href="/"
                className="pl-2"
                onClick={(e) => {
                  setModalShow(true);
                  e.preventDefault();
                  e.stopPropagation();
                  // setDesignationId(desgn.id);
                  setDesignation(desgn.name);
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
                  // setShowDelete(true);
                  // setDesignationId(desgn.id);
                  // removeDesignation(desgn.id); //eslint-disable-line
                }}
              >
                <Image src="images/delete.png" />
              </a>
            </>
          ),
        });
        return desgn;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    getTableData(1);
  }, []);

  const onCancel = () => {
    validator.hideMessages();
    setDesignation();
    setModalShow(false);
  };


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
            <div className="mt-3">
              <Card>
                <Card.Body>
                  <Row>
                    <Row>
                      <Col>
                        <h4>Desingation</h4>
                      </Col>
                      <Col>
                        <div className="float-end">
                          <Button
                            size="sm"
                            variant="primary"
                            type="submit"
                            onClick={() => {
                              setModalShow(true);
                              // setDesignationId();
                            }}
                          >
                            Add Task
                    </Button>
                        </div>
                      </Col>
                    </Row>

                    <Col className="mt-3">
                      <Table
                        tableClass="table table-striped"
                        columns={columns}
                        rows={rows}
                        showPagination
                        showCheckbox
                        paginationProps={{
                          ...pagination,
                          onPageChange: (pageNo) => {
                            getTableData(pageNo);
                          },
                        }}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <ModalInput
                size="lg"
                centered
                show={modalShow}
                label="Add Task"
                id="contained-modal-title-vcenter"
                modalBody={
                  <Form>
                    <Row>
                      <Col sm={6}>
                        <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="Add Task Name"
                          containerClass="form-group"
                          type="text"
                          name="designationtitle"
                          value={designation}
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        />
                      </Col>
                      <Col sm={6}>
                        <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="Project Name"
                          containerClass="form-group"
                          type="text"
                          name="designationtitle"
                          value={designation}
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={2}>
                        <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="Start Time"
                          containerClass="form-group"
                          type="time"
                          name="designationtitle"
                          value={designation}
                          image='images/time.svg'
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        />
                      </Col>
                      <Col sm={2}>
                        <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="End Time"
                          containerClass="form-group"
                          type="text"
                          name="designationtitle"
                          value={designation}
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        />
                      </Col>
                      <Col sm={2}>
                        <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="Time Spent"
                          containerClass="form-group"
                          type="text"
                          name="designationtitle"
                          value={designation}
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        />
                      </Col>
                      <Col sm={6}>
                      {/* <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="Progress"
                          containerClass="form-group"
                          progressClass="progress-main"
                          type="text"
                          name="designationtitle"
                          value={designation}
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        /> */}
                        <div className="form-group">
                        <label htmlFor="" className="col-form-label">Progress</label>
                            <div className="progress-main">
                              <div className="progress">
                                <div className="progress-bar bg-secondary" role="progressbar" style={{'width': '5%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                              </div>
                        </div>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                }
                modalFooter={
                  <div className="float-end">
                    <Button variant="secondary" onClick={() => onCancel()}>
                      Cancel
              </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      className="ms-4"
                    // onClick={(e) => onSubmit(e)}
                    >
                      Add
              </Button>
                  </div>
                }
              />
            </div>
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
              <div className="card">
                <div className="table-title">
                  <h5 className="card-title">Time Sheet</h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped m-0">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Clock in</th>
                        <th scope="col">Clock out</th>
                        <th scope="col">Total working</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">15/06/2021</th>
                        <td>10:30</td>
                        <td>9:00</td>
                        <td>8.00</td>
                      </tr>
                      <tr>
                        <th scope="row">16/06/2021</th>
                        <td>10:30</td>
                        <td>9:00</td>
                        <td>8.00</td>
                      </tr>
                      <tr>
                        <th scope="row">17/06/2021</th>
                        <td>10:30</td>
                        <td>9:00</td>
                        <td>8.00</td>
                      </tr>
                      <tr>
                        <th scope="row">18/06/2021</th>
                        <td>10:30</td>
                        <td>9:00</td>
                        <td>8.00</td>
                      </tr>
                      <tr>
                        <th scope="row">19/06/2021</th>
                        <td>10:30</td>
                        <td>9:00</td>
                        <td>8.00</td>
                      </tr>
                    </tbody>
                  </table>
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
