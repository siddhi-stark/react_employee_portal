import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
// import SweetAlert from 'react-bootstrap-sweetalert';
import {
  ModalInput,
  TextInput,
  DropdownInput,
} from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

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
];

const validator = new SimpleReactValidator();

function ToDoList() {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [showSkipBreak, setShowSkipBreak] = useState(false);
  const [showClockoutBtn, setShowClockoutBtn] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [index, setIndex] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [taskList, setTaskList] = useState([]);
  // const [reportType, setReportType] = useState('');
  // const [designationId, setDesignationId] = useState(null);
  //   const [ShowDelete, setShowDelete] = useState(false);
  const [designation, setDesignation] = useState('');
  const [selectedBreakOption, setSelectedBreakOption] = useState(null);
  const [startTime, setStartTime] = useState(''); //eslint-disable-line
  const [endTime, setEndTime] = useState(''); //eslint-disable-line
  const [timeSpent, setTimeSpent] = useState(''); //eslint-disable-line
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
      timeSpent: '',
    },
    {
      selectedBreakOption: '',
      startTime: '',
      endTime: '',
      timeSpent: '',
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
    console.log('data', data);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });
      setTaskList(data.data);

      const row = [];

      data.data.map((task) => {
        row.push({
          todo: task.parent_content,
          projects: task.project_name,
          status: task.status,
          eta: task.start_time,
          at: task.end_time,
          // action: (
          //   <>
          //     <a
          //       href="/"
          //       className="pl-2"
          //       onClick={(e) => {
          //         setModalShow(true);
          //         e.preventDefault();
          //         e.stopPropagation();
          //         setDesignationId(desgn.id);
          //         setDesignation(desgn.name);
          //       }}
          //     >
          //       <Image src="images/edit.svg" />
          //     </a>
          //     <a
          //       href="/"
          //       className=""
          //       onClick={(e) => {
          //         e.preventDefault();
          //         e.stopPropagation();
          //         //   setShowDelete(true);
          //         setDesignationId(desgn.id);
          //         // removeDesignation(desgn.id); //eslint-disable-line
          //       }}
          //     >
          //       <Image src="images/delete.png" />
          //     </a>
          //   </>
          // ),
        });
        return task;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    getTableData(1);
  }, []);

  //   const removeDesignation = async (id) => {
  //     const { data } = await AuthApi.deleteDataFromServer(
  //       `${Api.designationUrl}${id}/`
  //     );
  //     if (data) {
  //       swal(data && data.message[0], '', 'success').then((result) => {
  //         if (result) {
  //           setShowDelete(false);
  //           setDesignationId(null);
  //           getTableData(1);
  //         }
  //       });
  //     } else {
  //       swal(data && data.message[0], '', 'error');
  //     }
  //   };
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

  const onCancel = () => {
    validator.hideMessages();
    setDesignation();
    setModalShow(false);
    setShowBreak(false);
    setBreakData([
      {
        selectedBreakOption: '',
        startTime: '',
        endTime: '',
        timeSpend: '',
      },
    ]);
  };

  const onSendScrum = async () => {
    console.log('TaskList', selectedRowIndex);
    // console.log('Typeeee', reportType);
    const postData = {
      type: 'morning',
      tasks: selectedRowIndex,
    };

    // const endPoint = designationId
    //   ? `${Api.designationUrl}${designationId}/`
    //   : Api.designationUrl;
    // const { data } = await callback(endPoint, postData);

    const endPoint = `${Api.reportUrl}`;
    const { data, message } = await AuthApi.postDataToServer(
      endPoint,
      postData
    );

    if (data) {
      swal(data && data.message[0], '', 'success');
    } else {
      swal(message, '', 'error');
      setShowClockoutBtn(true);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      onSendScrum();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

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

  // const removeSubjectTutor = (index) => {
  //   subjectTutor.splice(index, 1)
  //    return setSubjectTutor([...subjectTutor]);
  //  };

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

  // addressChangeHandler = (event) => {
  //   const { name, value } = event.target
  //   this.setState({
  //     [name]: value
  //   });
  // }

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

  const onComfirm = () => {
    const BreakPostData = [];
    breakData.map((dt) => {
      return BreakPostData.push({
        description: dt.selectedBreakOption,
        start_time: dt.startTime,
        end_time: dt.endTime.id,
        task_type: 'Break',
      });
    });
    console.log('breakdata', BreakPostData);
  };

  return (
    <>
      {/* {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to remove the designation ?"
          error
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            removeDesignation(designationId);
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You wont be able to revert this!
        </SweetAlert>
      )} */}

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
                      setModalShow(true);
                      // setDesignationId();
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
                showCheckbox
                onSelectRowsIndexes={(rowIndex) => {
                  const twId = [];
                  taskList.map((task, ind) => {
                    rowIndex.map((i) => {
                      if (ind === i) {
                        twId.push(task.tw_id);
                      }
                      return i;
                    });

                    console.log('twId', twId);
                    return ind;
                  });
                  setSelectedRowIndex(twId);
                }}
                paginationProps={{
                  ...pagination,
                  onPageChange: (pageNo) => {
                    getTableData(pageNo);
                  },
                }}
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-end mr-3">
            {showClockoutBtn ? (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => {
                  setShowBreak(true);
                }}
              >
                Clockout & Send Report
              </Button>
            ) : (
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => {
                  onSendScrum();
                }}
              >
                Send Scrum
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
      <ModalInput
        size="lg"
        centered
        show={modalShow}
        label="Add Task"
        id="contained-modal-title-vcenter"
        modalBody={
          <Form>
            <Row>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => setDesignation(e.target.value)}
                  label="Add Task Name"
                  containerClass="form-group"
                  type="text"
                  name="designationtitle"
                  value={designation}
                  placeholder="Enter designation"
                  errorMessage={validator.message(
                    'designation',
                    designation,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => setDesignation(e.target.value)}
                  label="Project Name"
                  containerClass="form-group"
                  type="text"
                  name="designationtitle"
                  value={designation}
                  placeholder="Enter designation"
                  errorMessage={validator.message(
                    'designation',
                    designation,
                    'required'
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={2}>
                <TextInput
                  onInputChange={(e) => setDesignation(e.target.value)}
                  label="Start Time"
                  containerClass="form-group"
                  type="time"
                  name="designationtitle"
                  value={designation}
                  image="images/time.svg"
                  placeholder="Enter designation"
                  errorMessage={validator.message(
                    'designation',
                    designation,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <TextInput
                  onInputChange={(e) => setDesignation(e.target.value)}
                  label="End Time"
                  containerClass="form-group"
                  type="text"
                  name="designationtitle"
                  value={designation}
                  placeholder="Enter designation"
                  errorMessage={validator.message(
                    'designation',
                    designation,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <TextInput
                  onInputChange={(e) => setDesignation(e.target.value)}
                  label="Time Spent"
                  containerClass="form-group"
                  type="text"
                  name="designationtitle"
                  value={designation}
                  placeholder="Enter designation"
                  errorMessage={validator.message(
                    'designation',
                    designation,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                {/* <TextInput
                          onInputChange={(e) => setDesignation(e.target.value)}
                          label="Progress"
                          containerClass="form-group"
                          progressClass="progress-main"
                          type="text"
                          name="designationtitle"
                          value={designation}
                          placeholder="Enter designation"
                          errorMessage={validator.message(
                            'designation',
                            designation,
                            'required'
                          )}
                        /> */}
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
          </Form>
        }
        modalFooter={
          <div className="float-end">
            <Button variant="secondary" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-4"
              onClick={(e) => onSubmit(e)}
            >
              Add
            </Button>
          </div>
        }
      />
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
                      label="Subject"
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
                    <Col md={4}>
                      <TextInput
                        onInputChange={(e) => {
                          breakData[i].startTime = e.target.value;
                          setStartTime(breakData);
                        }}
                        label="Start Time"
                        containerClass="form-group"
                        type="time"
                        name="startTime"
                        value={data.startTime}
                        // errorMessage={validator.message(
                        //   'password',
                        //   password,
                        //   'required'
                        // )}
                      />
                      <DatePicker
                        selected={ToTime}
                        onChange={(date) => {
                          breakData[i].startTime = date;
                          setStartTime({ ToTime: date });
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={1}
                        timeCaption="From"
                        dateFormat="h:mm aa"
                      />
                    </Col>
                    <Col md={4}>
                      <TextInput
                        onInputChange={(e) => {
                          breakData[i].endTime = e.target.value;
                          setEndTime(breakData);
                        }}
                        label="End Time"
                        containerClass="form-group"
                        type="time"
                        name="endTime"
                        value={data.endTime}
                        placeholder="Enter Password"
                        // errorMessage={validator.message(
                        //   'password',
                        //   password,
                        //   'required'
                        // )}
                      />
                    </Col>
                    <Col md={4}>
                      <TextInput
                        onInputChange={(e) => {
                          breakData[i].timeSpent = e.target.value;
                          console.log('e', e);
                          setTimeSpent(breakData);
                        }}
                        label="Time Spent"
                        containerClass="form-group"
                        type="time"
                        name="timeSpent"
                        value={data.timeSpent}
                        placeholder="Enter Password"
                        // errorMessage={validator.message(
                        //   'password',
                        //   password,
                        //   'required'
                        // )}
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
              onClick={(e) => onSubmit(e)}
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
