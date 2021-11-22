import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './AddEmployment.json.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function PreviousEmployment(props) {
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
    formData.append('folder_name', 'Employment');

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
    const slip1fileUrl = '';
    let slip1fileUrlId = '';
    const slip2fileUrl = '';
    let slip2fileUrlId = '';
    const slip3fileUrl = '';
    let slip3fileUrlId = '';
    const relivingfileUrl = '';
    let relivingfileUrlId = '';
    const experiencefileUrl = '';
    let experiencefileUrlId = '';

    if (formValues.salary_slip1) {
      slip1fileUrlId =
        typeof formValues.salary_slip1 === 'object' &&
        (await fileUpload(formValues.salary_slip1));
    }
    if (formValues.salary_slip2) {
      slip2fileUrlId =
        typeof formValues.salary_slip2 === 'object' &&
        (await fileUpload(formValues.salary_slip2));
    }
    if (formValues.salary_slip3) {
      slip3fileUrlId =
        typeof formValues.salary_slip3 === 'object' &&
        (await fileUpload(formValues.salary_slip3));
    }
    if (formValues.reliving_letter) {
      relivingfileUrlId =
        typeof formValues.reliving_letter === 'object' &&
        (await fileUpload(formValues.reliving_letter));
    }
    if (formValues.experience_letter) {
      experiencefileUrlId =
        typeof formValues.experience_letter === 'object' &&
        (await fileUpload(formValues.experience_letter));
    }

    const postData = {
      applicant_id: EmployeeID ? Number(EmployeeID) : '',
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
        {
          doc_title: 'Experience Letter',
          company_name: formValues.employee
            ? formValues.employee.label
            : experiencefileUrl.label,
          doc: experiencefileUrlId
            ? Number(experiencefileUrlId)
            : experiencefileUrl.id,
        },
      ],
    };

    const { data, message } =
      (!customFunctions.checkIfEmpty(slip1fileUrlId) ||
        (slip1fileUrl && !customFunctions.checkIfEmpty(slip2fileUrlId)) ||
        (slip2fileUrl && !customFunctions.checkIfEmpty(slip3fileUrlId)) ||
        (slip3fileUrl && !customFunctions.checkIfEmpty(relivingfileUrlId)) ||
        (relivingfileUrl &&
          !customFunctions.checkIfEmpty(experiencefileUrlId)) ||
        experiencefileUrl) &&
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

export default withRouter(PreviousEmployment);
