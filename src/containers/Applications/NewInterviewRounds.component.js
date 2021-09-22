import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
// import { Button } from 'react-bootstrap';
// import { setHours, setMinutes } from 'date-fns';
import FormSections from './NewInterviewRounds.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';
// const addMoreData = {
//   addmore: [
//     {
//       int_date: new Date,
//       int_time: new Date,
//       interviewer: { label: 'Prashant Mane', value: 2 },
//       round_status: { label: 'hr screening', value: '1' },
//     },
//   ],
// };

function NewInterviewRounds(props) {
  const notes = customFunctions.getLocalStorage('notes');
  let defaultFilterOptions = {};
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [isShowLoader,setShowLoader] = useState(false);
  // const [formData, setFormData] = useState({});
  // const [updatedData, setUpdatedData] = useState({});
  const [count, forceUpdate] = useState(0);
  const { isProfessionalInfoId } = props;

  // const history = useHistory();

  useEffect(() => {
    const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section) => {
      const s = { ...section };
      s.fields = section.fields.map((item) => {
        item.fields.map((it) => {
          const itemData = it;
          const date = new Date();
          if (it.name === 'int_date') itemData.minDate = date;
          if(it.name === 'id') itemData.disabled = true;

          return it;
        });
        return item;
      });
      return s;
    });
    updateJsonSchema([...updatedSchema]);
  }, []);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('applicantId');
    const postData =[];
    for(const more of  formValues.addmore) {  // eslint-disable-line

    const round = {
      int_date: more.int_date
        ? customFunctions.getDate(more.int_date)
        : '',
      int_time: more.int_time
        ? `${customFunctions.getTime(more.int_time)}`
        : '',
      round_type: more.interviewerRounds
        ? more.interviewerRounds.value
        : '',
      interviewer: more.interviewer
        ? more.interviewer.value
        : '',
      interview_type: more.interview_type
        ? Number(more.interview_type.value)
        : '',
      description: more.description
        ? more.description
        : '',
        comments: more.comments ? more.comments : '',
        status: more.status_name ? more.status_name.value : '',
      applicant: id || '',
      id: more.id || '',
    };
    postData.push(round);

    }

    const { data, message } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      { 'data':postData}
    );

    if (data) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        // setFormData(formValues);
        // setUpdatedData(data);
        swal.close();
         getData(isProfessionalInfoId);
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  const getData = async (interviewerId) => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.roundsUrl}?applicant_id=${interviewerId}`
    );
    if (data) {
      setShowLoader(false);
      let newTime = '';
      let newDate = '';
      const interviewData = [];

      data.data.map((dt) => {

        if (!customFunctions.checkIfEmpty(dt.int_date)) {
          newDate = new Date(dt.int_date);
        }
        if (!customFunctions.checkIfEmpty(dt.int_date) && !customFunctions.checkIfEmpty(dt.int_time)) {
          newTime = new Date(
            `${customFunctions.getDate(dt.int_date)} ${customFunctions.convertTime12to24(dt.int_time)}`
          );
        }

        return interviewData.push({
          interviewer: { label: dt.interviewer_name, value: dt.interviewer_id },
          interviewerRounds: {
            label: dt.round_type_name,
            value: String(dt.round_type),
          },
          int_date: newDate,
          int_time: newTime,
          status_name: {label:dt.status_name, value:dt.status},
          comments: dt.comments,
          interview_type:  { label: dt.interview_type_name, value: dt.interview_type_id },
          description: dt.description,
          id: dt.id
        });
      });
      if (interviewData) {
        updateDefaultValues({ addmore: [...interviewData] });
      }
      forceUpdate(count + 1);
    }
  };

  // Call get data method on load
  useEffect(() => {
    if (isProfessionalInfoId) {
      getData(isProfessionalInfoId);
    }
  }, [isProfessionalInfoId]);

  const getInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&show_self=1`
    );
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    await data.data.map((op) => {
      // Change appropriate keys
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
      // show error
      return;
    }

    const dpOptions = [];
    await data.data && data.data.applicant_round_status.map((op) => {
      // Change appropriate keys
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
      // show error
      return;
    }

    const dpOptions = [];
    (await data.data) &&
      data.data.round_type.map((op) => {
        // Change appropriate keys
        dpOptions.push({ label: op.name, value: op.id });
        return op;
      });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      interviewerRounds: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  // const getInterviewValue = async (value)=> {
  // }
  useEffect(() => {
    getInterviewer();
    getRoundsStatus();
    getInterviewRounds();
  }, []);

  return (
    <>
    <Loader showLoader={isShowLoader} needFullPage={false} />
    <div className="mt-3">
    {notes === 'null' ? (
      ''
      ) : 
    <p><strong>Notes: </strong>{notes}</p>
  }
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
          // callbacks={{
          //   getinterviewvalue: (value) => { getInterviewValue(value); },
          // }}
          defaultFormValues={defaultValues}
          refreshCounter={count}
          currentUser={currentUser}
          submitBtnText="Submit Round"
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons mb-4 pb-4"
          isStepForm={false}
          onFormReset={() => {}}
        />
         {/* <Button
                     size="sm"
                     className="mt-2 ml-5"
                     onClick={() =>{
                       history.push('/generate-offerletter');
                     }}
                   >
                     Offer Send
                   </Button>
                   <Button
                     size="sm"
                     className="mt-2"
                     onClick={() =>{
                       getInterviewRoundsStatus(updatedData,formData);
                     }}
                   >
                     Submit Feedback
                   </Button> */}
      </div>
    </div>
    </>
  );
}

export default withRouter(NewInterviewRounds);
