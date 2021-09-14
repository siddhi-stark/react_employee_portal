import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Doughnut from 'stark-doughnut-graph';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
// import StarkFormBuilder from 'stark-form-builder';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
// import FormSections from './formschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import constants from '../../helper/constants';

function TeamProject(props) {
  const teamid = props;
  const teamProjectId = teamid.match.params.teamProjectId;
  customFunctions.setLocalStorage('teamProjectId',teamProjectId);
  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
  ];

  const initialState = {
    totalHrsSpend: null,
    totalHrsAllocated: null,
    projectCompletion: null,
    url: '',
  };
  
  const history = useHistory();
  const [graphDetails, setGraphDetails] = useState(initialState);
  const [graphData, setGraphData] = useState([]);
  const [title, setTitle] = useState('');
  // const [legendData, setLegendData] = useState([]);

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Id',
      isDisplay: false
    },
    {
      id: 'team',
      label: 'Team',
      render: ({ team }) => {
        return (
          <>
          {(team !== 'Total') ? (
            <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                customFunctions.setLocalStorage('departmentType',team);
                e.preventDefault();
                e.stopPropagation();
                history.push(`/team/${team}`);
              }}
            >
             {team} 
            </a>
            ):(
                <span>{team}</span>
            )}
          </>
        );
      },
    },
    {
      id: 'spend',
      label: 'Spend Hours',
      render: ({ spend }) => {
        return (
          <>
           { Math.sign(spend) === 1 ||
            Math.sign(spend) === 0 ? (
              <span>
                {spend}{' '}
                {Math.sign(spend) === 0 ? 'Hr' : 'Hrs'}
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
      label: 'Allocated Hours',
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
      id: 'status',
      label: 'Team Status in %',
    },
  ];

  const getGraphData = async () => {
    const endPoint = `${Api.getProjects}${teamProjectId}/`;

      const url = customFunctions.generateUrl(endPoint);
      const { data } = await AuthApi.getDataFromServer(url);

      if(data){
    const graph = [
      { x: 'Pending Work', y: data && data.data && data.data.remaining },
      { x: 'Complete Work', y: data && data.data && data.data.allocated },
    ];
    setGraphDetails({
      totalHrsSpend: data && data.data && data.data.spend,
      totalHrsAllocated: data && data.data && data.data.allocated,
      projectCompletion: data && data.data && data.data.completion,
      url: data && data.data && data.data.tw_id,
    });
    setGraphData([...graph]);
      }
  };

  useEffect(() => {
    setTitle('Team Project');
    getGraphData();
  }, []);

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
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
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setName(data.data.name);
      newData.push({
        team:'Design',
        spend:data && data.data && data.data.design && data.data.design.spends,
        allocated:data && data.data && data.data.design && data.data.design.allocated,
        remaining:data && data.data && data.data.design && data.data.design.remaining,
        status:data && data.data && data.data.design && data.data.design.status
      },{
        team: 'Development',
        spend:data && data.data && data.data.development && data.data.development.spends,
        allocated:data && data.data && data.data.development && data.data.development.allocated,
        remaining:data && data.data && data.data.development && data.data.development.remaining,
        status:data && data.data && data.data.development && data.data.development.status
      },{
        team: 'QA',
        spend:data && data.data && data.data.quality_analyst && data.data.quality_analyst.spends,
        allocated:data && data.data && data.data.quality_analyst && data.data.quality_analyst.allocated,
        remaining:data && data.data && data.data.quality_analyst && data.data.quality_analyst.remaining,
        status:data && data.data && data.data.quality_analyst && data.data.quality_analyst.status
      },{
        team:'Project Management',
        spend:data && data.data && data.data.project_management && data.data.project_management.spends,
        allocated:data && data.data && data.data.project_management && data.data.project_management.allocated,
        remaining:data && data.data && data.data.project_management && data.data.project_management.remaining,
        status:data && data.data && data.data.project_management && data.data.project_management.status
      },{
        team:'Total',
        spend:data && data.data && data.data.total && data.data.total.spends,
        allocated:data && data.data && data.data.total && data.data.total.allocated,
        remaining:data && data.data && data.data.total && data.data.total.remaining,
        status:data && data.data && data.data.total && data.data.total.status
      });
      setRowData(newData || []);
    } else {
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
        <h2 className="main-content-title tx-24 mg-b-5">HR Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
        <div className="mb-3">
          <span>Project Name: {name}</span>
          <Button className="float-end" onClick= {() => history.push('/project')} >Back</Button>
        </div>
        <Row className="doughnut-graph-section">
          <Col>
            <Doughnut
              // ref={graphref}
              id="dougnut"
              data={graphData}
              subTitle=""
              // title={`${centerPercentage}%`}
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
              wrapperSize={{ height: '150px', width: '50%' }}
            />
          </Col>
          <Col>
            <p>
              Total Hours Spend: {graphDetails.totalHrsSpend}
              <br />
              Total Hrs Allocated: {graphDetails.totalHrsAllocated}
              <br />
              Project Completion: {graphDetails.projectCompletion}%<br />
              Team work URL:{' '}
              <a href={`${constants.project}${graphDetails.url}`} target="_blank" >
                <span>
                  <Image src="/images/redirect.png" />
                </span>
              </a>
              <br />
            </p>
          </Col>
        </Row>
        <hr />

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
      </Card>
    </>
  );
}

export default withRouter(TeamProject);
