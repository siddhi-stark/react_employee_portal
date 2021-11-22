/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './employmentFormschema.json';

function PreviousEmployement(props) {
  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  const applicantId = accProps.props.applicantId;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

  let filterOptions = {};
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [docId, setDocId] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);

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
    let experience = '';

    const endPoint = candidateId
      ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`
      : `${Api.applicantInfoUrl}`;

    const postData = {
      email_hash: tokenProps,
      password: passwordProps,
    };

    const { data, message } = applicantId
      ? await AuthApi.postDataToServer(endPoint, postData)
      : await AuthApi.postDataToServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      data.data &&
        data.data.applicant_history &&
        data.data.applicant_history.map((op) => {
          obj = { label: op.company_name, value: op.company_name };
          return op;
        });

      data.data &&
        data.data.applicant_documents &&
        data.data.applicant_documents.map((doc) => {
          if (doc.doc_title === 'Salary Slip 1') {
            salary1 = doc.document_url;
          } else if (doc.doc_title === 'Salary Slip 2') {
            salary2 = doc.document_url;
          } else if (doc.doc_title === 'Salary Slip 3') {
            salary3 = doc.document_url;
          } else if (doc.doc_title === 'Reliving Letter') {
            relive = doc.document_url;
          } else if (doc.doc_title === 'Experience Letter') {
            experience = doc.document_url;
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
        experience_letter: experience,
      });
      setDocId(docIdArr);
    } else {
      swal(message, '', 'error');
    }
  };
  useEffect(() => {
    if (candidateId || applicantId) {
      getData();
    }
  }, []);

  const fileUpload = async (formValues) => {
    // eslint-disable-line

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
    if (customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success) {
      return data.data.id;
    }
  };

  const getApplicantPercentage = async () => {
    // eslint-disable-line
    const endPoint = applicantId
      ? `${Api.applicantPercentageUrl}?applicant_id=${applicantId}`
      : `${Api.applicantPercentageUrl}?applicant_id=${candidateId}`;

    const { data, message } = await AuthApi.getDataFromServer(endPoint);

    if (customFunctions.checkIfEmpty(data)) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    if (!customFunctions.checkIfEmpty(data) && data.success && data.data) {
      props.getParentsData(data.data.completion);
    }
  };

  const submitForm = async (formValues) => {
    setShowLoader(true);

    let slip1fileUrl = '';
    let slip1fileUrlId = '';
    let slip2fileUrl = '';
    let slip2fileUrlId = '';
    let slip3fileUrl = '';
    let slip3fileUrlId = '';
    let relivingfileUrl = '';
    let relivingfileUrlId = '';
    let experiencefileUrl = '';
    let experiencefileUrlId = '';

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
        } else if (document.name === 'Experience Letter') {
          experiencefileUrl = { id: document.id, label: document.name };
        }
        return document;
      });

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
        getApplicantPercentage();
        if (candidateId) {
          getData();
        }
        swal.close();
      });
    }
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
      return;
    }

    const dpOptions = [];
    data &&
      data.data &&
      data.data.applicant_history &&
      data.data.applicant_history.map((op) => {
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
    getEmployee();
  }, [tokenProps]);

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
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
        showBtnClass={true}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons mb-4"
        isStepForm={false}
      />
    </>
  );
}

export default withRouter(PreviousEmployement);
