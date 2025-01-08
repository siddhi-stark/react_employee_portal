/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form, Col, Row, Tabs, Tab } from 'react-bootstrap';
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
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [totalLeaves, setTotalLeaveCount] = useState(0)
  const [count, forceUpdate] = useState(0)
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
  const [supervisonFeedback, setSupervisonFeedback] = useState('');
  const [empSubmitDate, setEmpSubmitDate] = useState('');

  const ratingOptions = [
    // { id: "zero", label: "0", isCheck: false },
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

  useEffect(() => {
    if (teamEmpId && selectedQuarter) {
      getEmployeeDetails();
      getLeavesdata();
    }
  }, [teamEmpId, selectedQuarter])

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
    { label: 'Pending', value: 2 }]


  const getLeavesdata = async () => {
    setShowLoader(true);
    const endPoint = `${Api.leavesDetailsUrl}`;
    const params = {
      // my_leaves: true,
      employee: teamEmpId
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are 0-indexed, so add 1

    let fyStart, fyEnd;

    if (month >= 4) { // April or later
      fyStart = year;
      fyEnd = year + 1;
    } else { // January to March
      fyStart = year - 1;
      fyEnd = year;
    }

    console.log("fyStart", fyStart);
    console.log("fyEnd", fyEnd);


    if (+selectedQuarter?.value == 1) {
      params.start_date = `${fyStart}-04-01`
      params.end_date = `${fyStart}-06-30`

    } else if (+selectedQuarter?.value == 2) {
      params.start_date = `${fyStart}-07-01`
      params.end_date = `${fyStart}-09-30`
    } else if (+selectedQuarter?.value == 3) {
      params.start_date = `${fyStart}-10-01`
      params.end_date = `${fyStart}-12-31`
    } else if (+selectedQuarter?.value == 4) {
      params.start_date = `${fyEnd}-01-01`
      params.end_date = `${fyEnd}-03-31`
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    let leaveCount = 0
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      // data.data.leave_count
      console.log("data?.data?.leave_count", data?.data?.leave_count);

      setTotalLeaveCount(data?.data?.leave_count?.leaves_count)
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const getEmployeeDetails = async () => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${teamEmpId}/`
    );

    if (data) {
      setShowLoader(false);
      setEmployeeDetails(data.data);

      // getEmployeeDocument(data.data && data.data.full_name);
    }
  };

  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.empFeedbackUrl}`;
    const params = {}

    if (teamEmpId && quarter && year) {
      params.employee = teamEmpId
      params.quarter = quarter
      params.year = year
    }

    if (empDepartment) {
      if (empDepartment == 1 || empDepartment == 2 || empDepartment == 9 || empDepartment == 8 || empDepartment == 7) {
        params.questionnaire_type = 1
      }
      else if (empDepartment == 6) {
        params.questionnaire_type = 3
      }
      else if (empDepartment == 3) {
        params.questionnaire_type = 3
      }
      else if (empDepartment == 4) {
        params.questionnaire_type = 4
      }
    }

    const url = customFunctions.generateUrl(endPoint, params);

    const { data, _ } = await AuthApi.getDataFromServer(url);

    let oldData = []
    let review_status = null
    let review_status_name = null
    let quarter_name = null
    let reviewer_name = ''
    let avg_rating = 0
    let created_at = ''

    if (data && data.success) {

      review_status = data.data[0]?.review_status
      review_status_name = data.data[0]?.review_status_name
      quarter_name = data.data[0]?.quarter
      reviewer_name = data.data[0]?.reviewer_name
      avg_rating = data.data[0]?.average_rating
      created_at = data.data[0]?.submission_date

      setSupervisonFeedback(data.data[0]?.supervison_feedback)

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
    setEmpSubmitDate(created_at)
    setQuestions(oldData)
    setShowLoader(false);
  }

  const getQuestionList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.questionUrl}`;
    const params = {
      show_all: 'true'
    };

    if (empDepartment) {
      if (empDepartment == 1 || empDepartment == 2 || empDepartment == 9 || empDepartment == 8 || empDepartment == 7) {
        params.questionnaire_type = 1
      }
      else if (empDepartment == 6) {
        params.questionnaire_type = 3
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
          review_status: 1,
          quarter: +selectedQuarter?.value,
          submission_date: customFunctions.getDate(new Date()),
          supervison_feedback: supervisonFeedback
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
                    {/* <Col sm={2}>
                      <DropdownInput
                        label='Review Status'
                        options={allStatus}
                        defaultValue={selectedStatus}
                        onSelectHandler={(select) => {
                          setStatus(select);
                        }}
                        disabled={isViewOnly ? true : false}
                      />
                    </Col> */}
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
                            Average Rating
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
                  <Row>
                    <div className="col-md-12">
                      <ul className="list-unstyled d-flex w-100 flex-wrap employeeDetailsInner">
                        <li className="p-0 border-bottom border-1 mx-2">
                          <label>
                            <strong>Rating scale:</strong>
                          </label>
                          <p>1.Unacceptable (fails to meet
                            standards)</p>
                          <p>2.Needs Improvement (Frequently fails to meet
                            standards)</p>
                          <p>3.Satisfactory (Generally meets standards)</p>
                          <p>4.Outstanding (Frequently exceeds
                            standards)</p>
                          <p>5.Excellent (Consistently exceeds standards)</p>
                        </li>
                      </ul>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
              <h5 className="card-title">Employee information</h5>
              <hr style={{ borderColor: "white" }} />
              <Card className="mt-3 mb-3 rounded-1 shadow-none employeeDetails">
                <Card.Body>
                  <Tabs
                    defaultActiveKey="personalInfo"
                  >
                    <Tab eventKey='personalInfo' title="Personal Details">
                      {employeeDetails && (
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <ul className="list-unstyled d-flex w-100 flex-wrap employeeDetailsInner">
                              <li className="p-0 border-bottom border-1 mx-2">
                                <label>
                                  <strong>Employee Name</strong>
                                </label>
                                <p>{employeeDetails?.full_name}</p>
                              </li>
                              <li className="p-0 border-bottom border-1 mt-3 mx-2">
                                <label>
                                  <strong>Email</strong>
                                </label>
                                <p>{employeeDetails?.email}</p>
                              </li>
                              <li className="p-0 border-bottom border-1 mx-2">
                                <label>
                                  <strong>Employee Code</strong>
                                </label>
                                <p>SDMS-{employeeDetails?.emp_code}</p>
                              </li>
                              <li className="p-0 border-bottom border-1 mt-3 mx-2">
                                <label>
                                  <strong>Employee Designation</strong>
                                </label>
                                <p>{employeeDetails?.designation_name}</p>
                              </li>
                              <li className="p-0 border-bottom border-1 mt-3 mx-2">
                                <label>
                                  <strong>Employee Department</strong>
                                </label>
                                <p>{employeeDetails.department_name}</p>
                              </li>
                              <li className="p-0 border-bottom border-1 mt-3 mx-2">
                                <label>
                                  <strong>Total Leaves in quarter</strong>
                                </label>
                                <p>{totalLeaves}</p>
                              </li>
                              <li className="p-0 border-bottom border-1 mt-3 mx-2">
                                <label>
                                  <strong>Date of self-assessment</strong>
                                </label>
                                <p>
                                  {empSubmitDate ? customFunctions.getDate(empSubmitDate) : customFunctions.getDate(new Date())}
                                </p>
                              </li>
                              <li className="p-0 border-bottom border-1 mt-3 mx-2">
                                <label>
                                  <strong>Supervisor Name</strong>
                                </label>
                                <p>
                                  {Array.isArray(employeeDetails?.assigned_managers)
                                    ? employeeDetails?.assigned_managers
                                      .map((manger) => manger?.name)
                                      .join(', ')
                                    : ' '}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
              <br />
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
                                    label={
                                      <span
                                        onClick={(e) => e.preventDefault()} // Prevent label click from changing state
                                      >
                                        {option.label}
                                      </span>
                                    }
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
                          <div>
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
                            <p className='text-danger'>
                              {validator.current.message(
                                'Review Answer',
                                item?.reviewerAnswer,
                                'required'
                              )}
                            </p>
                          </div>
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
                                    label={
                                      <span
                                        onClick={(e) => e.preventDefault()} // Prevent label click from changing state
                                      >
                                        {option.label}
                                      </span>
                                    }
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
                                  item?.reviewerRating,
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
              <div>

                <Form.Group controlId='formSupervision' key={10}>
                  <Form.Label>
                    Supervisor overall feedback<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    style={{ height: '100px' }}
                    type='text'
                    placeholder='Enter answer'
                    name='answer'
                    value={supervisonFeedback}
                    onChange={(e) => {
                      setSupervisonFeedback(e?.target?.value)
                    }}
                    disabled={isViewOnly ? true : false}

                  />

                </Form.Group>
                <Form.Group controlId={`formSupervision`}></Form.Group>
                <p className='text-danger'>
                  {validator.current.message(
                    'Supervisor overall feedback',
                    supervisonFeedback,
                    'required'
                  )}
                </p>
              </div>
            </Form>
            <div className="d-flex justify-content-end p-2">
              {!isViewOnly && (
                <ButtonGroup className="gap-3 mt-6">
                  <Button
                    variant="secondary"
                    className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                    type="submit"
                    onClick={() => {
                      console.log("validator.current", validator.current);
                      if (validator.current.allValid()) {

                        validator.current.hideMessages()
                        submitForm();

                      } else {
                        validator.current.showMessages()
                        forceUpdate(count + 1)
                      }
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