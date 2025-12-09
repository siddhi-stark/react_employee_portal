import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './formschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

const items = [{ to: '/', label: 'Home' }, { label: 'Current Project' }];

function Project() {
  const history = useHistory();
  // Declare variable
  const [title, setTitle] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  // const [activeMenu, setActiveMenu] = useState('all');
  // const [tabStatus, setTabStatus] = useState('all');
  const departmentId = customFunctions.getLocalStorage('department');
  const [allData, setAllData] = useState({});
  const [options, updateOptions] = useState({});
  const [isManager, setIsManager] = useState(null);

  // Variable declarations Filter State
  const [currentUser, updateCurrentUser] = useState(0);
  
  // Milestones state
  const [milestonesData, setMilestonesData] = useState([]);
  const [milestonesPagination, setMilestonesPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [milestonesLimit] = useState(10); // Fixed limit for milestones
  
  // Deliverables state
  const [deliverablesData, setDeliverablesData] = useState([]);
  const [deliverablesPagination, setDeliverablesPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [allDeliverablesData, setAllDeliverablesData] = useState([]);
  const [lastFetchedDeliverablesProjectId, setLastFetchedDeliverablesProjectId] = useState(null);
  const [deliverablesLimit] = useState(10); // Fixed limit for deliverables

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setIsManager(JSON.parse(isProjectManager));
  }, [customFunctions?.getLocalStorage('isProjectManager')]);

  const handleActionCallback = ({ id }) => {
    return (
      <span className="d-flex">
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/view-project/${id}`, { isView: true });
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
            history.push(`/edit-project/${id}`, { isView: false });
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
      isDisplay: false,
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
                customFunctions.setLocalStorage('projectName', name);
                history.push(`/team-project/${id}`, { state: { projectName: name } });
              }}
            >
              <strong> {name} </strong>
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
            <strong>{completion}%</strong>
          </>
        );
      },
    },
    {
      id:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'hourly_cost',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Hourly Rate',
      roleAccess: [1],
    },
    {
      id: 'allocated',
      label: 'Estimated Hrs',
      roleAccess: [4],
      render: ({ allocated }) => {
        return (
          <>
            <span> {allocated.toFixed(2)} </span>
          </>
        );
      },
    },
    {
      id:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'hours_allocated',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Hours Allocated',
      roleAccess: [1],
      render: ({ hours_allocated }) => {
        return (
          <>
            <span>
              {((Number(currentUser) === 4 && Number(departmentId) === 8) ||
                Number(currentUser) === 1) &&
                hours_allocated.toFixed(2)}
            </span>
          </>
        );
      },
    },
    {
      id:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'cost_allocated',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Project Cost',
      roleAccess: [1],
    },
    {
      id: 'Action',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Action',
      render:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        handleActionCallback,
    },
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.getProjects}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      sort_by: 'name',
      sort_direction: 'ascending',
      page,
      limit,
      status: 'active',
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
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
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Current Project');
  }, [filterData]);

  // Fetch all milestones and deliverables on initial load
  useEffect(() => {
    getMilestonesData(1, null);
    getDeliverablesData(1, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get user role Filter
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));

  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValue) => {
    let payload = {};
    const formValues =
      typeof formValue === 'object' && Object.keys(formValue).length
        ? formValue
        : allData;
    const projectId = formValues.project_id &&
      formValues.project_id.value &&
      Number(formValues.project_id.value);
    
    payload = {
      project_id: projectId,
    };
    // if(String(tabStatus) === 'active' || String(tabStatus) === 'inactive'){
    //   payload.status = tabStatus;
    // } else if(String(tabStatus) === 'late' || String(tabStatus) === 'current'){
    //   payload.sub_status = String(tabStatus) === 'late' ? 'late' :'current';
    // }

    if (formValues) {
      setAllData(payload);
    }
    setFilterData(payload);
    setSelectedProjectId(projectId);
    
    // Fetch milestones and deliverables - all if no project selected, filtered if project selected
    getMilestonesData(1, projectId);
    getDeliverablesData(1, projectId);
  };

  // useEffect(() => {
  //   submitForm();
  // }, [tabStatus]);

  const getProjectList = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.projectListUrl}?sort_by=name&status=active&type=all`
    );

    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.project_id = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  useEffect(() => {
    getProjectList();
  }, []);

  // Store all milestones for client-side pagination
  const [allMilestonesData, setAllMilestonesData] = useState([]);
  const [lastFetchedProjectId, setLastFetchedProjectId] = useState(null);

  // Apply pagination to already fetched data
  const applyPagination = (milestonesList, pageNo) => {
    const page = pageNo || 1;
    const startIndex = (page - 1) * milestonesLimit;
    const endIndex = startIndex + milestonesLimit;
    const paginatedMilestones = milestonesList.slice(startIndex, endIndex);
    
    // Add serial numbers
    const numberedMilestones = paginatedMilestones.map((milestone, index) => ({
      ...milestone,
      no: startIndex + index + 1,
    }));

    setMilestonesData(numberedMilestones);
    
    // Update pagination state
    setMilestonesPagination({
      current_page: Number(page),
      itemsPerPage: milestonesLimit,
      totalItems: milestonesList.length,
    });
  };

  // Fetch milestones data
  const getMilestonesData = async (pageNo = 1, projectId = null) => {
    // If we already have data for this project and just changing page, use cached data
    if (allMilestonesData.length > 0 && lastFetchedProjectId === projectId && pageNo) {
      applyPagination(allMilestonesData, pageNo);
      return;
    }

    setShowLoader(true);
    
    // Fetch all data (type=all) to get all milestones, then paginate client-side
    const params = {
      type: 'all',
      sort_by: 'deadline',
      sort_direction: 'ascending',
    };

    // Add project_id filter only if a project is selected
    if (projectId) {
      params.project_id = projectId;
    }

    const url = customFunctions.generateUrl(Api.projectsMilestonesUrl, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.data) {
      // Extract milestones from projects and flatten them
      const flattenedMilestones = [];
      
      data.data.forEach((project) => {
        if (project.milestones && project.milestones.length > 0) {
          project.milestones.forEach((milestone) => {
            flattenedMilestones.push({
              id: milestone.id,
              tw_id: milestone.tw_id,
              title: milestone.title,
              description: milestone.description || '-',
              deadline: milestone.deadline ? customFunctions.getDate(milestone.deadline) : '-',
              deadline_raw: milestone.deadline || null, // Keep raw date for sorting
              status: milestone.status,
              responsible: milestone.responsible || '-',
              project_name: project.name,
            });
          });
        }
      });

      // Sort by deadline (milestones without deadlines go to end)
      flattenedMilestones.sort((a, b) => {
        if (!a.deadline_raw && !b.deadline_raw) return 0;
        if (!a.deadline_raw) return 1;
        if (!b.deadline_raw) return -1;
        return new Date(a.deadline_raw) - new Date(b.deadline_raw);
      });

      // Store all milestones and project ID
      setAllMilestonesData(flattenedMilestones);
      setLastFetchedProjectId(projectId);
      
      // Apply pagination
      applyPagination(flattenedMilestones, pageNo);
      
      setShowLoader(false);
    } else {
      setShowLoader(false);
      setMilestonesData([]);
      setAllMilestonesData([]);
      setLastFetchedProjectId(null);
      if (message) {
        swal(message, '', 'error');
      }
    }
  };

  // Apply pagination to deliverables
  const applyDeliverablesPagination = (deliverablesList, pageNo) => {
    const page = pageNo || 1;
    const startIndex = (page - 1) * deliverablesLimit;
    const endIndex = startIndex + deliverablesLimit;
    const paginatedDeliverables = deliverablesList.slice(startIndex, endIndex);
    
    // Add serial numbers
    const numberedDeliverables = paginatedDeliverables.map((deliverable, index) => ({
      ...deliverable,
      no: startIndex + index + 1,
    }));

    setDeliverablesData(numberedDeliverables);
    
    // Update pagination state
    setDeliverablesPagination({
      current_page: Number(page),
      itemsPerPage: deliverablesLimit,
      totalItems: deliverablesList.length,
    });
  };

  // Fetch deliverables data
  const getDeliverablesData = async (pageNo = 1, projectId = null) => {
    // If we already have data for this project and just changing page, use cached data
    if (allDeliverablesData.length > 0 && lastFetchedDeliverablesProjectId === projectId && pageNo) {
      applyDeliverablesPagination(allDeliverablesData, pageNo);
      return;
    }

    setShowLoader(true);
    
    // Fetch all data (type=all) to get all deliverables, then paginate client-side
    const params = {
      type: 'all',
      sort_by: 'end_date',
      sort_direction: 'ascending',
    };

    // Add project_id filter only if a project is selected
    if (projectId) {
      params.project_id = projectId;
    }

    const url = customFunctions.generateUrl(Api.deliverablesUrl, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.data) {
      // Process deliverables data
      const processedDeliverables = data.data.map((deliverable) => ({
        id: deliverable.id,
        tw_id: deliverable.tw_id,
        content: deliverable.content || '-',
        description: deliverable.description || '-',
        start_date: deliverable.start_date ? customFunctions.getDate(deliverable.start_date) : '-',
        end_date: deliverable.end_date ? customFunctions.getDate(deliverable.end_date) : '-',
        end_date_raw: deliverable.end_date || null, // Keep raw date for sorting
        status: deliverable.status || '-',
        priority: deliverable.priority || '-',
        progress: deliverable.progress || 0,
        responsible: deliverable.responsible || '-',
        estimation: deliverable.estimation || '-',
        hours: deliverable.hours || 0,
        minutes: deliverable.minutes || 0,
        list_name: deliverable.list_name || '-',
        milestone_title: deliverable.milestone?.title || '-',
        project_name: deliverable.project?.name || '-',
      }));

      // Sort by end_date (deliverables without end_date go to end)
      processedDeliverables.sort((a, b) => {
        if (!a.end_date_raw && !b.end_date_raw) return 0;
        if (!a.end_date_raw) return 1;
        if (!b.end_date_raw) return -1;
        return new Date(a.end_date_raw) - new Date(b.end_date_raw);
      });

      // Store all deliverables and project ID
      setAllDeliverablesData(processedDeliverables);
      setLastFetchedDeliverablesProjectId(projectId);
      
      // Apply pagination
      applyDeliverablesPagination(processedDeliverables, pageNo);
      
      setShowLoader(false);
    } else {
      setShowLoader(false);
      setDeliverablesData([]);
      setAllDeliverablesData([]);
      setLastFetchedDeliverablesProjectId(null);
      if (message) {
        swal(message, '', 'error');
      }
    }
  };

  // Milestones table columns
  const milestonesColumns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'project_name',
      label: 'Project Name',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'title',
      label: 'Milestone Title',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'description',
      label: 'Description',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'deadline',
      label: 'Deadline',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'status',
      label: 'Status',
      roleAccess: [1, 2, 3, 4],
      render: ({ status }) => {
        let statusClass = 'text-secondary';
        if (status === 'completed') {
          statusClass = 'text-success';
        } else if (status === 'active') {
          statusClass = 'text-primary';
        }
        return (
          <span className={statusClass}>
            <strong>{status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}</strong>
          </span>
        );
      },
    },
    {
      id: 'responsible',
      label: 'Responsible',
      roleAccess: [1, 2, 3, 4],
    },
  ];

  // Deliverables table columns
  const deliverablesColumns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'project_name',
      label: 'Project Name',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'milestone_title',
      label: 'Milestone',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'content',
      label: 'Deliverable Name',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'description',
      label: 'Description',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'start_date',
      label: 'Start Date',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'end_date',
      label: 'End Date',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'status',
      label: 'Status',
      roleAccess: [1, 2, 3, 4],
      render: ({ status }) => {
        let statusClass = 'text-secondary';
        if (status === 'completed' || status === 'done') {
          statusClass = 'text-success';
        } else if (status === 'active' || status === 'in-progress') {
          statusClass = 'text-primary';
        } else if (status === 'new') {
          statusClass = 'text-info';
        }
        return (
          <span className={statusClass}>
            <strong>{status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}</strong>
          </span>
        );
      },
    },
    {
      id: 'priority',
      label: 'Priority',
      roleAccess: [1, 2, 3, 4],
      render: ({ priority }) => {
        let priorityClass = 'text-secondary';
        if (priority === 'high') {
          priorityClass = 'text-danger';
        } else if (priority === 'medium') {
          priorityClass = 'text-warning';
        } else if (priority === 'low') {
          priorityClass = 'text-info';
        }
        return (
          <span className={priorityClass}>
            <strong>{priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : '-'}</strong>
          </span>
        );
      },
    },
    {
      id: 'progress',
      label: 'Progress',
      roleAccess: [1, 2, 3, 4],
      render: ({ progress }) => {
        return (
          <span>
            <strong>{progress}%</strong>
          </span>
        );
      },
    },
    {
      id: 'responsible',
      label: 'Responsible',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'estimation',
      label: 'Estimation (Hrs)',
      roleAccess: [1, 2, 3, 4],
    },
  ];

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Dashboard</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <UserRestrictions
                permittedUsers={isManager ? [1, 2, 3, 4, 7, 10] : [2, 3, 4, 7, 10]}
                roleId={currentUser}
              >

                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0 mt-2 ">Filter</h5>
                  <Button
                    variant="secondary"
                    className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      history.push(`/project-report-list`)

                    }}
                  >
                    Today's Projects Reports
                  </Button>
                </div>
              </UserRestrictions>
              <hr />

              <div className="filter-box-main">
                <StarkFormBuilder
                  containerClass=""
                  formHeaderClass=""
                  formSections={FormSections}
                  formHeading="Project Filter"
                  onFormSubmit={(formValues) => {
                    if (!formValues.project_id) return;
                    submitForm(formValues);
                  }}
                  callbacks={{}}
                  options={options}
                  currentUser={currentUser}
                  submitBtnText="Apply"
                  showResetBtn={true}
                  showBtnClass={false}
                  btnContainerClass="col-md-4 filter-apply-btns"
                  formClass="row"
                  resetBtnText="Clear"
                  isStepForm={false}
                  onFormReset={() => {
                    if (filterData && !Object.keys(filterData).length) return;
                    setFilterData({});
                    setAllData({});
                    setSelectedProjectId(null);
                    // Fetch all milestones and deliverables when filter is cleared
                    getMilestonesData(1, null);
                    getDeliverablesData(1, null);
                  }}
                />
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Milestones</h5>
              </div>
              <hr />
              <CustomTable
                columns={milestonesColumns}
                rows={milestonesData}
                tableClass="table-striped"
                showPagination={true}
                paginationProps={{
                  totalItems: milestonesPagination.totalItems,
                  itemsPerPage: milestonesLimit,
                  activePage: milestonesPagination.current_page,
                  onPageChange: (pageNo) => {
                    getMilestonesData(Number(pageNo), selectedProjectId);
                  },
                }}
                emptyRender={() => {
                  return selectedProjectId 
                    ? 'No milestones found for the selected project.'
                    : 'No milestones found.';
                }}
              />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Deliverables</h5>
              </div>
              <hr />
              <CustomTable
                columns={deliverablesColumns}
                rows={deliverablesData}
                tableClass="table-striped"
                showPagination={true}
                paginationProps={{
                  totalItems: deliverablesPagination.totalItems,
                  itemsPerPage: deliverablesLimit,
                  activePage: deliverablesPagination.current_page,
                  onPageChange: (pageNo) => {
                    getDeliverablesData(Number(pageNo), selectedProjectId);
                  },
                }}
                emptyRender={() => {
                  return selectedProjectId 
                    ? 'No deliverables found for the selected project.'
                    : 'No deliverables found.';
                }}
              />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Projects</h5>
              </div>
              <hr />
              <CustomTable
                columns={columns}
                rows={rowData}
                tableClass="table-striped"
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
