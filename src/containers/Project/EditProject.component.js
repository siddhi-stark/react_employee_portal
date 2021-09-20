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
import customFunctions from '../../helper/customFunctions';

function EditProject(props) {
  const idProps = props;
  const projectId = idProps.match.params.projectId;
  const viewOptions = idProps.location.state ? idProps.location.state.isView : '';
  const userGroup = customFunctions.getLocalStorage('group');
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  // const [hoursAllocated,setHoursAllocated] = useState(''); 
  // const [hourlyRate,setHourlyRate] = useState(''); 
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
  }, [projectId]);

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
              item.name === 'status' ||
              item.name === 'hours_allocated' ||
              item.name === 'hourly_cost' ||
              item.name === 'cost_allocated'
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
              item.name === 'estimate_hrs' ||
              item.name === 'hourly_rate' ||
              item.name === 'project_cost' ||
              item.name === 'coordinator' ||
              item.name === 'comments' ||
              item.name === 'hours_allocated' ||
              item.name === 'hourly_cost' ||
              item.name === 'cost_allocated'
            )
              itemData.disabled = false;
            return itemData;
          });
          return s;
        });
        updateJsonSchema([...updatedSchema]);
     }
 }, []);

   useEffect(() => {
     if(Number(userGroup) === 2) {
      const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section)=>{
      const s = {...section};
      s.fields = section.fields.filter((item) => {
        return !['hourly_rate','project_cost','coordinator'].includes(item.name);
      });
      return s;
    });
  updateJsonSchema([...updatedSchema]);
     }
   },[projectId]);

  // Submit Form
  const submitForm = async (formValues) => {

    const postData = {
      hours_allocated: Number(formValues.hours_allocated),
      hourly_cost: Number(formValues.hourly_cost),
      cost_allocated: Number(formValues.cost_allocated),
      coordinator: formValues.coordinator ? Number(formValues.coordinator.value) : '',
      comments: formValues.comments
    };
      const { data } = await AuthApi.putDataToServer(`${Api.getProjects}${projectId}/`, postData);
      if(data) {
        swal(data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
      history.push('/project');
  };
    
  // Get data for form
  const getData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(`${Api.projectDetails}${projectId}/`);
    // console.log('data',data);

    if(!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    if (data) {
      const start = data && data.data && new Date(data.data.start_date);
      const end = data && data.data && new Date(data.data.end_date);
      const coordinatorValue = data && data.data && data.data.coordinator_name
        ? {
            label: data.data.coordinator_name,
            value: data.data.coordinator_id,
          }
        : '';

        const complt = data && data.data && data.data.completion + '%'; // eslint-disable-line

      const obj = {
        ...data.data,
        start_date:start,
        end_date:end,
        coordinator: coordinatorValue,
        completion:complt
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
    const { data, message } = await AuthApi.getDataFromServer(`${Api.employeeUrl}?department_id=9`);
    if(!data) {
       swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
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

  // const onHoursAllocated = (value) => {
  //   setHoursAllocated(value);
  //   calculateProjectCost();
  // };

  // const onHourlyRate = (value) => {
  //   setHourlyRate(value);
  //   calculateProjectCost();
  // };

  // const calculateProjectCost = () => {
  //   let cost = '';
  //   if(hoursAllocated && hourlyRate) {
  //     cost = hoursAllocated * hourlyRate;
  //   };
  //   console.log('cost',cost);
  // };

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
        callbacks={{
          // onHoursChange: (value) => { onHoursAllocated(value); },
          // onHourRate: (value) => {onHourlyRate(value);}
        }}
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