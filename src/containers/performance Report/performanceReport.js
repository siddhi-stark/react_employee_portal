import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Datepicker, Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { label: 'Employee Performance Report' },
];

const options = [
  {
    label: 'Riyaz',
    value: '0',
  },
  {
    label: 'Amrut',
    value: '1',
  },
];

const PerformanceReport = () => {
  const [isShowLoader, setShowLoader] = useState(false);
  //   const [rows, setRows] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [userRole, setUserRole] = useState('');
  const [title, setTitle] = useState('');
  // const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [graphData, setGraphData] = useState({
    datasets: [
      {
        data: [90, 5, 5],
        backgroundColor: ['#8cc540', '#e3e3e3', '#FF0000'],
      },
    ],
  });

  console.log('userRole', userRole);
  // console.log('graphData', graphData);

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;
    if (
      // customFunctions.checkIfEmpty(searchKeyword) &&
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
      setShowLoader('');
      setGraphData();
    }
  };

  useEffect(() => {
    setUserRole('null');
    setTitle('Employee Performance Report');
  }, []);

  const onClear = () => {
    // setFilterErr('');
    setFromDate('');
    setToDate('');
    // setSearchKeyword('');
    setSelectedEmployee([]);
    setCntClearFilter(cntClearFilter + 1);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">
          Employee Performance Report
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          <Row>
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
                          <img src="/images/fail.svg" alt="Success" />{' '}
                          {filterErr}
                        </div>
                      </div>
                    )}
                    <Row className="mt-3">
                      {/* <Col sm={3}>
                      <TextInput
                        value={searchKeyword}
                        placeholder="Search employee name"
                        onInputChange={(e) => {
                          setSearchKeyword(e.target.value);
                        }}
                      />
                    </Col> */}
                      <Col sm={3}>
                        <div className="search-bar-input">
                          <DropdownInput
                            options={options}
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
                      <Col sm={3}>
                        <Datepicker
                          className="form-control"
                          selected={fromDate}
                          onChange={(e) => {
                            setFromDate(e);
                            setToDate('');
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
          </Row>
          <Row>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">
                Employee Performance Report Quality
              </h5>
            </div>
          </Row>
          <hr />
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6">
              <div className="row">
                <div className="col-sm-6">
                  <div className="card widget-flat bg-primary text-white">
                    <div className="card-body">
                      <div className="float-end">
                        <i className="mdi mdi-cart-plus widget-icon" />
                      </div>
                      <h5
                        className="text-white fw-normal mt-0"
                        title="Number of Orders"
                      >
                        Quality
                      </h5>
                      <h3 className="mt-3 mb-3">60%</h3>
                      <p className="mb-0 text-muted">
                        <span className="text-danger me-2">
                          <i className="mdi mdi-arrow-down-bold" /> Need
                          improvment
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card widget-flat bg-success text-white">
                    <div className="card-body">
                      <div className="float-end">
                        <i className="mdi mdi-currency-usd widget-icon" />
                      </div>
                      <h5
                        className="text-white fw-normal mt-0"
                        title="Average Revenue"
                      >
                        Time Effeciency
                      </h5>
                      <h3 className="mt-3 mb-3">85%</h3>
                      <p className="mb-0">
                        <span className="text-success me-2">
                          <i className="mdi mdi-arrow-down-bold" /> Keep it up
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="card widget-flat bg-info text-white">
                    <div className="card-body">
                      <div className="float-end">
                        <i className="mdi mdi-account-multiple widget-icon" />
                      </div>
                      <h5
                        className="text-white fw-normal mt-0"
                        title="Number of Customers"
                      >
                        Total Tasks Allocated
                      </h5>
                      <h3 className="mt-3 mb-3">50</h3>
                      <p className="mb-0 text-white">
                        <span className="text-white me-2">
                          <i className="mdi mdi-arrow-up-bold" /> 90%
                        </span>
                        <span className="text-nowrap">Completed</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card widget-flat bg-warning text-white">
                    <div className="card-body">
                      <div className="float-end">
                        <i className="mdi mdi-pulse widget-icon" />
                      </div>
                      <h5 className="text-white fw-normal mt-0" title="Growth">
                        Reported Bug count
                      </h5>
                      <h3 className="mt-3 mb-3">20</h3>
                      <p className="mb-0">
                        <span className="text-success me-2">
                          <i className="mdi mdi-arrow-up-bold" /> 20
                        </span>
                        <span className="text-nowrap">Since last month</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-7 col-lg-6">
              <div className="card card-h-100">
                {/* <div className="d-flex card-header justify-content-between align-items-center bg-transparent border-bottom-0">
                      <h4 className="header-title">Projections Vs Actuals</h4>
                    </div> */}
                <div className="card-body">
                  <Row>
                    <Col sm={5}>
                      <h5 className="text-center">Card title</h5>
                      {Object.keys(graphData).length && (
                        <Pie data={graphData} />
                      )}
                    </Col>
                    <Col
                      sm={5}
                      className="d-flex flex-column align-items-center justify-content-center"
                    >
                      <div className='d-flex flex-row'>
                      <p className="badge rounded-pill bg-info p-2">&nbsp;</p>{' '}
                      Completed tasks 
                      </div>
                      <div className='d-flex flex-row'>
                      <p className="badge rounded-pill bg-danger">
                        &nbsp;
                      </p>
                      Overdue task 5 
                      </div>
                      <div className='d-flex flex-row'>
                      <p className="badge rounded-pill bg-warning">
                        &nbsp;
                      </p>{' '}
                      Incompleted tasks
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PerformanceReport;
