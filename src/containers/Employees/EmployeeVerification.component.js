import React, { useEffect, useState } from 'react';
import { withRouter, useHistory , useLocation } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Button, Card } from 'react-bootstrap';
import verificationSchema from './verificationSchema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';
// import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

function EmployeeVerification(props) {
  const { state } = useLocation();
  const { match, history } = props;
  const employeeId = match?.params?.id;
  const empName = state?.state?.employeeName;
  // const [empName, setEmpName] = useState()

  const historyData = useHistory();

  const editEmployeeDetails = history?.location?.state?.state?.edit;

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);
  const [updateID, setUpdateID] = useState();

  // Call get data method on load
  useEffect(() => {
    // getEmployeeDetails ();
    getUserRole();
    getFinal_settlement_status();
    getNotice_period_served_status();
    if (editEmployeeDetails) {
      getEnployeeBGVDetails();
    } else {
      getEmployeeReginationData();
    }
  }, []);

  // useEffect(()=>{
  //   // getEmployeeDetails ();
  //     const obj = {
  //       employee_name: empName,
  //     };
  //     updateDefaultValues({
  //       ...obj,
  //     })
  // },[])

  // const getEmployeeDetails = async () => {
  //   setShowLoader(true);
  //   const { data } = await AuthApi.getDataFromServer(
  //     `${Api.employeeUrl}${employeeId}/`
  //   );

  //   if (data) {
  //     // setEmpName(data?.data?.full_name);
  //   }
  // };

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  // Get data for form
  const getEmployeeReginationData = async () => {
    setShowLoader(true);
    customFunctions.setLocalStorage('id', employeeId);
    // const { data } = await AuthApi.getDataFromServer(
    //   `${Api.employeeUrl}${employeeId}/`
    // );

    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.employeeResignationUrl}?get_by_id=${employeeId}`
    );
    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
    const tempData = data?.data?.[0];
    console.log('tempData: ', tempData);
    
    if (tempData){
    let employeeStatus = null;
   
      if (tempData?.resignation_type === 2)
         {  
          employeeStatus = {
             'label':tempData?.resignation_type_name === 'Resigned'? 'Resigned And Relieved': '',
             'value':
             tempData?.resignation_type_name === 'Resigned'
             ? 'resigned_and_relieved'
             : '',
             id: tempData.resignation_type,
            };
             
          }
      else if (tempData?.resignation_type === 1)
        {
          employeeStatus = {
            'label': 'Abscounded',
            'value': tempData?.resignation_type_name,
            id: tempData.resignation_type,
           };
          }
        else{
          employeeStatus = {
              'label': 'Terminated',
              'value': tempData?.resignation_type_name,
              id: tempData.resignation_type,
           };
          };
          console.log('employeeStatus=====>>: ', employeeStatus);
    const obj = {
      employee_name: tempData?.user?.full_name ? tempData?.user?.full_name : empName,
      employee_status: employeeStatus,
    };
    updateDefaultValues({
      ...obj,
    }
    );
    setShowLoader(false);
    }
    else{
      const obj = {
        employee_status: '',
        employee_name: empName ? empName :tempData?.user?.full_name,
      };
      updateDefaultValues({
        ...obj,
      })
      setShowLoader(false);
    }
  };


  const getEnployeeBGVDetails = async () => {
    setShowLoader(true);

    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.employeeVerificationUrl}?employee=${employeeId}`
    );
    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        swal.close();
      });
    }
    const bgvDetails = data?.data?.[0];
    setUpdateID(bgvDetails?.id);

    if (data && data?.success) {
      const employeeStatus = bgvDetails?.employee_status
        ? {
            label: bgvDetails?.employee_status_name,
            value: bgvDetails?.employee_status_name
              ? 'resigned_and_relieved'
              : '',
            id: bgvDetails?.employee_status,
          }
        : '';
      const finalStaus = bgvDetails?.final_settlement_status
        ? {
            label: bgvDetails?.final_settlement_status_name,
            // value:
            //   bgvDetails?.final_settlement_status_name
            //     ,
            id: bgvDetails?.final_settlement_status,
          }
        : '';
      const noticeStatus = bgvDetails?.notice_period_served_status
        ? {
            label: bgvDetails?.notice_period_served_status_name,
            // value:
            //   bgvDetails?.notice_period_served_status_name
            //     ,
            id: bgvDetails?.notice_period_served_status,
          }
        : '';
      // let rehireStatus = [];
      // rehireStatus = bgvDetails?.eligible_for_rehire
      //   ? []
      //   : '';
      // console.log(
      //   '🚀 ~ getEnployeeBGVDetails ~ rehireStatus+++++:',
      //   rehireStatus
      // );
      // updateOptions({
      //     ...options,
      //     eligible_for_rehire: rehireStatus,
      // });
      const obj = {
        employee_name: bgvDetails?.full_name,
        annual_compensation: bgvDetails?.annual_compensation,
        employee_status: employeeStatus,
        final_settlement_status: finalStaus,
        final_settlement_reason: bgvDetails?.final_settlement_reason,
        reason_of_leaving: bgvDetails?.reason_of_leaving,
        notice_period_served_status: noticeStatus,
        notice_period_served_reason: bgvDetails?.notice_period_served_reason,
        eligible_for_rehire: [`${bgvDetails?.eligible_for_rehire}`],
        eligible_for_rehire_reason: bgvDetails?.eligible_for_rehire_reason,
        remark: bgvDetails?.remark,
      };
      updateDefaultValues({ ...obj });
    }
    setShowLoader(false);
  };

  const getFinal_settlement_status = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.undefined);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      final_settlement_status: dpOptions,
    };
    updateOptions(allOptions);
  };

  const getNotice_period_served_status = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.undefined);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      notice_period_served_status: dpOptions,
    };
    updateOptions(allOptions);
  };

  // Submit Form

  const submitForm = async (formValues) => {
    console.log('formValues: ', formValues);

    setShowLoader(true);

    const postData = {
      employee: +employeeId,
      employee_name: formValues?.employee_name,
      annual_compensation: formValues?.annual_compensation
        ? formValues?.annual_compensation
        : '',
      employee_status: formValues?.employee_status?.id,
      employee_status_name: formValues?.employee_status?.value,
      final_settlement_status: formValues?.final_settlement_status?.id,
      final_settlement_reason: formValues?.final_settlement_reason,
      notice_period_served_status: formValues?.notice_period_served_status?.id,
      notice_period_served_reason: formValues?.notice_period_served_reason,
      eligible_for_rehire: formValues?.eligible_for_rehire?.[0] ? true : false,
      eligible_for_rehire_reason: formValues?.eligible_for_rehire_reason,
      reason_of_leaving: formValues?.reason_of_leaving,
      remark: formValues?.remark,
    };

    const { data, message } = editEmployeeDetails
      ? await AuthApi.putDataToServer(
          `${Api.employeeVerificationUrl}${updateID}/`,
          postData
        )
      : await AuthApi.postDataToServer(Api.employeeVerificationUrl, postData);
    if (data && data?.success) {
      swal(data?.message?.[0], '', 'success').then(() => {
        historyData.push(`/employee-profile/${employeeId}`);
      });
    } else {
      swal(data?.message?.[0] || message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    setShowLoader(false);
    // Perform success actions
  };

  return (
    <>
      <Helmet title="Employee Verification" />
      <div className="page-header">
        <Loader showLoader={isShowLoader} needFullPage={false} />
        <div className="title-breadcrumb-section d-flex justify-content-end ">
          <Button
            className="float-end mt-2 mb-2 mr-3 py-2"
            onClick={() => historyData.push(`/employee-profile/${employeeId}`)}
          >
            Back
          </Button>
        </div>
        <Card>
          <Card.Body>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={verificationSchema}
              formHeading="Employee Verfication Form"
              onFormSubmit={(formValues) => {
                submitForm(formValues);
              }}
              options={options}
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText={
                editEmployeeDetails === 'edit' ? 'Update' : 'Submit'
              }
              showResetBtn={true}
              resetBtnText="Clear"
              btnContainerClass="form-submit-buttons"
              showBtnClass={true}
              isStepForm={false}
              onFormReset={() => {
                // console.log('form reset callback');
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(EmployeeVerification);
