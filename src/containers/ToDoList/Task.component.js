import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import {
  ModalInput,
  TextInput,
  Datepicker,
} from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const validator = new SimpleReactValidator();

function Task(props) {
  const [taskHrs, setTaskHours] = useState('');
  const [taskMins, setTaskMinutes] = useState('');
  const [taskStartTime, setTaskStartTime] = useState('');
  const [taskEndTime, setTaskEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [taskName, setTaskName] = useState('');
  const [count, forceUpdate] = useState(0);
  const [taskModalShow, setTaskModalShow] = useState(false);
  const [id, setId] = useState(null);

  const getTaskById = async (tid) => {
    const { data } = await AuthApi.getDataFromServer(`${Api.taskUrl}${tid}/`);
    if (data) {
      const dt = new Date();
      const startTm = data.data.start_time;
      console.log('startm', startTm);
      const hrmin = startTm.split(':');
      dt.setHours(hrmin[0]);
      dt.setMinutes(hrmin[1]);
      setTaskStartTime(dt);

      const dt1 = new Date();
      const endTm = data.data.end_time;
      console.log('endTm', endTm);
      const hrminNew = endTm.split(':');
      dt1.setHours(hrminNew[0]);
      dt1.setMinutes(hrminNew[1]);
      setTaskEndTime(dt1);

      const spent = data.data.estimation;
      console.log('spent', spent);
      const spentNew = spent.split('Hrs');

      const spent1 = spentNew[0] ? spentNew[0] : 0;
      const spentNewMins = spentNew[1].split('Mins');

      // const spent3 = spentNew[1] ? spentNew[1] : 0;
      setTaskHours(spent1);
      const spent2 = spentNewMins[0] ? spentNewMins[0] : 0;
      setTaskMinutes(spent2);

      setTaskName(data.data.content);
      setDescription(data.data.description);
    }
  };

  useEffect(() => {
    setTaskModalShow(props.show);
  });

  useEffect(() => {
    const taskId = localStorage.getItem('taskid');
    setId(taskId);
    if (props.edit) {
      getTaskById(taskId);
    }
  }, []);

  const onAddTask = async () => {
    const obj = {
      start_time: customFunctions.getTime(taskStartTime),
      end_time: customFunctions.getTime(taskEndTime),
      hours: Number(taskHrs),
      minutes: Number(taskMins),
      description,
      content: taskName,
      task_type: 'other',
    };
    let postData = {};
    if (!id) {
      postData = {
        tasks: [{ ...obj }],
      };
    }

    const callback = id ? AuthApi.putDataToServer : AuthApi.postDataToServer;
    const endPoint = id ? `${Api.taskUrl}${id}/` : Api.taskUrl;
    const { data } = await callback(endPoint, id ? obj : postData);

    if (data) {
      props.handleModalCLose(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setTaskStartTime();
          setTaskEndTime();
          setTaskHours();
          setTaskMinutes();
          setDescription();
          setTaskName();
          props.handleModalCLose(false);
          props.onChanges();
        }
      });
    } else {
      swal(data && data.message, '', 'error');
      props.handleModalCLose(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      onAddTask();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  const onTaskCancel = () => {
    setTaskStartTime();
    setTaskEndTime();
    setTaskHours();
    setTaskMinutes();
    setDescription();
    setTaskName();
    setId();
    setTaskModalShow(false);
    props.handleModalCLose(false);
    validator.hideMessages();
  };

  return (
    <>
      <ModalInput
        size="lg"
        centered
        show={taskModalShow}
        label="Add Task"
        id="contained-modal-title-vcenter"
        modalBody={
          <Form>
            <Row>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => setTaskName(e.target.value)}
                  label="Add Task Name"
                  asterisk="*"
                  labelIcon="images/add-task.svg"
                  containerClass="form-group"
                  type="text"
                  value={taskName}
                  placeholder="Enter Task Name"
                  errorMessage={validator.message(
                    'taskName',
                    taskName,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={2}>
                <Datepicker
                  className="form-control"
                  label="StartTime"
                  asterisk="*"
                  selected={taskStartTime}
                  onChange={(e) => {
                    setTaskStartTime(e);
                  }}
                  showTimeSelect="showTimeSelect"
                  showTimeSelectOnly="showTimeSelectOnly"
                  timeIntervals="1"
                  dateFormat="h:mm aa"
                  errorMessage={validator.message(
                    'Start Time',
                    taskStartTime,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <Datepicker
                  className="form-control"
                  label="EndTime"
                  asterisk="*"
                  selected={taskEndTime}
                  onChange={(e) => {
                    setTaskEndTime(e);

                    const taskStrtTime = new Date(e);

                    const taskEnTime = new Date(taskStartTime);
                    console.log('taskstarttime', taskStrtTime, taskEnTime);
                    let differenceInTasksTime =
                      Math.abs(taskEnTime.getTime() - taskStrtTime.getTime()) /
                      1000;

                    const taskHours =
                      Math.floor(differenceInTasksTime / 3600) % 24;
                    differenceInTasksTime -= taskHours * 3600;

                    const taskMinutes =
                      Math.floor(differenceInTasksTime / 60) % 60;
                    differenceInTasksTime -= taskMinutes * 60;
                    let taskHourDifference = '';
                    let taskMinDifference = '';
                    taskHourDifference +=
                      taskHours === 0 || taskHours === 1
                        ? `${taskHours} `
                        : `${taskHours} `;

                    taskMinDifference +=
                      taskMinutes === 0 || taskMinutes === 1
                        ? `${taskMinutes}`
                        : `${taskMinutes}`;
                    setTaskHours(taskHourDifference);
                    setTaskMinutes(taskMinDifference);
                  }}
                  showTimeSelect="showTimeSelect"
                  showTimeSelectOnly="showTimeSelectOnly"
                  timeIntervals="1"
                  dateFormat="h:mm aa"
                  errorMessage={validator.message(
                    'End Time',
                    taskEndTime,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <TextInput
                  label="Time Spent"
                  containerClass="form-group"
                  type="text"
                  value={`${taskHrs} Hrs ${taskMins} Mins`}
                />
              </Col>
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="" className="col-form-label">
                    Progress
                  </label>
                  <div className="progress-main">
                    <div className="progress">
                      <div
                        className="progress-bar bg-secondary"
                        role="progressbar"
                        style={{ width: '5%' }}
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        0%
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <TextInput
                  onInputChange={(e) => setDescription(e.target.value)}
                  label="Description"
                  containerClass="form-group"
                  type="textarea"
                  value={description}
                  placeholder="Enter Description"
                  errorMessage={validator.message(
                    'description',
                    description,
                    'required'
                  )}
                />
              </Col>
            </Row>
          </Form>
        }
        modalFooter={
          <div className="float-end">
            <Button variant="secondary" onClick={() => onTaskCancel()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-4"
              onClick={(e) => {
                onSubmit(e);
              }}
            >
              {id ? 'Update' : 'Add'}
            </Button>
          </div>
        }
      />
    </>
  );
}
export default withRouter(Task);
