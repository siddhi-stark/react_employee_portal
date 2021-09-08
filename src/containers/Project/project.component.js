import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button, Image } from 'react-bootstrap';
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
  const title = 'Project';
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [activeMenu, setActiveMenu] = useState('all');
  const [status, setStatus] = useState(null); // eslint-disable-line

  // Variable declarations Filter State
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  
  const handleActionCallback = () => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             // history.push(`/edit-event/${row.id}`, { isView: 'true' });
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
            // history.push(`/edit-event/${row.id}`);
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
      id: 'project_name',
      label: 'Project Name',
      roleAccess: [4],
    },
    {
      id: 'completion',
      label: 'Project Completion',
      roleAccess: [4],
    },
    {
      id: 'start_date',
      label: 'Start Date',
      roleAccess: [4],
      render: ({ start_date }) => {
        return (
          <>
            <span>{customFunctions.getNewFormattedDate(start_date)}</span>
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
            <span>{customFunctions.getNewFormattedDate(end_date)}</span>
          </>
        );
      },
    },
    {
      id: 'rate',
      label: 'Hourly Rate',
      roleAccess: [1],
    },
    {
      id: 'estimate_hrs',
      label: 'Estimated Hrs',
      roleAccess: [4],
    },
    {
      id: 'allocated_hrs',
      label: 'Allocated Hrs',
    },
    {
      id: 'project_cost',
      label: 'Project Cost',
      roleAccess: [1],
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'Action',
      label: 'Action',
      render:handleActionCallback
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.applicantPercentageUrl}`; 
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
