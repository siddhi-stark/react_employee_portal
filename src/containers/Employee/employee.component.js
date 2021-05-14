import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Image,
  Button,
  Form,
  Accordion,
} from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import {
  ModalInput,
  TextInput,
  DropdownInput,
  Datepicker,
  Helmet,
} from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

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
  const [searchKeyword, setSearchKeyword] = useState('');
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
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  // const [validationDate, setValidationDate] = useState('');
  const [twId, setTwId] = useState(null);
  const [date, setDate] = useState('');
  // const [empId, setEmpId] = useState('');
  const [title, setTitle] = useState('');
  const [userRole, setUserRole] = useState('');
  const [filterErr, setFilterErr] = useState('');
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

  const columns = [
    {
      id: 'id',
      label: 'Id',
      roleAccess: [1],
      isDisplay: false,
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1],
    },
    {
      id: 'name',
      label: 'Full Name',
      roleAccess: [1, 3],
    },
    {
      id: 'email',
      label: 'Email',
      roleAccess: [1, 3],
    },
    {
      id: 'mobile',
      label: 'Mobile',
      roleAccess: [1, 3],
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1],
      render: ({ id }) => {
        return (
          <>
            <a
              href="/"
              className="pl-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalShow(true);
                setEmployeeId(id);

                // setEmpId(id);
                getEmployeeById(id);
                setCntClearFilter(cntClearFilter + 1);
              }}
            >
              <Image src="images/edit-button.svg" />
            </a>
            <a
              href="/"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEmployeeId(id);
                deleteEmployee(id);
                // removeDesignation(desgn.id); //eslint-disable-line
              }}
            >
              <Image src="images/delete.png" />
            </a>
          </>
        );
      },
    },
  ];

  const getTableData = async (pageNo = 0) => {
    // let endPoint;
    // const hasSearch = (keyword !== '');
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.employeeUrl}`;

    const params = {
      page,
      limit: pagination.itemsPerPage,
      keyword: searchKeyword,
    };

    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];
      data.data.map((emp, i) => {
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          id: emp.id,
          name: emp.full_name,
          email: emp.email,
          mobile: emp.mobile,
        };
        row.push(setRowData);
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
      const managerList = [];

      teamLead.map((team) => {
        data.data.assigned_team_leads.map((assign) => {
          // (team.id === assign)? setSelectedTeamLead()
          if (team.id === assign) {
            setSelectedTeamLead({
              id: team.id,
              label: team.full_name,
            });
          }

          return assign;
        });
        return team;
      });

      manager.map((mngr) => {
        data.data.assigned_managers.map((assgnmgmr) => {
          if (mngr.id === assgnmgmr) {
            managerList.push({
              id: mngr.id,
              label: mngr.full_name,
              value: mngr.full_name,
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
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setDesignation(data.data);
    }
  };

  const getTwEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.TwEmployeeUrl}?sort_by=full_name&sort_direction=ascending`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setTwEmployee(data.data);
    }
  };

  const getRole = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.roleUrl}`);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setRole(data.data);
    }
  };

  const getManager = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${2}`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setManager(data.data);
    }
  };

  const getTeamLead = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${3}`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
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
      const uRole = localStorage.getItem('group');
      setUserRole(Number(uRole));
      getTableData(1);
      getDesignation();
      getTwEmployee();
      getRole();
      getManager();
      getTeamLead();
      getDepartment();
      setTitle('Employee');
    }
    getData();
  }, []);

  useEffect(() => {
    getTableData(1);
    const uRole = localStorage.getItem('group');
    setUserRole(Number(uRole));
  }, [cntClearFilter]);

  const deleteEmployee = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the employee?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.employeeUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getTableData(1);
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  };

  const onCancel = () => {
    setSelectedDesignationOption();
    validator.hideMessages();
    setFullName('');
    setSelectedEmployee('');
    setEmail('');
    setMobile('');
    setPassword('');
    setSelectedDesignationOption('');
    setSelectedRole('');
    setSelectedManager('');
    setSelectedTeamLead(null);
    setSelectedDepartment('');
    setDate();
    setModalShow(false);
  };

  const addEmployee = async () => {
    const teamIdList = [];
    // if (Object.keys(selectedTeamLead).length > 0) {
    //   teamIdList.push(selectedTeamLead.id);
    //   console.log('teamlead',selectedTeamLead.id);
    //   // selectedTeamLead.map((team) => {
    //   //     teamIdList.push(team.id);
    //   //     return team;
    //   //   });
    // }
    if (selectedTeamLead) {
      teamIdList.push(selectedTeamLead.id);
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
    setFilterErr('');
    setSearchKeyword('');
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

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (searchKeyword === '') {
      filterSearchErr = 'Please enter search keyword';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getTableData(1);
    }
  };

  return (
    <>
      <Helmet title={title} />
      {/* {console.log('validationDate',validationDate)} */}
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee</h2>
        <Breadcrumb items={items} />
      </div>

      <section className="content-area">
        <div className="mt-5">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary m-0">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Card.Title>
                    <Form onSubmit={(e) => filterSearch(e)}>
                      {filterErr && (
                        <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                          <div className="img-text">
                            <img src="images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )}
                      <Row className="mt-3">
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <TextInput
                              value={searchKeyword}
                              placeholder="Search keyword"
                              onInputChange={(e) => {
                                setFilterErr('');
                                setSearchKeyword(e.target.value);
                              }}
                            />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="filter-btn">
                            <Button
                              variant="primary"
                              type="submit"
                              className="ms-4"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="primary"
                              type="button"
                              className="ms-4"
                              onClick={() => onClear()}
                            >
                              Clear
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Add Employee</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    onClick={() => {
                      setModalShow(true);
                      setEmployeeId();
                    }}
                    className="btn-link"
                  >
                    Add Employee
                  </a>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Table
                  role={Number(userRole)}
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
                  tableClass="table-striped"
                  dropdownContainerClass="mb-3"
                  emptyRender={() => (
                    <p className="text-center mb-0">No record found</p>
                  )}
                />
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
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
                  onInputChange={(e) => {
                    const re = /^[a-zA-Z .]*$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      setFullName(e.target.value);
                    }
                  }}
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
                  errorMessage={validator.message('mobile', mobile, 'required')}
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
                  onSelectHandler={(select) => {
                    setSelectedManager(select);
                  }}
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
    </>
  );
}

export default withRouter(Employee);
