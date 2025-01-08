/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image, Form, Tabs, Tab } from 'react-bootstrap';
import Select from 'react-select';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory, useParams } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import SweetAlert from 'react-bootstrap-sweetalert';


const items = [{ to: '/', label: 'Home' }, { label: 'Project Report' }];

const ProjectReportForm = () => {
  const validator = useRef(new SimpleReactValidator());

  const history = useHistory();
  const [title, setTitle] = useState('Report generations');
  const [isShowLoader, setShowLoader] = useState(false);

  const [projectId, setProjectId] = useState(22);
  const [count, forceUpdate] = useState(0)
  const [projectStatus, setProjectStatus] = useState({ value: '1', label: 'In Progress' });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [upcomingDeliverables, setUpcomingDeliverables] = useState([]);
  const [issues, setIssues] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [sectionOnetaskList, setSectionOneTaskList] = useState([]);
  const [sectionTwotaskList, setSectionTwoTaskList] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [showAddPopUp, setAddPopUp] = useState(false)
  const [projectsList, setProjectsList] = useState('')
  const [selectedProject, setProject] = useState('')

  const [statusOptions] = useState([
    { value: '1', label: 'In Progress' },
    { value: '2', label: 'Completed' },
    { value: '3', label: 'On Hold' }
  ]);

  console.log("selectedTasks", selectedTasks);

  const [selectedReportType, setReportType] = useState({ "label": 'Morning', "value": 1 })

  const reportTypes = [
    { "label": 'Morning', "value": 1 },
    { "label": 'Evening', "value": 2 },
  ]

  const today = new Date();

  useEffect(() => {
    if (filterDate && projectId) {
      fetchSectionOneTasks(1);
      fetchSectionTwoTasks(1);
    }
  }, [filterDate]);

  useEffect(() => {
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


  const fetchSectionOneTasks = async (page = 1) => {
    setShowLoader(true);
    setProjectId(selectedProject?.value)

    const startDate = customFunctions.getDate(filterDate)
    const endDate = customFunctions.getDate(toDate)
    const params = {
      // start_date: "2024-07-10",
      // end_date: "2024-16-10",
      start_date: startDate,
      end_date: endDate,
      sort_by: 'id',
      project_id: projectId,
      type: 'all'
    };

    const url = customFunctions.generateUrl(Api.projectTaskList, params);
    const { data } = await AuthApi.getDataFromServer(url);

    let arr = []
    if (data && data.success) {
      data?.data && data.data?.map((task) => {
        if (task.status !== "new") {
          let obj = {
            value: task.id,
            label: `${task.content} - ${task.status === "new" ? "Pending" : "Completed"}`,
            taskStatus: task.status
          }
          arr.push(obj)
        }

      })

      setSelectedTasks(arr)

      setSectionOneTaskList(() => {
        return data.data;
      });
      setShowLoader(false);

    } else {
      setShowLoader(false);

      swal(data.message || 'Error fetching data', '', 'error');
    }

  };

  const fetchSectionTwoTasks = async (page = 1) => {
    setShowLoader(true);
    const endDate = customFunctions.getDate(toDate)

    const params = {
      // start_date: "2024-16-10",
      start_date: endDate,
      sort_by: 'id',
      project_id: projectId,
      is_section_two: true,
      type: 'all'

    };

    const url = customFunctions.generateUrl(Api.projectTaskList, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {

      let arr = []
      data?.data && data.data?.map((task) => {
        let obj = {
          value: task.id,
          label: `${task.content} - ${task.status === "new" ? "Pending" : "Completed"}`,
          taskStatus: task.status
        }
        arr.push(obj)
      })
      setUpcomingDeliverables(arr)


      setSectionTwoTaskList(() => {
        return data.data
      }
      );
      setShowLoader(false);

    } else {
      setShowLoader(false);
      swal(data.message || 'Error fetching data', '', 'error');
    }
  };

  const handleSubmit = async () => {

    let final_obj = {
      project: +projectId,
      report_date: customFunctions.getDate(filterDate),
      current_status: +projectStatus?.value,
      issues_risks: issues,
      next_steps: nextSteps,
      report_type: +selectedReportType?.value
    }

    let prepareReportDetails = []
    selectedTasks && selectedTasks.length > 0 && selectedTasks.map((item) => {
      prepareReportDetails = [...prepareReportDetails, {
        task_id: item?.value,
        section: 1,
        status: item?.taskStatus === "new" ? 2 : 1,
      }]

    })

    upcomingDeliverables && upcomingDeliverables.length > 0 && upcomingDeliverables.map((item) => {
      prepareReportDetails = [...prepareReportDetails, {
        task_id: item?.value,
        section: 2,
        status: item?.taskStatus === "new" ? 3 : 1,
      }]
    })

    final_obj.report_tasks_details = prepareReportDetails

    const response = await AuthApi.postDataToServer(Api.generateTaskList, final_obj);

    const { data, message } = response;
    if (data) {
      swal(data.message[0], '', 'success').then(() => {
        history.push(`/team-project/${projectId}`);
      });
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setFilterDate(fromDate)
    } else {
      validator.current.showMessages()
      forceUpdate(count + 1)
    }
  };

  const handleClear = async () => {
    setFilterDate('')
    setFromDate('')
    setToDate('')
    setProject('')
    setSectionOneTaskList([])
    setSectionTwoTaskList([])
    setSelectedTasks([])
    setUpcomingDeliverables([])
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Report</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card className='overflow-visible' >
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Project Report Generation</h5>
            <Button
              variant="secondary"
              className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                { history.push(`/todays-project-reports`) }

              }}
            >
              Back
            </Button>
          </div>
          <hr style={{ borderColor: "white" }} />
          <Row>
            <Col sm={2}>
              <Datepicker
                className="form-control"
                label="Select from date"
                asterisk="*"
                selected={fromDate}
                onChange={(e) => {
                  setFromDate(e);
                }}
                // maxDate={new Date()}
                autoComplete="off"
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select date"
                errorMessage={validator.current.message(
                  'From date',
                  fromDate,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
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
            </Col>
            <Col sm={2}>
              <DropdownInput
                label="Project"
                asterisk="*"
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
              <Button variant="primary" onClick={(e) => { handleFilter(e) }}>Get task list</Button>
              <Button variant="secondary" onClick={() => {
                handleClear()
              }

              } className='ml-3'>
                Cancel
              </Button>
            </Col>
            <Col>
            </Col>
          </Row>

          {filterDate && (
            <>
              <Form>
                <Row>
                  <Col>
                    <DropdownInput
                      label="Current Project Status"
                      asterisk="*"
                      options={statusOptions}
                      defaultValue={projectStatus}
                      onSelectHandler={(select) => {
                        setProjectStatus(select);
                      }}
                      // disabled={isViewOnly ? true : false}
                      errorMessage={validator.current.message(
                        'Current Project Status',
                        selectedReportType,
                        'required'
                      )}
                    />
                  </Col>

                  <Col>
                    <DropdownInput
                      label="Report Type"
                      asterisk="*"
                      options={reportTypes}
                      defaultValue={selectedReportType}
                      onSelectHandler={(select) => {
                        setReportType(select);
                      }}
                      // disabled={isViewOnly ? true : false}
                      errorMessage={validator.current.message(
                        'Report Type',
                        selectedReportType,
                        'required'
                      )}
                    />
                  </Col>
                </Row>
                <div>
                  <Form.Group>
                    <Form.Label>Key Tasks Completed Today<span className="text-danger">*</span>

                    </Form.Label>
                    <Select
                      isMulti
                      value={selectedTasks}
                      options={sectionOnetaskList.map((task) => ({
                        value: task.id,
                        label: `${task.content} - ${task.status === "new" ? "Pending" : "Completed"}`,
                        taskStatus: task.status

                      }))}
                      onChange={(selected) => setSelectedTasks(selected)}
                      placeholder="Select tasks completed today"
                    />
                  </Form.Group>
                  <p className='text-danger'>
                    {validator.current.message(
                      'Key Tasks Completed Today',
                      selectedTasks,
                      'required'
                    )}
                  </p>
                </div>
                <div>
                  <Form.Group>
                    <Form.Label>Upcoming Deliverables (Next 5 Days)<span className="text-danger">*</span>

                    </Form.Label>
                    <Select
                      isMulti
                      value={upcomingDeliverables}
                      options={sectionTwotaskList.map((task) => ({
                        value: task.id,
                        label: `${task.content} - ${task.start_date ? customFunctions.getDate(task.start_date) : ''}`,
                        taskStatus: task.status
                      }))}
                      onChange={(selected) => setUpcomingDeliverables(selected)}
                      placeholder="Select upcoming deliverables"
                    />
                  </Form.Group>
                  <p className='text-danger'>
                    {validator.current.message(
                      'Upcoming Deliverables (Next 5 Days)',
                      upcomingDeliverables,
                      'required'
                    )}
                  </p>
                </div>

                <Form.Group>
                  <Form.Label>Issues/Risks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                    placeholder="Mention any delays or blockers"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Next Steps</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="Planned activities for tomorrow"
                  />
                </Form.Group>

                <Button
                  variant="secondary"
                  className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                  Submit Report
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (validator.current.allValid()) {
                      setAddPopUp(true);
                    } else {
                      validator.current.showMessages()
                      forceUpdate(count + 1)
                    }
                  }}>
                  Save Report
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
      {showAddPopUp && (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to submit? Once you submit, you can't change it."
          confirmBtnText="Submit"
          // confirmBtnBsStyle="blue"
          cancelBtnBsStyle="light"
          onConfirm={() => {
            handleSubmit()
            setAddPopUp(false)

          }}
          onCancel={() => {
            setAddPopUp(false)
          }}
        />
      )
      }
    </>

  );
};

export default ProjectReportForm;
