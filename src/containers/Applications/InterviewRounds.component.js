import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Button } from 'react-bootstrap';
import FormSections from './InterviewRounds.json';
import hrInterviewFormSections from './hrInterviewFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import customFunctions from '../../helper/customFunctions';

function InterviewRounds() {
  const history = useHistory();

  // Variable declarations
  const [defaultAddMoreValues, updateDefaultAddMoreValues] = useState({}); // eslint-disable-line
  const [addMoreValuesOptions, updateAddMoreValuesOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [flag, setFlag] = useState(false);

  // Variable declarations HR
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    setToggle(false);
  }, []);

  useEffect(() => {
    updatedJsonSchema();
  }, [currentUser]);
  console.log('flag', flag);

  const updatedJsonSchema = async () => {
    updateJsonSchema([]);
    if (Number(currentUser) !== 4 ) {
      const formSchema = [...hrInterviewFormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.filter((item) => {
          return !['feedback'].includes(item.name);
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
      return;
    }

    if (Number(currentUser) === 4 || !flag) {
      const formSchema = [...hrInterviewFormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.filter((item) => {
          const itemData = item;
          if(item.name === 'date') itemData.disabled = true;
          if(item.name === 'time') itemData.disabled = true;

          return !['interviewer', 'round', 'feedback'].includes(item.name);
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    }
  };

  const getData = async () => {
    // console.log(designation);
    // const ApplicantId = props.match.params.ID;

    const section = hrInterviewFormSections[0].fields[3].options;
    console.log('sections',section);
    const {data } = await AuthApi.getDataFromServer(`${Api.roundsUrl}${1}/`);
      console.log('data',data);
    const intDate = data.data.int_date ? customFunctions.getDate(data.data.int_date) : '';
    data.data.int_date = intDate ? new Date(intDate) : '';
    data.data.int_time = data.data.int_time ? new Date(intDate + ' ' + data.data.int_time) : ''; //eslint-disable-line
  
     const ds = data.data.interviewer_id ? {
        label: data.data.interviewer_name,
        value: data.data.interviewer_id
      } : ''   

       const interw = data.data.round_type ? {
        label: data.data.round_type_name,
        value: data.data.round_type
      } : ''  

     const obj = {
       ...data.data,
       interviewer: ds,
       round_status: interw
     };

     updateDefaultValues({...obj})    // updateDefaultValues(data);

  };

  useEffect(() => {

    getData();
  },[])


  // Submit Form
  const submitAddMoreForm = async (formValues) => {
    console.log('formValues',formValues);
    const postData = {
      int_date: formValues.int_date ? customFunctions.getFormattedDate(formValues.int_date) : '',
      int_time: formValues.int_time ? customFunctions.getTime(formValues.int_time) : '',
      round_status: formValues.round_status ? formValues.round_status.value : '',
      interviewer: formValues.interviewer ? formValues.interviewer.value : '',
    }
    console.log('postData',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      postData
    );
    if (data) {
      console.log('data',data);
    }
    // Perform success actions
  };

  const getInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...addMoreValuesOptions,
      interviewer: dpOptions,
    };
    updateAddMoreValuesOptions(allOptions);
  };

  useEffect(() => {
    getInterviewer();
  }, []);

  // Submit Form HR
  const submitForm = async (formValues) => {
    const id = customFunctions.getLocalStorage('applicantId');
    console.log('formValues',formValues);
    const postData = {
      int_date: formValues.int_date ? customFunctions.getDate(formValues.int_date) : '',
      int_time: formValues.int_time ? customFunctions.getTime(formValues.int_time) : '',
      round_status: formValues.round_status ? formValues.round_status.value : '',
      interviewer: formValues.interviewer ? formValues.interviewer.value : '',
      applicant: id
    }
    console.log('postData',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      postData
    );
    if (data) {
      console.log('data',data);
    }
  };

  const getHrInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getHrInterviewer();
  }, []);

  const getRound = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.undefined);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      round: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getRound();
  }, []);

  return (
    <>
      {jsonSchema && jsonSchema.length > 0 && (
        <StarkFormBuilder
          containerClass="mt-4"
          formHeaderClass=""
          formSections={jsonSchema}
          formHeading="HR Interview Form"
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText={
            Number(currentUser) === 4 ? 'Reschedule' : 'Schedule Interview'
          }
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />
      )}

      {toggle && (
        <StarkFormBuilder
          containerClass=""
          formHeaderClass=""
          formSections={FormSections}
          formHeading=""
          onFormSubmit={(formValues) => {
            submitAddMoreForm(formValues);
          }}
          options={addMoreValuesOptions}
          callbacks={{}}
          defaultFormValues={defaultAddMoreValues}
          currentUser={currentUser}
          submitBtnText="Schedule Interview"
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />
      )}
      <UserRestrictions permittedUsers={[4]} roleId={currentUser}>
        <div className="mt-3">
          <Button onClick={() =>{setFlag(true); history.push('/interviewer-round');}}>
            Approval
          </Button>
        </div>
      </UserRestrictions>
    </>
  );
}
export default withRouter(InterviewRounds);
