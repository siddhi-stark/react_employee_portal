import React, { useState, useEffect } from 'react';
import { withRouter, useHistory, Link } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Row, Col, Card, Button, Image,Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import {
  ModalInput,
  TextInput,
  DropdownInput,
  Datepicker,
  Helmet,
} from '../../components/FormInputs';
import FormSections from './EmployeeFilterSchema.json';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';

function CurrentEmployee() {
  const currentdate = new Date();
  const maxdate = new Date(currentdate.setYear(currentdate.getFullYear() - 18));

  const validator = new SimpleReactValidator(
    {
      validators: {
        emailValidate: {
          message: 'The :attribute domain name should be starkdigital.net.',
          rule: (val, params, valid) => {

            return valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.net$/i) && params.indexOf(val) === -1;
          }
        }
      }
    }
  );

  const [employee, setEmployee] = useState([]);
  const [totalCount, setTotalCount] = useState(9);
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState('');
  const [options, updateOptions] = useState({});
  const [filterData, setFilterData] = useState({});
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [isShowLoader, setShowLoader] = useState(false);
  
  const [modalShow, setModalShow] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState([]);
  const [twEmployee, setTwEmployee] = useState([]);
  const [mentorData, setMentorData] = useState([]);
  const [addButton, setAddButton] = useState(false);
  const [role, setRole] = useState([]);
  const [manager, setManager] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [teamLead, setTeamLead] = useState([]);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [twId, setTwId] = useState(null);
  const [date, setDate] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [employeetwId, setEmployeeTwId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [newDepartment,setNewDepartment] = useState([]);
  const [projectTeam,setProjectTeam] = useState([]);
  const [selectedProjectTeam, setSelectedProjectTeam] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [selectedMentor, setSelectedMentor] = useState([]);

  let timmer = null;
  const history = useHistory();

  const getEmployeeData = async (pageNo = 1) => {
    setShowLoader(true);
    setEmployee([]);

    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      sort_by: 'full_name',
      limit,
      page,
      designation_id:
        filterData && filterData.position ? filterData.position.value : '',
      user_id:
        filterData && filterData.employee ? filterData.employee.value : '',
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setShowLoader(false);
      setEmployee([...data.data]);

      setTotalCount(Number(data.paginator.total_count));
      setLimit(Number(data.paginator.limit));
      setCurrentPage(Number(data.paginator.current_page));
    }
  };

  useEffect(() => {
    setTitle('Current Employees');
    getEmployeeData(1);
    getEmployeeName();
    getPosition();
  }, [filterData]);
  
  const submitForm = async (formValues) => {
    setFilterData(formValues); //eslint-disable-line
  };

  const getEmployeeName = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_dropdown=1`
    );

    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.full_name, value: op.id };
      });
    options.employee = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.position = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getEmployeeById = async (id) => { // eslint-disable-line
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${id}/`
    );

    if (customFunctions.checkIfEmpty(data && data.data, 'A')) {
      const managerList = [];
      const mentorList = [];

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

      projectTeam.map((pt) => {
        if(pt.id === data.data.team_id) {
          setSelectedProjectTeam({
          id: pt.id,
          label: pt.name,
          });
        }
        return pt;
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

      mentorData.map((mntr) => {
        data.data.assigned_mentors.map((assgnmntr) => {
          if (mntr.id === assgnmntr) {
           
            mentorList.push({
              id: mntr.id,
              label: mntr.full_name,
              value: mntr.full_name,
            });
          }
          return assgnmntr;
        });
        setSelectedMentor(mentorList);
        return mntr;
      });

      twEmployee.map((tw) => {
        if (data.data.tw_id === tw.tw_id) {
          setSelectedEmployee({ label: tw.full_name });
          setTwId(tw.tw_id);
        }
        return tw;
      });

      newDepartment.map((dept) => {
        if (data.data.department_id === dept.id) {
           setSelectedDepartment({
              id: dept.id,
              label: dept.name,
            });
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
      setJoiningDate(data.data.date_joined ? new Date(data.data.date_joined) : null);
      setEmpCode(data.data.emp_code);
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

  const getNewDapartment = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=department`
      
    );
    if (data && data.data) {
      setNewDepartment(data.data.department);
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

  const getMentorList = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?sort_by=full_name&sort_direction=ascending&type=all&is_dropdown=1`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setMentorData(data.data);
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
      `${Api.employeeUrl}?role_id=${2}&is_dropdown=1&show_self=True`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setManager(data.data);
    }
  };

  const getTeamLead = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${3}&is_dropdown=1`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setTeamLead(data.data);
    }
  };

  const getTeam = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.InterviewRoundsUrl}?constant_type=team`);
    if(data && data.data) {
      setProjectTeam(data.data.team);
    }
  };
  
  useEffect(() => {
    async function getData() {
      const uRole = customFunctions.getLocalStorage('group');
      setUserRole(Number(uRole));
      setTitle('Employee');
    }
    getData();
  }, []);

  useEffect(() => {
    getDesignation();
    getTwEmployee();
    getRole();
    getManager();
    getTeamLead();
    getNewDapartment();
    getTeam();
    getMentorList();
  }, [addButton]);

  useEffect(() => {
    getEmployeeData(currentPage);
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
              getEmployeeData(currentPage);
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
    validator.hideMessages();
    setEmployeeTwId('');
    setAddButton(false);
    setFullName('');
    setEmpCode('');
    setJoiningDate('');
    setSelectedEmployee('');
    setEmail('');
    setMobile('');
    setPassword('');
    setSelectedDesignationOption('');
    setSelectedRole('');
    setSelectedManager('');
    setSelectedTeamLead('');
    setSelectedDepartment('');
    setSelectedMentor('');
    setDate();
    setModalShow(false);
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getEmployeeData(1);
      setDisableButton(false);
    }, 1000);
  };

  const addEmployee = async () => {
    setShowLoader(true);
    const teamIdList = [];
    if (selectedTeamLead) {
      teamIdList.push(selectedTeamLead.id);
    }

    const managerList = [];
    if (selectedManager && selectedManager.length > 0) {
      selectedManager.map((mngr) => {
        managerList.push(mngr.id);
        return mngr;
      });
    }

    const mentorList = [];
    if(selectedMentor && selectedMentor.length > 0) {
      selectedMentor.map((mt) => {
        mentorList.push(mt.id);
        return mt;
      });
    }

    const postData = {
      full_name: fullName,
      email,
      mobile,
      role: selectedRole.id,
      team: selectedProjectTeam.id,
      password,
      emp_code: empCode && !employeeId  ? Number(empCode.split('-')[1]) : '',
      team_leads: teamIdList,
      managers: managerList,
      dob: date ? customFunctions.getDate(date) : null,
      date_joined: joiningDate ? customFunctions.getDate(joiningDate) : null,
      tw_emp: twId,
      department: selectedDepartment.id,
      mentor:mentorList
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
      setShowLoader(false);
      validator.hideMessages();
      setAddButton(false);
      setSelectedDesignationOption();
      setModalShow(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setEmpCode('');
          setDisableButton(false);
          setEmployeeTwId('');
          setEmployeeId();
          setSelectedDesignationOption();
          setSelectedRole();
          setFullName();
          setSelectedEmployee();
          setEmail();
          setPassword();
          setMobile();
          setSelectedManager();
          setSelectedMentor();
          setDate();
          setJoiningDate();
          setSelectedTeamLead();
          setSelectedDepartment();
          setModalShow(false);
          getEmployeeData(currentPage);
        }
      });
    } else {
      setShowLoader(false);
      setModalShow(false);
      swal({
        title: message,
        icon: 'error',
      })
        .then(okAction => {
          if (okAction) {
            setModalShow(true);
          }
        });
      setDisableButton(false);
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
    const op = [];
    designation.map((desgn) => {
      return op.push({
        label: desgn.name,
        id: desgn.id,
      });
    });
    return op;
  };

  const getEmployeeList = () => {
    if (!twEmployee) return [];
    const op = [];
    twEmployee.map((emp) => {
      return op.push({
        label: emp.full_name,
        id: emp.tw_id,

      });
    });
    return op;
  };

  const getMentorData = () => {
    if(!mentorData) return [];
    const op = [];
    mentorData.map((mntr) => {
      return op.push({
        label: mntr.full_name,
        id: mntr.id,
        value: mntr.full_name
      });
    });
    return op;
  };

  const getEmployeeRole = () => {
    if (!role) return [];
    const op = [];
    role.map((data) => {
      return op.push({
        label: data.name,
        id: data.id,
      });
    });
    return op;
  };

  const getManagerList = () => {
    if (!manager) return [];
    const op = [];
    manager.map((data) => {
      return op.push({
        label: data.full_name,
        id: data.id,
        value: data.full_name,
      });
    });
    return op;
  };

  const getDepartment = () => {
    if (!newDepartment) return [];
    const depart = [];
    newDepartment.map((dep) => {
      return depart.push({
        label: dep.name,
        id: dep.id,
        value: dep.name,
      });
    });
    return depart;
  };

  const getTeamLeadList = () => {
    if (!teamLead) return [];
    const op = [];
    if(Number(selectedRole && selectedRole.id) !== 3){
      teamLead.map((data) => {
        return op.push({
          label: data.full_name,
          id: data.id,
          value: data.full_name,
        });
      });
    }
    return op;
  };

  const getProjectTeam = () => {
    if (!teamLead) return [];
    const op = [];
    projectTeam.map((data) => {
      return op.push({
        label: data.name,
        id: data.id,
        value: data.name,
      });
    });
    return op;
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

  const getMobile = (value) => {
    let event = value.replace(/\D/g, '');
    if (event.length === 0) {
      event = '';
    } else if (event.length > 6) {
      event = event.substring(0, 5);
    }
    return event !== '' ? `SDMS-${event}` : ''; 

  };
 
  validator.purgeFields();

  return (
    <>
      <Helmet title={title} />
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
            <Card>
            <Card.Body>
             <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              { (Number(userRole) === 1 || Number(userRole) === 5 || Number(userRole) === 6) && (
                <Link
                  className="float-end btn btn-primary"
                  title="Add Employee"
                  onClick={() => {
                    setModalShow(true);
                    setAddButton(true);
                    setEmployeeId('');
                    setEmail('');
                    setPassword('');
                    setSelectedTeamLead('');
                    
                  }}
                >
                  Add Employee
                </Link>
            )}
            </div>  
            <hr/>
            <div className="filter-box-main">
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={FormSections}
                formHeading="filter form"
                onFormSubmit={(formValues) => {
                  submitForm(formValues);
                }}
                options={options}
                callbacks={{}}
                defaultFormValues={defaultValues}
                submitBtnText="Apply"
                showResetBtn={true}
                showBtnClass={true}
                resetBtnText="Clear"
                btnContainerClass="form-submit-buttons pull-right"
                isStepForm={false}
                onFormReset={() => {
                  setFilterData({});
                }}
              />
              </div>
            </Card.Body>
            </Card>
        </div>
        <div className="row mt-3 row-cols-1 row-cols-md-3 g-4 employee-grid-list">
          {employee &&
            employee.map((emp) => (
              <Col>
                <Card className="h-100">
                  <Card.Body>
                    <Row>
                      <Col className="col-md-4">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image
                            className="card-img-top"
                            src={
                              emp.profile_image_url
                                ? `${emp.profile_image_url}`
                                : `${Api.s3UrlnoProfile}`
                            }
                            alt="Card image cap"
                          />
                          {emp.on_notice_period === true && (
                            <span className="np-sup">NP</span>
                          )}
                        </span>
                      </Col>
                      <Col className="col-md-8">
                      { (Number(userRole) === 1 || Number(userRole) === 5 || Number(userRole) === 6) && (
                          <>
                            <Link
                              className="float-end ml-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEmployeeId(emp.id);
                                deleteEmployee(emp.id);
                              }}
                            >
                              <Image src="/images/delete.png" />
                            </Link>
                            <Link
                              className="float-end"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setModalShow(true);
                                setEmployeeId(emp.id);
                                getEmployeeById(emp.id);
                                setAddButton(true);
                                setCntClearFilter(cntClearFilter + 1);
                              }}
                            >
                              <Image src="/images/edit-button.svg" />
                            </Link>
                          </>
                        )}
                        <Card.Title>{emp.name}</Card.Title>
                        <p className="card-text employee-details">
                          {emp.full_name}
                          <span> {emp.designation_name}</span>
                        </p>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="col-md-12">
                        <p className="text-primary confirmation-date">
                          {' '}
                          {emp.confirmation_date &&
                            !emp.on_notice_period &&
                            `confirmation Date-`}
                          {emp.confirmation_date &&
                            !emp.on_notice_period &&
                            customFunctions.getDMYDate(emp.confirmation_date)}
                          {!emp.confirmation_date &&
                            emp.date_joined &&
                            !emp.on_notice_period &&
                            `Joining Date-`}
                          {!emp.confirmation_date &&
                            emp.date_joined &&
                            !emp.on_notice_period &&
                            customFunctions.getDMYDate(emp.date_joined)}
                          {emp.on_notice_period &&
                            emp.notice_period_date &&
                            `Relieving Date-`}
                          {emp.on_notice_period &&
                            emp.notice_period_date &&
                            customFunctions.getDMYDate(emp.relieving_date)}
                        </p>{' '}
                        <h6> {emp.bond_details_list && emp.bond_details_list[0] && emp.bond_details_list[0].start_date && `Bond start date- ${customFunctions.getDMYDate(emp.bond_details_list[0].start_date)}`}
                        </h6>
                        <h6> {emp.bond_details_list && emp.bond_details_list[0] && emp.bond_details_list[0].end_date && `Bond end date- ${customFunctions.getDMYDate(emp.bond_details_list[0].end_date)}`}
                        </h6>
                        <br />
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="card-footer-view">
                    <h4 className="text-primary">SDMS{emp.emp_code}</h4>
                    <Button
                      size="sm"
                      className="pull-right"
                      onClick={() => {
                        history.push(`/employee-profile/${emp.id}`);
                        localStorage.setItem('employeeName', emp.full_name);
                        customFunctions.setLocalStorage(
                          'title',
                          emp.designation_name
                        );
                        localStorage.setItem('candidateId', emp.id);
                      }}
                    >
                      View
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
        </div>
        <Pagination
          totalItems={totalCount}
          current_page={currentPage}
          itemsPerPage={limit}
          onPageChange={(pageNo) => {
            getEmployeeData(pageNo);
          }}
        />
        {(totalCount < 1 ) && (
        <p className="text-center"> No records found</p>
      )}
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
              {!employeeId && (

                <Col sm={6}>
                  <DropdownInput
                    label="TW Employee"
                    options={getEmployeeList()}
                    placeholder="Select Employee"
                    defaultValue={selectedEmployee}
                    onSelectHandler={(select) => {
                      setSelectedEmployee(select);
                      updateData(select);
                      setEmployeeTwId(select.id);
                    }}
                    disabled={employeeId && 'disabled'}
                  />
                </Col>
              )}
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[a-zA-Z ]*$/;
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
                  disabled={(employeeId || employeetwId) && 'disabled'}
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
                  autocomplete="off"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  disabled={(employeeId || employeetwId) && 'disabled'}

                  value={email}
                  placeholder="Enter email"
                  errorMessage={validator.message(
                    'email',
                    email,
                    'required|emailValidate|email' // eslint-disable-line
                  )}
                />
              </Col>
              {!employeeId && (
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    autocomplete="off"
                    asterisk="*"
                    containerClass="form-group"
                    type="password"
                    // minlength="6"
                    name="passwordTitle"
                    value={password}
                    placeholder="Enter Password"
                    errorMessage={!employeeId && validator.message('password', password, 'required|min:6')}
                  />
                </Col>
              )}

              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => { setEmpCode(getMobile(e.target.value)); }}
                  autocomplete="off"
                  label="Employee Code"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="codeTitle"
                  maxlength="11"
                  disabled={employeeId ? 'disabled' : ''}
                  value={empCode}
                  placeholder="Enter Employee Code"
                  errorMessage={validator.message(
                    'Employee Code',
                    empCode,
                    'required|'
                  )}
                />
              </Col>

              <Col sm={6}>
                <Datepicker
                  label="Joining Date"
                  asterisk="*"
                  className="form-control"
                  selected={joiningDate}
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  onChange={(e) => {
                    setJoiningDate(e);
                  }}
                  errorMessage={validator.message(
                    'Joining Date',
                    joiningDate,
                    'required'
                  )}
                />
              </Col>

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
                    'required|phone|min:10'
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
                  onSelectHandler={(select) => {
                    setSelectedRole(select);
                    if(Number(select && select.id) === 3){
                      setSelectedTeamLead('');
                    }
                  }}
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
                  label="Team Lead"
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
                  asterisk="*"
                  options={getDepartment()}
                  placeholder="Select Department"
                  defaultValue={selectedDepartment}
                  onSelectHandler={(select) => setSelectedDepartment(select)}
                  isMulti={false}
                  errorMessage={validator.message(
                    'Department',
                    selectedDepartment,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
                <DropdownInput
                  label="Team"
                  options={getProjectTeam()}
                  placeholder="Select Team"
                  defaultValue={selectedProjectTeam}
                  onSelectHandler={(select) => setSelectedProjectTeam(select)}
                />
              </Col>
              {employeeId && (
             <Col sm={6}>
                <DropdownInput
                  label="Reporting Person"
                  options={getMentorData()}
                  placeholder="Select Mentor"
                  defaultValue={selectedMentor}
                  isMulti
                  onSelectHandler={(select) => {
                    setSelectedMentor(select);
                  }}
                />
              </Col>
                )}

            </Row>
            <div className="float-end">
              <Button
                variant="primary"
                type="submit"
                disabled={disableButton}
              >
                {employeeId ? 'Update' : 'Add'}
              </Button>
              <Button variant="secondary" 
               className="ms-4" onClick={() => onCancel()}>
                Cancel
              </Button>

            </div>
          </Form>
        }
      />
    </>
  );
}

export default withRouter(CurrentEmployee);
