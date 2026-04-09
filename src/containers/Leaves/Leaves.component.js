/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card, Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import MyLeavesFilterSchema from './myLeavesFilterSchema.json';
import LeaveCalendar from '../../components/LeaveCalendar/LeaveCalendar.component';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function Leaves() {
  const handleActionCallback = ({ id, status_name, status, leave_from_date }) => {

    const parsedDate1 = new Date(leave_from_date);
    const parsedDate2 = new Date();
    const onlyDate1 = new Date(parsedDate1.getFullYear(), parsedDate1.getMonth(), parsedDate1.getDate());
    const onlyDate2 = new Date(parsedDate2.getFullYear(), parsedDate2.getMonth(), parsedDate2.getDate());

    return (
      <>
        <a
          href="/"
          className="pl-2"
          title={
            status_name !== 'Pending' || status_name === 'Approved'
              ? 'View Leave'
              : 'Edit Leave'
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (status_name !== 'Pending' || status_name === 'Approved') {
              history.push(`/edit-leave/${id}`, { isViewLeave: true });
            } else {
              history.push(`/edit-leave/${id}`, {
                isViewLeave: false,
                isView: 'false',
              });
            }
          }}
        >
          {status_name !== 'Pending' || status_name === 'Approved' ? (
            <Image src="/images/eye.svg" />
          ) : (
            <Image alt="view" src="/images/edit-button.svg" />
          )}
        </a>
        {new Date() <= new Date(leave_from_date) && status === 1 && (
          <a
            href="/"
            className="ms-2 pl-2"
            title="Cancel Leave"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeStatus(id);
            }}
          >
            {(status === 2 || status === 1) && (
              <Image src="/images/fail.svg" />
            )}
          </a>
        )}

        {/* {onlyDate1.getTime() <= onlyDate2.getTime() && status === 2 && (
          <a
            href="/"
            className="ms-2 pl-2"
            title="Revert Leave"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeStatus(id);
            }}
          >
            <Image src="/images/caret-down.svg" />

          </a>
        )} */}

      </>
    );
  };

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
      id: 'leave_date',
      label: 'Leave Date',
      roleAccess: [3],
      render: ({ leave_from_date, leave_to_date }) => {
        return (
          <>
            <span>{`${customFunctions.getNewFormattedDate(
              leave_from_date
            )} to ${customFunctions.getNewFormattedDate(leave_to_date)}`}</span>
          </>
        );
      },
    },
    {
      id: 'leave_type',
      label: 'Type',
    },
    {
      id: 'half_day_status',
      label: 'Leave Durations',
      roleAccess: [8],
      render: ({ half_day_status }) => {
        return (<>
          {half_day_status ? (half_day_status === 1 ? "Half Day in First Half" : "Half Day in Second Half") : "Full Day"}
        </>)
      },
    },
    // {
    //   id: 'leave_payment_type',
    //   label: 'Leave Payment Type',
    //   roleAccess: [8],
    //   render: ({ leave_payment_type }) => {
    //     return (<>
    //       {leave_payment_type ? (leave_payment_type === 1 ? "Paid" : "Unpaid") : "-"}
    //     </>)
    //   },
    // },
    {
      id: 'leave_count',
      label: 'Days',
      render: ({ leave_count, is_sandwich }) => {
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: is_sandwich ? 'red' : 'transparent',
              color: is_sandwich ? 'white' : 'black',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '1px solid #ccc',
              cursor: 'pointer', 
            }}
            title={is_sandwich ? 'This is a sandwich leave count' : 'Leave count'} 
          >
            {leave_count ? `${leave_count}` : '0'}
          </span>
        );
      },
      roleAccess: [4],
    },

    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: 'revert_status_name',
      label: 'Revert Status',
      render: ({ id, leave_from_date, status, revert_status_name, revert_status, revert_declined_reason }) => {
        const parsedDate1 = new Date(leave_from_date);
        const parsedDate2 = new Date();
        const onlyDate1 = new Date(parsedDate1.getFullYear(), parsedDate1.getMonth(), parsedDate1.getDate());
        const onlyDate2 = new Date(parsedDate2.getFullYear(), parsedDate2.getMonth(), parsedDate2.getDate());

        return (
          <>
            {onlyDate1.getTime() >= onlyDate2.getTime() && status === 2 && revert_status === 4 ? (
              <a
                href="/"
                className="ms-2 pl-2"
                title="Revert Leave"
                style={{
                  display: "inline-block",
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textAlign: "center",
                  textDecoration: "none",
                  borderRadius: "4px",
                  border: "1px solid #007bff",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // changeStatus(id);
                    submitRevertForm(id)
                  }}

              >
                Apply Revert
              </a>
            ) : (<>

              <a
                style={{
                  position: "relative",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const tooltip = document.createElement("div");
                  tooltip.innerText = revert_declined_reason
                    ? revert_declined_reason
                    : "Note not present."; // Replace with your dynamic value
                  tooltip.style.position = "absolute";
                  tooltip.style.top = "100%";
                  tooltip.style.left = "50%";
                  tooltip.style.transform = "translateX(-50%)";
                  tooltip.style.backgroundColor = "#333";
                  tooltip.style.color = "#fff";
                  tooltip.style.padding = "4px 8px";
                  tooltip.style.borderRadius = "4px";
                  tooltip.style.whiteSpace = "nowrap";
                  tooltip.style.fontSize = "12px";
                  tooltip.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)";
                  tooltip.style.zIndex = "1000";
                  tooltip.classList.add("custom-tooltip"); // Use a class instead of an ID
                  e.currentTarget.appendChild(tooltip); // Attach tooltip to the current element
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.querySelector(".custom-tooltip");
                  if (tooltip) {
                    tooltip.remove();
                  }
                }}
              >
                {revert_status_name}
              </a>
            </>)
            }
          </>
        );
      },

      // isDisplay:true
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const limit = 10;
  const [title, setTitle] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'taken'
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [filterData, setFilterData] = useState({});
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [holidays, setHolidays] = useState([]);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];

  const history = useHistory();

  const getRowData = async (pageNo = 1, tab = null, forCalendar = false) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const currentTab = tab || activeTab;
    const endPoint = `${Api.leavesUrl}`;

    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      page: forCalendar ? 1 : page,
      limit: forCalendar ? 1000 : limit, // Get all leaves for calendar view
      my_leaves: true,
      sort_by: 'leave_from_date',
      // Sort direction: ascending for upcoming, descending for taken
      sort_direction: currentTab === 'upcoming' ? 'ascending' : 'descending',
      ...filterList,
    };

    // For calendar view, explicitly request the full current month range
    // so that retroactive and future leaves for that month are included.
    if (forCalendar && !filterList.start_date && !filterList.end_date) {
      const monthStart = new Date(calendarDate);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      params.start_date = customFunctions.getDate(monthStart);
      params.end_date = customFunctions.getDate(monthEnd);
    }


    // For table view, keep existing upcoming/taken behaviour via tab & status filters.
    // For calendar view, avoid restricting by tab/status so past and future leaves
    // are all available to the calendar within its visible date range.
    if (!forCalendar) {
      params.tab = currentTab; // Add tab parameter only for table data

      // For upcoming tab, only show Pending leaves (status = 1)
      if (currentTab === 'upcoming') {
        params.status = 1; // Pending status
      }
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      if (!forCalendar) {
        setTotalCount(data.paginator.total_count);
        setItemsPerPage(data.paginator.limit);
        setCurrentPage(Number(data.paginator.current_page));
        const newData = [...data.data];
        newData.map((item, i) => {
          const newItem = item;
          newItem.index = (page - 1) * itemsPerPage + (i + 1);
          return newItem;
        });
      }
      setRowData((data && data.data) || []);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const submitRevertForm = async (id) => {
    const reasonLabel = id === 2 ? 'approve' : 'decline';

    const postData = {
      id: id,
      is_revert_after_approved: true,
      revert_status: 1
      // declined_reason: formValues ? formValues.notes : '',
    };

    swal({
      title: 'Are you sure?',
      text: `You want to apply for revert the leaves ?`,
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

        console.log("data.message[0]", data.message[0]);

        if (!data) {
          swal(message, '', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
            buttons: false,
            timer: 2000,
          }).then(() => {
            swal.close();
          });
        } else {
          swal(data && data.message[0], '', 'success', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          }).then(() => {
            // onCancelButton();
            // onStatusUpdate();
            getRowData(1, activeTab, viewMode === 'calendar');
            swal.close();
          });
        }
      }
    });

  }

  const changeStatus = async (id) => {
    setShowLoader(true);
    const endPoint = `${Api.leavesUrl}${id}/`;

    const postData = {
      status: 4,
    };

    const callback = AuthApi.putDataToServer;

    const { data, message } = await callback(endPoint, postData);

    if (data) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        getRowData(1, activeTab, viewMode === 'calendar');
        swal.close();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  // Fetch holidays
  const getHolidays = async () => {
    try {
      const endPoint = `${Api.holidayUrll}?type=all`;
      const { data } = await AuthApi.getDataFromServer(endPoint);
      if (data && data.data && data.success) {
        setHolidays(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    setTitle('Leaves');
    getRowData(1);
    getHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRowData(1, null, viewMode === 'calendar');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterData, viewMode]);

  const submitForm = (formValues) => {
    const filterValues = {
      start_date: formValues.start_date
        ? customFunctions.getDate(formValues.start_date)
        : '',
      end_date: formValues.end_date
        ? customFunctions.getDate(formValues.end_date)
        : '',
    };
    setFilterData(filterValues);
    
    // Auto-navigate calendar to selected date range
    if (formValues.start_date) {
      setCalendarDate(new Date(formValues.start_date));
    }
  };

  const onClear = () => {
    if (filterData && !Object.keys(filterData).length) return;
    setFilterData({});
    setCalendarDate(new Date());
  };

  const handleCalendarEventClick = (event) => {
    const leave = event.resource;
    const { id, status_name, status } = leave;
    
    // Prevent redirect for upcoming leaves in My Leaves section
    if (activeTab === 'upcoming') {
      // Do nothing - don't redirect when clicking upcoming leaves
      return;
    }
    
    // For taken leaves, keep the existing redirect behavior
    if (status_name !== 'Pending' || status_name === 'Approved') {
      history.push(`/edit-leave/${id}`, { isViewLeave: true });
    } else {
      history.push(`/edit-leave/${id}`, {
        isViewLeave: false,
        isView: 'false',
      });
    }
  };

  const handleCalendarNavigate = (date) => {
    setCalendarDate(date);
  };

  const handleCalendarViewChange = (view) => {
    setCalendarView(view);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">My Leaves</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              <div className="d-flex align-items-center justify-content-end">
                {Number(userRole) !== 1 && (
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-leave', { isViewLeave: false });
                    }}
                    className="btn-link"
                  >
                    Apply Leave
                  </a>
                )}
              </div>
            </div>
            <hr />
            <div className="filter-box-main">
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={MyLeavesFilterSchema}
                options={{}}
                formHeading=""
                onFormSubmit={(formValues) => {
                  if (!formValues.start_date && !formValues.end_date) return;
                  submitForm(formValues);
                }}
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={false}
                btnContainerClass="d-none"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  onClear();
                }}
              />
              <Row className="mt-3">
                <Col sm={12}>
                  <div className="filter-btn pull-right filter-btn-report">
                    <Button
                      variant="primary"
                      type="button"
                      className="ms-4"
                      onClick={() => {
                        const form = document.querySelector('.stark-form-builder form');
                        if (form) {
                          const submitBtn = form.querySelector('button[type="submit"]');
                          if (submitBtn) {
                            submitBtn.click();
                          }
                        }
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      className="ms-4"
                      onClick={() => onClear()}
                    >
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Leaves</h5>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="table-view-toggle"
                  label="Show Tabular View"
                  checked={viewMode === 'table'}
                  onChange={(e) => {
                    setViewMode(e.target.checked ? 'table' : 'calendar');
                    if (e.target.checked) {
                      // When switching to table, fetch paginated data
                      getRowData(1, null, false);
                    } else {
                      // When switching to calendar, fetch all data
                      getRowData(1, null, true);
                    }
                  }}
                  className="ms-3"
                />
              </div>
            </div>
            <hr />
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                setCurrentPage(1); // Reset to first page when switching tabs
              }}
              className="mb-3"
            >
              <Tab eventKey="upcoming" title="Upcoming">
                {viewMode === 'calendar' ? (
                  <LeaveCalendar
                    leaves={rowData}
                    holidays={holidays}
                    activeTab={activeTab}
                    onSelectEvent={handleCalendarEventClick}
                    defaultDate={calendarDate}
                    view={calendarView}
                    onViewChange={handleCalendarViewChange}
                    onNavigate={handleCalendarNavigate}
                    isTeamView={false}
                  />
                ) : (
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
                        getRowData(pageNo, 'upcoming');
                      },
                    }}
                    emptyRender={() => {
                      return 'No upcoming leaves found.';
                    }}
                  />
                )}
              </Tab>
              <Tab eventKey="taken" title="Taken">
                {viewMode === 'calendar' ? (
                  <LeaveCalendar
                    leaves={rowData}
                    holidays={holidays}
                    activeTab={activeTab}
                    onSelectEvent={handleCalendarEventClick}
                    defaultDate={calendarDate}
                    view={calendarView}
                    onViewChange={handleCalendarViewChange}
                    onNavigate={handleCalendarNavigate}
                    isTeamView={false}
                  />
                ) : (
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
                        getRowData(pageNo, 'taken');
                      },
                    }}
                    emptyRender={() => {
                      return 'No taken leaves found.';
                    }}
                  />
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(Leaves);
