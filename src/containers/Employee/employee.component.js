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
// import customFunctions from '../../helper/customFunctions';
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
  const [TwEmployee, setTwEmployee] = useState([]);
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
  const [twId, setTwId] = useState(null);
  const [date, setDate] = useState('');
  const [empId, setEmpId] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });
  const Department = [
    {
      id: '1',
      value: 'Management',
      label: 'Management',
    },
    {
      id: '2',
      value: 'Development',
      label: 'Development',
    },
    {
      id: '3',
      value: 'Design',
      label: 'Design',
    },
    {
      id: '4',
      value: 'Quality Analyst',
      label: 'Quality Analyst',
    },
    {
      id: '5',
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
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((emp) => {
        // console.log('idd', emp.id);
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

                  // console.log('emp.id',emp.id);
                  setEmpId(emp.id);
                  setCntClearFilter(cntClearFilter + 1);
                }}
              >
                <Image src="images/edit.svg" />
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
    // console.log('id', id);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${id}/`
    );

    // TwEmployee.map((tw) => {
    //   console.log('tw',tw);
    //   return tw;
    // })

    if (data && data.data) {
      // const list=[]
      // teamLead.map((team) => {
      //    console.log('team', team);
      //   data.data.assigned_team_leads.map((assign)=> {
      //     console.log('assign', assign);
      //     console.log('team.id === assign',team.id !== assign);
      //     // (team.id === assign)? setSelectedTeamLead()
      //     if(team.id === assign){
      //       console.log('object if');
      //       list.push({label:team.full_name})
      //     }
      //     return assign;
      //   })
      //   return team;
      //   setSelectedTeamLead(list)
      // });

      // Department.map((dept) => {
      //   console.log('dept',dept.id);
      //   console.log('data.data.department_id',data.data.department_id);
      //   console.log('ifDepartm', data.data.department_id === dept.id);
      //   if(data.data.department_id === dept.id){
      //     console.log('if stat');
      //     setSelectedDepartment({
      //       label:dept.label,
      //       id:dept.id
      //     })
      //   }
      //   return dept;
      // })

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
      setDate(data.data.dob);
      setPassword(data.data.password);
      setMobile(data.data.mobile);
    }
  };

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}`);
    if (data) {
      // console.log('designationdata', data);
      setDesignation(data.data);
    }
  };

  const getTwEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.TwEmployeeUrl}`);
    if (data && data.data) {
      // console.log('data.data', data.data);
      setTwEmployee(data.data);
      // setTwId(data.data.tw_id);
      // console.log('twid', data.tw_id);
      // console.log('tw_id', TwId);
    }
  };

  const getRole = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.roleUrl}`);
    if (data) {
      // console.log('data', data);
      setRole(data.data);
    }
  };

  const getManager = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${3}`
    );
    if (data) {
      // console.log('data', data);
      setManager(data.data);
    }
  };

  const getTeamLead = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${2}`
    );
    if (data) {
      // console.log('data', data);
      setTeamLead(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
      // console.log('empId', empId);

      getTableData(1);
      getDesignation();
      getTwEmployee();
      getRole();
      getManager();
      getTeamLead();
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
    selectedTeamLead.map((team) => {
      teamIdList.push(team.id);
      return team;
    });

    const managerList = [];
    selectedManager.map((mngr) => {
      managerList.push(mngr.id);
      return mngr;
    });

    // const departmentList = [];

    // selectedDepartment.map((dep) => {
    //   managerList.push(dep.id);
    //   return dep;
    // })

    // const roleList = [];
    // selectedRole.map((roleId) => {
    //   roleList.push(roleId.id);
    //   return roleId;
    TwEmployee.map((tw) => {
      if (tw.full_name === fullName) {
        setTwId(tw.id);
      }
      return tw;
    });

    const postData = {
      full_name: fullName,
      email,
      mobile,
      // designation_id: selectedDesignationOption.id,
      role: selectedRole.id,
      password,
      team_leads: teamIdList,
      managers: managerList,
      dob: date, // customFunctions.getDate(date),
      tw_emp: twId,
      department: selectedDepartment.id,
    };
    if (selectedDesignationOption) {
      postData.designation_id = selectedDesignationOption.id;
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
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setEmployeeId();
          setSelectedDesignationOption();
          setSelectedRole();
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

  const getEmployeeList = () => {
    if (!TwEmployee) return [];
    const options = [];
    TwEmployee.map((emp) => {
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

  const onClear = () => {
    setKeyword('');
    setCntClearFilter(cntClearFilter + 1);
  };

  return (
    <>
      {/* {console.log('selectedRole', selectedRole)} */}

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
                  <div className="float-end mt-1">
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
                  <DropdownInput
                    label="TW Employee"
                    asterisk="*"
                    options={getEmployeeList()}
                    placeholder="Select Employee"
                    defaultValue={selectedEmployee}
                    onSelectHandler={(select) => setSelectedEmployee(select)}
                    errorMessage={
                      selectedEmployee && selectedEmployee > 0
                        ? validator.message(
                            'setSelectedEmployee',
                            selectedDesignationOption,
                            'required'
                          )
                        : ''
                    }
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
                    placeholder="Enter first name"
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
                    name="emailTitle"
                    value={email}
                    placeholder="Enter email"
                    errorMessage={validator.message('email', email, 'required')}
                  />
                </Col>
                {!empId && (
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
                )}
              </Row>
              <Row>
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
                    errorMessage={
                      selectedDesignationOption &&
                      selectedDesignationOption.length > 0
                        ? validator.message(
                            'Designation',
                            selectedDesignationOption,
                            'required'
                          )
                        : ''
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="RollName"
                    asterisk="*"
                    options={getEmployeeRole()}
                    placeholder="Select Role"
                    defaultValue={selectedRole}
                    onSelectHandler={(select) => setSelectedRole(select)}
                    errorMessage={
                      selectedRole && selectedRole > 0
                        ? validator.message('Role', selectedRole, 'required')
                        : ''
                    }
                  />
                </Col>
                <Col sm={6}>
                  <DropdownInput
                    label="Manager"
                    asterisk="*"
                    options={getManagerList()}
                    placeholder="Select Manager"
                    defaultValue={selectedManager}
                    isMulti
                    onSelectHandler={(select) => setSelectedManager(select)}
                    errorMessage={
                      selectedManager && selectedManager > 0
                        ? validator.message(
                            'Manager',
                            selectedDesignationOption,
                            'required'
                          )
                        : ''
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="Teamlead"
                    asterisk="*"
                    options={getTeamLeadList()}
                    placeholder="Select TeamLead"
                    defaultValue={selectedTeamLead}
                    isMulti
                    onSelectHandler={(select) => setSelectedTeamLead(select)}
                    errorMessage={
                      selectedTeamLead && selectedTeamLead > 0
                        ? validator.message(
                            'TeamLead',
                            selectedDesignationOption,
                            'required'
                          )
                        : ''
                    }
                  />
                </Col>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setDate(e.target.value)}
                    label="DOB"
                    asterisk="*"
                    containerClass="form-group"
                    type="date"
                    name="DOB"
                    value={date}
                    // placeholder="Enter Contact Number"
                    errorMessage={validator.message('DOB', mobile, 'required')}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    label="Department"
                    asterisk="*"
                    options={getDepartment()}
                    placeholder="Select Department"
                    defaultValue={selectedDepartment}
                    onSelectHandler={(select) => setSelectedDepartment(select)}
                    errorMessage={
                      selectedDepartment && selectedDepartment.length > 0
                        ? validator.message(
                            'Department',
                            selectedDesignationOption,
                            'required'
                          )
                        : ''
                    }
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
