import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Image } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import customFunctions from '../../helper/customFunctions';
import {
  ModalInput,
  TextInput,
  DropdownInput,
  DateTimerInput,
} from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import constants from '../../helper/constant';
import Task from './Task.component';

const columns = [
  {
    id: 'todo',
    label: 'To Do Tasks',
  },
  {
    id: 'projects',
    label: 'Projects',
  },
  {
    id: 'status',
    label: 'status',
  },
  {
    id: 'eta',
    label: 'ETA',
  },
  {
    id: 'at',
    label: 'AT',
  },
  {
    id: 'action',
    label: 'Action',
  },
];

const validator = new SimpleReactValidator();

function ToDoList(props) {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [showSkipBreak, setShowSkipBreak] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [index, setIndex] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [ShowDelete, setShowDelete] = useState(false);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [selectedBreakOption, setSelectedBreakOption] = useState(null);
  const [startTime, setStartTime] = useState(new Date()); //eslint-disable-line
  const [endTime, setEndTime] = useState(new Date()); //eslint-disable-line
  // const [timeSpent, setTimeSpent] = useState(''); //eslint-disable-line
  const [hrs, setHours] = useState(''); //eslint-disable-line
  const [min, setMinutes] = useState(''); //eslint-disable-line

  const [taskId, setTaskId] = useState(null);
  const [staticStartTime, setStaticStartTime] = useState(new Date()); //eslint-disable-line
  const [staticEndTime, setStaticEndTime] = useState(new Date()); //eslint-disable-line
  const [staticHrs, setStaticHours] = useState(''); //eslint-disable-line
  const [staticMin, setStaticMinutes] = useState(''); //eslint-disable-line
  const [showScrum, setShowScrum] = useState(false);
  const [showClockoutBtn, setShowClockoutBtn] = useState(false);
  const [showScrumPopup, setShowScrumPopup] = useState(false);
  const [isOverdue, setIsOverdue] = useState('');
  // const [type, setType] = useState('morning');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const [breakData, setBreakData] = useState([
    {
      selectedBreakOption: '',
      startTime: '',
      endTime: '',
      hrs: null,
      min: null,
    },
  ]);

  const BreakList = [
    {
      id: 1,
      label: 'Lunch Break',
    },
    {
      id: 2,
      label: 'Morning Refreshment',
    },
    {
      id: 3,
      label: 'Evening Refreshment',
    },
    {
      id: 4,
      label: 'Infrastructure',
    },
    {
      id: 5,
      label: 'Other',
    },
  ];

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.taskUrl}?page=${page}&limit=${pagination.itemsPerPage}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      setTaskList(data.data);

      const row = [];

      data.data.map((task) => {
        setIsOverdue(task.is_overdue);
        row.push({
          todo: task.content,
          projects: task.project_name,
          status: task.status,
          eta: task.start_time,
          at: task.end_time,
          action: (
            <>
              {task.task_type === 'tw' && (
                <a href={`${constants.link}${task.tw_id}`} className="pl-2">
                  <Image src="images/edit.svg" />
                </a>
              )}
              {task.task_type !== 'tw' && (
                <a
                  href="/"
                  className="pl-2"
                  onClick={(e) => {
                    setModalShow(true);
                    setEditShow(true);
                    e.preventDefault();
                    e.stopPropagation();
                    setTaskId(task.id);
                    setCntClearFilter(cntClearFilter + 1);
                    localStorage.setItem('taskid', task.id);
                  }}
                >
                  <Image src="images/edit.svg" />
                </a>
              )}
              <a
                href="/"
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDelete(true);
                  setTaskId(task.id);
                }}
              >
                {task.tw_id ? '' : <Image src="images/delete.png" />}
              </a>
            </>
          ),
        });
        return task;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    async function getData() {
      getTableData(1);
    }
    getData();
    setShowScrum(props.showScrum);
  }, []);

  useEffect(() => {
    getTableData(1);
  }, [cntClearFilter]);

  // const getBreakList = () => {
  //   console.log('breaklist', BreakList);
  //   if (!BreakList) return [];
  //   const breakListOptions = [];
  //   BreakList.map((mat) => {
  //     console.log('mat',mat);
  //     return breakListOptions.push({
  //       label: mat.name,
  //       id: mat.id,
  //     });
  //   });
  //   return breakListOptions;
  // };

  const getDailyActivity = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (data) {
      console.log('data', data.data);
      if (data.data.signout_mail === false) {
        setShowClockoutBtn(true);
      } else {
        setShowClockoutBtn(false);
      }
    }
  };

  const onSendScrum = async () => {
    console.log('selectedINdex', selectedRowIndex);
    const postData = {
      type: 'morning',
      tasks: selectedRowIndex,
    };

    const endPoint = `${Api.reportUrl}`;
    const { data } = await AuthApi.postDataToServer(endPoint, postData);

    if (data) {
      console.log('setshowpopup');
      setShowBreak(false);
      swal(data && data.message[0], '', 'success');
      setShowBreak(false);
    } else {
      // swal(message, '', 'error');
      setShowScrumPopup(false);
    }
    getDailyActivity();
  };

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   if (validator.allValid()) {
  //     onSendScrum();
  //   } else {
  //     validator.showMessages();
  //     forceUpdate(count + 1);
  //   }
  // };

  // const addBreak = () => {
  //   // console.log('addbreakkkkkkkkkkkkkkkk');
  //   const list = breakData;
  //   list.push({
  //     selectedBreakOption: '',
  //     startTime: '',
  //     endTime: '',
  //     timeSpend: '',
  //   });
  //   // console.log('list', list);
  //   setBreakData([...list]);
  // };

  const addBreak = () => {
    return setBreakData([
      ...breakData,
      { selectedBreakOption: '', startTime: '', endTime: '', timeSpent: '' },
    ]);
  };

  // const handleInputChange = (event, idx) => {
  //   // console.log('breakData', breakData);
  //   // console.log('idx', idx);
  //   // console.log('event', event);
  //   const { name, value } = event.target;
  //   // console.log('name', name, value);
  //   breakData[idx][name] = value;
  //   // console.log('breakData', breakData[idx]);

  //   setBreakData([...breakData]);
  //   // setBreakData((inputValues) => {
  //   //   return { ...inputValues, [name]: value };
  //   // });
  // };

  const getBreakTypes = () => {
    if (!BreakList) return [];
    const BreakTypes = [];
    BreakList.map((sub) => {
      return BreakTypes.push({
        label: sub.label,
        id: sub.id,
      });
    });
    return BreakTypes;
  };

  const onComfirm = async () => {
    // console.log('static', staticHrs, staticMin, staticStartTime, staticEndTime, selectedBreakOption);
    const BreakPostData = [];
    breakData.map((dt) => {
      // const hr = Number(dt.hrs);
      return BreakPostData.push({
        description: dt.selectedBreakOption.label,
        start_time: customFunctions.getTime(dt.startTime),
        end_time: customFunctions.getTime(dt.endTime),
        hours: Number(dt.hrs),
        minutes: Number(dt.min),
        task_type: 'Break',
      });
    });
    const postData = {
      tasks: BreakPostData,
    };
    const endPoint = `${Api.taskUrl}`;
    const { data } = await AuthApi.postDataToServer(endPoint, postData);
    if (data) {
      console.log('breakresponseData', data.data.task_created_ids);
      data.data.task_created_ids.map((e) => {
        console.log('eeee', e);
        selectedRowIndex.push(e);
        return e;
      });
      setSelectedRowIndex(data.data.task_created_ids);
      setHours();
      setMinutes();
      setSelectedBreakOption();
      setStartTime();
      setEndTime();
      console.log('generatedIds', selectedRowIndex);
    }
  };

  const deleteTask = async (id) => {
    const { data } = await AuthApi.deleteDataFromServer(`${Api.taskUrl}${id}/`);
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setShowDelete(false);
          setTaskId(null);
          getTableData(1);
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };

  const onChangeInTask = () => {
    getTableData(1);
  };

  return (
    <>
      {console.log('showScrum', showScrum)}
      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to delete the task ?"
          error
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            deleteTask(taskId);
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You wont be able to revert this!
        </SweetAlert>
      )}

      <Card>
        <Card.Body>
          <Row>
            <Row>
              <Col>
                <h4>ToDo</h4>
              </Col>
              <Col>
                <div className="float-end">
                  <Button
                    size="sm"
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      localStorage.removeItem('taskid');
                      setModalShow(true);
                      forceUpdate(count + 1);
                    }}
                  >
                    Add Task
                  </Button>
                </div>
              </Col>
            </Row>

            <Col className="mt-3">
              <Table
                tableClass="table table-striped"
                columns={columns}
                rows={rows}
                showPagination
                overDueClass={
                  isOverdue ? (
                    <span className="badge badge-danger">Danger</span>
                  ) : (
                    ''
                  )
                }
                showCheckbox
                paginationProps={{
                  ...pagination,
                  onPageChange: (pageNo) => {
                    getTableData(pageNo);
                  },
                }}
                selectedRowItems={selectedRowIndex}
                // onSelectRowsIndexes={(indexes) => {
                //   console.log('indexes',indexes);
                // }}
                onSelectRowsIndexes={(rowIndex) => {
                  // console.log('ids', rowIndex )
                  const twId = [];
                  taskList.map((task, ind) => {
                    // console.log('twid', task);
                    // console.log('ind', ind);
                    // console.log('rowIndex', rowIndex);
                    rowIndex.map((i) => {
                      // console.log('i',i);
                      // console.log(ind===i);
                      if (ind === i) {
                        if (task.task_type === 'tw') {
                          twId.push(task.tw_id);
                        } else {
                          twId.push(task.id);
                        }
                      }
                      return i;
                    });

                    return ind;
                  });
                  setSelectedRowIndex(twId);
                }}
               
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-end mr-3">
            {showScrum && (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => {
                  // onSendScrum();
                  setShowScrumPopup(true);
                }}
              >
                Send Scrum
              </Button>
            )}
            {showClockoutBtn && (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => {
                  setShowBreak(true);
                }}
              >
                Clockout & Send Report
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
      {modalShow && (
        <Task
          show={modalShow}
          edit={editShow}
          handleModalCLose={(e) => setModalShow(e)}
          onChanges={() => {
            onChangeInTask();
          }}
        />
      )}
      <ModalInput
        size="md"
        centered
        show={showBreak}
        label={<Button variant="primary">Add Break</Button>}
        id="contained-modal-title-vcenter"
        modalBody={
          <Form>
            <div className="add-break d-flex align-items-center justify-content-between">
              <h3 className="mb-1">Add Break</h3>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addBreak()}
              >
                Add Break
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between skip-type mb-1 mt-2">
              <label htmlFor="exampleFormControlSelect1">
                Break Type <sup className="text-danger">*</sup>
              </label>
              <div className="skip-form">
                <a
                  href="/"
                  className="pl-2"
                  onClick={(e) => {
                    // setIndex(i);
                    setShowSkipBreak(true);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <img src="images/skip.svg" alt="skip" />
                </a>
              </div>
            </div>
            <Row>
              <DropdownInput
                options={getBreakTypes()}
                asterisk="*"
                value={selectedBreakOption}
                onSelectHandler={(select) => {
                  setSelectedBreakOption(select);
                }}
                errorMessage={validator.message(
                  'selectedBreakOption',
                  selectedBreakOption,
                  'required'
                )}
              />
            </Row>
            <Row>
              <Col sm={4}>
                <DateTimerInput
                  className="form-control"
                  label="StartTime"
                  selected={staticStartTime}
                  onChange={(e) => {
                    setStaticStartTime(e);
                  }}
                  showTimeSelect="showTimeSelect"
                  showTimeSelectOnly="showTimeSelectOnly"
                  timeIntervals="1"
                  dateFormat="h:mm aa"
                />
              </Col>
              <Col md={4}>
                <DateTimerInput
                  className="form-control"
                  label="EndTime"
                  selected={staticEndTime}
                  onChange={(e) => {
                    setStaticEndTime(e);
                    const endTimeNew = new Date(e);
                    const startTimeNew = new Date(startTime);
                    let differenceInTime =
                      Math.abs(endTimeNew.getTime() - startTimeNew.getTime()) /
                      1000;

                    const hours = Math.floor(differenceInTime / 3600) % 24;
                    differenceInTime -= hours * 3600;

                    const minutes = Math.floor(differenceInTime / 60) % 60;
                    differenceInTime -= minutes * 60;
                    let hourDifference = '';
                    let minDifference = '';
                    hourDifference +=
                      hours === 0 || hours === 1 ? `${hours} ` : `${hours} `;

                    minDifference +=
                      minutes === 0 || hours === 1
                        ? `${minutes}`
                        : `${minutes}`;
                    setStaticHours(hourDifference);
                    setStaticMinutes(minDifference);
                  }}
                  showTimeSelect="showTimeSelect"
                  showTimeSelectOnly="showTimeSelectOnly"
                  timeIntervals="1"
                  dateFormat="h:mm aa"
                />
              </Col>
              <Col md={4}>
                <TextInput
                  label="Time Spent"
                  containerClass="form-group"
                  type="text"
                  disabled
                  name="designationtitle"
                  value={hrs + ':' + min} // eslint-disable-line
                />
              </Col>
            </Row>
            {breakData &&
              breakData.length > 0 &&
              breakData.map((data, i) => (
                <>
                  {/* {console.log('dataaa', data)} */}

                  <div className="d-flex align-items-center justify-content-between skip-type mb-1 mt-2">
                    <label htmlFor="exampleFormControlSelect1">
                      Break Type <sup className="text-danger">*</sup>
                    </label>
                    <div className="skip-form">
                      <a
                        href="/"
                        className="pl-2"
                        onClick={(e) => {
                          setIndex(i);
                          setShowSkipBreak(true);
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <img src="images/skip.svg" alt="skip" />
                      </a>
                    </div>
                  </div>
                  <Row>
                    <DropdownInput
                      options={getBreakTypes()}
                      asterisk="*"
                      value={data.selectedBreakOption}
                      onSelectHandler={(select) => {
                        breakData[i].selectedBreakOption = select;
                        setSelectedBreakOption(breakData);
                      }}
                      errorMessage={validator.message(
                        'selectedBreakOption',
                        selectedBreakOption,
                        'required'
                      )}
                    />
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <DateTimerInput
                        className="form-control"
                        label="StartTime"
                        selected={startTime}
                        onChange={(e) => {
                          breakData[i].startTime = e;
                          setStartTime(e);
                        }}
                        showTimeSelect="showTimeSelect"
                        showTimeSelectOnly="showTimeSelectOnly"
                        timeIntervals="1"
                        dateFormat="h:mm aa"
                      />
                    </Col>
                    <Col md={4}>
                      <DateTimerInput
                        className="form-control"
                        label="EndTime"
                        selected={endTime}
                        onChange={(e) => {
                          breakData[i].endTime = e;
                          setEndTime(e);
                          const endTimeNew = new Date(e);
                          const startTimeNew = new Date(startTime);
                          let differenceInTime =
                            Math.abs(
                              endTimeNew.getTime() - startTimeNew.getTime()
                            ) / 1000;

                          const hours =
                            Math.floor(differenceInTime / 3600) % 24;
                          differenceInTime -= hours * 3600;

                          const minutes =
                            Math.floor(differenceInTime / 60) % 60;
                          differenceInTime -= minutes * 60;
                          let hourDifference = '';
                          let minDifference = '';
                          hourDifference +=
                            hours === 0 || hours === 1
                              ? `${hours} `
                              : `${hours} `;

                          minDifference +=
                            minutes === 0 || hours === 1
                              ? `${minutes}`
                              : `${minutes}`;
                          breakData[i].hrs = hourDifference;
                          breakData[i].min = minDifference;
                          setHours(hourDifference);
                          setMinutes(minDifference);
                        }}
                        showTimeSelect="showTimeSelect"
                        showTimeSelectOnly="showTimeSelectOnly"
                        timeIntervals="1"
                        dateFormat="h:mm aa"
                      />
                    </Col>
                    <Col md={4}>
                      <TextInput
                        label="Time Spent"
                        containerClass="form-group"
                        type="text"
                        disabled
                        name="designationtitle"
                        value={hrs + ':' + min} // eslint-disable-line
                      />
                    </Col>
                  </Row>
                </>
              ))}
          </Form>
        }
        modalFooter={
          <div className="float-end">
            <Button variant="secondary" onClick={() => onComfirm()}>
              Confirm
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-4"
              onClick={(e) => {
                onSendScrum(e);
                // setType('logout');
              }}
            >
              Send Report
            </Button>
          </div>
        }
      />
      <ModalInput
        size="sm"
        centered
        className="send-report-confirm"
        show={showScrumPopup}
        id="contained-modal-title-vcenter"
        closeButton="closeButton"
        modalBody={
          <>
            <img
              src="images/send-report.svg"
              style={{ height: '40px', textAlign: 'center' }}
              alt="Send Report"
            />
            <h5>Are you sure ?</h5>
            <div className="light-bg buttons d-flex align-items-center mb-1 mt-3 justify-content-between">
              <button
                type="button"
                className="btn btn-secondary mr-3"
                onClick={(e) => {
                  setShowScrumPopup(false);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSendScrum();
                  // setShowScrumPopup(true);
                }}
              >
                Yes
              </button>
            </div>
          </>
        }
      />
      <ModalInput
        size="sm"
        centered
        className="send-report-confirm"
        show={showSkipBreak}
        id="contained-modal-title-vcenter"
        closeButton="closeButton"
        modalBody={
          <>
            <img
              src="images/skip-image.svg"
              style={{ height: '40px', textAlign: 'center' }}
              alt="Send Report"
            />
            <h5>
              Are you sure you want to <br /> Skip Break?
            </h5>
            <div className="light-bg buttons d-flex align-items-center mb-1 mt-3 justify-content-between">
              <button
                type="button"
                className="btn btn-secondary mr-3"
                onClick={(e) => {
                  setShowSkipBreak(false);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // console.log('breakdata', breakData);
                  setShowSkipBreak(false);
                  breakData.splice(index, 1);
                  setBreakData(breakData);
                }}
              >
                Yes
              </button>
            </div>
          </>
        }
      />
    </>
  );
}

export default withRouter(ToDoList);
