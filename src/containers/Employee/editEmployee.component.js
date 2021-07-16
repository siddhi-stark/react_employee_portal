import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
// import { setHours, setMinutes } from 'date-fns';
import StarkFormBuilder from 'stark-form-builder';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import FormSections from './editEmployee.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';

function EditEmployee(props) {
  // let time = '';
  // Variable declarations
  let [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [toggle, setToggle] = useState(false);

  // Declare variable Table
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const title = 'Add Time Log Of Employee';
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee Timesheet' }];

  const columns = [
    {
      id: 'no',
      label: 'Sr.No',
    },
    {
      id: 'project_name',
      label: 'Project',
    },
    {
      id: 'activity',
      label: 'Task Name',
    },
    {
      id: 'start_date',
      label: 'Start Time',
    },
    {
      id: 'end_date',
      label: 'Finish Time',
    },
    {
      id: 'actual_estimation',
      label: 'Duration/Estimation',
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'note',
      label: 'Note',
    },
  ];

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    const id = props.match.params.employeeId;
    // const loginDate = formValues.login.replace('T', ' ');
    // const login = loginDate.split('.')[0]
    const postData = {
      user_id: Number(id),
      content: formValues.task,
      start_time: new Date(formValues.login)
        .toISOString()
        .replace('T', ' ')
        .substr(0, 19),
      end_time: new Date(formValues.logout)
        .toISOString()
        .replace('T', ' ')
        .substr(0, 19),
      description: formValues.description,
    };
    const { data } = await AuthApi.postDataToServer(
      Api.employeeTimesheet,
      postData
    );
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setToggle(true);
      }
    });
    }
  };

  // // Get data for form
  // const getData = async () => {
  //   const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
  //   if (!data) {
  //     // show error
  //     return;
  //   }
  //   updateDefaultValues(data);
  // };

  // // Call get data method on load
  // useEffect(() => {
  //   getData();
  // }, []);

  // Declare methods table
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.dailyReportUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      page,
      limit,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    console.log('data', data);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data && data.data.evening_data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  const getEndTime = (value) => {
    setEndTime(value);
    getDuration(startTime, value);
  };

  // useEffect(() => {
  //   getDuration(startTime, endTime);
  // }, [startTime, endTime]);

  const getDuration = (start, end) => {
    if (start && end) {
      const dur = defaultValues;
      defaultValues = {};
      updateDefaultValues({});
      const tStartTime = new Date(start);
      const tEndTime = new Date(end);
      const diffMs = tEndTime - tStartTime;
      const timeDiff = customFunctions.msToTime(diffMs);
      // const hr = timeDiff.hours;
      // const min = timeDiff.minutes;
      // const differenceee = `${hr} : ${min}`;
      // dur.duration = differenceee;
      dur.duration = (timeDiff.hours < 10 ? '0' + timeDiff.hours.toString() : timeDiff.hours.toString()) + ':' + (timeDiff.minutes < 10 ? '0' + timeDiff.minutes.toString() : timeDiff.minutes.toString()); //eslint-disable-line
      console.log('dur.duration', dur.duration, dur);
      defaultValues = { ...dur };
      updateDefaultValues({ ...dur });
    }
  };

  const getStartTime = (value) => {
    console.log('getStartTime--->', value);
    // getDuration(value);
    // time = value;
    setStartTime(value);
    getDuration(value, endTime);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <div className="mt-4 edit-timelog">
        <Card body>
          <div className="d-flex justify-content-center mt-4">
            <p>
              Employee Name: {customFunctions.getLocalStorage('employeeName')}
            </p>
            <p className="ms-4">
              Date: {customFunctions.getLocalStorage('date')}
            </p>
          </div>
          <StarkFormBuilder
            containerClass=""
            formHeaderClass=""
            formSections={FormSections}
            onFormSubmit={(formValues) => {
              submitForm(formValues);
            }}
            options={options}
            callbacks={{
              onDurationCallback: (value) => {
                getEndTime(value);
              },
              onStartTimeCallback: (value) => {
                getStartTime(value);
              },
            }}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Save"
            showResetBtn={false}
            // resetBtnText="Clear"
            btnContainerClass="form-submit-buttons mt-0"
            isStepForm={false}

            // onFormReset={() => {
            //   console.log('form reset callback');
            // }}
          />
          <div className="mt-4">
            {toggle && (
              <CustomTable
                columns={columns}
                rows={rowData}
                role={5}
                showPagination={true}
                paginationProps={{
                  totalItems: totalCount,
                  itemsPerPage: limit,
                  activePage: currentPage,
                  onPageChange: (pageNo) => {
                    getRowData(pageNo);
                  },
                }}
                emptyRender={() => {
                  return 'No record found.';
                }}
              />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export default withRouter(EditEmployee);
