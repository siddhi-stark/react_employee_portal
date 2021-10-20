import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
// import Doughnut from 'stark-doughnut-graph';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
// import StarkFormBuilder from 'stark-form-builder';
import { Card, Row, Col, Button } from 'react-bootstrap';
// import FormSections from './formschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';
import ProjectRightContainer from '../../components/RightContainer/projectRightContainer.component';

function Team(props) {
  const teamid = props;
  const teamId = teamid.match.params.teamId;
  const graphDataObj = teamid.location.state
    ? teamid.location.state.graphDataObj
    : '';  
  const archived = teamid.location.state
    ? teamid.location.state.archived
    : ''; 
  const projectStatus = teamid.location.state
    ? teamid.location.state.projectStatus
    : '';
  const teamProjectId = customFunctions.getLocalStorage('teamProjectId');
  const DepartmentID = customFunctions.getLocalStorage('departmentType');
  const getProjectName = customFunctions.getLocalStorage('projectName');

  const items = [
    { to: '/', label: 'Home' },
    { to:  archived ? '/archived-project' : '/current-project', label:  archived ? 'Archived Project' : 'Current Project' },
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
  const [employeeGraphData, setEmployeeGraphData] = useState([]);

  // Declare columns
  const columns = [
    {
      id: 'emp_id',
      label: 'Id',
      isDisplay: false,
    },
    {
      id: 'emp_name',
      label: 'Team',
      render: ({ emp_id, emp_name }) => {
        return (
          <>
            {emp_name !== 'Total' &&
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
                  customFunctions.setLocalStorage('teamMemberId', emp_id);
                  customFunctions.setLocalStorage('teamMemberName', emp_name);
                  if(archived){ 
                    history.push(`/my-project/${emp_id}`,{archived:true});
                  } else {
                    history.push(`/my-project/${emp_id}`);
                  }
                }}
              >
              <strong>  {emp_name} </strong>
              </a>
            ) : (
              <span>{emp_name}</span>
            )}
          </>
        );
      },
    },
    {
      id: 'spends',
      label: 'Spent Hours',
      render: ({ spends }) => {
        return (
          <>
            {Math.sign(spends) === 1 || Math.sign(spends) === 0 ? (
              <span>
                {spends} {Math.sign(spends) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span className="text-danger">{spends} Hrs</span>
            )}
          </>
        );
      },
    },
    {
      id: 'allocated',
      label: 'Estimated Hours',
      render: ({ allocated }) => {
        return (
          <>
          {allocated.toFixed(2)}
          </>
          )
      }
    },
    {
      id: 'remaining',
      label: 'Remaining Hours',
      render: ({ remaining }) => {
        return (
          <>
            <span>
              {remaining} %
            </span>
          </>
        );
      },
    },
    {
      id: 'completed',
      label: 'Task Completed',
    },
  ];

  // Declare methods table method
  const getRowData = async (pageNo = 1) => { // eslint-disable-line
    const employeeData = [];
    const employeeEstimatedHrs = [];
    const employeeSpendingHrs = [];

    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.departmentReportUrl}`;
    const params = {
      department: DepartmentID,
      project_id: teamProjectId,
      page,
      limit: 1000,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      data && data.data && data.data.employees_data && data.data.employees_data.map((empdata)=>{
        const employeeNewData = empdata;
        const add = {'rowClass':(empdata.remaining > 100 && empdata.emp_name !== 'Total')?'alert-danger':''};
        Object.entries(add).forEach(([key,value]) => { employeeNewData[key] = value; });
        return employeeNewData ;
      });

      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setCurrentPage(Number(data.paginator.current_page));
      setProjectName(data && data.data && data.data.project_name);
      setRowData((data && data.data && data.data.employees_data) || []);
      switch (data && data.data && data.data.department) {
        case 'Project Management':
          setGraphAllocatedHrs(graphDataObj && graphDataObj.hours_allocated_management);
          break;
        case 'Development':
          setGraphAllocatedHrs(graphDataObj && graphDataObj.hours_allocated_development);
          break;
        case 'Design':
          setGraphAllocatedHrs(graphDataObj && graphDataObj.hours_allocated_design);
          break;
        case 'Quality Analysis':
          setGraphAllocatedHrs(graphDataObj && graphDataObj.hours_allocated_qa);
          break;
        default:
          return !data.data.department;
      }

      data &&
        data.data &&
        data.data.employees_data &&
        data.data.employees_data.map((emp) => {
          if (emp.emp_name === 'Total') {
            const graph = {
              labels: ['Completed', 'Pending'],
              datasets: [
                    {
                      data: [emp.completion, emp.completion && 100 - Number(emp.completion),],
                  backgroundColor: ['#8cc540', '#e3e3e3'],
                },
              ],
            };
          
            setGraphData(graph);
            setGraphDetails({
              totalHrsSpend: emp.spends,
              totalHrsEstimate: emp.allocated,
              projectCompletion: emp.completion,
              totalHrsAllocated: graphAllocatedHrs
            });
            setBarGraphData({
              labels: ['Allocated Hours  Estimated Hours  Spending Hours'],
              datasets: [
                {
                  label: 'Allocated Hours',
                  backgroundColor: '#3ad2e3',
                  borderWidth: 1,
                  data: [graphAllocatedHrs],
                },
                {
                  label: 'Estimated Hours',
                  backgroundColor: '#8cc540',
                  borderWidth: 1,
                  data: [emp.allocated],
                },
                {
                  label: 'Spent Hours',
                  backgroundColor: '#f4c222',
                  borderWidth: 1,
                  data: [emp.spends],
                },
              ],
            });
          } else {
            employeeData.push(emp.emp_name);
            employeeSpendingHrs.push(emp.spends);
            employeeEstimatedHrs.push(emp.allocated);
            setEmployeeGraphData({
              labels: employeeData,
              datasets: [
                {
                  label: 'Estimated Hours',
                  backgroundColor: '#85C51C',
                  borderWidth: 1,
                  data: employeeEstimatedHrs,
                },
                {
                  label: 'Spent Hours',
                  backgroundColor: '#F4C222',
                  borderWidth: 1,
                  data: employeeSpendingHrs,
                },
              ],
            });
          }
          return emp;
        });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
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

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button className="float-end mb-3" onClick= {() => archived ? history.push(`/team-project/${teamProjectId}`,{archived:true}) : history.push(`/team-project/${teamProjectId}`)} >Back</Button>
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
                    <Pie data={graphData} />
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={8} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="purple-bg">
                    <strong>Hours Analysis</strong>
                  </Card.Header>
                  <Card.Body>
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
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} className="mb-3">
                <Card className="team-performance">
                <Card.Header className="purple-bg">
                   <strong>Team's Performance</strong>
                  </Card.Header>
                  <Card.Body>
                    <Bar
                      data={employeeGraphData}
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
                  </Card.Body>
                </Card>
              </Col>
              <Card className="p-0">
                <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-0 mt-2 ">Team Details</h5>
                  </div>
                  <hr/>
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
              name = {getProjectName ?`${getProjectName} ${teamId} Team` : `${projectName} ${teamId} Team`}
              projectStatus = {projectStatus}
              startDate ={graphDetails.start_date}
              endDate ={graphDetails.end_date}
              totalHrsSpend={graphDetails.totalHrsSpend}
              totalHrsEstimate ={graphDetails.totalHrsEstimate}
              totalHrsAllocated ={graphDetails.totalHrsAllocated}
              projectCompletion ={graphDetails.projectCompletion}
            />
         
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(Team);
