import React, { useState, useEffect } from 'react';
import {
	withRouter
} from 'react-router-dom';
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

	useEffect(() => {
		const propVariable = props.technology;
		console.log('techno',propVariable);
    updateDefaultValues({name: props.technology})
	},[])

	// Submit Form
	const submitForm = async (formValues) => {
		console.log(formValues);

		const postData = {
			name: formValues.name
		}

		console.log('postData', postData);

		const payload = customFunctions.cleanObject(postData);
		const callback = 2 ?
			AuthApi.putDataToServer :
			AuthApi.postDataToServer;
		const endPoint = 2 ?
			`${Api.employeeStackUrl}${2}/` :
			Api.employeeStackUrl;
		const {
			data
		} = await callback(endPoint, payload);
		// const { data } = await AuthApi.postDataToServer(Api.employeeStackUrl, payload);
		if (!data) {
			// show error
			return; // eslint-disable-line
		}
		// Perform success actions
	};

	return ( <
		StarkFormBuilder containerClass = ''
		formHeaderClass = ''
		formSections = {
			FormSections
		}
		onFormSubmit = {
			(formValues) => {
				submitForm(formValues);
			}
		}
		options = {
			options
		}
		callbacks = {
			{}
		}
		defaultFormValues = {
			defaultValues
		}
		currentUser = {
			currentUser
		}
		submitBtnText = "Submit"
		showResetBtn = {
			true
		} // eslint-disable-line
		resetBtnText = "Clear"
		btnContainerClass = "form-submit-buttons"
		isStepForm = {
			false
		}

		onFormReset = {
			() => {
				console.log('form reset callback');
			}
		}
		/>
	)
}

export default withRouter(AddTechnology);