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

const EmployeeReviews = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDelete, setShowDelete] = useState(false);
  const [allEmployes, setAllEmployes] = useState([{ label: 'All Employess', value: 'all_employess' }]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employess', value: 'all_employess' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState('Employees Reviews Form Response');
  const [isProjectManager, setProjectManager] = useState(false)
  const currentDate = new Date();
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
    if (userId && detailsKeys) {
      getRowData();
    }
  }, [userId, detailsKeys]);

  useEffect(() => {
    setTitle("Employees WFH")
    if (userRole && detailsKeys !== "personalInfo") {
      getEmployeeName();
    }
  }, [userRole, detailsKeys]);

  const columns = [
    { id: 'no', label: 'SR No' },
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
        console.log("self_evaluation_form", self_evaluation_form)
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
                      selfEvaluationForm: self_evaluation_form

                    }
                  })
                }}

              >
                Update Evaluation Form
              </a>
            ) : (
              <a
                href="/"
                className="ms-2 pl-2"
                title="Generate Form"
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
                      selfEvaluationForm: false
                    }
                  })
                }}

              >
                Submit Evaluation Form
              </a>
            )
            }
          </>)
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
        console.log("training_review_form", training_review_form);

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
                    // changeStatus(id);
                    // submitForm(id)
                    history.push('/training-reviewer-form', {
                      state: {
                        reviewId: id,
                        reviewData: reviewer,
                        employeeData: employee,
                        revieweDate: review_date,
                        trainingReviewerForm: training_review_form

                      }
                    })
                  }}
                >
                  Update Training Reviewer Form
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
                    // changeStatus(id);
                    // submitForm(id)
                    history.push('/training-reviewer-form', {
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
                  Submit Review Feedback
                </a>
              )
            }
          </>

        )
      },
    },
  ];


  const getEmployeeName = async () => {
    setShowLoader(true);
    const url = `${Api.employeeUrl}?type=all&is_onboard=true`;
    const { data, error } = await AuthApi.getDataFromServer(url);
    setShowLoader(false);

    if (data && data.success) {
      let allemp = []
      data.data.map((item) => {
        if ([1].includes(item.role_id) && !item.is_project_manager) return;

        allemp.push({
          label: item.full_name,
          value: item.id,
          joiningDate: item.date_joined,
        })
      }
      );

      setAllEmployes([{ label: 'All Employess', value: 'all_employess' }, ...allemp]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.employeeSpeificReviewUrl}`;
    const params = {
      page: page,
      limit: 10,
      sort_direction: 'descending',
    };
    console.log("detailsKeys", detailsKeys);

    if (detailsKeys === "personalInfo") {
      params.employee = userId
    } else {
      params.reviewer = userId
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
    if (data && data.success === true) {
      setShowLoader(false);

      const review_data = data.data.map((item, index) => ({
        // no: (pagination.current_page - 1) * 10 + index + 1,
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

  const handleSelectDetails = (det) => {
    if (det === 'personalInfo') {
      setDetailsKeys('personalInfo');
    } else if (det === 'empReviewsInfo') {
      setDetailsKeys('empReviewsInfo');
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
            <Tab eventKey='personalInfo' title="My review Details">
              <br />
              <Row>
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
                    if (selectedDate) {
                      setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                      setSelectedEmployeeId('all_employess')
                      setSelectedDate(null)
                      setRowData([])
                    }
                    // setRefereshPage(true)
                  }

                  } className='ml-3'>
                    Cancel
                  </Button>
                </Col>
              </Row>
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
            <Tab eventKey="empReviewsInfo" title="Employee Review Details (Taken by Me)">
              {detailsKeys === 'empReviewsInfo' && (<>
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
                      // setRefereshPage(true)
                    }

                    } className='ml-3'>
                      Cancel
                    </Button>
                  </Col>
                </Row>

                <CustomTable
                  columns={takenReviewsColumns}
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

              </>)}
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
};


export default EmployeeReviews;
