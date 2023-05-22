import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';


const NoticePeriodLastDay = () => {

  const [employeeDetails, setEmployeeDetails] = useState({});
  console.log('employeeDetails',employeeDetails);
  const [isShowLoader, setShowLoader] = useState(false);
  console.log('isShowLoader',isShowLoader);

  useEffect(()=>{
    getEmployeeDetails();
  },[])

  const getEmployeeDetails = async () => {
    setShowLoader(true);
    // const employeeId = match.params.id;
    // const empId = customFunctions.getLocalStorage('id');
    // console.log('empId',empId);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${94}/`
    );
    if (data) {
      setShowLoader(false);
      setEmployeeDetails(data.data);
    }
  };

  return (
    <div className="p-3 mb-3 mt-3 alert alert-info" role="alert">
      Hello {customFunctions.capitalizeFirstLetter(employeeDetails.full_name)},<br />
      Today is your Last working day at stark digital media services.<br />
      Congratulations on completing your 5 years at Stark Digital and Best of Luck for the future.<br />
      We need to follow some basic steps before leaving<br />

      - KT for Projects.<br />
      - Documentation for Projects.<br />
      - Complete Pending task/Assignment.<br />
    </div>
  )
}

export default withRouter(NoticePeriodLastDay);