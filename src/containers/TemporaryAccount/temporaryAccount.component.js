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
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const title = 'Applications';
  const history = useHistory();
  const [isPersonalId, setPersonalId] = useState(null);
  const [isEducationalId, setEducationalId] = useState(null); // eslint-disable-line
  const [isHistoryId, setHistoryId] = useState(null);
  const [isBI, setIsBI] = useState(true); // eslint-disable-line
  const [isPD, setIsPD] = useState(true); // eslint-disable-line
  const [isED, setIsED] = useState(true); // eslint-disable-line
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [personalInfo, setPersonalInfo] = useState(true);

  // Get user role
  const getData = async () => {
    const endPoint = `${Api.applicantInfoUrl}`;
    const payload = {
      email_hash: tokenProps,
      password: passwordProps
    }
    const { data, message } = await AuthApi.postDataToServer(endPoint,payload);

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <section className="content-area">
          <div className="col-xl-12" id="main-content">
            <div className="employee-new-profile">
              <Button
                variant="primary"
                className="mb-3 pull-right"
                onClick={() => {
                  history.push('/login');
                }}
              >
                Logout
              </Button>
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
                      <h6>{`Pf Included - ${personalInfo.pf_included}`}</h6>
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
                // onSelect={(e) => handleSelect(e)}
                // id="uncontrolled-tab-example"
              >
                <Tab eventKey="Personal" title="Personal Documents">
                  <div className="row ml-2">
                    <Personal
                      token ={tokenProps}
                      password ={passwordProps}
                      name ={name}
                      email ={email}
                      onPersonalInfo={(value) => {
                        setEducationalId(value);
                        setPersonalId(value);
                        setIsBI(false);
                      }}
                    />
                  </div>
                </Tab>
                <Tab
                  eventKey="educational"
                  title="Educational Documents"
                  // disabled={isBI}
                >
                    <div className="row ml-2">
                      <EducationalDetails
                      token ={tokenProps}
                      name ={name}
                      email ={email}
                      password ={passwordProps}
                        isPersonalId={isPersonalId}
                        onEducationalInfo={(value) => {
                          setEducationalId(value);
                          setIsPD(false);
                        }}
                      />
                    </div>
                </Tab>
                <Tab
                  eventKey="employmentHistory"
                  title="Employment History"
                  // disabled={isPD}
                >
                    <div className="row ml-2">
                      <EmployementHistory
                       token ={tokenProps}
                       name ={name}
                      email ={email}
                      id ={id}
                      password ={passwordProps}
                        onHistoryInfo={(value) => {
                          setEducationalId(value);
                          setPersonalId(value);
                          setHistoryId(value);
                          setIsED(false);
                        }}
                      />
                    </div>
                </Tab>
                <Tab
                  eventKey="previousEmployment"
                  title="Previous Employment"
                  // disabled={isED}
                >
                    <div className="row ml-2">
                      <PreviousEmployement name ={name}
                      email ={email} token ={tokenProps}
                      password ={passwordProps} isHistoryId={isHistoryId} />
                    </div>
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
