import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
// import SweetAlert from 'react-bootstrap-sweetalert';
import { ModalInput, TextInput, DropdownInput} from '../../components/FormInputs';
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
  }
];

const validator = new SimpleReactValidator();

function ToDoList() {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [designationId, setDesignationId] = useState(null);
  //   const [ShowDelete, setShowDelete] = useState(false);
  const [designation, setDesignation] = useState('');
  // const [selectedBreakOption, setSelectedBreakOption] = useState('');
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  // const [timeSpent, setTimeSpent] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const [breakData, setBreakData] = useState([
    {
    selectedBreakOption:'',
    startTime:'',
    endTime:'',
    timeSpend:''
    }
    ])

  const BreakList = [
    {
      'id': 1,
      'name': 'Lunch Break'
    },
    {
      'id': 2,
      'name': 'Morning Refreshment'
    },
    {
      'id': 3,
      'name': 'Evening Refreshment'
    },
    {
      'id': 4,
      'name': 'Infrastructure'
    },
    {
      'id': 5,
      'name': 'Other'
    },

  ]

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.designationUrl}?page=${page}&limit=${pagination.itemsPerPage}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((desgn) => {
        row.push({
          name: desgn.name,
          action: (
            <>
              <a
                href="/"
                className="pl-2"
                onClick={(e) => {
                  setModalShow(true);
                  e.preventDefault();
                  e.stopPropagation();
                  setDesignationId(desgn.id);
                  setDesignation(desgn.name);
                }}
              >
                <Image src="images/edit.svg" />
              </a>
              <a
                href="/"
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  //   setShowDelete(true);
                  setDesignationId(desgn.id);
                  // removeDesignation(desgn.id); //eslint-disable-line
                }}
              >
                <Image src="images/delete.png" />
              </a>
            </>
          ),
        });
        return desgn;
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

  const onCancel = () => {
    validator.hideMessages();
    setDesignation();
    setModalShow(false);
    setShowBreak(false);
    setBreakData([
      {
        selectedBreakOption:'',
        startTime:'',
        endTime:'',
        timeSpend:''
        }
    ]);
  };

  const addDesignation = async () => {
    const postData = {
      name: designation,
      is_deleted: 'false',
    };
    const callback = designationId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = designationId
      ? `${Api.designationUrl}${designationId}/`
      : Api.designationUrl;
    const { data } = await callback(endPoint, postData);

    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setModalShow(false);
          getTableData(1);
        }
      });
    } else {
      swal(data && data.message, '', 'error');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      addDesignation();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  const addBreak = () => {
    console.log('addbreakkkkkkkkkkkkkkkk');
    const list = breakData; 
    list.push({
      selectedBreakOption:'',
      startTime:'',
      endTime:'',
      timeSpend:''
    });
    console.log('list', list);
    setBreakData([...list]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBreakData((inputValues) => {
      return { ...inputValues, [name]: value };
    });
  };

  // addressChangeHandler = (event) => {
  //   const { name, value } = event.target
  //   this.setState({
  //     [name]: value
  //   });
  // }


  return (
    <>
    {console.log('breakData', breakData)}
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

      <div className="mt-3">
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
                  paginationProps={{
                    ...pagination,
                    onPageChange: (pageNo) => {
                      getTableData(pageNo);
                    },
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
          <div className="d-flex justify-content-end mr-3">
            <Button variant="primary" className="mb-3" onClick={() => { setShowBreak(true) }} >Clock Out & Send Report</Button>

          </div>
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
                    image='images/time.svg'
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
                    <label htmlFor="" className="col-form-label">Progress</label>
                    <div className="progress-main">
                      <div className="progress">
                        <div className="progress-bar bg-secondary" role="progressbar" style={{ 'width': '5%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
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
                <button type="button" className="btn btn-primary" onClick={() => addBreak()}>Add Break</button>
              </div>
              {breakData && breakData.length > 0 && breakData.map((data)=>(
               <>
               {console.log('dataaa',data)}
            
              <div className="d-flex align-items-center justify-content-between skip-type mb-1 mt-2">
                <label htmlFor="exampleFormControlSelect1">Break Type <sup className="text-danger">*</sup></label>
                <div className="skip-form">
                  <a><img src="images/skip.svg" alt="skip" /></a>
                </div>
              </div>
              <Row>
              <DropdownInput
                //   label="Designation"
                asterisk="*"
                options={BreakList}
                placeholder='Select Subject'
               defaultValue={data.selectedBreakOption}
                onSelectHandler={(e) => handleInputChange(e)}
                // errorMessage={validator.message(
                //   'selectedDesignationOption',
                //   selectedDesignationOption,
                //   'required'
                // )}
              />
              </Row>
              <Row>
                <Col md={4}>
                <TextInput
                    onInputChange={(e) => handleInputChange(e)}
                    label="Start Time"
                    containerClass="form-group"
                    type="time"
                    name="startTime"
                    value={data.startTime}
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
                    onInputChange={(e) => handleInputChange(e)}
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
                    onInputChange={(e) => handleInputChange(e)}
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
              ))
              }              
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
      </div>
    </>
  );
}

export default withRouter(ToDoList);
