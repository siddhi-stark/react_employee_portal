import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
  import StarkFormBuilder from 'stark-form-builder';
  import FormSections from './offerletter.json';
  import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
  
import AuthApi from '../../helper/authApi'; 
import customFunctions from '../../helper/customFunctions';


function GenerateOfferLetter() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

 const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Offer Letter' }];

    
     useEffect(() => {
    setTitle('Offer Letter');
       const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section)=>{

      const s = {...section};
      s.fields = section.fields.map((item) => {
        const itemData = item;
         if(item.name === 'name' || item.name === 'designation') itemData.disabled = true;
         return itemData;
      })
      return s;
    })
  updateJsonSchema([...updatedSchema]);
       const Name = customFunctions.getLocalStorage('applicantName');
       const Designation = customFunctions.getLocalStorage('designation');
    updateDefaultValues({
      name: Name,
      designation: Designation
    })        
   
  }, []);


  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const sendMail = async (body,doc) => {
    const id = customFunctions.getLocalStorage('applicantId');

  	const postData = {
	name: 'Offer Letter',
	applicant_id: Number(id),
	email_type: 'offer_letter',
	subject: 'Offer Letter',
	attachment: doc,
	body
}
    const { data, message } = await AuthApi.postDataToServer(
      Api.sendMailUrl,
      postData
    );

    if(data) {
    	console.log(message);
    	swal(data.message[0],'','success');
    	customFunctions.removeLocalStorage('applicantName');
    	customFunctions.removeLocalStorage('designation');
    }

  }

  // Submit Form
  const submitForm = async (formValues) => {
    const id = customFunctions.getLocalStorage('applicantId');
    // console.log('formValues',formValues);
    const Applicant = customFunctions.getLocalStorage('applicantName');
    const postData = {

      name: 'Offer Letter',
      subject: 'Offer Letter',
      applicant_id: Number(id),
      body: `Hello ${Applicant}, <br/>Congratulations, I am happy to share your employement offer with you. <br />This offer is valid for 3 Days.`,
      generate_offer: Boolean(true),
      offered_ctc: Number(formValues.offered_ctc),
      pf_included: Boolean(formValues.pf_included),
      joining_date: formValues.joining_date ? customFunctions.getDate(formValues.joining_date) : ''

    };

    console.log('data',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.generateContentUrl,
      postData
    );

    if(data) {
    	 sendMail(data.data.body,data.data.attachement);
    }



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
      
  };
    


	return (
    <>
     <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Employees</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
		
  <div className="mt-5">

  <StarkFormBuilder
    containerClass=''
    formHeaderClass=''
    formSections={jsonSchema}
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
  </div>
  </>
    

		)
}


export default withRouter(GenerateOfferLetter);