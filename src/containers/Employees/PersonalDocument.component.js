import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import FormSections from './AddPersonalDoc.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function PersonalDocument(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [options, updateOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const Employee = props;
  const EmployeeID = Employee.ID;
  const EmployeeEmail = Employee.email;
  const EmployeeName = Employee.name;
  const [isShowLoader, setShowLoader] = useState(false);

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
    formData.append('folder_name', 'Personal');

    const { data } = await AuthApi.postDataToServer(
      `${Api.googleFileUploadUrl}`,
      formData
    );
    let fileId = null;
    if (!data || Object.keys(data).length === 0) {
      swal('Document upload failed', '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
      fileId = null;
    } 
    if (data && Object.keys(data).length && data.success) {
      fileId = data.data.id;
    }
    return fileId;
  };

  // Submit Form
  const submitForm = async (formValues) => {
    setShowLoader(true);

    const pancardfileUrl = '';
    let pancardfileUrlId = '';
    const adharfileUrl = '';
    let adharfileUrlId = '';
    const photofileUrl = '';
    let photofileUrlId = '';

    if (formValues.doc_link_pan_card) {
      pancardfileUrlId =
        typeof formValues.doc_link_pan_card === 'object' &&
        (await fileUpload(formValues.doc_link_pan_card));
    }
    if (formValues.doc_link_adhar_card) {
      adharfileUrlId =
        typeof formValues.doc_link_adhar_card === 'object' &&
        (await fileUpload(formValues.doc_link_adhar_card));
    }
    if (formValues.doc_link_photo) {
      photofileUrlId =
        typeof formValues.doc_link_photo === 'object' &&
        (await fileUpload(formValues.doc_link_photo));
    }

    const postData = {
      applicant_id: EmployeeID ? Number(EmployeeID) : '',
      doc_type: 2,
      applicant_documents: [
        {
          doc_title: 'Aadhar',
          doc: adharfileUrlId ? Number(adharfileUrlId) : adharfileUrl,
        },
        {
          doc_title: 'Pan',
          doc: pancardfileUrlId ? Number(pancardfileUrlId) : pancardfileUrl,
        },
        {
          doc_title: 'Photo',
          doc: photofileUrlId ? Number(photofileUrlId) : photofileUrl,
        },
      ],
    };
    
    if(pancardfileUrlId || (pancardfileUrl && adharfileUrlId) ||(adharfileUrl && photofileUrlId) ||
        photofileUrl) {

      const { data, message } = await AuthApi.postDataToServer(`${Api.applicantDocumentUrl}`, postData);

      if (!data) {
        setShowLoader(false);
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          swal.close();
        });
      } else {
        setShowLoader(false);
        swal(data && data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          swal.close();
        });
      }
    } else {
      setShowLoader(false);
    }
  };

  return (
    <>
    <Loader showLoader={isShowLoader} needFullPage={false} />
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
    </>
  );
}

export default withRouter(PersonalDocument);
