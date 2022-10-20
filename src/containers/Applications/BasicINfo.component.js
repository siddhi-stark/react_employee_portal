import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './AddBasicInfo.json';

function BasicInformation(props) {
  const { onBasicInfo, match } = props;
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [appicantId, setAppicantId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    updateDefaultValues({ is_fresher: '0' });
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
            item.name === 'alternative_no'
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
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.applicantsUrl}${id}/`
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
        is_fresher: String(data.data.is_fresher) === 'false' ? '0' : '1',
      };
      onBasicInfo(data.data.id);

      updateDefaultValues({ ...obj }); // updateDefaultValues(data);
      customFunctions.setLocalStorage('applicantId', data.data.id);
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
      is_fresher: formValues.is_fresher ? Number(formValues.is_fresher) : '',
    };

    const callback = appicantId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = appicantId
      ? `${Api.applicantsUrl}${appicantId}/`
      : Api.applicantsUrl;
    const { data, message } = await callback(endPoint, postData);

    if (data) {
      setShowLoader(false);
      onBasicInfo(data.data.id);
      customFunctions.setLocalStorage('applicantId', data.data.id);
      swal(data && data.message[0], '', 'success');
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
    const ApplicantId = match.params.ID ? match.params.ID : customFunctions.getLocalStorage('applicantId');
    if (ApplicantId) {
      setAppicantId(ApplicantId);
    }
  }, [match]);

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
        btnContainerClass={`form-submit-buttons mb-4 ${Number(currentUser) === 2 ||
            Number(currentUser) === 4 ||
            Number(currentUser) === 3
            ? 'd-none'
            : ''
          }`}
        showResetBtn={false}
        showBtnClass={true}
        resetBtnText="Clear"
        isStepForm={false}
        onFormReset={() => { }}
      />
    </>
  );
}

export default withRouter(BasicInformation);
