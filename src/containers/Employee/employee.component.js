import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
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
    id: 'name',
    label: 'Full Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'mobile',
    label: 'Mobile',
  },
  {
    id: 'action',
    label: 'Action',
  },
];

const validator = new SimpleReactValidator();

function Employee() {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);
  const [ShowDelete, setShowDelete] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState([]);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const getTableData = async (pageNo = 0) => {
    // let endPoint;
    // const hasSearch = (keyword !== '');
    const page = pageNo || pagination.current_page;
    // endPoint = `${Api.employeeUrl}`;
    //   if(keyword){
    //   endPoint = hasSearch ? `${endPoint}?keyword=${keyword}&limit=${pagination.itemsPerPage}&page=${page}` : `${endPoint}`;
    // }

    const endPoint = `${Api.employeeUrl}?keyword=${keyword}&limit=${pagination.itemsPerPage}&page=${page}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((emp) => {
        row.push({
          name: emp.full_name,
          email: emp.email,
          mobile: emp.mobile,
          action: (
            <>
              <a
                href="/"
                className="pl-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalShow(true);
                  setEmployeeId(emp.id);
                  setSelectedDesignationOption({
                    label: emp.designation_name,
                    id: emp.designation_id,
                  });
                  setFullName(emp.full_name);
                  setEmail(emp.email);
                  setPassword(emp.password);
                  setMobile(emp.mobile);
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
                  setShowDelete(true);
                  setEmployeeId(emp.id);
                  // removeDesignation(desgn.id); //eslint-disable-line
                }}
              >
                <Image src="images/delete.png" />
              </a>
            </>
          ),
        });
        return emp;
      });
      setRows(row);
    }
  };

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}`);
    if (data) {
      setDesignation(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
    getTableData(1);
    getDesignation();
     }
    getData();
  }, []);

  useEffect(() => {
    getTableData(1)
  }, [cntClearFilter]);


  const deleteEmployee = async (id) => {
    const { data } = await AuthApi.deleteDataFromServer(
      `${Api.employeeUrl}${id}/`
    );
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setShowDelete(false);
          setEmployeeId(null);
          getTableData(1);
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
      setModalShow(false);
    }
  };

  const onCancel = () => {
    setSelectedDesignationOption();
    validator.hideMessages();
    setFullName();
    setEmail();
    setMobile();
    setPassword();
    setModalShow(false);
  };

  const addEmployee = async () => {
    const postData = {
      full_name: fullName,
      email,
      mobile,
      designation_id: selectedDesignationOption.id,
      designation_name: selectedDesignationOption.label,
      role_id: '5',
      password,
    };
    const callback = employeeId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = employeeId
      ? `${Api.employeeUrl}${employeeId}/`
      : Api.employeeUrl;
    const { data } = await callback(endPoint, postData);

    if (data) {
      setSelectedDesignationOption();
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setEmployeeId();
          setSelectedDesignationOption();
          validator.hideMessages();
          setFullName();
          setEmail();
          setPassword();
          setMobile();
          setModalShow(false);
          getTableData(1);
        }
      });
    } else {
      swal(data && data.message, '', 'error');
      setModalShow();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      addEmployee();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  const getDesignationList = () => {
    if (!designation) return [];
    const options = [];
    designation.map((desgn) => {
      return options.push({
        label: desgn.name,
        id: desgn.id,
      });
    });
    return options;
  };

  // const onClear = () => {
  //   getTableData(1, () => {
  //     setKeyword('');
  //   });

  // };

  const onClear = () => {
    setKeyword('');
    setCntClearFilter(cntClearFilter+1);
  };

  return (
    <>
      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to delete the employee ?"
          error
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            deleteEmployee(employeeId);
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You wont be able to revert this!
        </SweetAlert>
      )}

      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <Row>
                <Col>
                  <div className="pull-left">
                    <h5>Employee</h5>
                  </div>
                </Col>
                <Col>
                  <div className="pull-right">
                    <Button
                      size="sm"
                      variant="primary"
                      type="submit"
                      onClick={() => {
                        setModalShow(true);
                        setEmployeeId();
                      }}
                    >
                      Add Employee
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={4}>
                  <div className="search-bar-input">
                    <TextInput
                      inputClass="form-control"
                      value={keyword}
                      placeholder="search.."
                      onInputChange={(e) => {
                        setKeyword(e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => getTableData(1)}
                  >
                    search
                  </Button>
                </Col>
                <Col md={4}>
                  <div className="float-end">
                    <Button
                      size="sm"
                      variant="primary"
                      type="reset"
                      onClick={() => onClear()}
                    >
                      Clear
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
        </Card>
        <ModalInput
          size="lg"
          centered
          show={modalShow}
          label="Add Employee"
          id="contained-modal-title-vcenter"
          modalBody={
            <Form>
              <Row>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setFullName(e.target.value)}
                    label="Full Name"
                    asterisk="*"
                    containerClass="form-group"
                    type="text"
                    name="firstNameTitle"
                    value={fullName}
                    placeholder="Enter first name"
                    errorMessage={validator.message(
                      'Full Name',
                      fullName,
                      'required'
                    )}
                  />
                </Col>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    asterisk="*"
                    containerClass="form-group"
                    type="text"
                    name="emailTitle"
                    value={email}
                    placeholder="Enter email"
                    errorMessage={validator.message('email', email, 'required')}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    asterisk="*"
                    containerClass="form-group"
                    type="password"
                    name="passwordTitle"
                    value={password}
                    placeholder="Enter Password"
                    errorMessage={validator.message(
                      'password',
                      password,
                      'required'
                    )}
                  />
                </Col>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setMobile(e.target.value)}
                    label="Mobile"
                    asterisk="*"
                    containerClass="form-group"
                    type="text"
                    name="mobileTitle"
                    maxlength="10"
                    value={mobile}
                    placeholder="Enter Contact Number"
                    errorMessage={validator.message(
                      'mobile',
                      mobile,
                      'required'
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="Designation"
                    asterisk="*"
                    options={getDesignationList()}
                    placeholder="Select Subject"
                    defaultValue={selectedDesignationOption}
                    onSelectHandler={(select) =>
                      setSelectedDesignationOption(select)
                    }
                    errorMessage={validator.message(
                      'selectedDesignationOption',
                      selectedDesignationOption,
                      'required'
                    )}
                  />
                </Col>
              </Row>
            </Form>
          }
          modalFooter={
            <div className="float-end">
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>

              {employeeId ? (
                <Button
                  variant="primary"
                  type="submit"
                  className="ms-4"
                  onClick={(e) => onSubmit(e)}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className="ms-4"
                  onClick={(e) => onSubmit(e)}
                >
                  Add
                </Button>
              )}
            </div>
          }
        />
      </div>
    </>
  );
}

export default withRouter(Employee);
