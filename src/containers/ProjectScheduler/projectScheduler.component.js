import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './FilterFormschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { to: '/project', label: 'Project Scheduler' },
];

function ProjectScheduler() {
  const history = useHistory();
  // Declare variable
  const [title, setTitle] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [status, setStatus] = useState(null); // eslint-disable-line
  // const departmentId = customFunctions.getLocalStorage('department');

  // Variable declarations Fikter
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  let filterOptions = {};

  const handleActionCallback = ({id}) => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             history.push(`/view-project/${id}`,{isView:true});
          }}
        >
          <Image alt="view" src="/images/eye.svg" />
        </a>
        <a
          href="/"
          className="pl-2 ms-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-project/${id}`,{isView:false});
          }}
        >
          <Image src="/images/edit-button.svg" />
        </a>
      </>
    );
  };    

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr.No',
      roleAccess: [4],
    },
    {
      id: 'coordinator',
      label: 'Co-ordinator',
      roleAccess: [4],
    },
    {
      id: 'name',
      label: 'Project Name',
      roleAccess: [4],
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'developer',
      label: 'Developer',
      roleAccess: [4],
    },
    {
      id: 'rt_support',
      label: 'UI Support',
      roleAccess: [4],
      render: ({ rt_support }) => {
        return (
          <>
            <span>{rt_support ? 'Yes':'No'}</span>
          </>
        );
      }, 
    },
    {
      id: 'expected_clc',
      label: 'Expected CLC',
      roleAccess: [4],
      render: ({ expected_clc }) => {
        return (
          <>
            <span>{expected_clc && customFunctions.getDMYDate(expected_clc)}</span>
          </>
        );
      },
    },
    {
      id:  'comment',
      label: 'Comments',
    },
    {
      id: 'link',
      label: 'Teamwork Project Link',
      render: handleActionCallback
    },
  ];

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.projectSchedularUrl}`; 
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
      setRowData((data && data.data && data.data.employees_data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Project Scheduler');
  }, [filterData]);

  // Get user role Filter
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form Filter
  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };
    
  const getTeam = async () => {
    const {data, message} = await AuthApi.getDataFromServer(`${Api.InterviewRoundsUrl}`);
    if(!data) {
     swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      ...filterOptions,
      team_id: dpOptions
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getTeam();
  }, []);
      
  const getCoordinator = async () => {
    const {data, message} = await AuthApi.getDataFromServer(`${Api.employeeUrl}`);
    if(!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      ...filterOptions,
      coordinator: dpOptions
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getCoordinator();
  }, []);
      
  const getDeveloper = async () => {
    const {data,message} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?department_id=2`);
    if(!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      ...filterOptions,
      developer: dpOptions
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getDeveloper();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Scheduler</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
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
                <Card.Body>
                    <StarkFormBuilder
                      containerClass=''
                      formHeaderClass=''
                      formSections={FormSections}
                      formHeading="Filter"
                      onFormSubmit={(formValues) => {submitForm(formValues);}}
                      options={options}
                      callbacks={{}}
                      defaultFormValues={defaultValues}
                      currentUser={currentUser}
                      submitBtnText="Submit"
                      showResetBtn={false}
                      resetBtnText="Clear"
                      btnContainerClass="form-submit-buttons"
                      isStepForm={false}
                      
                      onFormReset={() => {}}
                    />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Project Scheduler</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                rows={rowData}
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
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(ProjectScheduler);
