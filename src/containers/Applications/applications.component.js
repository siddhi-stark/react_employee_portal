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

function Applications(props) {
  const title = 'Applications';
  const id = props.match.params.ID; //eslint-disable-line
  const statusObj = props;
  const paginationOptions = statusObj.location.state
    ? statusObj.location.state.statusObj
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

  useEffect(()=>{
    if(id)
      setIsPD(false); 
  },[])

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button className="float-end" onClick={()=>history.push('/recruitment')}>Back</Button>
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
                          {(id) ? setIsPD(false) : setIsPD(true)} //eslint-disable-line
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
                    {(Number(group) === 4 || Number(group) === 3) && isProfessionalInfoId ? (
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
              </Tab>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(Applications);
