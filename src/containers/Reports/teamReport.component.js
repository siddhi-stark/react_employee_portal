import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import {
  Helmet,
  Datepicker,
  DropdownInput,
} from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { label: 'Team Timesheet' },
];

function TeamReport() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterErr, setFilterErr] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [team, setTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory();

  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [3, 2, 6, 5],
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [3, 2, 6, 5],
    },
    {
      id: 'date',
      label: 'Date',
      roleAccess: [3, 2, 6, 5],
    },
    {
      id: 'clockin',
      label: 'In',
      roleAccess: [3, 2, 6, 5],
    },
    {
      id: 'clockout',
      label: 'Out',
      roleAccess: [3, 2, 6, 5],
    },
    {
      id: 'total',
      label: 'Total Working',
      roleAccess: [3, 2, 6, 5],
    },
    {
      id: 'report',
      label: 'View Report',
      roleAccess: [3, 2, 6, 5],
    },
  ];

  const getReports = async (pageNo = 0) => {
    setShowLoader(true);
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.reportListingUrl}?my_team=true`;

    const params = {
      limit: pagination.itemsPerPage,
      page,
      start_date: fromDate ? customFunctions.getDate(fromDate) : '',
      end_date: toDate ? customFunctions.getDate(toDate) : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);

    let postData = {};
    const employeeList = [];
    console.log('selectedEmployee', selectedEmployee);
    
    if (selectedEmployee && selectedEmployee.length > 0) {
      selectedEmployee.map((emp) => {
        team.map((tem) => {
          if (tem.id === emp.id) {
            employeeList.push(tem.employee_id);
          }
          return tem;
        });
        return emp;
      });
    }

    postData = {
      users: employeeList,
    };

    const payload = customFunctions.cleanObject(postData);

    const { data } = await AuthApi.postDataToServer(url, payload);
    if (data && data.data) {
      setShowLoader(false);
      if (data.paginator && Object.keys(data.paginator).length > 0) {
        setPagination({
          current_page: Number(data.paginator.current_page),
          activePage: data.paginator.current_page,
          itemsPerPage: data.paginator.limit,
          totalItems: data.paginator.total_count,
        });
      }
      const row = [];
      data.data.map((report, i) => {
        const date = customFunctions.getDate(report.created_at);
        const dt = new Date(date).getTime();
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.user,
          date: customFunctions.getDMYDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: `${report.estimation} Hrs`,
          report: (
            <a
              href="javascript.void(0)"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/daily-report/${dt}/${report.user_id}`, {
                  teamReport: true,
                  reporterName: report.user,
                });
              }}
            >
              <span className="text-info">View Report</span>
            </a>
          ),
        };
        row.push(setRowData);
        return report;
      });
      setRows(row);
    }
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.teamUrl}`);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setTeam(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
      getReports(1);
      setTitle('Team Report');
      getEmployee();
    }
    getData();
  }, []);

  useEffect(() => {
    getReports(1);
  }, [cntClearFilter]);

  const getTeamList = () => {
    if (!team) return [];
    const options = [];
    team.map((tm) => {
      return options.push({
        label: tm.employee_name,
        id: tm.id,
        value: tm.id,
      });
    });
    return options;
  };

  const onClear = () => {
    setFilterErr('');
    setFromDate('');
    setToDate('');
    setSelectedEmployee('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (
      customFunctions.checkIfEmpty(fromDate) &&
      customFunctions.checkIfEmpty(toDate) &&
      customFunctions.checkIfEmpty(selectedEmployee)
    ) {
      filterSearchErr = 'Please select at least one filter';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getReports(1);
    }
  };

  const handleExport = async () => {
    setShowLoader(true);
    const endPoint = `${Api.teamTimesheetExportUrl}`;
    
    const params = {};

    // Add start_date in YYYY-MM-DD format
    if (fromDate) {
      params.start_date = customFunctions.getDate(fromDate);
    }

    // Add end_date in YYYY-MM-DD format
    if (toDate) {
      params.end_date = customFunctions.getDate(toDate);
    }

    // Build employee list and add as comma-separated users parameter
    const employeeList = [];
    
    if (selectedEmployee && selectedEmployee.length > 0) {
      selectedEmployee.map((emp) => {
        team.map((tem) => {
          if (tem.id === emp.id) {
            employeeList.push(tem.employee_id);
          }
          return tem;
        });
        return emp;
      });
    }

    // Add users as comma-separated employee IDs (e.g., "1,2,3")
    if (employeeList.length > 0) {
      params.users = employeeList.join(',');
    }

    // Add my_team parameter like in getReports
    params.my_team = true;

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

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check content-type header first
      const contentType = response.headers.get('content-type') || '';
      console.log('Content-Type:', contentType);
      
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
      
      // Generate filename with current date
      const fileName = `employee_timesheet_${customFunctions.getDate(new Date())}.csv`;
      
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

  const handleExportTasks = async () => {
    setShowLoader(true);
    const endPoint = `${Api.exportTasksUrl}`;
    
    const params = {};

    // Add from_date in YYYY-MM-DD format
    if (fromDate) {
      params.from_date = customFunctions.getDate(fromDate);
    }

    // Add to_date in YYYY-MM-DD format
    if (toDate) {
      params.to_date = customFunctions.getDate(toDate);
    }

    // Build employee list and add as comma-separated user_id parameter
    const employeeList = [];
    
    if (selectedEmployee && selectedEmployee.length > 0) {
      selectedEmployee.map((emp) => {
        team.map((tem) => {
          if (tem.id === emp.id) {
            employeeList.push(tem.employee_id);
          }
          return tem;
        });
        return emp;
      });
    }

    // Add user_id as comma-separated employee IDs (e.g., "1,2,3")
    if (employeeList.length > 0) {
      params.user_id = employeeList.join(',');
    }

    // Clean object to remove empty values
    const cleanParams = customFunctions.cleanObject(params);
    const url = customFunctions.generateUrl(endPoint, cleanParams);

    console.log('Export Tasks URL:', url);
    console.log('Export Tasks params:', cleanParams);

    try {
      // Get the access token for authentication
      const token = customFunctions.getLocalStorage('access_token');
      
      // Fetch the export response using GET
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check content-type header
      const contentType = response.headers.get('content-type') || '';
      
      // If response is not ok, handle error
      if (!response.ok) {
        const clonedResponse = response.clone();
        
        // Try to parse as JSON first
        if (contentType.includes('application/json')) {
          try {
            const errorData = await clonedResponse.json();
            const errorMessage = errorData.message || errorData.error || errorData.detail || JSON.stringify(errorData);
            setShowLoader(false);
            swal('Export failed', errorMessage, 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
            return;
          } catch (e) {
            const errorText = await response.text();
            setShowLoader(false);
            swal('Export failed', errorText || 'Failed to export tasks', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
            return;
          }
        } else {
          const errorText = await response.text();
          setShowLoader(false);
          swal('Export failed', errorText || 'Failed to export tasks', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
          return;
        }
      }

      // Parse JSON response
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        console.log('Export Tasks Response:', jsonData);
        
        // Check if response contains file_path (can be in jsonData.file_path or jsonData.data.file_path)
        let fileUrl = null;
        let fileName = 'tasks_time_entries_report.csv';
        let recordsExported = null;
        let successMessage = null;
        
        // Check nested data structure first (jsonData.data.file_path)
        if (jsonData.success && jsonData.data && jsonData.data.file_path) {
          fileUrl = jsonData.data.file_path;
          recordsExported = jsonData.data.records_exported;
          successMessage = jsonData.data.message;
        } else if (jsonData.file_path) {
          // Check direct file_path
          fileUrl = jsonData.file_path;
          recordsExported = jsonData.records_exported;
          successMessage = jsonData.message;
        }
        
        if (fileUrl) {
          // If file_path is relative, construct full URL
          if (!fileUrl.startsWith('http')) {
            // Extract base domain from baseUrl (remove /api/v1/ or /api/v2/ etc.)
            const baseUrlStr = Api.baseUrl;
            // Remove trailing slash and /api/v1/ or similar API path
            const baseDomain = baseUrlStr.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');
            
            // Ensure fileUrl starts with / for proper URL construction
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
            // If URL parsing fails, try simple split
            const pathParts = fileUrl.split('/');
            if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
              fileName = pathParts[pathParts.length - 1];
            }
          }
          
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
          const finalMessage = successMessage || `File downloaded successfully. ${recordsExported ? `Records exported: ${recordsExported}` : ''}`;
          swal('Export successful', finalMessage, 'success');
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

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Team Timesheet</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              </div>
              <hr />
              <Card.Title>
                <Form onSubmit={(e) => filterSearch(e)}>
                  {filterErr && (
                    <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                      <div className="img-text">
                        <img src="/images/fail.svg" alt="Success" /> {filterErr}
                      </div>
                    </div>
                  )}
                  <Row className="mt-3">
                    <Col sm={4}>
                      <div className="search-bar-input">
                        <DropdownInput
                          options={getTeamList()}
                          placeholder="Select Employee"
                          defaultValue={selectedEmployee}
                          onSelectHandler={(select) => {
                            setSelectedEmployee(select);
                          }}
                          isMulti
                        />
                      </div>
                    </Col>

                    <Col sm={4}>
                      <Datepicker
                        className="form-control"
                        selected={fromDate}
                        onChange={(e) => {
                          setFromDate(e);
                        }}
                        autoComplete="off"
                        name="startDate"
                        placeholder="From Date"
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                      />
                    </Col>

                    <Col sm={4}>
                      <Datepicker
                        className="form-control"
                        selected={toDate}
                        onChange={(e) => {
                          setToDate(e);
                        }}
                        autoComplete="off"
                        minDate={fromDate}
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        placeholder="To Date"
                        maxDate={new Date()}
                      />
                    </Col>
                      <Row className="mt-3">
                        <Col sm={2}>
                      <div className="mt-1">
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => handleExport()}
                          >
                          Export Timesheet
                        </Button>
                      </div>
                          </Col>

                        <Col sm={2}>
                      <div className="mt-1">
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => handleExportTasks()}
                          >
                          Export Tasks & Bugs
                        </Button>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div className="filter-btn pull-right filter-btn-report">
                        <Button
                          variant="primary"
                          type="submit"
                          className="ms-4"
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
                  </Row>
                </Form>
              </Card.Title>
            </Card.Body>
          </Card>
        </div>
      </section>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Team Timesheet</h5>
            </div>
            <hr />
            <Table
              tableClass="table table-striped"
              columns={columns}
              rows={rows}
              showPagination
              paginationProps={{
                ...pagination,
                activePage: pagination.current_page,
                onPageChange: (pageNo) => {
                  getReports(pageNo);
                },
              }}
              dropdownContainerClass="mb-3"
            />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(TeamReport);
