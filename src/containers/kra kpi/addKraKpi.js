/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form, Col, Row } from 'react-bootstrap';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
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
  const isProjectManager = state?.state?.state?.isProjectManager
  const isFromView = state?.state?.state?.isFromView
  const [employeeId, setEmployeeId] = useState()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState();
  const [empDepartment, setEmpDepartment] = useState()
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false)
  const [refereshPage, setRefereshPage] = useState(false);
  const [allEmployes, setAllEmployes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [selectedPostion, setSelectedPostion] = useState();
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedMonth, setSetSelectedMonth] = useState('');
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();

  const [showTable, setshowTable] = useState(false)
  const [userRole, setUserRole] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewedByName, setReviewedByName] = useState(0);
  const [isViewOnly, setViewOnly] = useState(false)
  const [isReset, setReset] = useState(false)

  const [showAddPopUp, setAddPopUp] = useState(false)
  const [count, forceUpdate] = useState(0)
  const [message, setMessage] = useState('')
  const ratingOptions = [
    { id: "zero", label: "0", isCheck: false },
    { id: "1", label: "1", isCheck: false },
    { id: "2", label: "2", isCheck: false },
    { id: "3", label: "3", isCheck: false },
    { id: "4", label: "4", isCheck: false },
    { id: "5", label: "5", isCheck: false },]

  const allPosition = [
    { label: "Senior", value: "1" },
    { label: "Junior", value: "2" },
    { label: "Senior & Junior", value: "3" },]

  const [questions, setQuestions] = useState([
    {
      rating: 0,
      review: '',
      note: ''
    }
  ]);
  // console.log('questions', questions);

  const [formData, setFormData] = useState({
    departments: '',
    position_level: '',
  });

  const handleCheckboxChange = (event, item) => {
    const data = [...questions];
    data[questions.indexOf(item)].rating = event;
    setQuestions(data);
  };

  useEffect(() => {
    setEmployeeId(localStorage.getItem('userId'))
    setEmpDepartment(localStorage.getItem('department'))
    getDepartments()
    setTitle('Fill KRA-KPI');
  }, [refereshPage]);


  useEffect(() => {
    if (!selectedDepartment) return;
    getTeams()
  }, [selectedDepartment])

  useEffect(() => {
    if (feedbackId && employeeId && empDepartment) {
      getUpdateData()
      // setViewOnly(true)
      setFieldsDisabled(true)
    }
  }, [feedbackId, employeeId, empDepartment])

  useEffect(() => {
    
    if (!feedbackId && selectedDepartment && selectedTeam && selectedEmployee && selectedPostion && !isReset) {
      console.log('Hello world');
      getKraKpiDetails()
      setViewOnly(false)
      setFieldsDisabled(true)
    }
  }, [employeeId, selectedDepartment, selectedTeam, selectedEmployee])

  useEffect(() => {
    if (userRole && selectedDepartment && selectedTeam && !isViewOnly) {
      getEmployeeName();
      if (userRole != 1 && !isProjectManager) {
        setSelectedEmployee('')
        setQuestions('')
      }

    }
  }, [userRole, selectedDepartment, selectedTeam]);


  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    // const isProjectManager =
    //   customFunctions?.getLocalStorage('isProjectManager');
    // setProjectManager(JSON.parse(isProjectManager));
  }, []);

  useEffect(() => {
    if (userRole == 1 && !isProjectManager && !isFromView) {
      setViewOnly(false)
    } else if (userRole != 1 && !isFromView) {
      setViewOnly(false)
    } else {
      setViewOnly(true)
    }
  }, [userRole, isProjectManager])

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

  const getEmployeeName = async () => {
    setQuestions(null)
    if (!isViewOnly) {
      setSelectedPostion(null)
      setSelectedEmployee(null)
      setSetSelectedMonth(null)
      setReset(true)
    }
    const uRole = customFunctions.getLocalStorage('group');
    let url = ''
    setShowLoader(true);
    if ([3, 4].includes(userRole)) {
      url = `${Api.employeeListUrl}?for_kra_kpi=1&is_dropdown=true&department_id=${selectedDepartment?.value}&team_id=${selectedTeam?.value}`
    } else {
      url = `${Api.employeeUrl}?type=all&status=active&hide_admin=1&department_id=${selectedDepartment?.value}&team_id=${selectedTeam?.value}`;
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


  const getDepartments = async () => {
    setShowLoader(true);
    setQuestions(null)
    const endPoint = `${Api.InterviewRoundsUrl}`;
    const params = { constant_type: 'department', is_kra_kpi: true };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, _ } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      setShowLoader(false);
      const allDepartment = data?.data?.department.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setAllDepartments([...allDepartment]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);
    }
  }

  const getTeams = async () => {
    setQuestions(null)
    setAllTeams(null)
    // if (!isViewOnly && isUpdate) {
    if (!isViewOnly) {
      setSelectedTeam(null)
      setSelectedPostion(null)
      setSelectedEmployee(null)
      setSetSelectedMonth(null)
      setReset(true)

    }
    setShowLoader(true);
    const endPoint = `${Api.InterviewRoundsUrl}`;
    const params = { department_id: selectedDepartment?.value };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, _ } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      setShowLoader(false);
      const allTeams = data?.data?.team.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setAllTeams([...allTeams]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);
    }
  }


  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.kraKpiUrl}`;
    const params = {
      user: toUserId,
      start_date: feddbackCreatedDate ? customFunctions.getDate(feddbackCreatedDate) : '',
      show_table: true,
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, _ } = await AuthApi.getDataFromServer(url);

    let oldData = []
    let department = null
    let department_name = null
    let positionLevel = null
    let positionLevelName = null
    let averageRating = 0
    let reviewedBy = ''
    let team_name = null
    let team = null
    let created_at = null

    console.log('data?.data[0]', data?.data);

    if (data && data.success) {
      averageRating = data?.data[0]?.average_rating ? data?.data[0]?.average_rating : 0
      created_at = data?.data[0]?.created_at
      data?.data[0]?.kra_kpi.length > 0 && data.data[0].kra_kpi.map((item) => {
        // console.log('sssss', item);
        department = item?.departments[0]
        team = item?.team
        department_name = item?.department_names[0]
        team_name = item?.team_name
        positionLevel = item?.position_level
        positionLevelName = item?.position_level_name
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

    if (created_at) {
      setSetSelectedMonth(new Date(created_at))
    }
    setFormData({ departments: department, position_level: positionLevel })
    setSelectedEmployee({ label: toUserName, value: toUserId })
    setSelectedDepartment({ 'label': department_name, 'value': department })
    setSelectedTeam({ 'label': team_name, 'value': team })
    setSelectedPostion({ 'label': positionLevelName, 'value': positionLevel })
    setAvgRating(averageRating)
    setReviewedByName(reviewedBy)
    setQuestions(oldData)
    setshowTable(true)
    setShowLoader(false);
  }

  const getKraKpiDetails = async () => {
    setShowLoader(true);

    const endPoint = `${Api.kraKpiQuestionnaire}`;
    const params = { type: 'all' };

    if (selectedDepartment) {
      params.departments = `[${selectedDepartment?.value}]`
    }
    if (selectedTeam) {
      params.team = selectedTeam?.value
    }
    if (selectedPostion) {
      params.position_level = selectedPostion?.value
    }


    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setshowTable(true)
      if (data?.data.length == 0) {
        setMessage('No Data found.')
      }

      data?.data.forEach(obj => {
        obj.rating = '';
      });

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
        if (!item?.rating) {
          item.rating = 0
        } else if (item?.rating === 'zero') {
          item.rating = 0
        }
        const postData = {
          review: item?.review,
          rating: +item?.rating,
          kra_kpi_questionnaire: +item?.id,
          position_level: item?.position_level
        };
        if (item?.note) {
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
    setShowLoader(false);

    const response = await AuthApi.postDataToServer(Api.kraKpiAdd, obj);
    let { data, message } = response;
    if (!message) {
      message = response?.data?.message
    }

    if (data) {
      swal('Kra-Kpi Created succesfully. ', '', 'success').then(() => {
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
    setReset(false)
    getKraKpiDetails(1);
  };

  const clearFilter = () => {
    setFormData({
      departments: '',
      position_level: '',
    });
    setSelectedDepartment(null)
    setSelectedTeam(null)
    setSelectedPostion(null)
    setSelectedEmployee(null)
    setSelectedEmployeeId(null)
    setQuestions(null)
    setRefereshPage(true)
    setSetSelectedMonth(null)
    setReset(false)
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
              <h5 className="card-title mb-0 mt-2 ">Get Forms details by Filters</h5>
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

            <Row>
              <Col sm={2}>
                <DropdownInput
                  label="Department"
                  asterisk="*"
                  options={allDepartments}
                  defaultValue={selectedDepartment}
                  onSelectHandler={(select) => {
                    setSelectedDepartment(select);
                  }}
                  disabled={isViewOnly ? true : false}
                  errorMessage={validator.current.message(
                    'Department',
                    selectedDepartment,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <DropdownInput
                  label="Team"
                  asterisk="*"
                  options={allTeams}
                  defaultValue={selectedTeam}
                  onSelectHandler={(select) => {
                    setSelectedTeam(select);
                  }}
                  disabled={isViewOnly ? true : false}
                  errorMessage={validator.current.message(
                    'Team',
                    selectedTeam,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <DropdownInput
                  label="Employee"
                  asterisk="*"
                  options={allEmployes}
                  defaultValue={selectedEmployee}
                  onSelectHandler={(select) => {
                    setSelectedEmployee(select);
                    setSelectedEmployeeId(select?.value);
                  }}
                  disabled={isViewOnly ? true : false}
                  errorMessage={validator.current.message(
                    'Employee',
                    selectedEmployee,
                    'required'
                  )}
                />
              </Col>

              <Col sm={2}>
                <DropdownInput
                  label="Position"
                  asterisk="*"
                  options={allPosition}
                  defaultValue={selectedPostion}
                  onSelectHandler={(select) => {
                    const data = { ...formData };
                    data.position_level = select?.value;
                    setSelectedPostion(select);
                  }}
                  disabled={isViewOnly ? true : false}
                  errorMessage={validator.current.message(
                    'Position',
                    selectedPostion,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <Datepicker
                  label="Month"
                  asterisk="*"
                  className="form-control w-100"
                  name={"endDate"}
                  placeholder={"Select month/year"}
                  showMonthYearPicker={true}
                  dateFormat={"MM/yyyy"}
                  maxDate={new Date()}
                  selected={selectedMonth}
                  disabled={isViewOnly ? true : false}
                  onChange={(date) => {
                    setSetSelectedMonth(date);
                  }}
                  errorMessage={validator.current.message(
                    'Month',
                    selectedMonth,
                    'required'
                  )}
                />
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
            </Row>
            <Row>
              <Col>
                {!isViewOnly && (<>
                  <Button className='mt-4' variant="primary" onClick={() => {
                    validator.current.errorMessages.EmployeeRating = null
                    validator.current.errorMessages.review = null
                    validator.current.fields.EmployeeRating = true
                    validator.current.fields.review = true

                    validator.current.errorMessages.Comment = null
                    validator.current.fields.Comment = true

                    validator.current.errorMessages.Rating = null
                    validator.current.fields.Rating = true

                    if (validator.current.allValid()) {
                      validator.current.hideMessages()
                      applyFilters()

                    } else {
                      validator.current.showMessages()
                      forceUpdate(count + 1)
                    }
                  }}>Go</Button>
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
            <Form >


              {questions && questions.length != 0 && showTable && selectedDepartment && (
                <Row>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <p className="text-muted">Note : If you do not have an answer to a question, please enter "N/A" as the response for that question and select 'Zero' for rating.</p>
                  </div>
                </Row>
              )}

              {/* </Card.Body> */}
              {/* </Card> */}

              <Row>
                {questions && questions.length != 0 && showTable && selectedDepartment ? (
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
                          <h4><b>Category : {category && getCategoryById(category) ? getCategoryById(category) : category}</b></h4>
                          <hr />
                          {questions.filter(q => q.category === Number(category)).map((item, index) => (
                            <Form.Group controlId={`formItem${item.id}`} key={item.id}>
                              <Row>
                                <Form.Label>
                                  {/* {index + 1}. {item?.metric} <span className="text-danger">*</span> */}
                                  <b>Q{index + 1}.</b> {item?.metric}
                                </Form.Label>
                                {item?.questionnaire_note && <p className="text-muted">Note: {item?.questionnaire_note}</p>}

                                <Col md={5}>
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
                                          checked={item?.rating == option.label}
                                          onChange={(e) => {
                                            handleCheckboxChange(option.label, item);
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
                                </Col>
                                <Col>

                                  {/* <Form.Label>
                                {index + 1}. {item?.metric} <span className="text-danger">*</span>
                              </Form.Label> */}
                                  {/* {item?.questionnaire_note && <p className="text-muted">Note: {item?.questionnaire_note}</p>} */}
                                  <p className="">Comment : <span className="text-danger">*</span></p>
                                  <Form.Control
                                    as='textarea'
                                    style={{ height: '50px' }}
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

                                      `Comment`,
                                      item?.review,
                                      'required'
                                    )}</p>
                                  <br />
                                </Col>
                              </Row>
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
            {/* </Card.Body> */}
            {/* </Card> */}
            <div className="d-flex justify-content-end p-2">
              <ButtonGroup className="gap-3 mt-6">
                {questions && questions.length != 0 && showTable && !isViewOnly && selectedDepartment && (
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
