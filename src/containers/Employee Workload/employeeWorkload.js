/* eslint-disable */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Datepicker, DropdownInput, Helmet } from '../../components/FormInputs';
// import CustomTable from 'stark-custom-datatable';
import CustomTable from 'stark-custom-datatable';
import { render } from '@testing-library/react';

const EmployeeWorkload = () => {
  
  const titleHeading = 'Employee Workload';
  const [allEmployes, setAllEmployes] = useState({ label: 'All Employees', value: 'all_employees' });
  const [projectList, setProjectList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedProject, setSelectedProject] = useState({ label: "All Projects", value: "all_project", });
  const [selectedTaskStatus, setSelectedStatus] = useState({ label: 'All type', value: 3 })
  console.log("selectedTaskStatus+++++", selectedTaskStatus)
  const [userRole, setUserRole] = useState(null);
  const [isShowLoader, setShowLoader] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employees', value: 'all_employees' });
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [rowData, setRowData] = useState('');
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterErr, setFilterErr] = useState('');
  const history = useHistory();

  console.log('rowData', rowData);

  //breadcrumbs
  const items = [
    { to: '/', label: 'Dashboard' },
    { label: 'Employee Workload' },
  ];

  const taskStatus = [
    {
      label: 'All type',
      value: 3,
    },
    {
      label: 'Pending',
      value: 1,
    },
    {
      label: 'Completed',
      value: 2,
    },

  ];

  // useEffect(()=>{    
  //   if(selectedProject?.value === "all_project") return
  //     getProjectEmployees()
  // },[selectedProject])

  //Column for table
  const columns = [
    {
      id: 'employee_name',
      label: 'Employee Name',
      render: (row) => {
        const rowData = row;
        const name = rowData?.employee_name;
        return <span> {name} </span>;
      },
    },
    {
      id: 'project',
      label: 'Project',
      render: (row) => {
        const rowData = row;
        const projectname = rowData?.project_name;
        return projectname;
      },
    },
    {
      id: 'task_name',
      label: 'Task Name',
      render: (row) => {
        const rowData = row;
        return rowData?.taskName?.length > 50 ? (
          <span title={rowData?.taskName}>
            {' '}
            {rowData?.taskName.slice(0, 50) + '' + '...'}
          </span>
        ) : (
          <span title={rowData?.task_name}>{rowData?.task_name}</span>
        );
      },
    },
    {
      id: 'date',
      label: 'Start Date',
      render: (row) => {
        const rowData = row;
        const startd = customFunctions.getDMYDate(rowData?.start_date);
        return startd;
      },
    },
    {
      id: 'date',
      label: 'End Date',
      render: (row) => {
        const rowData = row;
        const startd = customFunctions.getDMYDate(rowData?.end_date);
        return startd;
      },
    },
    {
      id: 'estimation',
      label: 'ETA',
      render: (row) => {
        const rowData = row;
        function convertToHours(minutes) {
          const hours = Math.floor(minutes / 60);
          const minutesRemaining = minutes % 60;
          return `${hours}:${minutesRemaining < 10 ? '0' : ''
            }${minutesRemaining}`;
        }
        const minutes = rowData?.estimation;
        const totaltime = convertToHours(minutes);
        const Arr = totaltime.split(':');
        const brr = Arr[0];
        const crr = Arr[1];
        const add = `${brr}h.${crr}m`;
        return <span> {add} </span>;
      },
    },
    {
      id: 'time_log',
      label: 'Log Time',

      render: (row) => {
        const rowData = row;
        function convertToHours(minutes) {
          const hours = Math.floor(minutes / 60);
          const minutesRemaining = minutes % 60;
          return `${hours}:${minutesRemaining < 10 ? '0' : ''
            }${minutesRemaining}`;
        }
        const minutes = rowData?.time_log;
        const totaltime = convertToHours(minutes);
        const Arr = totaltime.split(':');
        const brr = Arr[0];
        const crr = Arr[1];
        const add = `${brr}h.${crr}m`;
        return <span> {add} </span>;
      },
    },
    { id: 'status', label: 'Status', 

      render: (row) => {
        const rowData = row;
        return rowData?.status === "completed" ? "Completed" : rowData?.status
      }
    },
  ];

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
      // getTaskData(1);
      getEmployeeById(1);
    }
  };

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');

    setUserRole(Number(uRole));
  }, []);

  //Clear function
  const onClear = () => {
    // setFilterErr('');
    setFromDate('');
    setToDate('');
    setSelectedEmployee('');
    // setSelectedEmployeeData('');
    setCntClearFilter(cntClearFilter + 1);
  };

  //Role access
  useEffect(() => {
    if (!userRole) return;
    // if ([1, 8].includes(userRole)) {
    getEmployeeName();
    // }
  }, [userRole]);

  useEffect(() => {
    getprojectList();
    // getTaskData();
  }, []);

  //API integration for Allproject list
  const getprojectList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.projectListUrl}`;
    const params = {
      sort_by: 'name',
      status: 'active',
      type: 'all'
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    console.log("data=========", data);
    if (data && data.success) {
      const Tempprojects = [];
      data.data &&
        data.data.map((item) => {
          console.log('item-----', item)
          //only added standard user and who is not admin
          // if(item?.roleId ==3  && item?.is_admin == 0){
          Tempprojects.push({
            label: `${item?.name}`,
            value: item?.id,
          });

        });
      const temData = [
        {
          label: "All Projects",
          value: "all_project",
        },
      ];
      setProjectList([...temData, ...Tempprojects]);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, "", "error", {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  //API integration for AllEmployee list
  const getEmployeeName = async () => {
    setShowLoader(true);
    // https://portalsapi.starkdigital.in/api/v1/employee/?sort_by=full_name&limit=9&hide_admin=1&is_onboard=true

    const url = `${Api.getEmployees}?type=all&is_only_dev=1&status=active&hide_admin=1`;
    const { data, error } = await AuthApi.getDataFromServer(url);
    if (data && data?.success) {
      setShowLoader(false);

      const allemp = [];
      data?.data?.map((item) => {
        return allemp.push({
          label: item?.full_name,
          value: item?.id,
          joiningDate: item?.date_joined,
          tw_id: item?.pms_id
        });
      });
      const all = [
        {
          label: 'All Employees',
          value: 'all_employees',
        },
      ];
      if ([1, 8].includes(userRole)) {
        setAllEmployes([...all, ...allemp]);
      } else {
        setAllEmployes(allemp);
      }
    } else {
      setShowLoader(false);
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  //API integration for AllEmployee list
  const getProjectEmployees = async () => {
    setShowLoader(true);
    // https://portalsapi.starkdigital.in/api/v1/employee/?sort_by=full_name&limit=9&hide_admin=1&is_onboard=true

    const url = `${Api.getProjectsEmployee}?type=all&project_id=${+selectedProject?.value}`
    const { data, error } = await AuthApi.getDataFromServer(url);
    if (data && data?.success) {
      setShowLoader(false);

      const allemp = [];
      data?.data?.map((item) => {
        return allemp.push({
          label: item?.full_name,
          value: item?.id,
          joiningDate: item?.date_joined,
          tw_id: item?.pms_id
        });
      });
      const all = [
        {
          label: 'All Employees',
          value: 'all_employees',
        },
      ];
      if ([1, 8].includes(userRole)) {
        setAllEmployes([...all, ...allemp]);
      } else {
        setAllEmployes(allemp);
      }
    } else {
      setShowLoader(false);
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  //Employee detail table listing
  const getEmployeeById = async (pageNo) => {
    const page = pageNo || currentPage;
    setShowLoader(true);
    const endPoint = `${Api.workLoad}`;
    const params = {
      start_date: customFunctions.getDate(fromDate),
      end_date: customFunctions.getDate(toDate),
      page: page,
      limit: limit,
    };

    if (selectedTaskStatus?.value != 3) {
      params.status = +selectedTaskStatus?.value
    }
    if (selectedProject?.value != 'all_project') {
      params.project_id = +selectedProject?.value;
    }
    if (selectedEmployee?.value != 'all_employees') {
      params.user_id = +selectedEmployee?.value;
    }
    if (selectedEmployee?.value == 'all_employees') {
      params.page = page;
      params.limit = limit;
    }
    if (selectedProject?.value == 'all_project') {
      params.page = page;
      params.limit = limit;
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success == true) {
      if (selectedEmployee?.value == 'all_employees') {
        setRowData(data?.data);
        setTotalCount(data?.paginator?.total_count);
        setLimit(data?.paginator?.limit);
        setCurrentPage(Number(data?.paginator?.current_page));
        setShowLoader(false);
      } else {
        setRowData(data?.data);
        setTotalCount(data?.paginator?.total_count);
        setLimit(data?.paginator?.limit);
        setCurrentPage(Number(data?.paginator?.current_page));
        setShowLoader(false);
      }
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const downloadCSVDoc = async () => {
    setShowLoader(true);
    const endPoint = `${Api.workLoad}`;
    const params = {
      start_date: customFunctions.getDate(fromDate),
      end_date: customFunctions.getDate(toDate),
      type: 'all',
      is_download: true,
      page: 1,
      limit: 10,
    };
    if (selectedProject?.value != 'all_project') {
      params.project_id = +selectedProject?.value;
    }
    if (selectedEmployee?.value != 'all_employees') {
      params.user_id = +selectedEmployee?.value;
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data?.success) {
      setShowLoader(false);
      // if (data?.data?.response) {
      //   window.open(data?.data?.response);
      downloadFile(data?.data?.file_name);
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
    // link.rel = 'noreferrer';
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const isValid = () => { };

  const isClear = () => {
    setFilterErr('');
    setSelectedProject({ label: "All Projects", value: "all_project", })
    setSelectedEmployee({ label: 'All Employees', value: 'all_employees' });
    setFromDate(new Date());
    setToDate(new Date());
    setRowData('');
  };

  return (
    <>
      <Row className="d-flex justify-content-between">
        <Col>
          <Helmet title={titleHeading} />
        </Col>
        {/* <Col className="col-3 mt-3"> */}
      </Row>
      <Row>
        <Col>
          <div className="title-breadcrumb-section">
            <h2 className="main-content-title tx-24 mg-b-5">
              Employee Workload
            </h2>
            <Breadcrumb items={items} />
          </div>
          <Loader showLoader={isShowLoader} needFullPage={false} />
        </Col>
      </Row>

      <Card>
        <Card.Body>

          <h5 className="card-title mb-0">Filter</h5>
          <div className='d-flex justify-content-end'>
            <a
              className="d-flex justify-content-end"
              href="javascript:void(0)"
              onClick={() => {
                history.push('/employee-workload-graph', {
                  state: {
                    allEmployes: allEmployes
                  }
                })
              }}
            >
              <u>
                <b>Workload detailed view</b>
              </u>
            </a>
          </div>
          <hr />
          {filterErr && (
            <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
              <div className="img-text">
                <img src="/images/fail.svg" alt="Success" /> {filterErr}
              </div>
            </div>
          )}
          <Row>
            <Col sm={3} className='project-list dropdown-hover'>
              <DropdownInput
              
                label="Select Project"
                options={projectList}
                defaultValue={selectedProject}
                onSelectHandler={(select) => {
                  setFilterErr("");
                  setSelectedProject(select);
                  // setFromDate("");
                  // setToDate("");
                  setRowData("");
                }}
              // isMulti
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                label="Select Employee"
                // asterisk="*"
                options={allEmployes}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setFilterErr('');
                  setSelectedEmployee(select);
                  setSelectedEmployeeId(select?.value);
                  // setFromDate("");
                  // setToDate("");
                  setRowData('');
                  setFilterErr('');
                }}
              // isMulti
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                label="Task Status"
                // asterisk="*"
                options={taskStatus}
                defaultValue={selectedTaskStatus}
                onSelectHandler={(select) => {
                  setFilterErr('');
                  setSelectedStatus(select);
                  setRowData('');
                  setFilterErr('');
                }}
              // isMulti
              />
            </Col>

            {/* {selectedEmployee?.value != "all_employess" && ( */}
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
                  // maxDate={new Date()}
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
                  // maxDate={new Date()}
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
            {/* )} */}
          </Row>
          <Row>
            <Col sm={8}>
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
          <Row>
            <Col sm={8}></Col>
            {/* <Col sm={2}> */}
            {rowData?.length > 0 && (
              <div className='d-flex justify-content-end'>
                <a
                  className="d-flex justify-content-end"
                  href="javascript:void(0)"
                  onClick={() => {
                    downloadCSVDoc();
                  }}
                >
                  <u>
                    <b>Download File</b>
                  </u>
                </a>
              </div>
            )}
            {/* </Col> */}
            {/* </Row>
          <Row> */}
            <Col sm={10}></Col>
          </Row>
        </Card.Body>
      </Card>
      {rowData && (
        <CustomTable
          columns={columns}
          rows={rowData}
          showPagination={true}
          paginationProps={{
            totalItems: totalCount,
            itemsPerPage: limit,
            activePage: currentPage,
            onPageChange: (pageNo) => {
              getEmployeeById(pageNo);
            },
          }}
          tableClass="table-striped"
          showCheckbox={false}
          emptyRender={() => {
            return <center>No record found.</center>;
          }}
        />
      )}
    </>
  );
};
export default EmployeeWorkload;
