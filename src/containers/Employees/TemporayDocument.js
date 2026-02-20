/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { Tabs, Tab, Image, ProgressBar, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { Helmet } from '../../components/FormInputs';
import AddDocuments from './AddDocuments';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function TemporayDocument(props) {
  const { state } = useLocation();
  const accProps = { props };
  const employeeId = accProps?.props?.match?.params?.id;
  const applicantId = accProps?.props?.applicantId;
  const passwordProps = accProps?.props?.password;
  const tokenProps = accProps?.props?.token;
  const title = 'Applications';
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [personalInfo, setPersonalInfo] = useState(null);
  const [idEmp, setEmpId] = useState('');
  const [toggle, setToggle] = useState(false);
  const [key, setKey] = useState('');
  const [completion, setCompletion] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [showED, setShowED] = useState(false);

  const getData = async () => {
    // const endPoint = employeeId
    //   ? `${Api.applicantInfoUrl}?employee_id=${employeeId}`
    //   : `${Api.applicantInfoUrl}`;

    // const endPoint = applicantId
    //   ? `${Api.applicantInfoUrl}?employee_id=${employeeId}`
    //   : employeeId
    //   ? `${Api.employeeInfo}?employee_id=${employeeId}`
    //   : `${Api.employeeInfo}`;
    let endPoint;

    if (state?.state?.applicantId) {
      endPoint = `${Api.applicantInfoUrl}?employee_id=${state?.state?.employeeId}`;
    } else if (state?.state?.employeeId) {
      endPoint = `${Api.employeeInfo}?employee_id=${state?.state?.employeeId}`;
    } else {
      endPoint = `${Api.employeeInfo}`;
    }
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
    };
    // const { data, message } = await AuthApi.postDataToServer(endPoint, payload);

    let response;
    if (applicantId) {
      response = await AuthApi.postDataToServer(endPoint, postData);
    } else {
      response = await AuthApi.getDataFromServer(endPoint);
    }

    const { data, message } = response;

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setPersonalInfo((data && data?.data) || []);
      setName(data?.data?.name);
      setEmail(data?.data?.email);
      setEmpId(data?.data?.emp_id);
      await setToggle(true);
    } else {
      swal(
        message == 'Please add valid email_hash and password.'
          ? 'Incorrect password'
          : message,
        '',
        'error'
      );
      props.callback(true);
    }
  };

  useEffect(() => {
    setKey('Personal');
    setToggle(true);
  }, []);

  const handleSelect = (emp) => {
    if (emp === 'Personal') {
      setKey('Personal');
    } else if (emp === 'educational') {
      setKey('educational');
    } else if (emp === 'employmentHistory') {
      setKey('employmentHistory');
    } else if (emp === 'previousEmployment') {
      setKey('previousEmployment');
    }
  };

  useEffect(() => {
    if (personalInfo) setId(personalInfo.id);
  }, [personalInfo]);

  useEffect(() => {
    getData();
  }, [applicantId]);

  const getCompletionData = (value) => {
    setCompletion(value);
  };

  useEffect(() => {
    if (trigger) {
      getCompletionData(completion);
    }
  }, [trigger, completion]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <section className="content-area">
          <div className="col-xl-12" id="main-content">
            <div className="employee-new-profile">
              <div className="logout-btn pull-right">
                {/* <Button
                  variant="primary"
                  onClick={() => {
                    sessionStorage.clear();
                    if (employeeId) {
                      history.push(`/employee-profile/${employeeId}`);
                    } else {
                      history.push('/login');
                    }
                  }}
                >
                  {employeeId ? 'Back' : 'Logout'}
                </Button> */}
              </div>
              <div className="row ml-2">
                <AddDocuments
                  token={tokenProps}
                  password={passwordProps}
                  name={name}
                  email={email}
                  personalInfo={personalInfo}
                  applicantId={applicantId}
                  empId={idEmp}
                  getParentsData={(value) => {
                    if (value) {
                      setTrigger(true);
                      getCompletionData(value);
                      setCompletion(value);
                    }
                  }}
                  callback={(value, isShow) => {
                    getData();
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(TemporayDocument);
