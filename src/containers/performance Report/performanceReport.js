/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import { Pie } from 'react-chartjs-2';
import { Datepicker, Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Table from '../../components/ReactTable/simpletable.component';

const items = [
  { to: '/', label: 'Home' },
  { label: 'Employee Performance Report' },
];

const PerformanceReport = () => {
  const [isShowLoader, setShowLoader] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [allEmployes, setAllEmployes] = useState([]);
  const [joiningDate, setJoingDate] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [totalCompletedPercentage, setTotalCompletedPercentage] =
    useState(null);
  const [rowData, setRowData] = useState('');
  const [documentData, setDocumentData] = useState();
  const [userRole, setUserRole] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      label: 'Employee Name',
      id: 'employee_name',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Total Allocated Task',
      id: 'total_allocated_tasks',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Total Task',
      id: 'total_task_count',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Total Bug',
      id: 'total_bug_count',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Total Reopen',
      id: 'total_reopen_count',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Quality',
      id: 'new_quality_formula',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Productivity',
      id: 'productivity',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      label: 'Time Efficiency',
      id: 'total_time_efficiency_based_on_minutes_in_per',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 8],
    },
  ];

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;
    if (
      allEmployes &&
      allEmployes?.length > 1 &&
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
      getEmployeeById(1);
    }
  };

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  useEffect(() => {
    setTitle('Employee Performance Report');
  }, []);

  useEffect(() => {
    if (!userRole) return;
    // if ([1, 3].includes(userRole)) {
    getEmployeeName();
    // }
  }, [userRole]);

  const getEmployeeName = async () => {
    setShowLoader(true);

    const url = [1].includes(userRole)
      ? `${Api.employeeUrl}?is_employees=true&type=all`
      : `${Api.employeePerformanceUrl}`;
    const { data, error } = await AuthApi.getDataFromServer(url);
    if (data && data?.success) {
      setShowLoader(false);

      const allemp = [];
      data?.data?.map((item) => {
        return allemp.push({
          label: item?.full_name,
          value: item?.id,
          joiningDate: item?.date_joined,
        });
      });
      const all = [
        {
          label: 'All Employess',
          value: 'all_employess',
        },
      ];
      if ([1].includes(userRole)) {
        setAllEmployes([...all, ...allemp]);
      } else {
        setAllEmployes(allemp);
      }
    } else {
      setShowLoader(false);
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  // useEffect(()=>{
  //   if(!selectedEmployee) return;
  // },[selectedEmployee])

  const getEmployeeById = async (pageNo) => {
    setShowLoader(true);
    const endPoint =
      selectedEmployee?.value == 'all_employess'
        ? `${Api.allEmployeePerformanceUrl}`
        : `${Api.employeeReportUrl}`;
    const params = {};
    if (selectedEmployee?.value != 'all_employess') {
      (params.start_date = fromDate ? customFunctions.getDate(fromDate) : ''),
        (params.user_id =
          allEmployes && allEmployes?.length > 1 && selectedEmployeeId
            ? selectedEmployeeId
            : allEmployes[0]?.value),
        (params.end_date = toDate ? customFunctions.getDate(toDate) : '');
    }
    if (selectedEmployee?.value == 'all_employess') {
      (params.limit = 10), (params.page = pageNo);
    }
    // const params = {
    //   start_date:'2023-7-23',
    //   user_id: 15,
    //   end_date: '2023-11-23',
    // };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data?.success) {
      setShowLoader(false);
      if (selectedEmployee?.value == 'all_employess') {
        setPagination({
          current_page: pageNo,
          activePage: Number(data?.data?.page),
          itemsPerPage: Number(data?.data?.page_size),
          totalItems: data?.data?.total_items,
        });
        setRowData(data?.data?.data);
      } else {
        setSelectedEmployeeData(data?.data);
      }
      const incompletedtask = data?.data?.total_reopen_count;
      // - data?.data?.total_task_completed_count;

      setGraphData({
        labels: ['Total tasks count', ' Total bug count', 'Total reopen count'],
        datasets: [
          {
            data: [
              data?.data?.total_task_count,
              data?.data?.total_bug_count,
              incompletedtask,
            ],
            backgroundColor: ['#8cc540', '#FFC107', '#FF0000'],
          },
        ],
      });

      const completedPercentage =
        (100 * data?.data?.total_completed_tasks) /
        data?.data?.total_allocated_tasks;
      setTotalCompletedPercentage(completedPercentage || '0');
    } else {
      setShowLoader(false);
      setSelectedEmployeeData('');
      swal(message || 'Something went wrong', '', 'error');
    }
  };

  const downloadReport = async () => {
    setShowLoader(true);
    const endPoint = `${Api.allEmployeePerformanceUrl}`;
    const params = {
      is_download: true,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data?.success) {
      setShowLoader(false);
      downloadFile(data?.data?.file);
    } else {
      setShowLoader(false);
      swal(message || 'Something went wrong', '', 'error');
    }
  };

  const downloadFile = (fileUrl, fileName) => {
    // const url = window.URL.createObjectURL(new Blob([fileUrl]));
    const link = document.createElement('a');

    link.href = fileUrl;
    link.setAttribute('download', fileName);
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onClear = () => {
    // setFilterErr('');
    setFromDate('');
    setToDate('');
    setRowData('');
    setSelectedEmployee('');
    setSelectedEmployeeData('');
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
                      {allEmployes && allEmployes?.length > 1 && (
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <DropdownInput
                              options={allEmployes}
                              placeholder="Select employee"
                              defaultValue={selectedEmployee}
                              onSelectHandler={(select) => {
                                setFilterErr('');
                                setSelectedEmployee(select);
                                setSelectedEmployeeId(select?.value);
                                setJoingDate(select?.joiningDate);
                                setSelectedEmployeeData('');
                              }}
                              // isMulti
                            />
                          </div>
                        </Col>
                      )}

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
                          minDate={new Date(joiningDate)}
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
                  {rowData && selectedEmployee?.value == 'all_employess' && (
                    <div className="d-flex align-items-center justify-content-end">
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          downloadReport();
                        }}
                      >
                        <Button className="">Download File</Button>
                      </a>
                    </div>
                  )}
                </Card.Title>
              </Card.Body>
            </Card>
          </Row>
          {selectedEmployeeData && (
            <Row>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">
                  Employee Performance Report of{' '}
                  {selectedEmployee
                    ? customFunctions.capitalizeFirstLetter(
                        selectedEmployee?.label
                      )
                    : null}
                </h5>
              </div>
              <hr />
            </Row>
          )}

          {selectedEmployeeData &&
          selectedEmployee?.value != 'all_employess' ? (
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
                        <h3 className="mt-3 mb-3">
                          {selectedEmployeeData?.new_quality_formula
                            ? selectedEmployeeData?.new_quality_formula
                            : 0}
                          %
                        </h3>
                        <p className="mb-0 text-muted">
                          <span
                            className={
                              Math.round(
                                selectedEmployeeData?.new_quality_formula
                              ) > 80
                                ? 'text-success me-2'
                                : 'text-danger me-2'
                            }
                          >
                            <i className="mdi mdi-arrow-down-bold" />{' '}
                            {Math.round(
                              selectedEmployeeData?.new_quality_formula
                            ) > 80
                              ? 'Good Keep It Up'
                              : 'Need Improvment'}
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

                        <h3 className="mt-3 mb-3">
                          {selectedEmployeeData?.total_time_efficiency_based_on_minutes_in_per
                            ? selectedEmployeeData?.total_time_efficiency_based_on_minutes_in_per
                            : 0}
                          %
                        </h3>
                        <p className="mb-0">
                          <span
                            className={
                              selectedEmployeeData?.total_time_efficiency_based_on_minutes_in_per >
                              80
                                ? 'text-dark me-2'
                                : 'text-warning me-2'
                            }
                          >
                            <i className="mdi mdi-arrow-down-bold" />{' '}
                            {selectedEmployeeData?.total_time_efficiency_based_on_minutes_in_per >
                            80
                              ? 'Keep it up'
                              : 'Need to improve'}
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
                          Total Tasks and Bugs
                        </h5>
                        <h3 className="mt-3 mb-3">
                          {selectedEmployeeData?.total_allocated_tasks
                            ? selectedEmployeeData?.total_allocated_tasks
                            : 0}
                        </h3>
                        <p className="mb-0 text-white">
                          <span className="text-white me-2">
                            <i className="mdi mdi-arrow-up-bold" />{' '}
                            {Math.round(totalCompletedPercentage) > 0
                              ? Math.round(totalCompletedPercentage)
                              : 0}
                            %
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
                        <h5
                          className="text-white fw-normal mt-0"
                          title="Growth"
                        >
                          Productivity
                        </h5>
                        <h3 className="mt-3 mb-3">
                          {selectedEmployeeData?.productivity
                            ? selectedEmployeeData?.productivity
                            : 0}
                          %
                        </h3>
                        <p className="mb-0 text-muted">
                          <span
                            className={
                              Math.round(selectedEmployeeData?.productivity) >
                              80
                                ? 'text-success me-2'
                                : 'text-danger me-2'
                            }
                          >
                            <i className="mdi mdi-arrow-down-bold" />{' '}
                            {Math.round(selectedEmployeeData?.productivity) > 80
                              ? 'Good Keep It Up'
                              : 'Need Improvment'}
                          </span>
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
                    {selectedEmployeeData?.total_task_count > 0 ? (
                      <Row>
                        <h5 className="text-center">Performance Effeciency</h5>
                        <Col sm={5}>
                          {Object.keys(graphData).length && (
                            <Pie data={graphData} />
                          )}
                        </Col>
                        <Col
                          sm={7}
                          className="d-flex flex-column justify-content-center"
                        >
                          {/* {selectedEmployeeData?.total_task_count && ( */}
                          <>
                            <div className="d-flex justify-content-start align-items-start">
                              <p
                                className="badge rounded-pill"
                                style={{ backgroundColor: '#8cc540' }}
                              >
                                &nbsp;
                              </p>
                              &nbsp; Total tasks count:{' '}
                              {selectedEmployeeData?.total_task_count
                                ? selectedEmployeeData?.total_task_count
                                : 0}
                            </div>
                            {/* <ul>
                                <li>
                                  Completed Task:{' '}
                                  {
                                    selectedEmployeeData?.total_task_completed_count
                                  }
                                </li>
                                <li>
                                  Incompleted Task:{' '}
                                  {
                                    selectedEmployeeData?.total_task_incomplete_count
                                  }
                                </li>
                              </ul> */}
                          </>
                          {/* )} */}

                          {/* {selectedEmployeeData?.total_bug_count > 0 && ( */}
                          <>
                            <div className="d-flex justify-content-start align-items-start">
                              <p
                                className="badge rounded-pill"
                                style={{ backgroundColor: '#FFC107' }}
                              >
                                &nbsp;
                              </p>
                              &nbsp; Total bug count:{' '}
                              {selectedEmployeeData?.total_bug_count > 0
                                ? selectedEmployeeData?.total_bug_count
                                : 0}
                            </div>
                            {/* <ul>
                                <li>
                                  Completed Bugs:{' '}
                                  {
                                    selectedEmployeeData?.total_bug_completed_count
                                  }
                                </li>
                                <li>
                                  Incompleted Bugs:{' '}
                                  {
                                    selectedEmployeeData?.total_bug_incomplete_count
                                  }
                                </li>
                              </ul> */}
                          </>
                          {/* )} */}

                          {/* {selectedEmployeeData?.total_reopen_count > 0 && ( */}
                          <>
                            <div className="d-flex justify-content-start align-items-start">
                              <p
                                className="badge rounded-pill"
                                style={{ backgroundColor: '#FF0000' }}
                              >
                                &nbsp;
                              </p>
                              &nbsp; Total reopen count:{' '}
                              {selectedEmployeeData?.total_reopen_count
                                ? selectedEmployeeData?.total_reopen_count
                                : 0}
                            </div>
                            {/* <ul>
                                <li>
                                  Completed:{' '}
                                  {
                                    selectedEmployeeData?.total_reopen_completed_count
                                  }
                                </li>
                                <li>
                                  Incompleted:{' '}
                                  {
                                    selectedEmployeeData?.total_reopen_incomplete_count
                                  }
                                </li>
                              </ul> */}
                          </>
                          {/* )} */}
                        </Col>
                      </Row>
                    ) : (
                      'No task performed during this time'
                    )}
                  </div>
                </div>
              </div>
              <hr />
              {/* <div className="col-lg-12">
                <Row className="justify-content-center">
                  <Col md="6">
                    <Card className="shadow">
                      <Card.Body className="p-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <h4 className="mb-0">Time Efficiency =</h4>
                          <p className="mb-0 mx-2">
                            <span className="d-block border-bottom border-1 border-dark">
                              Total Completed Task Time
                            </span>
                            <span className="d-block">
                              Total Given Task Time
                            </span>
                          </p>
                          <h4 className="mb-0">X 100</h4>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6">
                    <Card className="shadow">
                      <Card.Body className="p-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="mb-0">Quality = </span>
                          <div className="rounded-pill bracket-round d-flex align-items-center">
                            <span className="minus-value">1 -</span>
                            <p>
                              <span className="d-block border-bottom border-1 border-dark">
                                (Number Of Bugs + Number Of Reopen )
                              </span>
                              <span className="d-block">
                                Number Of Completed Task
                              </span>
                            </p>
                          </div>
                          <h4 className="mb-0">X 100</h4>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="9">
                    <Card className="shadow">
                      <Card.Body className="p-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="mb-0">Productivity = </span>
                          <div className="rounded-pill bracket-round d-flex align-items-center">
                            <p>
                              <span className="d-block border-bottom border-1 border-dark">
                                Number of Completed Tasks - (Number Of Bugs +
                                Number Of Reopen )
                              </span>
                              <span className="d-block">
                                Number Of Assigned Task
                              </span>
                            </p>
                          </div>
                          <h4 className="mb-0">X 100</h4>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div> */}
            </div>
          ) : rowData && selectedEmployee?.value == 'all_employess' ? (
            <Table
              columns={columns}
              rows={rowData}
              showPagination
              paginationProps={{
                ...pagination,
                activePage: pagination.current_page,
                onPageChange: (pageNo) => {
                  getEmployeeById(pageNo);
                },
              }}
              tableClass="table-striped"
              dropdownContainerClass="mb-3"
              emptyRender={() => (
                <p className="text-center mb-0">No record found</p>
              )}
            />
          ) : null}
        </div>
      </section>
    </>
  );
};

export default PerformanceReport;
