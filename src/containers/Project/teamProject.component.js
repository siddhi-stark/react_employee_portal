import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
// import Doughnut from 'stark-doughnut-graph';
import { Bar, Pie } from 'react-chartjs-2';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import { Card, Row, Col, Image } from 'react-bootstrap';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import constants from '../../helper/constants';
import Loader from '../../components/Loader/index';

function TeamProject(props) {
  const grpData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50],
        backgroundColor: ['#85C51C', '#E3E3E3'],
      },
    ],
  };

  const teamid = props;
  const teamProjectId = teamid.match.params.teamProjectId;
  customFunctions.setLocalStorage('teamProjectId', teamProjectId);
  const [barGraphData, setBarGraphData] = useState({}); // eslint-disable-line
  const [isShowLoader, setShowLoader] = useState(false);

  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
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
  };

  const history = useHistory();
  const [graphDetails, setGraphDetails] = useState(initialState); // eslint-disable-line
  const [graphData, setGraphData] = useState([]); // eslint-disable-line
  const [title, setTitle] = useState('');

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');
  const [projectStatus, setProjectStatus] = useState(''); // eslint-disable-line
  const [graphDataObj, setGraphDataObj] = useState(initialGraphValue);

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Id',
      isDisplay: false,
    },
    {
      id: 'team',
      label: 'Team',
      render: ({ team, department }) => {
        return (
          <>
            {team !== 'Total' ? (
              <>
                <a
                  href="/"
                  className="pl-2 ms-1"
                  onClick={(e) => {
                    customFunctions.setLocalStorage(
                      'departmentType',
                      department
                    );
                    customFunctions.setLocalStorage('projectName', name);
                    customFunctions.setLocalStorage('departmentName', team);
                    e.preventDefault();
                    e.stopPropagation();
                    history.push(`/team/${team}`, { graphDataObj });
                  }}
                >
                  <strong> {team}</strong>
                </a>
              </>
            ) : (
              <span>
                <strong>{team}</strong>
              </span>
            )}
          </>
        );
      },
    },
    {
      id: 'spend',
      label: 'Spent Hours',
      render: ({ spend }) => {
        return (
          <>
            {Math.sign(spend) === 1 || Math.sign(spend) === 0 ? (
              <span>
                {spend} {Math.sign(spend) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span className="text-danger">{spend} Hrs</span>
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
      id: 'hours_allocated',
      label: 'Allocated Hours',
    },
    {
      id: 'remaining',
      label: 'Remaining Hours',
      render: ({ remaining }) => {
        return (
          <>
            {Math.sign(remaining) === 1 || Math.sign(remaining) === 0 ? (
              <span>
                {remaining} {Math.sign(remaining) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span className="text-danger">{remaining} Hrs</span>
            )}
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

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const newData = [];
    const page = pageNo || currentPage;
    const endPoint = `${Api.getProjects}${teamProjectId}/`;
    const params = {
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      let designHrs = '';
      let developmentHrs = '';
      let qaHrs = '';
      let managementHrs = '';
      setShowLoader(false);
      const graph = [
        { x: 'Pending Work', y: data && data.data && data.data.remaining_perc },
        { x: 'Complete Work', y: data && data.data && data.data.completion },
      ];
      setGraphDetails({
        totalHrsSpend: data && data.data && data.data.spend,
        totalHrsEstimate:
          data && data.data && data.data.total && data.data.total.allocated,
        totalHrsAllocated: data && data.data && data.data.hours_allocated,
        projectCompletion: data && data.data && data.data.completion,
        url: data && data.data && data.data.tw_id,
      });
      const allocated_hrs =
        data && data.data && Number(data.data.hours_allocated);
      const spend_hrs = data && data.data && Number(data.data.spend);
      const total = Number(allocated_hrs) - Number(spend_hrs);

      setProjectStatus(total);
      setGraphData([...graph]);

      data &&
        data.data &&
        data.data.project_dept_time_list &&
        data.data.project_dept_time_list.map((projectDept) => {
          switch (projectDept.team_name) {
            case 'Project Management':
              managementHrs =
                data.data.hours_allocated &&
                Number(data.data.hours_allocated) *
                  (Number(projectDept.value) / 100);
              break;
            case 'Development':
              developmentHrs =
                data.data.hours_allocated &&
                Number(data.data.hours_allocated) *
                  (Number(projectDept.value) / 100);
              break;
            case 'Design':
              designHrs =
                data.data.hours_allocated &&
                Number(data.data.hours_allocated) *
                  (Number(projectDept.value) / 100);
              break;
            case 'Quality Analysis':
              qaHrs =
                data.data.hours_allocated &&
                Number(data.data.hours_allocated) *
                  (Number(projectDept.value) / 100);
              break;
            default:
              return !projectDept.team_name;
          }
          return projectDept;
        });
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setName(data.data.name);
      newData.push(
        {
          team: 'Design',
          spend:
            data && data.data && data.data.design && data.data.design.spends,
          allocated:
            data && data.data && data.data.design && data.data.design.allocated,
          remaining:
            data && data.data && data.data.design && data.data.design.remaining,
          status:
            data && data.data && data.data.design && data.data.design.status,
          department:
            data && data.data && data.data.design && data.data.design.dept_id,
          hours_allocated: designHrs,
        },
        {
          team: 'Development',
          spend:
            data &&
            data.data &&
            data.data.development &&
            data.data.development.spends,
          allocated:
            data &&
            data.data &&
            data.data.development &&
            data.data.development.allocated,
          remaining:
            data &&
            data.data &&
            data.data.development &&
            data.data.development.remaining,
          status:
            data &&
            data.data &&
            data.data.development &&
            data.data.development.status,
          department:
            data &&
            data.data &&
            data.data.development &&
            data.data.development.dept_id,
          hours_allocated: developmentHrs,
        },
        {
          team: 'QA',
          spend:
            data &&
            data.data &&
            data.data.quality_analyst &&
            data.data.quality_analyst.spends,
          allocated:
            data &&
            data.data &&
            data.data.quality_analyst &&
            data.data.quality_analyst.allocated,
          remaining:
            data &&
            data.data &&
            data.data.quality_analyst &&
            data.data.quality_analyst.remaining,
          status:
            data &&
            data.data &&
            data.data.quality_analyst &&
            data.data.quality_analyst.status,
          department:
            data &&
            data.data &&
            data.data.quality_analyst &&
            data.data.quality_analyst.dept_id,
          hours_allocated: qaHrs,
        },
        {
          team: 'Project Management',
          spend:
            data &&
            data.data &&
            data.data.project_management &&
            data.data.project_management.spends,
          allocated:
            data &&
            data.data &&
            data.data.project_management &&
            data.data.project_management.allocated,
          remaining:
            data &&
            data.data &&
            data.data.project_management &&
            data.data.project_management.remaining,
          status:
            data &&
            data.data &&
            data.data.project_management &&
            data.data.project_management.status,
          department:
            data &&
            data.data &&
            data.data.project_management &&
            data.data.project_management.dept_id,
          hours_allocated: managementHrs,
        },
        {
          team: 'Total',
          spend: data && data.data && data.data.total && data.data.total.spends,
          allocated:
            data && data.data && data.data.total && data.data.total.allocated,
          remaining:
            data && data.data && data.data.total && data.data.total.remaining,
          status:
            data && data.data && data.data.total && data.data.total.status,
          hours_allocated:
            Number(qaHrs) +
            Number(managementHrs) +
            Number(developmentHrs) +
            Number(designHrs),
        }
      );
      setGraphDataObj({
        completion: data && data.data && data.data.completion,
        remaining_perc: data && data.data && data.data.remaining_perc,
        hours_allocated_qa: Number(qaHrs),
        hours_allocated_management: Number(managementHrs),
        hours_allocated_development: Number(developmentHrs),
        hours_allocated_design: Number(designHrs),
      });
      setRowData(newData || []);
      setBarGraphData({
        labels: [''],
        datasets: [
          {
            label: 'Allocated Hours',
            backgroundColor: '#85C51C',
            borderWidth: 2,
            data: [
              data && data.data && data.data.total && data.data.hours_allocated,
            ],
          },
          {
            label: 'Estimated Hours',
            backgroundColor: '#F4C222',
            borderWidth: 2,
            data: [
              data && data.data && data.data.total && data.data.total.allocated,
            ],
          },
          {
            label: 'Spent Hours',
            backgroundColor: '#f00000',
            borderWidth: 2,
            data: [
              data && data.data && data.data.total && data.data.total.spends,
            ],
          },
        ],
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
    getRowData(1);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Row>
          <Col sm={3}>
            <Card className="">
              <Card.Body>
                <strong>Task Status</strong>
                <Pie
                  data={grpData}
                  options={{
                    title: {
                      display: true,
                      text: 'Run Programs',
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
          <Col sm={5}>
            <Card className="">
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
          <Col sm={4}>
            <Card className="">
              <Card.Body>
                <p>Project Information</p>
                <img
                  src={`${Api.s3UrlnoProfile}`}
                  // src={imageProfile}
                  alt="img"
                  style={{ height: '5%', width: '40%' }}
                />{' '}
                <br />
                <strong>Employee Portal</strong>
                <br />
                <strong className="text-success mt-4">On Track</strong>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={8} id="main-content">
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
          </Col>
          <Col xl={4} id="right-sidebar">
            <Card className="">
              <Card.Body>
                <ul>
                  <li>
                    Total Hours Spent: <strong>{graphDetails.totalHrsSpend}</strong>
                  </li>
                  <li>
                    Total Hours Estimated:{' '}
                    <strong>{graphDetails.totalHrsEstimate}</strong>
                  </li>
                  <li>
                    Total Hours Allocated:{' '}
                    <strong>{graphDetails.totalHrsAllocated}</strong>
                  </li>
                  <li>
                    Project Completion:{' '}
                    <strong>{graphDetails.projectCompletion}%</strong>
                  </li>
                  <li>
                    Team work URL:{' '}
                    <a
                      href={`${constants.project}${graphDetails.url}`}
                      target="_blank"
                    >
                      <span>
                        <Image src="/images/redirect.png" />
                      </span>
                    </a>
                  </li>
                  <hr/>
                  <li>
                    <span>Karan H. Lorem ipsum text generator Lorem ipsum 
                    </span>
                  </li>
                  <li>
                    <span>Karan H. Lorem ipsum text generator Lorem ipsum 
                    </span>
                  </li>
                  <li>
                    <span>Karan H. Lorem ipsum text generator Lorem ipsum 
                    </span>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(TeamProject);
