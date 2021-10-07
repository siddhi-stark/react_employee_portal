import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import SearchFormSections from './searchFormschema.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import AddNote from './AddNote.component';
import Loader from '../../components/Loader/index';

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
      render: ({ user_name, id }) => { 
        return (
          <>
           <a
              href="/"
              className="pl-2"
              title="View Leave"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                  history.push(`/view-leave/${id}`, { isView: 'true', isViewLeave : true });
              }}
            >
            {user_name}
           </a>
          </>
        );
      },
    },
    {
      id: 'leave_date',
      label: 'Leave Date',
      roleAccess: [3],
      render: ({ leave_from_date, leave_to_date }) => { 
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
       render: ({ id, status_name,leave_from_date }) => { 
        return (
          <>
         
         { (status_name === 'Pending' && customFunctions.getDate(new Date()) <= leave_from_date)? (
                <>
                  <Image
                    title = "Accept"
                    onClick={() => {
                      setLeaveId(id);
                      setStatusId(2);
                      setModalShow(true);
                    }}
                    alt="Accept"
                    src="/images/success.svg"
                  />
                  <Image
                    title = "Declined"
                    onClick={() => {
                      setLeaveId(id);
                      setStatusId(3);
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
  const [modalShow, setModalShow] = useState(false);
  const [statusId, setStatusId] = useState('');
  const [leaveId, setLeaveId] = useState('');
  const [isShowLoader,setShowLoader] = useState(false);
  const [filterData, setFilterData] = useState({});

  const history = useHistory();

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.leavesUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      page,
      limit,
      my_team:true,
      sort_by: 'leave_from_date',
      sort_direction:'descending',
      ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
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
      setShowLoader(false);
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
  }, [filterData]);
   
  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Team Leaves</h2>
        <Breadcrumb items={items} />
      </div>
    <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
          <Card>
          <Card.Body>
             <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
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
               <hr/>
              <div className="filter-box-main">
              <StarkFormBuilder
                containerClass=''
                formHeaderClass=''
                formSections={SearchFormSections}
                formHeading=""
                onFormSubmit={(formValues) => {submitForm(formValues);}}
                callbacks={{}}
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={false}
                btnContainerClass="col-md-4 filter-apply-btns"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  setFilterData();
                }}
              />
              </div>
            </Card.Body>
            </Card>
            <Card>
            <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Team Leaves</h5>
               </div> 
               <hr/> 
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
                leaveId={leaveId}
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
