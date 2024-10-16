/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Helmet, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import Select from 'react-select';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory, useParams } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';


const items = [{ to: '/', label: 'Home' }, { label: 'Project Report' }];

const ProjectTaskForm = () => {
  const validator = useRef(new SimpleReactValidator());

  const history = useHistory();
  const [title, setTitle] = useState('Report generations');
  const [isShowLoader, setShowLoader] = useState(false);
  const { id } = useParams();
  console.log('id', id);
  const [projectId, setProjectId] = useState(id);
  const [count, forceUpdate] = useState(0)
  const [projectStatus, setProjectStatus] = useState({ value: '1', label: 'In Progress' });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [upcomingDeliverables, setUpcomingDeliverables] = useState([]);
  const [issues, setIssues] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [sectionOnetaskList, setSectionOneTaskList] = useState([]);
  const [sectionTwotaskList, setSectionTwoTaskList] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [limit, setLimit] = useState(10);
  const [statusOptions] = useState([
    { value: '1', label: 'In Progress' },
    { value: '2', label: 'Completed' },
    { value: '3', label: 'On Hold' }
  ]);

  const today = new Date();

  useEffect(() => {
    if (filterDate && projectId) {
      fetchSectionOneTasks(1);
      fetchSectionTwoTasks(1);
    }
  }, [filterDate]);


  const fetchSectionOneTasks = async (page = 1) => {
    setShowLoader(true);

    const params = {
      start_date: "2024-07-10",
      sort_by: 'id',
      project_id: projectId,
      // page:page,
      type: 'all'
    };

    // if (filterDate.getDate() !== today.getDate()) {
    //   params.end_date = start_date
    // }

    const url = customFunctions.generateUrl(Api.reportTaskList, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      const { current_page, total_count, limit } = data.paginator;
      // setPagination({
      //   current_page: parseInt(current_page, 10),
      //   totalItems: parseInt(total_count, 10),
      //   itemsPerPage: parseInt(limit, 10),
      // });

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
    const params = {
      start_date: "2024-09-10",
      // start_date: customFunctions.getDate(filterDate),
      sort_by: 'id',
      project_id: projectId,
      is_section_two: true,
      // page: page, // Add pagination parameter
      type: 'all'

    };

    // if (filterDate.getDate() !== today.getDate()) {
    //   params.end_date = start_date
    // }

    const url = customFunctions.generateUrl(Api.reportTaskList, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      const { current_page, total_count, limit } = data.paginator;

      // setPagination({
      //   current_page: parseInt(current_page, 10),
      //   totalItems: parseInt(total_count, 10),
      //   itemsPerPage: parseInt(limit, 10),
      // });

      // Merge with the existing list if loading more
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
    console.log("sectionOnetaskList", sectionOnetaskList)
    console.log("sectionTwotaskList", sectionTwotaskList)
    console.log("selectedTasks", selectedTasks)
    console.log("upcomingDeliverables", upcomingDeliverables)

    let final_obj = {
      project: +projectId,
      report_date: customFunctions.getDate(filterDate),
      current_status: +projectStatus?.value,
      issues_risks: issues,
      next_steps: nextSteps
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

    const response = await AuthApi.postDataToServer(Api.projectTaskList, final_obj);

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
    setFilterDate(fromDate)
  };

  const handleClear = async () => {
    setFilterDate('')
    setFromDate('')
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

      <Card>
        <Card.Body>
          <Row>
            <Col sm={2}>
              <Datepicker
                className="form-control"
                // label="Select from date"
                asterisk="*"
                selected={fromDate}
                onChange={(e) => {
                  setFromDate(e);
                }}
                // maxDate={new Date()}
                autoComplete="off"
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select report date"
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={(e) => { handleFilter(e) }}>Get task list</Button>
              <Button variant="secondary" onClick={() => {
                handleClear()
              }

              } className='ml-3'>
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {filterDate && (
        <>
          <Card>
            <Card.Body>
              <Form>
                <div>

                  <Form.Group>
                    <Form.Label>Current Project Status<span className="text-danger">*</span>

                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <p className='text-danger'>
                    {validator.current.message(
                      'Current Project Status',
                      projectStatus,
                      'required'
                    )}
                  </p>
                </div>

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
                      handleSubmit()
                    } else {
                      validator.current.showMessages()
                      forceUpdate(count + 1)
                    }
                  }}>
                  Submit Report
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default ProjectTaskForm;
