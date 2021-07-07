import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Button } from 'react-bootstrap';
import FormSections from './InterviewRounds.json';
import hrInterviewFormSections from './hrInterviewFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

function InterviewRounds() {
  const history = useHistory();

  // Variable declarations
  const [defaultAddMoreValues, updateDefaultAddMoreValues] = useState({}); // eslint-disable-line
  const [addMoreValuesOptions, updateAddMoreValuesOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState([]);
  const [toggle, setToggle] = useState(false);


  // Variable declarations HR 
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
    

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {  
    console.log('currentUser',currentUser);
    getUserRole();
    setToggle(false);
  }, []);

  useEffect(() => {
    updatedJsonSchema();
  }, [currentUser]);


  const updatedJsonSchema = async () => {
    updateJsonSchema([]);
    if (Number(currentUser) !== 4) {
      updateJsonSchema([...hrInterviewFormSections]);
      return; 
    }

    if (Number(currentUser) === 4) {
      const formSchema = [...hrInterviewFormSections];
        const updatedSchema = formSchema.map((section)=>{
          const s = {...section};
          s.fields = section.fields.filter((item) => {
            return !['interviewer','round'].includes(item.name);
          })
          return s;
        })
      updateJsonSchema([...updatedSchema]);        
    }
  };


  // Submit Form
  const submitAddMoreForm = async (formValues) => {
    console.log(formValues);
      const { data } = await AuthApi.postDataToServer(Api.getEmployeeUrl, formValues);
      if(!data) {
        // show error
      }
      // Perform success actions
  };
    
  const getInterviewer = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...addMoreValuesOptions,
      interviewer: dpOptions
    };
    updateAddMoreValuesOptions(allOptions);
  }

  useEffect(() => {
    getInterviewer();
  }, []);
      

  // Submit Form HR
  const submitForm = async (formValues) => {
    console.log(formValues);
    
      const { data } = await AuthApi.postDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
      }
      // Perform success actions
      
  };
    
  const getHrInterviewer = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getHrInterviewer();
  }, []);
      
  const getRound = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.undefined);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      round: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getRound();
  }, []);
      
console.log('jsonSchema',jsonSchema);
  return (
    <>
    {  jsonSchema && (jsonSchema.length > 0) && (
        <StarkFormBuilder
          containerClass='mt-4'
          formHeaderClass=''
          formSections={jsonSchema}
          formHeading="HR Interview Form"
          onFormSubmit={(formValues) => {submitForm(formValues);}}
          options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText={(Number(currentUser) === 4) ? 'Reschedule' :'Schedule Interview'}
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          
          onFormReset={() => {
            console.log('form reset callback')
          }}
        />
      )}
      
      { toggle && (
        <StarkFormBuilder
          containerClass=''
          formHeaderClass=''
          formSections={FormSections}
          formHeading=""
          onFormSubmit={(formValues) => {submitAddMoreForm(formValues);}}
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
            console.log('form reset callback')
          }}
        />
      )}
      <UserRestrictions permittedUsers={[4]} roleId={currentUser}>
        <div className="mt-3">
          <Button onClick={()=> history.push('/interviewer-round')}>Approval</Button>
        </div>
      </UserRestrictions >
    </>
  );
}
export default withRouter(InterviewRounds);
