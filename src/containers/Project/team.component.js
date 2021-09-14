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

function Team(props) {
  const teamid = props;
  const teamId = teamid.match.params.teamId;
  const teamProjectId = customFunctions.getLocalStorage('teamProjectId');

  const items = [
    { to: '/', label: 'Home' },
    { to: '/project', label: 'Project' },
  ];

  const history = useHistory();
  const [title, setTitle] = useState('');
  // const [legendData, setLegendData] = useState([]);

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentName, setDepartmentName] = useState('');
  const [projectName, setProjectName] = useState('');

  // const [filterData, setFilterData] = useState({});

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
            <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                customFunctions.setLocalStorage('teamMemberId',emp_id);
                history.push(`/my-project/${emp_id}`);
              }}
            >
             {emp_name} 
            </a>
          </>
        );
      },
    },
    {
      id: 'spends',
      label: 'Spend Hours',
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
      id: 'completed',
      label: 'Task Completed',
    },
  ];

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.departmentReportUrl}`;
    const params = {
      department: teamId,
      project_id: teamProjectId,
      page,
      limit
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setDepartmentName(data && data.data && data.data.department);
      setProjectName(data && data.data && data.data.project_name);
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

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
      <div className="mb-3">
          <span>{`${projectName} ${departmentName} Team`}</span>
         <Button className="float-end" onClick= {() => history.push(`/team-project/${teamProjectId}`)} >Back</Button>
        </div>
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

export default withRouter(Team);
