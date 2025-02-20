/* eslint-disable */
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
import InterviewQuestions from './InterviewQuestions';
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
  const pageType = props?.location?.state?.pageType;
  const items = [{ to: '/', label: 'Home' }, { label: 'Applications' }];
  const [notes, setNotes] = useState(null);
  const [isBasicInfoId, setBasicInfo] = useState(null);
  const [isProfessionalInfoId, setProfessionalInfo] = useState(null);
  const [isFresher, setIsFresher] = useState(null);
  const [isBI, setIsBI] = useState(true);
  const [isPD, setIsPD] = useState(true);
  const [key, setKey] = useState('currentEmployee');
  const [userRole, setUserRole] = useState(false);
  const [applicantId, setApplicantId] = useState()


  const history = useHistory();


  const group = customFunctions.getLocalStorage('group');

  

  useEffect(() => {
    if (isProfessionalInfoId) {
      return
      setIsPD(false);
    } else {
      setIsPD(true);
    }
  }, [isProfessionalInfoId]);

  useEffect(()=>{
    const uRole = customFunctions.getLocalStorage('group');
    setApplicantId(customFunctions.getLocalStorage('applicantId'));
    setUserRole(Number(uRole));
  },[])
  

  const handleSelect = (emp) => {
    if (emp === 'currentEmployee') {
      setKey('currentEmployee');
    } else if (emp === 'professional_details') {
      setKey('professional_details');
    } else if (emp === 'oldPeriod') {
      setKey('oldPeriod');
    }else if(emp === 'interviewQuestions'){
      setKey('interviewQuestions');
    }
  };
console.log("key", key);

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
            if (Interview || userRole !== 3 || userRole !== 4) {
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
              activeKey={key}
              
              onSelect={(e) => handleSelect(e)}
              // id="uncontrolled-tab-example"
            >
              <Tab eventKey="currentEmployee" title="Basic Information">
                <div className="row ml-2">
                  {key === 'currentEmployee' && (
                    <BasicInformation
                      onBasicInfo={(value, note) => {
                        setProfessionalInfo(value);
                        setBasicInfo(value);
                        setNotes(note);
                        setIsBI(false);
                      }}
                      callback={(value) => {
                        setProfessionalInfo(value);
                        setIsBI(false);
                        setBasicInfo(value);
                        setNotes(value);
                        handleSelect('professional_details');
                        setKey('professional_details');
                      }}
                    />
                  )}
                </div>
              </Tab>
              <Tab
                eventKey="professional_details"
                title="Professional Details"
                disabled={isBI}
              >
                {(!id || (id && isBasicInfoId)) && (
                  <div className="row ml-2">
                    {key === 'professional_details' && (
                      <ProfessonalDetails
                        isBasicInfoId={isBasicInfoId}
                        isFresherFlag={isFresher}
                        onProfDetInfo={(value) => {
                          setProfessionalInfo(value);
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
                    {Number(group) === 4 ||
                    Number(group) === 3 ||
                    (Number(group) === 7 && isProfessionalInfoId) ||
                    ((Number(group) === 5) && pageType === 'My_Interview') ? (
                      <InterviewerRoundsStatus
                        isProfessionalInfoId={isProfessionalInfoId}
                      />
                    ) : (
                      <NewInterviewRounds
                        isProfessionalInfoId={isProfessionalInfoId}
                        notes={notes}
                      />
                    )}
                  </div>
                )}
              </Tab>
              {pageType === 'My_Interview' && (
                <Tab eventKey="interviewQuestions" title="Interview Questions" disabled={isPD}>
                {key === "interviewQuestions" && (
                  <div className="row ml-2">
                    {(( pageType === "My_Interview")) && (
                      <InterviewQuestions applicant_id={applicantId} />
                    )}
                  </div>
                )}
              </Tab>
              )}
              
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(Applications);
