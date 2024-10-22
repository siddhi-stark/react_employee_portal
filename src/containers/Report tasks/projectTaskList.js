/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Helmet } from '../../components/FormInputs';
import './datesGrid.css';
import { format, getDaysInMonth } from 'date-fns';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import { useHistory, useParams } from 'react-router-dom';
import './projectReport.css';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const items = [{ to: '/', label: 'Home' }, { label: 'Project task Report' }];


// DateCard Component
const ProjectTaskList = () => {
  const history = useHistory();
  const state = useLocation()
  const { id } = useParams();
  const [projectId, setProjectId] = useState(id);
  const fromDate = state?.state?.state?.formattedDate
  const fromSentReport = state?.state?.state?.fromSentReport
  const [title, setTitle] = useState('Report generations');
  const [isShowLoader, setShowLoader] = useState(false);
  const [reportDetails, setReportDetails] = useState([])
  const [currentStatus, setCurrentStatus] = useState(reportDetails[0]?.current_status_name || '');
  const [selectedTasksCompleted, setSelectedTasksCompleted] = useState([]);
  const [selectedDeliverables, setSelectedDeliverables] = useState([]);
  const [issuesRisks, setIssuesRisks] = useState(reportDetails[0]?.issues_risks || '');
  const [nextSteps, setNextSteps] = useState(reportDetails[0]?.next_steps || '');
  const UserID = customFunctions.getLocalStorage('userId');


  useEffect(() => {
    getReportsDetails()
  }, [])

  const getReportsDetails = async () => {
    setShowLoader(true);

    const params = {
      project: projectId,
      user: UserID,
      type: 'all',
      start_date: fromDate,
      end_date: fromDate
    };

    // if (filterDate.getDate() !== today.getDate()) {
    //   params.end_date = start_date
    // }

    const url = customFunctions.generateUrl(Api.generateTaskList, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      const { current_page, total_count, limit } = data.paginator;
      setReportDetails(data?.data);
      setShowLoader(false);

    } else {
      setShowLoader(false);

      swal(data.message || 'Error fetching data', '', 'error');
    }
  }


  const getTasksBySection = (sectionName) => {
    return reportDetails[0]?.report_tasks_details.filter(task => task.section_name === sectionName);
  };

  const getTasksBySectionEvening = (sectionName) => {
    return reportDetails[1]?.report_tasks_details.filter(task => task.section_name === sectionName);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Tasks Report</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <section className="content-area">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Submited Details for {reportDetails[0]?.project_name} on date {reportDetails[0]?.report_date}</h5>
              <Button
                variant="secondary"
                className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  if (!fromSentReport){
                    history.push(`/report-list/${projectId}`) 

                  }else{ 
                    history.push(`/project-report-list`) 
                  }

                }}
              >
                Back
              </Button>
            </div>
            <hr style={{ borderColor: "white" }} />

            {reportDetails && reportDetails.length > 0 ? (
              <Row>
                <Col sm={6}>
                  <h5 className="card-title mb-0 mt-2 ">{reportDetails[0].report_type == 1 ? "Morning Report :" : "Evening Report :"} </h5>
                  <br />

                  <div className="card">
                    <div className="card-header">
                      <h3>Current Project Status</h3>
                    </div>
                    <div className="card-content">
                      <span className={`status-pill ${reportDetails[0]?.current_status_name.toLowerCase()}`}>
                        {reportDetails[0]?.current_status_name}
                      </span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Key Tasks Completed Today</h3>
                    </div>
                    <div className="card-content">
                      {getTasksBySection('Key Tasks Completed Today')?.length > 0 ? (
                        <ul className="task-list">
                          {getTasksBySection('Key Tasks Completed Today')?.map((task, index) => (
                            <li key={task.id} className={`task-item ${task.status_name.toLowerCase()}`}>
                              <strong>{index + 1}.{task.task_name}</strong> - {task.status_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No tasks completed today.</p>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Upcoming Deliverables</h3>
                    </div>
                    <div className="card-content">
                      {getTasksBySection('Upcoming Deliverables')?.length > 0 ? (
                        <ul className="task-list">
                          {getTasksBySection('Upcoming Deliverables')?.map((task, index) => (
                            <li key={task.id} className={`task-item ${task.status_name.toLowerCase()}`}>
                              <strong>{index + 1}.{task.task_name}</strong> - {task.status_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No upcoming deliverables.</p>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Issues/Risks</h3>
                    </div>
                    <div className="card-content">
                      <p>{reportDetails[0]?.issues_risks || 'No issues or risks reported.'}</p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Next Steps</h3>
                    </div>
                    <div className="card-content">
                      <p>{reportDetails[0]?.next_steps || 'No next steps provided.'}</p>
                    </div>
                  </div>
                </Col>
                {reportDetails.length > 1 && (
                  <>
                    <Col sm={6}>
                      <h5 className="card-title mb-0 mt-2 ">Evening Report : </h5>
                      <br />

                      <div className="card">
                        <div className="card-header">
                          <h3>Current Project Status</h3>
                        </div>
                        <div className="card-content">
                          <span className={`status-pill ${reportDetails[1]?.current_status_name.toLowerCase()}`}>
                            {reportDetails[1]?.current_status_name}
                          </span>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h3>Key Tasks Completed Today</h3>
                        </div>
                        <div className="card-content">
                          {getTasksBySectionEvening('Key Tasks Completed Today')?.length > 0 ? (
                            <ul className="task-list">
                              {getTasksBySectionEvening('Key Tasks Completed Today')?.map((task, index) => (
                                <li key={task.id} className={`task-item ${task.status_name.toLowerCase()}`}>
                                  <strong>{index + 1}.{task.task_name}</strong> - {task.status_name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No tasks completed today.</p>
                          )}
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h3>Upcoming Deliverables</h3>
                        </div>
                        <div className="card-content">
                          {getTasksBySectionEvening('Upcoming Deliverables')?.length > 0 ? (
                            <ul className="task-list">
                              {getTasksBySectionEvening('Upcoming Deliverables')?.map((task, index) => (
                                <li key={task.id} className={`task-item ${task.status_name.toLowerCase()}`}>
                                  <strong>{index + 1}.{task.task_name}</strong> - {task.status_name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No upcoming deliverables.</p>
                          )}
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h3>Issues/Risks</h3>
                        </div>
                        <div className="card-content">
                          <p>{reportDetails[1]?.issues_risks || 'No issues or risks reported.'}</p>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h3>Next Steps</h3>
                        </div>
                        <div className="card-content">
                          <p>{reportDetails[1]?.next_steps || 'No next steps provided.'}</p>
                        </div>
                      </div>
                      {/* </div> */}
                    </Col>
                  </>
                )}
              </Row>
            ) : 'Report not present.'}
          </section >
        </Card.Body>
      </Card>
    </>
  );
};

export default ProjectTaskList;
