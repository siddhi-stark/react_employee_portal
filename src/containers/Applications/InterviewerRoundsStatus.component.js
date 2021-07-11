import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Row, Col, Card } from 'react-bootstrap';
import InterviewerRoundsFormSections from './interviewerRoundsFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function InterviewerRoundsStatus() {
 
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
    
  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues,updateOptions,updateDefaultValues);
    
      const { data } = await AuthApi.postDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
      }
      // Perform success actions
      
  };
    
  return (
     <>
     <Card body className="mt-4">
     <Row className="mt-3">
       <Col>
       <p>Interview Date - 20/02/2021 </p>
       </Col>
       <Col>
       <p>Interview Time - 10 AM </p>
       </Col> 
     </Row>
     <Row>
       <Col>
       <p>Select Interviewer - Mahesh </p>
       </Col>
       <Col>
       <p>Round - Technical </p>
       </Col>
     </Row>

      <StarkFormBuilder
        containerClass=''
        formHeaderClass=''
        formSections={InterviewerRoundsFormSections}
        formHeading=""
        onFormSubmit={(formValues) => {submitForm(formValues);}}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}
        
        onFormReset={() => {
          console.log('form reset callback')
        }}
      />
      </Card>
     </>
  );
}

export default withRouter(InterviewerRoundsStatus);
