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
import customFunctions from '../../helper/customFunctions';

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

  const statusObj = props;

  const Interview = statusObj.location.state
    ? statusObj.location.state.isInterview
    : '';

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
      `${Api.roundsUrl}${id}/`
    );
    if (data) {
      setApplicantRoundsId(data.data.applicant_rounds);
      setInterviewData({
        interviewDate: data.data.applicant_rounds[0].int_date,
        interviewTime: data.data.applicant_rounds[0].int_time,
        interviewSelector: data.data.applicant_rounds[0].interviewer_name,
        interviewRound: data.data.applicant_rounds[0].status_name,
      });
      updateDefaultValues({status:String(data.data.applicant_rounds[0].status), comments: data.data.applicant_rounds[0].comments});
    }
  };

  useEffect(() => {
    setInterviewId(isProfessionalInfoId);
    getData(isProfessionalInfoId);
  }, [isProfessionalInfoId]);

  // Submit Form
  const submitForm = async (formValues) => {
      const applicantId = customFunctions.getLocalStorage('applicantId');

    const postData = [];
    applicantRoundsId.map((intrw,i) => {
      if(i !== 0) {

      postData.push({
        id:intrw.applicant_round_id,
        comments:intrw.comments,
        status:intrw.status,
        applicant: applicantId
        });
      }
      return intrw;
    });

    const newId = applicantRoundsId && applicantRoundsId[0].applicant_round_id;
    const abc = {
      id:newId ? Number(newId) : Number(interviewId),
        comments:formValues ? formValues.comments :'',
        status:formValues ? formValues.status :'',
        applicant: applicantId

    };

    //   const newId = applicantRoundsId && applicantRoundsId[0].applicant_round_id;
    //   postData.id = newId ? Number(newId) : Number(interviewId);
    //     postData.applicant = applicantId;
    //     postData.status = formValues ? formValues.status :'';
    //     postData.comments = formValues ? formValues.comments :'';
    // postData = {
    //    ...postData,
    //   }

    postData.push( 
      abc
    );
    const { data, message } = await AuthApi.postDataToServer(
      `${Api.roundsUrl}`,
      { 'data':postData}
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

      {Interview ? // eslint-disable-line
        history.push('/interview-listing') : 
        history.push('/recruitment');
      }

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
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Interviewer Rounds</h2>
        <Breadcrumb items={items} />
      </div>

       {
         applicantRoundsId.length > 0 && applicantRoundsId.map((round,i) => (
         <>
         {
           i !== 0 && (
          <Card body className="mt-4">

          <Row>
          <Col md={6}>
            <p>Interview Date - {round.int_date ? customFunctions.getDDMMYYYYDate(round.int_date) : ''} </p>

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

           )
         }
         </>
         ))
       }

      <Card body className="mt-4">
        <Row className="mt-3">
          <Col>
            <p>Interview Date - {interviewData.interviewDate ? customFunctions.getDDMMYYYYDate(interviewData.interviewDate) : ''} </p>
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
          onFormReset={() => {}}
        />
      </Card>
    </>
  );
}

export default withRouter(InterviewerRoundsStatus);
