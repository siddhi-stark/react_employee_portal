/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form, Col, Row } from 'react-bootstrap';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';

const items = [{ to: '/employee-feedback', label: 'Employee Feedback' }, { label: 'Add Employee Feedback' }];

function AddEmployeeFeedback() {
  const validator = useRef(new SimpleReactValidator({}));
  const state = useLocation();
  const { id } = useParams();
  const quarter = state?.state?.state?.quarter;
  const year = state?.state?.state?.year;
  const teamEmpId = state?.state?.state?.empId;
  const isAdmins = state?.state?.state?.isAdmins
  const isHr = state?.state?.state?.isHr
  const [employeeId, setEmployeeId] = useState()
  const [empDepartment, setEmpDepartment] = useState()
  console.log('employeeId', employeeId);  
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false)
  const [questions, setQuestions] = useState([
    {
      questionnaire_id: '',
      employee_rating: '',
      employee_feedback: '',
    }
  ]);
  const [formData, setFormData] = useState({
    submission_date: '',
    review_status: 2,
    quarter: ''
  });
  console.log("id", id)
  useEffect(() => {
    setEmployeeId(localStorage.getItem('userId'))
    setEmpDepartment(localStorage.getItem('department'))
    setTitle('Add Employee Feedback');
  }, []);

  useEffect(()=>{
    if(empDepartment){
      getQuestionList();
    } 
  },[empDepartment])

  useEffect(() => {
    if (id && employeeId && empDepartment) {
      getUpdateData()
    }
  }, [id, employeeId, empDepartment])

  function getQuarterByString(value) {
    if (value == 'April - June') {
      return 1
    }
    else if (value == 'July - September') {
      return 2
    }
    else if (value == 'October - December') {
      return 3
    }
    else {
      return 4
    }
  }

  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.empFeedbackUrl}`;
    const params = {
      is_personal_feedback: true,
    };
    console.log("employeeId && quarter && year", teamEmpId, quarter, year);

    if (teamEmpId && quarter && year ) {
      params.employee = teamEmpId
      params.quarter = quarter
      params.year = year
    }
    
    if (empDepartment){
      if (empDepartment == 1 || empDepartment == 2){
        params.questionnaire_type = 1
      }
      else if(empDepartment == 6){
        params.questionnaire_type = 2
      }
    }

    const url = customFunctions.generateUrl(endPoint, params);
    console.log("url", url);

    const { data, _ } = await AuthApi.getDataFromServer(url);

    let oldData = []

    if (data && data.success) {
      data?.data.length > 0 && data.data.map((item, index) => {
        oldData.push({
          id: item.id,
          name: item?.questionnaire,
          questionnaire_id: item?.questionnaire_id,
          answer: item?.employee_feedback,
          empRating: item?.employee_rating,
          reviewerAnswer: item?.reviewer_feedback,
          reviewerRating: item?.reviewer_rating,
          submission_date: item?.submission_date,
          review_status: item?.review_status,
          quarter: String(getQuarterByString(item?.quarter))
        })
      })
    }
    console.log('oldData', oldData);
    
    setFormData(({
      ...formData,
      quarter: oldData?.length ? oldData[0]?.quarter : '',
      review_status: oldData?.length ? oldData[0]?.review_status : 2,

    }))
    if (oldData?.length && oldData[0].review_status == 1){
      setFieldsDisabled(true)
    }
    console.log("oldData", oldData);
    setQuestions(oldData)
    setShowLoader(false);
  }

  const getQuestionList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.questionUrl}`;
    const params = {
      show_all: 'true'
    };
    console.log("empDepartment", empDepartment);
    
    if (empDepartment){
      if (empDepartment == 1 || empDepartment == 2){
        params.questionnaire_type = 1
      }
      else if(empDepartment == 6){
        params.questionnaire_type = 2
      }
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setQuestions(data?.data?.map((item) => {
        return { ...item, answer: '', empRating: '' };
      }));
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const submitForm = async () => {
    setShowLoader(true);

    const questionData = [];
    questions?.length &&
      questions.forEach((item) => {
        const postData = {
          review_status: 2,
          quarter: +formData?.quarter,
          submission_date: customFunctions.getDate(new Date()),
        };

        if (item?.empRating) {
          postData.employee_rating = +item?.empRating;
        }

        if (item?.answer) {
          postData.employee_feedback = item?.answer;
        }
        if (item?.id && item?.questionnaire_id) {
          postData.id = +item?.id;
          postData.questionnaire = +item?.questionnaire_id;
        } else {
          postData.questionnaire_id = +item?.id;
        }
        if (item?.reviewerAnswer) {
          postData.reviewer_feedback = item?.reviewerAnswer
        }
        if (item?.reviewerRating) {
          postData.reviewer_rating = +item?.reviewerRating
        }

        questionData.push(postData);

      });
    let obj = null;
    if (questionData)
      obj = {
        'data': questionData,
      };

    let response = null
    if (!id) {
      response = await AuthApi.postDataToServer(Api.empFeedbackUrl, obj);
    } else {
      response = await AuthApi.putDataToServer(Api.empFeedbackUrl, obj);
    }

    const { data, message } = response;
    if (data) {
      swal(data.message[0], '', 'success').then(() => {        
        if (isAdmins){
          history.push('/employee-feedback-review-admins');
        }else if(isHr){
          history.push('/employee-feedback-review');
        }else{
          history.push('/employee-feedback');
        }

      });
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      submitForm();
    } else {
      setFormData({ ...formData });
      validator.current.showMessages();
    }
  };

  const handleClear = () => {
    setFormData({
      employee_rating: '',
      employee_feedback: '',
      submission_date: '',
      questionnaire_id: '',
      review_status: '',
      quarter: ''
    });
    // submitForm();
    // window.location.reload();
    validator.current.hideMessages();
    console.log('isAdmins', isAdmins, "isHr", isHr);

    if (isAdmins){
      history.push('/employee-feedback-review-admins');
    }else if(isHr){
      history.push('/employee-feedback-review');
    }else{
      history.push('/employee-feedback');
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Add Employee Feedback</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Add Feedback</h5>
            </div>
            <hr style={{ borderColor: "white" }} />
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0 mt-2 ">Select Quarter and Review Status</h5>
                </div>
                <hr style={{ borderColor: "white" }} />

                <Form onSubmit={handleSubmit}>
                  <Card>
                    <Card.Body>
                      <Row>

                        <Col sm={2}>
                          <Form.Group controlId='formQuestionnaire'>
                            <Form.Label>
                              Quarter <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              as='select'
                              name='quarter'
                              value={formData?.quarter}
                              onChange={(e) => {
                                const data = { ...formData };
                                data.quarter = e?.target?.value;
                                setFormData(data);
                              }}
                              disabled={fieldsDisabled}
                            >
                              <option value='' hidden>Select quarter type</option>
                              <option value='1'>April - June</option>
                              <option value='2'>July - September</option>
                              <option value='3'>October - December</option>
                              <option value='4'>January - March</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>

                        <Col sm={2}>
                          <Form.Group controlId='formQuestionnaire'>
                            <Form.Label>
                              Review Status <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              as='select'
                              name='review status'
                              value={formData?.review_status}
                              onChange={(e) => {
                                const data = { ...formData };
                                data.review_status = e?.target?.value;
                                setFormData(data);
                              }}
                              disabled='true'
                            >
                              <option value='' hidden>Select review status</option>
                              <option value='1'>Completed</option>
                              <option value='2'>Pending</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>

                      </Row>
                    </Card.Body>
                  </Card>
                  <Row>
                    {questions?.map((item, index) => {
                      return <>
                        {index == 0 && (<>
                          {/* <h4><b> Team Employee Feedback Form : </b></h4>
                          <br /> */}
                          {/* <div className="d-flex align-items-center justify-content-between"> */}
                            <h5 className="card-title">Team Employee Feedback Form</h5>
                          {/* </div> */}
                          {/* <hr style={{ borderColor: "white" }} /> */}
                        </>
                        )}

                        <Col sm={5}>
                          <Card>
                            <Card.Body>
                              <Form.Group controlId='formFirstName' key={index + 1}>
                                <Form.Label>
                                  {index + 1}. {item?.name}<span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as='textarea'
                                  style={{ height: '100px' }}
                                  type='text'
                                  placeholder='Enter answer'
                                  name='answer'
                                  value={item?.answer}
                                  onChange={(e) => {
                                    const data = [...questions];
                                    data[index].answer = e?.target?.value;
                                    setQuestions(data);
                                  }}
                                disabled={fieldsDisabled}
                                />

                              </Form.Group>
                              <Form.Group controlId={`formRating${index + 1}`}>
                                <Form.Label>
                                  Employee Rating <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as='select'
                                  name='employee_rating'
                                  value={item?.empRating}
                                  onChange={(e) => {
                                    const data = [...questions];
                                    data[index].empRating = e?.target?.value;
                                    setQuestions(data);
                                  }}
                                disabled={fieldsDisabled}

                                >
                                  <option value='' hidden>Select Rating</option>
                                  <option value='1'>1</option>
                                  <option value='2'>2</option>
                                  <option value='3'>3</option>
                                  <option value='4'>4</option>
                                  <option value='5'>5</option>
                                </Form.Control>
                              </Form.Group>
                            </Card.Body>
                          </Card>
                        </Col>


                        <Col sm={5} >
                          {index == 0 && (<>
                            {/* <h4><b> Reviewer Feedback Form : </b></h4>
                            <br />
                             */}
                            {/* <div className="d-flex align-items-center justify-content-between"> */}
                              <h5 className="card-title">Reviewer Feedback Form</h5>
                            {/* </div> */}
                            {/* <hr style={{ borderColor: "white" }} /> */}
                          </>
                          )}
                            <h5 className="card-title">     </h5>
                            <hr style={{ borderColor: "white" }} />

                          <Card>
                            <Card.Body>

                              <Form.Group controlId='formFirstName' key={index + 1}>
                                <Form.Label>
                                  {index + 1}. {item?.name}<span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as='textarea'
                                  style={{ height: '100px' }}
                                  type='text'
                                  placeholder='Enter answer'
                                  name='answer'
                                  value={item?.reviewerAnswer}
                                  onChange={(e) => {
                                    const data = [...questions];
                                    data[index].reviewerAnswer = e?.target?.value;
                                    setQuestions(data);
                                  }}
                                  disabled='true'
                                />

                              </Form.Group>
                              <Form.Group controlId={`formRating${index + 1}`}>
                                <Form.Label>
                                  Reviewer Rating <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as='select'
                                  name='employee_rating'
                                  value={item?.reviewerRating}
                                  onChange={(e) => {
                                    const data = [...questions];
                                    data[index].reviewerRating = e?.target?.value;
                                    setQuestions(data);
                                  }}
                                  disabled='true'
                                >
                                  <option value='' hidden>Select Rating</option>
                                  <option value='1'>1</option>
                                  <option value='2'>2</option>
                                  <option value='3'>3</option>
                                  <option value='4'>4</option>
                                  <option value='5'>5</option>
                                </Form.Control>
                              </Form.Group>
                            </Card.Body>
                          </Card>
                        </Col>

                      </>
                    }
                    )}
                  </Row>
                </Form>
              </Card.Body>
            </Card>
            <div className="d-flex justify-content-end p-2">
              {!fieldsDisabled && (
              <ButtonGroup className="gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                  type="submit"
                  onClick={() => {
                    submitForm();
                  }}
                  // disabled={fieldsDisabled}

                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  className="h4 m-0 text-black rounded-3"
                  onClick={handleClear}
                  // disabled={fieldsDisabled}
                >
                  Cancel
                </Button>
              </ButtonGroup>
              )}
            </div>
          </Card.Body>
        </Card>
      </section >
    </>
  );
}

export default withRouter(AddEmployeeFeedback);