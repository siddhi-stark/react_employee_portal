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
import SweetAlert from 'react-bootstrap-sweetalert';


const items = [{ to: '/employee-feedback', label: 'Employee KRA-KPI' }, { label: 'Fill KRA-KPI' }];

const AddKraKpi = () => {
  const validator = useRef(new SimpleReactValidator());
  const state = useLocation();
  const { id } = useParams();
  const feedbackId = state?.state?.state?.feedbackId;
  const feddbackCreatedDate = state?.state?.state?.feddbackCreatedDate;
  const toUserId = state?.state?.state?.toUserId;
  const toUserName = state?.state?.state?.toUserName;
  const [employeeId, setEmployeeId] = useState()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState();
  const [empDepartment, setEmpDepartment] = useState()
  const [departments, setDepartments] = useState()
  const [position, setPosition] = useState()
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false)
  const [refereshPage, setRefereshPage] = useState(false);
  const [allEmployes, setAllEmployes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [showTable, setshowTable] = useState(false)
  const [userRole, setUserRole] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewedByName, setReviewedByName] = useState(0);
  const [isViewOnly, setViewOnly] = useState(false)
  const [showAddPopUp, setAddPopUp] = useState(false)
  const [count, forceUpdate] = useState(0)
  const [message, setMessage] = useState('')

  const [questions, setQuestions] = useState([
    {
      rating: 0,
      review: '',
      note: ''
    }
  ]);
  console.log('questions', questions);

  const [formData, setFormData] = useState({
    departments: '',
    position_level: '',
  });

  useEffect(() => {
    setEmployeeId(localStorage.getItem('userId'))
    setEmpDepartment(localStorage.getItem('department'))
    setTitle('Fill KRA-KPI');
  }, []);

  function getCategoryById(categoryId) {
    let categoryName = ''
    if (!categoryName) {
      questions && questions.map((item) => {
        if (item?.category === Number(categoryId)) {

          categoryName = item?.category_name
        }
      })
    }
    if (categoryName) {
      return categoryName
    }
  }
  console.log('feedbackId', feedbackId);

  useEffect(() => {
    if (feedbackId && employeeId && empDepartment) {
      getUpdateData()
      setViewOnly(true)
      setFieldsDisabled(true)
    }
  }, [feedbackId, employeeId, empDepartment])

  useEffect(() => {
    if (!feedbackId && employeeId && empDepartment) {
      getKraKpiDetails()
      setViewOnly(false)
      setFieldsDisabled(true)
    }
  }, [employeeId, empDepartment])

  useEffect(() => {
    if (userRole && departments && !isViewOnly) {
      getEmployeeName();
      setSelectedEmployee('')
      setQuestions('')

    }
  }, [userRole, departments]);

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  const getEmployeeName = async () => {
    const uRole = customFunctions.getLocalStorage('group');
    console.log('isEmployee', uRole);
    let url = ''
    setShowLoader(true);
    if ([3, 4].includes(userRole)) {
      url = `${Api.employeeListUrl}?for_kra_kpi=1&is_dropdown=true&department_id=${departments}`
    } else {
      url = `${Api.employeeUrl}?type=all&status=active&hide_admin=1&department_id=${departments}`;
    }

    const { data, error } = await AuthApi.getDataFromServer(url);
    setShowLoader(false);

    if (data && data.success) {
      const allemp = data.data.map((item) => ({
        label: item.full_name,
        value: item.id,
        joiningDate: item.date_joined,
      }));

      setAllEmployes([...allemp]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  const getUpdateData = async () => {
    console.log('inside update function');

    setShowLoader(true);
    const endPoint = `${Api.kraKpiUrl}`;
    const params = {
      user: toUserId,
      start_date: feddbackCreatedDate ? customFunctions.getDate(feddbackCreatedDate) : '',
      show_table: true,
    };

    const url = customFunctions.generateUrl(endPoint, params);
    console.log("url", url);

    const { data, _ } = await AuthApi.getDataFromServer(url);

    let oldData = []
    let department = null
    let department_name = null
    let positionLevel = null
    let averageRating = 0
    let reviewedBy = ''

    console.log('data?.data[0]', data?.data);

    if (data && data.success) {
      averageRating = data?.data[0]?.average_rating ? data?.data[0]?.average_rating : 0
      data?.data[0]?.kra_kpi.length > 0 && data.data[0].kra_kpi.map((item) => {
        console.log('sssss', item);
        department = item?.departments[0]
        department_name = item?.department_names[0]
        positionLevel = item?.position_level
        reviewedBy = item?.reviewed_by
        oldData.push({
          id: item.id,
          rating: item?.rating,
          review: item?.review,
          note: item?.note,
          metric: item?.questionnaire,
          category: item?.category,
          category_name: item?.category_name
        })
      })
    }
    setFormData({ departments: department, position_level: positionLevel })
    setSelectedEmployee({ label: toUserName, value: toUserId })
    setDepartments(department)
    setAvgRating(averageRating)
    setReviewedByName(reviewedBy)
    setQuestions(oldData)
    setshowTable(true)
    setShowLoader(false);
  }

  const getKraKpiDetails = async () => {
    console.log('inside get data function');

    setShowLoader(true);

    const endPoint = `${Api.kraKpiQuestionnaire}`;
    const params = { type: 'all' };

    if (departments) {
      params.departments = `[${departments}]`
    }
    if (position) {
      params.position_level = position
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setshowTable(true)
      if (data?.data.length == 0) {
        setMessage('No Data found.')
      }

      setQuestions(data?.data)
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
          review: item?.review,
          rating: +item?.rating,
          kra_kpi_questionnaire: +item?.id,
          position_level: item?.position_level
        };
        if (item?.review) {
          postData.note = item?.note;
        }
        questionData.push(postData);

      });
    let obj = null;
    if (questionData)
      obj = {
        'to_user': selectedEmployeeId,
        'data': questionData,
      };

    const response = await AuthApi.postDataToServer(Api.kraKpiAdd, obj);
    let { data, message } = response;
    if (!message) {
      message = response?.data?.message
    }
    
    if (data) {
      swal(message[0], '', 'success').then(() => {
        if ([3, 4].includes(userRole)) {
          history.push('/kra-kpi-employees');
        } else {
          history.push('/kra-kpi');
        }
      });
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
    if ([3, 4].includes(userRole)) {
      history.push('/kra-kpi-employees');
    } else {
      history.push('/kra-kpi');
    }
  };
  const [currentPage, setCurrentPage] = useState(1);

  const applyFilters = () => {
    setCurrentPage(1);
    getKraKpiDetails(1);
  };

  const clearFilter = () => {
    console.log('inside clear');
    setFormData({
      departments: '',
      position_level: '',
    });
    setSelectedEmployee(null)
    setSelectedEmployeeId(null)
    setQuestions(null)
    setRefereshPage(true)
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Fill KRA-KPI</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">KRA-KPI Form</h5>
            </div>
            <hr style={{ borderColor: "white" }} />
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
                <hr style={{ borderColor: "white" }} />

                <Form >
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col sm={2}>
                          <Form.Group controlId='formDepartment'>
                            <Form.Label>
                              Department <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              as='select'
                              name='Department'
                              value={formData?.departments}
                              onChange={(e) => {
                                const data = { ...formData };
                                data.departments = e?.target?.value;
                                console.log('e?.target?.value', e?.target?.value);

                                setDepartments(Number(e?.target?.value));
                                setFormData(data);
                              }}
                              disabled={isViewOnly ? true : false}
                            >
                              <option value='' hidden>Select Department</option>
                              <option value='1'>Management</option>
                              <option value='2'>Development</option>
                              <option value='3'>Design</option>
                              <option value='4'>Quality Analysis</option>
                              <option value='5'>Other</option>
                              <option value='6'>Marketing</option>
                              <option value='7'>Support Team</option>
                              <option value='8'>Account</option>
                              <option value='9'>Project Management</option>



                            </Form.Control>
                            <p className='text-danger'>{validator.current.message(
                              'Department',
                              formData?.departments,
                              'required'
                            )}</p>
                          </Form.Group>
                        </Col>

                        <Col sm={2}>
                          <DropdownInput
                            label="Employees"
                            asterisk="*"
                            options={allEmployes}
                            defaultValue={selectedEmployee}
                            onSelectHandler={(select) => {
                              setSelectedEmployee(select);
                              setSelectedEmployeeId(select?.value);
                            }}
                            disabled={isViewOnly ? true : false}
                            errorMessage={validator.current.message(
                              'Employees',
                              selectedEmployee,
                              'required'
                            )}
                          />
                        </Col>

                        <Col sm={2}>
                          <Form.Group controlId='formPosition'>
                            <Form.Label>
                              Employee Position <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              as='select'
                              name='Position'
                              value={formData?.position_level}
                              onChange={(e) => {
                                const data = { ...formData };
                                data.position_level = e?.target?.value;
                                setPosition(Number(e?.target?.value));
                                setFormData(data);
                              }}
                              disabled={isViewOnly ? true : false}
                            >
                              <option value='' hidden>Select Position</option>
                              <option value='1'>Senior</option>
                              <option value='2'>Junior</option>
                              <option value='3'>Senior & Junior</option>
                            </Form.Control>
                            <p className='text-danger'>{validator.current.message(
                              'Position',
                              formData?.position_level,
                              'required'
                            )}</p>
                          </Form.Group>
                        </Col>
                        {isViewOnly && (<>
                          <Col sm={2}>
                            <Form.Label>
                              Average Rating <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type='text'
                              value={avgRating}
                              disabled='true'
                            />
                          </Col>
                          <Col sm={2}>
                            <Form.Label>
                              Reviewed By <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type='text'
                              value={reviewedByName}
                              disabled='true'
                            />
                          </Col>
                        </>)}
                        <Col>
                          {!isViewOnly && (<>
                            <Button className='mt-4' variant="primary" onClick={() => {
                              console.log('validator.current.errorMessages', validator.current.errorMessages);
                              validator.current.errorMessages.EmployeeRating = null
                              validator.current.errorMessages.review = null
                              validator.current.fields.EmployeeRating = true
                              validator.current.fields.review = true

                              if (validator.current.allValid()) {
                                console.log('inside valid');
                                validator.current.hideMessages()
                                applyFilters()
                              } else {
                                validator.current.showMessages()
                                forceUpdate(count + 1)
                              }
                            }}>Apply</Button>
                            <Button className='mt-4 ml-3' variant="secondary" onClick={() => {
                              validator.current.hideMessages()
                              clearFilter()
                            }}>
                              Clear
                            </Button>
                          </>
                          )}

                        </Col>
                      </Row>
                      {questions && questions.length != 0 && showTable && departments && (
                        <Row>
                          <div className="d-flex align-items-center justify-content-between">
                            <p className="text-muted">Note : If you do not have an answer to a question, please enter "N/A" as the response for that question.</p>
                          </div>
                        </Row>
                      )}

                    </Card.Body>
                  </Card>

                  <Row>
                    {questions && questions.length != 0 && showTable && departments ? (
                      // Group questions by category ID and render each group in its own card
                      questions.reduce((acc, question) => {
                        // Group questions by category ID
                        if (!acc[question.category]) acc[question.category] = [];
                        acc[question.category].push(question);
                        return acc;
                      }, {})
                      && Object.keys(questions.reduce((acc, question) => {
                        if (!acc[question.category]) acc[question.category] = [];
                        acc[question.category].push(question);

                        return acc;
                      }, {})).map((category) => (
                        <Col sm={12} key={category}>
                          <Card>
                            <Card.Body>
                              <h5 className="card-title">Category : {category && getCategoryById(category) ? getCategoryById(category) : category} Feedback Form</h5>
                              <hr />
                              {questions.filter(q => q.category === Number(category)).map((item, index) => (
                                <Form.Group controlId={`formItem${item.id}`} key={item.id}>
                                  <Form.Label>
                                    {index + 1}. {item?.metric} <span className="text-danger">*</span>
                                  </Form.Label>
                                  {item?.questionnaire_note && <p className="text-muted">Note: {item?.questionnaire_note}</p>}
                                  <Form.Control
                                    as='textarea'
                                    style={{ height: '70px' }}
                                    value={item?.review}
                                    onChange={(e) => {
                                      const data = [...questions];
                                      data[questions.indexOf(item)].review = e?.target?.value;
                                      setQuestions(data);
                                    }}
                                    disabled={isViewOnly ? true : false}
                                  />
                                  <p className='text-danger'>
                                    {validator.current.message(

                                      `review`,
                                      item?.review,
                                      'required'
                                    )}</p>
                                  <br />
                                  <Form.Label>
                                    Note
                                    {/* <span className="text-danger">*</span> */}
                                  </Form.Label>
                                  <Form.Control
                                    as='textarea'
                                    style={{ height: '70px' }}
                                    value={item?.note}
                                    onChange={(e) => {
                                      const data = [...questions];
                                      data[questions.indexOf(item)].note = e?.target?.value;
                                      setQuestions(data);
                                    }}
                                    disabled={isViewOnly ? true : false}
                                  />

                                  <br />
                                  <Col sm={1}>

                                    <Form.Label>Employee Rating <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                      as='select'
                                      value={item?.rating}
                                      onChange={(e) => {
                                        const data = [...questions];
                                        data[questions.indexOf(item)].rating = e?.target?.value;
                                        setQuestions(data);
                                      }}
                                      disabled={isViewOnly ? true : false}
                                    >
                                      <option value='' hidden>Select Rating</option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                      <option value='4'>4</option>
                                      <option value='5'>5</option>
                                    </Form.Control>
                                    <p className='text-danger'>{validator.current.message(
                                      'EmployeeRating',
                                      item?.rating,
                                      'required|numeric|max:5|min:0'
                                    )}</p>
                                  </Col>
                                </Form.Group>
                              ))}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : <>
                      {message && (
                        <div className="d-flex justify-content-center p-2">
                          <h4>No record found.</h4>
                        </div>
                      )}
                    </>
                    }
                  </Row>
                </Form>
              </Card.Body>
            </Card>
            <div className="d-flex justify-content-end p-2">
              <ButtonGroup className="gap-3 mt-6">
                {questions && questions.length != 0 && showTable && !isViewOnly && departments && (
                  <>
                    <Button
                      variant="secondary"
                      className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
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
                    // onConfirm={() => {
                    //   setAddPopUp(true)
                    // }}

                    >
                      Submit
                    </Button>
                    <Button
                      variant="secondary"
                      className="h4 m-0 text-black rounded-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClear()
                        setAddPopUp(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </ButtonGroup>

            </div>
          </Card.Body>
        </Card >
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
      </section >
    </>
  );
}

export default AddKraKpi;
