import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './AddProfessional.json';

function ProfessionalDetails(props) {
  const { onProfDetInfo, isBasicInfoId } = props;
  let filterOptions = {};

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [isShowLoader, setShowLoader] = useState(false);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, [currentUser]);

  useEffect(() => {
    if (
      Number(currentUser) === 2 ||
      Number(currentUser) === 4 ||
      Number(currentUser) === 3
    ) {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'total_exp' ||
            item.name === 'rel_exp' ||
            item.name === 'current_ctc' ||
            item.name === 'expected_ctc' ||
            item.name === 'resume' ||
            item.name === 'reference' ||
            item.name === 'resume_source' ||
            item.name === 'upload' ||
            item.name === 'notice_period'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });

      updateJsonSchema([...updatedSchema]);
    }
  }, [currentUser]);

  const getData = async (profId) => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.applicantsUrl}${profId}/`
    );

    if (data) {
      setShowLoader(false);
      const obj = {
        ...data.data,
      };
      onProfDetInfo(data.data.id);

      if (
        data.data.resume_source === 'Naukri' ||
        data.data.resume_source === 'naukri'
      ) {
        obj.resume_source = { label: 'Naukri', value: data.data.resume_source };
      } else if (
        data.data.resume_source === 'indeed' ||
        data.data.resume_source === 'Indeed'
      ) {
        obj.resume_source = { label: 'Indeed', value: data.data.resume_source };
      } else if (
        data.data.resume_source === 'linkedin' ||
        data.data.resume_source === 'Linkedin'
      ) {
        obj.resume_source = {
          label: 'Linkedin',
          value: data.data.resume_source,
        };
      } else if (
        data.data.resume_source === 'referal' ||
        data.data.resume_source === 'Referal'
      ) {
        obj.resume_source = {
          label: 'Referal',
          value: data.data.resume_source,
        };
      }
      updateDefaultValues({ ...obj }); // updateDefaultValues(data);
    }
  };

  useEffect(() => {
    const appId = isBasicInfoId;
    getData(appId);
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    setShowLoader(true);
    const applicantId = customFunctions.getLocalStorage('applicantId');

    let postData = {
      ...formValues,
    };

    postData = {
      ...postData,
      resume_source: formValues.resume_source
        ? formValues.resume_source.value
        : '',
    };

    const { data, message } = await AuthApi.putDataToServer(
      `${Api.applicantsUrl}${applicantId}/`,
      postData
    );
    if (data) {
      setShowLoader(false);
      onProfDetInfo(data.data.id);
      await localStorage.setItem('InterviewId', data.data.id);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
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

  const getResume = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=resume_source`
    );
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data &&
      data.data &&
      data.data.resume_source.map((op) => {
        // Change appropriate keys
        dpOptions.push({ label: op.name, value: op.id });
        return op;
      });
    const allOptions = {
      ...options,
      ...filterOptions,
      resume_source: dpOptions,
    };
    filterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getResume();
  }, []);

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <div mt-4>
        <StarkFormBuilder
          containerClass="mt-3"
          formHeaderClass=""
          formSections={FormSections || jsonSchema}
          formHeading="Professional Details"
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Save"
          showResetBtn={false}
          showBtnClass={true}
          resetBtnText="Clear"
          btnContainerClass={`form-submit-buttons mb-5 ${
            Number(currentUser) === 2 ||
            Number(currentUser) === 4 ||
            Number(currentUser) === 3
              ? 'd-none'
              : ''
          }`}
          isStepForm={false}
          onFormReset={() => {}}
        />
      </div>
    </>
  );
}

export default withRouter(ProfessionalDetails);
