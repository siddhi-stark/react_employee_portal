/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
// import Doughnut from 'stark-doughnut-graph';
import { Bar, Pie } from 'react-chartjs-2';
import swal from 'sweetalert';
import moment from 'moment';
import CustomTable from 'stark-custom-datatable';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet, TextInput } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';
import ProjectRightContainer from '../../components/RightContainer/projectRightContainer.component';
import EmployeeBugList from './employeeBugList.component';

function TeamProject(props) {
  const teamid = props;
  const teamProjectId = teamid.match.params.teamProjectId;
  const archived = teamid.location.state ? teamid.location.state.archived : '';
  const [bugStatus, setBugStatus] = useState('');
  const [employeeBug, setEmployeeBug] = useState('');
  customFunctions.setLocalStorage('teamProjectId', teamProjectId);
  const [barGraphData, setBarGraphData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalTask, setTotalTask] = useState(0);
  const items = [
    { to: '/', label: 'Home' },
    {
      label: archived ? 'Archived Project' : 'Current Project',
    },
  ];

  const initialState = {
    totalHrsSpend: null,
    totalHrsEstimate: null,
    totalHrsAllocated: null,
    projectCompletion: null,
    url: '',
  };

  const initialGraphValue = {
    completion: null,
    remaining_perc: null,
    allocated: null,
    spend: null,
    hours_allocated: null,
    start_date: null,
    end_date: null,
  };

  const history = useHistory();
  const [graphDetails, setGraphDetails] = useState('');
  const [graphData, setGraphData] = useState({});
  const [title, setTitle] = useState('');

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [graphDataObj, setGraphDataObj] = useState(initialGraphValue);
  const [activeMenu, setActiveMenu] = useState('Summary');
  const [managerName, setManagerName] = useState('');
  const [remarksData, setRemarksData] = useState([]);

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Id',
      isDisplay: false,
    },
    {
      id: 'name',
      label: 'Name',
      render: ({ name, department_id }) => {
        return (
          <>
            {name !== 'Total' ? (
              <>
                <a
                  href="/"
                  className="pl-2 ms-1"
                  onClick={(e) => {
                    customFunctions.setLocalStorage(
                      'departmentType',
                      department_id
                    );
                    customFunctions.setLocalStorage('projectName', name);
                    customFunctions.setLocalStorage('departmentName', name);
                    customFunctions.setLocalStorage('managerName', managerName);
                    e.preventDefault();
                    e.stopPropagation();
                    if (archived) {
                      history.push(`/team/${name}`, {
                        graphDataObj,
                        projectStatus,
                        archived: true,
                      });
                    } else {
                      history.push(`/team/${name}`, {
                        graphDataObj,
                        projectStatus,
                      });
                    }
                  }}
                >
                  <strong> {name}</strong>
                </a>
              </>
            ) : (
              <span>
                <strong>{name}</strong>
              </span>
            )}
          </>
        );
      },
    },
    {
      id: 's_hours',
      label: 'Spent Hours',
      render: ({ s_hours }) => {
        return (
          <>
            {Math.sign(s_hours) === 1 || Math.sign(s_hours) === 0 ? (
              <span>
                {s_hours} {Math.sign(s_hours) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span /*  className="text-danger" */>{s_hours} Hrs</span>
            )}
          </>
        );
      },
    },
    {
      id: 'e_hours',
      label: 'Estimated Hours',
      render: ({ e_hours }) => {
        return <>{e_hours.toFixed(2)} Hrs</>;
      },
    },
    {
      id: 'r_hours',
      label: 'Remaining Hours',
      render: ({ r_hours }) => {
        return (
          <>
            <span>{r_hours} Hrs</span>
          </>
        );
      },
    },
    {
      id: 'status',
      label: 'Team Status in %',
    },
  ];

  useEffect(() => {
    setTitle('Team Project');
  }, []);

  useEffect(() => {
    setTeamDetailsData();
  }, []);

  const setTeamDetailsData = async () => {
    let designHrs = '';
    let developmentHrs = '';
    let qaHrs = '';
    let managementHrs = '';
    setShowLoader(true);
    const endPoint = `${Api.allDepartmentProject}`;
    const params = {
      project_id: teamProjectId,
      is_all_data: true,
      is_compress_data: true,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setRowData(data?.data);
      setName(data?.data?.[0]?.project_name);
      
     
  
      setGraphDataObj({
        completion: data && data.data && data?.data?.[0]?.project_completion,
        remaining_perc: data?.data?.[0]?.r_hours,
        hours_allocated_qa: Number(qaHrs),
        hours_allocated_management: Number(managementHrs),
        hours_allocated_development: Number(developmentHrs),
        hours_allocated_design: Number(designHrs),
        start_date:
          data &&
          data.data &&
          data.data.start_date &&
          customFunctions.getDMYDate(data.data.start_date),
        end_date:
          data &&
          data.data &&
          data.data.end_date &&
          customFunctions.getDMYDate(data.data.end_date),
      });

      data.data.map((projectDept) => {
        switch (projectDept.name) {
          case 'Project Management':
            managementHrs =
              data.data.total_allocated_estimation &&
              Number(data.data.total_allocated_estimation) *
                (Number(projectDept.value) / 100);
            break;
          case 'Development':
            developmentHrs =
              data.data.total_allocated_estimation &&
              Number(data.data.total_allocated_estimation) *
                (Number(projectDept.value) / 100);
            break;
          case 'Design':
            designHrs =
              data.data.total_allocated_estimation &&
              Number(data.data.total_allocated_estimation) *
                (Number(projectDept.value) / 100);
            break;
          case 'Quality Analysis':
            qaHrs =
              data.data.total_allocated_estimation &&
              Number(data.data.total_allocated_estimation) *
                (Number(projectDept.value) / 100);
            break;
          default:
            return !projectDept.name;
        }
        return projectDept;
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const newData = [];
    const page = pageNo || currentPage;
    const endPoint = `${Api.bugCountProject}`;
    const params = {
      project_id: teamProjectId,
      is_all_data: true,
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      const graph = {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            data: [
              data &&
                data.data &&
                data.data.task_status_details?.total_task_completed_count,
              data &&
                data.data &&
                data.data.task_status_details?.total_task_incomplete_count,
            ],
            backgroundColor: ['#8cc540', '#e3e3e3'],
          },
        ],
      };
      setGraphData(graph);

      const graphEmployee = {
        labels: ['Total Count', 'Pending'],
        datasets: [
          {
            data: [
              data.data.all_bugs_details?.total_bug_count,
              data.data.all_bugs_details?.total_bug_incomplete_count,
            ],
            backgroundColor: ['#449c2c', '#e3e3e3'],
          },
        ],
      };

      setBugStatus(graphEmployee);

      setBarGraphData({
        labels: ['Allocated Hours  Estimated Hours  Spending Hours'],
        datasets: [
          {
            label: 'Allocated Hours',
            backgroundColor: '#3ad2e3',
            borderWidth: 1,
            data: [
              data &&
                data.data &&
                data?.data?.hour_analysis_details
                  ?.total_allocated_estimation_in_hours,
            ],
          },
          {
            label: 'Estimated Hours',
            backgroundColor: '#8cc540',
            borderWidth: 1,
            data: [
              data &&
                data.data &&
                data?.data?.hour_analysis_details
                  ?.total_given_estimation_in_hours,
            ],
          },
          {
            label: 'Spent Hours',
            backgroundColor: '#f4c222',
            borderWidth: 1,
            data: [
              data &&
                data.data &&
                data?.data?.hour_analysis_details?.total_spent_time_in_hours,
            ],
          },
        ],
      });
      setGraphDetails({
        totalHrsSpend: data?.data?.hour_analysis_details?.total_spent_time_in_hours,
        totalHrsEstimate: data?.data?.hour_analysis_details?.total_given_estimation_in_hours,
        projectCompletion: data?.data?.hour_analysis_details?.total_completion_percentage,
        // start_date: customFunctions.getDMYDate(new Date(data?.data?.project_start_date)),
        // end_date: customFunctions.getDMYDate(new Date(data?.data?.project_end_date)),
        start_date:data?.data?.project_start_date,
        end_date: data?.data?.project_end_date,
      });
      setProjectStatus(data?.data?.project_status);
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
    getTaskCountData();
    if (activeMenu === 'Activity') {
      getActivityData();
    }
  }, [activeMenu]);

  const getActivityData = async () => {
    setShowLoader(true);

    const endPoint = `${Api.tasksActivityUrl}`;

    const params = {
      project_id: teamProjectId,
      sort_by: 'start_date',
      sort_direction: 'descending',
      limit: 3,
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setActivityData(data.data);
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getTaskCountData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.projectProgressUrl}`;
    const params = {
      project_id: teamProjectId,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.data) {
      setShowLoader(false);
      const tableArr = [];
      data.data.percentage &&
        data.data.percentage.length &&
        data.data.percentage.filter((dt) => {
          if (dt.name === 'total_task') {
            setTotalTask(dt.value);
          }
          if (
            dt.name !== 'project_name' &&
            dt.name !== 'project_id' &&
            dt.name !== 'total_task'
          )
            tableArr.push(dt);
          return dt;
        });
      setTableData(tableArr || []);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const getRemarksData = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const postData = [];
    remarksData &&
      remarksData.length &&
      remarksData.map((r) => {
        postData.push({
          progress: r.progress,
          remark: r.remark,
          project_id: Number(teamProjectId),
        });
        return postData;
      });

    const callback = AuthApi.putDataToServer;
    const endPoint = `${Api.projectSummaryUrl}`;
    const { data, message } = await callback(endPoint, postData);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }

    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        getTaskCountData();
      }
    });
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button
          className="float-end mb-3"
          onClick={() =>
            archived
              ? history.push('/archived-project')
              : history.push('/current-project')
          }
        >
          Back
        </Button>
        <h2 className="main-content-title tx-24 mg-b-5">Project Dashboard</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <div className="nav-tabs-btn mb-3">
        <nav className="nav border-0">
          <a
            href="#"
            className={`nav-link mr-5 ${
              activeMenu === 'Summary' ? 'active' : ''
            }`}
            onClick={() => {
              setActiveMenu('Summary');
            }}
          >
            Summary
          </a>
          <a
            href="#"
            className={`nav-link mr-5 ${
              activeMenu === 'Activity' ? 'active' : ''
            }`}
            onClick={() => {
              setActiveMenu('Activity');
            }}
          >
            Activity
          </a>
        </nav>
      </div>
      {activeMenu === 'Summary' && (
        <section className="content-area">
          <Row>
            <Col sm={8}>
              <Row>
                <Card className="h-100 pie-chart-graph">
                  <Card.Body>
                    {/* <CustomTable
                      columns={taskColumns}
                      rows={tableData}
                      tableclassName="table-striped"
                      showPagination={false}
                      emptyRender={() => {
                        return 'No record found.';
                      }}
                    /> */}
                    <div className="table-projects d-flex justify-content-center table-responsive ">
                      {tableData && tableData.length ? (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>
                                <b>Total Tasks</b>
                              </th>
                              <th>
                                <b>{totalTask}</b>
                              </th>
                              <th>
                                <b>Remarks</b>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((td, i) => (
                              <tr>
                                <td>{td.name}</td>
                                <td>
                                  {td.name === 'Not Started(0%)' ||
                                  td.name === 'Inprogress(1-99%)' ||
                                  td.name === 'Completed(100%)' ? (
                                    <b>{td.value}</b>
                                  ) : (
                                    <i>{td.value}</i>
                                  )}
                                </td>
                                <td>
                                  <TextInput
                                    onInputChange={(e) => {
                                      tableData[i].remark = e.target.value;
                                      tableData.map((tb) =>
                                        tb.name == td.name
                                          ? (td.flag = false)
                                          : (td.flag = true)
                                      ); // eslint-disable-line
                                      setRemarksData([...tableData]);
                                    }}
                                    autocomplete="off"
                                    containerClass="mb-0"
                                    type="text"
                                    name="remark"
                                    value={tableData[i].remark}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <span>No record found.</span>
                      )}
                    </div>
                    {tableData && tableData.length && (
                      <Button
                        onClick={(e) => getRemarksData(e)}
                        className="float-end"
                      >
                        Update
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Row>
              <Row>
                <Col sm={4} className="mb-4">
                  <Card className="h-100 pie-chart-graph">
                    <Card.Header className="purple-bg">
                      <strong>Task Status</strong>
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(graphData).length ? (
                        <Pie data={graphData} />
                      ) : (
                        'No Record Found'
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={8} className="mb-4">
                  <Card className="h-100">
                    <Card.Header className="purple-bg">
                      <strong>Hours Analysis</strong>
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(barGraphData).length ? (
                        <Bar
                          data={barGraphData}
                          options={{
                            title: {
                              display: true,
                              text: 'Team Bar Graph',
                              fontSize: 20,
                            },
                            legend: {
                              display: true,
                              position: 'right',
                            },
                          }}
                        />
                      ) : (
                        'No Record Found'
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <EmployeeBugList
                  projectId={teamProjectId}
                  bugStatus={bugStatus}
                  bugEmployee={employeeBug}
                />
                <Card className="p-0">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0 mt-2 ">Team Details</h5>
                    </div>
                    <hr />
                    <CustomTable
                      columns={columns}
                      rows={rowData}
                      tableclassName="table-striped"
                      showPagination={true}
                      // paginationProps={{
                      //   totalItems: totalCount,
                      //   itemsPerPage: limit,
                      //   activePage: currentPage,
                      //   onPageChange: (pageNo) => {
                      //     setTeamDetailsData(pageNo);
                      //   },
                      // }}
                      emptyRender={() => {
                        return 'No record found.';
                      }}
                    />
                  </Card.Body>
                </Card>
              </Row>
            </Col>
            <Col sm={4}>
              <ProjectRightContainer
                name={name}
                projectStatus={projectStatus}
                startDate={graphDetails.start_date}
                endDate={graphDetails.end_date}
                totalHrsSpend={graphDetails.totalHrsSpend}
                totalHrsEstimate={graphDetails.totalHrsEstimate}
                totalHrsAllocated={graphDetails.totalHrsAllocated}
                projectCompletion={graphDetails.projectCompletion}
                url={graphDetails.url}
                managerName={managerName}
              />
            </Col>
          </Row>
        </section>
      )}
      {activeMenu === 'Activity' && (
        <section className="content-area">
          <div className="row">
            <div className="col-sm-8">
              {/* loop for date */}
              {Object.keys(activityData).length ? (
                Object.entries(activityData).map(
                  ([datekey, datevalueobject]) => (
                    <section className="card">
                      <div className="purple-bg card-header d-flex align-items-center">
                        <h5
                          className="card-title mb-0"
                          title="ZS Innovation Lab NEw Project"
                        >
                          {datekey &&
                            `${moment(datekey).format('dddd Do MMMM')}`}
                        </h5>
                      </div>
                      <section className="card-body">
                        {/* emnployee loop */}
                        {Object.keys(datevalueobject).length &&
                          Object.entries(datevalueobject).map(
                            ([employeeName, taskData]) => (
                              <div className="clearfix">
                                <h5>{employeeName}</h5>
                                <ul className="timeline">
                                  {/* task loop */}
                                  {Object.keys(taskData).length &&
                                    Object.entries(taskData).map((task) => (
                                      <li
                                        className={`d-flex align-items-center justify-content-between task task-${task[1].status}`}
                                      >
                                        <h6
                                          title={`${task[1].content}`}
                                          className="mb-0 task-name"
                                        >
                                          {task[1].content.substring(0, 40)}
                                        </h6>
                                        <div className="d-flex align-items-center">
                                          <h6 className="mr-5">
                                            {' '}
                                            ETA: {task[1].estimation}
                                          </h6>
                                          <h6>
                                            Status:{' '}
                                            {task[1].progress &&
                                              task[1].progress}
                                            %
                                            {task[1].progress === 100
                                              ? ` ( ${
                                                  task[1].hours_sum &&
                                                  task[1].hours_sum
                                                }) `
                                              : ''}
                                          </h6>
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )
                          )}
                      </section>
                    </section>
                  )
                )
              ) : (
                <Card
                  body
                  className="d-flex align-items-center justify-content-between"
                >
                  {' '}
                  <span>No record found.</span>
                </Card>
              )}
            </div>
            <Col sm={4}>
              <ProjectRightContainer
                name={name}
                projectStatus={projectStatus}
                startDate={graphDetails.start_date}
                endDate={graphDetails.end_date}
                totalHrsSpend={graphDetails.totalHrsSpend}
                totalHrsEstimate={graphDetails.totalHrsEstimate}
                totalHrsAllocated={graphDetails.totalHrsAllocated}
                projectCompletion={graphDetails.projectCompletion}
                url={graphDetails.url}
                managerName={managerName}
              />
            </Col>
          </div>
        </section>
      )}
    </>
  );
}

export default withRouter(TeamProject);