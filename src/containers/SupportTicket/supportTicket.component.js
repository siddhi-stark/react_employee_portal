/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Card } from 'react-bootstrap';
import { Helmet, DropdownInput } from '../../components/FormInputs';
// import  DropdownInput  from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import FormSections from './SupportTicketFilter.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import Addtask from './noteModel';

function SupportTicket(props) {
  const history = useHistory();
  const [pageTitle, setTitle] = useState('');
  const items = props.data ? null : [{ to: '/', label: 'Home' }, { label: 'Support Ticket' }];

  useEffect(() => {
    setTitle('Support Ticket');
  }, []);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isShowLoader, setShowLoader] = useState(false);
  const userRole = customFunctions.getLocalStorage('group');
  const [filterErr, setFilterErr] = useState('');
  const [updateShow, setUpdateShow] = useState(false);
  const limit = 10;

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  console.log('currentUser', currentUser);
  const [filterData, setFilterData] = useState({});

  const [createTask, setCreateTask] = useState();

  const statusArray = [
    userRole == 7
      ?
      {
        id: '3',
        label: 'Resolved',
      }
      :
      {
        id: '2',
        label: 'close',
      }
  ];

  // const handleActionCallback = ({ id, status_id }) => { // eslint-disable-line
  //   // eslint-disable-line
  //   return (
  //     <span className="d-flex">
  //       {[1, 2].includes(Number(userRole)) ? (
  //         <div>
  //           <a
  //             href="javascript:void(0)"
  //             className=""
  //             onClick={(e) => {
  //               e.preventDefault();
  //               e.stopPropagation();
  //               history.push(`/view-support-ticket/${id}`, { state: true });
  //             }}
  //           >
  //             <Image
  //               src="/images/eye.svg"
  //               className="delete-edit-view"
  //               alt="Edit SupportTicket"
  //             />
  //           </a>
  //         </div>
  //       ) : null}
  //       {status_id !== 2 ? (
  //         <a
  //           href="javascript:void(0)"
  //           className="ml-2"
  //           onClick={(e) => {
  //             e.preventDefault();
  //             e.stopPropagation();
  //             history.push(`/edit-support-ticket/${id}`);
  //           }}
  //         >
  //           <Image
  //             src="/images/edit-button.svg"
  //             className="delete-edit-view"
  //             alt="Edit SupportTicket"
  //           />
  //         </a>
  //       ) : null}

  //       {[9].includes(Number(userRole)) && (
  //         <a
  //           href="javascript:void(0)"
  //           className="ml-2"
  //           onClick={() => {
  //             //   e.preventDefault();
  //             //   e.stopPropagation();
  //             deleteTicket(id);
  //           }}
  //         >
  //           <Image
  //             src="/images/delete.png"
  //             className=""
  //             alt="Delete Support Ticket"
  //           />
  //         </a>
  //       )}
  //     </span>
  //   );
  // };

  const submitCloseTicket = (onChangeData = '') => {
    console.log('onChangeData',onChangeData);
    swal({
      title: "Are you sure?",
      text: "you want to close the ticket.",
      icon: "warning",
      buttons: ["Cancel", true],
      dangerMode: true,
    }).then(async () => {
      let postData = {
        id: onChangeData?.id,
        title: onChangeData.title,
        description: onChangeData.description,
        ticket_type: onChangeData.ticket_type,
        comment: onChangeData.comment,
        status: Number(onChangeData.status_id),
      };

      setShowLoader(true);
      const endPoint = `${Api.supportTicketUrl}${onChangeData?.id}/`;
      const { data, message } = await AuthApi.putDataToServer(endPoint, postData);
      if (data && data.success === true) {
        setShowLoader(false);
      } else {
        setShowLoader(false);
        swal(typeof message === "string" ? message : message[0], "", "error");
      }
      setShowLoader(false);
      swal(data && data.message[0], '', 'success');
      getRowData();
    })
  };


  const columns = [
    {
      id: 'id',
      label: 'Ticket Id',
      render: (row) => {
        const rowData = row;
        return (
          <div>
            <a
              href="javascript:void(0)"
              className=""
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/view-support-ticket/${rowData.id}`, {
                  state: rowData.id,
                });
              }}
            >
              SST-{rowData.id}
            </a>
          </div>
        );
      },
    },
    {
      id: [1, 2, 7].includes(Number(userRole)) && 'user_full_name',
      label: [1, 2, 7].includes(Number(userRole)) && 'Name',
      render: (row) => {
        console.log('row', row);
        return (
          <>{row?.user_name}</>
        )
      }
    },
    {
      id: 'title',
      label: 'Title',
      render: ({ title }) => {
        return (
          <div title={title}> {customFunctions.textAbstract(title, 15)} </div>
        );
      },
    },
    {
      id: 'created_at',
      label: 'Created Date',
      render: ({ created_at }) => {
        return <div>{`${customFunctions.getDMYDate(created_at)} ${customFunctions.formatAMPM(created_at)}`}</div>
      },
    },
    {
      id: props?.data ? null : 'note',
      label: props?.data ? null : 'Comment',
      render: props?.data ? null : ({ comment }) => {
        return (
          <div title={comment}>
            {' '}
            {customFunctions.textAbstract(comment, 20)}{' '}
          </div>
        );
      },
    },
    {
      id: props?.data ? null : 'updated_at',
      label: props?.data ? null : 'Updated Date',
      render: props?.data ? null : ({ updated_at }) => {
        return <div>{`${customFunctions.getDMYDate(updated_at)} ${customFunctions.formatAMPM(updated_at)}`}</div>
      },
    },
    // {
    //   id: 'ticket_type_name',
    //   label: 'Ticket Type',
    // },
    // {
    //   id: 'date_and_time',
    //   label: 'Date and Time',
    //   render: ({ date }) => {
    //     return <div>{customFunctions.getTimeFormatter(date)}</div>;
    //   },
    // },
    // {
    //   id: 'resolved_by_full_name',
    //   label: 'Resolved By',
    // },
    {
      label: 'Status',
      id: 'status',
      render: (row) => {
        return (
          <div>
            {props?.data || (currentUser === 7 && (row.status_id === 3 || row.status_id === 2)) ||
              (currentUser != 7 && (row.status_id === 2 || row.status_id === 1))
              ? row?.status :
              <DropdownInput
                // label={index === 0 ? "Document Type" : ""}
                placeholder=" Select Task"
                options={statusArray}
                defaultValue={
                  { label: row.status, id: row.status_id }
                }
                onSelectHandler={(select) => {
                  // setTicketStatus(select);
                  row.status = select.label;
                  row.status_id = select.id;
                  if (select.label === 'Resolved') {
                    setUpdateShow(true);
                    setCreateTask(row);
                  }
                  if (select.label === 'close') {
                    submitCloseTicket(row, 'onChange')
                  }
                }}
                id="document"
              />}
          </div>
        );
      },
    },
    // {
    //   id: 'action',
    //   label: 'Action',
    // },
  ];

  // const deleteTicket = (id) => {
  //   if (id) {
  //     swal({
  //       title: 'Are you sure?',
  //       text: 'Are you sure that you want to delete this record?',
  //       icon: 'warning',
  //       dangerMode: true,
  //       buttons: true,
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //     }).then(async (result) => {
  //       if (result) {
  //         const { data, message } = await AuthApi.deleteDataFromServer(
  //           `${Api.supportTicketUrl}${id}/`
  //         );
  //         if (data) {
  //           swal(data && data.message[0], '', 'success', {
  //             closeOnClickOutside: false,
  //             allowOutsideClick: false,
  //             buttons: false,
  //             timer: 2000,
  //           }).then(() => {
  //             swal.close();
  //             getRowData(1);
  //           });
  //         } else {
  //           swal(message, '', 'error', {
  //             closeOnClickOutside: false,
  //             allowOutsideClick: false,
  //           });
  //         }
  //       }
  //     });
  //   }
  // };

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.supportTicketUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      limit,
      page,
      sort_direction: 'descending',
      ...filterList,
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
        console.log('item------------->', item);
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        // rowClass =
        // date > 4 && item.status === 'open'
        //   ? 'alert-danger'
        //   : '';
        return newItem;
      });
      const dateAndTime =
        data &&
        data.data &&
        data.data.map((item) => {
          const addDate = item;
          return addDate;
        });
      setRowData(dateAndTime || []);
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  // const getDateAndTimeDifference = (milestone) => {
  //   const ndate = new Date(milestone);
  //   let today = new Date().toISOString().slice(0, 10);

  //   const startDate = ndate;
  //   const endDate = today;

  //   const diffInMs = new Date(startDate) - new Date(endDate);
  //   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  //   return parseInt(diffInDays);
  // };

  useEffect(() => {
    getRowData(1);
  }, [filterData, !updateShow]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    getUserRole();
    if ([1, 2].includes(Number(currentUser))) {
      getEmployee();
    }
  }, [currentUser]);

  // Submit Form
  const submitForm = async (formValues) => {
    const filterObj = {
      status:
        formValues.status && formValues.status.value
          ? formValues.status.value
          : '',
      user_id:
        formValues.employee && formValues.employee.value
          ? formValues.employee.value
          : '',
      ticket_type:
        formValues.ticket_type && formValues.ticket_type.value
          ? formValues.ticket_type.value
          : '',
    };
    setFilterData(filterObj);
    setFilterErr('');
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all`
    );
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
      employee: dpOptions,
    };
    updateOptions(allOptions);
  };

  const documentCallback = async (value) => {
    let taskArray = [];
    createTask.map((item, ind) => {
      if (value.index === ind) {
        taskArray.push({
          ...item,
          ...value,
        });
      } else {
        taskArray.push(item);
      }
    });
    setCreateTask(taskArray);
  };

  return (
    <>
      <Helmet title={pageTitle} />

      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Support Ticket</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          {/* {userRole != 7 ? ( */}

          {props.data ? null :
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0 mt-2 ">Filters</h5>
                </div>
                <hr />
                {filterErr && (
                  <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                    <div className="img-text">
                      <img
                        src="/images/fail.svg"
                        onClick={() => setFilterErr('')}
                        alt="Success"
                        className="rt-support-link"
                      />{' '}
                      {filterErr}
                    </div>
                  </div>
                )}
                <StarkFormBuilder
                  containerClass="mt-2"
                  formHeaderClass=""
                  formSections={FormSections}
                  onFormSubmit={(formValues) => {
                    if (
                      ([1, 2].includes(Number(currentUser)) &&
                        !formValues.employee &&
                        !formValues.ticket_type &&
                        !formValues.status) ||
                      (![1, 2].includes(Number(currentUser)) &&
                        !formValues.ticket_type &&
                        !formValues.status)
                    ) {
                      setFilterErr(
                        `${[1, 2].includes(Number(currentUser))
                          ? 'Please select the ticket type or employee name or status'
                          : 'Please select the ticket type or status'
                        }`
                      );
                    } else {
                      setFilterErr('');
                      submitForm(formValues);
                    }
                  }}
                  options={options}
                  callbacks={{}}
                  defaultFormValues={defaultValues}
                  currentUser={currentUser}
                  submitBtnText="Submit"
                  showResetBtn={true}
                  resetBtnText="Clear"
                  btnContainerClass="form-submit-buttons pull-right"
                  isStepForm={false}
                  onFormReset={() => {
                    setFilterErr('');
                    if (filterData && !Object.keys(filterData).length) return;
                    setFilterData({});
                  }}
                />
              </Card.Body>
            </Card>}
          {/* // ) : null} */}
          <Card>
            <Card.Body>
              {/* {userRole != 7 ? ( */}
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Support Tickets</h5>
                <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-support-ticket');
                    }}
                    className="btn-link"
                  >
                    Raise New Ticket
                  </a>
                </div>
              </div>
              {/* ) : null} */}
              <hr />
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
          </Card>
        </div>
      </section>
      {updateShow && (
        <Addtask
          data={createTask}
          updateShow={updateShow}
          handleClose={() => setUpdateShow(!updateShow)}
          callback={(value) => documentCallback(value)}
        />
      )}
    </>
  );
}

export default withRouter(SupportTicket);
