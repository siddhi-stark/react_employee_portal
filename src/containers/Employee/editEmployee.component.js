import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
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
  // const [formSchema, setFormschema] = useState(FormSections);
  // const [taskValue, setTaskValue] = useState('');
  // const [descriptionValue, setDescriptionValue] = useState('');

  // Declare variable Table
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  // const [startTime, setStartTime] = useState(null);
  // const [endTime, setEndTime] = useState(null);
  const title = 'Add Time Log Of Employee';
  const limit = 10;
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee Timesheet' }];
  const history = useHistory();

  const datee = customFunctions.getLocalStorage('date');
  const dataaa = datee.split('-');
  const newDate = dataaa[2] + '-' + dataaa[1] + '-' + dataaa[0]; //eslint-disable-line

  const columns = [
    {
      id: 'index',
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
      start_time: `${newDate} ${customFunctions.getTime(formValues.login)}`,
      // start_time: new Date(formValues.login)
      //   .toISOString()
      //   .replace('T', ' ')
      //   .substr(0, 19),
      end_time: `${newDate} ${customFunctions.getTime(formValues.logout)}`,
      // .toISOString()
      // .replace('T', ' ')
      // .substr(0, 19),
      description: formValues.description,
    };
    const { data } = await AuthApi.postDataToServer(
      Api.employeeTimesheet,
      postData
    );
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          getRowData(1);
        }
      });
    }
  };

  // // Get data for form
  // const getData = async () => {
  //   const { data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}?is_dropdown=1`);
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
    // const date = new Date();
    // const YMDDate = customFunctions.getFormattedDate(date);
    const ID = customFunctions.getLocalStorage('userId');
    // const dateNew = YMDDate.split('-');
    // const FormateedDate = dateNew[2]+'-'+dateNew[1]+'-'+dateNew[0]; //eslint-disable-line
    const page = pageNo || currentPage;
    const endPoint = `${Api.dailyReportUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      date: newDate,
      user_id: ID,
      page,
      limit,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      // setTotalCount(data.paginator.total_count);
      // setLimit(data.paginator.limit);
      // setItemsPerPage(data.paginator.limit);
      // setCurrentPage(Number(data.paginator.current_page));
      if (data.paginator) {
        setTotalCount(data.paginator.total_count || 10);
        setItemsPerPage(data.paginator.limit || 10);
        setCurrentPage(
          data.paginator.current_page ? Number(data.paginator.current_page) : 1
        );
      }

      const newData = [...data.data.evening_data];
      await newData.map((item, i) => {
        const newItem = item;

        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });
      setRowData((data && data.data && data.data.evening_data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

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
        <div className="edit-timelog-btn text-end">
          <Button
            className="float-end"
            onClick={() => history.push('/emp-timesheet')}
          >
            Back
          </Button>
          </div>
          <div className="container">
            <div className="row  mt-4 w-100">
            <div className="col-md-6">
              <p>
                Employee Name: {customFunctions.getLocalStorage('employeeName')}
              </p>
              </div>
              <div className="col-md-6">
              <p>
                Date: {customFunctions.getLocalStorage('date')}
              </p>
              </div>
            </div>
          </div>

          <StarkFormBuilder
            containerClass=""
            formHeaderClass=""
            formSections={FormSections}
            onFormSubmit={(formValues) => {
              submitForm(formValues);
            }}
            options={options}
            callbacks={
              {
                // onTaskName: (value) => {
                //   setTaskValue(value);
                // },
                // onDescription: (value) => {
                //   setDescriptionValue(value);
                // },
                // onDurationCallback: (value) => {
                //   getEndTime(value);
                // },
                // onStartTimeCallback: (value) => {
                //   getStartTime(value);
                // },
              }
            }
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Save"
            showResetBtn={false}
            // resetBtnText="Clear"
            btnContainerClass="form-submit-buttons mt-0"
            isStepForm={false}
          />
          <div className="container">
            <div className="mt-4">
              <CustomTable
                columns={columns}
                rows={rowData}
                role={5}
                showPagination={true}
                tableClass="table-striped"
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
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default withRouter(EditEmployee);
