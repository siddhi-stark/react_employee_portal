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
  let defaultFilterOptions = {};
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [applicantName, setApplicantName] = useState('');
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
          // if (it.name === 'status_name') itemData.disabled = true;
          // if (it.name === 'comments') itemData.disabled = true;
          const date = new Date();
          if (it.name === 'int_date') itemData.minDate = date;
          // if (it.name === 'int_time') itemData.minTime = setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours());
          // if (it.name === 'int_time') itemData.minDate = new Date();
          // console.log('setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours())', setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours()));

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
    // console.log('formValues',formValues.addmore[position].interviewerRounds);
    const id = customFunctions.getLocalStorage('applicantId');
    const postData =[];
    for(const more of  formValues.addmore) {  // eslint-disable-line

    const round = {
      int_date: more.int_date
        ? customFunctions.getDate(more.int_date)
        : '',
      int_time: more.int_time
        ? customFunctions.getTime(more.int_time)
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
      applicant: id || '',
      id: more.id || '',
    };
    postData.push(round);

    }

    const position = formValues.addmore && formValues.addmore.length - 1;

 if(Number(formValues.addmore[position].interview_type.value) === 1) {
      const payload = {
        name: 'Interview Round',
        subject: 'Interview Round',
        applicant_id: id,
        body: `Hello ${applicantName}, you are telephonic round will be at ${customFunctions.getTime(formValues.addmore[position].int_time)}.`,
        email_type: 'interview_round',
      };
      // await AuthApi.postDataToServer(
      //   Api.generateContentUrl,
      //   payload
      // );
      await AuthApi.postDataToServer(Api.sendMailUrl,payload); // eslint-disable-line
    }
    
   

    const { data, message } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      { 'data':postData}
    );

   

    if (data) {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        // setFormData(formValues);
        // setUpdatedData(data);
        swal.close();
      });
    } else {
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

  // const getInterviewRoundsStatus = async (data,formValues) => {
  //   const position = formValues.addmore && formValues.addmore.length - 1;
  //   console.log('data',data);
  //   const payload = {
  //     status: formValues.addmore && formValues.addmore[position].status_name
  //       ? Number(formValues.addmore[position].status_name.value) : '',
  //     comments: formValues.addmore && formValues.addmore[position]
  //       ? formValues.addmore[position].comments : ''
  //   }
  //   if(data){

  //  const { message } = await AuthApi.putDataToServer(
  //        `${Api.interviewUrl}${data && data.data && data.data.id}/`,
  //        payload
  //     );

  //     swal(message, '', 'success', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //       buttons: false,
  //       timer: 2000,
  //     }).then(() => {
  //       swal.close();
  //     });
  // }
  //   }
  
  // const getOfferSend = async ()=> {
  //   const id = customFunctions.getLocalStorage('applicantId');

  //   const postData = {
  //     name: 'Offer Letter',
  //     subject: 'Offer Letter',
  //     applicant_id: id,
  //     body: `Hello ${applicantName},<br/> Congratulations, I am happy to share your employement offer with you. <br/> This offer is valid for 3 Days.`,
  //     generate_offer: true,
  //     offered_ctc: '',
  //     pf_included: true,
  //   };

  //   const { data, message } = await AuthApi.postDataToServer(
  //     Api.generateContentUrl,
  //     postData
  //   );

  //    const { data, message } = await AuthApi.postDataToServer(
  //     Api.sendMailUrl,
  //     postData
  //   );


  //   if (data) {
  //     swal(data && data.message[0], '', 'success', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //       buttons: false,
  //       timer: 2000,
  //     }).then(() => {
  //       swal.close();
  //       history.push('/recruitment');
  //     });
  //   } else {
  //     swal(message, '', 'error', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //       buttons: false,
  //       timer: 2000,
  //     }).then(() => {
  //       swal.close();
  //     });
  //   }
  // }

  const getData = async (interviewerId) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.roundsUrl}?applicant_id=${interviewerId}`
    );
    console.log('data',data);
    if (data) {
      let newTime = '';
      let newDate = '';
      const interviewData = [];
      data.data.map((dt) => {
        setApplicantName(dt.applicant_name);
        if (!customFunctions.checkIfEmpty(dt.int_date)) {
          newDate = new Date(dt.int_date);
        }
        if (!customFunctions.checkIfEmpty(dt.int_time)) {
          newTime = new Date(
            `${customFunctions.getDate(dt.int_date)}T${dt.int_time}Z`
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
      console.log('interviewData',interviewData);
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
      `${Api.employeeUrl}?type=all`
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
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
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
    </>
  );
}

export default withRouter(NewInterviewRounds);
