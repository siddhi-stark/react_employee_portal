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
  Datepicker,
} from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const columns = [
  {
    id: 'no',
    label: 'Sr. No',
  },
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

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Employee' },
];

const currentdate = new Date();
// const currentYear = currentdate.getFullYear();
const maxdate = new Date(currentdate.setYear(currentdate.getFullYear() - 18));

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
  const [twEmployee, setTwEmployee] = useState([]);
  const [role, setRole] = useState([]);
  const [manager, setManager] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [teamLead, setTeamLead] = useState([]);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  // const [validationDate, setValidationDate] = useState('');
  const [twId, setTwId] = useState(null);
  const [date, setDate] = useState('');
  const [empId, setEmpId] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });
  const Department = [
    {
      id: 1,
      value: 'Management',
      label: 'Management',
    },
    {
      id: 2,
      value: 'Development',
      label: 'Development',
    },
    {
      id: 3,
      value: 'Design',
      label: 'Design',
    },
    {
      id: 4,
      value: 'Quality Analyst',
      label: 'Quality Analyst',
    },
    {
      id: 5,
      value: 'Other',
      label: 'Other',
    },
  ];

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
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((emp, i) => {
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
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

                  setEmpId(emp.id);
                  setCntClearFilter(cntClearFilter + 1);
                }}
              >
                <Image src="images/edit.png" />
              </a>
              <a
                href="/"
                className="ml-2"
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

  const getEmployeeById = async (id) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${id}/`
    );

    if (data && data.data) {
      const list = [];
      const managerList = [];

      teamLead.map((team) => {
        data.data.assigned_team_leads.map((assign) => {
          // (team.id === assign)? setSelectedTeamLead()
          if (team.id === assign) {
            list.push({
              id: team.id,
              label: team.full_name,
            });
          }

          return assign;
        });
        setSelectedTeamLead(list);
        return team;
      });

      manager.map((mngr) => {
        data.data.assigned_managers.map((assgnmgmr) => {
          if (mngr.id === assgnmgmr) {
            managerList.push({
              id: mngr.id,
              label: mngr.full_name,
            });
          }
          return assgnmgmr;
        });
        setSelectedManager(managerList);
        return mngr;
      });

      twEmployee.map((tw) => {
        if (data.data.tw_id === tw.tw_id) {
          setSelectedEmployee({ label: tw.full_name });
          setTwId(tw.tw_id);
        }
        return tw;
      });

      Department.map((dept) => {
        if (data.data.department_id === dept.id) {
          setSelectedDepartment(dept);
        }
        return dept;
      });

      setSelectedDesignationOption({
        label: data.data.designation_name,
        id: data.data.designation_id,
      });
      setSelectedRole({
        label: data.data.role_name,
        id: data.data.role_id,
      });

      setFullName(data.data.full_name);
      setEmail(data.data.email);
      // setDate(data.data.dob ? data.data.dob : '');
      setPassword(data.data.password);
      setMobile(data.data.mobile);
    }
  };

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (data) {
      setDesignation(data.data);
    }
  };

  const getTwEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.TwEmployeeUrl}`);
    if (data && data.data) {
      setTwEmployee(data.data);
    }
  };

  const getRole = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.roleUrl}`);
    if (data) {
      setRole(data.data);
    }
  };

  const getManager = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${2}`
    );
    if (data) {
      setManager(data.data);
    }
  };

  const getTeamLead = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${3}`
    );
    if (data) {
      setTeamLead(data.data);
    }
  };

  const getDepartment = () => {
    if (!Department) return [];
    const depart = [];
    Department.map((dep) => {
      return depart.push({
        label: dep.label,
        id: dep.id,
        value: dep.value,
      });
    });
    return depart;
  };

  useEffect(() => {
    async function getData() {
      getTableData(1);
      getDesignation();
      getTwEmployee();
      getRole();
      getManager();
      getTeamLead();
      getDepartment();
    }
    getData();
  }, []);

  useEffect(() => {
    getTableData(1);
    if (empId) {
      getEmployeeById(empId);
    }
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
    setSelectedEmployee();
    setEmail();
    setMobile();
    setPassword();
    setSelectedDesignationOption();
    setSelectedRole();
    setSelectedManager();
    setSelectedTeamLead();
    setSelectedDepartment();
    setDate();
    setModalShow(false);
  };

  const addEmployee = async () => {
    const teamIdList = [];
    if (Object.keys(selectedTeamLead).length > 0) {
      teamIdList.push(selectedTeamLead.id);
      // selectedTeamLead.map((team) => {
      //     teamIdList.push(team.id);
      //     return team;
      //   });
    }
    const managerList = [];

    if (selectedManager.length > 0) {
      selectedManager.map((mngr) => {
        managerList.push(mngr.id);
        return mngr;
      });
    }

    const postData = {
      full_name: fullName,
      email,
      mobile,
      // designation_id: selectedDesignationOption.id,
      role: selectedRole.id,
      password,
      team_leads: teamIdList,
      managers: managerList,
      dob: date ? customFunctions.getDate(date) : null,
      tw_emp: twId,
      department: selectedDepartment.id,
    };
    if (selectedDesignationOption) {
      postData.designation = selectedDesignationOption.id;
    }

    const isFind = twEmployee.find(
      (item) => item.full_name === selectedEmployee.label
    );
    if (isFind) {
      postData.tw_emp = isFind.tw_id;
      if (employeeId) postData.tw_emp = isFind.tw_id;
    }
    const callback = employeeId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = employeeId
      ? `${Api.employeeUrl}${employeeId}/`
      : Api.employeeUrl;
    const { data } = await callback(endPoint, postData);
    if (data) {
      setSelectedDesignationOption();
      setSelectedRole();
      setModalShow(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setEmployeeId();
          setSelectedDesignationOption();
          setSelectedRole();
          validator.hideMessages();
          setFullName();
          setSelectedEmployee();
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

  const getEmployeeList = () => {
    if (!twEmployee) return [];
    const options = [];
    twEmployee.map((emp) => {
      return options.push({
        label: emp.full_name,
        // id: desgn.id,
      });
    });
    return options;
  };

  const getEmployeeRole = () => {
    if (!role) return [];
    const options = [];
    role.map((data) => {
      return options.push({
        label: data.name,
        id: data.id,
      });
    });
    return options;
  };

  const getManagerList = () => {
    if (!manager) return [];
    const options = [];
    manager.map((data) => {
      return options.push({
        label: data.full_name,
        id: data.id,
        value: data.full_name,
      });
    });
    return options;
  };

  const getTeamLeadList = () => {
    if (!teamLead) return [];
    const options = [];
    teamLead.map((data) => {
      return options.push({
        label: data.full_name,
        id: data.id,
        value: data.full_name,
      });
    });
    return options;
  };

  const onClear = () => {
    setKeyword('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const updateData = (e) => {
    twEmployee.map((emp) => {
      if (emp.full_name === e.label) {
        const name = e.label;
        setEmail(emp.email);
        setFullName(name);
      }
      return emp;
    });
  };

  return (
    <>
      {/* {console.log('validationDate',validationDate)} */}
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee</h2>
        <Breadcrumb items={items} />
      </div>
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
              <div className="custom-header-wrapper">
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
              </div>

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
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => getTableData(1)}
                    >
                      <Image src="images/search.svg" className="svg" />
                    </Button>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="clear-btn">
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
              {pagination.totalItems > 0 ? (
                <Col className="mt-3">
                  <Table
                    tableClass="table table-striped"
                    columns={columns}
                    rows={rows}
                    showPagination
                    paginationProps={{
                      ...pagination,
                      activePage: pagination.current_page,
                      onPageChange: (pageNo) => {
                        getTableData(pageNo);
                      },
                    }}
                    dropdownContainerClass="mb-3"
                  />
                </Col>
              ) : (
                <Col>
                  <p className="text-center mb-0">No record found</p>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
        <ModalInput
          size="lg"
          centered
          show={modalShow}
          label={employeeId ? 'Update Employee' : 'Add Employee'}
          id="contained-modal-title-vcenter"
          modalBody={
            <Form>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="TW Employee"
                    // asterisk="*"
                    options={getEmployeeList()}
                    placeholder="Select Employee"
                    defaultValue={selectedEmployee}
                    onSelectHandler={(select) => {
                      setSelectedEmployee(select);
                      updateData(select);
                    }}
                    // errorMessage={
                    //   selectedEmployee && selectedEmployee > 0
                    //     ? validator.message(
                    //         'setSelectedEmployee',
                    //         selectedDesignationOption,
                    //         'required'
                    //       )
                    //     : ''
                    // }
                  />
                </Col>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setFullName(e.target.value)}
                    label="Full Name"
                    asterisk="*"
                    containerClass="form-group"
                    type="text"
                    name="firstNameTitle"
                    value={fullName}
                    placeholder="Enter Full  Name"
                    errorMessage={validator.message(
                      'Full Name',
                      fullName,
                      'required'
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    asterisk="*"
                    containerClass="form-group"
                    type="text"
                    // name="emailTitle"
                    value={email}
                    placeholder="Enter email"
                    errorMessage={validator.message('email', email, 'required')}
                  />
                </Col>
                {!employeeId && (
                  <Col sm={6}>
                    <TextInput
                      onInputChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      containerClass="form-group"
                      type="password"
                      name="passwordTitle"
                      value={password}
                      placeholder="Enter Password"
                      // errorMessage={validator.message(
                      //   'password',
                      //   password,
                      //   'required'
                      // )}
                    />
                  </Col>
                )}
              </Row>
              <Row>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setMobile(e.target.value);
                      }
                    }}
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
                <Col sm={6}>
                  <DropdownInput
                    label="Designation"
                    asterisk="*"
                    options={getDesignationList()}
                    placeholder="Select Designation"
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
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="Role Name"
                    asterisk="*"
                    options={getEmployeeRole()}
                    placeholder="Select Role"
                    defaultValue={selectedRole}
                    onSelectHandler={(select) => setSelectedRole(select)}
                    errorMessage={validator.message(
                      'Role',
                      selectedRole,
                      'required'
                    )}
                  />
                </Col>
                <Col sm={6}>
                  <DropdownInput
                    label="Manager"
                    // asterisk="*"
                    options={getManagerList()}
                    placeholder="Select Manager"
                    defaultValue={selectedManager}
                    isMulti
                    onSelectHandler={(select) => setSelectedManager(select)}
                    // errorMessage={
                    //   selectedManager && selectedManager > 0
                    //     ? validator.message(
                    //         'Manager',
                    //         selectedDesignationOption,
                    //         'required'
                    //       )
                    //     : ''
                    // }
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="Teamlead"
                    // asterisk="*"
                    options={getTeamLeadList()}
                    placeholder="Select TeamLead"
                    defaultValue={selectedTeamLead}
                    onSelectHandler={(select) => setSelectedTeamLead(select)}
                    // errorMessage={
                    //   selectedTeamLead && selectedTeamLead > 0
                    //     ? validator.message(
                    //         'TeamLead',
                    //         selectedDesignationOption,
                    //         'required'
                    //       )
                    //     : ''
                    // }
                  />
                </Col>
                <Col sm={6}>
                  {/* <TextInput
                    onInputChange={(e) => setDate(e.target.value)}
                    label="DOB"
                    // asterisk="*"
                    containerClass="form-group"
                    type="date"
                    name="DOB"
                    value={date}
                    // placeholder="Enter Contact Number"
                    // errorMessage={validator.message('DOB', mobile, 'required')}
                  /> */}

                  <Datepicker
                    label="DOB"
                    className="form-control"
                    selected={date}
                    placeholder="MM-DD-YYYY"
                    maxDate={maxdate}
                    // minDate={new Date('2-10-2020')}
                    onChange={(e) => {
                      setDate(e);
                    }}
                    errorMessage={validator.message(
                      'DOB',
                      date,
                      `required | before_or_equal:${maxdate}`
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="Department"
                    // asterisk="*"
                    options={getDepartment()}
                    placeholder="Select Department"
                    defaultValue={selectedDepartment}
                    onSelectHandler={(select) => setSelectedDepartment(select)}
                    // errorMessage={
                    //   selectedDepartment && selectedDepartment.length > 0
                    //     ? validator.message(
                    //         'Department',
                    //         selectedDesignationOption,
                    //         'required'
                    //       )
                    //     : ''
                    // }
                    isMulti={false}
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

              <Button
                variant="primary"
                type="submit"
                className="ms-4"
                onClick={(e) => onSubmit(e)}
              >
                {employeeId ? 'Update' : 'Add'}
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
}

export default withRouter(Employee);
