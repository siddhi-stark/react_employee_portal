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
  Datepicker,
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
    label: 'Status',
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

function ToDoList() {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
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
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hrs, setHours] = useState('');
  const [min, setMinutes] = useState('');

  const [taskId, setTaskId] = useState(null);
  // const [staticStartTime, setStaticStartTime] = useState(new Date());
  // const [staticEndTime, setStaticEndTime] = useState(new Date());
  const [staticHrs, setStaticHours] = useState(''); // eslint-disable-line
  const [staticMin, setStaticMinutes] = useState(''); // eslint-disable-line
  const [showScrum, setShowScrum] = useState(false);
  const [showClockoutBtn, setShowClockoutBtn] = useState(false);
  const [showScrumPopup, setShowScrumPopup] = useState(false);
  const [showErrorBlock, setShowErrorBlock] = useState(false);
  const [showSuccessBlock, setShowSuccessBlock] = useState(false);
  const [type, setType] = useState('morning');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const [breakData, setBreakData] = useState([]);

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
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      setTaskList(data.data);

      const row = [];

      data.data.map((task) => {
        row.push({
          todo: (
            <>
              {task.content}
              <br />
              <div
                className={
                  task.is_overdue ? 'badge badge-danger' : 'badge badge-warning'
                }
              >
                {task.is_overdue ? 'Overdue' : 'Today'}
              </div>
            </>
          ),
          projects: task.project_name,
          status: task.status,
          eta: `${task.start_time} Hrs`,
          at: `${task.end_time} Hrs`,
          action: (
            <>
              {task.task_type === 'tw' && (
                <a
                  href={`${constants.link}${task.tw_id}`}
                  className="pl-2"
                  target="_blank"
                >
                  <Image src="images/edit.png" />
                </a>
              )}
              {task.task_type !== 'tw' && (
                <a
                  href="/"
                  className=""
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
                  <Image src="images/edit.png" />
                </a>
              )}
              <a
                href="/"
                className="ml-2"
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
      const selectedBreak = [];
      BreakList.map((item) => {
        if (item.id === 3 || item.id === 2) {
          selectedBreak.push({
            selectedBreakOption: { label: item.label, id: item.id },
            startTime: '',
            endTime: '',
            hrs: null,
            min: null,
            isDefault: true,
          });
        }
        return selectedBreak;
      });
      setBreakData(selectedBreak);

      getTableData(1);
      getDailyActivity();
    }
    getData();
    // setShowScrum(props.showScrum);
  }, []);

  useEffect(() => {
    getTableData(1);
  }, [cntClearFilter]);

  const getDailyActivity = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (data && data.data) {
      setShowScrum(data.data.morning_mail);
      setShowClockoutBtn(data.data.morning_mail);
    }
    if (data.data.clock_out_time) {
      localStorage.setItem('time', data.data.clock_out_time);
    }
  };

  const onSendScrum = async () => {
    const postData = {
      type,
      tasks: selectedRowIndex,
    };

    const endPoint = `${Api.reportUrl}`;
    const { data, message } = await AuthApi.postDataToServer(
      endPoint,
      postData
    );
    if (data) {
      setType('logout');
      setShowScrum(false);
      setShowBreak(false);
      setShowErrorBlock(false);
      setShowSuccessBlock(true);
    } else {
      setShowScrumPopup(false);
      setShowErrorBlock(true);
      setShowSuccessBlock(false);
      swal(message, '', 'error');
    }
    getDailyActivity();
  };

  const addBreak = () => {
    return setBreakData([
      ...breakData,
      {
        selectedBreakOption: '',
        startTime: '',
        endTime: '',
        hrs: null,
        mins: null,
        isDefault: false,
      },
    ]);
  };

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
    const BreakPostData = [];
    breakData.map((dt) => {
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
      data.data.task_created_ids.map((e) => {
        selectedRowIndex.push(e);
        return e;
      });
      setType('logout');
      setSelectedRowIndex(selectedRowIndex);
      setHours();
      setMinutes();
      setSelectedBreakOption();
      setStartTime();
      setEndTime();
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

  const onSubmit = (e) => {
    e.preventDefault();
    if (selectedRowIndex.length > 0) {
      onSendScrum();
    } else {
      swal('Please Select Task', '', 'error');
    }
  };

  const onBreakSubmit = (e) => {
    e.preventDefault();
    if (startTime && endTime) {
      // setShowBreak(false);
      onComfirm();
      setStartTime('');
      setEndTime('');
      setHours('');
      setMinutes('');
    } else {
      setShowBreak(false);
      swal('Please Select Break', '', 'error');
      onComfirm();
      setStartTime('');
      setEndTime('');
      setHours('');
      setMinutes('');
    }
  };

  const onDeleteBreakHandler = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = [...breakData];
    data.splice(idx, 1);
    setBreakData([...data]);
  };

  return (
    <>
      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to delete the task ?"
          error
          showCancel
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
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

      {showErrorBlock && (
        <div className="p-3 mb-2 bg-danger text-white mt-4 bg-danger-main table-red-bg">
          <div className="img-text">
            <img src="images/fail.svg" alt="Success" /> Report Sent Failed !!
          </div>
          <div className="close">
            <button
              type="button"
              className="close"
              onClick={() => setShowErrorBlock(false)}
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      )}

      {showSuccessBlock && (
        <div className="p-3 mb-2 bg-success text-white mt-4 bg-success-main">
          <div className="img-text">
            <img src="images/success.svg" alt="Success" /> Report Sent
            Successfully
          </div>
          <div className="close">
            <button
              type="button"
              className="close"
              onClick={() => setShowSuccessBlock(false)}
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      )}

      <Card className="mt-3">
        <Card.Body>
          <Row>
            <div className="custom-header-wrapper">
              <Col>
                <Card.Title className="card-title h5 d-flex align-items-center justify-content-between">
                  To Do
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
                </Card.Title>
              </Col>
            </div>

            <Col className="mt-3">
              <Table
                tableClass="table table-striped"
                columns={columns}
                rows={rows}
                showPagination
                showCheckbox
                paginationProps={{
                  ...pagination,
                  activePage: pagination.current_page,
                  onPageChange: (pageNo) => {
                    getTableData(pageNo);
                  },
                }}
                dropdownContainerClass="mb-3"
                selectedRowItems={selectedId}
                onSelectRowsIndexes={(rowIndex) => {
                  const twId = [];
                  taskList.map((task, ind) => {
                    rowIndex.map((i) => {
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
                  setSelectedId(rowIndex);
                }}
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-end mr-3">
            {!showScrum && (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => {
                  setShowScrumPopup(true);
                }}
              >
                Send Scrum
              </Button>
            )}
            {!showClockoutBtn && showScrum && (
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
            {/* <div className="d-flex align-items-center justify-content-between skip-type mb-1 mt-2">
              <label htmlFor="exampleFormControlSelect1">
                Break Type <sup className="text-danger">*</sup>
              </label>
              <div className="skip-form">
                <a
                  href="/"
                  className="pl-2"
                  onClick={(e) => {
                    setShowSkipBreak(true);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <img src="images/skip.svg" alt="skip" />
                </a>
              </div>
            </div> */}
            {/* <Row>
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
            </Row> */}
            {/* <Row>
              <Col sm={4}>
                <Datepicker
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
                <Datepicker
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
                  value={`${hrs} : ${min}`}
                />
              </Col>
            </Row> */}
            {breakData &&
              breakData.length > 0 &&
              breakData.map((data, i) => (
                <>
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
                      {breakData.length > 1 && (
                        <a
                          href="/"
                          onClick={(e) => {
                            onDeleteBreakHandler(i, e);
                          }}
                        >
                          <img src="images/delete.png" alt="delete" />
                        </a>
                      )}
                    </div>
                  </div>
                  <Row>
                    <DropdownInput
                      options={getBreakTypes()}
                      asterisk="*"
                      defaultValue={data.selectedBreakOption}
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
                      <Datepicker
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
                      <Datepicker
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
                        value={`${hrs}: ${min}`}
                      />
                    </Col>
                  </Row>
                </>
              ))}
          </Form>
        }
        modalFooter={
          <div className="float-end">
            <Button variant="secondary" onClick={(e) => onBreakSubmit(e)}>
              Confirm
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-4"
              onClick={(e) => {
                onSendScrum(e);
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
                  setShowScrumPopup(false);
                  // setType('morning')
                  onSubmit(e);
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
