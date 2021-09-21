import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './teamFilterFormschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { to: '/project', label: 'Team Project Scheduler' },
];

function TeamProjectScheduler() {
  const [title, setTitle] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);

  // Variable declarations Fikter
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const teamId = customFunctions.getLocalStorage('team_id');

  let filterOptions = {};

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'id',
      roleAccess: [4],
      isDisplay:false
    },
    {
      id: 'emp_name',
      label: 'Name',
      roleAccess: [4],
    },
    {
      id: '0-25',
      label: '0-25',
      roleAccess: [4],
    },
    {
      id: '25-75',
      label: '25-75',
    },
    {
      id: '75-95',
      label: '75-95',
      roleAccess: [4],
    },
    {
      id: '100',
      label: '100',
    },
    {
      id: 'total_open',
      label: 'Total open project',
      roleAccess: [4],
    },
    {
      id: 'rt_support',
      label: 'RT Support',
      roleAccess: [4],
      render: ({ rt_support }) => {
        return (
          <>
            <Image
              className="rt-support-link"
              src={rt_support ? '/images/success.svg' : '/images/fail.svg'}
            />
          </>
        );
      }, 
    }
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.projectSchedularUrl}`; 
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      show_percentage:1, 
      team_id: !filterList ? '' : Number(teamId),
      page,
      limit,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data && data.data.employees_data) || []);
    } else {
      setShowLoader(false);
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
    const payload ={
      date: formValues.month && customFunctions.getDate(formValues.month),
      team_id: formValues.team_id && formValues.team_id.value && Number(formValues.team_id.value),
    };
    setFilterData(payload);
  };
    
  const getTeam = async () => {
  const {data, message} = await AuthApi.getDataFromServer(`${Api.InterviewRoundsUrl}?constant_type=team`);
    if(!data) {
     swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      const dpOptions = [];
      data && data.data && data.data.team && data.data.team.map((op) => {
        // Change appropriate keys
        dpOptions.push({label: op.name, value: op.id});
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
  };

  useEffect(() => {
    getTeam();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Team Project Scheduler</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
        {currentUser !== 3 && (
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
                    submitBtnText="Apply"
                    showResetBtn={true}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons pull-right mb-3"
                    isStepForm={false}
                    onFormReset={() => {
                      setFilterData();
                    }}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          )}
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Team Project Scheduler</h4>
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

export default withRouter(TeamProjectScheduler);
