/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Datepicker, DropdownInput, Helmet } from '../../components/FormInputs';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const EmployeeWorkloadTable = () => {
  const state = useLocation();
  const history = useHistory();

  const titleHeading = 'Workload Detailed View';
  const allEmployes = state?.state?.state?.allEmployes
  const [isShowLoader, setShowLoader] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employees', value: 'all_employees' });
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [rowData, setRowData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [filterErr, setFilterErr] = useState('');

  useEffect(() => {
    if (rowData?.length) {
      setTablesData();
    }
  }, [rowData]);

  useEffect(()=>{
    if(selectedEmployee){
      setTableData([])
      setFromDate(new Date())
      setToDate(new Date())
    }
  },[selectedEmployee])

  const generateDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];

    while (startDate <= endDate) {
      if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
        dateArray.push(startDate.toISOString().split('T')[0]);
      }
      startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
  };

  const getTaskCountPerDay = (tasks, fromDate, toDate) => {
    const dateRange = generateDateRange(fromDate, toDate);
    const employeeTaskData = {};

    tasks.forEach((task) => {
      const { employee_name, start_date, end_date, employee_tw_id } = task;
      console.log
      ("employee_name, start_date, end_date, employee_tw_id",employee_name, start_date, end_date, employee_tw_id)
      if (!employeeTaskData[employee_tw_id]) {
        employeeTaskData[employee_tw_id] = {};
        dateRange.forEach((date) => (employeeTaskData[employee_tw_id][date] = 0));
        employeeTaskData[employee_tw_id]['employee_name'] = employee_name;

      }
      dateRange.forEach((date) => {
        if (date >= start_date && date <= end_date) {
          employeeTaskData[employee_tw_id][date] += 1;
        }
      });
    });

    if (selectedEmployee?.value === 'all_employees') {
      allEmployes.forEach((employeeDetails, index) => {
        const { label, tw_id } = employeeDetails;
        if (label !== 'All Employees') {
          if (!employeeTaskData[tw_id]) {
            employeeTaskData[tw_id] = {};
            dateRange.forEach((date) => (employeeTaskData[tw_id][date] = 0));
            employeeTaskData[tw_id]['employee_name'] = label;
          }
        }
      })
    }

    if (employeeTaskData.hasOwnProperty('undefined')) {
      delete employeeTaskData['undefined'];
    }

    return { employeeTaskData, dateRange };
  };

  const setTablesData = () => {
    const { employeeTaskData, dateRange } = getTaskCountPerDay(rowData, fromDate, toDate);
    const length = Object.keys(employeeTaskData).length;
    setTableData(employeeTaskData);
    setDateRange(dateRange)
  };

  const getEmployeeById = async () => {
    setShowLoader(true);
    const endPoint = `${Api.workLoad}`;
    const params = {
      type: "all"
    };

    if (selectedEmployee?.value !== 'all_employees') {
      params.user_id = +selectedEmployee?.value;
    }
    if (fromDate) {
      params.start_date = customFunctions.getDate(fromDate)
    }
    if (fromDate) {
      params.end_date = customFunctions.getDate(toDate)
    }

    const url = customFunctions.generateUrl(endPoint, params);

    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success === true) {
      setRowData(data?.data);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };


  const getBorderColor = (taskCount) => {
    if (taskCount === 0) {
      return 'rgba(255, 0, 0, 0.5)';
    } else if (taskCount >= 8) {
      return 'rgba(0, 128, 0, 0.5)';
    } else if (taskCount > 0 && taskCount < 8) {
      return 'rgba(255, 165, 0, 0.5)';  // Orange for more than 5 tasks
    }
    return '#ddd'; // Default border color (light gray)
  };

  //FilterSearch function and validation
  const filterSearch = (e) => {
    let filterSearchErr = '';
    let isValid = true;
    if (customFunctions.checkIfEmpty(selectedEmployee)) {
      filterSearchErr = 'Please select atleast one filter';
      setFilterErr(filterSearchErr);
      isValid = false;
    } else if (
      selectedEmployee &&
      selectedEmployee?.value != 'all_employees' &&
      customFunctions.checkIfEmpty(fromDate)
    ) {
      filterSearchErr = 'Please select From date';
      setFilterErr(filterSearchErr);
      isValid = false;
    } else if (
      selectedEmployee &&
      selectedEmployee?.value != 'all_employees' &&
      customFunctions.checkIfEmpty(toDate)
    ) {
      filterSearchErr = 'Please select To date';
      setFilterErr(filterSearchErr);
      isValid = false;
    } else {
      setFilterErr('');
      setShowLoader('');
      getEmployeeById();
    }
  };

  const isClear = () => {
    setFilterErr('');
    setSelectedEmployee({ label: 'All Employees', value: 'all_employees' });
    setFromDate(new Date());
    setToDate(new Date());
    setRowData('');
    setTableData('');

  };

  return (
    <>
      <Row className="d-flex justify-content-between">
        <Col>
          <Helmet title={titleHeading} />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="title-breadcrumb-section">
            <h2 className="main-content-title tx-24 mg-b-5">
              Workload Detailed View
            </h2>
          </div>
          <Loader showLoader={isShowLoader} needFullPage={false} />
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
              type="submit"
              onClick={() => {
                history.push('/employee-workload')
              }}
            >
              Back
            </Button>
          </div>
          <h5 className="card-title mb-0">Filter</h5>
          <hr />
          {filterErr && (
            <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
              <div className="img-text">
                <img src="/images/fail.svg" alt="Success" /> {filterErr}
              </div>
            </div>
          )}
          <Row>
            <Col sm={2}>
              <DropdownInput
                label="Select Employee"
                options={allEmployes}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setFilterErr('');
                  setSelectedEmployee(select);
                  setRowData('');
                  setFilterErr('');
                }}
              />
            </Col>

            <>
              <Col sm={2}>
                <Datepicker
                  className="form-control"
                  label="Select from date"
                  asterisk="*"
                  selected={fromDate}
                  onChange={(e) => {
                    setFromDate(e);
                    setToDate(null);
                  }}
                  autoComplete="off"
                  name="startDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select from date"
                />
              </Col>
              <Col sm={2}>
                <Datepicker
                  className="form-control"
                  label="Select to date"
                  asterisk="*"
                  selected={toDate}
                  maxDate={fromDate ? new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}
                  minDate={fromDate}
                  onChange={(e) => {
                    setToDate(e);
                  }}
                  autoComplete="off"
                  name="startDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select to date"
                />
              </Col>
            </>
            <Col sm={6} className='mt-4 pt-2'>
              <Button
                onClick={() => {
                  filterSearch();
                }}
              >
                Submit
              </Button>{' '}
              &nbsp;
              <Button
                variant="secondary"
                onClick={() => {
                  isClear();
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div>
            <table className="table table-striped m-0">
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{
                    textAlign: 'center',
                  }}>Sr. No.</th>
                  <th >Employee Name</th>
                  {dateRange.map((date) => (
                    <th key={date} style={{
                      textAlign: 'center',
                    }}>
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(tableData).map(([employee, tasksPerDay], index) => (
                  <tr key={employee}>
                    <td style={{
                      textAlign: 'center',
                    }}>
                      {index + 1} 
                    </td>
                    <td >{tasksPerDay['employee_name']}</td>
                    {dateRange.map((date) => (
                      <td
                        key={date}
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              border: `4px solid ${getBorderColor(tasksPerDay[date])}`,
                              color: '#000',
                              lineHeight: '30px', // To vertically center the text inside the circle
                              position: 'relative',
                              zIndex: 2,
                              backgroundColor: 'white', // To ensure the text is visible
                            }}
                          >
                            {tasksPerDay[date]}
                          </span>
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              border: '4px solid transparent',
                              borderTop: '4px solid blue',
                              animation: 'spin 1s linear infinite', // Add spinning animation
                              zIndex: 1,
                            }}
                          />
                          <style>
                            {`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}
                          </style>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card.Body>
      </Card>
    </>
  );
};

export default EmployeeWorkloadTable;
