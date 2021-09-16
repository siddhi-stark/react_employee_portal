import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';

import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddBasicInfo.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BasicInformation(props) {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); 
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [appicantId, setAppicantId] = useState('');

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    updateDefaultValues({is_fresher:'0'});
    getUserRole();
    getDesignation();
    getTechnology();
  }, [currentUser]);

  useEffect(() => {
    const formSchema = [...FormSections];
    // if ((Number(currentUser) !== 4) || (Number(currentUser) !== 3)) return;
    if ((Number(currentUser) === 2) || (Number(currentUser) === 4) || (Number(currentUser) === 3)) {
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
            item.name === 'is_fresher'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });

      updateJsonSchema([...updatedSchema]);
    }
  }, [currentUser]);

  // Get data for form
  const getData = async (technology, id) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.applicantsUrl}${id}/`
    );
    
    if (data) {
      customFunctions.setLocalStorage('notes', data.data.notes);

      const ds = data.data.applied_for_id
        ? {
            label: data.data.applied_for_name,
            value: data.data.applied_for_id,
          }
        : '';

      const techStack = data.data.tech_stack_id
        ? {
            label: data.data.tech_stack_name,
            value: data.data.tech_stack_id,
          }
        : '';

      const obj = {
        ...data.data,
        applied_for: ds,
        tech_stack: techStack,
        is_fresher: (String(data.data.is_fresher) === 'false') ? '0' : '1'
      };

      props.onBasicInfo(data.data.id);

      updateDefaultValues({ ...obj }); // updateDefaultValues(data);
      customFunctions.setLocalStorage('applicantId', data.data.id);
    }
  };

  // useEffect(() => {
  //   getData();
  // }, [])

  // Submit Form
  const submitForm = async (formValues) => {
    // customFunctions.setLocalStorage('applicantName',formValues.name);
    // customFunctions.setLocalStorage('designation',formValues.applied_for.label);

    let postData = {
      ...formValues,
    };

    postData = {
      ...postData,
      tech_stack: formValues.tech_stack ? formValues.tech_stack.value : '',
      applied_for: formValues.applied_for ? formValues.applied_for.value : '',
      is_fresher: formValues.is_fresher ? Number(formValues.is_fresher) : ''
    };

    const callback = appicantId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = appicantId
      ? `${Api.applicantsUrl}${appicantId}/`
      : Api.applicantsUrl;
    const { data, message } = await callback(endPoint, postData);

    // const { data } = await AuthApi.postDataToServer(
    //   Api.applicantsUrl,
    //   postData
    //   );

    if (data) {
      props.onBasicInfo(data.data.id);
      customFunctions.setLocalStorage('applicantId', data.data.id);
      swal(data && data.message[0], '', 'success');
      
    } else {
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
      // show error
      return;
    }

    const dpOptions = [];
    await data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    // const allOptions = {
    //   ...options,
    //   applied_for: dpOptions
    // };
    // updateOptions({...allOptions});

    options.applied_for = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
    // await getData();
  };

  const getTechnology = async () => {
    // const id = props.match.params.stackId;
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeStackUrl}?type=all`
    );
    if (!data) {
      // show error
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
    const ApplicantId = props.match.params.ID;
    if (ApplicantId) {
      setAppicantId(ApplicantId);
    }
  }, []);

  return (
    <>
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
        submitBtnText={(Number(currentUser) === 2) || (Number(currentUser) === 4 || Number(currentUser) === 3) ? '' : 'Save'}
        // btnContainerClass='form-submit-buttons'
        btnContainerClass={`form-submit-buttons mb-4 ${
          (Number(currentUser) === 2) || (Number(currentUser) === 4 || Number(currentUser) === 3) ? 'd-none' : ''
        }`}
        showResetBtn={false}
        resetBtnText="Clear"
        isStepForm={false}
        onFormReset={() => {}}
      />
    </>
  );
}

export default withRouter(BasicInformation);