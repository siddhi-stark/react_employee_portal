/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

const items = [{ to: '/', label: 'Home' }, { label: `Monthly Project Reports` }];

const TodaysProjectReports = () => {
  const history = useHistory();
  const validator = useRef(new SimpleReactValidator());
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [projectReportId, setReportId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [title, setTitle] = useState('');
  const UserID = customFunctions.getLocalStorage('userId');
  const fromDate = customFunctions.getDate(new Date())
  const [reportType, setReportType] = useState({ "label": 'Morning', "value": 1 },)
  const [selectedId, setSelectedId] = useState([]);
  const [projectsList, setProjectsList] = useState('')
  const [selectedProject, setProject] = useState('')

  useEffect(() => {
    if (UserID) {
      getTodaysReport();
    }
  }, [UserID]);

  useEffect(() => {
    setTitle(`Today's Reports`)
    getProjectList();
  }, []);

  const getProjectList = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.projectListUrl}?sort_by=name&status=active&type=all`
    );

    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    const dpOptions =
      (data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    setProjectsList(dpOptions);
  };

  const getTodaysReport = async () => {
    setShowLoader(true);
    const params = {
      user: UserID,
      // type: 'all',
      start_date: fromDate,
      end_date: fromDate
    };

    if (selectedProject) {
      params.project = +selectedProject?.value
    }

    const url = customFunctions.generateUrl(Api.generateTaskList, params);
    try {
      const { data } = await AuthApi.getDataFromServer(url);
      setShowLoader(false);

      let morningReportData = []
      let eveningReportData = []

      if (data && data.success) {
        data?.data && data.data.length > 0 && data.data.map((item, index) => {
          if (item?.report_type == 1) {
            morningReportData.push({
              id: item?.id,
              projectsId: item?.project_id,
              projectName: item?.project_name,
              projectStatus: item?.current_status_name,
              morningMail: item?.sent_mail,
            })
          } else {
            eveningReportData.push({
              id: item?.id,
              projectsId: item?.project_id,
              projectName: item?.project_name,
              projectStatus: item?.current_status_name,
              eveningMail: item?.sent_mail,

            })
          }
        })

        setRowData(morningReportData)
        const { current_page, total_count, limit } = data.paginator;
        setPagination({
          current_page: parseInt(current_page, 10),
          totalItems: parseInt(total_count, 10),
          itemsPerPage: parseInt(limit, 10),
        });
        setTotalCount(total_count);
        setLimit(limit);
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      swal('Error fetching data', '', 'error');
    } finally {
      setShowLoader(false);
    }
  };

  const columnsMorning = [
    {
      id: 'projectName',
      label: 'Project Name',
      render: (row) => row.projectName || 'N/A',
      roleAccess: [1],
      isDisplay: true

    },
    {
      id: 'projectStatus',
      label: 'Project Status',
      render: (row) => row.projectStatus,
      roleAccess: [1],
      isDisplay: true

    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1],
      isDisplay: true,

      render: ({ projectsId, morningMail }) => (
        <>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              history.push(`/view-reports-projects/${projectsId}`, { state: { formattedDate: fromDate, fromSentReport: true, isTodaysReport:true } });
            }}
          >
            <Image src="/images/view-eye.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />

          </a>
          {!morningMail && (
            <a
              href="/"
              className="ml-1"
              onClick={(e) => {
                e.preventDefault();
                setShowDelete(true);
                setReportId(projectsId);
              }}
            >
              <Image src="/images/delete.png" alt="Delete" />
            </a>
          )}
        </>
      ),
    },
    {
      id: 'morningMail',
      label: 'Report Details',
      render: (row) => row.morningMail === true ? "Report Sent" : "Report Not Sent",
      roleAccess: [1],
      isDisplay: true

    },
  ];

  const deleteTask = async () => {
    const params = {
      report_date: fromDate,
      report_type: +reportType?.value,
      user_id: +UserID,
      project_id: +projectReportId
    }
    const url = customFunctions.generateUrl(`${Api.generateTaskList}${projectReportId}/`, params);
    const { data, message } = await AuthApi.deleteDataFromServer(url);

    if (data?.success) {
      swal('Deleted successfully', '', 'success').then(() => {
        setShowDelete(false);
        getTodaysReport();
      });
    } else {
      swal(data && data.message, '', 'error');
    }
  };

  const handleSubmit = async () => {
    const obj = {
      user: +UserID,
      report_type: +reportType?.value,
      report_date: fromDate,
      project_reports_ids: selectedId,
    };

    const url = customFunctions.generateUrl(Api.generateTaskTeports);
    const { data } = await AuthApi.postDataToServer(url, obj);
    if (data.success) {
      swal('Report sent successfully', '', 'success').then(() => {
        setRowData([])
        history.push('/todays-project-reports', {})
        setShowDelete(false);
      });
    }
  }

  const handleExportCSV = async () => {
    // Validate that reports are selected
    if (!selectedId || selectedId.length === 0) {
      swal('Please select reports', 'You need to select at least one report to export', 'warning');
      return;
    }

    setShowLoader(true);

    try {
      // Build query parameters
      const params = {
        project_reports_ids: selectedId.join(','), // Comma-separated string
      };

      // Optional filters - can be added if needed
      if (fromDate) {
        params.report_date = fromDate;
      }
      if (reportType?.value) {
        params.report_type = reportType.value;
      }
      if (UserID) {
        params.user_id = UserID;
      }

      const url = customFunctions.generateUrl(Api.projectReportsExportCSVUrl, params);
      const token = customFunctions.getLocalStorage('access_token');

      // Fetch the export API using GET
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check content-type header
      const contentType = response.headers.get('content-type') || '';

      // Handle error responses
      if (!response.ok) {
        const clonedResponse = response.clone();

        if (contentType.includes('application/json')) {
          try {
            const errorData = await clonedResponse.json();
            const errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            setShowLoader(false);
            swal('Export failed', Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage, 'error');
            return;
          } catch (e) {
            const errorText = await response.text();
            setShowLoader(false);
            swal('Export failed', errorText || 'Failed to download file', 'error');
            return;
          }
        } else {
          const errorText = await response.text();
          setShowLoader(false);
          swal('Export failed', errorText || 'Failed to download file', 'error');
          return;
        }
      }

      // Parse JSON response
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();

        if (jsonData.success && jsonData.data) {
          // Get file URL from response (prefer download_url, then file_url, then csv_path)
          let fileUrl = jsonData.data.download_url || jsonData.data.file_url || jsonData.data.csv_path;
          let fileName = 'project_reports_export.csv';

          if (!fileUrl) {
            setShowLoader(false);
            swal('Export failed', 'No file URL returned from server', 'error');
            return;
          }

          // Extract filename from URL if it's a full URL
          try {
            if (fileUrl.startsWith('http')) {
              const urlObj = new URL(fileUrl);
              const pathParts = urlObj.pathname.split('/');
              if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
                fileName = pathParts[pathParts.length - 1];
              }
            } else {
              // Handle relative path
              const baseUrlStr = Api.baseUrl;
              const baseDomain = baseUrlStr.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');
              const mediaPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
              fileUrl = `${baseDomain}${mediaPath}`;
              
              // Extract filename from path
              const pathParts = fileUrl.split('/');
              if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
                fileName = pathParts[pathParts.length - 1];
              }
            }
          } catch (e) {
            // If URL parsing fails, use default filename
            console.log('Error parsing URL:', e);
          }

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
        } else {
          // Error response from API
          const errorMessage = jsonData.message || 'Export failed';
          setShowLoader(false);
          swal('Export failed', Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage, 'error');
          return;
        }
      }

      // If response is not JSON, show error
      const errorText = await response.text();
      setShowLoader(false);
      swal('Export failed', errorText || 'Unexpected response format', 'error');
    } catch (error) {
      setShowLoader(false);
      swal('Export failed', error.message || 'An error occurred while exporting', 'error');
    }
  }

  const handleFilter = (e) => {
    getTodaysReport()
  }

  const handleClear = (e) => {
    setProject('')
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Monthly Project Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card >
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 "></h5>
            <Button
              variant="secondary"
              className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                history.push(`/project-report-generation`)
              }}
            >
              Generate Report
            </Button>
          </div>
          <hr style={{ borderColor: "white" }} />
          <Row>
            <Col sm={2}>
              <DropdownInput
                label="Project"
                // asterisk="*"
                options={projectsList}
                defaultValue={selectedProject}
                onSelectHandler={(select) => {
                  setProject(select);
                }}
                disabled={false}
                errorMessage={validator.current.message(
                  'Department',
                  selectedProject,
                  'required'
                )}
              />
            </Col>

            <Col sm={4} className='mt-4'>
              <Button variant="primary" onClick={(e) => { handleFilter(e) }}> Filter </Button>
              <Button variant="secondary" onClick={() => {
                handleClear()
              }

              } className='ml-3'>
                Cancel
              </Button>
            </Col>
            <Col>
            </Col>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 "></h5>
              <a
                href="#"
                onClick={() => {
                  history.push(`/project-reports-details`)
                }}
                className="btn-link"
              >
                Previous Reports Details
              </a>
            </div>
          </Row>
          {
          console.log("pagination.current_page", pagination)
          }  
            
          
          {            
            (rowData &&
              <Table
                columns={columnsMorning}
                rows={rowData}
                showPagination={true}
                showCheckbox={rowData?.length > 0 ? true : false}
                paginationProps={{
                  totalItems: totalCount,
                  itemsPerPage: limit,
                  currentPage: pagination?.current_page,
                  handlePageChange: () => '',
                }}
                dropdownContainerClass="mb-3"
                selectedRowItems={selectedId}
                onSelectRowsIndexes={async (rowIndex) => {
                  const arr = [...rowIndex];
                  const arrNew = [];
                  await arr.filter((e) => {
                    if (!arrNew.includes(e)) {
                      arrNew.push(Number(e));
                    }
                    return e;
                  });
                  setSelectedId([...arrNew]);
                }}
                tableClass="table-striped"
                emptyRender={() => (
                  <p className="text-center mb-0">No reports found</p>
                )}
              />
            )
          }
          <br />
          {
            selectedId && selectedId?.length > 0 && (
              <>
                <Button
                  variant="secondary"
                  className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                  type="submit"
                  onClick={() => {
                    setShowSubmit(true)
                  }}
                >
                  Sent Report
                </Button>
                <Button
                  variant="success"
                  className="border-0 h4 m-0 text-white rounded-3 ml-3"
                  type="button"
                  onClick={handleExportCSV}
                >
                  Export CSV
                </Button>
              </>
            )
          }
        </Card.Body>
      </Card>

      {showSubmit ? (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to sent report?"
          confirmBtnText="Yes, sent"
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
          onConfirm={() => {
            handleSubmit();
            setShowSubmit(false);
          }}
          onCancel={() => {
            setShowSubmit(false);
          }}
        />
      ) : showDelete ? (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to delete?"
          confirmBtnText="Yes, Delete"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="light"
          onConfirm={() => {
            deleteTask();
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
        />
      ) : ''}
    </>
  );
};

export default TodaysProjectReports;
