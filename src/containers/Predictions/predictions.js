/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory, useLocation } from 'react-router-dom';

const items = [{ to: '/', label: 'Home' }, { label: 'Milestone Predictions' }];

const Predictions = () => {
  const history = useHistory();
  const { state } = useLocation();

  const id = state?.state?.id
  const [isShowLoader, setShowLoader] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState('');
  const [isProjectManager, setProjectManager] = useState(false);

  console.log("state", state);
  console.log("id", id);


  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);

  useEffect(() => {
    setTitle('Milestone Predictions');
    if (id) {
      getPredictionsDetails(id);
    }
  }, [id]);

  useEffect(() => {
    setTitle('Milestone Predictions');
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  const getPredictions = async () => {
    setShowLoader(true);
    const url = `${Api.prediction}?use_ai=true`;
    const { data, error } = await AuthApi.getDataFromServer(url);

    // if (data?.data) {
    if (data?.data) {
      swal(data && data.message[0], '', 'success');
      // setPredictions(data.data.milestone_details || []);
      setShowLoader(false);
      // setPredictions([
      //   {
      //     "milestone_name": "ca-erp prediction ONE",
      //     "deadline": "2025-01-03",
      //     "completed_tasks": 9,
      //     "pending_tasks": 9,
      //     "completed_bugs": 4,
      //     "pending_bugs": 4,
      //     "total_logged_time": "33 Hrs 45 Mins",
      //     "total_tasks_logged_time": "22 Hrs 15 Mins",
      //     "total_bugs_logged_time": "11 Hrs 30 Mins",
      //     "milestone_analysis": {
      //       "milestone_name": "ca-erp prediction ONE",
      //       "deadline": "2025-01-03",
      //       "deadline_predictions": {
      //         "is_at_risk": true,
      //         "suggested_new_deadline": "2025-01-17",
      //         "reasoning": "With 9 pending tasks and 4 pending bugs, the team has a heavy workload. Current logged time against total logged time indicates a potential shortfall in capacity to meet the original deadline."
      //       },
      //       "strategies_for_pending_work": {
      //         "risks": [
      //           "Task delays due to unresolved bugs",
      //           "Overestimated team capacity",
      //           "Resource allocation issues"
      //         ],
      //         "prioritization": "Focus on critical bugs first to enable smooth progression of pending tasks.",
      //         "methods": [
      //           "Implement a daily stand-up for progress updates",
      //           "Increase resource allocation temporarily",
      //           "Break down tasks into smaller components to facilitate quicker wins"
      //         ]
      //       },
      //       "performance_insights": {
      //         "total_effort_analysis": {
      //           "logged_time_ratio": "22.15/33.75",
      //           "time_efficiency": "65.7%"
      //         },
      //         "suggestions": [
      //           "Encourage more efficient time tracking practices",
      //           "Hold a retrospective to identify and address productivity barriers"
      //         ]
      //       },
      //       "optimization_and_risk_mitigation": {
      //         "bottlenecks": [
      //           "High number of pending tasks and bugs",
      //           "Insufficient allocation of logged hours per task"
      //         ],
      //         "solutions": [
      //           "Reassess team allocations and redistribute tasks based on individual strengths",
      //           "Introduce automation tools for testing to reduce bug resolution times"
      //         ]
      //       }
      //     }
      //   },
      //   {
      //     "milestone_name": "ca-erp prediction TWO",
      //     "deadline": "2025-01-03",
      //     "completed_tasks": 8,
      //     "pending_tasks": 8,
      //     "completed_bugs": 4,
      //     "pending_bugs": 4,
      //     "total_logged_time": "29 Hrs 15 Mins",
      //     "total_tasks_logged_time": "20 Hrs 0 Mins",
      //     "total_bugs_logged_time": "9 Hrs 15 Mins",
      //     "milestone_analysis": {
      //       "milestone_name": "ca-erp prediction TWO",
      //       "deadline": "2025-01-03",
      //       "deadline_predictions": {
      //         "is_at_risk": true,
      //         "suggested_new_deadline": "2025-01-17",
      //         "reasoning": "The status mirrors that of 'ca-erp prediction ONE' with multiple pending items. The team needs additional time to address similar risks."
      //       },
      //       "strategies_for_pending_work": {
      //         "risks": [
      //           "Similar risk factors as the previous milestone",
      //           "Potential burnout from resource strain",
      //           "Interdependencies with other milestones"
      //         ],
      //         "prioritization": "Address the most critical bugs first to facilitate task completion.",
      //         "methods": [
      //           "Perform resource reallocation to more strategic areas",
      //           "Enhance collaboration between teams to mitigate bottleneck risks",
      //           "Set clear, short-term goals to maintain motivation"
      //         ]
      //       },
      //       "performance_insights": {
      //         "total_effort_analysis": {
      //           "logged_time_ratio": "20.00/29.25",
      //           "time_efficiency": "68.3%"
      //         },
      //         "suggestions": [
      //           "Develop a more rigorous tracking mechanism for time spent on tasks and bugs",
      //           "Increase support on complex tasks where bottlenecks occur"
      //         ]
      //       },
      //       "optimization_and_risk_mitigation": {
      //         "bottlenecks": [
      //           "Similar complex dependency on bug resolution",
      //           "Strained team capacity"
      //         ],
      //         "solutions": [
      //           "Establish a bug-fix sprint with dedicated resources",
      //           "Consider outsourcing non-critical bugs for efficiency"
      //         ]
      //       }
      //     }
      //   },
      //   {
      //     "milestone_name": "Employee Portal Prediction ONE",
      //     "deadline": "2025-01-04",
      //     "completed_tasks": 9,
      //     "pending_tasks": 9,
      //     "completed_bugs": 4,
      //     "pending_bugs": 4,
      //     "total_logged_time": "36 Hrs 45 Mins",
      //     "total_tasks_logged_time": "20 Hrs 0 Mins",
      //     "total_bugs_logged_time": "16 Hrs 45 Mins",
      //     "milestone_analysis": {
      //       "milestone_name": "Employee Portal Prediction ONE",
      //       "deadline": "2025-01-04",
      //       "deadline_predictions": {
      //         "is_at_risk": true,
      //         "suggested_new_deadline": "2025-01-18",
      //         "reasoning": "Pending tasks and bugs are still high, and the overall logged effort does not align with the original schedule."
      //       },
      //       "strategies_for_pending_work": {
      //         "risks": [
      //           "High number of unresolved issues leading to project creep",
      //           "Potential misalignment of team focus",
      //           "Resource misallocation"
      //         ],
      //         "prioritization": "Address critical bugs that affect user experience as a priority, followed by high-impact tasks.",
      //         "methods": [
      //           "Enhance focus sessions for team members on critical tasks",
      //           "Implement pair programming for difficult tasks",
      //           "Regularly revisit progress to adjust work patterns"
      //         ]
      //       },
      //       "performance_insights": {
      //         "total_effort_analysis": {
      //           "logged_time_ratio": "20.00/36.75",
      //           "time_efficiency": "54.4%"
      //         },
      //         "suggestions": [
      //           "Introduce a more structured daily check-in to funnel communication",
      //           "Create a knowledge-sharing session for insights on bug resolution"
      //         ]
      //       },
      //       "optimization_and_risk_mitigation": {
      //         "bottlenecks": [
      //           "Overloaded pipelines for task completion",
      //           "Inadequate focus on high-risk areas"
      //         ],
      //         "solutions": [
      //           "Create dedicated task forces for high-risk areas",
      //           "Adjust timelines based on real-time feedback to better allocate resources"
      //         ]
      //       }
      //     }
      //   },
      //   {
      //     "milestone_name": "Employee Portal Prediction TWO",
      //     "deadline": "2025-01-04",
      //     "completed_tasks": 8,
      //     "pending_tasks": 8,
      //     "completed_bugs": 4,
      //     "pending_bugs": 4,
      //     "total_logged_time": "36 Hrs 0 Mins",
      //     "total_tasks_logged_time": "23 Hrs 30 Mins",
      //     "total_bugs_logged_time": "13 Hrs 30 Mins",
      //     "milestone_analysis": {
      //       "milestone_name": "Employee Portal Prediction TWO",
      //       "deadline": "2025-01-04",
      //       "deadline_predictions": {
      //         "is_at_risk": true,
      //         "suggested_new_deadline": "2025-01-18",
      //         "reasoning": "Similar challenges as the previous milestone make it necessary to extend the deadline to accommodate the pending workload."
      //       },
      //       "strategies_for_pending_work": {
      //         "risks": [
      //           "Similar to the first Employee Portal milestone",
      //           "Possible communication breakdowns",
      //           "Unclear team roles exacerbating confusion"
      //         ],
      //         "prioritization": "Focus on finishing the most impactful bugs first, then tackling the larger set of tasks.",
      //         "methods": [
      //           "Regular updates in team meetings to keep all aligned",
      //           "Using project management tools for clear visibility on progress",
      //           "Establish clear roles and responsibilities for better accountability"
      //         ]
      //       },
      //       "performance_insights": {
      //         "total_effort_analysis": {
      //           "logged_time_ratio": "23.50/36.00",
      //           "time_efficiency": "65.3%"
      //         },
      //         "suggestions": [
      //           "Review time spent on lower-impact items to minimize time sinks",
      //           "Encourage open feedback channels to quickly identify process improvements"
      //         ]
      //       },
      //       "optimization_and_risk_mitigation": {
      //         "bottlenecks": [
      //           "Pending bugs with unresolved dependencies",
      //           "Delays from past milestones affecting progressive work"
      //         ],
      //         "solutions": [
      //           "Implement agile methodologies to allow for iterative focus on deliverables",
      //           "Utilize Kanban for better visualization of work in progress"
      //         ]
      //       }
      //     }
      //   }
      // ]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);

    }
  };

  const getPredictionsDetails = async (id) => {
    setShowLoader(true);
    const url = `${Api.predictionDetails}?id=${id}`;
    const { data, error } = await AuthApi.getDataFromServer(url);

    // if (data?.data) {
    console.log("data", data.data[0]);

    if (data?.data) {
      // swal(data && data.message[0], '', 'success');
      console.log("data?.data?.reports", data?.data?.reports);
      setPredictions(data?.data[0]?.reports || []);
      setShowLoader(false);

    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);

    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="predictions-container">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title">Milestone Predictions</h2>
          <Breadcrumb items={items} />
        </div>
        <Loader showLoader={isShowLoader} needFullPage={false} />
        <Card className="prediction-card">
          {!id && (
            <Row>
              <Col>
                <Button onClick={(e) => {
                  getPredictions()
                }}>Predict</Button>
              </Col>
            </Row>
          )}

          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Get Forms details by Filters</h5>
            <Button
              variant="secondary"
              className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
              type="submit"
              onClick={(e) => {
                history.push('/predictions-details')
              }}
            >
              Back
            </Button>
          </div>
          <hr style={{ borderColor: "white" }} />
          <Row>
            {predictions.length > 0 ? (
              predictions.map((milestone, index) => (
                <>
                  <Col sm={6}>
                    <Card className="prediction-card" key={index}>
                      <div className="milestone-header">
                        <h3 className="milestone-title">{index + 1}.{milestone?.milestone_name}</h3>
                        <span className="status-badge">
                          {milestone?.milestone_analysis.deadline_predictions.is_at_risk
                            ? 'At Risk'
                            : 'On Track'}
                        </span>
                      </div>
                      <div className="milestone-details">
                        <p>
                          <strong>Deadline:</strong>{' '}
                          <span className="deadline-text">
                            {milestone?.deadline}
                          </span>
                        </p>
                        <p>
                          <strong>Completed Tasks:</strong> {milestone?.completed_tasks}
                        </p>
                        <p>
                          <strong>Pending Tasks:</strong> {milestone?.pending_tasks}
                        </p>
                        <p>
                          <strong>Total Logged Time:</strong>{' '}
                          {milestone?.total_logged_time}
                        </p>
                        <p>
                          <strong>Total Tasks Logged Time:</strong>{' '}
                          {milestone?.total_tasks_logged_time}
                        </p>
                        <p>
                          <strong>Total Bugs Logged Time:</strong>{' '}
                          {milestone?.total_bugs_logged_time}
                        </p>
                      </div>
                      <div className="milestone-analysis">
                        <h5>Analysis:</h5>
                        <p>
                          <strong>Suggested New Deadline:</strong>{' '}
                          {milestone?.milestone_analysis?.deadline_predictions?.suggested_new_deadline}
                        </p>
                        <p>
                          <strong>Reasoning:</strong>{' '}
                          {milestone?.milestone_analysis?.deadline_predictions?.reasoning}
                        </p>

                        <h5>Strategies for Pending Work:</h5>
                        <ul>
                          <strong>Risks:</strong>{' '}
                          {milestone?.milestone_analysis?.strategies_for_pending_work?.risks?.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />

                          <strong>Methods:</strong>{' '}
                          {milestone?.milestone_analysis?.strategies_for_pending_work?.methods?.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />
                          <strong>Prioritization:</strong>{' '}
                          {milestone?.milestone_analysis?.strategies_for_pending_work?.prioritization}
                        </ul>

                        <br />

                        <h5>Performance Insights:</h5>
                        <ul>
                          <strong>Total Effort Analysis:</strong>{' '}
                          <li>Logged Time Ratio: {milestone?.milestone_analysis?.performance_insights?.total_effort_analysis?.logged_time_ratio}</li>
                          <li>Time Efficiency: {milestone?.milestone_analysis?.performance_insights?.total_effort_analysis?.time_efficiency}</li>
                          <br />

                          <strong>Suggestions:</strong>{' '}
                          {milestone?.milestone_analysis?.performance_insights?.suggestions?.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                        </ul>

                        <h5>Optimization And Risk Mitigation:</h5>
                        <ul>
                          <strong>Bottlenecks:</strong>{' '}
                          {milestone?.milestone_analysis?.optimization_and_risk_mitigation?.bottlenecks?.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />

                          <strong>Solutions:</strong>{' '}
                          {milestone?.milestone_analysis?.optimization_and_risk_mitigation?.solutions?.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />

                        </ul>
                      </div>
                    </Card>
                  </Col>
                </>
              ))
            ) : (
              <p>No Data available for predictions.</p>
            )}
          </Row>
        </Card>
      </div>
    </>
  );
};

export default Predictions;
