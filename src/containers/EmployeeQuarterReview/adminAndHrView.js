/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form, Col, Row } from 'react-bootstrap';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';

const items = [{ to: '/employee-feedback', label: 'Employee Feedback' }, { label: 'Add Employee Feedback' }];

function AdminAndHrView() {
  const validator = useRef(new SimpleReactValidator({}));
  const state = useLocation();
  const { id } = useParams();
  const quarter = state?.state?.state?.quarter;
  const year = state?.state?.state?.year;
  const teamEmpId = state?.state?.state?.empId;
  const isViewOnly = state?.state?.state?.isViewOnly
  const isHr = state?.state?.state?.isHr
  const [employeeId, setEmployeeId] = useState()
  const [empDepartment, setEmpDepartment] = useState(state?.state?.state?.departmentId)
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false)
  const [avgRating, setAvgRating] = useState(0)
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
  const [selectedQuarter, setQuarter] = useState('');
  const [selectedStatus, setStatus] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const ratingOptions = [
    { id: "zero", label: "0", isCheck: false },
    { id: "1", label: "1", isCheck: false },
    { id: "2", label: "2", isCheck: false },
    { id: "3", label: "3", isCheck: false },
    { id: "4", label: "4", isCheck: false },
    { id: "5", label: "5", isCheck: false },]

  useEffect(() => {
    if (empDepartment) {
      getQuestionList();
    }
  }, [empDepartment])

  useEffect(() => {
    if (id && teamEmpId && empDepartment) {
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

  const allQuarters = [
    { label: 'April - June', value: 1 },
    { label: 'July - September', value: 2 },
    { label: 'October - December', value: 3 },
    { label: 'January - March', value: 4 },
  ]

  const allStatus = [
    { label: 'Completed', value: 1 },
    { label: 'Peanding', value: 2 }]

  console.log('selectedQuarter selectedStatus', selectedQuarter, selectedStatus);


  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.empFeedbackUrl}`;
    const params = {}
    console.log("employeeId && quarter && year", teamEmpId, quarter, year);

    if (teamEmpId && quarter && year) {
      params.employee = teamEmpId
      params.quarter = quarter
      params.year = year
    }

    if (empDepartment) {
      if (empDepartment == 1 || empDepartment == 2) {
        params.questionnaire_type = 1
      }
      else if (empDepartment == 6) {
        params.questionnaire_type = 2
      }
    }

    const url = customFunctions.generateUrl(endPoint, params);
    console.log("url", url);

    const { data, _ } = await AuthApi.getDataFromServer(url);

    let oldData = []
    let review_status = null
    let review_status_name = null
    let quarter_name = null
    let reviewer_name = ''
    let avg_rating = 0
    
    if (data && data.success) {

      review_status = data.data[0]?.review_status
      review_status_name = data.data[0]?.review_status_name
      quarter_name = data.data[0]?.quarter
      reviewer_name = data.data[0]?.reviewer_name
      avg_rating = data.data[0]?.average_rating

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
    setAvgRating(avg_rating)
    setStatus({ label: review_status_name, value: review_status })
    setQuarter({ label: quarter_name, value: quarter })
    setReviewerName(reviewer_name)
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

    if (empDepartment) {
      if (empDepartment == 1 || empDepartment == 2) {
        params.questionnaire_type = 1
      }
      else if (empDepartment == 6) {
        params.questionnaire_type = 2
      }
      else if (empDepartment == 3) {
        params.questionnaire_type = 3
      }
      else if (empDepartment == 4) {
        params.questionnaire_type = 4
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
          review_status: +selectedStatus?.value,
          quarter: +selectedQuarter?.value,
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
        history.push('/all-employees-reviews');
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

  const handleCheckboxChange = (event, item, isReviewer = false) => {
    if (isReviewer) {
      const data = [...questions];
      data[questions.indexOf(item)].reviewerRating = event;
      setQuestions(data);
    } else {
      const data = [...questions];
      data[questions.indexOf(item)].empRating = event;
      setQuestions(data);
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
    history.push('/all-employees-reviews');
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
              <h5 className="card-title mb-0 mt-2 ">Select Quarter and Review Status</h5>
              <Button
                variant="secondary"
                className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                type="submit"
                onClick={handleClear}
              >
                Back
              </Button>
            </div>
            <br />

            <Form onSubmit={handleSubmit}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm={2}>
                      <DropdownInput
                        label='Quarter'
                        options={allQuarters}
                        defaultValue={selectedQuarter}
                        onSelectHandler={(select) => {
                          setQuarter(select);
                        }}
                        disabled='true'
                      />
                    </Col>
                    <Col sm={2}>
                      <DropdownInput
                        label='Review Status'
                        options={allStatus}
                        defaultValue={selectedStatus}
                        onSelectHandler={(select) => {
                          setStatus(select);
                        }}
                        disabled={isViewOnly ? true : false}
                      />
                    </Col>
                    {isViewOnly && (<>
                      <Col sm={2}>
                        <Form.Label>
                          Reviewed By
                        </Form.Label>
                        <Form.Control
                          type='text'
                          value={reviewerName}
                          disabled='true'
                        />
                      </Col>
                      {avgRating && (<>
                      <Col sm={2}>
                        <Form.Label>
                          Reviewed By
                        </Form.Label>
                        <Form.Control
                          type='text'
                          value={avgRating}
                          disabled='true'
                        />
                      </Col>
                    </>)}
                    </>)}
                  </Row>
                </Card.Body>
              </Card>
              <Row>
                {questions?.map((item, index) => {
                  return <>
                      <Col sm={5}>
                    {index == 0 && (<>
                      <h5 className="card-title">Employee Feedback Form</h5>
                    </>
                    )}

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
                              disabled={isViewOnly ? true : false}
                  
                            />

                          </Form.Group>

                          {/* <Col md={5}> */}
                          <Form.Group controlId={`formRating${index + 1}`}>

                            <Form.Label>
                              Rating : <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="ms-lg-8 mt-lg-2">
                              {ratingOptions?.length > 0 &&
                                ratingOptions.map((option) => (
                                  <Form.Check
                                    inline
                                    key={option.value}
                                    type="radio"
                                    id={option.value}
                                    label={option.label}
                                    value={option.value}
                                    className="mb-2 form-radio"
                                    checked={item?.empRating == option.label}
                                    onChange={(e) => {
                                      handleCheckboxChange(option.label, item);
                                    }}
                                    disabled={isViewOnly ? true : false}
                                  />
                                ))}
                              {/* <p className='text-danger'>
                                {validator.current.message(
                                  'Rating',
                                  item?.rating,
                                  'required'
                                )}
                              </p> */}
                            </div>
                            {/* </Col> */}
                          </Form.Group>

                        </Card.Body>
                      </Card>
                    </Col>


                    <Col sm={5} >
                      {index == 0 && (<>

                        <h5 className="card-title">Reviewer Feedback Form</h5>

                      </>
                      )}
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
                              disabled={isViewOnly ? true : false}

                            />

                          </Form.Group>
                          <Form.Group controlId={`formRating${index + 1}`}>

                            <Form.Label>
                              Rating : <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="ms-lg-8 mt-lg-2">
                              {ratingOptions?.length > 0 &&
                                ratingOptions.map((option) => (
                                  <Form.Check
                                    inline
                                    key={option.value}
                                    type="radio"
                                    id={option.value}
                                    label={option.label}
                                    value={option.value}
                                    className="mb-2 form-radio"
                                    checked={item?.reviewerRating == option.label}
                                    onChange={(e) => {
                                      handleCheckboxChange(option.label, item, true);
                                    }}
                                    disabled={isViewOnly ? true : false}
                                  />
                                ))}
                              <p className='text-danger'>
                                {validator.current.message(
                                  'Rating',
                                  item?.rating,
                                  'required'
                                )}
                              </p>
                            </div>
                            {/* </Col> */}
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    </Col>

                  </>
                }
                )}
              </Row>
            </Form>
            <div className="d-flex justify-content-end p-2">
              {!isViewOnly && (
                <ButtonGroup className="gap-3 mt-6">
                  <Button
                    variant="secondary"
                    className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                    type="submit"
                    onClick={() => {
                      submitForm();
                    }}

                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    className="h4 m-0 text-black rounded-3"
                    onClick={handleClear}
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

export default withRouter(AdminAndHrView);