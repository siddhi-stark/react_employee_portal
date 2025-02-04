/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form, Col, Row, FormGroup } from 'react-bootstrap';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet, DropdownInput, Datepicker, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';


const items = [{ to: '/employee-feedback', label: 'Probation Reviewer Form' }, { label: 'Fill Probation Reviewer Form' }];

const ProbationForm = () => {

  const validator = useRef(new SimpleReactValidator());
  const state = useLocation();
  const history = useHistory();
  

  const reviewId = state?.state?.state?.reviewId;
  const reviewData = state?.state?.state?.reviewData;
  const employeeData = state?.state?.state?.employeeData;
  const revieweDate = state?.state?.state?.revieweDate;
  const trainingReviewerForm = state?.state.state?.probationReviewForm
  const isDisabled = state?.state.state?.isDisabled ? state?.state.state?.isDisabled : false
  const [title, setTitle] = useState('Fill Probation Reviewer Form');
  const [isShowLoader, setShowLoader] = useState(false);
  const [comments, setComments] = useState('')
  const [showAddPopUp, setAddPopUp] = useState(false)
  const [count, forceUpdate] = useState(0)
  const [selectedRatings, setRatings] = useState()
  const [selectedOnBasis, setOnBasis] = useState()
  const [selectTrainingExtended, setTrainingExtended] = useState()
  const [probationDetails, setProbationDetails] = useState()
  const [probationStart, setProbationStart] = useState()
  const [performanceRating, setPerformanceRating] = useState()
  const [empConfirmed, setEmpConfirmed] = useState()

  const [trainingPerformance, setTrainingPerformance] = useState('')
  const [technicalImprovements, setTechnicalImprovements] = useState('')
  const [focusArea, setFocusArea] = useState([])
  const [neededImprovements, setNeededImprovements] = useState('')
  const [overallFeedback, setOverallFeedback] = useState('')

  const [preparedData, setPreparedData] = useState({
    overall_rating: '',
    review_date: revieweDate,
    overall_feedback: '',
    question_first: '',
    question_second: '',
    question_third: '',
    training_period_extended: '',
    start_probation_period: '',
    employee_review: reviewId,
    review_period: ''
  })

  const yesOrNo = [
    { value: 1, label: "Yes", },
    { value: 0, label: "No", },
    // { value: 2, label: "Not Applicable", },
  ]

  const overallRatings = [
    { value: 1, label: "No scope of improvement", },
    { value: 2, label: "Scope of improvement", },
    { value: 3, label: "Good", },
    { value: 4, label: "Meet Expectations", },
    { value: 5, label: "Outstanding", },

  ]

  const reviewOnBasis = [
    { value: 1, label: "15 Days", },
    { value: 2, label: "1 Month", },
    { value: 3, label: "2 Month", },
    { value: 4, label: "Confirmation(3 Month)", },
    { value: 5, label: "Training Session", },]

  console.log("employeeData", employeeData);
  console.log("reviewData", reviewData);
  console.log("trainingReviewerForm", trainingReviewerForm);


  useEffect(() => {
    if (employeeData && reviewData && trainingReviewerForm) {
      getUpdateData()
    }
  }, [reviewData, reviewData])

  const getUpdateData = async () => {
    const id = trainingReviewerForm?.id
    const endPoint = `${Api.probationReviewerForm}${id}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setPreparedData(data?.data)
      const newData = data?.data;

      setFocusArea(newData?.question_first)
      setPerformanceRating(newData?.question_second)
      setTechnicalImprovements(newData?.question_third)
      setOverallFeedback(newData?.overall_feedback)
      setEmpConfirmed({ label: Number(newData?.is_employee_confirmed) === 1 ? "Yes" : "No", value: Number(newData?.is_employee_confirmed) })
      setTrainingExtended({ label: Number(newData?.training_period_extended) === 1 ? "Yes" : "No", value: Number(newData?.training_period_extended) })
      setProbationStart({ label: Number(newData?.start_probation_period) === 1 ? "Yes" : "No", value: Number(newData?.start_probation_period) })


      setOnBasis({ label: newData?.review_period_name, value: newData?.review_period })
      setRatings({ label: newData?.overall_rating_name, value: newData?.overall_rating })
      setTrainingPerformance(newData?.question_first)
      // setTechnicalImprovements(newData?.question_second)
      // setFocusArea(newData?.question_third)
      setNeededImprovements(newData?.question_four)
      // setOverallFeedback(newData?.overall_feedback)
      // setPerformanceRating(newData?.question_second)


      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }

  }

  const submitForm = async () => {
    setShowLoader(true)

    // focusArea 
    // performanceRating 
    // technicalImprovements


    preparedData["overall_rating"] = selectedRatings?.value
    preparedData["question_first"] = focusArea
    preparedData["question_second"] = performanceRating
    preparedData["question_third"] = technicalImprovements
    preparedData["overall_feedback"] = overallFeedback
    preparedData["training_period_extended"] = selectTrainingExtended?.value
    preparedData["start_probation_period"] = probationStart?.value
    preparedData["is_employee_confirmed"] = empConfirmed?.value
    preparedData["review_period"] = selectedOnBasis?.value

    console.log("preparedData", preparedData);

    let response = null
    if (trainingReviewerForm) {
      let id = trainingReviewerForm?.id
      delete preparedData["id"];
      let url = `${Api.probationReviewerForm}${id}/`
      response = await AuthApi.putDataToServer(url, preparedData);
    } else {
      response = await AuthApi.postDataToServer(Api.probationReviewerForm, preparedData);
    }
    let { data, message } = response;
    if (!message) {
      message = response?.data?.message
    }
    if (data) {
      if (trainingReviewerForm) {
        swal('Probation Reviewer Form details updated successfully.', '', 'success').then(() => {
          history.push('/employee-reviews');
        });
      }
      else {
        swal('Probation Reviewer Form details submited successfully.', '', 'success').then(() => {
          history.push('/employee-reviews');
        });
      }

    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Fill Probation Reviewer Form</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0 mt-2 "></h5>
        <Button
          variant="secondary"
          className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
          type="submit"
          onClick={() => {
            if (!isDisabled) {
              history.push('/employee-reviews');
            } else {
              history.push('/employee-reviews-details');
            }
          }}
        >
          Back
        </Button>
      </div>
      <hr style={{ borderColor: "white" }} />

      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>

          <Row>
            <Col sm={2}>
              <Form.Label>
                Employee Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type='text'
                value={employeeData?.full_name}
                disabled='true'
              />
            </Col>
            <Col sm={2}>
              <Form.Label>
                Employee Code <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type='text'
                value={`SDMS-${employeeData?.emp_code}`}
                disabled='true'
              />
            </Col>
            <Col sm={2}>
              <Form.Label>
                Employee Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type='text'
                value={employeeData?.email}
                disabled='true'
              />
            </Col>

            <Col sm={2}>
              <Form.Label>
                Date of Joining <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type='text'
                value={employeeData?.date_joined}
                disabled='true'
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm={2}>
              <Form.Label>
                Reviewer Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type='text'
                value={reviewData?.full_name}
                disabled='true'
              />
            </Col>
            <Col sm={2}>
              <Datepicker
                label="Review Date"
                asterisk="*"
                className="form-control w-100"
                name={"reviewDate"}
                placeholder={"Select month/year"}
                showMonthYearPicker={true}
                dateFormat={"dd/MM/yyyy"}
                // maxDate={new Date(new Date().setMonth(new Date().getMonth() - 1))}
                selected={new Date(revieweDate)}
                disabled={true}
                onChange={(date) => {
                  // setSetSelectedMonth(date);
                }}
              />
            </Col>
            <hr style={{ borderColor: "white" }} />
            <Row>
              <Col sm={4}>
                <DropdownInput
                  label="1. Review done on the basis of the"
                  asterisk="*"
                  options={reviewOnBasis}
                  defaultValue={selectedOnBasis}
                  onSelectHandler={(select) => {
                    setOnBasis(select)
                  }}
                  disabled={isDisabled}
                  errorMessage={validator.current.message(
                    'Review done on the basis of the',
                    selectedOnBasis,
                    'required'
                  )}
                />
              </Col>

              <Col sm={6}>
                <DropdownInput
                  label="2. Is the employee able to perform well in his/her probation?"
                  asterisk="*"
                  options={yesOrNo}
                  defaultValue={probationStart}
                  onSelectHandler={(select) => {
                    setProbationStart(select)
                  }}
                  disabled={isDisabled}
                  errorMessage={validator.current.message(
                    'Is the employee able to perform well in his/her probation?',
                    probationStart,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <TextInput
                  placeholder="Key skills and knowledge gained by him/her..."
                  label="3. Please share the key skills and knowledge the employee has gained during this period?"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={focusArea}
                  maxlength={255}
                  disabled={isDisabled}
                  onInputChange={(e) => {
                    setFocusArea(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'Please share the key skills and knowledge the employee has gained during this period?',
                    focusArea,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  placeholder="Rate the employee's performance on a scale of 1 to 5..."
                  label="4. On a scale of 1 to 5, how would you rate the Employee's performance"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={performanceRating}
                  maxlength={255}
                  disabled={isDisabled}
                  onInputChange={(e) => {
                    setPerformanceRating(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'On a scale of 1 to 5, how would you rate the Employees performance',
                    performanceRating,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  placeholder="Mention the areas where the employee can improve."
                  label="5. What are the areas of improvement?"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={technicalImprovements}
                  maxlength={255}
                  disabled={isDisabled}

                  onInputChange={(e) => {
                    setTechnicalImprovements(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'What are the areas of improvement?',
                    technicalImprovements,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  placeholder="Overall Feedback for him/her..."
                  label="6. Overall Feedback from Reviewer"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={overallFeedback}
                  maxlength={255}
                  disabled={isDisabled}

                  onInputChange={(e) => {
                    setOverallFeedback(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'Overall Feedback from Reviewer',
                    overallFeedback,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <DropdownInput
                  label="7. Is the probationary period extended?"
                  asterisk="*"
                  options={yesOrNo}
                  defaultValue={selectTrainingExtended}
                  onSelectHandler={(select) => {
                    setTrainingExtended(select)
                  }}
                  disabled={isDisabled}
                  errorMessage={validator.current.message(
                    'Is the probationary period extended?',
                    selectTrainingExtended,
                    'required'
                  )}
                />
              </Col>
              <Col sm={3}>
                <DropdownInput
                  label="8. Is the employee confirmed?"
                  asterisk="*"
                  options={yesOrNo}
                  defaultValue={empConfirmed}
                  onSelectHandler={(select) => {
                    setEmpConfirmed(select)
                  }}
                  disabled={isDisabled}
                  errorMessage={validator.current.message(
                    'Is the employee confirmed?',
                    empConfirmed,
                    'required'
                  )}
                />
              </Col>

            </Row>
          </Row>
          {!isDisabled && (
            <>
              <Button
                variant="secondary"
                className="bg-primary border-0 border-primary h4 m-2 text-white rounded-3"
                type="submit"
                // onClick={setAddPopUp(true)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (validator.current.allValid()) {
                    setAddPopUp(true);
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAddPopUp(false);
                  if (!isDisabled) {
                    history.push('/employee-reviews');
                  } else {
                    history.push('/employee-reviews-details');
                  }
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
      {showAddPopUp && (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to submit?"
          confirmBtnText="Submit"
          // confirmBtnBsStyle="blue"
          cancelBtnBsStyle="light"
          onConfirm={() => {
            submitForm();
            setAddPopUp(false)
          }}
          onCancel={() => {
            setAddPopUp(false)
          }}
        />
      )
      }
    </>
  )
}

export default ProbationForm;