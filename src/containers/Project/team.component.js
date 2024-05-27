/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from 'react-chartjs-2';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';
import ProjectRightContainer from '../../components/RightContainer/projectRightContainer.component';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

function Team(props) {
  const teamid = props;
  const teamId = teamid.match.params.teamId;
  const graphDataObj = teamid.location.state
    ? teamid.location.state.graphDataObj
    : '';
  const archived = teamid.location.state ? teamid.location.state.archived : '';
  const projectStatus = teamid.location.state
    ? teamid.location.state.projectStatus
    : '';
  const teamProjectId = customFunctions.getLocalStorage('teamProjectId');
  const DepartmentID = customFunctions.getLocalStorage('departmentType');
  const getProjectName = customFunctions.getLocalStorage('projectName');

  const items = [
    { to: '/', label: 'Home' },
    {
      label: archived ? 'Archived Project' : 'Current Project',
    },
  ];

  const history = useHistory();
  const [title, setTitle] = useState('');

  const initialState = {
    totalHrsSpend: null,
    totalHrsEstimate: null,
    totalHrsAllocated: null,
    projectCompletion: null,
  };

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectName, setProjectName] = useState(''); // eslint-disable-line
  const departmentId = customFunctions.getLocalStorage('department');
  const [currentUser, updateCurrentUser] = useState(0);
  const [barGraphData, setBarGraphData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const [graphDetails, setGraphDetails] = useState(initialState);
  const [graphAllocatedHrs, setGraphAllocatedHrs] = useState(null);
  const [graphData, setGraphData] = useState({});
  const [name, setName] = useState('');
  const [employeeGraphData, setEmployeeGraphData] = useState([]);
  const managerName = customFunctions.getLocalStorage('managerName');

  // Declare columns
  const columns = [
    {
      id: 'employee_id',
      label: 'Id',
      isDisplay: false,
    },
    {
      id: 'employee_name',
      label: 'Team',
      render: ({ employee_name, employee_id }) => {
        return (
          <>
            {employee_name !== 'Total' &&
            ((Number(currentUser) === 4 &&
              (Number(departmentId) === 8 ||
                Number(departmentId) === 9 ||
                Number(departmentId) === 1)) ||
              Number(currentUser) === 1 ||
              Number(currentUser) === 2 ||
              Number(currentUser) === 3) ? (
              <a
                href="/"
                className="pl-2 ms-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  customFunctions.setLocalStorage('teamMemberId', employee_id);
                  customFunctions.setLocalStorage(
                    'teamMemberName',
                    employee_name
                  );
                  if (archived) {
                    history.push(`/my-project/${employee_id}`, {
                      archived: true,
                    });
                  } else {
                    history.push(`/my-project/${employee_id}`);
                  }
                }}
              >
                <strong> {employee_name} </strong>
              </a>
            ) : (
              <span>{employee_name}</span>
            )}
          </>
        );
      },
    },
    {
      id: 'total_spent_time_in_hours',
      label: 'Spent Hours',
      render: ({ hour_analysis_details }) => {
        const { total_spent_time_in_hours } = hour_analysis_details;
        return (
          <>
            {Math.sign(total_spent_time_in_hours) === 1 ||
            Math.sign(total_spent_time_in_hours) === 0 ? (
              <span>
                {total_spent_time_in_hours}{' '}
                {Math.sign(total_spent_time_in_hours) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span className="text-danger">
                {total_spent_time_in_hours} Hrs
              </span>
            )}
          </>
        );
      },
    },
    {
      id: 'total_given_estimation_in_hours',
      label: 'Estimated Hours',
      render: ({ hour_analysis_details }) => {
        const { total_given_estimation_in_hours } = hour_analysis_details;
        return <>{total_given_estimation_in_hours.toFixed(2)} Hrs</>;
      },
    },
    {
      id: 'total_remaining_est_in_hours',
      label: 'Remaining Hours',
      render: ({ hour_analysis_details }) => {
        const { total_remaining_est_in_hours } = hour_analysis_details;
        return (
          <>
            <span>{total_remaining_est_in_hours} Hrs </span>
          </>
        );
      },
    },
    {
      id: 'total_completed_tasks',
      label: 'Task Completed',
      render: ({ task_status_details }) => {
        const { total_completed_tasks } = task_status_details;
        return <>{total_completed_tasks.toFixed(2)}</>;
      },
    },
  ];

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    const employeeData = [];
    const employeeEstimatedHrs = [];
    const employeeSpendingHrs = [];

    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.departmentReport}`;
    const params = {
      department_id: DepartmentID,
      project_id: teamProjectId,
      is_all_data: true,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      data?.data?.length > 0 &&
        data?.data?.map((empdata) => {
          const employeeNewData = empdata;
          const add = {
            rowClass:
              empdata.remaining > 100 && empdata.emp_name !== 'Total'
                ? 'alert-danger'
                : '',
          };
          Object.entries(add).forEach(([key, value]) => {
            employeeNewData[key] = value;
          });
          return employeeNewData;
        });

      const graph = {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            data: [
              data &&
                data?.data &&
                data?.data?.[0]?.department_details?.task_status_details
                  ?.department_total_completed_tasks,
              data &&
                data?.data &&
                data?.data?.[0]?.department_details?.task_status_details
                  ?.department_total_task_incomplete_count,
            ],
            backgroundColor: ['#8cc540', '#e3e3e3'],
          },
        ],
      };
      setGraphData(graph);

      setBarGraphData({
        labels: ['Allocated Hours  Estimated Hours  Spending Hours'],
        datasets: [
          {
            label: 'Allocated Hours',
            backgroundColor: '#3ad2e3',
            borderWidth: 1,
            data: [
              data?.data?.[0]?.department_details?.hour_analysis_details
                ?.department_total_allocated_estimation_in_hours,
            ],
          },
          {
            label: 'Estimated Hours',
            backgroundColor: '#8cc540',
            borderWidth: 1,
            data: [
              data?.data?.[0]?.department_details?.hour_analysis_details
                ?.department_total_given_estimation_in_hours,
            ],
          },
          {
            label: 'Spent Hours',
            backgroundColor: '#f4c222',
            borderWidth: 1,
            data: [
              data?.data?.[0]?.department_details?.hour_analysis_details
                ?.department_total_spent_time_in_hours,
            ],
          },
        ],
      });
      setGraphDetails({
        totalHrsSpend:
          data?.data?.[0]?.department_details?.hour_analysis_details
            ?.department_total_spent_time_in_hours,
        totalHrsEstimate:
          data?.data?.[0]?.department_details?.hour_analysis_details
            ?.department_total_given_estimation_in_hours,
        projectCompletion: data?.data?.[0]?.total_project_completion_percentage,
        // url: data && data.data && data.data.tw_id,
        start_date: customFunctions.getDMYDate(
          data?.data?.[0]?.project_start_date
        ),
        end_date: customFunctions.getDMYDate(data?.data?.[0]?.project_end_date),
      });
      employeeData.push(data?.data?.[0]?.employee_details?.[0]?.employee_name);
      employeeSpendingHrs.push(
        data?.data?.[0]?.employee_details?.[0]?.hour_analysis_details
          ?.total_spent_time_in_hours
      );
      employeeEstimatedHrs.push(
        data?.data?.[0]?.employee_details?.[0]?.hour_analysis_details
          ?.total_given_estimation_in_hours
      );

      setEmployeeGraphData({
        labels: data?.data?.[0]?.employee_details.map(
          (item) => item?.employee_name
        ),
        datasets: [
          {
            label: 'Estimated Hours',
            backgroundColor: '#85C51C',
            borderWidth: 1,
            data: 
              data?.data?.[0]?.employee_details.map(
                (item) =>
                  item.hour_analysis_details?.total_given_estimation_in_hours
              ),
            
          },
          {
            label: 'Spent Hours',
            backgroundColor: '#F4C222',
            borderWidth: 1,
            data: 
              data?.data?.[0]?.employee_details.map(
                (item) => item.hour_analysis_details?.total_spent_time_in_hours
              ),
            
          },
        ],
      });
      setName(data?.data?.[0]?.department_name);
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setCurrentPage(Number(data.paginator.current_page));
      setProjectName(data && data.data && data.data.project_name);
      setRowData(
        data &&
          data.data &&
          data.data?.[0] &&
          data.data?.[0]?.employee_details &&
          data.data?.[0]?.employee_details?.length
          ? data.data?.[0]?.employee_details
          : []
      );
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    return page;
  };

  useEffect(() => {
    setTitle('Team Project');
    getRowData(1);
  }, [graphAllocatedHrs]);

  // Get user role Filter
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const graphOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Team Bar Graph',
        fontSize: 20,
      },
      legend: {
        display: true,
        position: 'right',
      },
    }
  };


  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button
          className="float-end mb-3"
          onClick={() =>
            archived
              ? history.push(`/team-project/${teamProjectId}`, {
                  archived: true,
                })
              : history.push(`/team-project/${teamProjectId}`)
          }
        >
          Back
        </Button>
        <h2 className="main-content-title tx-24 mg-b-5">Project Dashboard</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Row>
          <Col sm={8}>
            <Row>
              <Col sm={4} className="mb-4">
                <Card className="h-100 pie-chart-graph">
                  <Card.Header className="purple-bg">
                    <strong>Task Status</strong>
                  </Card.Header>
                  <Card.Body>
                    {Object.keys(graphData).length && <Pie data={graphData} />}
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={8} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="purple-bg">
                    <strong>Hours Analysis</strong>
                  </Card.Header>
                  <Card.Body>
                    {Object.keys(barGraphData).length && (
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
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} className="mb-3">
                <Card className="">
                  <Card.Header className="purple-bg">
                    <strong>Team's Performance</strong>
                  </Card.Header>
                  <Card.Body>
                    {Object.keys(employeeGraphData).length && (
                      <Bar
                        data={employeeGraphData}
                        options={graphOptions}
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Card className="p-0">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-0 mt-2 ">Team Details</h5>
                  </div>
                  <hr />
                  <CustomTable
                    columns={columns}
                    rows={rowData}
                    tableClass="table-striped"
                    showPagination={false}
                    paginationProps={{
                      totalItems: totalCount,
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
              managerName={managerName}
            />
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(Team);