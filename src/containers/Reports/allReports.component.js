/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import {
  Datepicker,
  Helmet,
  DropdownInput,
  TextInput,
} from '../../components/FormInputs';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import Loader from '../../components/Loader/index';

const items = [{ to: '/', label: 'Home' }, { label: 'Employee Timesheet' }];

function AllReports() {
  const [rows, setRows] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [title, setTitle] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory();
  const [searchKeyword, setSearchKeyword] = useState('');
  const { state } = useLocation();
  const [currentPage, setCurrentPage] = useState();
  // setSelectedEmployee(state?.state?.reporterName);


  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  useEffect(() => {
    if (!state) return;
    if (state) {
      // setSelectedEmployee([{
      //   label: state?.state?.reporterName,
      //   id: state?.state?.EmpId,
      //   value: state?.state?.EmpId,
      // }]);
    }
  }, [state]);

  // useEffect(()=>{
  //   const currentpage = customFunctions.getLocalStorage('currentpage');
  //   // setCurrentPage(currentpage);
  //   // getReports(currentpage);
  //   setPagination({
  //     current_page: currentpage,
  //     itemsPerPage: 10,
  //     totalItems: 10,
  //   })
  // },[state])

  const handleActionCallback = ({ id, createdDate, name,clockin,clockout }) => {
    const newDate = customFunctions.getDate(createdDate);
    const dt = new Date(newDate).getTime();
    return (
      <span className="d-flex">
        <>
          <a
            href="javascript.void(0)"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push(`/daily-report/${dt}/${id}`, {
                employeeReport: true,
                reporterName: name,
                pagination: pagination.current_page,
                state:{
                  clockIn:clockin,
                  clockout:clockout
                }
              });
            }}
          >
            <span className="text-info">View Report</span>
          </a>
        </>
      </span>
    );
  };

  const columns = [
    {
      id: 'id',
      label: 'userId',
      roleAccess: [1, 2, 3, 4, 5, 7, 6],
      isDisplay: false,
    },
    {
      id: 'createdDate',
      label: 'date',
      roleAccess: [1, 2, 3, 4, 5, 6],
      isDisplay: false,
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5,7, 6],
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4, 5,7, 6],
    },

    {
      id: 'date',
      label: 'Date',
      roleAccess: [1, 2, 3, 4, 5,7, 6],
    },
    {
      id: 'clockin',
      label: 'In',
      roleAccess: [1, 2, 3, 4, 5, 7,6],
    },
    {
      id: 'clockout',
      label: 'Out',
      roleAccess: [1, 2, 3, 4, 5, 6,7],
    },
    {
      id: 'total_eta',
      label: 'Todays Estimation',
      roleAccess: [1, 2, 3, 4, 5, 6,7],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [1, 2, 3, 4, 5, 6,7],
    },
    {
      id: 'report',
      label: 'View Report',
      roleAccess: [1, 2, 3, 4, 5, 6,7],
      render: handleActionCallback,
    },
  ];

  useEffect(() => {
    getReports(state?.state?.pageee ? state?.state?.pageee : 1);
  }, [cntClearFilter]);

  const getReports = async (pageNo) => {
    setShowLoader(true);
    const page = pageNo ? pageNo : 1;
    const endPoint = `${Api.reportListingUrl}`;

    const params = {
      page,
      limit: pagination.itemsPerPage,
      keyword: searchKeyword && searchKeyword,
      start_date: fromDate ? customFunctions.getDate(fromDate) : '',
      end_date: toDate ? customFunctions.getDate(toDate) : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);

    let postData = {};
    const employee = [];
    if (selectedEmployee && selectedEmployee.length > 0) {
      selectedEmployee.map((emp) => {
        employee.push(emp.id);
        return emp;
      });
    }

    postData = {
      users: employee,
    };

    const { data } = await AuthApi.postDataToServer(url, postData);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setShowLoader(false);
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: Number(data.paginator.current_page),
        itemsPerPage: Number(data.paginator.limit),
        totalItems: data.paginator.total_count,
      });
      const row = [];

      data.data.map((report, i) => {
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.user,
          date: customFunctions.getDMYDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: `${report.estimation} Hrs`,
          id: report.user_id,
          createdDate: report.created_at,
          total_eta: `${report?.todays_total_estimation} Hrs`,
        };
        row.push(setRowData);
        return report;
      });
      setRows(row);
    }
  };

  // useEffect(() => {
  //   if (state != '') getEmployeReportById();
  // }, [state]);

  // const getEmployeReportById = async (pageNo = 0) => {
  //   setShowLoader(true);
  //   const page = pageNo || pagination.current_page;
  //   const endPoint = `${Api.reportListingUrl}/${state.state.EmpId}/`;
  //   const params = {
  //     page,
  //     limit: pagination.itemsPerPage,
  //     keyword: searchKeyword && searchKeyword,
  //     start_date: fromDate ? customFunctions.getDate(fromDate) : '',
  //     end_date: toDate ? customFunctions.getDate(toDate) : '',
  //   };
  //   const url = customFunctions.generateUrl(endPoint, params);
  //   const { data } = await AuthApi.getDataFromServer(url, endPoint);
  // };

  // const getEmployeeById = async () => {
  //   const { data } = await AuthApi.getDataFromServer(
  //     `${Api.reportListingUrl}user_id=${state?.state?.EmpId}`
  //   );
  //   // setEmployeeList(data.data);
  // };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_dropdown=1`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setEmployeeList(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
      getEmployee();
      setTitle('Reports');
      const uRole = customFunctions.getLocalStorage('group');
      setUserRole(Number(uRole));
    }
    getData();
  }, []);

  const getEmployeeList = () => {
    if (!employeeList) return [];
    const options = [];
    employeeList.map((tm) => {
      return options.push({
        label: tm.full_name,
        id: tm.id,
        value: tm.id,
      });
    });
    return options;
  };

  const onClear = () => {
    setFilterErr('');
    setFromDate('');
    setToDate('');
    setSearchKeyword('');
    setSelectedEmployee([]);
    setCntClearFilter(cntClearFilter + 1);
  };

  // useEffect(()=>{
  //   filterSearch();
  // },[state])

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;
    if (
      customFunctions.checkIfEmpty(searchKeyword) &&
      customFunctions.checkIfEmpty(selectedEmployee) &&
      customFunctions.checkIfEmpty(fromDate) &&
      customFunctions.checkIfEmpty(toDate)
    ) {
      filterSearchErr = 'Please select atleast one filter';
      setFilterErr(filterSearchErr);
      isValid = false;
    }

    if (!customFunctions.checkIfEmpty(fromDate)) {
      if (customFunctions.checkIfEmpty(toDate)) {
        filterSearchErr = 'Please select To date';
        setFilterErr(filterSearchErr);
        isValid = false;
      }
    } else if (!customFunctions.checkIfEmpty(toDate)) {
      filterSearchErr = 'Please select From date';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getReports(1);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee Timesheet</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              </div>
              <hr />
              <Card.Title>
                <Form onSubmit={(e) => filterSearch(e)}>
                  {filterErr && (
                    <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                      <div className="img-text">
                        <img src="/images/fail.svg" alt="Success" /> {filterErr}
                      </div>
                    </div>
                  )}
                  <Row className="mt-3">
                    <UserRestrictions
                      permittedUsers={[1, 2, 3, 4, 6, 5]}
                      roleId={userRole}
                    >
                      {[1, 2].includes(userRole) ? (
                        <>
                          <Col sm={3}>
                            <TextInput
                              value={searchKeyword}
                              placeholder="Search employee name"
                              onInputChange={(e) => {
                                setSearchKeyword(e.target.value);
                              }}
                            />
                          </Col>
                          <Col sm={3}>
                            <div className="search-bar-input">
                              <DropdownInput
                                options={getEmployeeList()}
                                placeholder="Select employee"
                                defaultValue={selectedEmployee}
                                onSelectHandler={(select) => {
                                  setFilterErr('');
                                  setSelectedEmployee(select);
                                }}
                                isMulti
                              />
                            </div>
                          </Col>
                        </>
                      ) : null}
                    </UserRestrictions>
                    <Col sm={3}>
                      <Datepicker
                        className="form-control"
                        selected={fromDate}
                        onChange={(e) => {
                          setFilterErr('');
                          setFromDate(e);
                        }}
                        autoComplete="off"
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        placeholder="From Date"
                        maxDate={new Date()}
                      />
                    </Col>

                    <Col sm={3}>
                      <Datepicker
                        className="form-control"
                        selected={toDate}
                        onChange={(e) => {
                          setFilterErr('');
                          setToDate(e);
                        }}
                        autoComplete="off"
                        minDate={fromDate}
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        placeholder="To Date"
                        maxDate={new Date()}
                      />
                    </Col>

                    <Col sm={12}>
                      <div className="filter-btn pull-right filter-btn-report">
                        <Button
                          variant="primary"
                          type="submit"
                          className="ms-4"
                        >
                          Apply
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          className="ms-4"
                          onClick={() => onClear()}
                        >
                          Clear
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Title>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Employee Timesheet</h5>
              </div>
              <hr />
              <Row>
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  paginationProps={{
                    ...pagination,
                    activePage: pagination.current_page,
                    onPageChange: (pageNo) => {
                      getReports(pageNo);
                    },
                  }}
                  dropdownContainerClass="mb-3"
                />
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(AllReports);
