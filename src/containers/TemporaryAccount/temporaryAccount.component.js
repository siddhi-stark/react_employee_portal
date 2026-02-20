/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tabs, Tab, Image, ProgressBar, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { Helmet } from '../../components/FormInputs';
import Personal from './personal.component';
import EducationalDetails from './educational.component';
import PreviousEmployement from './previousEmployement.component';
import EmployementHistory from './employementHistory.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function TemporaryAccount(props) {
  const accProps = { props };
  const employeeId = accProps?.props?.match?.params?.ID;
  const passwordProps = accProps?.props?.password;
  const tokenProps = accProps?.props?.token;
  const title = 'Applications';
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [personalInfo, setPersonalInfo] = useState(null);
  const [idEmp, setEmpId]= useState('');
  const [toggle, setToggle] = useState(false);
  const [key, setKey] = useState('');
  const [completion, setCompletion] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [showED, setShowED] = useState(false);

  const getData = async () => {
    const endPoint = employeeId
      ? `${Api.applicantInfoUrl}?employee_id=${employeeId}`
      : `${Api.applicantInfoUrl}`;
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
    };
    const { data, message } = await AuthApi.postDataToServer(endPoint, payload);

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
  }, []);

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
                <Button
                  variant="primary"
                  onClick={() => {
                    sessionStorage.clear();
                    if (employeeId) {
                      history.push('/candidates');
                    } else {
                      history.push('/login');
                    }
                  }}
                >
                  {employeeId ? 'Back' : 'Logout'}
                </Button>
              </div>
              <div className="profile-bg">
                <Image src="/images/image.png" alt="image" />
                <div className="profile-img">
                  <Image src={`${Api.s3UrlnoProfile}`} alt="Card image cap" />
                </div>
              </div>
              <h3>{personalInfo && personalInfo?.name}</h3>
              <h5>{personalInfo && personalInfo?.applied_for_name}</h5>
              <div className="table-projects">
                <div className="mt-4 card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 d-flex">
                        <div className="col-md-3">
                          <h6>Email - {personalInfo && personalInfo?.email}</h6>
                        </div>
                        <div className="col-md-3">
                          <h6>
                            Contact No - {personalInfo && personalInfo?.mobile}
                          </h6>
                        </div>
                        <div className="col-md-3">
                          <h6>
                            Pf Included -{' '}
                            {personalInfo && personalInfo?.pf_included === true
                              ? 'Yes'
                              : 'No'}
                          </h6>
                        </div>
                        <div className="col-md-3">
                          <h6>
                            Miscellaneous Included -{' '}
                            {personalInfo && personalInfo.pf_included === true
                              ? 'Yes'
                              : 'No'}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row d-flex">
                      <div className="col-md-12 d-flex">
                        <div className=" col-md-3">
                          <h6>
                            Offered CTC -{' '}
                            {personalInfo && personalInfo?.offered_ctc}
                          </h6>
                        </div>
                        <div className="col-md-3">
                          <h6>
                            Joining Date -{' '}
                            {personalInfo && personalInfo.joining_date
                              ? customFunctions.getDMYDate(
                                  personalInfo?.joining_date
                                )
                              : ''}
                          </h6>
                        </div>
                        <h6>Profile Completion - &nbsp; &nbsp;</h6>
                        <ProgressBar
                          bsPrefix="progress pbar"
                          variant="success pe-2"
                          className=""
                          now={
                            completion
                              ? Number(completion)
                              : personalInfo && Number(personalInfo?.completion)
                          }
                          label={`${
                            completion
                              ? Number(completion)
                              : personalInfo && Number(personalInfo?.completion)
                          }% completed`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <Tabs activeKey={key} onSelect={(e) => handleSelect(e)}>
                <Tab eventKey="Personal" title="Upload Documents">
                  {key === 'Personal' && toggle && ( */}
              <div className="row ml-2">
                <Personal
                  token={tokenProps}
                  password={passwordProps}
                  name={name}
                  email={email}
                  personalInfo={personalInfo}
                  applicantId={id}
                  empId ={idEmp}
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
              {/* )} */}
              {/* </Tab> */}
              {/* <Tab
                  eventKey="educational"
                  title="Educational Documents"
                  // disabled={!showED}
                >
                  {key === 'educational' && (
                   
                    <div className="row ml-2">
                      <EducationalDetails
                        token={tokenProps}
                        name={name}
                        email={email}
                        applicantId={id}
                        password={passwordProps}
                        getParentsData={(value) => {
                          if (value) {
                            setTrigger(true);
                            getCompletionData(value);
                            setCompletion(value);
                          }
                        }}
                      />
                    </div>
                  )}
                </Tab> */}
              {/* {personalInfo && !personalInfo.is_fresher && (
                  <Tab eventKey="employmentHistory" title="Employment History">
                    {key === 'employmentHistory' && (
                      <div className="row ml-2">
                        <EmployementHistory
                          token={tokenProps}
                          name={name}
                          email={email}
                          id={id}
                          applicantId={id}
                          password={passwordProps}
                          getParentsData={(value) => {
                            if (value) {
                              setTrigger(true);
                              setCompletion(value);
                              getCompletionData(value);
                              setCompletion(value);
                            }
                          }}
                        />
                      </div>
                    )}
                  </Tab>
                )} */}
              {/* {personalInfo && !personalInfo.is_fresher && (
                  <Tab
                    eventKey="previousEmployment"
                    title="Previous Employment"
                  >
                    {key === 'previousEmployment' && (
                      <div className="row ml-2">
                        <PreviousEmployement
                          name={name}
                          email={email}
                          applicantId={id}
                          token={tokenProps}
                          password={passwordProps}
                          getParentsData={(value) => {
                            if (value) {
                              setTrigger(true);
                              getCompletionData(value);
                              setCompletion(value);
                            }
                          }}
                        />
                      </div>
                    )}
                  </Tab>
                )} */}
              {/* </Tabs> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(TemporaryAccount);
