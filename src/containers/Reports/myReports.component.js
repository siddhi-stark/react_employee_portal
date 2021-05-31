import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Accordion } from 'react-bootstrap';
import { Helmet, Datepicker } from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Reports' },
];

function AllReports() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    {
      id: 'date',
      label: 'Date',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'clockin',
      label: 'Clock in',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'clockout',
      label: 'Clock Out',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'report',
      label: 'View Report',
      roleAccess: [1, 2, 3, 4],
    },
  ];

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.reportListingUrl}`;

    const params = {
      page,
      limit: pagination.itemsPerPage,
      start_date: fromDate ? customFunctions.getDate(fromDate) : '',
      end_date: toDate ? customFunctions.getDate(toDate) : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.postDataToServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

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

  useEffect(() => {
    setTitle('Reports');
  }, []);

  useEffect(() => {
    getReports(1);
  }, [cntClearFilter]);

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (
      !fromDate &&
      !toDate
    ) {
      filterSearchErr = 'Please select dates';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getReports(1);
    }
  };

  const onClear = () => {
    setFilterErr('');
    setFromDate('');
    setToDate('');
    setCntClearFilter(cntClearFilter + 1);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">My Report</h2>
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
                            <img src="images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )}
                      <Row className="mt-3">

                        <Col sm={3}>
                          <Datepicker
                            className="form-control"
                            selected={fromDate}
                            onChange={(e) => {
                              setFromDate(e);
                            }}
                            autoComplete="off"
                            name="startDate"
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                            placeholder="From Date"
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
                            maxDate={new Date()}
                            name="startDate"
                            dateFormat="dd/MM/yyyy"
                            placeholder="To Date"
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
                tableClass="table-striped"
                dropdownContainerClass="mb-3"
                emptyRender={() => (
                  <p className="text-center mb-0">No record found</p>
                )}
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
