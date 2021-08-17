import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './onboard.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function OnBoard() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const title = 'Add Candidate';  

  const items = [{ to: '/', label: 'Home' }, { label: 'Candidate' }];

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    
      const { data } = await AuthApi.putDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
        return; //eslint-disable-line
      }
      // Perform success actions
      
  };
    

  // Get data for form
  const getData = async () => {
    const {data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);
      
  const getTwEmp = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.TwEmployeeUrl);
    if(!data) {
      // show error
      return;
    }
    
   const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.tw_emp = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  }
      
  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!data) {
      // show error
      return;
    }

        
 const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.designation = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };
      
  const getRole = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.roleUrl}`);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.name, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      role_name: dpOptions
    };
    updateOptions(allOptions);
  }
      
  const getManagers = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?role_id=${2}&is_dropdown=1`);
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
      managers: dpOptions
    };
    updateOptions(allOptions);
  }
      
  const getTeamLead = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?role_id=${3}&is_dropdown=1`);
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
      team_leads: dpOptions
    };
    updateOptions(allOptions);
  }

      
  const getDepartment = async () => {
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
      department: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getDepartment();
    getTeamLead();
    getManagers();
    getRole();
    getDesignation();
    getTwEmp();

  }, []);
      

	return (
		<>
		 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Recruitment</h2>
        <Breadcrumb items={items} />
      </div>
		<div className="mt-5">

  <StarkFormBuilder
    containerClass='mb-5'
    formHeaderClass=''
    formSections={FormSections}
    formHeading="OnBoard"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText="Submit"
    showResetBtn={true}
    resetBtnText="Cancel"
    btnContainerClass="form-submit-buttons"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
		</div>
    

		</>
		)
}

export default withRouter(OnBoard);