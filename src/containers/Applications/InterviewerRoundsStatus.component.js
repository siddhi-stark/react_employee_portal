import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import { Row, Col, Card } from 'react-bootstrap';
import InterviewerRoundsFormSections from './interviewerRoundsFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
// import customFunctions from '../../helper/customFunctions';

function InterviewerRoundsStatus(props) {
  const items = [
    { to: '/', label: 'Home' },
    { to: '/intervie', label: 'Interviewer Rounds' },
  ];

  const title = 'Interviewer Rounds';
  const initialState = {
    interviewDate: '',
    interviewTime: '',
    interviewSelector: '',
    interviewRound: '',
  };
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  // const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [interviewData, setInterviewData] = useState(initialState);
  const [interviewId, setInterviewId] = useState('');
  const [applicantRoundsId,setApplicantRoundsId] = useState('');
  const history = useHistory();
  const { isProfessionalInfoId } = props;

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const getData = async (id) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.interviewUrl}${id}/`
    );
    if (data) {
      const appId = data.data.applicant_rounds.length - 1;
      console.log('appId',appId);
      setApplicantRoundsId(data.data.applicant_rounds);
      data.data && data.data.applicant_rounds.map((dt, index)=>{
        if(index === appId)
      setInterviewData({
        interviewDate: dt.int_date,
        interviewTime: dt.int_time,
        interviewSelector: dt.interviewer_name,
        interviewRound: dt.status_name,
      });
      updateDefaultValues({status:String(dt.status), comments: dt.comments})
      return dt;
      })
    }
  };

  useEffect(() => {
    setInterviewId(isProfessionalInfoId);
    getData(isProfessionalInfoId);
  }, [isProfessionalInfoId]);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);
    console.log('applicantRoundsId',applicantRoundsId);
      const id = applicantRoundsId.length - 1;
      console.log('id',id);
      let newId = '';
    applicantRoundsId.map((data,i) => {
      console.log('data',data);
      if(id === i) {
        newId = data.applicant_round_id;
      }
      return data;
    })
    const { data, message } = await AuthApi.putDataToServer(
      `${Api.interviewUrl}${newId ? Number(newId) : Number(interviewId)}/`,
      formValues
    );
    if (data) {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
        history.push('/recruitment');
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    // Perform success actions
  };
  console.log('defaultValues',defaultValues);
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Interviewer Rounds</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="mt-4">
        <Row className="mt-3">
          <Col>
            <p>Interview Date - {interviewData.interviewDate} </p>
          </Col>
          <Col>
            <p>Interview Time - {interviewData.interviewTime} </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Select Interviewer - {interviewData.interviewSelector} </p>
          </Col>
          <Col>
            <p>Round - {interviewData.interviewRound} </p>
          </Col>
        </Row>

        <StarkFormBuilder
          containerClass=""
          formHeaderClass=""
          formSections={InterviewerRoundsFormSections}
          formHeading=""
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          // options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Submit"
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass='form-submit-buttons'
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />
      </Card>
    </>
  );
}

export default withRouter(InterviewerRoundsStatus);
