import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Doughnut from 'stark-doughnut-graph';
// import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { Card, Row, Col } from 'react-bootstrap';
import FormSections from './formschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';

function HrReports() {
  let defaultFilterOptions = {};
  const items = [
    { to: '/', label: 'Home' },
    { to: '/hr-reports', label: 'HR Reports' },
  ];

  const title = 'HR Reports';
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'from_date' || sectionData.name === 'to_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });
 
const [rowData, setRowData] = useState([]);
const [totalCount, setTotalCount] = useState(10);
const [limit, setLimit] = useState(10);
const [currentPage, setCurrentPage] = useState(1);
const [filterData, setFilterData] = useState({});

  const columns = [
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'offered_ctc',
      label: 'Offered CTC',
    },
    {
      id: 'status_name',
      label: 'Status',
    },
  ];

  const initialState = {
      shortlistedCount:null,
      totalApplicantCount:null,
      rejectedCount:null,
      pendingCount:null,
      declinedCount:null,
      selectedCount:null,
      finalCount:null
  };

  const [shortlistedGraph, setShortlistedGraph] = useState(initialState);
  const [graphData, setGraphData] = useState([]);
  const [shortlistedData, setShortlistedData] = useState([]);
  const [legendData, setLegendData] = useState([]); // eslint-disable-line
  const [legendSelectedData, setLegendSelectedData] = useState([]); // eslint-disable-line
  const graphref = useRef();

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    setFilterData({
      hr_id: formValues.hr_name && formValues.hr_name.value,
      designation_id: formValues.position && formValues.position.value,
      technology_id: formValues.technology && formValues.technology.value,
      start_date: formValues.from_date && customFunctions.getDate(formValues.from_date),
      end_date: formValues.to_date && customFunctions.getDate(formValues.to_date)
    });
  };

  const getHrName = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}?role_id=5&is_dropdown=1`);
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      hr_name: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getHrName();
  }, []);

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      position: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getPosition();
  }, []);

  const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeStackUrl}?type=all`);
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      technology: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getTechnology();
  }, []);

const getRowData = async (pageNo=1) =>{
    const page = pageNo || currentPage;
    const endPoint = Api.offerUrl;
      const filterList = filterData && !customFunctions.checkIfEmpty(filterData,'O') ? customFunctions.jsonParse(filterData) : {};
 
    const params = {
      page,
      limit,
      sort_by: 'name',
      ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData(data && data.data || []);
    }
};

useEffect(()=>{
  getRowData(1);
},[filterData]);

  const getGraphData = async () => {
    const endPoint = Api.hrReportUrl;
    const filterList = filterData && !customFunctions.checkIfEmpty(filterData,'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      ...filterList
      };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if(data){
      const graph = [
        { x: 'Shortlisted', y: data.data.shortlisted_percentage },
        { x: 'Rejected', y: data.data.declined_percentage },
        { x: 'Pending', y: data.data.pending_percentage },
      ];
      const legData = [
        { name: `Shortlisted ${data.data.shortlisted_percentage}%`, symbol: { fill: 'green' } },
        { name: `Declined ${data.data.declined_percentage}%`, symbol: { fill: 'red' } },
        { name: `Pending ${data.data.pending_percentage}%`, symbol: { fill: 'yellow' } },
        { name: `Applicant ${data.data.total_applicant_percentage}%`, symbol: { fill: 'none' } },
      ];
      const selectedGraph = [
        { x: 'Selected', y: data.data.shortlisted_final_percentage },
        { x: 'Rejected', y: data.data.rejected_final_percentage },
      ];
      const selectedlegData = [
        { name: `Selected ${data.data.shortlisted_final_percentage}%`, symbol: { fill: 'green' } },
        { name: `Rejected ${data.data.rejected_final_percentage}%`, symbol: { fill: 'red' } },
        { name: `Shortlisted ${data.data.total_final_percentage}%`, symbol: { fill: 'none' } },
      ];
      setShortlistedGraph({
        shortlistedCount:data.data.shortlisted_count,
        declinedCount:data.data.declined_count,
        pendingCount:data.data.pending_count,
        totalApplicantCount:data.data.total_applicant_count,
        selectedCount: data.data.shortlisted_final_count,
        rejectedCount:data.data.rejected_final_count,
        finalCount:data.data.total_final_count,
        applicant: data.data.total_applicant_percentage,
        shortlisted : data.data.total_final_percentage
      });
      setShortlistedData([...selectedGraph]);
      setLegendData([...legData]);
      setLegendSelectedData([...selectedlegData]);
      setGraphData([...graph]);
    }
  };

  useEffect(()=>{
    getGraphData();
  },[filterData]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">HR Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
        <Row>
          <StarkFormBuilder
            containerClass=""
            formHeaderClass=""
            formSections={FormSections}
            formHeading="Filter"
            onFormSubmit={(formValues) => {
              submitForm(formValues);
            }}
            options={options}
            callbacks={{}}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Apply"
            showResetBtn={true}
            resetBtnText="Clear"
            btnContainerClass="form-submit-buttons pull-right"
            isStepForm={false}
            onFormReset={() => {
              setFilterData({});
            }}
          />
        </Row>
        <hr />
        <Row className="mt-4 doughnut-graph-section">
          <h5>HR Activity</h5>
          <Col className="col-sm-6 d-flex pb-4">
          <p>Shortlisted: {shortlistedGraph.shortlistedCount}<br/>
          Declined: {shortlistedGraph.declinedCount}<br/>
          Pending: {shortlistedGraph.pendingCount}<br/>
          Total Applicant: {shortlistedGraph.totalApplicantCount}<br/>
          Applicant: {shortlistedGraph.applicant}%<br/>
          </p>
            <Doughnut
              ref={graphref}
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
                colorScale: ['green', 'red', 'yellow'],
              }}
              padding={{
                bottom: 0,
                left: 10,
                right: 10, // Adjusted to accommodate legend
                top: 0,
              }}
              colorScale={['green', 'red', 'yellow']}
              wrapperSize={{ height: '150px', width: '100%' }}
            />
          </Col>
          <Col className="col-sm-6 d-flex">
          <p>Selected: {shortlistedGraph.selectedCount} <br/>
            Rejected: {shortlistedGraph.rejectedCount}<br/>
            Total Shortlisted: {shortlistedGraph.finalCount}<br/>
            Shortlisted: {shortlistedGraph.shortlisted}%</p>
            <Doughnut
              ref={graphref}
              id="dougnut"
              data={shortlistedData}
              subTitle=""
              // title={`${centerShortlistPercentage}%`}
              height="150"
              width="150"
              constrainToVisibleArea="true"
              labels={({ datum }) => `${datum.x}: ${datum.y}%`}
              legendOrientation="vertical"
              legendPosition="right"
              // legendData={legendSelectedData}
              legends={{
                colorScale: ['red', 'yellow', 'green'],
              }}
              padding={{
                bottom: 0,
                left: 10,
                right: 10, // Adjusted to accommodate legend
                top: 0,
              }}
              colorScale={['green', 'red', 'yellow']}
              wrapperSize={{ height: '150px', width: '100%' }}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <h5>Offer Status</h5>
          <CustomTable
            columns={columns}
            rows={rowData}
            showPagination={true}
            tableClass="table-striped"
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
        </Row>
      </Card>
    </>
  );
}

export default withRouter(HrReports);
