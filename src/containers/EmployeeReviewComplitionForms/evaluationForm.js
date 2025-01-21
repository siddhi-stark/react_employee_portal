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



const items = [{ to: '/employee-feedback', label: 'Evaluation Form' }, { label: 'Fill Evaluation Form' }];

const EvaluationForm = () => {

    const validator = useRef(new SimpleReactValidator());
    const state = useLocation();
    const history = useHistory();

    const reviewId = state?.state?.state?.reviewId;
    const reviewData = state?.state?.state?.reviewData;
    const employeeData = state?.state?.state?.employeeData;
    const revieweDate = state?.state?.state?.revieweDate;
    const selfEvaluationForm = state?.state.state?.selfEvaluationForm
    const isDisabled = state?.state.state?.isDisabled ? state?.state.state?.isDisabled : false
    const [title, setTitle] = useState('Evaluation Form');
    const [isShowLoader, setShowLoader] = useState(false);
    const [targetsAchieved, setTargetsAchieved] = useState('')
    const [targetFailed, setTargetFailed] = useState('')
    const [comments, setComments] = useState('')
    const [showAddPopUp, setAddPopUp] = useState(false)
    const [count, forceUpdate] = useState(0)
    const [questions, setQuestions] = useState([])
    const [selectedEvaluation, setEvaluation] = useState()
    const [selectedOnBasis, setOnBasis] = useState()

    const [preparedData, setPreparedData] = useState({
        review_period: '',
        evaluation_criteria: '',
        communication_skills_rating: '',
        technical_skills_rating: '',
        attitude_rating: '',
        innovation_rating: '',
        work_ownership_rating: '',
        targets_achieved: '',
        target_failed_to_achieve: '',
        comments_or_suggestions: '',
        employee_review: reviewId,
        review_date: revieweDate
    })

    console.log("preparedData", preparedData);


    const ratingOptions = [
        { id: "1", label: "1", isCheck: false },
        { id: "2", label: "2", isCheck: false },
        { id: "3", label: "3", isCheck: false },
        { id: "4", label: "4", isCheck: false },
        { id: "5", label: "5", isCheck: false },]

    const evaluationCriteria = [
        { value: 1, label: "Unacceptable, I haven't seen enough from you in this category. Refer to the performance improvement plan.", isCheck: false },
        { value: 2, label: "Acceptable, You're meeting expectations. lets figure it out how can we improve even more.", isCheck: false },
        { value: 3, label: "Good, Your performance in this category is more than expected. Keep up the good work.", isCheck: false },
        { value: 4, label: "Outstanding, I have been more than impressed by your performance in this category.", isCheck: false },

    ]

    const reviewOnBasis = [
        { value: 1, label: "15 Days", isCheck: false },
        { value: 2, label: "1 Month", isCheck: false },
        { value: 3, label: "2 Month", isCheck: false },
        { value: 4, label: "Confirmation(3 Month)", isCheck: false },
        { value: 5, label: "Training Session", isCheck: false },]

    useEffect(() => {
        if (employeeData && reviewData && selfEvaluationForm) {
            getUpdateData()
        } else {
            setData()
        }
    }, [reviewData, reviewData])

    useEffect(() => {
        if (employeeData && reviewData && selfEvaluationForm && preparedData) {
            setUpdatedData()
        }
    }, [selfEvaluationForm, employeeData, reviewData, preparedData])

    const getUpdateData = async () => {
        const id = selfEvaluationForm?.id
        const endPoint = `${Api.selfEvaluationForm}${id}`;

        const url = customFunctions.generateUrl(endPoint);
        const { data, message } = await AuthApi.getDataFromServer(url);
        if (data && data.success) {
            setPreparedData(data?.data)
            const newData = data?.data;
            // console.log("Hello WOrld",newData);

            setEvaluation({ label: newData?.evaluation_criteria_name, value: newData?.evaluation_criteria })
            setOnBasis({ label: newData?.review_period_name, value: newData?.review_period })
            setTargetFailed(newData?.target_failed_to_achieve)
            setTargetsAchieved(newData?.targets_achieved)
            setComments(newData?.comments_or_suggestions)

            setShowLoader(false);
        } else {
            setShowLoader(false);
            swal(message, '', 'error', {
                closeOnClickOutside: false,
                allowOutsideClick: false,
            });
        }

    }

    const setUpdatedData = () => {

        const finalData = [
            {
                id: 1,
                question_type: "communication_skills_rating",
                question: "Rate your communication skills based on the requirements of your job.",
                rating: ''

            },
            {
                id: 2,
                question_type: "technical_skills_rating",
                question: "Rate how well your technical skills align with the requirements of your job.",
                rating: ''

            },
            {
                id: 3,
                question_type: "attitude_rating",
                question: "Rate your attitude towards work and your team members.",
                rating: ''

            },
            {
                id: 4,
                question_type: "innovation_rating",
                question: "Rate your ability to innovate and enhance your performance.",
                rating: ''

            },
            {
                id: 5,
                question_type: "work_ownership_rating",
                question: "Rate your sense of ownership in your work.",
                rating: ''
            }

        ]
        finalData.forEach((question) => {
            const { question_type, rating } = question;
            if (question_type in preparedData) {
                console.log("question_type", question_type);
                console.log("preparedData.question_type", preparedData[question_type]);
                question.rating = parseInt(preparedData[question_type], 10); // Convert rating to a number
            }
        });

        console.log("finalData", finalData);

        setQuestions(finalData)
    }

    const setData = () => {

        const finalData = [
            {
                id: 1,
                question_type: "communication_skills_rating",
                question: "Rate your communication skills based on the requirements of your job.",
                rating: ''

            },
            {
                id: 2,
                question_type: "technical_skills_rating",
                question: "Rate how well your technical skills align with the requirements of your job.",
                rating: ''

            },
            {
                id: 3,
                question_type: "attitude_rating",
                question: "Rate your attitude towards work and your team members.",
                rating: ''

            },
            {
                id: 4,
                question_type: "innovation_rating",
                question: "Rate your ability to innovate and enhance your performance.",
                rating: ''

            },
            {
                id: 5,
                question_type: "work_ownership_rating",
                question: "Rate your sense of ownership in your work.",
                rating: ''
            }

        ]
        setQuestions(finalData)
    }

    const handleCheckboxChange = (event, item) => {
        const data = [...questions];
        data[questions.indexOf(item)].rating = event;
        setQuestions(data);
    };

    const submitForm = async () => {
        setShowLoader(true)
        questions.forEach((question) => {
            const { question_type, rating } = question;
            if (question_type in preparedData) {
                preparedData[question_type] = parseInt(rating, 10); // Convert rating to a number
            }
        });

        preparedData['comments_or_suggestions'] = comments
        preparedData['evaluation_criteria'] = selectedEvaluation?.value
        preparedData['review_period'] = selectedOnBasis?.value
        preparedData['target_failed_to_achieve'] = targetFailed
        preparedData['targets_achieved'] = targetsAchieved

        let response = null
        if (selfEvaluationForm) {
            let id = selfEvaluationForm?.id
            delete preparedData["id"];
            let url = `${Api.selfEvaluationForm}${id}/`
            response = await AuthApi.putDataToServer(url, preparedData);
        } else {
            response = await AuthApi.postDataToServer(Api.selfEvaluationForm, preparedData);
        }
        let { data, message } = response;
        if (!message) {
            message = response?.data?.message
        }
        if (data) {
            if (selfEvaluationForm) {
                swal('Self Evaluation Form details updated successfully.', '', 'success').then(() => {
                    history.push('/employee-reviews');
                });
            }
            else {
                swal('Self Evaluation Form details submited successfully.', '', 'success').then(() => {
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
                <h2 className="main-content-title tx-24 mg-b-5">Fill Evaluation Form</h2>
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
                        <Row>
                            <Col>
                                <div className="col-md-12">
                                    <ul className="list-unstyled d-flex w-100 flex-wrap employeeDetailsInner">
                                        <li className="p-0 border-bottom border-1 mx-2">
                                            <label>
                                                <strong>Evaluation Criteria:</strong>
                                            </label>
                                            <p>1.Unacceptable, I haven't seen enough from you in this category. Refer to the performance improvement plan.</p>
                                            <p>2.Acceptable, You're meeting expectations. lets figure it out how can we improve even more.</p>
                                            <p>3.Good, Your performance in this category is more than expected. Keep up the good work.</p>
                                            <p>4.Outstanding, I have been more than impressed by your performance in this category.</p>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>

                        <br/>

                        <hr style={{ borderColor: "white" }} />

                        <Row>

                            {/* <DropdownInput
                                label="1. Evaluation Criteria"
                                asterisk="*"
                                options={evaluationCriteria}
                                defaultValue={selectedEvaluation}
                                onSelectHandler={(select) => {
                                    setEvaluation(select)
                                }}
                                disabled={isDisabled}
                                errorMessage={validator.current.message(
                                    'Evaluation Criteria',
                                    selectedEvaluation,
                                    'required'
                                )}
                            /> */}

                            <Col>
                                <DropdownInput
                                    label="2. Review done on the basis of the"
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
                                <br />
                                <TextInput
                                    placeholder="Targets achieved by him/her..."
                                    label="3. Targets achieved"
                                    asterisk="*"
                                    type="text"
                                    as="textarea"
                                    rows="5"
                                    value={targetsAchieved}
                                    maxlength={255}
                                    onInputChange={(e) => {
                                        setTargetsAchieved(e.target.value);
                                    }}
                                    disabled={isDisabled}

                                    errorMessage={validator.current.message(
                                        'Targets achieved',
                                        targetsAchieved,
                                        'required'
                                    )}
                                />
                                <br />
                                <TextInput
                                    placeholder="Targets failed achieved by him/her..."
                                    label="4. Target failed to achieve"
                                    asterisk="*"
                                    type="text"
                                    as="textarea"
                                    rows="5"
                                    value={targetFailed}
                                    maxlength={255}
                                    onInputChange={(e) => {
                                        setTargetFailed(e.target.value);
                                    }}
                                    disabled={isDisabled}

                                    errorMessage={validator.current.message(
                                        'Target failed to achieve',
                                        targetFailed,
                                        'required'
                                    )}
                                />
                                <br />
                                <TextInput
                                    placeholder="Comments or Suggestions for him/her..."
                                    label="5. Additional comments or suggestions"
                                    asterisk="*"
                                    type="text"
                                    as="textarea"
                                    rows="5"
                                    value={comments}
                                    maxlength={255}
                                    onInputChange={(e) => {
                                        setComments(e.target.value);
                                    }}
                                    disabled={isDisabled}
                                    errorMessage={validator.current.message(
                                        'Additional comments or suggestions',
                                        targetFailed,
                                        'required'
                                    )}
                                />
                                <br />
                            </Col>
                            <Col>
                                {questions.map((item, index) => (
                                    <Form.Group controlId={`formItem${item.id}`} key={item.id}>

                                        <Form.Label>
                                            {`${5 + (index + 1)}.`} {item?.question} <span className="text-danger">*</span>
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
                                                        checked={item?.rating == option.label}
                                                        onChange={(e) => {
                                                            handleCheckboxChange(option.label, item);

                                                        }}
                                                        disabled={isDisabled}
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
                                    </Form.Group>
                                ))}
                            </Col>
                        </Row>
                    </Row>
                    {
                        !isDisabled && (
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
                        )
                    }
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

export default EvaluationForm;