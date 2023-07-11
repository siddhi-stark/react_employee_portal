/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

const NoticePeriodLastDay = () => {
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const [joiningDate, setJoiningDate] = useState();
  // console.log('joiningDate',joiningDate);
  const [relievingDate, setRelievingDate] = useState();
  // console.log('relievingDate',relievingDate);
  const [experienceCount, setExperienceCount] = useState();
  const [count, forceUpdate] = useState(0);
  // console.log('experienceCount', experienceCount);
  // console.log('relievingDate', relievingDate);

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const getEmployeeDetails = async () => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(`${Api.profileUrl}`);
    // console.log('data--------', data);
    if (data) {
      setShowLoader(false);
      setEmployeeDetails(data.data);
      setRelievingDate(data.data.notice_period_date);
      setJoiningDate(data.data.date_joined);
    }
  };

  useEffect(() => {
    // calculateDifference();
    handleCalculate();
  }, [relievingDate, joiningDate]);

  const calculateDifference = (joiningDate, relievingDate) => {

    const diffTime = Math.abs(relievingDate - joiningDate);
    // console.log('diffTime', diffTime);
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    // console.log('diffYears',  diffYears);
    return diffYears;
  };

  const handleCalculate = () => {
    const startDate = new Date(joiningDate);
    // console.log('startDate',startDate);
    const endDate = new Date(relievingDate);
    // console.log('endDate',endDate);
    const difference = calculateDifference(startDate, endDate);
    // console.log('differencedifference', difference); // Output: 2
    setExperienceCount(difference);
  };

  // function calculatePeriod(startDate, endDate) {
  //   const start = new Date();
  //   const end = new Date();

  //   const difference = Math.abs(end - start);

  //   const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  //   return days;
  // }

  return (
    <>
      {employeeDetails.notice_period_date ===
      customFunctions.getDate(new Date()) ? (
        <div className="p-3 mb-3 mt-3 alert alert-info" role="alert">
          Hello{' '}
          {customFunctions.capitalizeFirstLetter(employeeDetails.full_name)}
          ,
          <br />
          Today is your Last working day at stark digital media services.
          <br />
          Congratulations on completing your {experienceCount} years at Stark
          Digital and Best of Luck for the future.
          <br />
          We need to follow some basic steps before leaving
          <br />
          - KT for Projects.
          <br />
          - Documentation for Projects.
          <br />
          - Complete Pending task/Assignment.
          <br />
        </div>
      ) : null}
    </>
  );
};

export default withRouter(NoticePeriodLastDay);
