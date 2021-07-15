import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import $ from 'jquery';
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

		const postData = {
			name: formValues.name,
		};

		const payload = customFunctions.cleanObject(postData);
		const callback = technologyId.technologyId
			? AuthApi.putDataToServer
			: AuthApi.postDataToServer;
		const endPoint = technologyId.technologyId
			? `${Api.employeeStackUrl}${technologyId.technologyId}/`
			: Api.employeeStackUrl;
		const { data, message } = await callback(endPoint, payload);
		console.log('data ', data);
		if (!data) {
			swal(message, '', 'error');
		}
		// show error
		swal(data && data.message[0], '', 'success').then((result) => {
			if (result) {
				$('.clearTechnology form').trigger('reset');
			}
		});
		// Perform success actions
	};

	// Get data for form
	const getData = async (id) => {
		console.log('id', id);
		if (!id.technologyId) return;
		const { data } = await AuthApi.getDataFromServer(
			`${Api.employeeStackUrl}${id.technologyId}/`
		);
		if (!data) {
			// show error
			return;
		}
		// $('.clearTechnology form').trigger('reset');
		updateDefaultValues({ name: data.data.name });
	};
		console.log('defaultValues',defaultValues );

	// Call get data method on load
	useEffect(() => {
		console.log('getData');
		getData(technologyId);
		forceUpdate(count + 1);
	}, [technologyId]);

	return (
		<StarkFormBuilder
			containerClass="clearTechnology"
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
			isStepForm={false}
			onFormReset={() => {
				console.log('form reset callback');
			}}
		/>
	);
}

export default withRouter(AddTechnology);
