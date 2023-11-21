import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import {
  Datepicker,
  Helmet,
  DropdownInput,
  TextInput,
} from '../../components/FormInputs';
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
    value: '0' 
  },
  {
    label: 'Amrut',
    value: '1' 
  }];

const PerformanceReport = () => {
  const [isShowLoader, setShowLoader] = useState(false);
  //   const [rows, setRows] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [userRole, setUserRole] = useState('');
  const [title, setTitle] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [graphData, setGraphData] = useState({
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [10, 100],
        backgroundColor: ['#8cc540', '#e3e3e3'],
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
    setSearchKeyword('');
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
                <h5 className="card-title mb-0 mt-2 ">
                  Employee Performance Report Quality
                </h5>
              </div>
              <hr />
              <Row>
                <Col sm={6}>
                  <Card className="h-100 pie-chart-graph">
                    <Card.Header className="purple-bg">
                      <strong>Task Time</strong>
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(graphData).length && (
                        <Pie data={graphData} />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card className="h-100 pie-chart-graph">
                    <Card.Header className="purple-bg">
                      <strong>Task Quality</strong>
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(graphData).length && (
                        <Pie data={graphData} />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
};

export default PerformanceReport;
