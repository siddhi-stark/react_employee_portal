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
  const candidateId = accProps.props.match.params.ID;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const title = 'Applications';
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [personalInfo, setPersonalInfo] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [key, setKey] = useState('Personal');
  const [completion, setCompletion] = useState(null);
  const [trigger, setTrigger] = useState(false);

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
      await setToggle(true);
    } else {
      swal(message,'','error');
    }
  };

  const handleSelect = (emp) => {
    if (emp === 'Personal') {
      setKey('Personal');
    } else if (emp === 'educational') {
      setKey('educational');
    } else if (emp === 'employmentHistory') {
      setKey('employmentHistory');
    }else if (emp === 'previousEmployment') {
      setKey('previousEmployment');
    }
  };
  
  useEffect(() => {
    setId(personalInfo.id);
  }, [personalInfo]);

  useEffect(() => {
    getData();
  }, []);  

  const getCompletionData =(value) =>{
    setCompletion(value);
  };

  useEffect(() => {
    if(trigger) {
      getCompletionData();
      // window.location.reload();
    }
  }, [trigger]);

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
                    if(candidateId) {
                      history.push('/candidates');
                    } else {
                      history.push('/login');
                    }
                  }}
                >
                  {candidateId ? 'Back':'Logout'}
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
                    <div className="col-md-12 d-flex">
                     <div className=" col-md-4">
                      <h6>Offered CTC - {personalInfo.offered_ctc}</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Joining Date - { personalInfo.joining_date ?customFunctions.getDMYDate(personalInfo.joining_date):''}</h6>
                    </div>
                      <h6>Profile Completion - &nbsp; &nbsp;</h6> 
                      <ProgressBar
                        bsPrefix="progress pbar"
                        variant="success"
                        now={personalInfo.completion ? personalInfo.completion : completion}
                        label={`${personalInfo.completion ? personalInfo.completion : completion}% completed`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                defaultActiveKey="Personal"
                onSelect={(e) => handleSelect(e)}
              >
                <Tab eventKey="Personal" title="Personal Documents">
                 {((key === 'Personal') && toggle) && (
                  <div className="row ml-2">
                    <Personal
                      token={tokenProps}
                      password={passwordProps}
                      name={name}
                      email={email}
                      applicantId={id}
                      getParentsData={(value) => {
                        if(value){
                          setTrigger(true);
                          getCompletionData(value);
                        }
                      }}
                    />
                  </div>
                  )}
                </Tab>
                <Tab
                  eventKey="educational"
                  title="Educational Documents"
                >
               
                  {
                    (String(key) === 'educational' ) && (
                      <div className="row ml-2">
                        <EducationalDetails
                          token={tokenProps}
                          name={name}
                          email={email}
                          applicantId={id}
                          password={passwordProps}
                          getParentsData={(value) => {
                            if(value){
                              setTrigger(true);
                              getCompletionData(value);
                            }
                          }}
                        />
                      </div>
                    )}
                </Tab>
                {!personalInfo.is_fresher &&(
                <Tab
                  eventKey="employmentHistory"
                  title="Employment History"
                >

                  {( key === 'employmentHistory' ) && (
                      <div className="row ml-2">
                        <EmployementHistory
                          token={tokenProps}
                          name={name}
                          email={email}
                          id={id}
                          applicantId={id}
                          password={passwordProps}
                          getParentsData={(value) => {
                             if(value){
                              setTrigger(true);
                              getCompletionData(value);
                            };
                          }}
                        />
                      </div>
                    )}
                </Tab>
                )}
                {!personalInfo.is_fresher &&(
                <Tab
                  eventKey="previousEmployment"
                  title="Previous Employment"
                >
                  {(key === 'previousEmployment') && (
                      <div className="row ml-2">
                        <PreviousEmployement
                          name={name}
                          email={email}
                          applicantId={id}
                          token={tokenProps}
                          password={passwordProps}
                          getParentsData={(value) => {
                             if(value){
                              setTrigger(true);
                              getCompletionData(value);
                            }
                          }}
                        />
                      </div>
                    )}
                </Tab>
                )}

              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(TemporaryAccount);
