import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Image } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import AddNote from './AddNote.component';

function EmployeeTeamLeaves() {
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
              history.push(`/edit-leave/${id}`, { isView: 'true' });
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
      roleAccess: [4],
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
                      submitForm(2);
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
      },
    }
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const limit = 10;
  const [title, setTitle] = useState('');
  const [userRole, setUserRole] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [modalShow, setModalShow] = useState(false);
  const [statusId, setStatusId] = useState('');

  let filterOptions = {};

  // Variable declarations Filter
  // const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});

  const history = useHistory();

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.leavesUrl}`;

    const params = {
      page,
      limit,
      sort_direction: 'descending',
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

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    getRowData(1);
    setTitle('Leaves');
  }, []);

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all&is_dropdown=1`);
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
      ...filterOptions,
      ...options,
      employee_id: dpOptions,
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployee();
  }, []);

    // Submit Form
  const submitForm = async (value) => { // eslint-disable-line
    const postData = {
      // id: leaveId,
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
          // updateDefaultValues({});
          swal.close();
        });
        // show error
        // return;
      } else {
        swal(data && data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
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
        <h2 className="main-content-title tx-24 mg-b-5">Employee Leaves</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Leaves</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[4]} roleId={userRole}>
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
                // statusData={statusData}
                // note={note}
                handleModalCLose={(e) => setModalShow(e)}
                // onStatusUpdate={() => {
                //   getApplicantListing();
                // }}
              />
            )}
          </Card>
      </section>
    </>
  );
}

export default withRouter(EmployeeTeamLeaves);
