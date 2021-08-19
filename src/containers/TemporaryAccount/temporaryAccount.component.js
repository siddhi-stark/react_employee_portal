import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

import { Tabs, Tab, Image, ProgressBar, Button } from 'react-bootstrap';
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
  const candidateId = accProps.props.match.params.ID;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const title = 'Applications';
  const history = useHistory();
  const [isPersonalId, setPersonalId] = useState(false);
  const [isEducationalId, setEducationalId] = useState(false);
  const [isHistoryId, setHistoryId] = useState(false);
  const [isBI, setIsBI] = useState(true);
  const [isPD, setIsPD] = useState(true);
  const [isED, setIsED] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [personalInfo, setPersonalInfo] = useState(true);
  const [key, setKey] = useState('Personal');

  // Get user role
  const getData = async () => {
    const endPoint = candidateId
      ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`
      : `${Api.applicantInfoUrl}`;
    const payload = {
      email_hash: tokenProps,
      password: passwordProps,
    };
    const { data, message } = await AuthApi.postDataToServer(endPoint, payload);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setPersonalInfo((data && data.data) || []);
      setName(data.data.name);
      setEmail(data.data.email);
      setId(data.data.id);
    } else {
      console.log('error', message);
      // swal(message, '', 'error');
    }
  };

  const handleSelect = (emp) => {
    if (emp === 'Personal') {
      setKey('Personal');
    } else if (emp === 'educational') {
      console.log('emp',emp);
      setKey('educational');
    } else if (emp === 'employmentHistory') {
      setKey('employmentHistory');
    }else if (emp === 'previousEmployment') {
      setKey('previousEmployment');
    }
  };

  useEffect(() => {
    getData();
    if(candidateId) {
      setIsBI(false);
      setIsED(false);
      setIsPD(false);
      setPersonalId(false);
      setEducationalId(false);
      setHistoryId(false);
    }
  }, []);

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
                    history.push('/login');
                  }}
                >
                  Logout
                </Button>
              </div>
              <div className="profile-bg">
                <Image src="/images/image.png" alt="image" />
                <div className="profile-img">
                  <Image src={`${Api.s3UrlnoProfile}`} alt="Card image cap" />
                </div>
              </div>
              <h3>{personalInfo.name}</h3>
              <h5>{personalInfo.applied_for_name}</h5>
              <div className="table-projects">
                <div className="mt-4 card">
                  <div className="row">
                    <div className="col-md-4">
                      <h6>Email - {personalInfo.email}</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Contact No - {personalInfo.mobile}</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Pf Included - {(personalInfo.pf_included === true) ? 'Yes':'No'}</h6>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-3">
                      <h6>Profile Completion -</h6>
                    </div>
                    <div className="col-md-4">
                      <ProgressBar
                        bsPrefix="progress pbar"
                        variant="info"
                        now={personalInfo.completion}
                        label="completed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                defaultActiveKey="Personal"
                onSelect={(e) => handleSelect(e)}
                // id="uncontrolled-tab-example"
              >
                <Tab eventKey="Personal" title="Personal Documents">
                  <div className="row ml-2">
                 {key === 'Personal' && (
                    <Personal
                      token={tokenProps}
                      password={passwordProps}
                      name={name}
                      email={email}
                      onPersonalInfo={(value) => {
                        console.log('value--',value);
                        setPersonalId(value);
                        setIsBI(false);
                      }}
                    />
                  )}
                  </div>
                </Tab>
                <Tab
                  eventKey="educational"
                  title="Educational Documents"
                  disabled={isBI}
                >
               
                  {(isPersonalId ||
                    (candidateId && String(key) === 'educational' )) && (
                      <div className="row ml-2">
                        <EducationalDetails
                          token={tokenProps}
                          name={name}
                          email={email}
                          password={passwordProps}
                          isPersonalId={isPersonalId}
                          onEducationalInfo={(value) => {
                        console.log('setEducationalId--',value);
                            setEducationalId(value);
                            setIsPD(false);
                          }}
                        />
                      </div>
                    )}
                </Tab>
                <Tab
                  eventKey="employmentHistory"
                  title="Employment History"
                  disabled={isPD}
                >

                  {(isEducationalId ||
                    candidateId && ( key === 'employmentHistory' )) && (
                      <div className="row ml-2">
                        <EmployementHistory
                          token={tokenProps}
                          name={name}
                          email={email}
                          id={id}
                          password={passwordProps}
                          isEducationalId={isEducationalId}
                          onHistoryInfo={(value) => {
                            setHistoryId(value);
                            setIsED(false);
                          }}
                        />
                      </div>
                    )}
                </Tab>
                <Tab
                  eventKey="previousEmployment"
                  title="Previous Employment"
                  disabled={isED}
                >
                  {(isHistoryId ||
                    candidateId && ( key === 'previousEmployment')) && (
                      <div className="row ml-2">
                        <PreviousEmployement
                          name={name}
                          email={email}
                          token={tokenProps}
                          isHistoryId={isHistoryId}
                          password={passwordProps}
                        />
                      </div>
                    )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(TemporaryAccount);
