import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Card, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import FormSections from './EditProject.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function EditProject(props) {
  const idProps = props;
  const projectId = idProps.match.params.projectId;
  const viewOptions = idProps.location.state ? idProps.location.state.isView : '';
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [title, setTitle] = useState('');

  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: viewOptions ? 'View Project':'Edit Project' }];
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

   useEffect(() => {
    const formViewSchema = [...FormSections];
     let updatedSchema = [];
     if(viewOptions) {
       updatedSchema = formViewSchema.map((section) => {
          const s = { ...section };
          s.fields = section.fields.map((item) => {
            const itemData = item;
            if (
              item.name === 'name' ||
              item.name === 'completion' ||
              item.name === 'start_date' ||
              item.name === 'end_date' ||
              item.name === 'allocated' ||
              item.name === 'hourly_rate' ||
              item.name === 'estimate_hrs' ||
              item.name === 'project_cost' ||
              item.name === 'coordinator' ||
              item.name === 'status'
            )
              itemData.disabled = true;
            return itemData;
          });
          return s;
        });
        updateJsonSchema([...updatedSchema]);
     } else {
       updatedSchema = formViewSchema.map((section) => {
          const s = { ...section };
          s.fields = section.fields.map((item) => {
            const itemData = item;
            if (
              item.name === 'allocated' ||
              item.name === 'hourly_rate' ||
              item.name === 'project_cost' ||
              item.name === 'coordinator'
            )
              itemData.disabled = false;
            return itemData;
          });
          return s;
        });
        updateJsonSchema([...updatedSchema]);
     }
 }, []);

  // Submit Form
  const submitForm = async (formValues) => {
      const { data, message } = await AuthApi.putDataToServer(Api.getProjects, formValues);
      if(!data) {
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
      // Perform success actions
  };
    
  // Get data for form
  const getData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(`${Api.getProjects}${projectId}/`);
    if(!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    if (data) {
      const start = data && data.data && data.data.start_date;
      const end = data && data.data && data.data.end_date;
      const coordinatorValue = data.data.applied_for_id
        ? {
            label: data.data.applied_for_name,
            value: data.data.applied_for_id,
          }
        : '';

      const obj = {
        ...data.data,
        start_date:start,
        end_date:end,
        coordinator: coordinatorValue,
      };

      updateDefaultValues({ ...obj }); // updateDefaultValues(data);
    };
  };

  // Call get data method on load
  useEffect(() => {
    setTitle(viewOptions ? 'View Project':'Edit Project');
    getData();
  }, []);
      
  const getCoordinator = async () => {
    const { data, message } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
       swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      coordinator: dpOptions
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getCoordinator();
  }, []);

	return (
		<>
		 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
        <Breadcrumb items={items} />
      </div>
		<div className='mt-5'>
    <Card body>
     {viewOptions && (
        <Button className="float-end" onClick= {() => history.push('/project')} >Back</Button>
      )}
      <StarkFormBuilder
        containerClass='mt-4'
        formHeaderClass=''
        formSections={jsonSchema}
        onFormSubmit={(formValues) => {submitForm(formValues);}}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={true}
        resetBtnText="Cancel"
        btnContainerClass={viewOptions ? 'd-none':'form-submit-buttons mb-3'}
        isStepForm={false}
        onFormReset={() => {
          history.push('/project');
        }}
      />
    </Card>
		</div>
		</>

		);
}

export default withRouter(EditProject);