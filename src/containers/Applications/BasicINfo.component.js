/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './AddBasicInfo.json';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function BasicInformation(props) {
  const { onBasicInfo, match, notes } = props;
  const params = useParams();
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [appicantId, setAppicantId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [basicInfoId, setBasicInfoId] = useState();
  const history = useHistory();
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    updateDefaultValues();
    getUserRole();
    getDesignation();
    getTechnology();
  }, [currentUser]);

  useEffect(() => {
    const formSchema = [...FormSections];
    if (
      Number(currentUser) === 2 ||
      Number(currentUser) === 4 ||
      Number(currentUser) === 3
    ) {
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'name' ||
            item.name === 'position' ||
            item.name === 'tech_stack' ||
            item.name === 'applied_for' ||
            item.name === 'education' ||
            item.name === 'email' ||
            item.name === 'mobile' ||
            item.name === 'is_fresher' ||
            item.name === 'alternative_no' ||
            item.name === 'gender' ||
            item.name === 'locality'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });

      updateJsonSchema([...updatedSchema]);
    }
  }, [currentUser]);

  const getData = async (technology, id) => {
    if (id == 'undefined') return;
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.applicantsUrl}${id}/?is_basic_details=true&is_professional_details=false`
    );

    if (data) {
      setShowLoader(false);
      customFunctions.setLocalStorage('notes', data.data.notes);
      const ds = data.data.applied_for_id
        ? {
            label: data.data.applied_for_name,
            value: data.data.applied_for_id,
          }
        : '';

      const techStack = [];
      data &&
        data.data &&
        data.data.tech_stack &&
        data.data.tech_stack.length &&
        data.data.tech_stack.map((op) => {
          techStack.push({ label: op.tech_name, value: op.tech_id });
          return op;
        });
      const obj = {
        ...data.data,
        applied_for: ds,
        tech_stack: techStack,
        gender: String(data?.data?.gender),
        locality: data?.data?.locality,
        is_fresher: String(data?.data?.is_fresher) === 'false' ? '0' : '1',
        reason_job_change:
          String(data?.data?.is_fresher) === 'false'
            ? data?.data?.reason_job_change
            : null,
      };
      onBasicInfo(data.data.id, data.data.notes);
      setBasicInfoId(data.data.id);
      // notes(data.data.notes);
      updateDefaultValues({ ...obj }); // updateDefaultValues(data);
      customFunctions.setLocalStorage('applicantId', data.data.id);
    } else {
      setShowLoader(false);
    }
  };

  const submitForm = async (formValues) => {
    setShowLoader(true);

    let postData = {
      ...formValues,
    };

    const techData = [];
    formValues.tech_stack.map((e) => techData.push(e.value));
    postData = {
      ...postData,
      tech_stack: techData,
      applied_for: formValues.applied_for ? formValues.applied_for.value : '',
      gender: formValues.gender ? Number(formValues.gender) : '',
      is_fresher: formValues.is_fresher ? Number(formValues.is_fresher) : '',
      reason_job_change: formValues?.reason_job_change,
      locality: formValues?.locality,
    };

    const callback =
      appicantId == 'undefined' || appicantId == ''
        ? AuthApi.postDataToServer
        : AuthApi.putDataToServer;
    const endPoint =
      appicantId == 'undefined' || appicantId == ''
        ? Api.applicantsUrl
        : `${Api.applicantsUrl}${appicantId}/`;
    const { data, message } = await callback(endPoint, postData);

    if (data) {
      setShowLoader(false);
      onBasicInfo(basicInfoId);
      // notes(notes);
      // customFunctions.setLocalStorage('applicantId', data.data.id);
      swal(data && data.message[0], '', 'success').then(() => {
        if (params?.ID) {
          history.push(`/applications/${params?.ID}`);
        } else {
          history.push(`/applications/${data?.data?.id}`);
        }
        props.callback('professional_details');
        // }
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
    }
  };

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    await data.data.map((op) => {
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });

    options.applied_for = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeStackUrl}?type=all`
    );
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.tech_stack = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
    if (appicantId) {
      await getData(data.data, appicantId);
    }
  };

  useEffect(() => {
    const ApplicantId = match.params.ID
      ? match.params.ID
      : customFunctions.getLocalStorage('applicantId');
    if (ApplicantId) {
      setAppicantId(ApplicantId || '');
    }
  }, [match]);

  // useEffect(() => {
  //   if (params?.ID) {
  //     setAppicantId(params?.ID);
  //   }
  // }, [params]);

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <StarkFormBuilder
        containerClass="mt-3"
        formHeaderClass=""
        formSections={FormSections || jsonSchema}
        formHeading="Basic Information"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
        }}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText={
          Number(currentUser) === 2 ||
          Number(currentUser) === 4 ||
          Number(currentUser) === 3
            ? ''
            : 'Save'
        }
        btnContainerClass={`form-submit-buttons mb-4 ${
          Number(currentUser) === 2 ||
          Number(currentUser) === 4 ||
          Number(currentUser) === 3
            ? 'd-none'
            : ''
        }`}
        showResetBtn={true}
        showBtnClass={true}
        resetBtnText="Clear"
        isStepForm={false}
        onFormReset={() => {}}
      />
    </>
  );
}

export default withRouter(BasicInformation);
