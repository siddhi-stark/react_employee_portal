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

function TeamMemberProject(props) {
  const teamid = props;
  const teamMemberId = teamid.match.params.teamMemberId;
  const getTeamId = customFunctions.getLocalStorage('departmentType');

  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
  ];

  const history = useHistory();
  const [title, setTitle] = useState('');

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
      id: 'spends',
      label: 'Spend Hours',
    },
    {
      id: 'allocated',
      label: 'Allocated Hours',
    },
    {
      id: 'remaining',
      label: 'Remaining Hours',
    },
    {
      id: 'completed',
      label: 'Task Completed',
    },
    {
      id: 'completion',
      label: 'Project Completed',
    }, 
   {
      id: 'rt_support',
      label: 'Runtime Support',
      roleAccess: [4],
      render: ({ rt_support }) => {
        return (
          <>
            <span>{rt_support ? 'Yes':'No'}</span>
          </>
        );
      }, 
    },
  ];

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.departmentReportUrl}`;
    const params = {
      employee_id: teamMemberId,
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data && data.data.project_data) || []);
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

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
         <Button className="float-end mb-3" onClick= {() => history.push(`/team/${getTeamId}`)} >Back</Button>
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
