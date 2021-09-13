import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Doughnut from 'stark-doughnut-graph';
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

function TeamProject() {
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
  
  const projectData = [{
    id:1,team:'Design',spend_hrs:50,remaining_hrs:500,allocated_hrs:55,team_status:'200%'
  },{
      id:2,team:'Development',spend_hrs:50,remaining_hrs:500,allocated_hrs:55,team_status:'200%'
  },{
      team:'Total',spend_hrs:100,remaining_hrs:200,estimate_hrs:500,allocated_hrs:505,team_status:'400%'
  }];

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
  // const [filterData, setFilterData] = useState({});

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
      render: ({ id, team }) => {
        return (
          <>
            <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/team/${id}`);
              }}
            >
             {team} 
            </a>
          </>
        );
      },
    },
    {
      id: 'spend_hrs',
      label: 'Spend Hours',
      render: ({ spend_hrs }) => {
        return (
          <>
            <span className="text-danger">{spend_hrs} Hrs</span>
          </>
        );
      },
    },
    {
      id: 'allocated_hrs',
      label: 'Allocated Hours',
    },
    {
      id: 'remaining_hrs',
      label: 'Remaining Hours',
      render: ({ remaining_hrs }) => {
        return (
          <>
            <span className="text-danger">{remaining_hrs} Hrs</span>
          </>
        );
      },
    },
    {
      id: 'team_status',
      label: 'Team Status in %',
    },
  ];

  const getGraphData = async () => {
    //   const endPoint = Api.hrReportUrl;
    //   const filterList = filterData && !customFunctions.checkIfEmpty(filterData,'O') ? customFunctions.jsonParse(filterData) : {};
    //   const params = {
    //     ...filterList
    //     };
    //   const url = customFunctions.generateUrl(endPoint, params);
    //   const { data } = await AuthApi.getDataFromServer(url);

    //   if(data){
    const graph = [
      { x: 'Pending Work', y: 20 },
      { x: 'Complete Work', y: 80 },
    ];
    // const legData = [
    //   { name: `Total Hours Spend 188` },
    //   { name: `Total Hrs Allocated 425`},
    //   { name: `Project Completion 45%`},
    //   { name: `Team work URL`},
    // ];
    //     const selectedGraph = [
    //       { x: 'Selected', y: data.data.shortlisted_final_percentage },
    //       { x: 'Rejected', y: data.data.rejected_final_percentage },
    //     ];
    //     const selectedlegData = [
    //       { name: `Selected ${data.data.shortlisted_final_percentage}%`, symbol: { fill: 'green' } },
    //       { name: `Rejected ${data.data.rejected_final_percentage}%`, symbol: { fill: 'red' } },
    //       { name: `Shortlisted ${data.data.total_final_percentage}%`, symbol: { fill: 'none' } },
    //     ];
    setGraphDetails({
      totalHrsSpend: 188,
      totalHrsAllocated: 425,
      projectCompletion: 45,
      url: 'https://sdms.teamwork.com/#/tasklists/1609657',
    });
    //     setShortlistedData([...selectedGraph]);
    // setLegendData([...legData]);
    //     setLegendSelectedData([...selectedlegData]);
    setGraphData([...graph]);
    //   }
  };

  useEffect(() => {
    setTitle('Team Project');
    getGraphData();
  }, []);

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    // const filterList =
    //   filterData && !customFunctions.checkIfEmpty(filterData, 'O')
    //     ? customFunctions.jsonParse(filterData)
    //     : {};
    const params = {
      page,
      limit,
      // ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      // setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    setRowData(projectData);
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
         <Button className="float-end" onClick= {() => history.push('/project')} >Back</Button>
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
              <a alt="url" target="_blank" href={graphDetails.url}>
                link
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
