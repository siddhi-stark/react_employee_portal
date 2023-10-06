import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Row, Col, Form, Button} from 'react-bootstrap';
import { Helmet, Datepicker } from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { label: 'My Timesheet' },
];

function AllReports() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);

  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      isDisplay: false,
    },
    {
      id: 'date',
      label: 'Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'clockin',
      label: 'In',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'clockout',
      label: 'Out',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: 'report',
      label: 'View Report',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
  ];

  const getReports = async (pageNo = 0) => {
    setShowLoader(true);
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.reportListingUrl}`;

    const params = {
      my_report: true,
      page,
      limit: pagination.itemsPerPage,
      start_date: fromDate ? customFunctions.getDate(fromDate) : '',
      end_date: toDate ? customFunctions.getDate(toDate) : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.postDataToServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setShowLoader(false);
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];
      data.data.map((report, i) => {
        const date = report.created_at;
        const dt = new Date(date).getTime();
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.user,
          date: customFunctions.getDMYDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: `${report.estimation} Hrs`,
          report: (
            <Link to={{pathname:`/daily-report/${dt}/${report.user_id}`, state:{clockin: report.sign_in,clockout: report.sign_out}}}>
              <span className="text-info">View Report</span>
            </Link>
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

    if (!fromDate && !toDate) {
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
        <h2 className="main-content-title tx-24 mg-b-5">My Timesheet</h2>
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
                    <Col sm={4}>
                      <Datepicker
                        className="form-control"
                        selected={fromDate}
                        onChange={(e) => {
                          setFromDate(e);
                          setToDate('')
                        }}
                        autoComplete="off"
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        placeholder="From Date"
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
                        minDate={fromDate}
                        maxDate={new Date()}
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        placeholder="To Date"
                      />
                    </Col>
                    <Col sm={4}>
                      <div className="filter-btn">
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
                <h5 className="card-title mb-0 mt-2 ">My Timesheet</h5>
              </div>
              <hr />
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