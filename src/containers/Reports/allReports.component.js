import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Accordion } from 'react-bootstrap';
import { Datepicker, Helmet, DropdownInput } from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Reports' },
];

function AllReports() {
  // let searchFormSubmit = false;
  const [rows, setRows] = useState([]);
  // const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [title, setTitle] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [userRole, setUserRole] = useState('');

  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'id',
      label: 'userId',
      roleAccess: [1, 2, 3, 4, 5],
      isDisplay: false,
    },
   {
      id: 'createdDate',
      label: 'date',
      roleAccess: [1, 2, 3, 4, 5],
      isDisplay: false,
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5],
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4, 5],
    },

    {
      id: 'date',
      label: 'Date',
      roleAccess: [1, 2, 3, 4, 5],
    },
    {
      id: 'clockin',
      label: 'Clock in',
      roleAccess: [1, 2, 3, 4, 5],
    },
    {
      id: 'clockout',
      label: 'Clock Out',
      roleAccess: [1, 2, 3, 4, 5],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [1, 2, 3, 4, 5],
    },
    {
      id: 'report',
      label: 'View Report',
      roleAccess: [1, 2, 3, 4, 5],
      render: ({ id, createdDate }) => {
        const newDate = customFunctions.getDate(createdDate);
        const dt = new Date(newDate).getTime();
        return (
          <>
            <a href={`/daily-report/${dt}/${id}`}>
              <span className="text-info">View Report</span>
            </a>
          </>
        );
      },
    },
  ];

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.reportListingUrl}`;

    const params = {
      page,
      limit: pagination.itemsPerPage,
      // keyword: searchFormSubmit ? searchKeyword : '',
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
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });
      const row = [];

      data.data.map((report, i) => {
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.user,
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: `${report.estimation} Hrs`,
          id: report.user_id,
          createdDate: report.created_at,
        };
        row.push(setRowData);
        return report;
      });
      setRows(row);
    }
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all`);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setEmployeeList(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
      // getReports(1);
      getEmployee();
      setTitle('Reports');
       const uRole = customFunctions.getLocalStorage('group');
      setUserRole(Number(uRole));
    }
    getData();
  }, []);

  useEffect(() => {
    getReports(1);
  }, [cntClearFilter]);

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
    // searchFormSubmit= false;
    setFilterErr('');
    // setSearchKeyword('');
    setFromDate('');
    setToDate('');
    setSelectedEmployee('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (
      customFunctions.checkIfEmpty(fromDate) &&
      customFunctions.checkIfEmpty(toDate) 
      // customFunctions.checkIfEmpty(searchKeyword)
    ) {
      // searchFormSubmit= false;
      filterSearchErr = 'Please enter dates';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      // searchFormSubmit= true;
      setFilterErr('');
      getReports(1);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary m-0">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Card.Title>
                    <Form onSubmit={(e) => filterSearch(e)}>
                      {filterErr && (
                        <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                          <div className="img-text">
                            <img src="/images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )}
                      <Row className="mt-3">
                       <UserRestrictions permittedUsers={[1,2,3,4]} roleId={userRole}>
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
                        <Col sm={3}>
                          <div className="filter-btn">
                            <Button
                              variant="primary"
                              type="submit"
                              className="ms-4"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="primary"
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
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
          <Card.Header>
          <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Reports</h4>
              </div>
          </Card.Header>
          <Card.Body>
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
