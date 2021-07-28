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

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  // const [allDate, setAllDate] = useState('');
  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'from_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  // Declare variable
 
const [rowData, setRowData] = useState([])
const [totalCount, setTotalCount] = useState(10);
const [limit, setLimit] = useState(5);
const [currentPage, setCurrentPage] = useState(1);
const [filterData, setFilterData] = useState({})

  // Declare columns Upcoming
  const columns = [
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'ctc',
      label: 'CTC Offer',
    },
    {
      id: 'status',
      label: 'Status',
    },
  ];

  // declare state graph
  const [graphData, setGraphData] = useState([]);
  const [shortlistedData, setShortlistedData] = useState([]);
  // const [centerPercentage, setCenterPercentage] = useState('');
  // const [centerShortlistPercentage, setCenterShortlistPercentage] =
  useState('');
  const graphref = useRef();

  useEffect(() => {
    const graph = [
      { x: 'Shortlisted', y: 30 },
      { x: 'Rejected', y: 50 },
      { x: 'Pending', y: 20 },
    ];
    const graphShortlistData = [
      { x: 'Selected', y: 35 },
      { x: 'Rejected', y: 55 },
      { x: 'Inprogress', y: 10 },
    ];
    setGraphData([...graph]);
    setShortlistedData([...graphShortlistData]);
  }, []);

  // some code

  // Get user role Filter

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);

    setFilterData(formValues);
  };

  const getselecteddate = async (value) => {
    const { data } = await AuthApi.getDataFromServer(value);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      undefined: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  const getHrName = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
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
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
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
    const { data } = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
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

  // Declare methods Up coming

const getRowData = async (pageNo=1) =>{
    const page = pageNo || currentPage;
    const endPoint = Api.applicantsUrl;
    const filterList = filterData && !customFunctions.checkIfEmpty(filterData,'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      page,
      limit,
      ...filterList
      }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData(data && data.data || []);
    }else{
      console.log('error', message)
    }
} 


useEffect(()=>{
  getRowData(1)
},[filterData])

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
            callbacks={{
              getselecteddate: (value) => {
                getselecteddate(value);
              },
            }}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Submit"
            showResetBtn={false}
            resetBtnText="Clear"
            btnContainerClass="form-submit-buttons pull-right"
            isStepForm={false}
            onFormReset={() => {
              console.log('form reset callback');
            }}
          />
        </Row>
        <hr />
        <Row className="mt-4">
          <h5>HR Activity</h5>
          <Col sm={6}>
            <Doughnut
              ref={graphref}
              // optional
              id="dougnut"
              s
              // required : data in array of object
              data={graphData}
              // optional: String : to show text in center
              subTitle=""
              // optional: String : to show text in center bold
              // title={centerPercentage}
              // optional : height for graph
              height="150"
              // optional : width for graph
              width="150"
              // optional : to use as constrain to visible area
              constrainToVisibleArea="true"
              // optional : to overirde tooltip message
              labels={({ datum }) => `${datum.x}: ${datum.y}%`}
              // optional : horizontal or vertical
              legendOrientation="vertical"
              // optional : left, right, top, buttom to show legends
              legendPosition="right"
              // optional : to show legends, also u can specify color by symbol inside fill color
              legendData={[
                { name: 'Shortlisted 20%', symbol: { fill: 'green' } },
                { name: 'Rejected 30%', symbol: { fill: 'red' } },
                { name: 'Pending 50%', symbol: { fill: 'yellow' } },
              ]}
              // optional : to custom legends color
              legends={{
                colorScale: ['green', 'red', 'yellow'],
              }}
              // optional : to manage legends based on height and width
              padding={{
                bottom: 0,
                left: 10,
                right: 10, // Adjusted to accommodate legend
                top: 0,
              }}
              // optional : to custom color on radious
              colorScale={['green', 'red', 'yellow']}
              // optional : wrapper size in px or percentage
              wrapperSize={{ height: '150px', width: '100%' }}
            />
          </Col>
          <Col sm={6}>
            <Doughnut
              ref={graphref}
              // optional
              id="dougnut"
              // required : data in array of object
              data={shortlistedData}
              // optional: String : to show text in center
              subTitle=""
              // optional: String : to show text in center bold
              // title={centerShortlistPercentage}
              // optional : height for graph
              height="150"
              // optional : width for graph
              width="150"
              // optional : to use as constrain to visible area
              constrainToVisibleArea="true"
              // optional : to overirde tooltip message
              labels={({ datum }) => `${datum.x}: ${datum.y}%`}
              // optional : horizontal or vertical
              legendOrientation="vertical"
              // optional : left, right, top, buttom to show legends
              legendPosition="right"
              // optional : to show legends, also u can specify color by symbol inside fill color
              legendData={[
                { name: 'Selected 20%', symbol: { fill: 'green' } },
                { name: 'Rejected 30%', symbol: { fill: 'red' } },
                { name: 'Inprogress 10%', symbol: { fill: 'yellow' } },
              ]}
              // optional : to custom legends color
              legends={{
                colorScale: ['red', 'yellow', 'green'],
              }}
              // optional : to manage legends based on height and width
              padding={{
                bottom: 0,
                left: 10,
                right: 10, // Adjusted to accommodate legend
                top: 0,
              }}
              // optional : to custom color on radious
              colorScale={['green', 'red', 'yellow']}
              // optional : wrapper size in px or percentage
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
