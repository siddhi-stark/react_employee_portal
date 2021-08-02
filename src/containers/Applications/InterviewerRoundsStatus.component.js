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
  const [statusName,setStatusName] = useState([]);
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
      setApplicantRoundsId(data.data.applicant_rounds);
      data.data.applicant_rounds.map((round) => {
        setStatusName(round.status_name);
        return round;
      });
      setInterviewData({
        interviewDate: data.data.applicant_rounds[0].int_date,
        interviewTime: data.data.applicant_rounds[0].int_time,
        interviewSelector: data.data.applicant_rounds[0].interviewer_name,
        interviewRound: data.data.applicant_rounds[0].status_name,
      });
      updateDefaultValues({status:String(data.data.applicant_rounds[0].status), comments: data.data.applicant_rounds[0].comments})
    }
  };

  useEffect(() => {
    setInterviewId(isProfessionalInfoId);
    getData(isProfessionalInfoId);
  }, [isProfessionalInfoId]);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);
    console.log('applicantRoundsId',applicantRoundsId[0].applicant_round_id);
      const id = applicantRoundsId.length - 1;
      console.log('id',id);
   
       const newId = applicantRoundsId[0].applicant_round_id;
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
  return (
    <>
    {console.log('applicantRoundsId',statusName,applicantRoundsId)}
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Interviewer Rounds</h2>
        <Breadcrumb items={items} />
      </div>

       {
         applicantRoundsId.length > 0 && applicantRoundsId.map((round) => (
          <Card body className="mt-4">

          <Row>
          <Col md={6}>
            <p>Interview Date - {round.int_date} </p>

          </Col>
          <Col md={6}>

            <p>Interview Time - {round.int_time} </p>
          </Col>

          </Row>

          <Row>
          <Col md={6}>

            <p>Round Name - {round.round_type_name} </p>
          </Col>
          <Col md={6}>

            <p>Round Status - {round.status_name} </p>
          </Col>

          </Row>
            <Col md={5}>

            <p>Comment - {round.comments} </p>

            </Col>
         </Card>
         ))
       }

       
      <Card body className="mt-4">
        <Row className="mt-3">
          <Col>
            <p>Interview Date - {interviewData.interviewDate} </p>
          </Col>
          <Col>
            <p>Interview Time - {interviewData.interviewTime} </p>
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
