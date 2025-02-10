/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image, Tabs, Tab } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';

const items = [{ to: '/', label: 'Home' }, { label: 'Employees Reviews Form Response' }];

const EmployeeReviewsDetails = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [traineeData, setTraineeData] = useState([]);
  const [probationData, setProbationData] = useState([]);

  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [allEmployes, setAllEmployes] = useState([{ label: 'All Employess', value: 'all_employess' }]);
  const [allEmployeeIds, setEmployeeIds] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employess', value: 'all_employess' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState('Employees Reviews Form Response');
  const [userId, setUserId] = useState(null)
  const [detailsKeys, setDetailsKeys] = useState('personalInfo');

  useEffect(() => {
    setTitle("Employees Reviews Form Response")
    const uRole = customFunctions.getLocalStorage('group');
    const userId = customFunctions.getLocalStorage('userId');
    setUserRole(Number(uRole));
    setUserId(Number(userId));

  }, []);

  useEffect(() => {

    if (userId && detailsKeys === "personalInfo" && allEmployeeIds.length > 1) {
      getRowData();
    } else if (userId && detailsKeys === "empReviewsInfo" && allEmployeeIds.length > 1) {
      getTraineeData(1)
    } else if (userId && detailsKeys === "empProbationReviewsInfo" && allEmployeeIds.length > 1) {
      getProbationData(1)
    }
  }, [userId, detailsKeys, allEmployeeIds]);

  useEffect(() => {
    setTitle("Employees WFH")
    if (userRole && detailsKeys) {
      getEmployeeName();
    }
  }, [userRole, detailsKeys]);

  const columns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'full_name',
      label: 'Employee Name',
      render: (rowData) => {
        return <>{rowData?.employee?.full_name}</>;
      },
    },
    {
      id: 'full_name',
      label: 'Reviewer Name',
      render: (rowData) => {
        return <>{rowData?.reviewer?.full_name}</>;
      },
    },
    {
      id: 'review_date',
      label: 'Review Date',
    },
    {
      id: 'review_time',
      label: 'Review Time',
    },
    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: 'review_type_name',
      label: 'Review Type',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id, reviewer, employee, review_date, self_evaluation_form }) => {
        return (
          <>
            {self_evaluation_form ? (
              <a
                href="/"
                className="ms-2 pl-2"
                title="Update Form "
                style={{
                  display: "inline-block",
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textAlign: "center",
                  textDecoration: "none",
                  borderRadius: "4px",
                  border: "1px solid #007bff",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // changeStatus(id);
                  // submitForm(id)
                  history.push('/evaluation-form', {
                    state: {
                      reviewId: id,
                      reviewData: reviewer,
                      employeeData: employee,
                      revieweDate: review_date,
                      selfEvaluationForm: self_evaluation_form,
                      isDisabled: true

                    }
                  })
                }}

              >
                View
              </a>
            ) : (
              <>
                {!self_evaluation_form && (
                  <a
                    href="/"
                    className="ms-2 pl-2"
                    title="Update Form "
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // changeStatus(id);
                      // submitForm(id)
                      sentReminder(id, 1)

                    }}

                  >
                    Send Reminder <img src="/images/arrow-post.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />
                  </a>
                )
                }
              </>
            )
            }

          </>
        )
      },
    },
  ];

  const probationReviewsColumns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'full_name',
      label: 'Employee Name',
      render: (rowData) => {
        return <>{rowData?.employee?.full_name}</>;
      },
    },
    {
      id: 'review_date',
      label: 'Review Date',
    },
    {
      id: 'review_time',
      label: 'Review Time',
    },
    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: 'review_type_name',
      label: 'Review Type',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id, reviewer, employee, review_date, probation_review_form }) => {

        return (
          <>
            {
              probation_review_form ? (
                <a
                  href="/"
                  className="ms-2 pl-2"
                  title="Revert Leave"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    cursor: "pointer",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}

                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.push('/probation-reviewer-form', {
                      state: {
                        reviewId: id,
                        reviewData: reviewer,
                        employeeData: employee,
                        revieweDate: review_date,
                        probationReviewForm: probation_review_form,
                        isDisabled: true

                      }
                    })
                  }}
                >
                  View
                </a>
              ) : (
                <a
                  href="/"
                  className="ms-2 pl-2"
                  title="Revert Leave"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    cursor: "pointer",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.push('/probation-reviewer-form', {
                      state: {
                        reviewId: id,
                        reviewData: reviewer,
                        employeeData: employee,
                        revieweDate: review_date,
                        traningReviewForm: false

                      }
                    })
                  }}

                >
                  Submit Probation Review
                </a>
              )
            }
          </>
        )
      },
    },
  ];

  const takenReviewsColumns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'full_name',
      label: 'Employee Name',
      render: (rowData) => {
        return <>{rowData?.employee?.full_name}</>;
      },
    },
    {
      id: 'full_name',
      label: 'Reviewer Name',
      render: (rowData) => {
        return <>{rowData?.reviewer?.full_name}</>;
      },
    },
    {
      id: 'review_date',
      label: 'Review Date',
    },
    {
      id: 'review_time',
      label: 'Review Time',
    },
    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: 'review_type_name',
      label: 'Review Type',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id, reviewer, employee, review_date, training_review_form }) => {

        return (
          <>
            {
              training_review_form ? (
                <a
                  href="/"
                  className="ms-2 pl-2"
                  title="Revert Leave"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    cursor: "pointer",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.push('/training-reviewer-form', {
                      state: {
                        reviewId: id,
                        reviewData: reviewer,
                        employeeData: employee,
                        revieweDate: review_date,
                        trainingReviewerForm: training_review_form,
                        isDisabled: true

                      }
                    })
                  }}
                >
                  View
                </a>
              ) : (
                <>
                  {!training_review_form && (
                    <a
                      href="/"
                      className="ms-2 pl-2"
                      title="Update Form "
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        sentReminder(id, 2)

                      }}

                    >
                      Send Reminder <img src="/images/arrow-post.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />
                    </a>
                  )
                  }
                </>
              )
            }
          </>

        )
      },
    },
  ];

  const sentReminder = async (id, formType) => {
    setShowLoader(true);
    const params = {
      form_type: formType
    }
    const url = `${Api.sentFormsReminder}${id}/`;
    const { data, error } = await AuthApi.putDataToServer(url, params);
    setShowLoader(false);
    if (data) {
      if (formType === 1) {
        swal('Self Evalueation Form reminder sent successfully.', '', 'success').then(() => {
        });
      }
      else {
        swal('Training Reviewer Form reminder sent successfully.', '', 'success').then(() => {
        });
      }

    } else {
      setShowLoader(false);
      swal(data?.message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  }

  const getEmployeeName = async () => {
    setShowLoader(true);
    const url = `${Api.employeeUrl}?type=all&is_onboard=true`;

    const { data, error } = await AuthApi.getDataFromServer(url);
    setShowLoader(false);
    let employeesIds = []
    let allemp = []
    if (data && data.success) {
      data.data.map((item) => {
        let obj = {
          label: item.full_name,
          value: item.id,
          joiningDate: item.date_joined,
        }

        employeesIds.push(item.id)
        allemp.push(obj)
      }
      );
      setEmployeeIds(employeesIds)
      setAllEmployes([{ label: 'All Employess', value: 'all_employess' }, ...allemp]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };



  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    console.log("pageNo", pageNo);

    const endPoint = `${Api.employeeSpeificReviewUrl}`;
    const params = {
      page: page,
      limit: 10,
      sort_direction: 'descending',
    };
    console.log("allEmployeeIds", allEmployeeIds);

    if (detailsKeys === "personalInfo") {
      params.employee_ids = `[${allEmployeeIds}]`
    } else {
      params.reviewer_ids = `[${allEmployeeIds}]`
    }
    if (selectedDate) {
      params.review_date = customFunctions.getDate(selectedDate)
    }

    if (selectedEmployeeId) {
      params.employee = Number(selectedEmployeeId)
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
    }
    if (data && data.success === true) {
      setShowLoader(false);

      const review_data = data.data.map((item, index) => ({
        no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
        id: item.id,
        employee: item?.employee,
        reviewer: item?.reviewer,
        review_date: item?.review_date,
        review_time: item?.review_time,
        status: item?.status,
        status_name: item?.status_name,
        review_type: item?.review_type,
        review_type_name: item?.review_type_name,
        self_evaluation_form: item?.self_evaluation_form,
        training_review_form: item?.training_review_form
      }));

      setRowData(review_data);
    }
  };

  const getTraineeData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.employeeSpeificReviewUrl}`;
    const params = {
      page: page,
      limit: 10,
      sort_direction: 'descending',
      is_only_trainee_data: true
    };

    if (detailsKeys === "personalInfo") {
      params.employee_ids = `[${allEmployeeIds}]`
    } else {
      params.reviewer_ids = `[${allEmployeeIds}]`
    }

    if (selectedDate) {
      params.review_date = customFunctions.getDate(selectedDate)
    }

    if (selectedEmployeeId && detailsKeys !== "personalInfo") {
      params.employee = Number(selectedEmployeeId)
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
    }
    if (data && data.success) {
      setShowLoader(false);

      const traineReviewData =
        data.data.filter((ele) => ele?.review_type === 1).map((innerElement, innerIndex) => {
          return {
            no: (pageNo - 1) * pagination.itemsPerPage + (innerIndex + 1),
            id: innerElement.id,
            employee: innerElement?.employee,
            reviewer: innerElement?.reviewer,
            review_date: innerElement?.review_date,
            review_time: innerElement?.review_time,
            status: innerElement?.status,
            status_name: innerElement?.status_name,
            review_type: innerElement?.review_type,
            review_type_name: innerElement?.review_type_name,
            self_evaluation_form: innerElement?.self_evaluation_form,
            training_review_form: innerElement?.training_review_form,
            probation_review_form: innerElement?.probation_review_form,
          }
        })

      setTraineeData(traineReviewData)
    }
  };

  const getProbationData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.employeeSpeificReviewUrl}`;
    const params = {
      page: page,
      limit: 10,
      sort_direction: 'descending',
      is_only_probation_data: true

    };
    console.log("detailsKeys", detailsKeys);

    if (detailsKeys === "personalInfo") {
      params.employee_ids = `[${allEmployeeIds}]`
    } else {
      params.reviewer_ids = `[${allEmployeeIds}]`
    }

    if (selectedDate) {
      params.review_date = customFunctions.getDate(selectedDate)
    }

    if (selectedEmployeeId && detailsKeys !== "personalInfo") {
      params.employee = Number(selectedEmployeeId)
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
    }
    if (data && data.success) {
      setShowLoader(false);
      const probationReviewData = data.data.filter((ele) => [2, 3, 4].includes(ele?.review_type)).map((innerElement, innerIndex) => {
        return {
          no: (pageNo - 1) * pagination.itemsPerPage + (innerIndex + 1),
          id: innerElement.id,
          employee: innerElement?.employee,
          reviewer: innerElement?.reviewer,
          review_date: innerElement?.review_date,
          review_time: innerElement?.review_time,
          status: innerElement?.status,
          status_name: innerElement?.status_name,
          review_type: innerElement?.review_type,
          review_type_name: innerElement?.review_type_name,
          self_evaluation_form: innerElement?.self_evaluation_form,
          training_review_form: innerElement?.training_review_form,
          probation_review_form: innerElement?.probation_review_form,
        }
      })
      setProbationData(probationReviewData)
    }
  };

  const generatereReviewReports = async (reportType) => {
    let params = {
      type: 'all'
    }
    if (reportType === 'personalInfo') {
      params.is_download_evaluation_forms = true
    } else if (reportType === 'empReviewsInfo') {
      params.is_download_reviewer_forms = true
    }
    const endPoint = `${Api.employeeSpeificReviewUrl}`;
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data?.success) {
      setShowLoader(false);
      downloadFile(data?.data?.file_name);
    } else {
      setShowLoader(false);
      swal(message || 'Something went wrong', '', 'error');
    }
  }

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');

    link.href = fileUrl;
    link.setAttribute('download', fileName);
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelectDetails = (det) => {
    if (det === 'personalInfo') {
      setEmployeeIds([])
      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
      setSelectedEmployeeId(null)
      setPagination({ current_page: 1, itemsPerPage: 10, totalItems: 10 })
      setTotalCount(10)
      setLimit(10)
      setCurrentPage(1)

      setDetailsKeys('personalInfo');
    } else if (det === 'empReviewsInfo') {
      setEmployeeIds([])
      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
      setSelectedEmployeeId(null)
      setPagination({ current_page: 1, itemsPerPage: 10, totalItems: 10 })
      setTotalCount(10)
      setLimit(10)
      setCurrentPage(1)
      setDetailsKeys('empReviewsInfo');
    }else if (det === "empProbationReviewsInfo") {
      setEmployeeIds([])
      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
      setSelectedEmployeeId(null)
      setPagination({ current_page: 1, itemsPerPage: 10, totalItems: 10 })
      setTotalCount(10)
      setLimit(10)
      setCurrentPage(1)
      setDetailsKeys('empProbationReviewsInfo');
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getRowData(1);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees Reviews Form Response</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <Tabs
            defaultActiveKey="personalInfo"
            onSelect={(e) => handleSelectDetails(e)}
          >
            <Tab eventKey='personalInfo' title="Reviewees Forms Details">
              <br />
              <Row>

                <div >
                  <a
                    variant="secondary"
                    className="bg-primary border-0 border-primary h5 m-0 text-white rounded-3"
                    type="submit"
                    href="#"
                    onClick={() => {
                      generatereReviewReports(detailsKeys)
                    }}
                  >
                    Generate Reports
                  </a>

                </div>
                <hr style={{ borderColor: "white" }} />
                <br />

                <Col sm={2}>
                  <DropdownInput
                    options={allEmployes}
                    defaultValue={selectedEmployee}
                    onSelectHandler={(select) => {
                      setSelectedEmployee(select)
                      setSelectedEmployeeId(select?.value)
                    }}
                  />
                </Col>
                <Col sm={2}>
                  <Datepicker
                    className="form-control"
                    selected={selectedDate}
                    onChange={(e) => setSelectedDate(e)}
                    autoComplete="off"
                    name="endDate"
                    dateFormat="dd/MM/yyyy"
                    placeholder="Select Review Date"
                  />
                </Col>

                <Col>
                  <Button variant="primary" onClick={applyFilters}>Apply</Button>
                  <Button variant="secondary" onClick={() => {
                    if (selectedDate || selectedEmployeeId || selectedEmployee) {
                      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                      setSelectedEmployeeId('all_employess')
                      setSelectedDate(null)
                      setRowData([])
                    }
                  }

                  } className='ml-3'>
                    Cancel
                  </Button>
                </Col>
              </Row>
              <hr style={{ borderColor: "white" }} />
              <br />
              <CustomTable
                columns={columns}
                rows={rowData}
                showPagination={true}
                paginationProps={{
                  totalItems: totalCount,
                  itemsPerPage: limit,
                  activePage: Number(currentPage),
                  onPageChange: (page) => {
                    setCurrentPage(page)
                    getRowData(page)
                  },
                }}
              />
            </Tab>
            <Tab eventKey="empReviewsInfo" title="Reviewers Tranining Forms Details">
              {detailsKeys === 'empReviewsInfo' && (<>
                <br />
                <Row>
                  <div >
                    <a
                      variant="secondary"
                      className="bg-primary border-0 border-primary h5 m-0 text-white rounded-3"
                      type="submit"
                      href="#"
                      onClick={() => {
                        generatereReviewReports(detailsKeys)
                      }}
                    >
                      Generate Reports
                    </a>

                  </div>
                  <hr style={{ borderColor: "white" }} />
                  <br />
                  <Col sm={2}>
                    <DropdownInput
                      options={allEmployes}
                      defaultValue={selectedEmployee}
                      onSelectHandler={(select) => {
                        setSelectedEmployee(select)
                        setSelectedEmployeeId(select?.value)
                      }}
                    />
                  </Col>
                  <Col sm={2}>
                    <Datepicker
                      className="form-control"
                      selected={selectedDate}
                      onChange={(e) => setSelectedDate(e)}
                      autoComplete="off"
                      name="endDate"
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Review Date"
                    />
                  </Col>
                  <Col>
                    <Button variant="primary" onClick={applyFilters}>Apply</Button>
                    <Button variant="secondary" onClick={() => {
                      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                      setSelectedEmployeeId('all_employess')
                      setSelectedDate(null)
                      setRowData([])
                    }

                    } className='ml-3'>
                      Cancel
                    </Button>
                  </Col>
                </Row>

                <CustomTable
                  columns={takenReviewsColumns}
                  rows={traineeData}
                  showPagination={true}
                  paginationProps={{
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    activePage: Number(currentPage),
                    onPageChange: (page) => {
                      setCurrentPage(page)
                      getTraineeData(page)
                    },
                  }}
                />

              </>)}
            </Tab>

            <Tab eventKey="empProbationReviewsInfo" title="Reviewers Probation Review Details">
              {detailsKeys === 'empProbationReviewsInfo' && (<>
                <br />
                <Row>
                  <Col sm={2}>
                    <DropdownInput
                      options={allEmployes}
                      defaultValue={selectedEmployee}
                      onSelectHandler={(select) => {
                        setSelectedEmployee(select)
                        setSelectedEmployeeId(select?.value)
                      }}
                    />
                  </Col>
                  <Col sm={2}>
                    <Datepicker
                      className="form-control"
                      selected={selectedDate}
                      onChange={(e) => setSelectedDate(e)}
                      autoComplete="off"
                      name="endDate"
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Review Date"
                    />
                  </Col>
                  <Col>
                    <Button variant="primary" onClick={applyFilters}>Apply</Button>
                    <Button variant="secondary" onClick={() => {
                      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                      setSelectedEmployeeId('all_employess')
                      setSelectedDate(null)
                      setRowData([])
                    }

                    } className='ml-3'>
                      Cancel
                    </Button>
                  </Col>
                </Row>

                <CustomTable
                  columns={probationReviewsColumns}
                  rows={probationData}
                  showPagination={true}
                  paginationProps={{
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    activePage: Number(currentPage),
                    onPageChange: (page) => {
                      setCurrentPage(page)
                      getProbationData(page)
                    },
                  }}
                />
              </>)}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
};


export default EmployeeReviewsDetails;
