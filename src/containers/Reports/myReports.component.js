import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Helmet, TextInput, Datepicker } from '../../components/FormInputs';
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
    id: 'name',
    label: 'Employee Name',
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
];

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
  const [showFilter, setShowFilter] = useState(false);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [employeeName, setEmployeeName] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    let endPoint;
    endPoint = `${Api.timeSheetUrl}?limit=${pagination.itemsPerPage}&page=${page}`;

    if (fromDate && toDate) {
      endPoint = `${endPoint}&start_date=${customFunctions.getDate(
        fromDate
      )}&end_date=${customFunctions.getDate(toDate)}`;
    }
    const { data } = await AuthApi.getDataFromServer(endPoint);
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
        setEmployeeName(report.emp_name);
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.emp_name,
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: report.estimation,
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
  }, []);

  const onFilter = (e) => {
    e.preventDefault();
    let filterError = '';
    let isValid = true;

    if (fromDate === '' && toDate === '') {
      filterError = 'Please select date';
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
                          containerClass="form-group"
                          type="name"
                          name="text"
                          value={employeeName}
                          disabled
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
              {pagination.totalItems > 0 ? (
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
              ) : (
                <Col>
                  <p className="text-center mb-0">No record found</p>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(AllReports);
