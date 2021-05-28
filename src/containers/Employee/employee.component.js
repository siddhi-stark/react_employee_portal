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
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Employee' },
];

const currentdate = new Date();
const maxdate = new Date(currentdate.setYear(currentdate.getFullYear() - 18));

const validator = new SimpleReactValidator();

function Employee() {
  // const validator = useRef(new SimpleReactValidator());
  let searchFormSubmit = false;
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
  const [addButton, setAddButton] = useState(false);
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
  const [twId, setTwId] = useState(null);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [filterErr, setFilterErr] = useState('');
  let timmer = null;
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
                getEmployeeById(id);
                setAddButton(true);
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
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.employeeUrl}?sort_by=full_name&sort_direction=ascending`;

    const params = {
      limit: pagination.itemsPerPage,
      page,
      keyword: searchFormSubmit ? searchKeyword : '',
    };

    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: Number(data.paginator.current_page),
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

    if (customFunctions.checkIfEmpty(data && data.data, 'A')) {
      const managerList = [];

      teamLead.map((team) => {
        data.data.assigned_team_leads.map((assign) => {
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
      setSelectedDesignationOption(data.data.designation_id ? {

        label: data.data.designation_name,
        id: data.data.designation_id,
      } : '');

      setSelectedRole(data.data.role_id ? {
        label: data.data.role_name,
        id: data.data.role_id,
      } : '');

      setFullName(data.data.full_name);
      setEmail(data.data.email);
      setPassword(data.data.password);
      setMobile(data.data.mobile);
      setDate(data.data.dob ? new Date(data.data.dob) : null);
      // setDate(new Date(data.data.dob) || '');
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
      const uRole = customFunctions.getLocalStorage('group');
      setUserRole(Number(uRole));
      // getDesignation();
      // getTwEmployee();
      // getRole();
      // getManager();
      // getTeamLead();
      // getDepartment();
      setTitle('Employee');
    }
    getData();
  }, []);

  useEffect(() => {
    if (addButton) {
      getDesignation();
      getTwEmployee();
      getRole();
      getManager();
      getTeamLead();
      getDepartment();
    }
  }, [addButton]);

  useEffect(() => {
    getTableData(pagination.current_page);
    const uRole = customFunctions.getLocalStorage('group');
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
    // setSelectedDesignationOption();
    validator.hideMessages();
    setAddButton(false);
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
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getTableData(1);
      setDisableButton(false);
    }, 1000);
  };

  const addEmployee = async () => {
    const teamIdList = [];
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
      (item) => selectedEmployee && selectedEmployee.label && item.full_name === selectedEmployee.label
    );
    if (isFind) {
      postData.tw_emp = isFind.tw_id;
      if (employeeId) postData.tw_emp = isFind.tw_id;
    }

    const payload = customFunctions.cleanObject(postData);

    const callback = employeeId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = employeeId
      ? `${Api.employeeUrl}${employeeId}/`
      : Api.employeeUrl;

    const { data, message } = await callback(endPoint, payload);
    if (data) {
      validator.hideMessages();
      setAddButton(false);
      setSelectedDesignationOption();
      // setSelectedRole();
      setModalShow(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setDisableButton(false);
          setEmployeeId();
          setSelectedDesignationOption();
          setSelectedRole();
          setFullName();
          setSelectedEmployee();
          setEmail();
          setPassword();
          setMobile();
          setSelectedManager();
          setDate();
          setSelectedTeamLead();
          setSelectedDepartment();
          setModalShow(false);
          getTableData(pagination.current_page);
        }
      });
    } else {
      setModalShow(false);
      const errorData = message.split(':');
      // swal(errorData[1], '', 'error');
      swal({
        title: errorData[1],
        icon: 'error',
      })
        .then(okAction => {
          if (okAction) {
           setModalShow(true);
           setMobile('');
          }
        });
      setDisableButton(false);
      // setModalShow(true);
      // setEmployeeId();
      // setSelectedDesignationOption();
      // setSelectedRole();
      // setFullName();
      // setSelectedEmployee();
      // setEmail();
      // setPassword();
      // setMobile();
      // setSelectedManager();
      // setDate();
      // setSelectedTeamLead();
      // setSelectedDepartment();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.allValid()) {
      addEmployee();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
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
    searchFormSubmit= false;
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

    if (customFunctions.checkIfEmpty(searchKeyword)) {
      searchFormSubmit = false;
      filterSearchErr = 'Please enter search keyword';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      searchFormSubmit=true;
      setFilterErr('');
      getTableData(1);
    }
  };

  validator.purgeFields();

  return (
    <>
      <Helmet title={title} />
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
                <h4 className="text-primary mt-2 mb-2">Employee</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[1]} roleId={userRole}>
                    <a
                      href="#"
                      onClick={() => {
                        setModalShow(true);
                        setEmployeeId();
                        setAddButton(true);
                      }}
                      className="btn-link"
                    >
                      Add Employee
                    </a>
                  </UserRestrictions>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Table
                  columns={columns}
                  rows={rows}
                  showPagination="true"
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
        onHide={onCancel}
        label={employeeId ? 'Update Employee' : 'Add Employee'}
        id="contained-modal-title-vcenter"
        modalBody={
          <Form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            autocomplete="off"
          >
            <Row>
              <Col sm={6}>
                <DropdownInput
                  label="TW Employee"
                  options={getEmployeeList()}
                  placeholder="Select Employee"
                  defaultValue={selectedEmployee}
                  onSelectHandler={(select) => {
                    setSelectedEmployee(select);
                    updateData(select);
                  }}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[a-zA-Z .]*$/;
                    if (!e.target.value || re.test(e.target.value)) {
                      setFullName(e.target.value);
                    }
                  }}
                  label="Full Name"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="firstNameTitle"
                  value={fullName}
                  maxlength="10"
                  placeholder="Enter Full  Name"
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
                  autocomplete="false"
                  asterisk="*"
                  containerClass="form-group"
                  type="email"
                  value={email}
                  placeholder="Enter email"
                  errorMessage={validator.message(
                    'email',
                    email,
                    'required'
                  )}
                />
              </Col>
              {!employeeId && (
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
                    errorMessage={!employeeId && validator.message('password', password, 'required')}
                  />
                </Col>
              )}

              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (!e.target.value || re.test(e.target.value)) {
                      setMobile(e.target.value);
                    }
                  }}
                  autocomplete="off"
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
                    'required|phone'
                  )}
                />
              </Col>
              <Col sm={6}>
                <DropdownInput
                  label="Designation"
                  asterisk="*"
                  options={getDesignationList()}
                  placeholder="Select Desination"
                  defaultValue={selectedDesignationOption}
                  onSelectHandler={(select) => {
                    setSelectedDesignationOption(select);
                  }}
                  errorMessage={validator.message(
                    'Designation',
                    selectedDesignationOption,
                    'required'
                  )}
                />
              </Col>

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
                  options={getManagerList()}
                  placeholder="Select Manager"
                  defaultValue={selectedManager}
                  isMulti
                  onSelectHandler={(select) => {
                    setSelectedManager(select);
                  }}
                />
              </Col>

              <Col sm={6}>
                <DropdownInput
                  label="Teamlead"
                  options={getTeamLeadList()}
                  placeholder="Select TeamLead"
                  defaultValue={selectedTeamLead}
                  onSelectHandler={(select) => setSelectedTeamLead(select)}
                />
              </Col>
              <Col sm={6}>
                <Datepicker
                  label="DOB"
                  className="form-control"
                  selected={date}
                  placeholder="dd/mm/yyyy"
                  maxDate={maxdate}
                  dateFormat="dd/MM/yyyy"
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

              <Col sm={6}>
                <DropdownInput
                  label="Department"
                  options={getDepartment()}
                  placeholder="Select Department"
                  defaultValue={selectedDepartment}
                  onSelectHandler={(select) => setSelectedDepartment(select)}
                  isMulti={false}
                />
              </Col>
            </Row>
            <div className="float-end">
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>

              <Button
                variant="primary"
                type="submit"
                className="ms-4"
                disabled={disableButton}
              >
                {employeeId ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        }
      />
    </>
  );
}

export default withRouter(Employee);
