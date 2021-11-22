import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './AddEducationalDoc.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function EducationalDocument(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const Employee = props;
  const EmployeeID = Employee.ID;
  const EmployeeEmail = Employee.email;
  const EmployeeName = Employee.name;

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const fileUpload = async (formValues) => {

    const formData = new FormData();

    formData.append('file_name', formValues[0]);
    formData.append('employee_name', EmployeeName);
    formData.append('employee_email', EmployeeEmail);
    formData.append('folder_name', 'Educational');

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,
      formData
    );

    if (customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success) {
      return data.data.id;
    }
    return formValues;
  };

  // Submit Form
  const submitForm = async (formValues) => {
    const sscfileUrl = '';
    let sscfileUrlId = '';
    const hscfileUrl = '';
    let hscfileUrlId = '';
    const graduatefileUrl = '';
    let graduatefileUrlId = '';
    const postfileUrl = '';
    let postfileUrlId = '';

    if (formValues.doc_link_graduate) {
      graduatefileUrlId =
        typeof formValues.doc_link_graduate === 'object' &&
        (await fileUpload(formValues.doc_link_graduate));
    }
    if (formValues.doc_link_hsc) {
      hscfileUrlId =
        typeof formValues.doc_link_hsc === 'object' &&
        (await fileUpload(formValues.doc_link_hsc));
    }
    if (formValues.doc_link_post_graduate) {
      postfileUrlId =
        typeof formValues.doc_link_post_graduate === 'object' &&
        (await fileUpload(formValues.doc_link_post_graduate));
    }
    if (formValues.doc_link_ssc) {
      sscfileUrlId =
        typeof formValues.doc_link_ssc === 'object' &&
        (await fileUpload(formValues.doc_link_ssc));
    }

    const postData = {
      applicant_id: EmployeeID ? Number(EmployeeID) : '',
      doc_type: 1,
      applicant_documents: [
        {
          doc_title: 'SSC',
          doc: sscfileUrlId ? Number(sscfileUrlId) : sscfileUrl,
        },
        {
          doc_title: 'HSC',
          doc: hscfileUrlId ? Number(hscfileUrlId) : hscfileUrl,
        },
        {
          doc_title: 'Graduation',
          doc: graduatefileUrlId ? Number(graduatefileUrlId) : graduatefileUrl,
        },
        {
          doc_title: 'Post Graduate',
          doc: postfileUrlId ? Number(postfileUrlId) : postfileUrl,
        },
      ],
    };

    const { data, message } =
      (!customFunctions.checkIfEmpty(graduatefileUrlId) ||
        (graduatefileUrl && !customFunctions.checkIfEmpty(hscfileUrlId)) ||
        (hscfileUrl && !customFunctions.checkIfEmpty(postfileUrlId)) ||
        (postfileUrl && !customFunctions.checkIfEmpty(sscfileUrlId)) ||
        sscfileUrl) &&
      (await AuthApi.postDataToServer(`${Api.applicantDocumentUrl}`, postData));
    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    } else {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        swal.close();
      });
    }
  };

  return (
    <StarkFormBuilder
      containerClass="mt-3"
      formHeaderClass=""
      formSections={FormSections}
      onFormSubmit={(formValues) => {
        submitForm(formValues);
      }}
      options={options}
      callbacks={{}}
      defaultFormValues={defaultValues}
      currentUser={currentUser}
      submitBtnText="Submit"
      showResetBtn={true}
      resetBtnText="Clear"
      btnContainerClass="form-submit-buttons"
      showBtnClass={true}
      isStepForm={false}
    />
  );
}

export default withRouter(EducationalDocument);
