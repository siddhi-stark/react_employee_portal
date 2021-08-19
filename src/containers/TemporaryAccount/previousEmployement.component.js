import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './employmentFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function PreviousEmployement(props) {
  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  console.log('candidateId',candidateId);
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

  let filterOptions = {};
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [docId, setDocId] = useState([]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const getData = async () => {
    const docIdArr = [];
    let obj = '';
    let salary1 = '';
    let salary2 = '';
    let salary3 = '';
    let relive = '';
    const endPoint = `${Api.applicantInfoUrl}?applicant_id=${candidateId}`;

    const { data, message } = await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      data.data &&
        data.data.applicant_documents.map((doc) => {
          obj =  { label: doc.company_name, value: doc.company_name };
        if(doc.doc_title === 'Salary Slip 1'){
          salary1 = doc.document_url;
        } else if(doc.doc_title === 'Salary Slip 2'){
          salary2 = doc.document_url;
        } else if(doc.doc_title === 'Salary Slip 3'){
          salary3 = doc.document_url;
        } else if(doc.doc_title === 'Reliving Letter'){
          relive = doc.document_url;
        }
       
          docIdArr.push({ name: doc.doc_title, id: doc.doc_id });
          return doc;
        });

        updateDefaultValues({
          employee: obj,
          salary_slip1: salary1,
          salary_slip2: salary2,
          salary_slip3: salary3,
          reliving_letter: relive,
        });
      setDocId(docIdArr);
    } else {
      console.log('error', message);
      // swal(message, '', 'error');
    }
  };

  useEffect(() => {
    if (candidateId) {
      getData();
    }
  }, []);

  const fileUpload = async (formValues) => { // eslint-disable-line

    const formData = new FormData();

    formData.append('file_name', formValues[0]);
    formData.append('employee_name', nameProps);
    formData.append('employee_email', emailProps);
    formData.append('folder_name', 'Employment');
    formData.append('email_hash', tokenProps);
    formData.append('password', passwordProps);

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,
      formData
    );
     if(customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success) { 
      return data.data.id;
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    let slip1fileUrl = '';
    let slip1fileUrlId = '';
    let slip2fileUrl = '';
    let slip2fileUrlId = '';
    let slip3fileUrl = '';
    let slip3fileUrlId = '';
    let relivingfileUrl = '';
    let relivingfileUrlId = '';

    docId &&
      docId.map((document) => {
        if (document.name === 'Salary Slip 1') {
          slip1fileUrl = { id: document.id, label: document.name };
        } else if (document.name === 'Salary Slip 2') {
          slip2fileUrl = { id: document.id, label: document.name };
        } else if (document.name === 'Salary Slip 3') {
          slip3fileUrl = { id: document.id, label: document.name };
        } else if (document.name === 'Reliving Letter') {
          relivingfileUrl = { id: document.id, label: document.name };
        }
        return document;
      });

    if (formValues.salary_slip1) {
      slip1fileUrlId = await fileUpload(formValues.salary_slip1);
    }
    if (formValues.salary_slip2) {
      slip2fileUrlId = await fileUpload(formValues.salary_slip2);
    }
    if (formValues.salary_slip3) {
      slip3fileUrlId = await fileUpload(formValues.salary_slip3);
    }
    if (formValues.reliving_letter) {
      relivingfileUrlId = await fileUpload(formValues.reliving_letter);
    }

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
      applicant_id: candidateId ? Number(candidateId) : '',
      doc_type: 3,
      applicant_documents: [
        {
          doc_title: 'Salary Slip 1',
          company_name: formValues.employee
            ? formValues.employee.label
            : slip1fileUrl.label,
          doc: slip1fileUrlId ? Number(slip1fileUrlId) : slip1fileUrl.id,
        },
        {
          doc_title: 'Salary Slip 2',
          company_name: formValues.employee
            ? formValues.employee.label
            : slip2fileUrl.label,
          doc: slip2fileUrlId ? Number(slip2fileUrlId) : slip2fileUrl.id,
        },
        {
          doc_title: 'Salary Slip 3',
          company_name: formValues.employee
            ? formValues.employee.label
            : slip3fileUrl.label,
          doc: slip3fileUrlId ? Number(slip3fileUrlId) : slip3fileUrl.id,
        },
        {
          doc_title: 'Reliving Letter',
          company_name: formValues.employee
            ? formValues.employee.label
            : relivingfileUrl.label,
          doc: relivingfileUrlId
            ? Number(relivingfileUrlId)
            : relivingfileUrl.id,
        },
      ],
    };

    const { data, message } = (!customFunctions.checkIfEmpty(slip1fileUrlId) && !customFunctions.checkIfEmpty(slip2fileUrlId) && !customFunctions.checkIfEmpty(slip3fileUrlId) && !customFunctions.checkIfEmpty(relivingfileUrlId)) && await AuthApi.postDataToServer(
      `${Api.applicantDocumentUrl}`,
      postData
    );
    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        // updateDefaultValues({});
        swal.close();
      });
      // show error
      // return;
    } else {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        if(candidateId){
          getData();
        }
        swal.close();
      });
    }
    // Perform success actions
  };

  const getEmployee = async () => {
    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
    };

    const callback = AuthApi.postDataToServer;
    const endPoint = candidateId
      ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`
      : Api.applicantInfoUrl;

    const { data } = await callback(endPoint, postData);

    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data &&
      data.data.applicant_history.map((op) => {
        // Change appropriate keys
          dpOptions.push({ label: op.company_name, value: op.company_name });
        return op;
      });
    const allOptions = {
      ...options,
      ...filterOptions,
      employee: dpOptions,
    };
    filterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    console.log('fgdgdfgdff');
    getEmployee();
  }, [tokenProps]);

  return (
    <>
      <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Previous Employment"
        onFormSubmit={(formValues) => {
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
    </>
  );
}

export default withRouter(PreviousEmployement);
