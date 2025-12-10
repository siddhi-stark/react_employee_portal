import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card, Button, Row, Col, Tabs, Tab } from 'react-bootstrap';
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
import MilestoneInfoModal from './MilestoneInfoModal.component';

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
                history.push(`/view-leave/${id}`, {
                  isView: 'true',
                  isViewLeave: true,
                });
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
      id: 'leave_count',
      label: 'Days',
      roleAccess: [4],
    },
    {
      id: 'status_name',
      label: 'Status',
      render: ({ id, status_name }) => {
        return (
          <>
            {/* customFunctions.getDate(new Date()) <= leave_from_date */}
            {status_name === 'Pending' 
            ? (
              <>
                <Image
                  title="Accept"
                  onClick={() => {
                    // Check for milestone warnings before showing approval modal
                    checkMilestoneWarningsBeforeApproval(id, 2);
                  }}
                  alt="Accept"
                  src="/images/success.svg"
                />
                <Image
                  title="Declined"
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
            ) : (
              <span> {status_name} </span>
            )}
          </>
        );
      },
    },
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
  const [isShowLoader, setShowLoader] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [options, updateOptions] = useState({});
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'taken'
  const [milestoneWarnings, setMilestoneWarnings] = useState([]);
  const [showMilestoneInfo, setShowMilestoneInfo] = useState(false);
  const [pendingApprovalAction, setPendingApprovalAction] = useState(null);
  let filterOptions = {};

  const history = useHistory();


  const getRowData = async (pageNo = 1, tab = null) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const currentTab = tab || activeTab;
    const endPoint = `${Api.leavesUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      page,
      limit,
      my_team: true,
      tab: currentTab, // Add tab parameter
      sort_by: 'leave_from_date',
      // Sort direction: ascending for upcoming, descending for taken
      sort_direction: currentTab === 'upcoming' ? 'ascending' : 'descending',
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.data && data.success) {
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
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    getRowData(1);
    setTitle('Leaves');
  }, [filterData, activeTab]);

  const submitForm = async (formValues) => {
    const filterValues = {
      start_date: formValues.start_date
        ? customFunctions.getDate(formValues.start_date)
        : '',
      end_date: formValues.end_date
        ? customFunctions.getDate(formValues.end_date)
        : '',
      employee_id: formValues.full_name ? formValues.full_name.value : '',
    };
    setFilterData(filterValues);
  };

  const onClear = () => {
    if(filterData && !Object.keys(filterData).length) return;
    setFilterData();
  };

  const checkMilestoneWarningsBeforeApproval = async (leaveIdToCheck, statusIdToSet) => {
    setShowLoader(true);
    
    // Set the leave ID and status ID first
    setLeaveId(leaveIdToCheck);
    setStatusId(statusIdToSet);
    
    try {
      // Fetch leave details to check for milestone warnings
      const { data } = await AuthApi.getDataFromServer(
        `${Api.leavesUrl}${leaveIdToCheck}/`
      );

      setShowLoader(false);

      if (data && data.data) {
        // Check for milestone warnings
        const warnings = data.data.milestone_warnings;

        if (warnings && Array.isArray(warnings) && warnings.length > 0) {
          // Milestone warnings found - show info modal first
          setMilestoneWarnings(warnings);
          setPendingApprovalAction({ 
            leaveId: leaveIdToCheck, 
            statusId: statusIdToSet
          });
          setShowMilestoneInfo(true);
        } else {
          // No warnings - proceed directly to approval modal
          setModalShow(true);
        }
      } else {
        // If API fails, proceed to approval modal anyway
        setModalShow(true);
      }
    } catch (error) {
      setShowLoader(false);
      console.error('Error checking milestone warnings:', error);
      // If check fails, proceed to approval modal anyway
      setModalShow(true);
    }
  };

  const handleExport = async () => {
    setShowLoader(true);
    const endPoint = `${Api.leaveExportCSVUrl}`;
    
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {};

    // Calculate financial year from date range
    // Financial year starts from April 1st (e.g., 2024 means April 2024 - March 2025)
    let financialYear = null;
    if (filterList.start_date) {
      const startDate = new Date(filterList.start_date);
      const month = startDate.getMonth() + 1; // 1-12
      const year = startDate.getFullYear();
      // If month is April (4) or later, financial year is current year
      // If month is Jan-Mar, financial year is previous year
      if (month >= 4) {
        financialYear = year;
      } else {
        financialYear = year - 1;
      }
    } else {
      // If no date provided, use current financial year
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      if (month >= 4) {
        financialYear = year;
      } else {
        financialYear = year - 1;
      }
    }

    if (financialYear) {
      params.year = financialYear;
    }

    // Add employee parameter (API expects 'employee' not 'employee_id')
    if (filterList.employee_id) {
      params.employee = filterList.employee_id;
    }

    // Add sort parameters (optional, using defaults if not provided)
    params.sort_by = 'id';
    params.sort_direction = 'ascending';

    // Clean object to remove empty values
    const cleanParams = customFunctions.cleanObject(params);
    const url = customFunctions.generateUrl(endPoint, cleanParams);

    try {
      // Get the access token for authentication
      const token = customFunctions.getLocalStorage('access_token');

      // Fetch the export API using GET
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check content-type header first
      const contentType = response.headers.get('content-type') || '';

      // If response is not ok, handle error
      if (!response.ok) {
        const clonedResponse = response.clone();

        // Try to parse as JSON first (API might return JSON error)
        if (contentType.includes('application/json')) {
          try {
            const errorData = await clonedResponse.json();
            const errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            setShowLoader(false);
            swal('Export failed', errorMessage, 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
            return;
          } catch (e) {
            const errorText = await response.text();
            setShowLoader(false);
            swal('Export failed', errorText || 'Failed to download file', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
            return;
          }
        } else {
          const errorText = await response.text();
          setShowLoader(false);
          swal('Export failed', errorText || 'Failed to download file', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        }
      }

      // API returns JSON with file path
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();

        // Check if it's a success response with file path
        let csvPath = null;
        let fileName = 'employees_leaves_report.xlsx';

        if (jsonData.success && jsonData.data && jsonData.data.csv_path) {
          csvPath = jsonData.data.csv_path;
        }

        if (csvPath) {
          // Extract filename from path
          const pathParts = csvPath.split('/');
          if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
            fileName = pathParts[pathParts.length - 1];
          }

          // Construct full URL from relative path
          // csvPath is like "media/static/leave_csv/employees_leaves_report_abcd.xlsx"
          // Media files are served from domain root, not API path
          // baseUrl is like "http://localhost:8000/api/v1/" or "https://portalsapi.starkdigital.in/api/v1/"
          // We need "http://localhost:8000/media/static/leave_csv/..." or "https://portalsapi.starkdigital.in/media/static/leave_csv/..."
          let fileUrl = csvPath;
          if (!csvPath.startsWith('http')) {
            // Extract base domain from baseUrl (remove /api/v1/ or /api/v2/ etc.)
            const baseUrlStr = Api.baseUrl;
            
            // More robust regex to handle various API path patterns
            // Matches: /api/v1/, /api/v2/, /api/v1, /api/v2, etc.
            const baseDomain = baseUrlStr.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');
            
            // Ensure csvPath starts with / for proper URL construction
            const mediaPath = csvPath.startsWith('/') ? csvPath : `/${csvPath}`;
            fileUrl = `${baseDomain}${mediaPath}`;
          }
          
          console.log('Constructed file URL:', fileUrl);
          console.log('CSV path from API:', csvPath);
          console.log('Base URL:', Api.baseUrl);

          // Download the file from the URL
          const fileResponse = await fetch(fileUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!fileResponse.ok) {
            throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
          }

          // Download the file as blob (Excel file)
          const blob = await fileResponse.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', fileName);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);

          setShowLoader(false);
          swal('Export successful', 'File downloaded successfully', 'success');
          return;
        }

        // JSON response but not a file path - show error
        const errorMessage = jsonData.message || jsonData.error || jsonData.detail || 'Server returned an unexpected response';
        setShowLoader(false);
        swal('Export failed', errorMessage, 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
        return;
      }

      // If response is not JSON, show error
      const errorText = await response.text();
      setShowLoader(false);
      swal('Export failed', errorText || 'Unexpected response format', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    } catch (error) {
      setShowLoader(false);
      swal('Export failed', error.message || 'Something went wrong', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.teamUrl}`);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      // Format team data for dropdown options
      const dpOptions = [];
      if (data.data && data.data.length > 0) {
        data.data.map((op) => {
          if (op.employee_name && op.employee_id) {
            dpOptions.push({ label: op.employee_name, value: op.employee_id });
          }
          return op;
        });
      }
      
      const allOptions = {
        ...filterOptions,
        ...options,
        full_name: dpOptions,
      };
      filterOptions = { ...allOptions };
      updateOptions(allOptions);
      
      // Return options for form builder callback
      return dpOptions;
    }
    return [];
  };

  useEffect(() => {
    getEmployee();
  }, []);

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
            <hr />
            <div className="filter-box-main">
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={SearchFormSections}
                options={options}
                formHeading=""
                onFormSubmit={(formValues) => {
                  if(!formValues.full_name && !formValues.start_date) return;
                  submitForm(formValues);
                }}
                callbacks={{
                  getEmployeeName: getEmployee,
                }}
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={false}
                btnContainerClass="d-none"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  if(filterData && !Object.keys(filterData).length) return;
                  setFilterData();
                }}
              />
              <Row className="mt-3">
                <Col sm={3}>
                  <div className="mt-1">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => handleExport()}
                    >
                      Export
                    </Button>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="filter-btn pull-right filter-btn-report">
                    <Button
                      variant="primary"
                      type="button"
                      className="ms-4"
                      onClick={() => {
                        // Trigger form submit by finding and clicking the hidden submit button
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
              <h5 className="card-title mb-0 mt-2 ">Team Leaves</h5>
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
                      getRowData(pageNo, 'upcoming');
                    },
                  }}
                  emptyRender={() => {
                    return 'No upcoming leaves found.';
                  }}
                />
              </Tab>
              <Tab eventKey="taken" title="Taken">
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
                      getRowData(pageNo, 'taken');
                    },
                  }}
                  emptyRender={() => {
                    return 'No taken leaves found.';
                  }}
                />
              </Tab>
            </Tabs>
          </Card.Body>

          {showMilestoneInfo && (
            <MilestoneInfoModal
              show={showMilestoneInfo}
              milestoneWarnings={milestoneWarnings}
              onClose={() => {
                setShowMilestoneInfo(false);
                setMilestoneWarnings([]);
                // After closing milestone modal, show the approval/decline modal
                if (pendingApprovalAction) {
                  setLeaveId(pendingApprovalAction.leaveId);
                  setStatusId(pendingApprovalAction.statusId);
                  setModalShow(true);
                  setPendingApprovalAction(null);
                }
              }}
            />
          )}

          {modalShow && (
            <AddNote
              show={modalShow}
              statusId={statusId}
              leaveId={leaveId}
              handleModalCLose={(e) => setModalShow(e)}
              onStatusUpdate={() => {
                getRowData(1, activeTab);
              }}
            />
          )}
        </Card>
      </section>
    </>
  );
}

export default withRouter(TeamLeaves);
