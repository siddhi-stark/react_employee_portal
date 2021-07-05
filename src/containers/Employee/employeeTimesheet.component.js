import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
// import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './employeeListformschema.json';
import ModalFormSections from './editEmployee.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import { Helmet, ModalInput } from '../../components/FormInputs';

function EmployeeTimesheet() {

  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [modalShow, setModalShow] = useState(false);
  const [dataShow, setDataShow] = useState(false);
  // const history = useHistory();

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  const title = 'Employees List';
  const limit = 10;
  // const defaultValues = {};
  // const [options, updateOptions] = useState({});
  // const [currentUser, updateCurrentUser] = useState(0);
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];
  const formSchema = [...FormSections];
    formSchema[0].fields.map((section)=>{
    const sectionData = section;
    if(sectionData.name === 'fromDate'){
    const date = new Date();
    sectionData.minDate = date;
    }
    return sectionData;
  });

   // modal
     // Variable declarations
  const [defaultModalValues, updateDefaultModalValues] = useState({});
  const [modalOptions, updateModalOptions] = useState({}); // eslint-disable-line
  const [employeeId, setEmployeeId] = useState({});

  const handleActionCallback = (row) => {
    console.log('row',row.id);
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setModalShow(true);
            setEmployeeId(row.id);
            // history.push('/edit-employee');
          }}
        >
          Edit
    </a>
      </>
    );
  };

  // Declare columns
  const columns = [{
    'id': 'index',
    'label': 'Sr.No',
  },
  {
    'id': 'emp_code',
    'label':  dataShow ? '' : 'Employee ID',
  }, 
  {
    'id': 'day',
    'label': dataShow ? 'Day' :'',
  }, 
  {
    'id': 'date',
    'label': dataShow ? 'Date' :'',
  },
  {
    'id': 'full_name',
    'label': 'Employee Name',
  },
  {
    'id': 'designation_name',
    'label': dataShow ? '' : 'Designation ',
  },
  {
    'id': 'sign_in',
    'label': 'Clock-In',
  },
  {
    'id': 'sign_out',
    'label': 'Clock-Out',
  },
  {
    'id': 'estimation',
    'label': 'Total Working Hours',
     render: ({ estimation }) => {
        return (
          <>
            <span>{estimation} Hrs</span>
          </>
        );
      },
  },
  {
    'id': 'action',
    'label': 'Action',
    render: handleActionCallback
  },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.timeSheetUrl}`;
    const params = {
      limit,
      page,
      // ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = ((page - 1) * itemsPerPage) + (i + 1);
        return newItem;
      });

      setRowData(data && data.data || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
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
    console.log(formValues, updateDefaultValues);
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
      full_name: dpOptions
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployeeName();
  }, []);

  // Edit form popup
  //   // Get user role
  // const getUserRole = async () => {
  //   const roleId = await localStorage.getItem('role');
  //   updateCurrentUser(Number(roleId));
  // };

  // useEffect(() => {
  //   getUserRole();
  // }, []);

  // Submit Form
  const submitModalForm = async (formValues) => {
    console.log('formValues',formValues);
    const { data } = await AuthApi.putDataToServer(Api.employeeUrl, formValues);
    if (!data) {
      // show error
      return; // eslint-disable-line
    }
    // Perform success actions
  };

  // Get data for form
  const getData = async () => {
    const endPoint = `${Api.employeeUrl}?id=${employeeId}`;

    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!data) {
      // show error
      return;
    }
    updateDefaultModalValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className='page-header'>
        <div className='title-breadcrumb-section'>
          <h2 className='main-content-title tx-24 mg-b-5'>{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <div className='mt-5'>
        <Accordion defaultActiveKey='0'>
          <Card>
            <Card.Header>
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='text-primary m-0'>Filters</h4>
                <div className='d-flex align-items-center justify-content-end'>
                  <Accordion.Toggle as={Button} variant='link' eventKey='1'>
                    Expand
                  </Accordion.Toggle>
                </div>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey='1'>
              <Card.Body>
                <Card.Title>
                  <StarkFormBuilder
                    containerClass=''
                    formHeaderClass=''
                    formSections={FormSections}
                    formHeading=""
                    onFormSubmit={(formValues) => { submitForm(formValues); }}
                    options={options}
                    callbacks={{}}
                    defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={true}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons pull-right"
                    isStepForm={false}

                    onFormReset={() => {
                      setDataShow(false);
                    }}
                  />
                </Card.Title>
              </Card.Body>
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
              role={5}
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                }
              }}
              emptyRender={() => { return ('No record found.'); }}
            />
          </Card.Body>
        </Card>
        {console.log('modalShow',modalShow)}
          { modalShow && (
          <ModalInput
                size="lg"
                centered
                show={modalShow}
                onHide={()=>setModalShow(false)}
                label='Edit Time log of Employee'
                id="contained-modal-title-vcenter"
                modalBody={
                  <div className="mt-4 edit-timelog">
                    <div className="d-flex justify-content-center mt-4">
                      <p>Employee Name- Shubham Bhise</p>
                      <p className='ms-4'>Employee Date- 20/02/2021</p>
                    </div>
                    <StarkFormBuilder
                      containerClass=''
                      formHeaderClass=''
                      formSections={ModalFormSections}
                      onFormSubmit={(formValues) => { submitModalForm(formValues); }}
                      options={modalOptions}
                      callbacks={{}}
                      defaultFormValues={defaultModalValues}
                      currentUser={currentUser}
                      submitBtnText="Submit"
                      showResetBtn={false}
                      // resetBtnText="Clear"
                      btnContainerClass="form-submit-buttons mt-0"
                      isStepForm={false}

                      // onFormReset={() => {
                      //   console.log('form reset callback');
                      // }}
                    />
                  </div>
                }
              />
            )
          }
          </div>
    </>
  );
}
export default withRouter(EmployeeTimesheet);
