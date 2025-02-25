/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Accordion, Badge, ListGroup, Container, Row, Col, Button } from 'react-bootstrap';
import Api from '../../helper/api';
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

const items = [{ to: '/', label: 'Home' }, { label: 'Interview Questions' }];

const InterviewQuestions = ({ applicant_id: propApplicantId }) => {
  const location = useLocation();
  const { state } = location;

  // Support both: prop and location state
  const applicantId = propApplicantId || state?.applicant_id;

  const [isShowLoader, setShowLoader] = useState(false);
  const [interviewData, setInterviewData] = useState({});
  const [resumeLink, setResumeLink] = useState();
  const [checkLength, setCheckLength] = useState([]);
  const [questionsReport, setQuestionsReport] = useState(false);
  const [allData, setAllData] = useState({});

  useEffect(() => {
    if (applicantId && !questionsReport) {
      fetchInterviewQuestions();
      getResumeData(applicantId);
    }
  }, [applicantId]);

  function checkTimeExceeds7Minutes(reportDateTime) {
    // Parse the ISO string to Date object (already in IST as indicated by +05:30)
    const reportTime = new Date(reportDateTime);

    // Get current time
    const currentTime = new Date();

    // Calculate difference in milliseconds
    const diffInMs = currentTime - reportTime;

    // Convert to minutes
    const diffInMinutes = diffInMs / (1000 * 60);

    // Check if difference is greater than 7 minutes
    return diffInMinutes > 7;
  };

  const getResumeData = async (profId) => {
    setShowLoader(true);
    let params = {
      is_professional_details: true,
    };
    const endpoint = `${Api.applicantsUrl}${profId}`;
    const url = customFunctions.generateUrl(endpoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data) {
      setShowLoader(false);
      setResumeLink(data?.data?.resume)
    } else {
      setShowLoader(false);
    }
  };

  const fetchInterviewQuestions = async () => {
    setShowLoader(true);
    const url = `${Api.interviewQuestionsUrl}1/?applicant_id=${applicantId}`;

    const { data, error } = await AuthApi.getDataFromServer(url);

    if (data?.success) {
      setShowLoader(false);
      setInterviewData(data.data.response);
      setCheckLength([data.data.response]);
      setAllData(data?.data);

    }
  };

  const generateQuestionsReport = async () => {
    setShowLoader(true);
    setQuestionsReport(true);

    const url = `${Api.interviewQuestionsUrl}`;
    const params = {
      applicant: +applicantId,
      input_file_url: resumeLink
    }


    const data = await AuthApi.postDataToServer(url, params);

    if (data?.data?.success === true) {
      setShowLoader(false);
      // setInterviewData(data.data.response);
      swal('Request stored successfully.', '', 'success');
      window.location.reload();
    } else {
      swal(data.message, '', 'error');
      setShowLoader(false);
    }
  }



  return (
    <>
      {/* <Breadcrumb items={items} /> */}
      {isShowLoader ? (
        <Loader />
      ) : (

        <Container fluid className="px-0">
          <br />

          {((checkTimeExceeds7Minutes(allData?.report_date_time) && !allData?.response) || (!allData?.applicant_id)) && (

            <Row>
              <Col>
                <Button onClick={(e) => {
                  generateQuestionsReport()
                }}>Generate Questions Reports</Button>
              </Col>
            </Row>
          )
          }
          <br />

          {/* Candidate Summary Section */}
          {checkLength?.length > 0 && allData?.response ? (
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Candidate Summary</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <p className="lead">{interviewData?.candidate_summary}</p>
                  </Col>
                  <Col md={4} className="border-left">
                    {interviewData?.extracted_information && (
                      <>
                        <div className="mb-3">
                          <h6 className="text-muted">Profile</h6>
                          <div className="d-flex flex-column">
                            <span className="mb-1"><strong>Role:</strong> {interviewData?.extracted_information?.primary_role}</span>
                            <span><strong>Level:</strong> {interviewData?.extracted_information?.experience_level}</span>
                          </div>
                        </div>

                        <div>
                          <h6 className="text-muted">Tech Stack</h6>
                          <div className="d-flex flex-wrap">
                            {interviewData?.extracted_information?.technology_stack.slice(0, 8).map((tech, index) => (
                              <Badge key={index} variant="secondary" className="mr-2 mb-2">
                                {tech}
                              </Badge>
                            ))}
                            {interviewData?.extracted_information?.technology_stack?.length > 8 && (
                              <Badge variant="info" className="mr-2 mb-2">
                                +{interviewData?.extracted_information?.technology_stack?.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (<>
            {
              allData?.status === 1 ? <>Data is in process please wait.</> : <>No Data Present, Please Click on "Generate Questions Report" to Generate Interview Questions.</>
            }
          </>
          )}

          {/* Interview Questions */}
          {checkLength?.length > 0 && allData?.response && (
            <>
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Interview Questions</h5>
                </Card.Header>
                <Card.Body className="p-0">

                  {interviewData && interviewData?.sections && (
                    <Accordion defaultActiveKey="0">
                      {interviewData?.sections.map((section, index) => (
                        <Card key={index} className="border-0">
                          <Accordion.Toggle
                            as={Card.Header}
                            eventKey={String(index)}
                            className="d-flex justify-content-between align-items-center bg-white border-bottom"
                          >
                            <span>{section?.section_title}</span>
                            <Badge variant="primary" pill>{section?.questions?.length}</Badge>
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey={String(index)}>
                            <Card.Body className="p-0">
                              <ListGroup variant="flush">
                                {section?.questions ? (
                                  section?.questions.map((q, i) => (
                                    <ListGroup.Item key={i} className="py-3">
                                      <div className="mb-2">
                                        <h6 className="mb-1 text-primary">{q.question_text}</h6>
                                        {q.notes && <small className="text-muted"><i>{q.notes}</i></small>}
                                      </div>
                                      <div className="px-3 py-2 bg-light rounded border-left border-primary">
                                        {q.answer}
                                      </div>
                                    </ListGroup.Item>
                                  ))
                                ) : section?.task ? (
                                  <ListGroup.Item>
                                    <div className="mb-2"><strong>Task</strong></div>
                                    <div>{section.task.task_description}</div>
                                    {section.task.notes && <div><small className="text-muted">Note: {section.task.notes}</small></div>}
                                  </ListGroup.Item>
                                ) : null}
                              </ListGroup>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      ))}
                    </Accordion>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      )}

    </>
  );
};

export default InterviewQuestions;
