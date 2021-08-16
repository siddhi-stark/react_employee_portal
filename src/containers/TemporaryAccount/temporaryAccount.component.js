import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { Tabs, Tab, Image, ProgressBar, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Personal from './personal.component';
import EducationalDetails from './educational.component';
import PreviousEmployement from './previousEmployement.component';
import EmployementHistory from './employementHistory.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function TemporaryAccount() {
  const title = 'Applications';
  const [isPersonalId, setPersonalId] = useState(null);
  const [isEducationalId, setEducationalId] = useState(null);
  const [isHistoryId, setHistoryId] = useState(null);
  const [isBI, setIsBI] = useState(true);
  const [isPD, setIsPD] = useState(true);
  const [isED, setIsED] = useState(true);
  const [personalInfo, setPersonalInfo] = useState(true);
  
  // Get user role
  const getData = async () => {
    const endPoint = `${Api.applicantInfoUrl}?email_hash=gAAAAABhE6bH7Vx0DOeO9AItGzKTT-ZUe7_TQC02ga8bPVmWNbnsHkZUPXNuA3yrLkGXRz1xjvjWtnmEhvDPiMwfEQTkk57MkWChl8N2DQZMlpHxbAcpOwk=`;
   
    const { data, message } = await AuthApi.getDataFromServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setPersonalInfo((data && data.data) || []);
    } else {
      swal(message, '', 'error');
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
            <Button className="pull-right mb-3">Back</Button>
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
                      <h6>Pf Included - {personalInfo.isPf}</h6>
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
                        // label="completed"
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
                  disabled={isBI}
                >
                {
                  isPersonalId && ( 
                  <div className="row ml-2">
                    <EducationalDetails
                    isPersonalId={isPersonalId}
                    onEducationalInfo={(value) => {
                      setEducationalId(value);
                      setIsPD(false);
                    }}
                    />
                  </div>
                  )
                }
                </Tab>
                <Tab eventKey="employmentHistory" title="Employment History"
                 disabled={isPD}>
                 {
                    isEducationalId && (
                  <div className="row ml-2">
                    <EmployementHistory
                    onHistoryInfo={(value) => {
                        setEducationalId(value);
                      setPersonalId(value);
                      setHistoryId(value);
                      setIsED(false);
                    }}
                    />
                  </div>
                    )
                 }
                </Tab>
                <Tab eventKey="previousEmployment" title="Previous Employment"
                 disabled={isED}
                 >
                 {
                    isHistoryId && (
                  <div className="row ml-2">
                    <PreviousEmployement
                     isHistoryId={isHistoryId}
                    />
                  </div>
                    )
                 }
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
