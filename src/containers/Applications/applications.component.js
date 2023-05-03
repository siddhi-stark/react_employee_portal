import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import BasicInformation from './BasicINfo.component';
import ProfessonalDetails from './ProfessionalDetails.component';
import NewInterviewRounds from './NewInterviewRounds.component';
import InterviewerRoundsStatus from './InterviewerRoundsStatus.component';
import customFunctions from '../../helper/customFunctions';
// import NewInterviewRounds7 from './NewInterviewRound7';

function Applications(props) {
  const title = 'Applications';
  const application = props;
  const id = application.match.params.ID;
  const statusObj = props;
  const paginationOptions = statusObj.location.state
    ? statusObj.location.state.statusObj
    : '';
  const Interview = statusObj.location.state
    ? statusObj.location.state.isInterview
    : '';
  const items = [{ to: '/', label: 'Home' }, { label: 'Applications' }];
  const [isBasicInfoId, setBasicInfo] = useState(null);
  const [isProfessionalInfoId, setProfessionalInfo] = useState(null);
  const [isBI, setIsBI] = useState(true);
  const [isPD, setIsPD] = useState(true);
  const [key, setKey] = useState('currentEmployee');
  const history = useHistory();

  const group = customFunctions.getLocalStorage('group');

  const handleSelect = (emp) => {
    if (emp === 'currentEmployee') {
      setKey('currentEmployee');
    } else if (emp === 'noticePeriod') {
      setKey('noticePeriod');
    } else if (emp === 'oldPeriod') {
      setKey('oldPeriod');
    }
  };

  useEffect(() => {
    if (id) setIsPD(false);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button
          className="float-end"
          onClick={() => {
            if (Interview) {
              history.push('/interview-listing');
            } else {
              history.push('/recruitment');
            }
          }}
        >
          Back
        </Button>
        <h2 className="main-content-title tx-24 mg-b-5">Applications</h2>
        <Breadcrumb items={items} />
        <section className="content-area">
          <div>
            <Tabs
              defaultActiveKey="currentEmployee"
              onSelect={(e) => handleSelect(e)}
            // id="uncontrolled-tab-example"
            >
              <Tab eventKey="currentEmployee" title="Basic Information">
                <div className="row ml-2">
                  {key === 'currentEmployee' && (
                    <BasicInformation
                      onBasicInfo={(value) => {
                        setProfessionalInfo(value);

                        setBasicInfo(value);
                        setIsBI(false);
                      }}
                    />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="noticePeriod"
                title="Professional Details"
                disabled={isBI}
              >
                {(!id || (id && isBasicInfoId)) && (
                  <div className="row ml-2">
                    {key === 'noticePeriod' && (
                      <ProfessonalDetails
                        isBasicInfoId={isBasicInfoId}
                        onProfDetInfo={(value) => {
                          setProfessionalInfo(value);
                          if (id) {
                            setIsPD(false);
                          } else {
                            setIsPD(true);
                          }
                        }}
                      />
                    )}
                  </div>
                )}
              </Tab>
              <Tab
                eventKey="oldPeriod"
                title="Interview Rounds"
                disabled={isPD || paginationOptions === 'pending'}
              >
                {key === 'oldPeriod' && (
                  <div className="row ml-2">
                    {(Number(group) === 4 || Number(group) === 3) || Number(group) === 7 &&
                      isProfessionalInfoId ? (
                      <InterviewerRoundsStatus
                        isProfessionalInfoId={isProfessionalInfoId}
                      />
                    ) : (
                      <NewInterviewRounds
                        isProfessionalInfoId={isProfessionalInfoId}
                      />
                    )}
                  </div>
                )}
                {/* {key === 'oldPeriod' &&  && (
                  <div className="row ml-2">
                    <NewInterviewRounds7
                      isProfessionalInfoId={isProfessionalInfoId}
                    />
                  </div>
                )

                } */}
              </Tab>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(Applications);
