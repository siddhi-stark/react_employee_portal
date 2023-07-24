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

function EditPersonalDetails(props) {
  console.log("editttttttt");
  const { handleModalCLose, onPersonalDetailChanges } = props;
  // Variable declarations
  // const history = useHistory()
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [isShowLoader, setShowLoader] = useState(false);
  const [testDate, setDate] = useState(null);

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
    
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('id');

    let postData = {
      ...formValues,
    };

    postData = {
      ...postData,
      designation: formValues.designation ? formValues.designation.value : null,
      joining_date: formValues.joining_date
        ? customFunctions.getDate(formValues.joining_date)
        : '',
      confirmation_date: formValues.confirm_date
        ? customFunctions.getDate(formValues.confirm_date)
        : null,
      confirmed: formValues.confirm_date ? true : false, // eslint-disable-line
      relieving_date: formValues.relieving_date
        ? customFunctions.getDate(formValues.relieving_date)
        : null,
      // relieved: false, // eslint-disable-line
      dob: formValues.dob ? customFunctions.getDate(formValues.dob) : null,
      notice_period_date :formValues.notice_period_start_date
      ? customFunctions.getDate(formValues.notice_period_start_date)
      : null,
      last_working_date : formValues.notice_period_end_date
      ? customFunctions.getDate(formValues.notice_period_end_date)
      : null,
      // on_notice_period: formValues.notice_period_start_date && formValues.notice_period_end_date ? true : false
    };
  

    const { data } = await AuthApi.putDataToServer(
      `${Api.employeeUrl}${id}/`,
      postData
    );
    if (data) {
      setShowLoader(false);
      swal(data && data.message[0]);
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
      console.log("data-----------",data.data)
      console.log("DOB------->>>>",new Date(customFunctions.getDate(data.data.dob)));
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
        setDate(data.data.notice_period_date = data.data.notice_period_date
          ? (customFunctions.getDate(data.data.notice_period_date))
          : '')

      const obj = {
        ...data.data,
        designation: ds,
      };
      // console.log('obj',obj);
      updateDefaultValues({ ...obj });
      const noticeDate = obj
      updateDefaultValues({
        notice_period_end_date: noticeDate.last_working_date ? new Date(customFunctions.getDate(noticeDate.last_working_date)): null,
        notice_period_start_date: noticeDate.notice_period_date ? new Date(customFunctions.getDate(noticeDate.notice_period_date)) : null,
        dob: noticeDate.dob ? new Date(customFunctions.getDate(noticeDate.dob)): null,
        // confirmation_date:new Date(customFunctions.getDate(noticeDate?.confirmation_date))
        email:noticeDate.email ?  noticeDate.email : null,
        full_name:noticeDate.full_name ? noticeDate.full_name : null,
        joining_date: noticeDate.date_joined ? new Date(customFunctions.getDate(noticeDate.date_joined)) : null,
        designation:{
          label:noticeDate?.designation_name
        }
      })
      console.log("objjjjjjj",noticeDate.last_working_date);
      // updateDefaultValues({ ...obj });
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
  }, []);

  const onClear = () => {
    handleModalCLose(false);
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
