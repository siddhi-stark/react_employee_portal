/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './NewInterviewRounds.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function NewInterviewRounds(props) {
  const notes = customFunctions.getLocalStorage('notes');
  let defaultFilterOptions = {};
  // const [selectedStatus, setSelectedStatus] = useState(null); // State variable for selected status
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [isShowLoader, setShowLoader] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [googleLink, setGoogleLink] = useState();
  const { isProfessionalInfoId } = props;
  const history = useHistory();


  const [resumeLink, setResumeLink] = useState();
  const [applicantId, setApplicantId] = useState()

  console.log("defaultValues", defaultValues);

  useEffect(() => {
    if (applicantId) {
      getResumeData(applicantId);
    }
  }, [applicantId])

  const getResumeData = async (profId) => {
    setShowLoader(true);
    let params = {
      is_professional_details: true,
    };
    const endpoint = `${Api.applicantsUrl}${profId}`;
    const url = customFunctions.generateUrl(endpoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data) {
      setShowLoader(false);
      setResumeLink(data?.data?.resume)
    } else {
      setShowLoader(false);
    }
  };
  
  console.log("resumeLink", resumeLink);
  

  useEffect(() => {
    const formSchema = [...FormSections];
    setApplicantId(customFunctions.getLocalStorage('applicantId'));
     
    const updatedSchema = formSchema.map((section) => {
      const s = { ...section };
      s.fields = section.fields.map((item) => {
        item.fields.map((it) => {
          const itemData = it;
          const date = new Date();
          const minDate = new Date(date);
          minDate.setDate(minDate.getDate() - 90);
          const maxDate = new Date(date);
          maxDate.setDate(maxDate.getDate() + 90);
          if (it.name === 'int_date') {
            itemData.minDate = minDate;
            itemData.maxDate = maxDate;
          }
          if (it.name === 'id') itemData.disabled = true;

          return it;
        });
        return item;
      });
      return s;
    });
    updateJsonSchema([...updatedSchema]);
  }, []);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('applicantId');
    const postData = [];
    const formsAddmoreValue = formValues.addmore;
    let validData = [];

    formsAddmoreValue.filter((fil) => {
      validData.push({
        date: customFunctions.getDMYDate(fil.int_date),
        time: customFunctions.formatAMPM(fil.int_time),
      });
    });
    let flag = true;
    for (let element of validData) {
      for (let innerElement of validData) {
        if (element === innerElement) continue;

        if (
          innerElement.date === element.date &&
          innerElement.time === element.time
        ) {
          flag = false;
          break;
        }
      }
      if (flag === false) {
        break;
      }
    }
    let interviweRound   = null
    let interviewStatus = null
    let employee_id = null
    if (flag) {
      for (const more of formsAddmoreValue) {
        // eslint-disable-line
        console.log('more', more);
        interviweRound = more?.interviewerRounds?.value;
        interviewStatus = more?.status_name?.value;
        employee_id =
          more?.interviewer && more?.interviewer.length > 0
            ? more?.interviewer[0].value
            : null;
        // const applicant_id = id;
        setApplicantId(id);
        // console.log('applicant_id', applicant_id);
        console.log('employee_id', employee_id);
        console.log('interviweRound', interviweRound);
        console.log('interviewStatus', interviewStatus);
        console.log('resumeLink', resumeLink);

        // setShowLoader(false);
        // return;

        const interviwerData = [];
        more.interviewer.map((e) => interviwerData.push(e.value));
        const round = {
          int_date: more.int_date ? customFunctions.getDate(more.int_date) : '',
          int_time: more.int_time
            ? `${customFunctions.getTime(more.int_time)}`
            : '',
          round_type: more.interviewerRounds
            ? more.interviewerRounds.value
            : '',
          // interviewer: more.interviewer ? more.interviewer.value : '',
          interviewer: null,
          interviewer_ids: interviwerData,
          interview_type: more.interview_type
            ? Number(more.interview_type.value)
            : '',
          description: more.description
            ? more.description
            : 'Please attend the interview',
          comments: more.comments ? more.comments : '',
          // status : more.status_name?.value ? more.status_name?.value : 'pending',
          status: 'pending' ? more.status_name?.value : more.status_name?.value,

          applicant: Number(id) || '',
          id: more.id || '',
          is_my_interview_update: false,
        };

        postData.push(round);
      }
    } else {
      setShowLoader(false); // Stop the loader here
      return swal(
        'You cant update the interview date to same date time as previous',
        '',
        'error'
      );
    }
    // Create a new Date object
    // let currentDate = new Date();
    // let currentTime = currentDate.getTime();

    const { data, message } =
      await AuthApi./* postDataToServer */ putDataToServer(
        `${Api.applicantRounds}`,
        {
          data: postData,
        }
      );
    if (data) {
      setShowLoader(false);
      swal(
        postData[0]?.id === ''
          ? 'Applicant Interview round created successfully.'
          : data && data.message[0],
        '',
        'success',
        {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }
      ).then(() => {
        console.log(applicantId, employee_id, resumeLink, interviweRound);
        generateQuestions(applicantId, employee_id, resumeLink, interviweRound);
        history.push('/recruitment');
        getData(isProfessionalInfoId);
      
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: true,
        timer: 5000,
      }).then(() => {
        swal.close();
      });
    }
  };
  
  const getData = async (interviewerId) => {
    setShowLoader(true);
    // const { data } = await AuthApi.getDataFromServer(
    //   `${Api.applicantRounds}${interviewerId}/?is_interview_round=true`
    // );
    const endpoint = `${Api.applicantRounds}${interviewerId}/`;
    const params = {
      // is_hr_personal:
      is_interview_round: true,

    };
    const url = customFunctions.generateUrl(endpoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data) {
      setShowLoader(false);
      let newTime = '';
      let newDate = '';
      const interviewData = [];

      data?.data?.applicant_rounds?.map((dt) => {
        if (!customFunctions.checkIfEmpty(dt.int_date)) {
          newDate = new Date(dt.int_date);
        }
        if (
          !customFunctions.checkIfEmpty(dt.int_date) &&
          !customFunctions.checkIfEmpty(dt.int_time)
        ) {
          newTime = new Date(
            `${customFunctions.getDate(
              dt.int_date
            )}T${customFunctions.convertTime12to24(dt.int_time)}`
          );
        }
        const interviewerData = [];
        dt?.interviewers_details?.filter((item) => {
          interviewerData.push({
            label: item?.interviewer_name,
            value: item?.interviewer_id,
          });
        });
        return interviewData.push({
          interviewer: interviewerData,
          interviewer_ids: {
            label: interviewerData?.[0]?.label,
            value: interviewerData?.[0]?.value,
          },
          interviewerRounds: {
            label: dt.round_type_name,
            value: String(dt.round_type),
          },
          int_date: newDate,
          int_time: newTime,
          status_name: {
            label: 'Pending',
            value: '',
          },
          status_name: {
            label:
              data?.data == []
                ? 'Pending'
                : dt.status_name === 'pending'
                  ? 'Pending'
                  : dt.status_name === 'selected'
                    ? 'Selected'
                    : dt.status_name === 'rejected'
                      ? 'Rejected'
                      : dt.status_name === 'offered'
                        ? 'Offered'
                        : dt.status_name === 'declined'
                          ? 'Declined'
                          : dt.status_name,

            value: data?.data == [] ? 4 : dt?.status,
          },

          comments: dt.comments,
          interview_type: {
            label: dt.interview_type_name,
            value: dt.interview_type_id,
          },
          description: dt.description
            ? dt.description
            : 'Please attend the interview',
          id: dt.applicant_round_id,
          meet_link: dt.meet_link,
        });
      });

      if (interviewData?.[0]?.meet_link) {
        setGoogleLink(interviewData?.[0]?.meet_link)
      }

      if (interviewData) {
        updateDefaultValues({ addmore: [...interviewData] });
      }
      forceUpdate(count + 1);
    }
  };

  const generateQuestions = async (applicantId, employee_id, resumeLink, interviweRound) => {
    if (applicantId && employee_id && resumeLink && interviweRound === 3) {
      const params = {
        "applicant": +applicantId,
        "employee": +employee_id,
        "input_file_url": resumeLink
      }

      // const url = customFunctions.generateUrl(Api.prediction, params);  
      const { data, message } = await AuthApi.postDataToServer(Api.interviewQuestionsUrl, params);
    }
  }

  useEffect(() => {
    if (isProfessionalInfoId) {
      getData(isProfessionalInfoId);
    }
  }, [isProfessionalInfoId]);

  const getInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&status=active&show_self=1`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    await data.data.map((op) => {
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });

    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      interviewer: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  const getRoundsStatus = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=applicant_round_status`
    );

    if (!data) {
      return;
    }

    const dpOptions = [];
    (await data.data) &&
      data.data.applicant_round_status.map((op) => {
        dpOptions.push({ label: op.name, value: op.id });
        return op;
      });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      status_name: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  const getInterviewRounds = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=round_type`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    (await data.data) &&
      data.data.round_type.map((op) => {
        dpOptions.push({ label: op.name, value: op.id });
        return op;
      });
    // const defaultOption = dpOptions.find((option) => option.label === 'Pending');

    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      interviewerRounds: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
    // setSelectedStatus(defaultOption);
  };

  useEffect(() => {
    getInterviewer();
    getRoundsStatus();
    getInterviewRounds();
  }, []);

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <div className="mt-3">
        {/* {googleLink && (
          <>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 "></h5>

              <Button
                variant="secondary"
                className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                type="submit"
                onClick={() => {
                  window.open(googleLink)
                }}
              >
                Go to meeting
              </Button>

            </div>
            <br />
          </>
        )} */}

        {/* {notes == 'undefined' || notes == 'null' ? (
          '-'
        ) : ( */}
        <p>
          <strong className="mr-2">Notes : </strong>
          {notes == 'undefined' || notes == 'null' ? '-' : notes}

        </p>
        {/* <a href=''className='ml-5'>Join Google Meet</a> */}

        {/* )} */}
        <div>
          <StarkFormBuilder
            containerClass=""
            formHeaderClass=""
            formSections={jsonSchema}
            formHeading="form"
            onFormSubmit={(formValues) => {
              submitForm(formValues);
            }}
            options={options}
            defaultFormValues={defaultValues}
            refreshCounter={count}
            currentUser={currentUser}
            submitBtnText="Submit Round"
            showResetBtn={true}
            showBtnClass={true}
            resetBtnText="Clear"
            btnContainerClass="form-submit-buttons mb-4 pb-4"
            isStepForm={false}
            onFormReset={() => { }}
          />

        </div>

      </div>
    </>
  );
}

export default withRouter(NewInterviewRounds);
