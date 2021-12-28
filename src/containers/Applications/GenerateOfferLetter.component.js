import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Button, Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './offerletter.json';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function GenerateOfferLetter() {
  const history = useHistory();
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [emailBody, setEmailBody] = useState('');
  const [document, setDocument] = useState('');
  const [checked, setChecked] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Offer Letter' }];

  useEffect(() => {
    const CandidateId = customFunctions.getLocalStorage('applicantId');
    if (!CandidateId) {
      history.goBack();
      return;
    }
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
    const misInclude = customFunctions.getLocalStorage('misInclude');
    updateDefaultValues({
      name: Name,
      designation: Designation,
      joining_date: joiningdate !== 'null' ? new Date(joiningdate) : '',
      offered_ctc: OfferCtc !== 'null' ? Number(OfferCtc) : '',
      pf_included: PfInclude === 'true' ? 'true' : 'false',
      miscellaneous_included: misInclude === 'true' ? 'true' : 'false',
    });
  }, []);

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
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('applicantId');
    let EmailBody = '';
    const reasonLabel = checked ? 'with' : 'without';
    if (!checked) {
      const postData = {
        name: 'Offer Letter',
        subject: 'Offer Letter',
        applicant_id: Number(id),
        body: emailBody,
      };

      const { data, message } = await AuthApi.postDataToServer(
        Api.generateContentUrl,
        postData
      );
      if (!customFunctions.checkIfEmpty(data, 'O') && data.data) {
        EmailBody = data.data.body;
      } else {
        setShowLoader(false);
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
    }
    setShowLoader(false);
    swal({
      title: 'Are you sure?',
      text: `Do you want to send mail ${reasonLabel} annexture ?`,
      icon: 'warning',
      dangerMode: true,
      buttons: true,
      closeOnClickOutside: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result) {
        const postData = {
          name: 'Offer Letter',
          applicant_id: Number(id),
          email_type: 'offer_letter',
          subject: 'Offer Letter',
          attachment: checked ? doc : '',
          body,
        };
        if (EmailBody) postData.body = EmailBody;
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
            customFunctions.removeLocalStorage('misInclude');
            history.push('/recruitment');
            swal.close();
          });
        } else {
          swal(message, '', 'error', {
            closeOnClickOutside: false,
            allowOutsideClick: false,
          });
        }
      }
    });
  };

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('applicantId');

    const postData = {
      name: 'Offer Letter',
      subject: 'Offer Letter',
      applicant_id: Number(id),
      body: emailBody,
      generate_offer: Boolean(true),
      offered_ctc: Number(formValues.offered_ctc),
      pf_included: formValues.pf_included === 'true' ? true : false, // eslint-disable-line
      miscellaneous_included: formValues.miscellaneous_included === 'true' ? true : false, // eslint-disable-line
      joining_date: formValues.joining_date
        ? customFunctions.getDate(formValues.joining_date)
        : '',
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.generateContentUrl,
      postData
    );
    if (data) {
      setShowLoader(false);
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
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
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
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <div className="mt-5">
        <Card body>
          <StarkFormBuilder
            containerClass="mt-4"
            formHeaderClass=""
            formSections={jsonSchema}
            onFormSubmit={(formValues) => {
              setDocument('');
              submitForm(formValues);
            }}
            callbacks={{}}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Preview"
            showResetBtn={false}
            showBtnClass={true}
            resetBtnText="Cancel"
            btnContainerClass={checked ? 'form-submit-buttons mb-4' : 'd-none'}
            isStepForm={false}
            onFormReset={() => {
              history.push('/recruitment');
            }}
          />
          <input
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
            name="checked"
            type="checkbox"
            id="checked"
            className="form-submit-buttons ms-4"
            value={checked}
          />
          <span className="ms-2">Do you want to send Annexure ?</span>
          <div className="container">
            {document && checked && (
              <>
                <iframe
                  src={`${document}`}
                  title="Offer"
                  style={{ height: '500px', width: '500px' }}
                />
                <br />
              </>
            )}
            <Button
              className="mt-3 mb-4"
              disabled={checked && !document ? 'disabled' : ''}
              onClick={() => sendMail(emailBody, document)}
            >
              Send Mail
            </Button>
            <Button
              variant="secondary"
              className="mt-3 mb-4 ms-2"
              onClick={() => history.push('/recruitment')}
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default withRouter(GenerateOfferLetter);
