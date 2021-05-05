import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { TextInput, Datepicker, Helmet } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const columns = [
  {
    id: 'no',
    label: 'Sr. No',
  },
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
  // const [userId, setUserId] = useState(null);
  const [keyword, setKeyword] = useState('');
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

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    let endPoint;
    const hasSearch = keyword !== '';
    endPoint = `${Api.reportListingUrl}?limit=${pagination.itemsPerPage}&page=${page}`;
    if (hasSearch) {
      endPoint = `${endPoint}&keyword=${keyword}`;
    }
    if (fromDate && toDate) {
      endPoint = `${endPoint}&start_date=${customFunctions.getDate(
        fromDate
      )}&end_date=${customFunctions.getDate(toDate)}`;
    }
    // const postData = {
    //   userId: [userId],
    // };
    const { data } = await AuthApi.postDataToServer(endPoint);
    if (data) {
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
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: report.estimation,
          report: (
            <a href={`/daily-report/${dt}/${report.user_id}`}>
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
      // const Id = localStorage.getItem('userId');
      // setUserId(Id);
      setTitle('Reports');
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

    if (fromDate === '' && toDate === '' && keyword === '') {
      filterError = 'Please select data';
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
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title className="d-flex align-items-center justify-content-between">
              <h5 className="m-0">Reports</h5>
              <div className="pull-right">
                <a
                  href="/"
                  className="btn btn-primary filter-btn"
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
                    <Col sm={4}>
                      <div className="search-bar-input">
                        <TextInput
                          inputClass="form-control"
                          value={keyword}
                          placeholder="Search Keyword.."
                          onInputChange={(e) => {
                            setFilterErr('');
                            setKeyword(e.target.value);
                          }}
                        />
                      </div>
                    </Col>

                    <Col sm={4}>
                      <Datepicker
                        className="form-control"
                        selected={fromDate}
                        onChange={(e) => {
                          setFromDate(e);
                        }}
                        autoComplete="off"
                        name="startDate"
                        placeholder="FromDate"
                        errorMessage={filterErr}
                      />
                    </Col>

                    <Col sm={4}>
                      <Datepicker
                        className="form-control"
                        selected={toDate}
                        onChange={(e) => {
                          setToDate(e);
                        }}
                        autoComplete="off"
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                        placeholder="ToDate"
                        errorMessage={filterErr}
                      />
                    </Col>
                  </Row>
                  <Row className="d-flex justify-content-center">
                    <Col sm={3}>
                      <div className="form-group">
                        <Button type="submit" className="btn btn-primary">
                          Filter
                        </Button>
                      </div>
                    </Col>

                    <Col sm={3}>
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
      {/* { showDailyReport && (
        <DashboardNew  dailyReport={(e) => setShowDailyReport(e)} />
      ) } */}
    </>
  );
}

export default withRouter(AllReports);
