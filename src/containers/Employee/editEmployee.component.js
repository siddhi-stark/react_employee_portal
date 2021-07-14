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

function EditEmployee(props) {
  let time = '';
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);

  // Declare variable Table
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
// const [jsonSchema, updateJsonSchema] = useState(FormSections);

 // useEffect(() => {
 //  const formSchema = [...FormSections];
 //  formSchema[0].fields.map((section) => {
 //   // console.log('section',section);
 //    const sectionData = section;
 //    if (sectionData.name === 'login') {
 //      // const date = new Date();
 //      // sectionData.minDate = date;
 //      // sectionData.minTime = setHours(setMinutes(date, parseInt(timeMinutes, 10) + 1), parseInt(timeMinutes, 10) > 58 ? parseInt(timeHour, 10) + 1 : timeHour);
 //      // sectionData.maxTime = setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours());
 //  };
 //    return section;
 //  });
 //  }, []);

//   useEffect(() => {

//     const formSchema = [...FormSections];
//     formSchema[0].fields.map((section) => {
//       const sectionData = section;
//       if (sectionData.name === 'logout') {
//         const date = new Date();
//         sectionData.minDate = date;
//       }
//       return sectionData;
//     });
// updateJsonSchema[...formSchema])
//   }, [])

  // Declare columns
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
    console.log('formValues', formValues.login);
    console.log('formValues', setFilterData);
    // const loginDate = formValues.login.replace('T', ' ');
    // const login = loginDate.split('.')[0]
    const postData = {
      user_id:Number(id),
      content: formValues.task,
      start_time: customFunctions.getTimeFormatter(formValues.login),
      end_time: customFunctions.getTimeFormatter(formValues.logout),
      description:formValues.description

    }
    console.log('postData',postData);
    const { data } = await AuthApi.postDataToServer(Api.employeeTimesheet, formValues);
     if(data) {
       console.log('data',data);
       console.log('message',data.message[0]);
       swal(data && data.message[0]);
       
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
    console.log('value',value);
    // console.log('startTIme',startTime);
    console.log('timeeeeee',time);
    const tEndTime = new Date(value);
    const tStartTime = new Date(time);
    const diffMs = (tEndTime - tStartTime);
    const timeDiff = customFunctions.msToTime(diffMs);
    // console.log('diffference',timeDiff);
    // console.log('timeDiff.hours + timeDiff.minutes',timeDiff.hours + timeDiff.minutes);
    const hr = timeDiff.hours;
    const min = timeDiff.minutes;
    const differenceee = `${hr} : ${min}`;
    console.log('differenceee',differenceee);
    // console.log('defaultValues',defaultValues);
    console.log('hours',hr,min);
    const dur = defaultValues;
    dur.duration = differenceee;
    // dur.duration = timeDiff.hours.toString().length < 10 ?  '0' + timeDiff.hours.toString() : timeDiff.hours.toString() + ':' + timeDiff.minutes.toString().length < 10 ? '0' + timeDiff.minutes.toString() : timeDiff.minutes.toString() //eslint-disable-line
    console.log('dur.duration', dur.duration);
    updateDefaultValues({...dur});

  }

  const getStartTime = (value) => {
    // getDuration(value);
    console.log('value',value);
    time = value
  }

  return (
    <div className="mt-4 edit-timelog">
    console.log('startTime',time)
      <Card body>
        <div className="d-flex justify-content-center mt-4">
          <p>Employee Name: Shubham Bhise</p>
          <p className="ms-4">Employee Date: 20/02/2021</p>
        </div>
        <StarkFormBuilder
          containerClass=""
          formHeaderClass=""
          formSections={FormSections}
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          options={options}
          callbacks={{ onDurationCallback: (value) => { getEndTime(value); },
          onStartTimeCallback: (value) => { getStartTime(value); }
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
  );
}

export default withRouter(EditEmployee);
