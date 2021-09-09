import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
// import StarkFormBuilder from 'stark-form-builder';
import { Card, Button } from 'react-bootstrap';
// import FormSections from './formschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';

function TeamMemberProject() {
  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
  ];

  const projectData = [{
    id:1,project_name:'LXD',spend_hrs:50,remaining_hrs:500,allocated_hrs:55,task_status: '3/2',project_status:'55%',support:'No'
  },{
      id:2,project_name:'Employee Portal',spend_hrs:50,remaining_hrs:500,allocated_hrs:55,task_status:'4/5',project_status:'55%',support:'Yes'
  }]

  const history = useHistory();
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
      id: 'project_name',
      label: 'Project',
    },
    {
      id: 'spend_hrs',
      label: 'Spend Hours',
    },
    {
      id: 'allocated_hrs',
      label: 'Allocated Hours',
    },
    {
      id: 'remaining_hrs',
      label: 'Remaining Hours',
    },
    {
      id: 'task_status',
      label: 'Task Completed',
    },
    {
      id: 'project_status',
      label: 'Project Completed',
    }, 
    {
      id: 'support',
      label: 'Runtime Support',
    },
  ];

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
    setTitle('Team Project');
    setRowData(projectData);
    getRowData(1);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
         <Button className="float-end mb-3" onClick= {() => history.push('/project')} >Back</Button>
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

export default withRouter(TeamMemberProject);
