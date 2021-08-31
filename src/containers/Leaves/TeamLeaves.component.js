import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import AddNote from './AddNote.component';

function TeamLeaves() {
  const [currentUser, updateCurrentUser] = useState(0);

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'id',
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'user_name',
      label: 'Name',
      roleAccess: [4],
      render: ({ user_name, id, status_name }) => { // eslint-disable-line
        return (
          <>
          {(status_name !== 'Pending') ? (
           <a
          href="/"
          className="pl-2"
          title={(status_name !== 'Pending') && 'View Leave'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             if(status_name !== 'Pending'){
              history.push(`/view-leave/${id}`, { isView: 'true' });
            }
          }}
        >
        {user_name}
           </a>) :(
            <span>{user_name}</span> 
      )}
          </>
        );
      },
    },
    {
      id: 'leave_date',
      label: 'Leave Date',
      roleAccess: [3],
      render: ({ leave_from_date, leave_to_date }) => { // eslint-disable-line
        return (
          <>
            <span>{`${customFunctions.getNewFormattedDate(
              leave_from_date
            )} to ${customFunctions.getNewFormattedDate(
              leave_to_date
            )}`}</span>
          </>
        );
      },
    },
    {
      id: 'leave_type',
      label: 'Type',
    },
    {
      id: 'leave_count',
      label: 'Days',
      roleAccess: [4],
    },
    {
      id: 'status_name',
      label: 'Status',
       render: ({ id, status_name }) => { // eslint-disable-line
        return (
          <>
         
         { status_name === 'Pending' ? (
                <>
                  <Image
                    title = "Accept"
                    onClick={() => {
                      submitForm(id);
                    }}
                    alt="Accept"
                    src="/images/success.svg"
                  />
                  <Image
                    title = "Declined"
                    onClick={() => {
                      setStatusId(id);
                      setModalShow(true);
                    }}
                    alt="Declined"
                    src="/images/fail.svg"
                    className="ms-2"
                  />
                </>
                ) :(
           <span> {status_name} </span>
           )}
          </>
        );
      }
      }
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const limit = 10;
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  let filterOptions = {};
  const [modalShow, setModalShow] = useState(false);
  const [statusId, setStatusId] = useState('');

  // Variable declarations Filter
  const [options, updateOptions] = useState({});

  const history = useHistory();

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.leavesUrl}`;

    const params = {
      page,
      limit,
      my_team:true,
      sort_by: 'leave_from_date',
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });
      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    getRowData(1);
    setTitle('Leaves');
  }, []);

  const getEmployee = async () => {
    const endPoint = (Number(currentUser) === 3 || Number(currentUser) === 6 || Number(currentUser) === 2) ? `${Api.teamUrl}?type=all` : `${Api.employeeUrl}?type=all&is_dropdown=1`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!data) {
      // show error
      return;
    }
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: (Number(currentUser) === 3 || Number(currentUser) === 6 || Number(currentUser) === 2) ? op.employee_name : op.full_name, value: (Number(currentUser) === 3 || Number(currentUser) === 6 || Number(currentUser) === 2) ? op.employee_id :op.id });
      return op;
    });
    const allOptions = {
      ...filterOptions,
      ...options,
      employee_id: dpOptions,
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployee();
  }, [currentUser]);

    // Submit Form
  const submitForm = async (idValue) => {
    const postData = {
      id: idValue,
      status: 2,
    };

    swal({
      title: 'Are you sure?',
      text: `You want to accept the leave ?`,
      icon: 'warning',
      dangerMode: true,
      buttons: true,
      closeOnClickOutside: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result) {
      const { data, message } = await AuthApi.putDataToServer(
        Api.leavesUrl,
        postData
      );

      if (!data) {
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          getRowData(1);
          swal.close();
        });
        // show error
        // return;
      } else {
        swal(data && data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(1);
          swal.close();
        });
       }
      }
    });
    // Perform success actions
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Team Leaves</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Leaves</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[4]} roleId={currentUser}>
                    <a
                      href="#"
                      onClick={() => {
                        history.push('/add-leave');
                      }}
                      className="btn-link"
                    >
                      Apply Leave
                    </a>
                  </UserRestrictions>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>

            {modalShow && (
              <AddNote
                show={modalShow}
                statusId={statusId}
                handleModalCLose={(e) => setModalShow(e)}
                onStatusUpdate={() => {
                  getRowData(1);
                }}
              />
            )}
          </Card>
      </section>
    </>
  );
}

export default withRouter(TeamLeaves);
