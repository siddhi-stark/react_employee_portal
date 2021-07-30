import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import BasicInformation from './BasicINfo.component';
import ProfessonalDetails from './ProfessionalDetails.component';
import NewInterviewRounds from './NewInterviewRounds.component';
import InterviewerRoundsStatus from './InterviewerRoundsStatus.component';
import customFunctions from '../../helper/customFunctions';

function Applications(props) {
  const title = 'Applications';
  const id = props.match.params.ID; //eslint-disable-line
  const items = [{ to: '/', label: 'Home' }, { label: 'Applications' }];
  const [isBasicInfoId, setBasicInfo] = useState(null);
  const [isProfessionalInfoId, setProfessionalInfo] = useState(null);
  const [isBI, setIsBI] = useState(true);
  const [isPD, setIsPD] = useState(true);

  const group = customFunctions.getLocalStorage('group');

  return (
    <>
      {console.log('isBasicInfoId', isBasicInfoId)}
      {console.log('isProfessionalInfoId', isProfessionalInfoId)}
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Applications</h2>
        <Breadcrumb items={items} />
        <section className="content-area">
          <div>
            <Tabs
              defaultActiveKey="currentEmployee"
              // id="uncontrolled-tab-example"
            >
              <Tab eventKey="currentEmployee" title="Basic Information" >
                <div className="row ml-2">
                  <BasicInformation
                    onBasicInfo={(value) => {
                      console.log('value--', value);
                      setBasicInfo(value);
                      setIsBI(false);
                    }}
                  />
                </div>
              </Tab>
              <Tab eventKey="noticePeriod" title="Professional Details" disabled={isBI}>
                {(!id || (id && isBasicInfoId)) && (
                  <div className="row ml-2">
                      <ProfessonalDetails
                        isBasicInfoId={isBasicInfoId}
                        onProfDetInfo={(value) => {
                          console.log('value',value);
                          setProfessionalInfo(value);
                          setIsPD(false);
                        }}
                      />
                  </div>
                )}
                
              </Tab>
              <Tab eventKey="old period" title="Interview Rounds" disabled={isPD}>
                <div className="row ml-2">
                  {Number(group) === 4 && isProfessionalInfoId ? (
                    <InterviewerRoundsStatus
                      isProfessionalInfoId={isProfessionalInfoId}
                    />
                  ) : (
                    <NewInterviewRounds
                      isProfessionalInfoId={isProfessionalInfoId}
                    />
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(Applications);