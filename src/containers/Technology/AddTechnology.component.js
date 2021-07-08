import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './addTechnology.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function AddTechnology(props) {
	// Variable declarations
	const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0); // eslint-disable-line
	const [count, forceUpdate] = useState(0); // eslint-disable-line
	const technologyId = props;

	// Submit Form
	const submitForm = async (formValues) => {
		console.log(formValues);

		const postData = {
			name: formValues.name,
		};

		const payload = customFunctions.cleanObject(postData);
		const callback = technologyId.technologyId ? AuthApi.putDataToServer : AuthApi.postDataToServer;
		const endPoint = technologyId.technologyId ? `${Api.employeeStackUrl}${technologyId.technologyId}/` : Api.employeeStackUrl;
		const { data } = await callback(endPoint, payload);
		// const { data } = await AuthApi.postDataToServer(Api.employeeStackUrl, payload);
		if (!data) {
			// show error
			return; // eslint-disable-line
		}
		// Perform success actions
	};

	  // Get data for form
  const getData = async (id) => {
    if (!id.technologyId) return;
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeStackUrl}${id.technologyId}/`
    );
    if (!data) {
      // show error
      return;
    }
    updateDefaultValues({ name: data.data.name });
  };
	
  // Call get data method on load
  useEffect(() => {
    getData(technologyId);
    forceUpdate(count+1);
  }, [technologyId]);

  console.log('defaultValues',defaultValues);
	return (
		<StarkFormBuilder
			containerClass=""
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
			showResetBtn={true} // eslint-disable-line
			resetBtnText="Clear"
			btnContainerClass="form-submit-buttons"
			isStepForm={false}
			onFormReset={() => {
				console.log('form reset callback');
			}}
		/>
	);
}

export default withRouter(AddTechnology);
