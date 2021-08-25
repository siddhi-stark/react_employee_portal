import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Button } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './offerletter.json';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function GenerateOfferLetter() {
  const history = useHistory();
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [emailBody, setEmailBody] = useState('');
  const [document, setDocument] = useState('');

  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Offer Letter' }];

  useEffect(() => {
    const CandidateId = customFunctions.getLocalStorage('applicantId');
if (!CandidateId) {
history.goBack();
return;
};
    setTitle('Offer Letter');
    const formSchema = [...FormSections];
    const updatedSchema = formSchema.map((section) => {
      const s = { ...section };
      s.fields = section.fields.map((item) => {
        const itemData = item;
        if (item.name === 'name' || item.name === 'designation')
          itemData.disabled = true;
        if (item.name === 'joining_date') {
          const date = new Date();
          itemData.minDate = date;
        }

        return itemData;
      });
      return s; 
     });
    updateJsonSchema([...updatedSchema]);
    const Name = customFunctions.getLocalStorage('applicantName');
    const Designation = customFunctions.getLocalStorage('designation');
    const OfferCtc = customFunctions.getLocalStorage('offerctc');
    const joiningdate = customFunctions.getLocalStorage('joiningdate');
    const PfInclude = customFunctions.getLocalStorage('pfInclude');
    updateDefaultValues({
      name: Name,
      designation: Designation,
      joining_date: (joiningdate !== 'null') ? new Date(joiningdate) :'',
      offered_ctc: (OfferCtc !== 'null') ? Number(OfferCtc): '',
      pf_included: (PfInclude === 'true') ? 'true':'false'
    });
  }, []);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    getEmailTemplateData();
  }, []);

  const getEmailTemplateData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.emailTemplates}?name=Offer Letter`
    );
    if (data) {
      setEmailBody(data.data.body);
    } else {
      swal(message, '', 'error');
    }
  };

  const sendMail = async (body, doc) => {
    const id = customFunctions.getLocalStorage('applicantId');

    const postData = {
      name: 'Offer Letter',
      applicant_id: Number(id),
      email_type: 'offer_letter',
      subject: 'Offer Letter',
      attachment: doc,
      body,
      is_local:true
    };
    const { data, message } = await AuthApi.postDataToServer(
      Api.sendMailUrl,
      postData
    );

    if (data) {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        customFunctions.removeLocalStorage('applicantName');
        customFunctions.removeLocalStorage('designation');
        customFunctions.removeLocalStorage('offerctc');
        customFunctions.removeLocalStorage('joiningdate');
        customFunctions.removeLocalStorage('pfInclude');
        history.push('/recruitment');
        swal.close();
      });
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    const id = customFunctions.getLocalStorage('applicantId');
    // const Applicant = customFunctions.getLocalStorage('applicantName');
    const postData = {
      name: 'Offer Letter',
      subject: 'Offer Letter',
      applicant_id: Number(id),
      body: emailBody,
      generate_offer: Boolean(true),
      offered_ctc: Number(formValues.offered_ctc),
      pf_included: formValues.pf_included === 'true' ? true : false, // eslint-disable-line
      joining_date: formValues.joining_date
        ? customFunctions.getDate(formValues.joining_date)
        : '',
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.generateContentUrl,
      postData
    );
    if (data) {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        setDocument(data.data.attachement);
        setEmailBody(data.data.body);
        customFunctions.removeLocalStorage('applicantName');
        customFunctions.removeLocalStorage('designation');
        customFunctions.removeLocalStorage('offerctc');
        customFunctions.removeLocalStorage('joiningdate');
        customFunctions.removeLocalStorage('pfInclude');
        swal.close();
      });
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
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
          <h2 className="main-content-title tx-24 mg-b-5">Offer Letter</h2>
          <Breadcrumb items={items} />
        </div>
      </div>

      <div className="mt-5">
        <StarkFormBuilder
          containerClass=""
          formHeaderClass=""
          formSections={jsonSchema}
          onFormSubmit={(formValues) => {
            setDocument('');
            submitForm(formValues);
          }}
          options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Submit"
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons mb-4"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />
        {document && (

          <>
          <div className="container">
            <iframe
              src={`${document}`}
              title="Offer"
              style={{ height: '500px', width: '500px' }}
            />
            <br />
            <Button
              className="mt-3 mb-4"
              onClick={() => sendMail(emailBody, document)}
            >
              Send Mail
            </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default withRouter(GenerateOfferLetter);
