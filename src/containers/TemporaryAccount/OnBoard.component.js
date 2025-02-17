/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './onboard.json';

function OnBoard(props) {
  const { match, history } = props;
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [personalEmail, setPersonalEmail] = useState('');
  const [currentUser, updateCurrentUser] = useState(0);
  const [twEmployee, setTwEmployee] = useState([]);
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);

  const employeeId = match.params.ID;
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Employee' }];

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'dob') {
      const currentdate = new Date();
      const maxNewdate = new Date(
        currentdate.setYear(currentdate.getFullYear() - 18)
      );
      sectionData.maxDate = maxNewdate;
    }
    return sectionData;
  });

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    setTitle('Add Employee');
    getData();
    getUserRole();
    getRole();
    getDesignation();
    getManagers();
    getTeamLeads();
    getMentorList();
    getDepartment();
    getTeam();
  }, []);

  const getData = async () => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${employeeId}/`
    );
    if (!data) {
      return;
    }

    if (data) {
      setShowLoader(false);
      let newDate = '';

      const ds = data?.data?.designation_id
        ? {
            label: data?.data?.designation_name,
            value: data?.data?.designation_id,
          }
        : '';
        const departmentName = data?.data?.department_id
        ? {
            label: data?.data?.department_name            ,
            value: data?.data?.department_id
            ,
          }
        : '';
      if (!customFunctions.checkIfEmpty(data?.data?.date_joined)) {
        newDate = new Date(data?.data?.date_joined);
      }
      // if (!customFunctions.checkIfEmpty(data?.data?.date_joined)) {
      //   const dateStr = data?.data?.date_joined;
      //   newDate = new Date(dateStr);
      // }
      setPersonalEmail(data?.data?.email);

      const obj = {
        // ...data?.data,
        full_name: data?.data?.full_name,
        date_joined: newDate,
        mobile: data?.data?.mobile, 
        // date_joined: new Date(),
        // dob:new Date(data?.data?.dob),
        designation: ds,
        department: departmentName,
        gender: String(data?.data?.gender),
      };

      updateDefaultValues({ ...obj });
    }
  };

  const submitForm = async (formValues) => {
    // setShowLoader(true);

    // const prefixedEmpCode = formValues?.emp_code ? `sdms${formValues?.emp_code}` : '';
    const managerList = [];
    let reportingManagerIds =
      formValues?.reportingPerson?.length > 0 &&
      formValues?.reportingPerson.map((ele) => ele?.value);
    formValues?.managers &&
      formValues?.managers.map((mngr) => {
        managerList.push(mngr?.value);
        return mngr;
      });
    
    const teamIdList = [];

  if (formValues?.team_leads && formValues?.team_leads?.label !== 'Select Team Lead') {
    teamIdList.push(formValues?.team_leads?.value);
  }

    let updatedEmpcode;
    if (typeof empCode == 'string') {
      updatedEmpcode = empCode && empCode?.split('-');
    }
    const postData = {
      date_joined: formValues.date_joined
        ? customFunctions.getDate(formValues?.date_joined)
        : '',
      full_name: formValues?.full_name,
      email: formValues?.eemail,
      personal_email: personalEmail,
      mobile: formValues?.mobile,
      gender: formValues.gender ? Number(formValues.gender) : '',
      password: formValues?.password,
      department: formValues?.department
        ? Number(formValues?.department?.value)
        : '',
      designation: formValues.designation ? formValues.designation.value : '',
      team: formValues.team ? formValues.team.value : '',
      dob: formValues.dob ? customFunctions.getDate(formValues.dob) : '',
      role: formValues.role ? formValues.role.value : '',
      emp_code: Number(formValues?.emp_code),
      mentor: formValues?.reportingPerson ? reportingManagerIds : '',
      //  emp_code:
      //   typeof empCode == 'number'
      //     ? empCode
      //     : updatedEmpcode
      //     ? Number(updatedEmpcode[updatedEmpcode.length - 1])
      //     : '',
      // emp_code: prefixedEmpCode,
      managers: managerList ? managerList : [],
      // team_leads: teamIdList.length > 0 ? teamIdList.map(tl => tl.value) : [],
      team_leads: teamIdList,
      is_onboard: true,
      emp_id: Number(employeeId),
    };

    // const isFind = twEmployee.find(
    //   (item) =>
    //     formValues?.tw_emp &&
    //     formValues?.tw_emp?.label &&
    //     item?.full_name === formValues?.tw_emp?.label
    // );
    // if (isFind) {
    //   postData.tw_emp = isFind.tw_id;
    // }

    const  data = await AuthApi.putDataToServer(
      `${Api.employeeOnboard}${employeeId}/`,
      postData
    );

    if (data?.success || data?.data?.success) {
      setShowLoader(false);
      // swal({
      //   title: 'Employee Created Sucessfully',
      //   icon: 'success',
      // }).then((okAction) => {
      //   if (okAction) {
      //     history.push('/employees');
      //     customFunctions.setLocalStorage('isShowOnBoard', 'true');
      //   }
      // });
      swal('Employee Created Sucessfully', '', 'success', {
        buttons: false,
        timer: 2000,
      }).then(() => {
        history.push('/employees');
        customFunctions.setLocalStorage('isShowOnBoard', 'true');
      });
    } else {
      setShowLoader(false);
      swal(data?.message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  // const getTwEmp = async () => {
  //   const { data } = await AuthApi.getDataFromServer(
  //     `${Api.TwEmployeeUrl}?sort_by=full_name&sort_direction=ascending`
  //   );
  //   if (!data) {
  //     return;
  //   }

  //   const dpOptions =
  //     (await data) &&
  //     data?.data?.length > 0 &&
  //     data?.data.map((op) => {
  //       return { label: op?.full_name, value: op?.id };
  //     });

  //   options.tw_emp = dpOptions;
  //   const allOptions = options;
  //   await updateOptions({ ...allOptions });
  //   await setTwEmployee(data?.data);
  // };

  // useEffect(() => {
  //   getTwEmp();
  // }, []);

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!data) {
      return;
    }
    const dpOptions =
      (await data) &&
      data?.data?.length > 0 &&
      data?.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.designation = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getRole = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.roleUrl);
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data?.data?.length > 0 &&
      data?.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.role = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getManagers = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${2}&is_dropdown=1`
    );
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data?.data?.length > 0 &&
      data?.data.map((op) => {
        return { label: op?.full_name, value: op?.id };
      });

    options.managers = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getTeamLeads = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?role_id=${3}&is_dropdown=1`
    );
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data?.data?.length > 0 &&
      data?.data.map((op) => {
        return { label: op?.full_name, value: op?.id };
      });

    const optionsWithDefault = [
      { label: 'Select Team Lead', value: '' },
      ...dpOptions,
    ];

    options.team_leads = optionsWithDefault;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getMentorList = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?sort_by=full_name&sort_direction=ascending&type=all&is_dropdown=1&status=active`
    );
    // if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
    //   setMentorData(data.data);
    // }

    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data?.data?.length > 0 &&
      data?.data.map((item) => {
        return { label: item?.full_name, value: item?.id };
      });

    options.reportingPerson = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getDepartment = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=department`
    );

    const dpOptions =
      (await data) &&
      data?.data?.department?.length > 0 &&
      data?.data?.department.map((op) => {
        return { label: op?.name, value: op?.id };
      });

    options.department = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getTeam = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=team`
    );
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data?.data &&
      data?.data?.team?.length > 0 &&
      data?.data?.team.map((op) => {
        return { label: op?.name, value: op?.id };
      });

    options.team = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Add Employee</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="mt-5">
        <Card body>
          <StarkFormBuilder
            containerClass="mb-4 mt-4"
            formHeaderClass=""
            formSections={FormSections}
            onFormSubmit={(formValues) => {
              submitForm(formValues);
            }}
            options={options}
            callbacks={{}}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Submit"
            showResetBtn={true}
            showBtnClass={true}
            resetBtnText="Cancel"
            btnContainerClass="form-submit-buttons"
            isStepForm={false}
            onFormReset={() => {
              history.push('/candidates');
            }}
          />
        </Card>
      </div>
    </>
  );
}

export default withRouter(OnBoard);
