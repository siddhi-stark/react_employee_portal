/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './editEmployee.json';
// import FormSections from './demo.json'

function EditPersonalDetails(props) {
  const { handleModalCLose, onPersonalDetailChanges } = props;

  // Variable declarations
  // const history = useHistory()
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [isShowLoader, setShowLoader] = useState(false);
  const [testDate, setDate] = useState(null);
  const [manager, setManager] = useState([]);
  const [projectTeam, setProjectTeam] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  // useEffect(() => {
  //   if(addInstituteId){
  //     const formSchema = [...FormSections];
  //   const updatedSchema = formSchema.map((section)=>{
  //     const s = {...section};
  //     s.fields = section.fields.map((item) => {
  //       const itemData = item;
  //        if(item.name === 'location') itemData.disabled = true;
  //        return itemData;
  //     })
  //     return s;
  //   })
  // updateJsonSchema([...updatedSchema]);
  // }
  // }, []);

  useEffect(() => {
    const employeeId = customFunctions.getLocalStorage('id');
    if (employeeId) {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'full_name') itemData.disabled = true;
          if (item.name === 'joining_date') itemData.disabled = true;
          if (item.name === 'email') itemData.disabled = true;
          if (item.name === 'mobile') itemData.disabled = true;
          if (item.name === 'confirmation_date') itemData.disabled = true;
          if (item.name === 'dob') {
            const currentdate = new Date();
            const maxdate = new Date(
              currentdate.setYear(currentdate.getFullYear() - 18)
            );
            itemData.maxDate = maxdate;
          }
          if (item.name === 'confirmation_date') {
            const date = new Date();
            itemData.minDate = date;
          }
          // if(item.name =="notice_period_start_date" === true ){
          //   item.name ==="notice_period_end_date", itemData.displayWhen = true
          // }
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    }
  }, [defaultValues]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    return;
    // setShowLoader(true);
    const id = customFunctions.getLocalStorage('id');

    let postData = {
      ...formValues,
    };

    postData = {
      designation: formValues.designation ? formValues.designation.value : null,
      department: formValues.department ? formValues.department_value : null,
      joining_date: formValues.joining_date
        ? customFunctions.getDate(formValues.joining_date)
        : '',
      confirmation_date: formValues.confirmation_date
        ? customFunctions.getDate(formValues.confirmation_date)
        : null,
      confirmed: formValues.confirm_date ? true : false, // eslint-disable-line
      relieving_date: formValues.relieving_date
        ? customFunctions.getDate(formValues.relieving_date)
        : null,
      // relieved: false, // eslint-disable-line
      dob: formValues.dob ? customFunctions.getDate(formValues.dob) : null,
      // notice_period_date:
      //   formValues.notice_period_start_date && formValues.notice_period_end_date
      //     ? customFunctions.getDate(formValues.notice_period_start_date)
      //     : null,
      // last_working_date:
      //   formValues.notice_period_end_date && formValues.notice_period_start_date
      //     ? customFunctions.getDate(formValues.notice_period_end_date)
      //     : null,
      // on_notice_period:
      //   formValues.notice_period_end_date && formValues.notice_period_start_date
      //     ? true
      //     : null,
      remove_from_np:
        !formValues.notice_period_end_date &&
        !formValues.notice_period_start_date
          ? true
          : null,
      probation_date: formValues.probation_date
        ? customFunctions.getDate(formValues.probation_date)
        : null,
      mobile: formValues?.mobile ? formValues?.mobile : null,
      personal_email: formValues?.personal_email
        ? formValues?.personal_email
        : null,
      emp_code: formValues?.emp_code ? formValues?.emp_code : null,
    };

    const { data } = await AuthApi.putDataToServer(
      `${Api.employeeUrl}${id}/`,
      postData
    );
    if (data) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success');
      handleModalCLose(false);
      onPersonalDetailChanges();
      // history.push('/employees',{
      //   state:{
      //     key:'noticePeriod'
      //   }
      // })
    }
  };

  const getData = async () => {
    setShowLoader(true);

    const id = customFunctions.getLocalStorage('id');
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${id}/`
    );

    if (data && data.success) {
      setShowLoader(false);

      data.data.confirmation_date = data.data.confirmation_date
        ? new Date(customFunctions.getDate(data.data.confirmation_date))
        : '';
      data.data.relieving_date = data.data.relieving_date
        ? new Date(customFunctions.getDate(data.data.relieving_date))
        : '';
      data.data.dob = data.data.dob
        ? new Date(customFunctions.getDate(data.data.dob))
        : '';
      data.data.joining_date = data.data.date_joined
        ? new Date(customFunctions.getDate(data.data.date_joined))
        : '';

      // data.data.notice_period_date = data.data.notice_period_date
      // ? customFunctions.getDMYDate(data.data.notice_period_date)
      // : '';
      // data.data.last_working_date = data.data.last_working_date
      // ? customFunctions.getDMYDate(data.data.last_working_date)
      // : '';
      const ds = data.data.designation_id
        ? {
            label: data.data.designation_name,
            value: data.data.designation_id,
          }
        : '';
      const roles = data.data.role_id
        ? {
            label: data.data.role_name,
            value: data.data.role_id,
          }
        : '';
      const dept = data.data.department_id
        ? {
            label: data.data.department_name,
            value: data.data.department_id,
          }
        : '';
      const EmpCode = data.data.emp_code;
      setDate(
        (data.data.notice_period_date = data.data.notice_period_date
          ? customFunctions.getDate(data.data.notice_period_date)
          : '')
      );

      const obj = {
        ...data.data,
        designation: ds,
        role: roles,
        department: dept,
        emp_code: EmpCode,
      };
      // updateDefaultValues({ ...obj });
      // const noticeDate = obj;
      const noticeDate = obj;

      //   let isStaticData={
      //     full_name: "Akash Belokar",
      //     joining_date: "2023-12-26",
      //     personal_email: "test@yopmail.com",
      //     email: "test@yopmail.com",
      //     mobile: "9022903955",
      //     probation_date: "2024-03-26",
      //     confirmation_date: null,
      //     dob: "2001-08-22",
      //     confirmed: false,
      //     relieving_date: null,
      //     remove_from_np: true,
      //     role:{value: 7, label: 'System Admin'},
      //     department:{value: 2, label: "Development"},
      //     team :{value: 7, label: "Other"},
      //     manager :{value: 9, label: "Sanjay Mangalaram"},
      //     emp_code:"325",

      // }
      updateDefaultValues({
        notice_period_end_date: noticeDate.last_working_date
          ? new Date(customFunctions.getDate(noticeDate.last_working_date))
          : null,
        notice_period_start_date: noticeDate.notice_period_date
          ? new Date(customFunctions.getDate(noticeDate.notice_period_date))
          : null,
        dob: noticeDate.dob
          ? new Date(customFunctions.getDate(noticeDate.dob))
          : null,
        confirmation_date: noticeDate?.confirmation_date
          ? new Date(customFunctions.getDate(noticeDate?.confirmation_date))
          : null,
        email: noticeDate.email ? noticeDate.email : null,
        personal_email: noticeDate?.personal_email
          ? noticeDate?.personal_email
          : null,
        full_name: noticeDate.full_name ? noticeDate.full_name : null,
        joining_date: noticeDate.date_joined
          ? new Date(customFunctions.getDate(noticeDate.date_joined))
          : null,
        designation: {
          label: noticeDate?.designation_name,
        },
        probation_date: noticeDate?.probation_date
          ? new Date(customFunctions.getDate(noticeDate?.probation_date))
          : null,
        mobile: noticeDate?.mobile ? noticeDate?.mobile : null,
        emp_code: noticeDate?.emp_code ? noticeDate?.emp_code : null,

        department: {
          label: noticeDate?.department_name,
        },

        manager: noticeDate?.manager,
        team: noticeDate?.team,
        role: noticeDate?.role,
      });
    }
  };

  const getDesignation = async () => {
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

    options.designation = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
    getData();
  };

  useEffect(() => {
    getDesignation();
    getManager();
    getTeam();
  }, []);

  const onClear = () => {
    handleModalCLose(false);
  };

  const getTeam = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=team`
    );

    if (!data) {
      return;
    }
    // if (data && data?.data) {
    //   setProjectTeam(data?.data?.team);
    // }
    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.team = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
    getData();
  };

  const getManager = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${
        Api.employeeUrl
      }?role_id=${2}&is_dropdown=1&show_self=True&status=active`
    );

    if (!customFunctions.checkIfEmpty(data && data?.data, 'A')) {
      setManager(data?.data?.full_name);
    }
  };
  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <StarkFormBuilder
        containerClass="mb-2 mt-2"
        formHeaderClass=""
        formSections={jsonSchema}
        formHeading="Employee"
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
          onClear();
        }}
      />
    </>
  );
}

export default withRouter(EditPersonalDetails);
