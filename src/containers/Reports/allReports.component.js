import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { TextInput, Datepicker } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const columns = [
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'clockin',
    label: 'Clock in',
  },
  {
    id: 'clockout',
    label: 'Clock Out',
  },
  {
    id: 'total',
    label: 'Total Working',
  },
  {
    id: 'report',
    label: 'View Report',
  },
];

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Reports' },
];

function AllReports() {
  const [rows, setRows] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [userId, setUserId] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    let endPoint;
    const hasSearch = keyword !== '';
    endPoint = `${Api.reportUrl}?limit=${pagination.itemsPerPage}&page=${page}`;
    if (hasSearch) {
      endPoint = `${endPoint}keyword=${keyword}&`;
    }
    if (fromDate && toDate) {
      endPoint = `${endPoint}&start_date=${customFunctions.getDate(
        fromDate
      )}&end_date=${customFunctions.getDate(toDate)}`;
    }
    const postData = {
      userId: [userId],
    };
    const { data } = await AuthApi.postDataToServer(endPoint, postData);
    if (data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });
      const row = [];
      data.data.map((report) => {
        const date = customFunctions.getDate(report.created_at);
        const dt = new Date(date).getTime();
        row.push({
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: report.estimation,
          report: (
            <a href={`/daily-report/${dt}`}>
              <span>View Report</span>
            </a>
          ),
        });
        return report;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    async function getData() {
      getReports(1);
      const Id = localStorage.getItem('userId');
      setUserId(Id);
    }
    getData();
  }, []);

  useEffect(() => {
    getReports(1);
  }, [cntClearFilter]);

  const onFilter = (e) => {
    e.preventDefault();
    let filterError = '';
    let isValid = true;

    if (fromDate === '' && toDate === '') {
      filterError = 'Please select Dates';
      setFilterErr(filterError);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getReports(1);
    }
  };

  const onClear = () => {
    setFilterErr('');
    setKeyword('');
    setFromDate('');
    setToDate('');
    setCntClearFilter(cntClearFilter + 1);
  };

  return (
    <>
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title>
              Reports
              <div className="pull-right">
                <a
                  href="/"
                  className=""
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFilter(true);
                  }}
                >
                  <img src="images/filter.svg" alt="filter" />
                </a>
              </div>
            </Card.Title>
            <Row>
              {showFilter && (
                <Form onSubmit={(e) => onFilter(e)}>
                  <Row className="mt-3">
                    <Col sm={2}>
                      <div className="search-bar-input">
                        <TextInput
                          inputClass="form-control"
                          value={keyword}
                          placeholder="search.."
                          onInputChange={(e) => {
                            setFilterErr('');
                            setKeyword(e.target.value);
                          }}
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
                        dateFormat="MM/dd/yyyy"
                        placeholderText=" MM/DD/YYYY"
                        errorMessage={filterErr}
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
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                        placeholderText=" MM/DD/YYYY"
                        errorMessage={filterErr}
                      />
                    </Col>

                    <Col sm={2}>
                      <div className="form-group">
                        <Button type="submit" className="btn btn-primary">
                          Filter
                        </Button>
                      </div>
                    </Col>

                    <Col sm={2}>
                      <div className="form-group">
                        <Button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => onClear()}
                        >
                          Clear
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}

              <Col className="mt-3">
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  showCheckbox
                  paginationProps={{
                    ...pagination,
                    onPageChange: (pageNo) => {
                      getReports(pageNo);
                    },
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      {/* { showDailyReport && (
        <DashboardNew  dailyReport={(e) => setShowDailyReport(e)} />
      ) } */}
    </>
  );
}

export default withRouter(AllReports);
