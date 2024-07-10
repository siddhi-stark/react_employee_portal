/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Image, Form } from 'react-bootstrap';
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
import RadioComponent from '../../components/FormInputs/radio.component';

const AddEmployeeComponent = () => {
  const params = useParams();

  const history = useHistory();

  const [employeeId, setEmployeeId] = useState();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [designation, setDesignation] = useState([]);
  const [joiningDate, setJoiningDate] = useState('');
  const [selectedDesignationOption, setSelectedDesignationOption] =
    useState(null);
  const [role, setRole] = useState([]);
  const [teamLead, setTeamLead] = useState([]);
  const [date, setDate] = useState('');
  const [newDepartment, setNewDepartment] = useState([]);
  const [options, updateOptions] = useState({});
  const [addButton, setAddButton] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [manager, setManager] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [projectTeam, setProjectTeam] = useState([]);
  const [selectedProjectTeam, setSelectedProjectTeam] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [empCode, setEmpCode] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [selectedMentor, setSelectedMentor] = useState([]);
  const [mentorData, setMentorData] = useState([]);
  const [count, forceUpdate] = useState(0);

  const genderOptions = [
    {
      label: 'Male',
      value: '1',
    },
    {
      label: 'Female',
      value: '2',
    },
    {
      label: 'Other',
      value: '3',
    },
  ];
  const currentdate = new Date();
  const maxdate = new Date(currentdate.setYear(currentdate.getFullYear() - 18));
  const validator = useRef(
    new SimpleReactValidator({
      validators: {
        emailValidate: {
          message:
            'The :attribute domain name should be starkdigital.net.' ||
            'The :attribute domain name should be starkdigital.in.',
          rule: (val, params, valid) => {
            return (
              (valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.net$/i) ||
                valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.in$/i) ||
                valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.com$/i)) &&
              params.indexOf(val) === -1
            );
          },
        },
      },
    })
  );
  const onSelectRadioButton = (e) => {
    setGender(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      // editEmployee();
    } else {
      validator.current.showMessages();
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

  const getPasswordValidation = () => {
    if (
      employeeId &&
      validator.current.fields &&
      validator.current.fields.password !== undefined
    ) {
      validator.current.fields.password = true;
    }
    return !employeeId
      ? validator.current.message('password', password, 'required|min:8')
      : '';
  };

  const getTwEmployeeValidation = () => {
    if (
      employeeId &&
      validator.current.fields &&
      validator.current.fields.TWEmployee !== undefined
    ) {
      validator.current.fields.TWEmployee = true;
    }
    return !employeeId
      ? validator.current.message('TWEmployee', selectedEmployee, 'required')
      : '';
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
    if (Number(selectedRole && selectedRole.id) !== 3) {
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

  useEffect(() => {
    getDesignation();
    // getTwEmployee();
    getRole();
    getManager();
    getTeamLead();
    getNewDapartment();
    getTeam();
    getMentorList();
  }, [addButton]);

  const getMentorList = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?sort_by=full_name&sort_direction=ascending&type=all&is_dropdown=1&status=active`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setMentorData(data.data);
    }
  };

  const getTeam = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=team`
    );
    if (data && data.data) {
      setProjectTeam(data.data.team);
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

  const getRole = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.roleUrl}`);
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setRole(data?.data);
    }
  };

  const getManager = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${
        Api.employeeUrl
      }?role_id=${2}&is_dropdown=1&show_self=True&status=active`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setManager(data.data);
    }
  };

  const getTeamLead = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${3}&is_dropdown=1&status=active`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setTeamLead(data.data);
    }
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

  const getMobile = (value) => {
    let event = value.replace(/\D/g, '');
    if (event.length === 0) {
      event = '';
    } else if (event.length > 6) {
      event = event.substring(0, 5);
    }
    return event !== '' ? `SDMS-${event}` : '';
  };

  const onCancel = () => {
    validator.current.hideMessages();
    // setEmployeeTwId('');
    setAddButton(false);
    setFullName('');
    setEmpCode('');
    setJoiningDate('');
    setSelectedEmployee('');
    setEmail('');
    setMobile('');
    setPassword('');
    setGender('');
    setSelectedDesignationOption('');
    setSelectedRole('');
    setSelectedManager([]);
    setSelectedTeamLead('');
    setSelectedDepartment('');
    setSelectedMentor('');
    setDate();
    setProbationDate('');
    setModalShow(false);
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getEmployeeData(1);
      setDisableButton(false);
    }, 1000);
  };

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
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

  useEffect(() => {
    if (params?.id) {
      setEmployeeId(params?.id);
    }
  }, [params]);

  const editEmployee = async () => {
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
    if (selectedMentor && selectedMentor.length > 0) {
      selectedMentor.map((mt) => {
        mentorList.push(mt.id);
        return mt;
      });
    }
    const postData = {
      full_name: fullName,
      email: email,
      mobile: mobile,
      role: selectedRole.id,
      team: selectedProjectTeam.id,
      password: password,
      emp_code:
        empCode && !employeeId && typeof empCode === 'string'
          ? Number(empCode.split('-')[1])
          : '',
      team_leads: teamIdList,
      managers: managerList,
      dob: date ? customFunctions.getDate(date) : null,
      date_joined: joiningDate ? customFunctions.getDate(joiningDate) : null,
      department: selectedDepartment.id,
      mentor: mentorList,
      gender: gender,
      is_onboard: true,
      // applicant_id: null,
      // probation_date:probationDate ? customFunctions.getDate(probationDate) : null
    };

    if (selectedDesignationOption) {
      postData.designation = selectedDesignationOption.id;
    }

    const payload = customFunctions.cleanObject(postData);
    // const callback = employeeId
    //   ? AuthApi.putDataToServer
    //   : AuthApi.postDataToServer;
    // const endPoint = employeeId
    //   ? `${Api.employeeAdd}${employeeId}/`
    //   : Api.employeeAdd;
    const endPoint = `${Api.employeeAdd}${employeeId}/`;

    const { data, message } = await AuthApi.putDataToServer(endPoint, payload);

    if (data) {
      setShowLoader(false);
      validator.current.hideMessages();
      setAddButton(false);
      setSelectedDesignationOption();
      setModalShow(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          // setEmpCode('');
          // setDisableButton(false);
          // setEmployeeId();
          // setSelectedDesignationOption();
          // setSelectedRole();
          // setFullName();
          // setSelectedEmployee();
          // setEmail();
          // setPassword();
          // setGender();
          // setMobile();
          // setSelectedManager([]);
          // setSelectedMentor();
          // setDate();
          // setJoiningDate();
          // setSelectedTeamLead();
          // setSelectedDepartment();
          // setModalShow(false);
          // getEmployeeData(currentPage);
        }
      });
    } else {
      setShowLoader(false);
      setModalShow(false);
      swal({
        title: message,
        icon: 'error',
      }).then((okAction) => {
        if (okAction) {
          setModalShow(true);
        }
      });
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (params && teamLead && projectTeam && manager && newDepartment) {
      getEmployeeById(params?.id);
    }
  }, [params, teamLead, projectTeam, manager, newDepartment]);

  const getEmployeeById = async (id) => {
    // eslint-disable-line
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.employeeAdd}${id}/`
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
        if (pt.id === data.data.team_id) {
          setSelectedProjectTeam({
            id: pt.id,
            label: pt.name,
          });
        }
        return pt;
      });

      manager &&
        manager.filter((ele) => {
          if (data.data.assigned_managers.includes(ele.id)) {
            managerList.push({
              id: ele.id,
              label: ele.full_name,
              value: ele.full_name,
            });
          }
        });
      setSelectedManager(managerList);

      // twEmployee.map((tw) => {
      //   if (data.data.tw_id === tw.tw_id) {
      //     setSelectedEmployee({ label: tw.full_name });
      //     setTwId(tw.tw_id);
      //   }
      //   return tw;
      // });

      newDepartment.map((dept) => {
        if (data.data.department_id === dept.id) {
          setSelectedDepartment({
            label: dept.name,
            id: dept.id,
          });
        }
        return dept;
      });

      setSelectedDesignationOption(
        data.data.designation_id
          ? {
              label: data.data.designation_name,
              id: data.data.designation_id,
            }
          : ''
      );

      setSelectedRole(
        data.data.role_id
          ? {
              label: data.data.role_name,
              id: data.data.role_id,
            }
          : ''
      );

      setGender(data?.data?.gender);
      setFullName(data?.data?.full_name);
      setEmail(data?.data?.email);
      setPassword(data?.data?.password);
      setMobile(data?.data?.mobile);
      setDate(data?.data?.dob ? new Date(data?.data?.dob) : null);
      setJoiningDate(
        data?.data?.date_joined ? new Date(data?.data?.date_joined) : null
      );
      setEmpCode(data?.data?.emp_code);
    } else {
      swal(message ? message : 'Somthing went wrong', '', 'error');
    }
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
  const getMentorData = () => {
    if (!mentorData) return [];
    const op = [];
    mentorData.map((mntr) => {
      return op.push({
        label: mntr.full_name,
        id: mntr.id,
        value: mntr.full_name,
      });
    });
    return op;
  };
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              {params?.id && (
                <>
                  <h3>Edit Details</h3>
                </>
              )}
              <Loader showLoader={isShowLoader} needFullPage={false} />

              <div className="d-flex align-items-start justify-content-between mb-4">
                <Form
                  onSubmit={(e) => {
                    onSubmit(e);
                    getPasswordValidation();
                    getTwEmployeeValidation();
                  }}
                  autocomplete="off"
                >
                  <Row>
                    {!employeeId && (
                      <Col sm={6}>
                        {/* <DropdownInput
                    label="TW Employee"
                    asterisk="*"
                    options={getEmployeeList()}
                    placeholder="Select Employee"
                    defaultValue={selectedEmployee}
                    onSelectHandler={(select) => {
                      setSelectedEmployee(select);
                      updateData(select);
                      setEmployeeTwId(select.id);
                    }}
                    disabled={employeeId && 'disabled'}
                    errorMessage={getTwEmployeeValidation()}
                  /> */}
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
                          // disabled={(employeeId || employeetwId) && 'disabled'}
                          placeholder="Enter Full  Name"
                          errorMessage={validator.current.message(
                            'Full Name',
                            fullName,
                            'required'
                          )}
                        />
                      </Col>
                    )}
                    <Col sm={6}>
                      {/* <TextInput
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
                  // disabled={(employeeId || employeetwId) && 'disabled'}
                  placeholder="Enter Full  Name"
                  errorMessage={validator.current.message(
                    'Full Name',
                    fullName,
                    'required'
                  )}
                /> */}
                      <TextInput
                        onInputChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        autocomplete="off"
                        asterisk="*"
                        containerClass="form-group"
                        type="text"
                        // disabled={(employeeId || employeetwId) && 'disabled'}
                        value={email}
                        placeholder="Enter email"
                        errorMessage={validator.current.message(
                          'email',
                          email,
                          'required|email' // eslint-disable-line
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
                        // maxDate={new Date()}
                        minDate={new Date()}
                        onChange={(e) => {
                          setJoiningDate(e);
                        }}
                        errorMessage={
                          // joiningDate &&
                          validator.current.message(
                            'Joining Date',
                            joiningDate,
                            'required'
                          )
                        }
                      />
                    </Col>
                    {[1, 2, 5, 7].includes(userRole) ? (
                      <Col sm={6}>
                        <TextInput
                          onInputChange={(e) => setPassword(e.target.value)}
                          label="Password"
                          autocomplete="off"
                          asterisk={employeeId ? null : '*'}
                          containerClass="form-group"
                          type="password"
                          // minlength="6"
                          name="passwordTitle"
                          value={password}
                          placeholder="Enter Password"
                          errorMessage={
                            !userRole === 1 || getPasswordValidation()
                          }
                        />
                      </Col>
                    ) : null}
                    <Col sm={6}>
                      <TextInput
                        onInputChange={(e) => {
                          setEmpCode(getMobile(e.target.value));
                        }}
                        autocomplete="off"
                        label="Employee Code"
                        asterisk="*"
                        containerClass="form-group"
                        type="text"
                        name="codeTitle"
                        maxlength="11"
                        // disabled={employeeId ? 'disabled' : ''}
                        value={empCode}
                        placeholder="Enter Employee Code"
                        errorMessage={validator.current.message(
                          'Employee Code',
                          empCode,
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
                        errorMessage={validator.current.message(
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
                        errorMessage={validator.current.message(
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
                          if (Number(select && select.id) === 3) {
                            setSelectedTeamLead('');
                          }
                        }}
                        errorMessage={validator.current.message(
                          'Role',
                          selectedRole,
                          'required'
                        )}
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
                        onSelectHandler={(select) => {
                          setSelectedManager(select);
                        }}
                        errorMessage={validator.current.message(
                          'Manager',
                          selectedManager,
                          'required'
                        )}
                      />
                    </Col>

                    <Col sm={6}>
                      <DropdownInput
                        label="Team Lead"
                        options={getTeamLeadList()}
                        placeholder="Select TeamLead"
                        defaultValue={selectedTeamLead}
                        onSelectHandler={(select) =>
                          setSelectedTeamLead(select)
                        }
                      />
                    </Col>
                    <Col sm={6}>
                      <Datepicker
                        label="DOB"
                        asterisk="*"
                        className="form-control"
                        selected={date}
                        placeholder="dd/mm/yyyy"
                        maxDate={maxdate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(e) => {
                          setDate(e);
                        }}
                        errorMessage={validator.current.message(
                          'DOB',
                          date,
                          'required'
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
                        onSelectHandler={(select) =>
                          setSelectedDepartment(select)
                        }
                        isMulti={false}
                        errorMessage={validator.current.message(
                          'Department',
                          selectedDepartment,
                          'required'
                        )}
                      />
                    </Col>
                    <Col sm={6}>
                      <DropdownInput
                        label="Team"
                        asterisk="*"
                        options={getProjectTeam()}
                        placeholder="Select Team"
                        defaultValue={selectedProjectTeam}
                        onSelectHandler={(select) =>
                          setSelectedProjectTeam(select)
                        }
                        errorMessage={validator.current.message(
                          'Team',
                          selectedProjectTeam,
                          'required'
                        )}
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
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="text-dark fs-6">
                          Gender<span className="text-danger">*</span>
                        </Form.Label>
                        <div>
                          {genderOptions.map((option) => (
                            <Form.Check
                              key={option.value}
                              type="radio"
                              id={`gender-${option.value}`}
                              name="gender"
                              value={option.value}
                              label={option.label}
                              checked={gender == option.value}
                              onChange={onSelectRadioButton}
                              inline
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                    {/* <Col sm={6}>
                <Datepicker
                  label="Probation Date"
                  className="form-control"
                  selected={probationDate}
                  placeholder="dd/mm/yyyy"
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  onChange={(e) => {
                    setProbationDate(e);
                  }}
                  // errorMessage={validator.current.message(
                  //   'DOB',
                  //   date,
                  //    `required | before_or_equal:${maxdate}`
                  // )}
                />
              </Col> */}
                  </Row>
                  <div className="float-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={disableButton}
                      onClick={() => {
                        editEmployee();
                      }}
                    >
                      {'Update'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="ms-4"
                      onClick={() =>
                        // onCancel()
                        history.push('/employees')
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeComponent;
