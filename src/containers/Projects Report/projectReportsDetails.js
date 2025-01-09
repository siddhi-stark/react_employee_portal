/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image, Tabs, Tab } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import SimpleReactValidator from 'simple-react-validator';


const items = [{ to: '/', label: 'Home' }, { label: `Weekly Generated Reports` }];

const ProjectReportsDetails = () => {
  const history = useHistory();
  const state = useLocation();
  const validator = useRef(new SimpleReactValidator());
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectReportId, setReportId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [title, setTitle] = useState('');
  const [isProjectManager, setProjectManager] = useState(false)
  const UserID = customFunctions.getLocalStorage('userId');
  const fromDate = customFunctions.getDate(new Date())
  const [reportType, setReportType] = useState({ "label": 'Morning', "value": 1 },)
  const [selectedId, setSelectedId] = useState([]);
  const [projectsList, setProjectsList] = useState('')
  const [selectedProject, setProject] = useState('')
  const [reportDate, setReportDate] = useState('')

  console.log("Hello World");
  

  useEffect(() => {
    console.log("Hello Three", isProjectManager);
    if (UserID) {
      console.log("inside", isProjectManager);
      getTodaysReport();
    }
  }, [isProjectManager]);

  const [morningRowData, setMorningRowData] = useState([])
  const [eveningRowData, setEveningRowData] = useState([])


  useEffect(() => {
    console.log("Hello Two");
    setTitle(`Today's Reports`)
    const isProjectManager =
    customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
    const uRole = customFunctions.getLocalStorage('group');
    getProjectList();
    setUserRole(Number(uRole));
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
  

  const getTodaysReport = async (pageNo = 1) => {
    console.log("Hello hello");
    
    setShowLoader(true);
    const params = {
      page: pageNo,
      sort_direction: 'descending',

    };
    if (isProjectManager) {
      params.user = UserID
    }
    if (selectedProject) {
      params.project = +selectedProject?.value
    }
    if (reportDate) {
      params.report_date = customFunctions.getDate(reportDate)
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
              no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
              id: item?.id,
              projectsId: item?.project_id,
              projectName: item?.project_name,
              projectStatus: item?.current_status_name,
              morningMail: item?.sent_mail,
              reportDate: item?.report_date,
            })
          }
        })

        setMorningRowData(morningReportData)
        setRowData(morningReportData)


        setTotalCount(data.paginator.total_count);
        setLimit(data.paginator.limit);
        setCurrentPage(Number(data.paginator.current_page));
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      swal('Error fetching data', '', 'error');
    } finally {
      setShowLoader(false);
      setApiCalled(false);
    }
  };

  const columnsMorning = [
    {
      id: 'no',
      label: 'SR No',
      roleAccess: [1],
      isDisplay: true
    },
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
      id: 'reportDate',
      label: 'Report Date',
      render: (row) => row.reportDate,
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
            // className="ml-1"
            onClick={(e) => {
              e.preventDefault();
              history.push(`/view-reports-projects/${projectsId}`, { state: { formattedDate: fromDate, fromSentReport: true } });
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
        getTodaysReport(1);
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
        setMorningRowData([])
        setEveningRowData([])
        setRowData([])
        history.push('/current-project', {})
        setShowDelete(false);
      });
    }
  }

  const handleFilter = (e) => {
    getTodaysReport()
  }

  const handleClear = (e) => {
    setProject('')
    setReportDate('')
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Weekly Generated Reports</h2>
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
              <Datepicker
                className="form-control"
                label="Select report date"
                asterisk="*"
                selected={reportDate}
                onChange={(e) => {
                  setReportDate(e);
                }}
                // maxDate={new Date()}
                autoComplete="off"
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select date"
                errorMessage={validator.current.message(
                  'Report Date',
                  reportDate,
                  'required'
                )}
              />
            </Col>
            {/* <Col sm={2}>
              <Datepicker
                label="Select to date"
                asterisk="*"
                className="form-control"
                selected={toDate}
                onChange={(e) => setToDate(e)}
                autoComplete="off"
                name="endDate"
                maxDate={fromDate ? new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}
                minDate={fromDate}
                dateFormat="dd/MM/yyyy"
                placeholder="Select date"
                errorMessage={validator.current.message(
                  'To date ',
                  toDate,
                  'required'
                )}
              />
            </Col> */}
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
                  history.push(`/todays-project-reports`)
                }}
                className="btn-link"
              >
                Today's Reports Details
              </a>
            </div>

          </Row>

          <Row>
            {
              (rowData && (<>

                <CustomTable
                  columns={columnsMorning}
                  rows={rowData}
                  showPagination={true}
                  paginationProps={{
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    activePage: Number(currentPage),
                    onPageChange: (page) => {
                      getTodaysReport(page)
                      setCurrentPage(page)
                    },
                  }}
                />
              </>))
            }
          </Row>
          <br />
          {
            selectedId && selectedId?.length > 0 && (
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

export default ProjectReportsDetails;
