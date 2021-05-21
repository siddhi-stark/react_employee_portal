import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Accordion } from 'react-bootstrap';
import { TextInput, Datepicker, Helmet } from '../../components/FormInputs';
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'id',
      label: 'userId',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    {
      id: 'createdDate',
      label: 'date',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4],
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
      render: ({ id, createdDate }) => {
        const newDate = customFunctions.getDate(createdDate);
        const dt = new Date(newDate).getTime();
        return (
          <>
            <a href={`/daily-report/${dt}/${id}`}>
              <span>View Report</span>
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
      keyword: searchKeyword,
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
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: report.estimation,
          id: report.user_id,
          createdDate: report.created_at,
        };
        row.push(setRowData);
        return report;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    async function getData() {
      getReports(1);
      setTitle('Reports');
    }
    getData();
  }, []);

  useEffect(() => {
    getReports(1);
  }, [cntClearFilter]);

  const onClear = () => {
    setFilterErr('');
    setSearchKeyword('');
    setFromDate('');
    setToDate('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (
      customFunctions.checkIfEmpty(fromDate) &&
      customFunctions.checkIfEmpty(toDate) &&
      customFunctions.checkIfEmpty(searchKeyword)
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
                            <img src="images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )}
                      <Row className="mt-3">
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <TextInput
                              value={searchKeyword}
                              placeholder="Search keyword"
                              onInputChange={(e) => {
                                setFilterErr('');
                                setSearchKeyword(e.target.value);
                              }}
                            />
                          </div>
                        </Col>
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
                            placeholder="From Date"
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
                            dateFormat="MM/dd/yyyy"
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
        </div>
        <div className="mt-3">
          <Card>
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <h5 className="m-0">Reports</h5>
              </Card.Title>
              <Row>
                <Col className="mt-3">
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
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(AllReports);
