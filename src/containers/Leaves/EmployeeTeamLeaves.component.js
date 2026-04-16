/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Image, Button, Row, Col, Tabs, Tab, Form, Modal } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import SearchFormSections from './searchFormschema.json';
import LeaveCalendar from '../../components/LeaveCalendar/LeaveCalendar.component';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import AddNote from './AddNote.component';
import Loader from '../../components/Loader/index';
import EmployeeLeavesDetails from './EmployeeLeavesDetails.component';
import MilestoneInfoModal from './MilestoneInfoModal.component';

function EmployeeTeamLeaves(props) {
  const { location } = props;
  const [isManager, setIsManager] = useState(null);

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setIsManager(JSON.parse(isProjectManager));
  }, [customFunctions?.getLocalStorage('isProjectManager')]);

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
                history.push(`/edit-leave/${id}`, {
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
      roleAccess: [4],
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
    {
      id: 'leave_count',
      label: 'Days',
      roleAccess: [4],
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
    },
    // {
    //   id: 'leave_payment_type',
    //   label: 'Leave Payment Type',
    //   roleAccess: [4],
    //   render: ({ leave_payment_type }) => {
    //     return (<>
    //       {leave_payment_type ? (leave_payment_type === 1 ? "Paid" : "Unpaid") : "-"}
    //     </>)
    //   },
    // },
    // {
    //   id: 'revert_status_name',
    //   label: 'Revert Status',
    //   roleAccess: [4],
    // },
    {
      id: 'status_name',
      label: 'Status',
      render: ({ id, status_name }) => {
        return (
          <>
            {/* customFunctions.getDate(new Date()) <= leave_from_date ?  */}
            {status_name === 'Pending' ? (
              <>
                <Image
                  title="Accept"
                  onClick={() => {
                    // Check for milestone warnings before showing approval modal
                    checkMilestoneWarningsBeforeApproval(id, 2, false);
                  }}
                  alt="Accept"
                  src="/images/success.svg"
                />
                <Image
                  title="Declined"
                  onClick={() => {
                    // Check for milestone warnings before showing decline modal
                    checkMilestoneWarningsBeforeApproval(id, 3, false);
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
    {
      id: 'revert_status_name',
      label: 'Revert Status',
      render: ({ id, revert_status_name }) => {
        return (
          <>
            {/* customFunctions.getDate(new Date()) <= leave_from_date ?  */}
            {revert_status_name === 'Pending' ? (
              <>
                <Image
                  title="Accept"
                  onClick={() => {
                    // Check for milestone warnings before showing approval modal
                    checkMilestoneWarningsBeforeApproval(id, 2, true);
                  }}
                  alt="Accept"
                  src="/images/success.svg"
                />
                <Image
                  title="Declined"
                  onClick={() => {
                    // Check for milestone warnings before showing decline modal
                    checkMilestoneWarningsBeforeApproval(id, 3, true);
                  }}
                  alt="Declined"
                  src="/images/fail.svg"
                  className="ms-2"
                />
              </>
            ) : (
              <span> {revert_status_name} </span>
            )}
          </>
        );
      },
    },
  ];

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
  const [revertStatusId, setRevertStatusId] = useState('');
  const [revertDeclinedReason, setRevertDeclinedReason] = useState(null)
  const [isRevert, setIsRevert] = useState(false);
  const [leaveId, setLeaveId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory();
  const [filterData, setFilterData] = useState({});
  const [filterFormKey, setFilterFormKey] = useState(0);
  const [year, setYear] = useState(null);
  const [reportTable, setReportTable] = useState(false);
  const [options, updateOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [milestoneWarnings, setMilestoneWarnings] = useState([]);
  const [showMilestoneInfo, setShowMilestoneInfo] = useState(false);
  const [pendingApprovalAction, setPendingApprovalAction] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'taken'
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [holidays, setHolidays] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  let filterOptions = {};

  console.log('revertStatusId', revertStatusId);

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
      sort_by: 'leave_from_date',
      // Sort direction: ascending for upcoming, descending for taken
      sort_direction: currentTab === 'upcoming' ? 'ascending' : 'descending',
      ...filterList,
    };

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
    if (!forCalendar) {
      params.tab = currentTab;
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
    getHolidays();
  }, []);

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    if (!reportTable) {
      getRowData(1, null, viewMode === 'calendar');
    }
    setTitle('Leaves');
  }, [filterData, activeTab, viewMode]);

  useEffect(() => {
    if (location && location.reportTable) {
      setReportTable(location && location.reportTable);
    }
  }, [location]);

  const checkMilestoneWarningsBeforeApproval = async (leaveIdToCheck, statusIdToSet, isRevertAction = false) => {
    console.log('checkMilestoneWarningsBeforeApproval called with:', { leaveIdToCheck, statusIdToSet, isRevertAction });
    setShowLoader(true);
    
    // Set the leave ID and status ID first
    setLeaveId(leaveIdToCheck);
    setStatusId(statusIdToSet);
    if (isRevertAction) {
      setRevertStatusId(2);
      setIsRevert(true);
    }
    
    try {
      // Fetch leave details to check for milestone warnings
      // Using same pattern as AddLeave.component.js
      const { data } = await AuthApi.getDataFromServer(
        `${Api.leavesUrl}${leaveIdToCheck}/`
      );

      setShowLoader(false);

      console.log('Leave details response:', data);

      if (data && data.data) {
        // Check for milestone warnings - same structure as AddLeave
        const warnings = data.data.milestone_warnings;
        // Get applicant name from leave data
        const applicant = data.data.user_name || '';

        console.log('Milestone warnings found:', warnings);
        console.log('Warnings array check:', Array.isArray(warnings), warnings?.length);

        if (warnings && Array.isArray(warnings) && warnings.length > 0) {
          // Milestone warnings found - show info modal first
          console.log('Showing milestone info modal with', warnings.length, 'warnings');
          setMilestoneWarnings(warnings);
          setApplicantName(applicant);
          setPendingApprovalAction({ 
            leaveId: leaveIdToCheck, 
            statusId: statusIdToSet,
            isRevert: isRevertAction
          });
          setShowMilestoneInfo(true);
        } else {
          // No warnings - proceed directly to approval modal
          console.log('No milestone warnings, showing approval modal directly');
          setModalShow(true);
        }
      } else {
        console.log('Invalid response structure, showing approval modal');
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
    setFilters(filterValues);
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
    setFilterFormKey((k) => k + 1);
  };

  const handleCalendarEventClick = (event) => {
    const leave = event.resource;
    const { id, status_name } = leave;
    
    // For Employee Leaves, if status is Pending, show accept/decline options
    if (status_name === 'Pending') {
      // Show action choice modal
      setSelectedLeaveId(id);
      setShowActionModal(true);
    } else {
      // For non-pending leaves, navigate to view page
      history.push(`/edit-leave/${id}`, {
        isView: 'true',
        isViewLeave: true,
      });
    }
  };

  const handleApproveClick = () => {
    setShowActionModal(false);
    // Check for milestone warnings before showing approval modal
    checkMilestoneWarningsBeforeApproval(selectedLeaveId, 2, false);
    setSelectedLeaveId(null);
  };

  const handleDeclineClick = () => {
    setShowActionModal(false);
    setLeaveId(selectedLeaveId);
    setStatusId(3);
    setModalShow(true);
    setSelectedLeaveId(null);
  };

  const handleCalendarNavigate = (date) => {
    setCalendarDate(date);
  };

  const handleCalendarViewChange = (view) => {
    setCalendarView(view);
  };

  const getEmployeeName = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_onboard=true`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.length > 0 &&
      data.data.map((op) => {
        if ([1].includes(op.role_id)) return;
        dpOptions.push({ label: op.full_name, value: op.id });
      });
    const allOptions = {
      ...options,
      full_name: dpOptions,
    };
    console.log("allOptions", allOptions);

    // filterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployeeName();
  }, []);

  // Export function for leaves (same as TeamLeaves)
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

      // Parse JSON response
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        console.log('Export Response:', jsonData);
        
        // Check if API returned an error (success: false)
        if (jsonData.success === false || !jsonData.success) {
          const errorMessage = jsonData.message || jsonData.error || jsonData.detail || 'No data found for the given filters';
          setShowLoader(false);
          swal('Export failed', errorMessage, 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        }
        
        // Check if response contains file_path
        let fileUrl = null;
        let fileName = 'employees_leaves_report.xlsx';
        
        if (jsonData.success && jsonData.data && jsonData.data.file_path) {
          fileUrl = jsonData.data.file_path;
        } else if (jsonData.file_path) {
          fileUrl = jsonData.file_path;
        }
        
        if (fileUrl) {
          // If file_path is relative, construct full URL
          if (!fileUrl.startsWith('http')) {
            const baseUrlStr = Api.baseUrl;
            const baseDomain = baseUrlStr.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');
            const mediaPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
            fileUrl = `${baseDomain}${mediaPath}`;
          }
          
          // Extract filename from URL
          try {
            const urlObj = new URL(fileUrl);
            const pathParts = urlObj.pathname.split('/');
            if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
              fileName = pathParts[pathParts.length - 1];
            }
          } catch (e) {
            const pathParts = fileUrl.split('/');
            if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
              fileName = pathParts[pathParts.length - 1];
            }
          }
          
          // Add timestamp to filename to prevent overwriting
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5).replace('T', '_');
          const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
          const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
          fileName = `${fileNameWithoutExt}_${timestamp}${fileExtension}`;
          
          console.log('Downloading file from:', fileUrl);
          
          // Download the file from the file_path URL
          const fileResponse = await fetch(fileUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (!fileResponse.ok) {
            throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
          }
          
          // Download the file as blob
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
        // No file_path in response
        const errorMessage = (jsonData.data && jsonData.data.message) || jsonData.message || 'Server did not return a file path';
        setShowLoader(false);
        swal('Export failed', errorMessage, 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
        return;
      }
      // Unexpected response type
      setShowLoader(false);
      swal('Export failed', 'Unexpected response format from server', 'error', {
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

  // Keep the existing getExportCSV for reportTable functionality
  const getExportCSV = async () => {
    setShowLoader(true);
    const endPoint = `${Api.leaveExportCSVUrl}`;
    const params = {
      year: year && customFunctions.getYear(year)
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      try {
        // Construct file URL
        const baseUrlStr = Api.baseUrl;
        const baseDomain = baseUrlStr.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');
        const csvPath = data.data.csv_path;
        const mediaPath = csvPath.startsWith('/') ? csvPath : `/${csvPath}`;
        const fileUrl = `${baseDomain}${mediaPath}`;
        
        const token = customFunctions.getLocalStorage('access_token');
        
        // Download the file
        const fileResponse = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!fileResponse.ok) {
          throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
        }

        // Extract filename from path and add timestamp
        let fileName = 'employees_leaves_report.xlsx';
        const pathParts = csvPath.split('/');
        if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
          fileName = pathParts[pathParts.length - 1];
        }
        
        // Add timestamp to filename to prevent overwriting
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5).replace('T', '_');
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        fileName = `${fileNameWithoutExt}_${timestamp}${fileExtension}`;

        // Download the file as blob
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
      } catch (error) {
      setShowLoader(false);
        swal('Export failed', error.message || 'Failed to download file', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee Leaves</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              <div className="d-flex align-items-center justify-content-end">
                <UserRestrictions permittedUsers={isManager ? [1, 4] : [4]} roleId={userRole}>
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-leave', { isView: 'true' });
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
                key={filterFormKey}
                containerClass=""
                formHeaderClass=""
                formSections={SearchFormSections}
                formHeading=""
                options={options}
                onFormSubmit={(formValues) => {
                  if (!formValues.full_name && !formValues.start_date) return;
                  submitForm(formValues);
                }}
                callbacks={{}}
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={false}
                btnContainerClass="d-none"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  setReportTable(false);
                  onClear();
                  setYear(null);
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
                      onClick={() => {
                        onClear();
                        setReportTable(false);
                        setYear(null);
                      }}
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
              <h5 className="card-title">Employee Leaves </h5>
              <div className="d-flex align-items-center">
                {!reportTable && (
                  <Form.Check
                    type="checkbox"
                    id="employee-table-view-toggle"
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
                )}
                {reportTable && (
                  <div className="float-end">
                    <Row>
                      <Col className="col-sm-4">
                        <Datepicker
                          className="form-control"
                          selected={year}
                          containerClass="mb-0"
                          placeholder="Select Year"
                          showYearPicker
                          dateFormat="yyyy"
                          minDate={new Date('2020-01-01')}
                          maxDate={new Date()}
                          onChange={(e) => {
                            setYear(e);
                          }}
                        />
                      </Col>
                      <Col className="col-sm-8">
                        <Button
                          variant="primary"
                          title="Show Report"
                          onClick={() => {
                            if (!year) {
                              swal({
                                title: 'Please select Year',
                                icon: 'warning',
                                dangerMode: true,
                                confirmButtons: true,
                                closeOnClickOutside: false,
                                allowOutsideClick: false,
                              });
                            } else {
                              setFilters();
                              setReportTable(true);
                            }
                          }}
                          type="button"
                          className="float-right"
                        >
                          Show Report
                        </Button>

                        {reportTable && (
                          <Button
                            variant="primary"
                            title="Download Report"
                            onClick={() => {
                              getExportCSV();
                            }}
                            type="button"
                            className="float-right ms-3"
                          >
                            Download Report
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>
            <hr />
            {reportTable ? (
              <EmployeeLeavesDetails filters={filters} year={year} />
            ) : (
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
                  )}
                </Tab>
              </Tabs>
            )}
          </Card.Body>

          {showMilestoneInfo && (
            <MilestoneInfoModal
              show={showMilestoneInfo}
              milestoneWarnings={milestoneWarnings}
              applicantName={applicantName}
              onClose={() => {
                setShowMilestoneInfo(false);
                setMilestoneWarnings([]);
                setApplicantName('');
                // After closing milestone modal, show the approval/decline modal
                if (pendingApprovalAction) {
                  setLeaveId(pendingApprovalAction.leaveId);
                  setStatusId(pendingApprovalAction.statusId);
                  if (pendingApprovalAction.isRevert) {
                    setRevertStatusId(2);
                    setIsRevert(true);
                  }
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
              isRevert={isRevert}
              handleModalCLose={(e) => setModalShow(e)}
              onStatusUpdate={() => {
                getRowData(1, null, viewMode === 'calendar');
              }}
            />
          )}

          {showActionModal && (
            <Modal
              show={showActionModal}
              onHide={() => {
                setShowActionModal(false);
                setSelectedLeaveId(null);
              }}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Leave Action</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Choose an action for this leave:</p>
                <div className="d-flex justify-content-around mt-3">
                  <Button
                    variant="success"
                    onClick={handleApproveClick}
                    className="px-4"
                  >
                    <Image src="/images/success.svg" className="me-2" style={{ width: '20px', height: '20px' }} />
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeclineClick}
                    className="px-4"
                  >
                    <Image src="/images/fail.svg" className="me-2" style={{ width: '20px', height: '20px' }} />
                    Decline
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </Card>
      </section>
    </>
  );
}

export default withRouter(EmployeeTeamLeaves);
