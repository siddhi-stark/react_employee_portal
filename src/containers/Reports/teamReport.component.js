import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Accordion } from 'react-bootstrap';
import { Helmet, Datepicker, DropdownInput } from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const items = [
  { to: '/', label: 'Home' },
  { to: '/team-report', label: 'Team Report' },
];

function TeamReport() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchKeyword, setKeyword] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [team, setTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [3,2,6],
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [3,2,6],
    },
    {
      id: 'date',
      label: 'Date',
      roleAccess: [3,2,6],
    },
    {
      id: 'clockin',
      label: 'Clock in',
      roleAccess: [3,2,6],
    },
    {
      id: 'clockout',
      label: 'Clock Out',
      roleAccess: [3,2,6],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [3,2,6],
    },
    {
      id: 'report',
      label: 'View Report',
      roleAccess: [3,2,6],
    },
  ];

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.reportListingUrl}?my_team=true`;

    const params = {
      limit: pagination.itemsPerPage,
      page,
      keyword: searchKeyword,
      start_date: fromDate ? customFunctions.getDate(fromDate) : '',
      end_date: toDate ? customFunctions.getDate(toDate) : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);

    let postData = {};
    const employeeList = [];
    if (selectedEmployee && selectedEmployee.length > 0) {
      selectedEmployee.map((emp) => {
        employeeList.push(emp.id);
        return emp;
      });
    }

    postData = {
      users: employeeList,
    };

    const payload = customFunctions.cleanObject(postData);

    const { data } = await AuthApi.postDataToServer(url, payload);
    if (data && data.data) {
      if (data.paginator && Object.keys(data.paginator).length > 0) {
        setPagination({
          current_page: Number(data.paginator.current_page),
          activePage: data.paginator.current_page,
          itemsPerPage: data.paginator.limit,
          totalItems: data.paginator.total_count,
        });
      }
      const row = [];
      data.data.map((report, i) => {
        const date = customFunctions.getDate(report.created_at);
        const dt = new Date(date).getTime();
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.user,
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: `${report.estimation} Hrs`,
          report: (
            <a href={`/daily-report/${dt}/${report.user_id}`}>
              <span className="text-info">View Report</span>
            </a>
          ),
        };
        row.push(setRowData);
        return report;
      });
      setRows(row);
    }
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.teamUrl}`);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setTeam(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
      getReports(1);
      setTitle('Team Report');
      getEmployee();
    }
    getData();
  }, []);

  useEffect(() => {
    getReports(1);
  }, [cntClearFilter]);

  const getTeamList = () => {
    if (!team) return [];
    const options = [];
    team.map((tm) => {
      return options.push({
        label: tm.employee_name,
        id: tm.employee_id,
        value: tm.employee_id,
      });
    });
    return options;
  };

  const onClear = () => {
    setFilterErr('');
    setKeyword('');
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
      customFunctions.checkIfEmpty(toDate) &&
      customFunctions.checkIfEmpty(selectedEmployee)
    ) {
      filterSearchErr = 'Please enter search keyword';
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
        <h2 className="main-content-title tx-24 mg-b-5">Team Report</h2>
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
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <DropdownInput
                              options={getTeamList()}
                              placeholder="Select team member"
                              defaultValue={selectedEmployee}
                              onSelectHandler={(select) => {
                                setSelectedEmployee(select);
                              }}
                              isMulti
                            />
                          </div>
                        </Col>

                        <Col sm={3}>
                          <Datepicker
                            className="form-control"
                            selected={fromDate}
                            onChange={(e) => {
                              setFromDate(e);
                            }}
                            autoComplete="off"
                            name="startDate"
                            placeholder="From Date"
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                          />
                        </Col>

                        <Col sm={3}>
                          <Datepicker
                            className="form-control"
                            selected={toDate}
                            onChange={(e) => {
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
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </section>
      <div className="mt-3">
        <Card>
          <Card.Body>
          <Card.Header>
          <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Team Reports</h4>
              </div>
          </Card.Header>
            <Row>
              <div className="mt-3">
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
              </div>
            {(rows.length < 1) && (
                <p className="text-center"> No records found</p>
              )}
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(TeamReport);
