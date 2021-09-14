import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button, Image, ProgressBar } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './formschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { to: '/project', label: 'Project' },
];

function Project() {
  const history = useHistory();
  // Declare variable
  const [title, setTitle] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [activeMenu, setActiveMenu] = useState('all');
  const [status, setStatus] = useState(null); // eslint-disable-line
  const departmentId = customFunctions.getLocalStorage('department');

  // Variable declarations Filter State
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);

  const handleActionCallback = ({id}) => {
    return (
      <span className ="d-flex">
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
      </span>
    );
  };    

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Id',
      roleAccess: [4],
      isDisplay: false
    },
    {
      id: 'index',
      label: 'Sr.No',
      roleAccess: [4],
    },
    {
      id: 'name',
      label: 'Project Name',
      roleAccess: [4],
      render: ({ id, name }) => {
        return (
          <>
            <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/team-project/${id}`);
              }}
            >
             {name} 
            </a>
          </>
        );
      },
    },
    {
      id: 'completion',
      label: 'Project Completion',
      roleAccess: [4],
      render: ({ completion }) => {
        return (
          <>
            {completion <= 50 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="danger"
                now={completion}
                label={`${completion}% completed`}
              />
            )}
            {completion > 50 && completion <= 80 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="info"
                now={completion}
                label={`${completion}% completed`}
              />
            )}
            {completion > 80 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="success"
                now={completion}
                label={`${completion}% completed`}
              />
            )}
          </>
        );
      },
    },
    {
      id: 'start_date',
      label: 'Start Date',
      roleAccess: [4],
      render: ({ start_date }) => {
        return (
          <>
            <span>{start_date && customFunctions.getDMYDate(start_date)}</span>
          </>
        );
      }, 
    },
    {
      id: 'end_date',
      label: 'End Date',
      roleAccess: [4],
      render: ({ end_date }) => {
        return (
          <>
            <span>{end_date && customFunctions.getDMYDate(end_date)}</span>
          </>
        );
      },
    },
    {
      id: (Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && 'hourly_rate',
      label: (Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && 'Hourly Rate',
      roleAccess: [1],
    },
    {
      id: 'estimate_hrs',
      label: 'Estimated Hrs',
      roleAccess: [4],
    },
    {
      id: 'allocated',
      label: 'Allocated Hrs',
    },
    {
      id: (Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && 'cost_allocated',
      label: (Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && 'Project Cost',
      roleAccess: [1],
    },
    {
      id: 'rt_support',
      label: 'RT Support',
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
      id: 'status',
      label: 'Status',
    },
    {
      id: 'Action',
      label: (Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && 'Action',
      render: (Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && handleActionCallback
    },
  ];

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.getProjects}`; 
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      sort_by:'name',
      sort_direction:'ascending',
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
      
      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Project');
  }, [filterData]);

  // Get user role Filter 
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project</h2>
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
                    formHeading="Project Filter"
                    onFormSubmit={(formValues) => {submitForm(formValues);}}
                    callbacks={{}}
                    defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Apply"
                    showResetBtn={true}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons pull-right mb-3"
                    isStepForm={false}
                    onFormReset={() => {
                      setFilterData({});
                    }}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Project</h4>
              </div>
            </Card.Header>
            <Card.Body>
            <div className="recruitment-links-wrapper">
            {(Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1 && (
              <>
              <a
                href="#"
                className={`mb-2 ${activeMenu === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMenu('all');
                  setStatus(0);
                }}
              >
                All
              </a>
              <a
                href="#"
                className={`ml-2 mb-2 ${
                  activeMenu === 'Active' ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveMenu('Active');
                  setStatus(1);
                }}
              >
                Active
              </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'Inactive' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('Inactive');
                      setStatus(2);
                    }}
                  >
                    Inactive
                  </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'archive' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('archive');
                      setStatus(3);
                    }}
                  >
                    Archive
                  </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'late' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('late');
                      setStatus(6);
                    }}
                  >
                    Late
                  </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'upcoming' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('upcoming');
                      setStatus(4);
                    }}
                  >
                    Upcoming
                  </a>
                </>
             )}
            </div>
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

export default withRouter(Project);
