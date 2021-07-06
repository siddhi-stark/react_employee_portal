import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Button } from 'react-bootstrap';
import FormSections from './InterviewRounds.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

function InterviewRounds() {
  const history = useHistory();

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState([]);
  // const [toggle, setToggle] = useState(false);

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {  
    console.log('currentUser',currentUser);
    getUserRole();
  }, []);

  useEffect(() => {
    updatedJsonSchema();
  }, [currentUser]);

  const updatedJsonSchema = async () => {
    updateJsonSchema([]);
    if (Number(currentUser) !== 4) {
      updateJsonSchema([...FormSections]);
      return; 
    }

    if (Number(currentUser) === 4) {
      const formSchema = [...FormSections];
      const updatedSchema = await formSchema.map((section) => {
        
        console.log('section',section);
        const allitem =  section.fields.map((item) => {
        console.log('item',item);
          // if(item.type=='addmore') item.type=''; // eslint-disable-line

          item.fields =  item.fields.filter((itm)=>{ // eslint-disable-line
            console.log('itm',itm);
            return !['interviewer','round','status','feedback'].includes(itm.name);
          });
          console.log('s.fields--',item.fields);
          return item;
        });
        section.fields = allitem; // eslint-disable-line
        return section;
      });
      console.log('updatedSchema',updatedSchema);
      updateJsonSchema([...updatedSchema]);
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
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
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getInterviewer();
  }, []);
      
console.log('jsonSchema',jsonSchema);
  return (
    <>
    {  jsonSchema && (jsonSchema.length > 0) && (
        <StarkFormBuilder
          containerClass=''
          formHeaderClass=''
          formSections={jsonSchema}
          formHeading=""
          onFormSubmit={(formValues) => {submitForm(formValues);}}
          options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Submit"
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
