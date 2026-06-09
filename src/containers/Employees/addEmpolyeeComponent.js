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
  const [personalEmail, setPersonalEmail] = useState('');
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
  const [selectedTeamLead, setSelectedTeamLead] = useState();

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [manager, setManager] = useState([]);

  const [selectedManager, setSelectedManager] = useState([]);

  const [projectTeam, setProjectTeam] = useState([]);
  const [selectedProjectTeam, setSelectedProjectTeam] = useState([]);
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
        value: desgn.name,
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

  // const getTeamLeadList = () => {
  //   if (!teamLead) return [];
  //   const op = [];
  //   if (Number(selectedRole && selectedRole.id) !== 3) {
  //     teamLead.map((data) => {
  //       return op.push({
  //         label: data.full_name,
  //         id: data.id,
  //         value: data.full_name,
  //       });
  //     });
  //   }
  //   return op;
  // };
  const getTeamLeadList = () => {
    if (!teamLead) return [];
  
    const op = [];
  
    // Add the default option
    op.push({
      label: 'Select Team Lead',
      value: '', // or another suitable value for default
    });
  
    if (Number(selectedRole && selectedRole.id) !== 3) {
      teamLead.map((data) => {
        op.push({
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
    setPersonalEmail('');
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

  useEffect(() => {
    if (!employeeId) return;
    getEmployeeById();
  }, [employeeId]);

  const getEmployeeById = async () => {
    // eslint-disable-line
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.employeeAdd}${employeeId}/`
    );

    if (customFunctions.checkIfEmpty(data && data.data, 'A')) {
      const employeeDetails = data?.data;
      setFullName(employeeDetails?.full_name);
      setEmail(employeeDetails?.email);
      setPersonalEmail(employeeDetails?.personal_email);
      setJoiningDate(
        employeeDetails?.date_joined
          ? new Date(employeeDetails?.date_joined)
          : null
      );
      setEmpCode(employeeDetails?.emp_code);
      setMobile(employeeDetails?.mobile);
      setSelectedDesignationOption({
        label: employeeDetails?.designation_name,
        id: employeeDetails?.designation_id,
        value: employeeDetails?.designation_name,
      });
      setSelectedRole({
        label: employeeDetails?.role_name,
        value: employeeDetails?.role_id,
      });
      let assignManagers = [];
      employeeDetails.assigned_managers.map((element) => {
        assignManagers.push({
          label: element.name,
          id: element.id,
          value: element.name,
        });
      });
      setSelectedManager(assignManagers);
      if (employeeDetails.assigned_team_leads?.length > 0) {
        setSelectedTeamLead({
          label: employeeDetails.assigned_team_leads[0].name,
          id: employeeDetails.assigned_team_leads[0].id,
          value: employeeDetails.assigned_team_leads[0].value,
        });
      } 
      // else {
      //   setSelectedTeamLead({});
      // }

      setDate(employeeDetails?.dob ? new Date(employeeDetails?.dob) : null);
      setSelectedDepartment({
        label: employeeDetails?.department_name,
        id: employeeDetails?.department_id,
        value: employeeDetails?.department_name,
      });
      setGender(employeeDetails?.gender);
      setSelectedProjectTeam({
        label: employeeDetails?.team_name,
        id: employeeDetails?.team_id,
        value: employeeDetails?.team_name,
      });
      let assignMentors = [];
      employeeDetails?.assigned_mentors?.length > 0 &&
        employeeDetails?.assigned_mentors?.map((element) => {
          assignMentors.push({
            label: element?.name,
            id: element?.id,
            value: element?.name,
          });
        });
      setSelectedMentor(assignMentors);
    } else {
      swal(message ? message : 'Somthing went wrong', '', 'error');
    }
  };

  const editEmployee = async () => {
    setShowLoader(true);
    const teamIdList = [];
    if (selectedTeamLead && selectedTeamLead?.label != "Select Team Lead") {
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
    let updatedEmpcode;
    if (typeof empCode == 'string') {
      updatedEmpcode = empCode && empCode?.split('-');
    }
    const postData = {
      full_name: fullName,
      email: email,
      personal_email: personalEmail,
      mobile: mobile,
      role: selectedRole.id,
      team: selectedProjectTeam.id,
      emp_code:
        typeof empCode == 'number'
          ? empCode
          : updatedEmpcode
          ? Number(updatedEmpcode[updatedEmpcode.length - 1])
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
    const endPoint = `${Api.employeeAdd}${employeeId}/`;

    const { data, message } = await AuthApi.putDataToServer(endPoint, payload);

    if (data) {
      setShowLoader(false);
      validator.current.hideMessages();
      setAddButton(false);
      setSelectedDesignationOption();
      setModalShow(false);
      swal(data && data.message[0], '', 'success').then(() => {
        history.push(`/employee-profile/${employeeId}`);
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
                        // disabled={(employeeId || employeetwId) && 'disabled'}
                        placeholder="Enter Full  Name"
                        errorMessage={validator.current.message(
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
                        minDate={new Date()}
                        onChange={(e) => {
                          setJoiningDate(e);
                        }}
                        errorMessage={validator.current.message(
                          'Joining Date',
                          joiningDate,
                          'required'
                        )}
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
                    <TextInput
                        onInputChange={(e) => setPersonalEmail(e.target.value)}
                        label="Personal Email"
                        name='personalEmail'
                        autocomplete="off"
                        asterisk="*"
                        containerClass="form-group"
                        type="text"
                        // disabled={(employeeId || employeetwId) && 'disabled'}
                        value={personalEmail}
                        placeholder="Enter personal email"
                        errorMessage={validator.current.message(
                          'email',
                          personalEmail,
                          'required|email' // eslint-disable-line
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
                        placeholder="Select Team Lead"
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
                          placeholder="Select Reporting Person"
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
                        history.push(`/employee-profile/${employeeId}`)
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
