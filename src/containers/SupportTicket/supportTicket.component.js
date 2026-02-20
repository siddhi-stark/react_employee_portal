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
  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Support Ticket' }];

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
  const limit = !props.data ? 10 : 5;

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [user, updateUser] = useState(0);
  const [createTask, setCreateTask] = useState();

  const statusArray = [
    currentUser == 7
      ? {
          id: '3',
          label: 'Resolved',
        }
      : {
          id: '2',
          label: 'Close',
        },
  ];

  const statusArray1 = [
    {
      id: '3',
      label: 'Resolved',
    },
  ];

  const statusArray2 = [
    {
      id: '2',
      label: 'Close',
    },
  ];

  const submitCloseTicket = (onChangeData = '') => {
    if (onChangeData) {
      swal({
        title: 'Are you sure?',
        text: 'you want to close the ticket.',
        icon: 'warning',
        buttons: ['Cancel', true],
        dangerMode: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
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
          const { data, message } = await AuthApi.putDataToServer(
            endPoint,
            postData
          );
          if (data) {
            setShowLoader(false);
            swal('Ticket status updated successfully!', '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            }).then(() => {
              swal.close();
              getRowData();
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
            setShowLoader(false);
          }
        }
      });
    }
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
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/view-support-ticket/${rowData.id}`, {
                  state: rowData.id,
                });
              }}
            >
              <strong>SST-{rowData.id}</strong>
            </a>
          </div>
        );
      },
    },
    {
      id: [1, 2, 7].includes(Number(userRole)) && 'user_full_name',
      label: [1, 2, 7].includes(Number(userRole)) && 'Name',
      render: [1, 2, 7].includes(Number(userRole))
        ? (row) => {
            return <>{row?.user_name}</>;
          }
        : null,
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
        return (
          <div>{`${customFunctions.getDMYDate(
            created_at
          )} ${customFunctions.formatAMPM(created_at)}`}</div>
        );
      },
    },
    {
      id: props?.data ? null : 'note',
      label: props?.data ? null : 'Comment',
      render: props?.data
        ? null
        : ({ comment }) => {
            return (
              <div title={comment}>
                {' '}
                {customFunctions.textAbstract(comment ? comment : '-', 20)}{' '}
              </div>
            );
          },
    },
    {
      id: props?.data ? null : 'updated_at',
      label: props?.data ? null : 'Updated Date',
      render: props?.data
        ? null
        : (rowData) => {
            return (
              <div>
                {rowData?.status_id == 1
                  ? '-'
                  : `${customFunctions.getDMYDate(
                      rowData?.updated_at
                    )} ${customFunctions.formatAMPM(rowData?.updated_at)}`}
              </div>
            );
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
            {currentUser == 1 && row.status_id === 1 && row.user != user ? (
              //  || (currentUser == 7 && row.status_id != 3 && row.status_id != 2 && row.user != user)
              // || (currentUser == 7 && row.user === user && row.status_id != 2 && row.status_id != 1)
              <DropdownInput
                // label={index === 0 ? "Document Type" : ""}
                placeholder=" Select Task"
                options={currentUser == 7 ? statusArray2 : statusArray1}
                defaultValue={{
                  label: customFunctions.capitalizeFirstLetter(row.status),
                  id: row.status_id,
                }}
                onSelectHandler={(select) => {
                  // setTicketStatus(select);
                  row.status = select.label;
                  row.status_id = select.id;
                  if (select.label === 'Resolved') {
                    setUpdateShow(true);
                    setCreateTask(row);
                  }
                  if (select.label === 'Close') {
                    submitCloseTicket(row, 'onChange');
                  }
                }}
                id="document"
              />
            ) : (
              <>
                {props?.data ||
                (currentUser === 7 &&
                  (row.status_id === 3 || row.status_id === 2)) ||
                (currentUser != 7 &&
                  (row.status_id === 2 || row.status_id === 1)) ||
                (currentUser === 1 && row.user != user) ||
                (currentUser === 1 &&
                  row.user === user &&
                  row.status_id === 1) ||
                (currentUser === 7 &&
                  row.user === user &&
                  row.status_id === 1) ? (
                  customFunctions.capitalizeFirstLetter(row?.status)
                ) : (
                  <DropdownInput
                    // label={index === 0 ? "Document Type" : ""}
                    placeholder=" Select Task"
                    options={
                      currentUser === 7 && row.user === user
                        ? statusArray2
                        : statusArray
                    }
                    defaultValue={{ label: row.status, id: row.status_id }}
                    onSelectHandler={(select) => {
                      // setTicketStatus(select);
                      row.status = select.label;
                      row.status_id = select.id;
                      if (select.label === 'Resolved') {
                        setUpdateShow(true);
                        setCreateTask(row);
                      }
                      if (select.label === 'Close') {
                        submitCloseTicket(row, 'onChange');
                      }
                    }}
                    id="document"
                  />
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

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
      setTotalCount(props?.data ? null : data.paginator.total_count);
      setItemsPerPage(props.data ? 5 : data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        const sDate = item.created_at;
        const eDate = new Date();
        const dateFirst = new Date(sDate);
        const dateSecond = new Date(eDate);

        var hours = Math.abs(dateFirst - dateSecond) / 36e5;

        if (hours > 4 && item.status === 'open') {
          newItem.rowClass = 'alert-danger';
        }

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

  useEffect(() => {
    getRowData(1);
  }, [filterData, !updateShow]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
    const userId = await localStorage.getItem('userId');
    updateUser(Number(userId));
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
      keyword:
        formValues.employee && formValues.employee.label
          ? formValues.employee.label
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
      `${Api.employeeUrl}?type=all&status=active`
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

      {props.data ? null : (
        <div className="page-header">
          <div className="title-breadcrumb-section">
            <h2 className="main-content-title tx-24 mg-b-5">Support Ticket</h2>
            <Breadcrumb items={items} />
          </div>
        </div>
      )}
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div>
          {/* {userRole != 7 ? ( */}

          {props.data ? null : (
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
                        `${
                          [1, 2].includes(Number(currentUser))
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
            </Card>
          )}
          {/* // ) : null} */}
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">
                  {props.data ? 'Recently Added Tickets' : ' '}
                </h5>
              </div>
              {userRole != 7 && userRole != 1 ? (
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
              ) : null}
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
            {props.data && (
              <Card.Footer>
                <div>
                  <a
                    className="d-flex align-items-center justify-content-end"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/support-ticket');
                    }}
                  >
                    View all
                  </a>
                </div>
              </Card.Footer>
            )}
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
