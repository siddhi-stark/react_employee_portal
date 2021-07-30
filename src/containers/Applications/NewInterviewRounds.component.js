import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
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
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [count, forceUpdate] = useState(0);
  const { isProfessionalInfoId } = props;

  const history = useHistory();

  useEffect(() => {
    
      const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section)=>{
      const s = {...section};
      s.fields = section.fields.map((item) => {
        console.log('itemmmm',item.fields[4].name);
        item.fields.map((it) => {
        const itemData = it;
        console.log('itemData',it);
          if(it.name === 'status_name') itemData.disabled = true;
          if(it.name === 'comments') itemData.disabled = true;
          const date = new Date();
          if(it.name === 'int_date') itemData.minDate = date;

          
         return it;
        })
         return item;

      })
      return s;
    })
    console.log('updatedSchema',updatedSchema);
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
    const position = formValues.addmore.length-1;
    console.log('position',formValues.addmore[position].interviewerRounds);
    const postData = {
      int_date: formValues.addmore[position]
        ? customFunctions.getDate(formValues.addmore[position].int_date)
        : '',
      int_time: formValues.addmore[position]
        ? customFunctions.getTime(formValues.addmore[position].int_time)
        : '',
      round_type: formValues.addmore[position].interviewerRounds
        ? formValues.addmore[position].interviewerRounds.value
        : '',
      interviewer: formValues.addmore[position].interviewer
        ? formValues.addmore[position].interviewer.value
        : '',
      applicant: id,
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.roundsUrl,
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
        history.push('/recruitment');
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

  const getData = async (interviewerId) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.roundsUrl}?applicant_id=${interviewerId}`
    );
    if (data) {
      let newTime = '';
      let newDate = '';
      const interviewData = [];
      data.data.map((dt) => {
        console.log('dtttt',dt.status_name);
        if(!customFunctions.checkIfEmpty(dt.int_date)){
          newDate = new Date(dt.int_date);
        }
        if(!customFunctions.checkIfEmpty(dt.int_time)){
          newTime = new Date(`${customFunctions.getDate(dt.int_date)}T${dt.int_time}Z`);
        }

        return interviewData.push({
          interviewer: { label: dt.interviewer_name, value: dt.interviewer_id },
          interviewerRounds: {
            label: dt.round_type_name,
            value: String(dt.round_type),
          },
          int_date: newDate,
          int_time: newTime,
          status_name: dt.status_name,
          comments: dt.comments
          });
      });
        console.log('interviewData',interviewData);

      if(interviewData) {
        updateDefaultValues({ addmore: [...interviewData] });
     }
      forceUpdate(count + 1);
    }
  };

  // Call get data method on load
  useEffect(() => {
    if(isProfessionalInfoId){
      getData(isProfessionalInfoId);
    }
  }, [isProfessionalInfoId]);

  const getInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
  await  data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions,
    };
    console.log('data',data.data);
    updateOptions(allOptions);
  };


    const getInterviewRounds = async () => {
      // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(`${Api.InterviewRoundsUrl}?constant_type=round_type`);
    if(!data) {
      // show error
      return;
    }
    
 const dpOptions = await data && data.data && data.data.round_type.length > 0 && data.data.round_type.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.interviewerRounds = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
   // console.log('name',data.data);

  }  

  useEffect(() => {
    getInterviewer();
    getInterviewRounds();
  }, []);

  return (
    <>
    <div> 

    <div className='float-left'>Round - Selected</div>
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={jsonSchema}
        formHeading="form"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        refreshCounter={count}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons"
        isStepForm={false}
        onFormReset={() => {
          console.log('form reset callback');
        }}
      />
    </div>
    </>
  );
}

export default withRouter(NewInterviewRounds);