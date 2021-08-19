import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FormSections from './event.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

function AddEvent() {
	// Variable declarations
	const [defaultValues, updateDefaultValues] = useState({});
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0);
	const title = 'Add Title';
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Event' }];


	// Get user role
	const getUserRole = async () => {
		const roleId = await localStorage.getItem('role');
		updateCurrentUser(Number(roleId));
	};

	useEffect(() => {
		getUserRole();
	}, []);


// {
// "title": "Team-Building Events",
// "description": "Team-Building Events",
// "theme":"White shirt",
// "date": "2021-08-26",
// "time": "17:00",
// "image": 2
// }



	// Submit Form
	const submitForm = async (formValues) => {
		console.log('formValues',formValues);

		const postData = {
			title: formValues.title,
			description: formValues.description,
			theme: formValues.theme,
			date: formValues.date ? customFunctions.getDate(formValues.date) : '',
			time: formValues.time
        ? `${customFunctions.getTime(formValues.time)}`
        : '',
		}

		console.log('postData',postData);

		const { data } = await AuthApi.postDataToServer(Api.eventsUrl, postData);
		if (data) {
			swal(data.message[0],'','success');
		}
		// Perform success actions
	};

	// Get data for form
	const getData = async () => {
		const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
		if (!data) {
			// show error
			return;
		}
		updateDefaultValues(data);
	};

	// Call get data method on load
	useEffect(() => {
		getData();
	}, []);

	return (
<>
 <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>

		<div className="mt-5">
			<StarkFormBuilder
				containerClass=""
				formHeaderClass=""
				formSections={FormSections}
				formHeading="Event Form"
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
		</div>
		</>
	);
}

export default withRouter(AddEvent);
