import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import $ from 'jquery';
import FormSections from './addTechnology.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';

function AddTechnology(props) {
	// Variable declarations
	const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0); // eslint-disable-line
	const [count, forceUpdate] = useState(0); // eslint-disable-line
	const [isShowLoader,setShowLoader] = useState(false);
	const technologyId = props;

	// Submit Form
	const submitForm = async (formValues) => {
		setShowLoader(true);
		const postData = {
			name: formValues.name,
			id:technologyId.technologyId
		};

		const payload = customFunctions.cleanObject(postData);
		 const callback = technologyId.technologyId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = technologyId.technologyId
      ? `${Api.employeeStackUrl}`
      : Api.employeeStackUrl;
    const { data, message } = await callback(endPoint, payload);
		if (!data) {
			setShowLoader(false);
			swal(message, '', 'error');
		}
		// show error
		swal(data && data.message[0], '', 'success').then((result) => {
			if (result) {
				setShowLoader(false);
				$('.clearTechnology form').trigger('reset');
				props.onChange();
				updateDefaultValues({});
				forceUpdate(count + 1);
				props.afterSubmitTech();
			}
		});
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
		// $('.clearTechnology form').trigger('reset');
		updateDefaultValues({ name: data.data.name });
	};

	// Call get data method on load
	useEffect(() => {
		if(technologyId)
		{
			getData(technologyId);
		}
	}, [technologyId]);

	return (
		<>
    <Loader showLoader={isShowLoader} needFullPage={false} />
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
			submitBtnText="Add"
			showResetBtn={true} 
			resetBtnText="Clear"
			btnContainerClass="form-submit-buttons"
			isStepForm={false}
			onFormReset={() => {
			}}
		/>
		</>
	);
}

export default withRouter(AddTechnology);
