import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button, Row, Col, Image } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './employeeListformschema.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';

function EmployeeTimesheet() {
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); 
  const [dataShow, setDataShow] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory();

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  // const [jsonSchema, updateJsonSchema] = useState(FormSections);
  // const title = 'Employee Timesheet';
  const limit = 10;
  // const defaultValues = {};
  // const [options, updateOptions] = useState({});
  // const [currentUser, updateCurrentUser] = useState(0);
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee Timesheet' }];
  const departmentId = customFunctions.getLocalStorage('department');

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'toDate') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    if (sectionData.name === 'fromDate') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  const handleActionCallback = (row) => {
    const userName = customFunctions.getLocalStorage('name');
    return (
      <>
      { (Number(departmentId) !== Number(7) && Number(departmentId) !== Number(8)) && (
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-employee/${row.user_id}`);
            customFunctions.setLocalStorage('employeeName', row.emp_name);
            customFunctions.setLocalStorage('userId', row.user_id);
            customFunctions.setLocalStorage('date', row.date);
          }}
        >
          {!(String(userName) === row.emp_name) && (
            <Image src="/images/edit-button.svg" />
          )}
        </a>
        )
      }
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'user_id',
      label: 'id',
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'emp_id',
      label: dataShow ? '' : 'Employee ID',

      render: ({ emp_id }) => { // eslint-disable-line
        return (
          <>
            <span>
              {
                dataShow ? '' : `SDMS ${emp_id}` // eslint-disable-line
              }
            </span>
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
            <span>{dataShow ? customFunctions.getNewFormattedDate(row.date) : ''}</span>
          </>
        );
      },
    },
    {
      id: 'emp_name',
      label:
        filterData.full_name || (filterData.formDate && filterData.toDate)
          ? ''
          : 'Employee Name',
      render: ({ row }) => {
        return (
          <>
            <span>
              {filterData.full_name ||
              (filterData.formDate && filterData.toDate)
                ? ''
                : row.emp_name}
            </span>
          </>
        );
      },
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
      label: dataShow ? '' : 'Date ',
      render: ({ row }) => {
        return (
          <>
            <span>{dataShow ? '' : customFunctions.getNewFormattedDate(row.date)}</span>
          </>
        );
      },
    },
     {
      id: 'action',
      label: (Number(departmentId) !== 7 && Number(departmentId) !== 8) ?'Action':'',
      render: handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeTimesheet}`;
    const params = {
      sort_by: 'created_at',
      sort_direction: 'descending',
      limit,
      page,
      start_date: filterData.fromDate
        ? customFunctions.getDate(filterData.fromDate)
        : '',
      end_date: filterData.toDate
        ? customFunctions.getDate(filterData.toDate)
        : '',
      is_detail: filterData.is_detail ? filterData.is_detail[0] : '',
      employee_id: filterData.full_name ? filterData.full_name.value : '',
      // ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  const getTimesheetDetails = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.timesheetDetailsUrl}`;
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
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {

      setDetails((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  useEffect(() => {
   
    if(filterData.is_detail){
      getTimesheetDetails();
      getRowData(1);
    } else{
      getRowData(1);
    }
    // const type = props.match.params.empType;
    // setType(type);
  }, [filterData]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    setTitle('Employee Timesheet');
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    if (!formValues) return;
    setDataShow(true);
    setFilterData(formValues);
  };

  const getEmployeeName = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_dropdown=1`
    );
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
      <Loader showLoader={isShowLoader} needFullPage={false} />
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
                submitBtnText="Apply"
                showResetBtn={true} // eslint-disable-line
                resetBtnText="Clear"
                btnContainerClass="form-submit-buttons pull-right mb-3"
                isStepForm={false}
                onFormReset={() => {
                  setDataShow(false);
                  onResetForm();
                }}
              />
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">
                {`${
                  filterData.full_name
                    ? `Employee Timesheet for ${filterData.full_name.label}`
                    : 'Employees Timesheet'
                }`}
              </h4>
            </div>
          </Card.Header>
          <Card.Body>
            {filterData.full_name && filterData.is_detail && (
              <Row>
                <Col>
                  <p>

                    {' '}
                    No. of working days :{' '}
                    {details ? details.total_working_days : ''}
                  </p>
                </Col>
                <Col>
                  <p>
                    No. of leaves :{' '}
                    {details ? details.total_leaves : ''}
                  </p>
                </Col>
                <Col>
                  <p>
                    Total No. of working Hrs. :{' '}
                    {details ? details.total_working_hours : ''}
                  </p>
                </Col>
              </Row>
            )}

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
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
export default withRouter(EmployeeTimesheet);
