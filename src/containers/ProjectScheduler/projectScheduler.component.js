import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { to: '/project', label: 'Project Scheduler' },
];

function ProjectScheduler() {
  const history = useHistory();
  // Declare variable
  const [title, setTitle] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [status, setStatus] = useState(null); // eslint-disable-line
  // const departmentId = customFunctions.getLocalStorage('department');

  // Variable declarations Filter State
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  
  const projectData = [{
    id:1,name:'LXD',completion:50,start_date:'2021-09-11',end_date:'2021-09-11',hourly_rate:20,estimate_hrs:1,hours_allocated:55,project_cost:5555,status:'active'
  },{
        id:2,name:'Employee Portal',completion:50,start_date:'2021-09-12',end_date:'2021-09-12',hourly_rate:20,estimate_hrs:1,hours_allocated:55,project_cost:5555,status:'active'
  },{
        name:'Total',completion:100,hourly_rate:2000,estimate_hrs:500,hours_allocated:505,project_cost:55550
  }]

  const handleActionCallback = ({id}) => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             history.push(`/view-project/${id}`,{isView:true});
          }}
        >
          <Image alt="view" src="/images/eye.svg" />
        </a>
        <a
          href="/"
          className="pl-2 ms-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-project/${id}`,{isView:false});
          }}
        >
          <Image src="/images/edit-button.svg" />
        </a>
      </>
    );
  };    

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr.No',
      roleAccess: [4],
    },
    {
      id: 'coordinator',
      label: 'Co-ordinator',
      roleAccess: [4],
    },
    {
      id: 'name',
      label: 'Project Name',
      roleAccess: [4],
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'developer',
      label: 'Developer',
      roleAccess: [4],
    },
    {
      id: 'rt_support',
      label: 'UI Support',
      roleAccess: [4],
      render: ({ rt_support }) => {
        return (
          <>
            <span>{rt_support ? 'Yes':'No'}</span>
          </>
        );
      }, 
    },
    {
      id: 'expected_clc',
      label: 'Expected CLC',
      roleAccess: [4],
      render: ({ expected_clc }) => {
        return (
          <>
            <span>{expected_clc && customFunctions.getDMYDate(expected_clc)}</span>
          </>
        );
      },
    },
    {
      id:  'comment',
      label: 'Comments',
    },
    {
      id: 'link',
      label: 'Teamwork Project Link',
      render: handleActionCallback
    },
  ];

  const getRowData = async (pageNo = 1) => { // eslint-disable-line
    const page = pageNo || currentPage;
    const endPoint = `${Api.applicantPercentageUrl}`; 
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      page,
      limit,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    console.log('data');
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    // getRowData(1);
    setTitle('Project Scheduler');
    setRowData(projectData || []);
  }, [filterData]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Scheduler</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary m-0">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <p>Filter</p>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Project</h4>
              </div>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(ProjectScheduler);
