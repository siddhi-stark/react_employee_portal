import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Doughnut from 'stark-doughnut-graph';
// import swal from 'sweetalert';
// import CustomTable from 'stark-custom-datatable';
// import StarkFormBuilder from 'stark-form-builder';
import { Card, Row, Col } from 'react-bootstrap';
// import FormSections from './formschema.json';
// import Api from '../../helper/api';
// import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
// import customFunctions from '../../helper/customFunctions';

function TeamProject() {
  const items = [
    { to: '/', label: 'Home' },
    { to: '/hr-reports', label: 'HR Reports' },
  ];

  const title = 'HR Reports';
 
   const initialState = {
      totalHrsSpend: null,
      totalHrsAllocated: null,
      projectCompletion: null,
      url:''
  };

  const [graphDetails, setGraphDetails] = useState(initialState);
  const [graphData, setGraphData] = useState([]);
  // const [legendData, setLegendData] = useState([]);

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
        { x: 'Shortlisted', y: 50 },
        { x: 'Rejected', y: 30 },
        { x: 'Pending', y: 20 },
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
        url: 'https://sdms.teamwork.com/#/tasklists/1609657'
      });
  //     setShortlistedData([...selectedGraph]);
      // setLegendData([...legData]);
  //     setLegendSelectedData([...selectedlegData]);
      setGraphData([...graph]);
  //   }
  };

  useEffect(()=>{
    getGraphData();
  },[]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">HR Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
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
            legends={{
            }}
            padding={{
              bottom: 0,
              left: 10,
              right: 10, // Adjusted to accommodate legend
              top: 0,
            }}
            wrapperSize={{ height: '150px', width: '50%' }}
          />
        </Col>
        <Col>
          <p>Total Hours Spend: {graphDetails.totalHrsSpend}<br/>
          Total Hrs Allocated: {graphDetails.totalHrsAllocated}<br/>
          Project Completion: {graphDetails.projectCompletion}%<br/>
          Team work URL: <a alt="url" href={graphDetails.url}>link</a><br/>
          </p>
        </Col>
        </Row>
        <hr />
      </Card>
    </>
  );
}

export default withRouter(TeamProject);
