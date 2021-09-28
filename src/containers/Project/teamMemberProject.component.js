import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import { Card, Button, ProgressBar, Image } from 'react-bootstrap';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function TeamMemberProject(props) {
  const teamid = props;
  const teamMemberId = teamid.match.params.teamMemberId;
  const getTeamId = customFunctions.getLocalStorage('departmentName');
  const schedular = teamid.location.state ? teamid.location.state.schedular
    : '';
  const teamId = teamid.location.state ? teamid.location.state.teamMemberId
    : ''; 
  const teamName = teamid.location.state ? teamid.location.state.teamMemberName
    : '';
  const archived = teamid.location.state ? teamid.location.state.archived
    : '';
  const teamMemberName = customFunctions.getLocalStorage('teamMemberName');
  const items = [
    { to: '/', label: 'Home' },
    { to:  archived ? '/archived-project' : '/current-project', label:  archived ? 'Archived Project' : 'Current Project' },
  ];

  const history = useHistory();
  const [title, setTitle] = useState('');

  // Declare variable column state
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoader,setShowLoader] = useState(false);
  
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
      label: 'Spent Hours',
    },
    {
      id: 'allocated',
      label: 'Estimated Hours',
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
    {
      id: 'completion',
      label: 'Project Completed',
      render: ({ completion }) => {
        return (
          <>
            {completion <= 50 && (
               <ProgressBar
                bsPrefix="progress pbar"
                variant="danger"
                now={completion}
                label={`${completion}%completed`}
              />
            )}
            {completion > 50 && completion <= 80 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="info"
                now={completion}
                label={`${completion}%completed`}
              />
            )}
            {completion > 80 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="success"
                now={completion}
                label={`${completion}%completed`}
              />
            )}
          </>
        );
      },
    }, 
    {
      id: 'rt_support',
      label: 'RT Support',
      roleAccess: [4],
      render: ({ rt_support }) => {
        return (
          <>
            <Image
              className="rt-support-link"
              src={rt_support ? '/images/success.svg' : '/images/fail.svg'}
            />
          </>
        );
      }, 
    },
  ];

  // Declare methods table method
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.departmentReportUrl}`;
    const params = {
      employee_id: teamId ? Number(teamId) : teamMemberId,
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data && data.data.project_data) || []);
    } else {
      setShowLoader(false);
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
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card body className="mt-4 schedular">
       <span>{teamName ? `${teamName} Projects and Work` : `${teamMemberName} Projects and Work`}</span>
         <Button className="float-end mb-3" onClick= {() =>{ if(schedular){
            history.push('/team-scheduler'); 
         } else if(archived) {
           history.push(`/team/${getTeamId}`,{archived:true});
         } else {
           history.push(`/team/${getTeamId}`) ;
          }
         }}>Back</Button>
            <CustomTable
              columns={columns}
              rows={rowData}
              tableClass="table-striped"
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
