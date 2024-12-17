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


const items = [{ to: '/employee-feedback', label: 'Training Reviewer Form' }, { label: 'Fill Training Reviewer Form' }];

const TrainingReviewerForm = () => {

  const validator = useRef(new SimpleReactValidator());
  const state = useLocation();
  const history = useHistory();

  const reviewId = state?.state?.state?.reviewId;
  const reviewData = state?.state?.state?.reviewData;
  const employeeData = state?.state?.state?.employeeData;
  const revieweDate = state?.state?.state?.revieweDate;
  const trainingReviewerForm = state?.state.state?.trainingReviewerForm
  const [title, setTitle] = useState('Fill Training Reviewer Form');
  const [isShowLoader, setShowLoader] = useState(false);
  const [comments, setComments] = useState('')
  const [showAddPopUp, setAddPopUp] = useState(false)
  const [count, forceUpdate] = useState(0)
  const [selectedRatings, setRatings] = useState()
  const [selectedOnBasis, setOnBasis] = useState()
  const [selectTrainingExtended, setTrainingExtended] = useState()
  const [probationStart, setProbationStart] = useState()
  
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
    question_four: '',
    training_period_extended: '',
    start_probation_period: '',
    employee_review: reviewId,
    review_period:''    
  })

  const yesOrNo = [
    { value: 1, label: "Yes", },
    { value: 0, label: "No", },
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

  useEffect(() => {
    if (employeeData && reviewData && trainingReviewerForm) {
      getUpdateData()
    }
  }, [reviewData, reviewData])

  const getUpdateData = async () => {
    const id = trainingReviewerForm?.id
    const endPoint = `${Api.trainingReviewerForm}${id}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setPreparedData(data?.data)
      const newData = data?.data;
      setOnBasis({ label: newData?.review_period_name, value: newData?.review_period })
      setRatings({ label: newData?.overall_rating_name, value: newData?.overall_rating })
      setTrainingPerformance(newData?.question_first)
      setTechnicalImprovements(newData?.question_second)
      setFocusArea(newData?.question_third)
      setNeededImprovements(newData?.question_four)
      setOverallFeedback(newData?.overall_feedback)
      setTrainingExtended({label:Number(newData?.training_period_extended) === 1 ? "Yes" : "No" ,value:Number(newData?.training_period_extended)})
      setProbationStart({label:Number(newData?.start_probation_period) === 1 ? "Yes" : "No" ,value:Number(newData?.start_probation_period)})
      
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
    preparedData["overall_rating"] = selectedRatings?.value
    preparedData["overall_feedback"] = overallFeedback
    preparedData["question_first"] =   trainingPerformance
    preparedData["question_second"] = technicalImprovements
    preparedData["question_third"] = neededImprovements
    preparedData["question_four"] = neededImprovements
    preparedData["training_period_extended"] = selectTrainingExtended?.value
    preparedData["start_probation_period"] = probationStart?.value
    preparedData["review_period"] = selectedOnBasis?.value

    console.log("preparedData", preparedData);
    
    let response = null
    if (trainingReviewerForm) {
      let id = trainingReviewerForm?.id
      delete preparedData["id"];
      let url = `${Api.trainingReviewerForm}${id}/`
      response = await AuthApi.putDataToServer(url, preparedData);
    } else {
      response = await AuthApi.postDataToServer(Api.trainingReviewerForm, preparedData);
    }
    let { data, message } = response;
    if (!message) {
      message = response?.data?.message
    }
    if (data) {
      if (trainingReviewerForm) {
        swal('Training Reviewer Form details updated successfully.', '', 'success').then(() => {
          history.push('/employee-reviews');
        });
      }
      else {
        swal('Training Reviewer Form details submited successfully.', '', 'success').then(() => {
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
        <h2 className="main-content-title tx-24 mg-b-5">Fill Training Reviewer Form</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0 mt-2 "></h5>
        <Button
          variant="secondary"
          className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
          type="submit"
          onClick={() => {
            history.push('/employee-reviews');
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
              <Col sm={3}>
                <DropdownInput
                  label="1. Overall Ratings"
                  asterisk="*"
                  options={overallRatings}
                  defaultValue={selectedRatings}
                  onSelectHandler={(select) => {
                    setRatings(select)
                  }}
                  disabled={false}
                  errorMessage={validator.current.message(
                    'Overall Ratings',
                    selectedRatings,
                    'required'
                  )}
                />
              </Col>
              <Col sm={3}>
                <DropdownInput
                  label="2. Review done on the basis of the"
                  asterisk="*"
                  options={reviewOnBasis}
                  defaultValue={selectedOnBasis}
                  onSelectHandler={(select) => {
                    setOnBasis(select)
                  }}
                  disabled={false}
                  errorMessage={validator.current.message(
                    'Review done on the basis of the',
                    selectedOnBasis,
                    'required'
                  )}
                />
              </Col>
              <Col sm={3}>
                <DropdownInput
                  label="3. Is the training period extended?"
                  asterisk="*"
                  options={yesOrNo}
                  defaultValue={selectTrainingExtended}
                  onSelectHandler={(select) => {
                    setTrainingExtended(select)
                  }}
                  disabled={false}
                  errorMessage={validator.current.message(
                    'Is the training period extended?',
                    selectTrainingExtended,
                    'required'
                  )}
                />
              </Col>
              <Col sm={5}>
                <DropdownInput
                  label="4. Should we start the probation period for 3 months?"
                  asterisk="*"
                  options={yesOrNo}
                  defaultValue={probationStart}
                  onSelectHandler={(select) => {
                    setProbationStart(select)
                  }}
                  disabled={false}
                  errorMessage={validator.current.message(
                    'Should the probation period begin for three months?',
                    probationStart,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <hr style={{ borderColor: "white" }} />
            <Row>
              <Col sm={6}>
                <TextInput
                  placeholder="Targets achieved by him/her..."
                  label="5. Is the employee performing well in their training?"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={trainingPerformance}
                  maxlength={255}
                  onInputChange={(e) => {
                    setTrainingPerformance(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'Is the employee performing well in their training?',
                    trainingPerformance,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  placeholder="Technical Improvements by him/her..."
                  label="6. What technical skills does the employee need to improve?"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={technicalImprovements}
                  maxlength={255}
                  onInputChange={(e) => {
                    setTechnicalImprovements(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'What technical skills does the employee need to improve?',
                    technicalImprovements,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <TextInput
                  placeholder="Focus needed on points by him/her..."
                  label="7. What areas is the employee spending too much time on, and what areas should they focus more on?"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={neededImprovements}
                  maxlength={255}
                  onInputChange={(e) => {
                    setNeededImprovements(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'What areas is the employee spending too much time on, and what areas should they focus more on?',
                    neededImprovements,
                    'required'
                  )}
                />
              </Col>
              <br />
              <Col sm={6}>
                <TextInput
                  placeholder="Focus needed on points by him/her..."
                  label="8. What are the most important things the employee has learned during this period?"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={focusArea}
                  maxlength={255}
                  onInputChange={(e) => {
                    setFocusArea(e.target.value);
                  }}
                  errorMessage={validator.current.message(
                    'What are the most important things the employee has learned during this period?',
                    focusArea,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <TextInput
                  placeholder="Overall Feedback for him/her..."
                  label="9. Overall Feedback from Reviewer"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={overallFeedback}
                  maxlength={255}
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
          </Row>
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
              history.push('/employee-reviews');
            }}
          >
            Cancel
          </Button>
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

export default TrainingReviewerForm;