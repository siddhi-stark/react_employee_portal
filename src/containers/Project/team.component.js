import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Doughnut from 'stark-doughnut-graph';
import { Bar } from 'react-chartjs-2';
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

function Team(props) {
  const teamid = props;
  const teamId = teamid.match.params.teamId;
  
  const teamProjectId = customFunctions.getLocalStorage('teamProjectId');
  const DepartmentID = customFunctions.getLocalStorage('departmentType');
  const getProjectName = customFunctions.getLocalStorage('projectName');

  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
  ];

  const history = useHistory();
  const [title, setTitle] = useState('');

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectName, setProjectName] = useState('');
  const departmentId = customFunctions.getLocalStorage('department');
  const [currentUser, updateCurrentUser] = useState(0);
  const [barGraphData, setBarGraphData] = useState({});

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
  const getRowData = async (pageNo = 1) => {
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
      setTotalCount(data.paginator.total_count);
      // setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      // setDepartmentName(data && data.data && data.data.department);
      setProjectName(data && data.data && data.data.project_name);
      data && data.data && data.data.employees_data && data.data.employees_data.map((emp)=>{
        if(emp.emp_name === 'Total') {
        setBarGraphData({
          labels: [''],
          datasets: [
            {
              label: 'Spent Hours',
              backgroundColor: '#F4C222',
              borderWidth: 2,
              data: [emp.spends]
            },
            {
              label: 'Estimated Hours',
              backgroundColor: '#FFB6C1',
              borderWidth: 2,
              data: [emp.allocated]
            },
            {
              label: 'Allocated Hours',
              backgroundColor: '#85C51C',
              borderWidth: 2,
              data: [emp.hours_allocated]
            }
          ]
        });
      }
      return emp;
      });
      setRowData((data && data.data && data.data.employees_data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    setTitle('Team Project');
    getRowData(1);
  }, []);

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
              // data={graphData}
              subTitle=""
              // title={`${graphDetails.projectCompletion}%`}
              height="150"
              width="150"
              constrainToVisibleArea="true"
              labels={({ datum }) => `${datum.x}: ${datum.y}%`}
              legendOrientation="vertical"
              legendPosition="right"
              // legendData={legendData}
              legends={{}}
              padding={{
                bottom: 0,
                left: 10,
                right: 10, // Adjusted to accommodate legend
                top: 0,
              }}
              colorScale={['yellow','green']}
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
            Total Hours Spent: <span>11</span>
            </li>
            <li>
            Total Hours Estimated: <span>100</span>
            </li>
            {
              ((Number(currentUser) === 4 && Number(departmentId) === 8) || Number(currentUser) === 1) && (
              <li>
              Total Hours Allocated: <span>15</span>
              </li>
            )} 
            <li>
            Project Completion: <span>50%</span>
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
                // itemsPerPage: limit,
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