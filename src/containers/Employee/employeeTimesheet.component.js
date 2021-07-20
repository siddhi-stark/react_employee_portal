import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
// import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './employeeListformschema.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';

function EmployeeTimesheet() {
  const EmployeeType = customFunctions.getLocalStorage('type');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [dataShow, setDataShow] = useState(false);
  const history = useHistory();

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  // const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const title = 'Employee Timesheet';
  const limit = 10;
  // const defaultValues = {};
  // const [options, updateOptions] = useState({});
  // const [currentUser, updateCurrentUser] = useState(0);
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];


  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'toDate') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  const handleActionCallback = (row) => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-employee/${row.emp_id}`);
            customFunctions.setLocalStorage('employeeName',row.emp_name);
            customFunctions.setLocalStorage('date',row.date);
          }}
        >
          Add
        </a>
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'emp_id',
      label: dataShow && EmployeeType ? '' : 'Employee ID',

      render: ({ row }) => {
        return (
          <>
            <span>{dataShow ? '' : row.emp_id}</span>
          </>
        );
      },
    },
    {
      id: 'day',
      label: dataShow ? 'Day' : '',
      render: ({ day }) => {
        return (
          <>
            <span>{dataShow ? day : ''}</span>
          </>
        );
      },
    },
    {
      id: 'date',
      label: dataShow ? 'Date' : '',
      render: ({ row }) => {
        return (
          <>
            <span>{dataShow ? row.Date : ''}</span>
          </>
        );
      },
    },
    {
      id: EmployeeType ? '' : 'emp_name',
      label: EmployeeType ? '' : 'Employee Name',
    },
    {
      id: 'designatin_name',
      label: dataShow ? '' : 'Designation ',
      render: ({ row }) => {
        return (
          <>
            <span>{dataShow ? '' : row.Designation}</span>
          </>
        );
      },
    },
    {
      id: 'sign_in',
      label: 'Clock-In',
    },
    {
      id: 'sign_out',
      label: 'Clock-Out',
    },
    {
      id: 'estimation',
      label: 'Total Working Hours',
      render: ({ estimation }) => {
        return (
          <>
            <span>{estimation} Hrs</span>
          </>
        );
      },
    },
    {
      id: 'date',
      label: 'Date',
    },
    {
      id: 'action',
      label: EmployeeType ? '' : 'Action',
      render: EmployeeType ? '' : handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeTimesheet}`;
    const params = {
      limit,
      page,
      start_date: filterData.fromDate
        ? customFunctions.getDate(filterData.fromDate)
        : '',
      end_date: filterData.toDate
        ? customFunctions.getDate(filterData.toDate)
        : '',
      employee_id: filterData.full_name ? filterData.full_name.value : '',
      // ...filterList
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(endPoint, url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      // customFunctions.setLocalStorage('employeeName',data.emp_name);
      // customFunctions.setLocalStorage('date',data.data.date);
      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
      customFunctions.removeLocalStorage('type');
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    // const EmployeeType = props.location.state.type;
    // setEmployeeType(EmployeeType);
    getRowData(1);
  }, [filterData]);

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
    setDataShow(true);
    setFilterData(formValues);
  };

  const getEmployeeName = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      full_name: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployeeName();
  }, []);

  const onResetForm = () => {
    setFilterData('');
    getRowData(1);
    setFilterData(false);
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
      <div className="mt-5">
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary m-0">Filters</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Expand
                  </Accordion.Toggle>
                </div>
              </div>
            </Card.Header>

            <Accordion.Collapse eventKey="1">
              <Card.Title>
                <StarkFormBuilder
                  containerClass=""
                  formHeaderClass=""
                  formSections={FormSections}
                  formHeading=""
                  onFormSubmit={(formValues) => {
                    submitForm(formValues);
                  }}
                  options={options}
                  callbacks={{}}
                  defaultFormValues={defaultValues}
                  currentUser={currentUser}
                  submitBtnText="Submit"
                  showResetBtn={true} // eslint-disable-line
                  resetBtnText="Clear"
                  btnContainerClass="form-submit-buttons pull-right mb-3"
                  isStepForm={false}
                  onFormReset={() => {
                    setDataShow(false);
                    onResetForm();
                  }}
                />
              </Card.Title>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">Employees List</h4>
            </div>
          </Card.Header>
          <Card.Body>
            <CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true} // eslint-disable-line
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
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
export default withRouter(EmployeeTimesheet);
