/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button } from 'react-bootstrap';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

const items = [{ to: '/', label: 'Home' }, { label: 'Project Report' }];
const ProjectWeeklyTask = () => {
  const validator = useRef(new SimpleReactValidator());
  const [projectName, setProjectName] = useState();
  useEffect(() => {
    const projectName = customFunctions?.getLocalStorage('projectName');
    setProjectName(projectName);
  }, [localStorage.getItem('projectName')]);


  const [count, forceUpdate] = useState(0)
  const [title, setTitle] = useState('Report generations');
  const [isShowLoader, setShowLoader] = useState(false);
  const { id } = useParams();
  const [projectId, setProjectId] = useState(id);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [groupedTasks, setGroupedTasks] = useState([]);
  const [promptMessage, setPromptMessage] = useState('');
  const [milestones, setMilestones] = useState('')
  const [selectTaskFrom, setTaskFrom] = useState('')
  const [milestoneFilter, setMilestoneFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sentButton, setSentButton] = useState(false)

  const milestoneStatus = [
    { "label": "All", "value": "all" },
    { "label": "Upcoming", "value": "upcoming" },
    { "label": "Completed", "value": "complete" },
    { "label": "Peading", "value": "new" },]

  const tasksFrom = [
    { "label": "From Milestone", "value": "milestone" },
    { "label": "Without Milestone", "value": "non-milestone" },]

  const groupTasksByMilestone = (tasks) => {
    return tasks.reduce((acc, task) => {
      const { milestone_id, milestone_name, milestone_status } = task;
      const key = milestone_id && milestone_name ? `${milestone_id}-${milestone_name}` : 'No Milestones';
      if (!acc[key]) {
        acc[key] = {
          milestone_id: milestone_id || null,
          milestone_name: milestone_name || 'No Milestones',
          milestone_status: milestone_status || 'No Milestones',
          tasks: [],
        };
      }
      acc[key].tasks.push(task);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (filterStartDate && filterEndDate && projectId) {
      fetchSectionOneTasks(currentPage);
    }
  }, [filterStartDate, filterEndDate, currentPage]);

  useEffect(() => {
    if (fromDate && toDate && statusFilter) {
      getMilestones()
    }
  }, [fromDate, toDate, statusFilter])

  const getMilestones = async () => {
    setShowLoader(true);
    const startDate = customFunctions.getDate(filterStartDate);
    const endDate = customFunctions.getDate(filterEndDate);
    const params = {
      start_date: "2024-11-01",
      end_date: "2024-11-10",

      sort_by: 'id',
      project_id: projectId,
      type: 'all',
    };

    if (statusFilter?.value !== "all") {
      params.status = statusFilter.value
    }

    const url = customFunctions.generateUrl(Api.milestonesDetails, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      let filterMilestones = []
      data?.data?.length > 0 && data.data.map((item) => {
        filterMilestones.push(
          { 'label': item?.name, "value": item?.tw_id },
        )

      })

      console.log("filterMilestones", filterMilestones);

      if (filterMilestones) {
        filterMilestones.unshift({ 'label': "All Milestones", "value": 1 })
      }
      console.log("filterMilestones", filterMilestones);

      setMilestoneFilter(filterMilestones)

      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(data.message || 'Error fetching data', '', 'error');
    }
  };

  const fetchSectionOneTasks = async (page = 1) => {
    setShowLoader(true);
    const startDate = customFunctions.getDate(filterStartDate);
    const endDate = customFunctions.getDate(filterEndDate);
    const params = {
      start_date: "2024-02-10",
      end_date: "2024-02-20",

      sort_by: 'id',
      project_id: projectId,
      type: 'all',
    };

    console.log("milestones", milestones);

    console.log("milestones?.value", milestones?.value);

    if (selectTaskFrom?.value === "milestone") {

      let multiIds = null
      console.log("milestoneFilter", milestoneFilter);

      if (milestones?.value === 1) {

        milestoneFilter && milestoneFilter?.map((item) => {
          console.log("item?.value", item?.value);

          if (item?.value != 1) {
            if (multiIds) {
              multiIds += `,${item?.value}`
            }
            else {
              multiIds = `${item?.value}`
            }
          }
          console.log("multiIds", multiIds);

        })
        params.milestone_id = multiIds
      }else{
        params.milestone_id = milestones?.value                              
      }
    }
    else {
      params.is_not_milestone = true
    }

    if (statusFilter) {
      params.milestone_status = statusFilter?.value
    }

    console.log('prarms', params);

    const url = customFunctions.generateUrl(Api.taskDetails, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      const groupedData = groupTasksByMilestone(data.data); 
      setGroupedTasks(groupedData);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(data.message || 'Error fetching data', '', 'error');
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setFilterStartDate(fromDate);
    setFilterEndDate(toDate);
    setCurrentPage(1); 
  };

  const handleClear = async () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFromDate('');
    setToDate('');
    setTaskFrom('');
    setStatusFilter('');
    setMilestones('')
    setSentButton(false)
  };

  const handleSend = () => {
    let message = 'Project Task Summary:\n\n';
    let totalTasks = 0;
    const currentDate = new Date();

    if (Object.keys(groupedTasks).length === 0) {
        message += 'No milestones or tasks are currently available.\n';
    } else {
        Object.values(groupedTasks).forEach((group) => {
            const taskCount = group.tasks.length;
            const delayedTasks = group.tasks.filter(task => (new Date(task.end_date) < currentDate && task.status === 'new')).length;
            const completedTasks = group.tasks.filter(task => task.status === 'completed').length;
            const pendingTasks = group.tasks.filter(task => task.status === 'new').length;

            totalTasks += taskCount;
            message += `Milestone: ${group.milestone_name}\n`
            message += `Status: ${customFunctions.capitalizeFirstLetter(group.milestone_status === "new" ? "pending" : group.milestone_status )}\n`; // Could be 'Delayed', 'On Time', 'Completed'
            message += `Tasks Count: ${taskCount}\n`;
            message += ` - Completed Tasks: ${completedTasks}\n`;
            message += ` - Delayed Tasks: ${delayedTasks}\n`;
            message += ` - Pending Tasks: ${pendingTasks}\n\n`;
        });

        message += `Total Tasks across all milestones: ${totalTasks}\n\n`;
        message += "Analyze the milestone status based on delayed tasks, pending tasks, and completed tasks. \n";
        message += "Predict new milestone dates if needed, based on previous delays and reasons for delays. \n";
        message += "Provide insights into why certain milestones might be delayed and suggestions for improving task completion rates.\n";
    }

    setPromptMessage(message);
};


  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Report</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card className='overflow-visible'>
        <Card.Body>
          <Row>
            <Col sm={2}>
              <Datepicker
                label="From Report Date"
                asterisk="*"
                className="form-control"
                selected={fromDate}
                onChange={(e) => setFromDate(e)}
                autoComplete="off"
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select Date"
                errorMessage={validator.current.message(
                  'fromReportDate',
                  fromDate,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
              <Datepicker
                label="To Report Date"
                asterisk="*"
                className="form-control"
                selected={toDate}
                onChange={(e) => setToDate(e)}
                autoComplete="off"
                name="endDate"
                maxDate={fromDate ? new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}
                minDate={fromDate}
                dateFormat="dd/MM/yyyy"
                placeholder="Select Date"
                errorMessage={validator.current.message(
                  'toReportDate',
                  toDate,
                  'required'
                )}
              />
            </Col>
            <Col sm={3}>
              <DropdownInput
                label="Task From"
                asterisk="*"
                options={tasksFrom}
                defaultValue={selectTaskFrom}
                disabled={fromDate && toDate ? false : true}
                onSelectHandler={(e) => {
                  setTaskFrom(e)

                }}
                errorMessage={validator.current.message(
                  'taskFrom',
                  selectTaskFrom,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                label="Status"
                asterisk="*"
                defaultValue={statusFilter}
                options={milestoneStatus}
                disabled={fromDate && toDate && selectTaskFrom?.value === 'milestone' ? false : true}
                onSelectHandler={(e) => { setStatusFilter(e) }}
                errorMessage={validator.current.message(
                  'status',
                  statusFilter,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                label="Milestones"
                asterisk="*"
                options={milestoneFilter}
                defaultValue={milestones}
                disabled={fromDate && toDate && fromDate && toDate && selectTaskFrom?.value === 'milestone' && statusFilter ? false : true}
                onSelectHandler={(e) => {
                  setMilestones(e)

                }}
                errorMessage={validator.current.message(
                  'milestone',
                  milestones,
                  'required'
                )}
              />
            </Col>
            <Col className='mt-4'>
              <Button variant="primary" onClick={(e) => {

                if (selectTaskFrom?.value === "non-milestone") {
                  validator.current.errorMessages.milestone = null
                  validator.current.fields.milestone = true
                  validator.current.errorMessages.status = null
                  validator.current.fields.status = true

                }
                if (!selectTaskFrom) {
                  validator.current.errorMessages.milestone = null
                  validator.current.fields.milestone = true
                  validator.current.errorMessages.status = null
                  validator.current.fields.status = true
                }

                if (validator.current.allValid()) {
                  validator.current.hideMessages()
                  handleFilter(e)
                  setSentButton(true)
                } else {
                  validator.current.showMessages()
                  forceUpdate(count + 1)
                  setSentButton(true)
                }

              }}>Get task list</Button>
              <Button variant="secondary" onClick={(e) => {
                validator.current.hideMessages()
                handleClear()
              }} className='ml-3'>Cancel</Button>
            </Col>
          </Row>
          <br />
          {filterStartDate && filterEndDate && (
            <>
              <div className="task-organizer-container">
                {Object.values(groupedTasks).map((group, index) => (
                  <div key={index} className="task-organizer-card">
                    <h3 className="task-organizer-milestone">
                      Milestone: {group.milestone_name}
                    </h3>
                    <ul className="task-organizer-list">
                      {group.tasks.map((task) => (
                        <li key={task.id} className="task-organizer-item">
                          <div className="task-organizer-field">
                            <strong>Task Name:</strong> {task.content}
                          </div>
                          <div className="task-organizer-field">
                            <strong>Status:</strong>
                            <span className={`task-organizer-status ${task.status.toLowerCase()}`}>
                              {task.status === "new" ? "Pending" : task.status}
                            </span>
                          </div>
                          <div className="task-organizer-field">
                            <strong>Responsible:</strong> {task.responsible}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {sentButton && statusFilter && (
                <button
                className="task-organizer-button"
                type="submit"
                onClick={handleSend}
              >
                Sent
              </button>)}
              {promptMessage && (
                <div className="task-organizer-prompt">
                  <h3>Prompt Message</h3>
                  <pre>{promptMessage}</pre>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ProjectWeeklyTask;
