/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Image, Button, Row, Col } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import SearchFormSections from './searchFormschema.json';
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
  const [year, setYear] = useState(null);
  const [reportTable, setReportTable] = useState(false);
  const [options, updateOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [milestoneWarnings, setMilestoneWarnings] = useState([]);
  const [showMilestoneInfo, setShowMilestoneInfo] = useState(false);
  const [pendingApprovalAction, setPendingApprovalAction] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  let filterOptions = {};

  console.log('revertStatusId', revertStatusId);

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
      sort_by: 'leave_from_date',
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

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    if (!reportTable) {
      getRowData(1);
    }
    setTitle('Leaves');
  }, [filterData]);

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
                btnContainerClass="form-submit-buttons pull-right"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  setReportTable(false);
                  setFilterData();
                  setYear(null);
                }}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title">Employee Leaves </h5>
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
            </div>
            <hr />
            {
              reportTable ? (<EmployeeLeavesDetails filters={filters} year={year} />) : (
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
                getRowData(1);
              }}
            />
          )}
        </Card>
      </section>
    </>
  );
}

export default withRouter(EmployeeTeamLeaves);
