/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter, useHistory, useParams,useLocation } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './AddProfessional.json';
import applicationsComponent from './applications.component';

function ProfessionalDetails(props) {
  const { onProfDetInfo, isBasicInfoId, isFresherFlag } = props;

  let filterOptions = {};

  const params = useParams();
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory();
  const { state } = useLocation();

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
      Number(currentUser) === 3 ||
      Number(currentUser) === 5
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
          itemData.disabled =
          state?.pageType === 'My_Interview' ? true : false;
          // if (Number(item.name == 'total_exp') > Number(item.name == 'rel_exp'))
          return itemData;
        });
        return s;
      });

      updateJsonSchema([...updatedSchema]);
    }
  }, [currentUser,state]);

  const getData = async (profId) => {
    setShowLoader(true);
    let params = {
      is_professional_details: true,
    };
    const endpoint = `${Api.applicantsUrl}${profId}`;
    const url = customFunctions.generateUrl(endpoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

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
      } else if (
        data.data.resume_source === 'other' ||
        data.data.resume_source === 'Other'
      ) {
        obj.resume_source = {
          label: 'Other',
          value: data.data.resume_source,
        };
      }
      updateDefaultValues({ ...obj }); // updateDefaultValues(data);
    } else {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (isBasicInfoId === 'professional_details') return;
    const appId = isBasicInfoId;
    getData(appId);
  }, [isBasicInfoId]);

  useEffect(() => {
    if (params?.ID) {
      getData(Number(params?.ID));
    }
  }, [params]);

  // Submit Form
  const submitForm = async (formValues) => {
    setShowLoader(true);

    let expFlag = true;
    if (
      formValues &&
      Number(formValues?.total_exp) < Number(formValues?.rel_exp)
    ) {
      expFlag = false;
    }

    if (!expFlag) {
      setShowLoader(false);
      return swal(
        'Total experience should not be greater than relevent experience',
        '',
        'error'
      );
    }
    const localApplicantId = customFunctions.getLocalStorage('applicantId');

    let postData = {
      total_exp: Number(formValues?.total_exp),
      rel_exp: Number(formValues?.rel_exp),
      notice_period: Number(formValues?.notice_period) || 0,
      current_ctc: formValues?.current_ctc,
      expected_ctc: formValues?.expected_ctc,
      resume_source: formValues?.resume_source,
      resume: formValues?.resume,
      is_professional_details: true,
      is_interview_round: false,
      resume_source_details: formValues?.resume_source_details,
      is_fresher: isFresherFlag == '1' ? true : false,
    };

    postData = {
      ...postData,
      resume_source: formValues.resume_source
        ? formValues.resume_source.value
        : '',
    };

    // return;
    let applicantId;
    // if (isBasicInfoId || localApplicantId) {
    //   applicantId = isBasicInfoId || localApplicantId;
    // } else {
    applicantId = params?.ID;
    // }
    // if(applicationsComponent)

    // let appID =
    //   localApplicantId != 'undefined'
    //     ? localApplicantId
    //     : params?.ID || isBasicInfoId;

    //     let appID;

    // if (localApplicantId !== 'undefined' && localApplicantId !== 'null') {
    //     appID = localApplicantId;
    // } else if (params?.ID !== null && params?.ID !== undefined) {
    //     appID = params.ID;
    // } else {
    //     appID = isBasicInfoId;
    // }

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
        buttons: true,
        timer: 3000,
      }).then(() => {
        history.push('/recruitment');
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
          showResetBtn={true}
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
