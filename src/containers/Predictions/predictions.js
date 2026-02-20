/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button } from 'react-bootstrap';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory, useLocation } from 'react-router-dom';
import customFunctions from '../../helper/customFunctions';

const items = [{ to: '/', label: 'Home' }, { label: 'Milestone Predictions' }];

const Predictions = () => {
  const history = useHistory();
  const { state } = useLocation();

  const id = state?.state?.id
  const [isShowLoader, setShowLoader] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [title, setTitle] = useState('');

  const [generatedDate, setGeneratedDate] = useState()

  useEffect(() => {
    setTitle('Milestone Predictions');
    if (id) {
      getPredictionsDetails(id);
    }
  }, [id]);

  const getPredictions = async () => {
    setShowLoader(true);
    const url = `${Api.prediction}?use_ai=true`;
    const { data, error } = await AuthApi.getDataFromServer(url);
    if (data?.data) {
      swal(data && data.message[0], '', 'success');
      setShowLoader(false);
    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);

    }
  };

  const getPredictionsDetails = async (id) => {
    setShowLoader(true);
    const url = `${Api.predictionDetails}?id=${id}`;
    const { data, error } = await AuthApi.getDataFromServer(url);


    if (data?.data) {
      setShowLoader(false);
      if (data?.data[0]?.reports) {
        console.log("data?.data[0]", data?.data[0].generated_by);
        let reportDate = data?.data[0].generated_by
        console.log("reportDate", reportDate);

        const groupedMilestones = groupByProject(data?.data[0]?.reports);
        if (reportDate) {

          // Convert to a Date object
          const originalDate = new Date(reportDate);

          // Function to add days to a date
          function addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
          }

          // Add desired number of days
          const daysToAdd = 4; // Change this value as needed
          let newDate = addDays(originalDate, daysToAdd);
          reportDate = customFunctions.getDate(reportDate)
          newDate = customFunctions.getDate(newDate)

          let date = new Date(newDate);
          let orignalDate = new Date(reportDate);

          // Format the date
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Format the date
          orignalDate = orignalDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          setGeneratedDate(`${orignalDate} to ${formattedDate}`)
        }

        setPredictions(groupedMilestones || []);
      }

    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);

    }
  };

  const groupByProject = (milestones) => {
    return milestones.reduce((acc, milestone) => {
      // Check if the project_id already exists in the accumulator
      if (!acc[milestone.project_id]) {
        acc[milestone.project_id] = [];
      }
      // Push the milestone to the corresponding project_id group
      acc[milestone.project_id].push(milestone);
      return acc;
    }, {});
  };

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
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
            <h5 className="card-title mb-0 mt-2 ">Analysis of all milestones from {generatedDate}</h5>
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
            {Object.keys(predictions).length > 0 ? (
              Object.keys(predictions).map((projectId) => {
                const projectMilestones = predictions[projectId];
                const projectName = projectMilestones[0]?.project_name; // Assume all milestones in the group have the same project name
                const milestonePairs = chunkArray(projectMilestones, 2);

                return (
                  <div key={projectId}>
                    <h3 className="milestone-project-name">{projectName}</h3>
                    {milestonePairs.map((pair, rowIndex) => (
                      <Row key={rowIndex} className="mb-4">
                        {pair.map((milestone, colIndex) => (
                          <Col sm={6} key={colIndex}>
                            <Card className="prediction-card">
                              <div className="milestone-header">
                                <h3 className="milestone-title">
                                  {milestone?.milestone_name}
                                </h3>
                                <span
                                  className="status-badge"
                                  data-status={
                                    milestone?.milestone_analysis.deadline_predictions.is_at_risk
                                      ? "at-risk"
                                      : "on-track"
                                  }
                                >
                                  {milestone?.milestone_analysis.deadline_predictions.is_at_risk
                                    ? "At Risk"
                                    : "On Track"}
                                </span>
                              </div>
                              <div className="prediction-milestone-details">
                                <p>
                                  <strong>Deadline:</strong>{' '}
                                  <span className="prediction-deadline-text">{milestone?.deadline}</span>
                                </p>

                                <hr />
                                <p>
                                  <strong>Tasks:</strong>
                                  <ul>
                                    <li>Completed Tasks: {milestone?.completed_tasks}</li>
                                    <li>Pending Tasks: {milestone?.pending_tasks}</li>
                                  </ul>
                                </p>
                                <hr />

                                <p>
                                  <strong>Time:</strong>
                                  <ul>
                                    <li>Total Logged: {milestone?.total_logged_time}</li>
                                    <li>Total Tasks Logged: {milestone?.total_tasks_logged_time}</li>
                                    <li>Total Bugs Logged: {milestone?.total_bugs_logged_time}</li>
                                  </ul>
                                </p>
                              </div>

                              <div className="milestone-analysis">
                                <div className="highlighted-section">

                                  <h5>Analysis:</h5>
                                  <p>
                                    <strong>Suggested New Deadline:</strong>{' '}
                                    {milestone?.milestone_analysis?.deadline_predictions?.suggested_new_deadline}
                                  </p>
                                  <p>
                                    <strong>Reasoning:</strong>{' '}
                                    {milestone?.milestone_analysis?.deadline_predictions?.reasoning}
                                  </p>
                                </div>
                                <div className="highlighted-section">


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
                                </div>

                                <div className="highlighted-section">

                                  <h5>Performance Insights:</h5>
                                  <ul>
                                    <strong>Total Effort Analysis:</strong>{' '}
                                    <li>Logged Time Ratio: {milestone?.milestone_analysis?.performance_insights?.total_effort_analysis?.logged_time_ratio}</li>
                                    <li>Time Efficiency: {milestone?.milestone_analysis?.performance_insights?.total_effort_analysis?.time_efficiency}</li>
                                    <br />
                                  </ul>
                                </div>

                                <div className="milestone-analysis">
                                  <div className="highlighted-section">
                                    <h5>Suggestions:</h5>
                                    <ul>
                                      {milestone?.milestone_analysis?.performance_insights?.suggestions?.map(
                                        (method, idx) => (
                                          <li key={idx}>{method}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <div className="highlighted-section">
                                    <h5>Optimization And Risk Mitigation:</h5>
                                    <ul>
                                      <strong>Bottlenecks:</strong>
                                      {milestone?.milestone_analysis?.optimization_and_risk_mitigation?.bottlenecks?.map(
                                        (method, idx) => (
                                          <li key={idx}>{method}</li>
                                        )
                                      )}
                                      <strong>Solutions:</strong>
                                      {milestone?.milestone_analysis?.optimization_and_risk_mitigation?.solutions?.map(
                                        (method, idx) => (
                                          <li key={idx}>{method}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ))}
                  </div>
                );
              })
            ) : (
              <p>No Data available for predictions.</p>
            )}
          </Row>
        </Card>
      </div >
    </>
  );
};

export default Predictions;
