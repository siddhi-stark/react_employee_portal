import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import Doughnut from 'stark-doughnut-graph';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
// import StarkFormBuilder from 'stark-form-builder';
import { Card, Button, Row, Col } from 'react-bootstrap';
// import FormSections from './formschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function Team(props) {
  const teamid = props;
  const teamId = teamid.match.params.teamId;
  const graphDataObj = teamid.location.state ? teamid.location.state.graphDataObj
    : '';
  const teamProjectId = customFunctions.getLocalStorage('teamProjectId');
  const DepartmentID = customFunctions.getLocalStorage('departmentType');
  const getProjectName = customFunctions.getLocalStorage('projectName');

  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
  ];

  const history = useHistory();
  const [title, setTitle] = useState('');
  
  const initialState = {
    totalHrsSpend: null,
    totalHrsEstimate: null,
    projectCompletion:null
  };

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectName, setProjectName] = useState('');
  const departmentId = customFunctions.getLocalStorage('department');
  const [currentUser, updateCurrentUser] = useState(0);
  const [barGraphData, setBarGraphData] = useState({});
  const [isShowLoader,setShowLoader] = useState(false);
  const [graphDetails, setGraphDetails] = useState(initialState);
  const [graphAllocatedHrs, setGraphAllocatedHrs] = useState(null);
  const [graphData, setGraphData] = useState([]);

  // Declare columns
  const columns = [
    {
      id: 'emp_id',
      label: 'Id',
      isDisplay: false
    },
    {
      id: 'emp_name',
      label: 'Team',
      render: ({ emp_id, emp_name }) => {
        return (
          <>
          {(emp_name !== 'Total' &&((Number(currentUser) === 4 && (Number(departmentId) === 8 || Number(departmentId) === 9 || Number(departmentId) === 1) || Number(currentUser) === 1) || Number(currentUser) === 2 || Number(currentUser) === 3)) ? (
              <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                customFunctions.setLocalStorage('teamMemberId',emp_id);
                customFunctions.setLocalStorage('teamMemberName',emp_name);
                history.push(`/my-project/${emp_id}`);
              }}
            >
             {emp_name} 
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
           { Math.sign(spends) === 1 ||
            Math.sign(spends) === 0 ? (
              <span>
                {spends}{' '}
                {Math.sign(spends) === 0 ? 'Hr' : 'Hrs'}
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
    },
    {
      id: 'remaining',
      label: 'Remaining Hours',
      render: ({ remaining }) => {
        return (
          <>
           { Math.sign(remaining) === 1 ||
            Math.sign(remaining) === 0 ? (
              <span>
                {remaining}{' '}
                {Math.sign(remaining) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span className="text-danger">{remaining} Hrs</span>
            )}
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
  const getRowData = async (pageNo = 1) => {  // eslint-disable-line
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.departmentReportUrl}`;
    const params = {
      department: DepartmentID,
      project_id: teamProjectId,
      page,
      limit:1000
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setCurrentPage(Number(data.paginator.current_page));
      setProjectName(data && data.data && data.data.project_name);
      setRowData((data && data.data && data.data.employees_data) || []);
       switch (data &&  data.data && data.data.department) {
        case 'Project Management':
          setGraphAllocatedHrs(graphDataObj.hours_allocated_management);
          break;
        case 'Development':
          setGraphAllocatedHrs(graphDataObj.hours_allocated_development);
          break;
        case 'Design':
          setGraphAllocatedHrs(graphDataObj.hours_allocated_design);
          break;
        case 'Quality Analysis':
          setGraphAllocatedHrs(graphDataObj.hours_allocated_qa);
          break;
        default:
          return !data.data.department;
      }

      data && data.data && data.data.employees_data && data.data.employees_data.map((emp)=>{
        if(emp.emp_name === 'Total') {
          const graph = [
            { x: 'Pending Work', y: emp.completion && (100 - Number(emp.completion)) },
            { x: 'Complete Work', y: emp.completion },
          ];
          setGraphData([...graph]);
          setGraphDetails({
            totalHrsSpend: emp.spends,
            totalHrsEstimate: emp.allocated,
            projectCompletion: emp.completion
          });  
             setBarGraphData({
              labels: [''],
              datasets: [
                {
                  label: 'Spent Hours',
                  backgroundColor: '#f00000',
                  borderWidth: 2,
                  data: [emp.spends]
                },
                {
                  label: 'Estimated Hours',
                  backgroundColor: '#F4C222',
                  borderWidth: 2,
                  data: [emp.allocated]
                },
                {
                  label: 'Allocated Hours',
                  backgroundColor: '#85C51C',
                  borderWidth: 2,
                  data: [graphAllocatedHrs]
                }
              ]
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
  const getUserRole = async() => {
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
        <h2 className="main-content-title tx-24 mg-b-5">Project</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card body className="mt-4">
      <Row className="mb-3">
         <Col>
          <span>{getProjectName ?`${getProjectName} ${teamId} Team` : `${projectName} ${teamId} Team`}</span>
          </Col>
          <Col>
         <Button className="float-end mb-3" onClick= {() => history.push(`/team-project/${teamProjectId}`)} >Back</Button>
          </Col>
        </Row>

        <Row className="doughnut-graph-section">
          <Col sm={3}>
            <Doughnut
              // ref={graphref}
              id="dougnut"
              data={graphData}
              subTitle=""
              title={`${graphDetails.projectCompletion}%`}
              height="150"
              width="150"
              constrainToVisibleArea="true"
              labels={({ datum }) => `${datum.x}: ${datum.y}%`}
              legendOrientation="vertical"
              legendPosition="right"
              legends={{}}
              padding={{
                bottom: 0,
                left: 10,
                right: 10, // Adjusted to accommodate legend
                top: 0,
              }}
              colorScale={['yellow','green','red']}
              wrapperSize={{ height: '150px', width: '100%' }}
            />
          </Col>
          <Col sm={4}>
          <Bar
            data={barGraphData}
             options={{
                title:{
                  display:true,
                  text:'Team Bar Graph',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              }}
          />
          </Col>
          <Col sm={5}>
          <ul>
            <li>
            Total Hours Spent: <span>{graphDetails.totalHrsSpend}</span>
            </li>
            <li>
            Total Hours Estimated: <span>{graphDetails.totalHrsEstimate}</span>
            </li>
            <li>
              Total Hours Allocated: <span>{graphAllocatedHrs}</span>
            </li>
            
            </ul>
          </Col>
        </Row>
        <hr />
            <CustomTable
              columns={columns}
              rows={rowData}
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
      </Card>
    </>
  );
}

export default withRouter(Team);