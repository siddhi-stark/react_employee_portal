import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Card } from 'react-bootstrap';
import FormSections from './onboard.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function OnBoard(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [twEmployee,setTwEmployee] = useState([]);
  const [loader, setLoader] = useState(false);
  const [title,setTitle] = useState('');
  const applicantId = props.match.params.ID; //eslint-disable-line
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Employee' }];

 const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'dob') {
      const currentdate = new Date();
      const maxNewdate = new Date(currentdate.setYear(currentdate.getFullYear() - 18));
      sectionData.maxDate = maxNewdate;
    }
    return sectionData;
  });
  
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    setTitle('Add Employee');
  }, []);

  const submitForm = async (formValues) => {
    const managerList = [];
      formValues.managers && formValues.managers.map((mngr) => {
        managerList.push(mngr.value);
        return mngr;
      });
       const teamIdList = [];
    if (formValues.team_leads) {
      teamIdList.push(formValues.team_leads.value);
    }
    const postData = {
      date_joined: formValues.date_joined ? customFunctions.getDate(formValues.date_joined) : '',
      full_name: formValues.full_name,
      email: formValues.email,
      mobile: formValues.mobile,
      password: formValues.password,
      department: formValues.department ? Number(formValues.department.value) : '',
      designation: formValues.designation ? formValues.designation.value : '',
      dob: formValues.dob ? customFunctions.getDate(formValues.dob) : '',
      role: formValues.role ? formValues.role.value : '',
      emp_code: Number(formValues.emp_code),
      // tw_emp: formValues.tw_emp ? formValues.tw_emp.value : '',
      managers: managerList,
      team_leads: teamIdList,
      is_onboard: true,
      applicant_id: Number(applicantId)

    };

    const isFind = twEmployee.find(
      (item) => formValues.tw_emp && formValues.tw_emp.label && item.full_name === formValues.tw_emp.label
    );
    if (isFind) {
      postData.tw_emp = isFind.tw_id;
      // if (employeeId) postData.tw_emp = isFind.tw_id;
    }

      const { data, message } = await AuthApi.postDataToServer(Api.employeeUrl, postData);
       setLoader(true);
      if(data) {
        setLoader(false);
        swal({
        title: data.message[0],
        icon: 'success',
      })
        .then(okAction => {
          if (okAction) {
            props.history.push('/employees');
            customFunctions.setLocalStorage('isShowOnBoard','true');
          }
        });

        // swal(data.message[0],'','success');
      } else {
         setLoader(false);
          swal(message, '', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
            buttons: false,
            timer: 2000,
          }).then(() => {
            // updateDefaultValues({});
            swal.close();
          });
      }
  };

  const getData = async () => {
    const {data } = await AuthApi.getDataFromServer(`${Api.applicantsUrl}${applicantId}/`);
    if(!data) {
      // show error
      return;
    }
    let newDate = '';

      const ds = data.data.applied_for_id
        ? {
            label: data.data.applied_for_name,
            value: data.data.applied_for_id,
          }
        : '';
         if (!customFunctions.checkIfEmpty(data.data.joining_date)) {
          newDate = new Date(data.data.joining_date);
        }

    const obj = {
        ...data.data,
        full_name: data.data.name,
        date_joined: newDate,
        designation: ds
      };

    updateDefaultValues({ ...obj });
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);
      
  const getTwEmp = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.TwEmployeeUrl}?sort_by=full_name&sort_direction=ascending`);
    if(!data) {
      // show error
      return;
    }
    
   const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };
    });

    options.tw_emp = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
    await setTwEmployee(data.data);
  };

  useEffect(() => {
    getTwEmp();
  }, []);
      
  const getDesignation = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.designationUrl);
    if(!data) {
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

  useEffect(() => {
    getDesignation();
  }, []);
      
  const getRole = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.roleUrl);
    if(!data) {
      // show error
      return;
    }
    
   const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.role = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };

  useEffect(() => {
    getRole();
  }, []);
      
  const getManagers = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?role_id=${2}&is_dropdown=1`);
    if(!data) {
      // show error
      return;
    }
    
     const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };
    });

    options.managers = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };

  useEffect(() => {
    getManagers();
  }, []);
      
  const getTeamLeads = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?role_id=${3}&is_dropdown=1`);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };
    });

    options.team_leads = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };

  useEffect(() => {
    getTeamLeads();
  }, []);

  const getDepartment = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.InterviewRoundsUrl}?constant_type=department`);
    
    const dpOptions = await data && data.data.department.length > 0 && data.data.department.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.department = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };

  useEffect(() => {
    getDepartment();
  }, []);
 
	return (
		<>
    <Loader showLoader={loader} needFullPage={false} />
		 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Add Employee</h2>
        <Breadcrumb items={items} />
      </div>
		<div className="mt-5">
    <Card body>
      <StarkFormBuilder
        containerClass='mb-4 mt-4'
        formHeaderClass=''
        formSections={FormSections}
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
          props.history.push('/candidates');
        }}
      />
    </Card>
		</div>
    </>
		);
}

export default withRouter(OnBoard);