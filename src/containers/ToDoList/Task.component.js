import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { setHours, setMinutes } from 'date-fns';
import customFunctions from '../../helper/customFunctions';
import { ModalInput, TextInput, Datepicker } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function Task(props) {
  const validator = useRef(new SimpleReactValidator());
  // const [taskHrs, setTaskHours] = useState('');
  // const [taskMins, setTaskMinutes] = useState('');
  // const [taskStartTime, setTaskStartTime] = useState('');
  // const [taskEndTime, setTaskEndTime] = useState('');
  // const [description, setDescription] = useState('');
  // const [taskName, setTaskName] = useState('');
  const [count, forceUpdate] = useState(0);
  const [taskModalShow, setTaskModalShow] = useState(false);
  // const [progressValue, setProgressValue] = useState(0);
  const [id, setId] = useState(null);
  // const [startHours, setStartHours] = useState('');
  // const [startMinutes, setStartMinutes] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  const [taskList, setTaskList] = useState([]);

  const defaultTask = {

    id: '',
    taskStartTime: '',
    taskEndTime: '',
    description: '',
    taskName: '',
    progressValue: '',
    startHours: '',
    startMinutes: '',
    taskHrs: '',
    taskMins: '',

  };

  const getTaskById = async (tid) => {
    const { data } = await AuthApi.getDataFromServer(`${Api.taskUrl}${tid}/`);
    if (data) {
      const dt = new Date();
      const startTm = data.data.start_time;
      const hrmin = startTm.split(':');
      dt.setHours(hrmin[0]);
      dt.setMinutes(hrmin[1]);
      taskList[0].id = tid;
      taskList[0].startHours = dt.getHours();
      taskList[0].startMinutes = dt.getMinutes();
      taskList[0].taskStartTime = dt;

      const dt1 = new Date();
      const endTm = data.data.end_time;
      const hrminNew = endTm.split(':');
      dt1.setHours(hrminNew[0]);
      dt1.setMinutes(hrminNew[1]);
      taskList[0].taskEndTime = dt1;

      const spent = data.data.estimation;
      const spentNew = spent.split('Hrs');

      const spent1 = spentNew[0] ? spentNew[0] : 0;
      const spentNewMins = spentNew[0].split('Mins');

      taskList[0].taskHrs = spent1;
      const spent2 = spentNewMins[0] ? spentNewMins[0] : 0;
      taskList[0].taskMins = spent2;

      taskList[0].taskName = data.data.content;
      taskList[0].description = data.data.description;
      taskList[0].progressValue = Number(data.data.progress);
      setTaskList([...taskList])
    }
  };

  useEffect(() => {
    setTaskModalShow(props.show);
    setTaskList([
      defaultTask
    ])

    const taskId = customFunctions.getLocalStorage('taskid');
    if (taskId)
      setId(taskId);

    return (() => {
      setId('')
    });

  }, []);

  useEffect(() => {
    if (props.edit && id) {
      getTaskById(id);
    }
  }, [id]);

  const onAddTask = async () => {
    const selectedTask = [];

    taskList.map((task) => {

      const obj = {
        start_time: customFunctions.getTime(task.taskStartTime),
        end_time: customFunctions.getTime(task.taskEndTime),
        hours: Number(task.taskHrs),
        minutes: Number(task.taskMins),
        description: task.description,
        content: task.taskName,
        progress: Number(task.progressValue),
        task_type: 'other',
      };
      selectedTask.push(obj);
      return obj;
    })

    let postData = {};

    if (!id) {
      postData = {
        tasks: selectedTask,
      };
    }

    const payload = customFunctions.cleanObject(postData);

    const callback = id ? AuthApi.putDataToServer : AuthApi.postDataToServer;
    const endPoint = id ? `${Api.taskUrl}${id}/` : Api.taskUrl;
    const { data } = await callback(endPoint, id ? selectedTask[0] : payload);

    if (data) {
      props.handleModalCLose(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setDisableButton(false);
          // setTaskStartTime();
          // setTaskEndTime();
          // setTaskHours();
          // setTaskMinutes();
          // setDescription();
          // setTaskName();
          setTaskList([]);
          props.handleModalCLose(false);
          props.onChanges();
        }
      });
    } else {
      setDisableButton(false);
      swal(data && data.message[0], '', 'error');
      props.handleModalCLose(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      onAddTask();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  const onTaskCancel = () => {
    validator.current.hideMessages();

    // setTaskStartTime();
    // setTaskEndTime();
    // setTaskHours();
    // setTaskMinutes();
    // setDescription();
    // setTaskName();
    // setId();
    setTaskList([]);
    setTaskModalShow(false);
    props.handleModalCLose(false);
  };

  const addMoreTask = () => {
    setTaskList([...taskList, defaultTask]);
  }

  const onDeleteTask = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = [...taskList];
    data.splice(idx, 1);
    setTaskList([...data]);
  };

  return (
    <>
      <ModalInput
        size="lg"
        centered
        onHide={onTaskCancel}
        show={taskModalShow}
        label={id ? 'Update Task' : 'Add Task'}
        id="contained-modal-title-vcenter"
        modalBody={
          <Form
            onSubmit={(e) => {
              submitForm(e);
            }}
          >
            {
              !id && (
                <div className="add-break d-flex align-items-center justify-content-between">
                  <h3 className="mb-1">{'  '}</h3>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => addMoreTask()}
                  >
                    Add Task
                </button>
                </div>
              )
            }
            {taskList.map((data, i) => (
              <>
                <Row>
                  <Col sm={6}>
                    <TextInput
                      onInputChange={(e) => {
                        taskList[i].taskName = e.target.value;
                        setTaskList([...taskList])
                      }}

                      label="Add Task Name"
                      asterisk="*"
                      id={`taskName${i + 1}`}
                      labelIcon="images/add-task.svg"
                      containerClass="form-group"
                      type="text"
                      value={data.taskName}
                      placeholder="Enter Task Name"
                      errorMessage={validator.current.message(
                        `task name`,
                        data.taskName,
                        'required'
                      )}
                    />

                  </Col>
                  <Col sm={6}>
                    <TextInput
                      // onInputChange={(e) => setDescription(e.target.value)}
                      onInputChange={(e) => {
                        taskList[i].description = e.target.value;
                        setTaskList([...taskList])
                      }}

                      label="Description"
                      containerClass="form-group"
                      asterisk="*"
                      as="textarea"
                      id={`description${i + 1}`}
                      row="30"
                      cols="50"
                      style={{ resize: 'none' }}
                      value={data.description}
                      placeholder="Enter Description"
                      errorMessage={validator.current.message(
                        `description`,
                        data.description,
                        'required'
                      )}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}>
                    <Datepicker
                      className="form-control"
                      label="Start Time"
                      asterisk="*"
                      id={`taskStartTime${i + 1}`}
                      selected={data.taskStartTime}
                      onChange={(e) => {
                        taskList[i].taskStartTime = e;
                        taskList[i].taskEndTime = '';
                        taskList[i].taskHrs = '';
                        taskList[i].taskMins = '';
                        taskList[i].startHours = e.getHours();
                        taskList[i].startMinutes = e.getMinutes();
                        setTaskList([...taskList])
                      }}
                      // onChange={(e) => {
                      //   setTaskStartTime(e);
                      //   setTaskEndTime('')
                      //   setStartHours(e.getHours());
                      //   setStartMinutes(e.getMinutes());
                      //   setTaskHours('');
                      //   setTaskMinutes('');
                      // }}

                      showTimeSelect="showTimeSelect"
                      showTimeSelectOnly="showTimeSelectOnly"
                      timeIntervals="1"
                      dateFormat="h:mm aa"
                      errorMessage={validator.current.message(
                        `task start time`,
                        data.taskStartTime,
                        'required'
                      )}
                    />
                  </Col>
                  <Col sm={2}>
                    <Datepicker
                      className="form-control"
                      label="End Time"
                      asterisk="*"
                      id={`taskEndTime${i + 1}`}
                      format="HH:mm"
                      excludeOutOfBoundTimes
                      selected={data.taskEndTime}
                      minDate={new Date(data.taskStartTime)}
                      minTime={setHours(
                        setMinutes(new Date(), parseInt(data.startMinutes, 10) + 1),
                        parseInt(data.startMinutes, 10) > 58 ? parseInt(data.startHours, 10) + 1 : data.startHours
                      )}
                      maxTime={setHours(setMinutes(new Date(), 59), 23)}
                      onChange={(e) => {
                        taskList[i].taskEndTime = e;
                        taskList[i].taskHrs = '';
                        taskList[i].taskMins = '';
                        if (e && data.taskStartTime) {
                          const tEndTime = new Date(e);
                          const tStartTime = new Date(data.taskStartTime);
                          const diffMs = (tEndTime - tStartTime);
                          const { hours: diffHrs, minutes: diffMins } = customFunctions.msToTime(diffMs);
                          taskList[i].taskHrs = `${diffHrs}`;
                          taskList[i].taskMins = `${diffMins}`;
                        }
                        setTaskList([...taskList]);
                      }}
                      showTimeSelect="showTimeSelect"
                      showTimeSelectOnly="showTimeSelectOnly"
                      timeIntervals="1"
                      dateFormat="h:mm aa"
                      errorMessage={validator.current.message(
                        `task end time`,
                        data.taskEndTime,
                        'required'
                      )}
                    />
                  </Col>
                  <Col sm={2}>
                    <TextInput
                      label="Time Spent"
                      containerClass="form-group"
                      type="text"
                      id={`timeSpent${i + 1}`}
                      value={`${data.taskHrs} Hrs ${data.taskMins} Mins`}
                    />
                  </Col>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="" className="col-form-label">
                        Progress
                  </label>
                      <div className="progress-main">
                        <div className="progress">
                          <div className="progress-bar bg-secondary w-100">
                            <h5 className="justify-content-start">
                              Set Progress: {data.progressValue}%{' '}
                            </h5>
                            <input
                              type="range"
                              id={`progress${i + 1}`}
                              name="rangeInput"
                              min="0"
                              max="100"
                              value={Number(data.progressValue)}
                              onChange={(e) => {
                                taskList[i].progressValue = e.target.value;
                                setTaskList([...taskList])
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="skip-form float-end">
                      {!id && taskList.length > 1 && (
                        <>
                          <a
                            href="/"
                            onClick={(e) => {
                              onDeleteTask(i, e);
                            }}
                          >
                            <img
                              src="images/delete.png"
                              className="ml-2"
                              alt="delete"
                            />
                          </a>
                          <hr />
                        </>
                      )}
                    </div>
                  </Col>
                </Row>

              </>

            ))
            }
            <div className="float-end">
              <Button variant="secondary" onClick={() => onTaskCancel()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ms-4"
                disabled={disableButton}
              >
                {id ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        }
      />
    </>
  );
}
export default withRouter(Task);
