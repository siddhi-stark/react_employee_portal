import React, {useState,useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './birthday.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';


function AddBirthday() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Birthday' }]; 
    

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  // useEffect( async () => {
  //   const roleId = await localStorage.getItem('group');
  //   if (Number(roleId) !== 1) {
  //     history.push('/');
  //   }
  // }, []);
  
  useEffect(() => {
    getUserRole();
    setTitle('Add Birthday');
  }, []);

   const handleImageFileUpload = (e) => {
    if (!e) return;
    setImageUrl(e[0]);
  };

  const uploadFile = async () => {
    let imgId = '';

    const formData = new FormData();
    formData.append('file_name', imageUrl);

    const { data } = await AuthApi.postDataToServer(
      `${Api.fileUploadUrl}`,
      formData
    );
    if (data) {
      imgId = data.data.id;
    }
    return imgId;
  };


  // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);
    
    const postData = {
      message: formValues.message,
      greet_type: formValues.greet_type ? formValues.greet_type.value : '',
      employee: formValues.employee ? [formValues.employee.value] : '',
      comment_allow: formValues.comment_allow ? Boolean(formValues.comment_allow) : ''
    }

     if (imageUrl) {
      postData.file = await uploadFile();
    }

    console.log('postData',postData);

     const callback = AuthApi.postDataToServer;

    const endPoint = Api.greetingsUrl;
    const { data } = await callback(endPoint, postData);

    if(data) {
      console.log('data',data);
      swal(data.message[0],'','success');
    }
      
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
      
  const getType = async () => {
    const {data} = await AuthApi.getDataFromServer(`${Api.InterviewRoundsUrl}?constant_type=greet_type`);
    if(!data) {
      // show error
      return;
    }
    console.log('data',data.data.greet_type);
    const dpOptions = await data && data.data.greet_type.length > 0 && data.data.greet_type.map((op) => {
      return { label: op.name, value: op.id };

    });
    options.greet_type = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  }

  useEffect(() => {
    getType();
  }, []);
      
  const getEmployee = async () => {
    // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all&is_dropdown=1`);
    
    
     const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };

    });
    options.employee = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  }

  useEffect(() => {
    getEmployee();
  }, []);
      

	return (
		<>
		 <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div> 
		<div className="mt-5">
		<Card>

  <StarkFormBuilder
    containerClass='mt-4 mb-4'
    formHeaderClass=''
    formSections={FormSections}
    formHeading="tbirthday"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
     callbacks={{
            handleimage: (value) => {
              handleImageFileUpload(value);
            },
          }}
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
		</Card>
		</div>
    
		</>

		)
}

export default withRouter(AddBirthday);
