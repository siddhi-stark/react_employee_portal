import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import moment from 'moment';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './employeeListformschema.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';

function EmployeeTimesheet() {
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [dataShow, setDataShow] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory();

  // Variable declarations
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [canExport, setCanExport] = useState(false); // Track if user has designation 45
  const limit = 10;
  const items = [{ to: '/', label: 'Home' }, { label: 'Employee Timesheet' }];
  const departmentId = customFunctions.getLocalStorage('department');

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'toDate') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    if (sectionData.name === 'fromDate') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  const handleActionCallback = (row) => {

    const userName = customFunctions.getLocalStorage('name');
    return (
      <>
        {Number(departmentId) !== Number(7) &&
          Number(departmentId) !== Number(8) && (
            <a
              href="/"
              className="pl-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/edit-employee/${row.user_id}`);
                customFunctions.setLocalStorage('employeeName', row.emp_name);
                customFunctions.setLocalStorage('userId', row.user_id);
                customFunctions.setLocalStorage('date', row.date);
              }}
            >
              {!(String(userName) === row.emp_name) && (
                <Image src="/images/edit-button.svg" />
              )}
            </a>
          )}
          &nbsp;
        {Number(currentUser) === 1 && (
          <a
            href="/"
            title="View employee activity"
            className="pl-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('/employee-activity', {
                userId: row.user_id,
                date: moment(moment(`${row.date}`, 'DD-MM-YYYY')).format('YYYY-MM-DD'),
              });
            }}
          >
            <Image src="/images/overload.png" />
          </a>
        )}
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'user_id',
      label: 'id',
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'emp_id',
      label: dataShow ? '' : 'ID',

      render: ({ emp_id }) => {
        return (
          <>
            <span>{dataShow ? '' : `SDMS ${emp_id}`}</span>
          </>
        );
      },
    },
    {
      id: 'day',
      label: dataShow ? 'Day' : '',
      render: ({ day }) => {
        return (
          <>
            <span>{dataShow ? day : ''}</span>
          </>
        );
      },
    },
    {
      id: 'date',
      label: dataShow ? 'Date' : '',
      render: ({ row }) => {
        return (
          <>
            <span>
              {dataShow ? customFunctions.getNewFormattedDate(row.date) : ''}
            </span>
          </>
        );
      },
    },
    {
      id: 'emp_name',
      label:
        filterData.full_name || (filterData.formDate && filterData.toDate)
          ? ''
          : 'Name',
      render: ({ row }) => {
        return (
          <>
            <span>
              {filterData.full_name ||
              (filterData.formDate && filterData.toDate)
                ? ''
                : row.emp_name}
            </span>
          </>
        );
      },
    },
    {
      id: 'designatin_name',
      label: dataShow ? '' : 'Designation ',
      render: ({ row }) => {
        return (
          <>
            <span>{dataShow ? '' : row.Designation}</span>
          </>
        );
      },
    },
    {
      id: 'sign_in',
      label: 'In',
    },
    {
      id: 'sign_out',
      label: 'Out',
    },
    {
      id: 'estimation',
      label: 'Total Working',
      render: ({ estimation }) => {
        return (
          <>
            <span>{estimation} Hrs</span>
          </>
        );
      },
    },
    {
      id: 'date',
      label: dataShow ? '' : 'Date ',
      render: ({ row }) => {
        return (
          <>
            <span>
              {dataShow ? '' : customFunctions.getNewFormattedDate(row.date)}
            </span>
          </>
        );
      },
    },
    {
      id: 'action',
      label:
        Number(departmentId) !== 7 && Number(departmentId) !== 8
          ? 'Action'
          : '',
      render: handleActionCallback,
    },
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeTimesheet}`;
    const params = {
      sort_by: 'created_at',
      sort_direction: 'descending',
      limit,
      page,
      start_date: filterData.fromDate
        ? customFunctions.getDate(filterData.fromDate)
        : '',
      end_date: filterData.toDate
        ? customFunctions.getDate(filterData.toDate)
        : '',
      is_detail: filterData.is_detail ? filterData.is_detail[0] : '',
      employee_id: filterData.full_name ? filterData.full_name.value : '',
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
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  const getTimesheetDetails = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.timesheetDetailsUrl}`;
    const params = {
      limit,
      page,
      start_date: filterData.fromDate
        ? customFunctions.getDate(filterData.fromDate)
        : '',
      end_date: filterData.toDate
        ? customFunctions.getDate(filterData.toDate)
        : '',
      employee_id: filterData.full_name ? filterData.full_name.value : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setDetails((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  useEffect(() => {
    if (filterData.is_detail) {
      getTimesheetDetails();
      getRowData(1);
    } else {
      getRowData(1);
    }
  }, [filterData]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  // Check if user has designation 45 for export access
  const checkExportAccess = async () => {
    try {
      const { data } = await AuthApi.getDataFromServer(`${Api.profileUrl}`);
      if (data && data.data && data.data.designation) {
        const hasAccess = Number(data.data.designation) === 45;
        setCanExport(hasAccess);
        return hasAccess;
      }
      setCanExport(false);
      return false;
    } catch (error) {
      console.error('Error checking export access:', error);
      setCanExport(false);
      return false;
    }
  };

  useEffect(() => {
    getUserRole();
    checkExportAccess();
    setTitle('Employee Daily Report');
  }, []);

  const submitForm = async (formValues) => {
    if (!formValues) return;
    setDataShow(true);
    setFilterData(formValues);
  };

  const getEmployeeName = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&status=active&is_dropdown=1`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      full_name: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployeeName();
  }, []);

  const onResetForm = () => {
    setFilterData('');
    getRowData(1);
    setFilterData(false);
  };

  // Export timesheet function - same functionality as teamReport
  const handleExport = async () => {
    // Check if user has required designation (45) for export
    if (!canExport) {
      swal('Access Denied', 'You do not have permission to export timesheet. This feature is restricted to specific designation.', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
      return;
    }

    setShowLoader(true);
    const endPoint = `${Api.teamTimesheetExportUrl}`;
    
    const params = {};

    // Add start_date in YYYY-MM-DD format from filterData
    if (filterData.fromDate) {
      params.start_date = customFunctions.getDate(filterData.fromDate);
    }

    // Add end_date in YYYY-MM-DD format from filterData
    if (filterData.toDate) {
      params.end_date = customFunctions.getDate(filterData.toDate);
    }

    // Add employee_id if selected
    if (filterData.full_name && filterData.full_name.value) {
      params.employee_id = filterData.full_name.value;
    }

    // Clean object to remove empty values
    const cleanParams = customFunctions.cleanObject(params);
    const url = customFunctions.generateUrl(endPoint, cleanParams);

    console.log('Export URL:', url);
    console.log('Export params:', cleanParams);

    try {
      // Get the access token for authentication
      const token = customFunctions.getLocalStorage('access_token');
      
      // Fetch the CSV file using GET (API only accepts GET)
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
        // Clone response to check error without consuming original
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
            // If JSON parsing fails, read as text
            const errorText = await response.text();
            setShowLoader(false);
            swal('Export failed', errorText || 'Failed to download file', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
            return;
          }
        } else {
          // Read as text for non-JSON errors
          const errorText = await response.text();
          setShowLoader(false);
          swal('Export failed', errorText || 'Failed to download file', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        }
      }

      // Check if response is HTML error page (only if content-type is HTML)
      if (contentType.includes('text/html')) {
        const clonedResponse = response.clone();
        const text = await clonedResponse.text();
        if (text.includes('<html') || text.includes('<!DOCTYPE')) {
          setShowLoader(false);
          // Try to extract error message from HTML if possible
          const errorMatch = text.match(/<title>(.*?)<\/title>/i) || text.match(/<h1>(.*?)<\/h1>/i);
          const errorMsg = errorMatch ? errorMatch[1] : 'Server returned an error page. Please check the API endpoint.';
          swal('Export failed', errorMsg, 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        }
      }

      // If content-type is JSON but response is ok, it might be a JSON response with file path
      if (contentType.includes('application/json')) {
        try {
          const jsonData = await response.json();
          console.log('JSON Response:', jsonData);
          
          // Check if it's a success response with file URL
          // Backend now returns full URLs in download_url, file_url, or csv_path
          let fileUrl = null;
          let fileName = 'employee_timesheet.csv';
          
          if (jsonData.success && jsonData.data) {
            // Prefer download_url, then file_url, then csv_path (all should be full URLs now)
            fileUrl = jsonData.data.download_url || jsonData.data.file_url || jsonData.data.csv_path || jsonData.data.file_name;
            console.log('File URL from response:', fileUrl);
          } else if (jsonData.download_url || jsonData.file_url || jsonData.csv_path) {
            // Direct file URL in response
            fileUrl = jsonData.download_url || jsonData.file_url || jsonData.csv_path;
          }
          
          if (fileUrl) {
            // Extract filename from URL
            try {
              const urlObj = new URL(fileUrl);
              const pathParts = urlObj.pathname.split('/');
              if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
                fileName = pathParts[pathParts.length - 1];
              }
            } catch (e) {
              // If URL parsing fails, try simple split
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
            
            // Download the file from the full URL (backend now provides full URLs)
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
            const link = document.createElement('a');
            link.href = fileResponse?.data?.file_url || fileResponse?.data?.csv_path;
            link.target = '_blank'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            setShowLoader(false);
    
            swal(
              'Export successful',
              fileResponse?.message || 'File downloaded successfully',
              'success'
            );
            return;
          }
          
          // JSON response but not a file path - show error or try to extract message
          const errorMessage = jsonData.message || jsonData.error || jsonData.detail || 'Server returned an unexpected response';
          console.error('Unexpected JSON response:', jsonData);
          setShowLoader(false);
          swal('Export failed', errorMessage, 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        } catch (e) {
          // If JSON parsing fails, show error (can't read response again)
          console.error('Error parsing JSON:', e);
          setShowLoader(false);
          swal('Export failed', 'Failed to parse server response', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        }
      }

      // If we reach here and content-type is not JSON, it should be CSV/binary
      // Convert response to blob (for CSV or binary files)
      const blob = await response.blob();
      
      // Check if blob is actually CSV by reading first few bytes
      const blobText = await blob.slice(0, 100).text();
      console.log('First 100 chars of response:', blobText);
      
      // If it contains HTML, it's an error page
      if (blobText.includes('<html') || blobText.includes('<!DOCTYPE') || blobText.includes('{"')) {
        // Try to read the full error message
        const fullText = await blob.text();
        let errorMessage = 'Server returned an error page';
        
        // Try to extract error from JSON
        if (fullText.includes('{')) {
          try {
            const errorData = JSON.parse(fullText);
            errorMessage = errorData.detail || errorData.message || errorData.error || JSON.stringify(errorData);
          } catch (e) {
            // Not JSON, try to extract from HTML
            const titleMatch = fullText.match(/<title>(.*?)<\/title>/i);
            if (titleMatch) {
              errorMessage = titleMatch[1];
            }
          }
        }
        
        setShowLoader(false);
        swal('Export failed', errorMessage, 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
        return;
      }
      
      // Generate filename with current date and timestamp to prevent overwriting
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5).replace('T', '_');
      const fileName = `employee_timesheet_${timestamp}.csv`;
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      setShowLoader(false);
      swal('Export successful', 'File downloaded successfully', 'success');
    } catch (error) {
      setShowLoader(false);
      swal('Export failed', error.message || 'Something went wrong', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Filters</h5>
          </div>
          <hr />
          <div className="filter-box-main">
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              formHeading=""
              onFormSubmit={(formValues) => {
                if(!formValues.full_name && !formValues.fromDate) return;
                submitForm(formValues);
              }}
              options={options}
              callbacks={{}}
              currentUser={currentUser}
              submitBtnText="Apply"
              showResetBtn={true}
              showBtnClass={true}
              resetBtnText="Clear"
              btnContainerClass="form-submit-buttons pull-right"
              isStepForm={false}
              onFormReset={() => {
                if(filterData && !Object.keys(filterData).length) return;
                setDataShow(false);
                onResetForm();
              }}
            />
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">{`${
              filterData.full_name
                ? `Employee Daily Report for ${filterData.full_name.label}`
                : 'Employees Daily Report'
            }`}</h5>
            <div className="d-flex align-items-center justify-content-end">
              {/* Show export button only for designation 45 */}
              {canExport && (
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => handleExport()}
                  className="ms-2"
                >
                  Export Timesheet
                </Button>
              )}
              {/* {(Number(currentUser) === 1 || Number(currentUser) === 3) && (
                <a
                  href="#"
                  onClick={() => {
                    history.push('/workload');
                  }}
                  className="btn-link"
                >
                  Workload
                </a>
              )} */}
            </div>
          </div>
          <hr />
          {filterData.is_detail &&
            filterData.is_detail[0] &&
            filterData.full_name &&
            filterData.full_name.value && (
              <Row>
                <Col>
                  <p>
                    {' '}
                    No. of working days :{' '}
                    {details ? details.total_working_days : ''}
                  </p>
                </Col>
                <Col>
                  <p>No. of leaves : {details ? details.total_leaves : ''}</p>
                </Col>
                <Col>
                  <p>
                    Total No. of working Hrs. :{' '}
                    {details ? details.total_working_hours : ''}
                  </p>
                </Col>
              </Row>
            )}

          <CustomTable
            columns={columns}
            rows={rowData}
            role={5}
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
    </>
  );
}
export default withRouter(EmployeeTimesheet);
