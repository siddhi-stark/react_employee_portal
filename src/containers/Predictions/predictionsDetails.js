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
import { useHistory } from 'react-router-dom';

const items = [{ to: '/', label: 'Home' }, { label: 'Milestone Predictions' }];

const PredictionsDetails = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState('');
  const [isProjectManager, setProjectManager] = useState(false);

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);

  useEffect(() => {
    setTitle('Milestone Predictions');
    if (userRole) {
      // getPredictions();
      
    }
  }, [userRole]);

  useEffect(() => {
    setTitle('Milestone Predictions');
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  const columns = [
    
  ]

  const getPredictions = async () => {
    setShowLoader(true);
    const url = `${Api.prediction}?use_ai=true`;
    const { data, error } = await AuthApi.getDataFromServer(url);

    // if (data?.data) {
    if (data?.data) {
      swal(data && data.message[0], '', 'success');
      // setPredictions(data.data.milestone_details || []);
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
          <Row>
            <Col>
              <Button onClick={(e) => {
                getPredictions()
              }}>Predict</Button>
            </Col>
          </Row>
          <hr />
          <Row>
            {predictions.length > 0 ? (
              predictions.map((milestone, index) => (
                <>
                  <Col sm={6}>
                    <Card className="prediction-card" key={index}>
                      <div className="milestone-header">
                        <h3 className="milestone-title">{index + 1}.{milestone.milestone_name}</h3>
                        <span className="status-badge">
                          {milestone.milestone_analysis.deadline_predictions.is_at_risk
                            ? 'At Risk'
                            : 'On Track'}
                        </span>
                      </div>
                      <div className="milestone-details">
                        <p>
                          <strong>Deadline:</strong>{' '}
                          <span className="deadline-text">
                            {milestone.deadline}
                          </span>
                        </p>
                        <p>
                          <strong>Completed Tasks:</strong> {milestone.completed_tasks}
                        </p>
                        <p>
                          <strong>Pending Tasks:</strong> {milestone.pending_tasks}
                        </p>
                        <p>
                          <strong>Total Logged Time:</strong>{' '}
                          {milestone.total_logged_time}
                        </p>
                        <p>
                          <strong>Total Tasks Logged Time:</strong>{' '}
                          {milestone.total_tasks_logged_time}
                        </p>
                        <p>
                          <strong>Total Bugs Logged Time:</strong>{' '}
                          {milestone.total_bugs_logged_time}
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
                          {milestone.milestone_analysis.strategies_for_pending_work.risks.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />

                          <strong>Methods:</strong>{' '}
                          {milestone.milestone_analysis.strategies_for_pending_work.methods.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />
                          <strong>Prioritization:</strong>{' '}
                          {milestone.milestone_analysis.strategies_for_pending_work.prioritization}
                        </ul>

                        <br />

                        <h5>Performance Insights:</h5>
                        <ul>
                          <strong>Total Effort Analysis:</strong>{' '}
                          <li>Logged Time Ratio: {milestone?.milestone_analysis?.performance_insights?.total_effort_analysis?.logged_time_ratio}</li>
                          <li>Time Efficiency: {milestone?.milestone_analysis?.performance_insights?.total_effort_analysis?.time_efficiency}</li>
                          <br />

                          <strong>Suggestions:</strong>{' '}
                          {milestone?.milestone_analysis?.performance_insights?.suggestions.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                        </ul>

                        <h5>Optimization And Risk Mitigation:</h5>
                        <ul>
                          <strong>Bottlenecks:</strong>{' '}
                          {milestone.milestone_analysis.optimization_and_risk_mitigation.bottlenecks.map(
                            (method, idx) => (
                              <li key={idx}>{method}</li>
                            )
                          )}
                          <br />

                          <strong>Solutions:</strong>{' '}
                          {milestone.milestone_analysis.optimization_and_risk_mitigation.solutions.map(
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

export default PredictionsDetails;
