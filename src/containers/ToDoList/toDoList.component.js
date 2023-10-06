import { setHours, setMinutes } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import {
  Datepicker,
  DropdownInput,
  ModalInput,
  TextInput,
} from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Table from '../../components/ReactTable/simpletable.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import constants from '../../helper/constant';
import customFunctions from '../../helper/customFunctions';
import SharedService from '../../services/SharedService/sharedServices';
import Task from './Task.component';

const validator = new SimpleReactValidator();

function ToDoList(props) {
  const { onMorningSendScrum, onClockoutReport, callback, pmsId } = props;

  const hrsProps = props;
  const totalHours = hrsProps.totalHrs;
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showSkipBreak, setShowSkipBreak] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [index, setIndex] = useState(null);
  const [ShowDelete, setShowDelete] = useState(false);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [selectedBreakOption, setSelectedBreakOption] = useState(null); // eslint-disable-line
  const [userRole, setUserRole] = useState('');

  const [taskId, setTaskId] = useState(null);
  const [morningMail, setMorningMail] = useState(false);
  const [signOutMail, setSignOutMail] = useState(false);
  const [showScrumPopup, setShowScrumPopup] = useState(false);
  const [showErrorBlock, setShowErrorBlock] = useState(false);
  const [showSuccessBlock, setShowSuccessBlock] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [clockInDate, setClockInDate] = useState('');
  const [timeHour, setTimeHour] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [showSendReport, setShowSendReport] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  // const [pmsId, setPmsId] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'id',
      label: 'Id',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      isDisplay: false,
    },
    {
      id: 'twId',
      label: 'twId',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      isDisplay: false,
    },
    {
      id: 'taskType',
      label: 'taskType',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      isDisplay: false,
    },

    {
      id: 'todo',
      label: 'To Do Tasks',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'projects',
      label: 'Projects',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'eta',
      label: 'ETA',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'progress',
      label: 'Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: ({ progress, id, indexOf, eta, status, twId, at }) => {
        const newAt = at ? `${at}` : '0 Hrs';
        return (
          <>
            {progress === 100 ? (
              <span>
                {status}({twId ? newAt : eta})
              </span>
            ) : (
              <div className="progress-bar-dashboard">
                <div className="progress-main">
                  <div className="progress">
                    <div className="progress-bar bg-secondary w-100">
                      <h5 className="justify-content-start">{progress}% </h5>
                      <input
                        type="range"
                        id={`progress${id + 1}`}
                        name="rangeInput"
                        min="0"
                        max="100"
                        value={Number(progress)}
                        onChange={(e) => {
                          rows[indexOf].progress = e.target.value;
                          setTimeout(() => {
                            setRows([...rows]);
                          }, 500);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: ({ id, twId, taskType }) => {
        return (
          <span className="d-flex">
            {taskType === 'tw' ? (
              <a
                href={`${constants.link}${twId}`}
                className="pl-2"
                target="_blank"
              >
                <Image src="/images/redirect.png" />
              </a>
            ) : (
              <a
                href="/"
                className=""
                onClick={(e) => {
                  setModalShow(true);
                  setEditShow(true);
                  e.preventDefault();
                  e.stopPropagation();
                  setTaskId(id);
                  setCntClearFilter(cntClearFilter + 1);
                  customFunctions.setLocalStorage('taskid', id);
                }}
              >
                <Image src="/images/edit-button.svg" />
              </a>
            )}
            <a
              href="/"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDelete(true);
                setTaskId(id);
              }}
            >
              {twId ? '' : <Image src="/images/delete.png" />}
            </a>
          </span>
        );
      },
    },
  ];

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

  useEffect(()=>{
    getTableData();
  },[pmsId])

  const getTableData = async (pageNo = 0) => {
    setShowLoader(true);
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.taskUrl}?sort_by=id&sort_direction=descending&page=${page}&limit=${pagination.itemsPerPage}&tw_emp_id=${pmsId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setShowLoader(false);
      setClockinClockoutStorage();
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: Number(data.paginator.current_page),
        itemsPerPage: Number(data.paginator.limit),
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((task, i) => {
        const morningSelected = task.morning_selected;
        if (morningSelected && !selectedId.includes(Number(task.id))) {
          selectedId.push(task.id);
        }

        const setRowData = {
          todo: (
            <>
              {task.content}
              <br />
            </>
          ),
          id: task.id,
          twId: task.tw_id,
          taskType: task.task_type,
          projects: task.project_name,
          status: task.status,
          eta: task.estimation,
          at: task.actual_time,
          progress: task.progress,
          indexOf: i,
          oldProgress: task.progress,
          // rowClass: morningSelected ? 'morning-mail-sent' : ''
        };
        row.push(setRowData);
        return task;
      });
      setSelectedId([...selectedId]);
      setRows(row);
    }
  };

  const getBreakList = async () => {
    const endPoint = `${Api.taskUrl}?show_only_breaks=true&page=1&limit=100`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data && data.data.length) {
      const selectedBreak = [];
      setShowSendReport(true);
      data.data.map((task, i) => {
        const dt = new Date();
        const startTm = task.start_time;
        const hrmin = startTm.split(':');
        dt.setHours(hrmin[0]);
        dt.setMinutes(hrmin[1]);

        const dt1 = new Date();
        const endTm = task.end_time;
        const hrminNew = endTm.split(':');
        dt1.setHours(hrminNew[0]);
        dt1.setMinutes(hrminNew[1]);

        const spent = task.estimation;
        const spentNew = spent.split('Hrs');

        const spent1 = spentNew.length > 1 ? spentNew[0].trim() : 0;
        const spentNewMins =
          spentNew.length > 1
            ? spentNew[1].split('Mins')
            : spentNew[0].split('Mins');
        const spent2 = spentNewMins.length > 0 ? spentNewMins[0].trim() : 0;
        const filterBreak = BreakList.filter(
          (breakObj) =>
            breakObj.label.toLowerCase() === task.content.toLowerCase()
        );
        selectedBreak.push({
          id: task.id,
          selectedBreakOption: filterBreak.length ? filterBreak[0] : '',
          startTime: dt,
          endTime: dt1,
          sthrs: dt.getHours(),
          stmins: dt.getMinutes(),
          hrs: spent1 || 0,
          mins: spent2 || 0,
          isDefault: i < 2 ? 'true' : 'false',
          timeHours: spent1 || 0,
          timeMins: spent2 || 0,
        });
        return task;
      });
      setBreakData(selectedBreak);
    } else {
      setInitialBreakData();
    }
  };

  const setInitialBreakData = () => {
    const selectedBreak = [];
    BreakList.map((item) => {
      if (item.id === 3 || item.id === 2) {
        selectedBreak.push({
          id: '',
          selectedBreakOption: { label: item.label, id: item.id },
          startTime: '',
          endTime: '',
          sthrs: '',
          stmins: '',
          hrs: '',
          mins: '',
          isDefault: true,
        });
      }
      return selectedBreak;
    });
    setBreakData(selectedBreak);
  };

  useEffect(() => {
    async function getData() {
      setInitialBreakData();
      getDailyActivity();
      const uRole = customFunctions.getLocalStorage('group');
      setUserRole(Number(uRole));
    }
    getData();
  }, [pmsId]);

  useEffect(() => {
    getTableData(pagination.current_page);
  }, [cntClearFilter]);

  useEffect(() => {
    if (showBreak) getBreakList();
  }, [showBreak]);

  useEffect(() => {
    setClockinClockoutStorage();
  }, [showBreak, showScrumPopup, loader]);

  const setClockinClockoutStorage = () => {
    const clockIn = customFunctions.getLocalStorage('clockinTime');
    const date = customFunctions.getLocalStorage('clockInDate');
    if (clockIn) {
      const dt = new Date(date);

      setClockInDate(dt);

      const hr = dt.getHours();
      setTimeHour(hr);

      const min = dt.getMinutes();
      setTimeMinutes(min);
    }
  };

  const getDailyActivity = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.dailyActivityUrl}`);
    if (data && data.data) {
      setMorningMail(data.data.morning_mail);
      setSignOutMail(data.data.signout_mail);
    }
    if (data && data.data.clock_out_time) {
      customFunctions.setLocalStorage('time', data.data.clock_out_time);
      SharedService.clockOut.next(true);
    }
  };

  const onSendScrum = async () => {
    setLoader(true);

    breakData.map((e) => {
      if (e.id) selectedId.push(Number(e.id));

      return e;
    });

    setSelectedId([...selectedId]);

    const postData = {
      type: morningMail && !signOutMail ? 'logout' : 'morning',
      tasks: selectedId,
    };

    const endPoint = `${Api.reportUrl}`;
    const { data, message } = await AuthApi.postDataToServer(
      endPoint,
      postData
    );
    setDisableButton(false);
    if (data && data.success) {
      if (onMorningSendScrum) onMorningSendScrum();
      if (onClockoutReport) onClockoutReport();
      setClockinClockoutStorage();
      if (morningMail && !signOutMail) {
        setSelectedId([]);
      }

      setLoader(false);
      setShowBreak(false);
      setShowErrorBlock(false);
      setShowSuccessBlock(true);
      getTableData(1);
    } else {
      setLoader(false);
      setShowScrumPopup(false);
      setShowErrorBlock(true);
      setShowSuccessBlock(false);
      // swal(message, '', 'error');
      setShowBreak(false);
      swal(message, '', 'error').then((result) => {
        if (result) {
          setShowBreak(true);
        }
      });
    }
    getDailyActivity();
  };

  const addBreak = () => {
    setShowSendReport(false);
    return setBreakData([
      ...breakData,
      {
        id: '',
        selectedBreakOption: '',
        startTime: '',
        endTime: '',
        sthrs: '',
        stmins: '',
        hrs: '',
        mins: '',
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
    setLoader(true);
    breakData.map((dt) => {
      return BreakPostData.push({
        id: dt.id,
        content: `${dt.selectedBreakOption.label}`,
        start_time: customFunctions.getTime(dt.startTime),
        end_time: customFunctions.getTime(dt.endTime),
        hours: Number(dt.hrs),
        minutes: Number(dt.mins),
        task_type: 'break',
      });
    });
    const postData = {
      tasks: BreakPostData,
    };

    const endPoint = `${Api.taskUrl}`;
    const { data } = await AuthApi.postDataToServer(endPoint, postData);
    setDisableButton(false);
    setLoader(false);
    if (data && data.success) {
      setShowBreak(false);
      swal({
        title: 'Break added successfully, now you can send your logout report.',
        icon: 'success',
      }).then((okAction) => {
        if (okAction) {
          getBreakList();
          setShowBreak(true);
        }
      });

      getTableData(1);
    } else {
      setShowSendReport(false);
      setShowBreak(false);
      swal(data && data.message[0], '', 'error').then((result) => {
        if (result) {
          setShowBreak(true);
        }
      });
    }
  };

  const deleteTask = async (id) => {
    const { data } = await AuthApi.deleteDataFromServer(`${Api.taskUrl}${id}/`);
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          const tempPagination =
            rows.length < 2
              ? pagination.current_page - 1
              : pagination.current_page;

          setShowDelete(false);
          setTaskId(null);
          getTableData(tempPagination);
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };

  const onChangeInTask = () => {
    getTableData(pagination.current_page);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (selectedId.length > 0) {
      onSendScrum();
    } else {
      setDisableButton(false);
      swal('Please Select Task', '', 'error');
    }
  };

  const onBreakSubmit = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.allValid()) {
      onComfirm();
    } else {
      setDisableButton(false);
      setShowSendReport(false);
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  const onDeleteBreakHandler = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = [...breakData];
    data.splice(idx, 1);
    setShowSendReport(true);
    if (data.filter((item) => !item.id).length > 0) {
      setShowSendReport(false);
    }
    setBreakData([...data]);
  };

  const onSkipBreak = () => {
    if (breakData.length < 1) {
      setShowSendReport(true);

      setShowMsg(true);
    } else {
      setShowMsg(false);
    }
  };

  const onChangeEndTime = (e, i) => {
    breakData[i].endTime = e;
    breakData[i].hrs = 0;
    breakData[i].mins = 0;
    if (e && breakData[i].startTime) {
      const endTimeNew = new Date(e);
      const startTimeNew = new Date(breakData[i].startTime);
      const diffMs = endTimeNew - startTimeNew;
      const { hours: diffHrs, minutes: diffMins } =
        customFunctions.msToTime(diffMs);
      breakData[i].hrs = diffHrs;
      breakData[i].mins = diffMins;
      breakData[i].timeHours = diffHrs;
      breakData[i].timeMins = diffMins;
    }
    setBreakData([...breakData]);
  };

  const setHoursSpendTime = async (e, i, fromFunc = true) => {
    breakData[i].timeHours = e.target.value;
    const startTime = new Date(breakData[i].startTime);
    const getHours = startTime.getHours();
    const newHours = getHours + Number(e.target.value);
    breakData[i].endTime = new Date(startTime.setHours(newHours));
    await setBreakData([...breakData]);
    if (fromFunc) {
      await setMinSpendTime(
        { target: { value: breakData[i].timeMins } },
        i,
        false
      );
    }
  };

  const setMinSpendTime = async (e, i, fromFunc = true) => {
    breakData[i].timeMins = e.target.value;
    if (fromFunc) {
      await setHoursSpendTime(
        { target: { value: breakData[i].timeHours } },
        i,
        false
      );
    }
    const endTime = new Date(breakData[i].endTime);
    const getMinutes = endTime.getMinutes();
    const newMins = getMinutes + Number(e.target.value);
    breakData[i].endTime = new Date(endTime.setMinutes(newMins));
    setBreakData([...breakData]);
  };
  const OnSaveProgress = async () => {
    setLoader(true);
    const progressArr = [];
    rows &&
      rows.map((rw) => {
        if (rw.oldProgress !== rw.progress) {
          progressArr.push({
            id: rw.id,
            progress: Number(rw.progress),
            tw_id: rw.twId ? Number(rw.twId) : null,
          });
        }
        return rw;
      });

    const postData = {
      data: progressArr,
    };

    const endPoint = `${Api.taskProgressUrl}`;
    const { data, message } = await AuthApi.putDataToServer(endPoint, postData);

    if (data) {
      setLoader(false);
      swal(data.message[0], '', 'success').then((result) => {
        if (result) {
          getTableData(1);
        }
      });
    } else {
      setLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
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
          You will not be able to revert this!
        </SweetAlert>
      )}

      {showErrorBlock && (
        <div className="p-3 mb-4 bg-danger text-white mt-1 bg-danger-main table-red-bg">
          <div className="img-text">
            <img src="/images/fail.svg" alt="Success" /> Report Sent Failed !!
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
        <div className="p-3 mb-4 bg-success text-white mt-1 bg-success-main">
          <div className="img-text">
            <img src="/images/success.svg" alt="Success" /> Report Sent
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
      <Loader showLoader={loader} needFullPage={false} />
      <section className="content-area">
        <div className="0">
          <UserRestrictions
            permittedUsers={[2, 3, 4, 5, 6, 7]}
            roleId={userRole}
          >
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0 mt-2 "> To Do</h5>
                  <div className="d-flex align-items-center justify-content-end">
                    <a
                      href="#"
                      onClick={() => {
                        customFunctions.removeLocalStorage('taskid');
                        setModalShow(true);
                        forceUpdate(count + 1);
                      }}
                      className="btn-link mr-3"
                    >
                      Add Task
                    </a>
                    <div>
                      <Button
                        onClick={() => {
                          getTableData();
                          if(pmsId){
                            callback('refresh');
                          }
                        }}
                        className="btn"
                      >
                        Refresh
                      </Button>
                    </div>
                  </div>
                </div>
                <hr />
                <Row>
                  <Table
                    columns={columns}
                    rows={rows}
                    showPagination={true}
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
                    onSelectRowsIndexes={async (rowIndex) => {
                      const arr = [...rowIndex];
                      const arrNew = [];
                      await arr.filter((e) => {
                        if (!arrNew.includes(e)) {
                          arrNew.push(e);
                        }
                        return e;
                      });
                      setSelectedId([...arrNew]);
                    }}
                    tableClass="table-striped"
                    emptyRender={() => (
                      <p className="text-center mb-0">No record found</p>
                    )}
                  />
                </Row>
                <div className="d-flex justify-content-end mr-3">
                  {pagination.totalItems > 0 && (
                    <Button
                      variant="primary"
                      className="mb-3 ms-4"
                      onClick={() => {
                        OnSaveProgress();
                      }}
                    >
                      Update Progress
                    </Button>
                  )}
                  {!morningMail && !signOutMail && pagination.totalItems > 0 && (
                    <Button
                      variant="primary"
                      className="mb-3 ms-4"
                      onClick={() => {
                        setShowScrumPopup(true);
                      }}
                    >
                      Clock In & Send Scrum
                    </Button>
                  )}
                  {!signOutMail &&
                    morningMail &&
                    String(totalHours) !== '0 Hrs 0 Mins' && (
                      <Button
                        variant="primary"
                        className="mb-3 ms-2"
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
          </UserRestrictions>
        </div>
      </section>
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
      {showBreak && (
        <ModalInput
          size="md"
          centered
          show={showBreak}
          onHide={() => {
            setShowBreak(false);
            getTableData(1);
            setShowMsg(false);
          }}
          label={<h4 variant="primary">Add Break</h4>}
          id="contained-modal-title-vcenter"
          modalBody={
            <Form onSubmit={onBreakSubmit}>
              <div className="add-break d-flex align-items-center justify-content-between">
                <h3 className="mb-1">{'  '}</h3>
                <button
                  type="button"
                  className="btn btn-primary mb-3"
                  onClick={() => addBreak()}
                >
                  Add Break
                </button>
              </div>
              {showMsg && (
                <div className="p-3 mb-4 bg-success text-white mt-1 bg-success-main">
                  <div className="img-text">
                    <img src="/images/success.svg" alt="Success" /> You have
                    skipped all the breaks !
                  </div>
                  <div className="close">
                    <button
                      type="button"
                      className="close"
                      onClick={() => setShowMsg(false)}
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
              )}

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
                          <img src="/images/skip.svg" alt="skip" />
                        </a>
                        {breakData.length > 1 && (
                          <a
                            href="/"
                            onClick={(e) => {
                              onDeleteBreakHandler(i, e);
                            }}
                          >
                            <img
                              src="/images/delete.png"
                              className="ml-2"
                              alt="delete"
                            />
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
                          setSelectedBreakOption([...breakData]);
                        }}
                        errorMessage={validator.message(
                          'selectedBreakOption',
                          data.selectedBreakOption,
                          'required'
                        )}
                      />
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Datepicker
                          className="form-control"
                          label="Start Time"
                          selected={data.startTime}
                          minDate={new Date(clockInDate)}
                          minTime={setHours(
                            setMinutes(
                              clockInDate,
                              parseInt(timeMinutes, 10) + 1
                            ),
                            parseInt(timeMinutes, 10) > 58
                              ? parseInt(timeHour, 10) + 1
                              : timeHour
                          )}
                          maxTime={setHours(
                            setMinutes(new Date(), new Date().getMinutes()),
                            new Date().getHours()
                          )}
                          onChange={(e) => {
                            breakData[i].startTime = e;
                            breakData[i].sthrs = e.getHours();
                            breakData[i].stmins = e.getMinutes();
                            breakData[i].hrs = 0;
                            breakData[i].mins = 0;
                            breakData[i].endTime = null;

                            setBreakData([...breakData]);
                          }}
                          showTimeSelect="showTimeSelect"
                          showTimeSelectOnly="showTimeSelectOnly"
                          timeIntervals="1"
                          dateFormat="h:mm aa"
                          errorMessage={validator.message(
                            'Start Time',
                            breakData[i].startTime,
                            'required'
                          )}
                        />
                      </Col>
                      <Col md={4}>
                        <Datepicker
                          className="form-control"
                          label="End Time"
                          selected={data.endTime}
                          minDate={new Date(data.startTime)}
                          minTime={setHours(
                            setMinutes(
                              new Date(),
                              parseInt(data.stmins, 10) + 1
                            ),
                            parseInt(data.stmins, 10) > 58
                              ? parseInt(data.sthrs, 10) + 1
                              : data.sthrs
                          )}
                          maxTime={setHours(setMinutes(new Date(), 59), 23)}
                          disabled={data.startTime === ''}
                          onChange={(e) => {
                            onChangeEndTime(e, i);
                          }}
                          showTimeSelect="showTimeSelect"
                          showTimeSelectOnly="showTimeSelectOnly"
                          timeIntervals="1"
                          dateFormat="h:mm aa"
                          errorMessage={validator.message(
                            'End Time',
                            breakData[i].endTime,
                            'required'
                          )}
                        />
                      </Col>

                      <Col md={4}>
                        <Row>
                          <Col md={6}>
                            <TextInput
                              onInputChange={(e) => {
                                setHoursSpendTime(e, i);
                              }}
                              label="Time"
                              containerClass="form-group"
                              type="text"
                              disabled={
                                data.startTime === '' || data.endTime === null
                              }
                              name="designationtitle"
                              // value={breakData[i].endTime && breakData[i].startTime ? `${data.hrs}` : timeSpentHours}
                              value={data.timeHours}
                            />
                            <h7 className="mb-1">hours</h7>
                          </Col>
                          <Col md={6}>
                            <TextInput
                              onInputChange={(e) => {
                                setMinSpendTime(e, i);
                                // const re = /^[a-zA-Z ]*$/;
                                // if (!e.target.value || re.test(e.target.value)) {
                                //   setTimeSpentMinutes(e.target.value);
                                // }
                              }}
                              label="Spent"
                              containerClass="form-group"
                              type="text"
                              disabled={
                                data.startTime === '' || data.endTime === null
                              }
                              name="designationtitle"
                              // value={breakData[i].endTime && breakData[i].startTime ? `${data.mins}` : timeSpentMinutes}
                              value={data.timeMins}
                            />
                            <p className="mb-2">minutes</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ))}
              <div className="float-end">
                {breakData && breakData.length > 0 ? (
                  <Button
                    type="submit"
                    disabled={disableButton || showSendReport}
                    // onClick={(e) => onBreakSubmit(e)}
                    variant={`${
                      !showSendReport ? 'primary ml-1' : 'secondary ml-1'
                    }`}
                  >
                    Confirm
                  </Button>
                ) : (
                  ''
                )}

                <Button
                  disabled={disableButton || !showSendReport}
                  className="ms-4"
                  onClick={(e) => {
                    onSubmit(e);
                  }}
                  variant={`${
                    showSendReport ? 'primary ml-1' : 'secondary ml-1'
                  }`}
                >
                  Send Report
                </Button>
              </div>
            </Form>
          }
        />
      )}

      <ModalInput
        size="sm"
        centered
        className="send-report-confirm"
        show={showScrumPopup}
        onHide={() => setShowScrumPopup(false)}
        id="contained-modal-title-vcenter"
        closeButton="closeButton"
        modalBody={
          <>
            <img
              src="/images/send-report.svg"
              style={{ height: '40px', textAlign: 'center' }}
              alt="Send Report"
            />
            <h5>Are you sure ?</h5>
            <div className="light-bg buttons d-flex align-items-center mb-1 mt-3 justify-content-between">
              <button
                type="button"
                className="btn btn-secondary mr-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowScrumPopup(false);
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
              src="/images/skip-image.svg"
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
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSkipBreak(false);
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
                  setBreakData([...breakData]);
                  onSkipBreak();
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
