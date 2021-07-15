import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
// import { setHours, setMinutes } from 'date-fns';
import StarkFormBuilder from 'stark-form-builder';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import FormSections from './editEmployee.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function EditEmployee() {
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


 useEffect(() => {
  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
   console.log('section',section);
    const sectionData = section;
    if (sectionData.name === 'login') {
      // const date = new Date();
      // sectionData.minDate = date;
      // sectionData.minTime = setHours(setMinutes(date, parseInt(timeMinutes, 10) + 1), parseInt(timeMinutes, 10) > 58 ? parseInt(timeHour, 10) + 1 : timeHour);
      // sectionData.maxTime = setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours());
  };
    return section;
  });
  }, []);

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
    console.log('formValues', formValues, setFilterData);
    console.log('formValues',customFunctions.getDateTime( formValues.login));
    const { data } = await AuthApi.putDataToServer(Api.employeeUrl, formValues);
    if (!data) {
      // show error
      return; // eslint-disable-line
    }
    // Perform success actions
  };

  // Get data for form
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

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

  return (
    <div className="mt-4 edit-timelog">
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
          callbacks={{}}
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
