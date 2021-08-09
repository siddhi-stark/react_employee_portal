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
    console.log('formValues',formValues.login.toISOString());
    const datee = customFunctions.getLocalStorage('date');
    const dataaa = datee.split('-');
    const newDate = dataaa[2]+'-'+dataaa[1]+'-'+dataaa[0]; //eslint-disable-line
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
      end_time:  `${newDate} ${customFunctions.getTime(formValues.logout)}`,
        // .toISOString()
        // .replace('T', ' ')
        // .substr(0, 19),
      description: formValues.description,
    };
    console.log('postData',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.employeeTimesheet,
      postData
    );
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
          if(result){
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
    const date = new Date();
    const YMDDate = customFunctions.getFormattedDate(date);
    console.log('YMDDate',YMDDate);
    const ID = customFunctions.getLocalStorage('userId');
    console.log('date',date);
    const dateNew = YMDDate.split('-');
    console.log('dateNew',dateNew);
    const FormateedDate = dateNew[2]+'-'+dateNew[1]+'-'+dateNew[0]; //eslint-disable-line
    console.log('FormateedDate',FormateedDate);
    const page = pageNo || currentPage;
    const endPoint = `${Api.dailyReportUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      date: FormateedDate,
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
      setCurrentPage(data.paginator.current_page ? Number(data.paginator.current_page) : 1);
      }


      const newData = [...data.data.evening_data];
      await newData.map((item, i) => {
        // console.log('dsfd',item);
        const newItem = item;
        console.log('page',page);
        console.log('itemsPerPage',itemsPerPage);

        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        console.log('newItem.index',newItem.index);
        return newItem;
      });
      console.log('newData',newData);
      setRowData((data && data.data && data.data.evening_data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  // const getEndTime = (value) => {
  //   setEndTime(value);
  //   getDuration(startTime, value);
  // };

  // useEffect(() => {
  //   getDuration(startTime, endTime);
  // }, [startTime, endTime]);

  // const getDuration = (start, end) => {
  //   if (start && end) {
  //     const dur = defaultValues;
  //     console.log('defaultValues---', defaultValues);
  //     defaultValues = {};
  //     updateDefaultValues({});
  //     const tStartTime = new Date(start);
  //     const tEndTime = new Date(end);
  //     const diffMs = tEndTime - tStartTime;
  //     const timeDiff = customFunctions.msToTime(diffMs);
  //     // const hr = timeDiff.hours;
  //     // const min = timeDiff.minutes;
  //     // const differenceee = `${hr} : ${min}`;
  //     // dur.duration = differenceee;
  //     dur.duration = (timeDiff.hours < 10 ? '0' + timeDiff.hours.toString() : timeDiff.hours.toString()) + ':' + (timeDiff.minutes < 10 ? '0' + timeDiff.minutes.toString() : timeDiff.minutes.toString()); //eslint-disable-line
  //     console.log('dur.duration', dur.duration, dur);
  //     defaultValues = { ...dur };
  //     // updateDefaultValues({...dur});
  //     updateDefaultValues({...dur,login:start, logout:end, task:taskValue, description:descriptionValue });

  //   }
  // };

  // const getStartTime = async (value) => {

  //   console.log('getStartTime--->', value);
  //   console.log('e.getHOurs',value.getHours(),value.getMinutes());
  //   const hrs = value.getHours();
  //   const minutes = value.getMinutes();
  //   setFormschema([]);
  // await formSchema[0].fields.map((section) => {
  //   const sectionData = section;
  //   if (sectionData.name === 'logout') {
  //     const date = new Date(value);
  //     sectionData.minDate=date
  //     const time = setHours(
  //                       setMinutes(date, parseInt(hrs, 10) + 1),
  //                       parseInt(minutes, 10) > 58 ? parseInt(hrs, 10) + 1 : hrs
  //                     )
  //     sectionData.minTime=time;
  //     const timeNew = setHours(setMinutes(new Date(), 59), 23)
  //     sectionData.maxTime=timeNew;
  //   }
  //   {console.log('formSchema',formSchema)} //eslint-disable-line
  //   console.log('sectionData',sectionData); //eslint-disable-line

  //   return sectionData;
  // });
  //   setFormschema([...formSchema]); //eslint-disable-line
  //   getDuration(value);
  //   // time = value;
  //   setStartTime(value);
  //   getDuration(value, endTime);
  // };

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
        <Button className="float-end" onClick= {() => history.push('/emp-timesheet')} >Back</Button>
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
          </div>
        </Card>
      </div>
    </>
  );
}

export default withRouter(EditEmployee);