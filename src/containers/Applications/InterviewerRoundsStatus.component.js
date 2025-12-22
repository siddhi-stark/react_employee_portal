/* eslint-disable */
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
import { param } from 'jquery';

function InterviewerRoundsStatus(props) {
  const items = [{ to: '/', label: 'Home' }, { label: 'Interview Rounds' }];

  const title = 'Interview Rounds';
  const initialState = {
    interviewDate: '',
    interviewTime: '',
    interviewSelector: '',
    interviewRound: '',
  };

  const [defaultValues, updateDefaultValues] = useState({});
  
  const [currentUser, updateCurrentUser] = useState(0);

  const [interviewData, setInterviewData] = useState(initialState);
  const [interviewId, setInterviewId] = useState('');
  const [applicantInterviewId, setApplicantInterviewId] = useState('');

  const [applicantRoundsId, setApplicantRoundsId] = useState('');

  const history = useHistory();

  const { isProfessionalInfoId } = props;
  const statusObj = props;
  const Interview = statusObj.location.state
    ? statusObj.location.state.isInterview
    : '';

  useEffect(() => {
    const roleId = localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  }, []);

  const getData = async (id) => {
   const endpoint = `${Api.applicantRounds}${id}/`;
    const params = {
      // is_hr_personal:
      is_interview_round: true,
      
    };
    if (currentUser == 5) {
      params.is_hr_personal = 1;
    }
    if(currentUser == 1){
      params.is_admin_personal=1;
    }
    const url = customFunctions.generateUrl(endpoint, params);
    // const url = `${Api.applicantRounds}${id}/?is_interview_round=true${isHRPersonalParam}`;
    const { data } = await AuthApi.getDataFromServer(url);

    if (data) {
      // const { data } = await AuthApi.getDataFromServer(param);
      setApplicantInterviewId(
        data?.data?.applicant_rounds?.[0]?.applicant_round_id
      );
      setApplicantRoundsId([data?.data]);
      setInterviewData({
        interviewDate: data?.data?.applicant_rounds?.[0]?.int_date,
        interviewTime: data?.data?.applicant_rounds?.[0]?.int_time,
        interviewSelector:
          data?.data?.applicant_rounds?.interviewers_details?.interviewer_name,
        // interviewRound: data?.data?.applicant_rounds?.[0]?.status_name,
      });

      let statusKey = data?.data?.applicant_rounds?.[0]?.status;
      let stringStatusValue = statusKey.toString();

      updateDefaultValues({
        status: stringStatusValue,
        comments: data?.data?.applicant_rounds?.[0]?.comments,
        meet_link: data?.data?.applicant_rounds?.[0]?.meet_link,

      });
    }
  };
  useEffect(() => {
    setInterviewId(isProfessionalInfoId);
    if (currentUser) {
      getData(isProfessionalInfoId);
    }
  }, [isProfessionalInfoId, currentUser]);

  const submitForm = async (formValues) => {
    
    // return;
    const applicantId = customFunctions.getLocalStorage('applicantId');
    // const postData = [];
    const postData = {
      data: [
        {
          id: applicantInterviewId,
          comments: formValues?.comments,
          status: Number(formValues?.status),
          applicant: applicantId,
          // is_my_interview_update: currentUser === 5 ? true : false,
          is_my_interview_update: true,
        },
      ],
    };
    // if (applicantRoundsId?.length) {
    //   console.log("🚀 ~ submitForm ~ applicantRoundsId:", applicantRoundsId)
    //   postData.id =
    //     applicantRoundsId?.[0]?.applicant_rounds?.[0]?.applicant_round_id;
    //   (postData.comments = formValues?.comments),
    //     (postData.status = Number(formValues?.status)),
    //     (postData.applicant = applicantId),
    //     currentUser == 5 ? (postData.is_my_interview_update = true) : (postData.is_my_interview_update = false);
    // }
    const { data, message } = await AuthApi.putDataToServer(
      // `${Api.applicantRounds}`,

      // { data: postData }
      `${Api.applicantRounds}`,
      postData
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
      if (Interview || userRole !== 3 || userRole !== 4) {
        history.push('/interview-listing');
      } else {
        history.push('/recruitment');
      }
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Interview Rounds</h2>
        <Breadcrumb items={items} />
      </div>
      {applicantRoundsId?.length > 0 &&
        applicantRoundsId?.map(
          (round, i) => (
           
            (
              <>
                {i !== 0 && (
                  <Card body className="mt-4">
                    <Row>
                      <Col md={6}>
                        <p>
                          Interview Date -{' '}
                          {round.int_date
                            ? customFunctions.getDDMMYYYYDate(round.int_date)
                            : ''}{' '}
                        </p>
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
                )}
              </>
            )
          )
        )}

      <Card body className="mt-4">
        <Row className="mt-3">
          <Col>
            <p>
              Interview Date -{' '}
              {interviewData.interviewDate
                ? customFunctions.getDDMMYYYYDate(interviewData.interviewDate)
                : ''}{' '}
            </p>
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
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Submit"
          showResetBtn={true}
          showBtnClass={true}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {}}
        />
      </Card>
    </>
  );
}

export default withRouter(InterviewerRoundsStatus);
