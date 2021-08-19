import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import FormSections from './holiday.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

function AddHoliday(props) {
	// Variable declarations
	const [defaultValues, updateDefaultValues] = useState({});
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0);
	const [holidayId,setHolidayId] = useState('');
	const [view,setViewID] = useState('');
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

	const viewId = props.match.params.viewID; // eslint-disable-line
	const title = viewId ? 'View Holiday' : 'Add Holiday';
	const items = [{ to: '/', label: 'Home' }, { label: 'Add Holiday' }];

	const history = useHistory();


	 useEffect(() => {
    	console.log('viewIDDDDD');
	const viewId = props.match.params.viewID; // eslint-disable-line
	setViewID(viewId);
    if (view) {
    	console.log('viewIDDDDD');
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'occasion' || item.name === 'date'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    }
  }, [view]);


	// Get user role
	const getUserRole = async () => {
		const roleId = await localStorage.getItem('role');
		updateCurrentUser(Number(roleId));
	};

	useEffect(() => {
		getUserRole();
	}, []);

	// Submit Form
	const submitForm = async (formValues) => {

		const postData = {
			occasion: formValues.occasion,
			date: formValues.date ? customFunctions.getDate(formValues.date) : '',
		};

		if(holidayId) {
		postData.id = holidayId;	
		} 

		const callback = holidayId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint =  Api.holidayUrl;
    const { data } = await callback(endPoint, postData);


		
		if (data) {
			swal(data.message[0],'','success');
			history.push('/holidays');
			setHolidayId('');
		}
		// Perform success actions
	};

	// Get data for form
	const getData = async (id) => {
		const { data } = await AuthApi.getDataFromServer(`${Api.holidayUrl}${id}/`);
		console.log('holidaydata',data);
	   
	   
	   data.data.date = data.data.date ? new Date(customFunctions.getDate(data.data.date)) : '';


		updateDefaultValues(data.data);
	};

	// Call get data method on load
	useEffect(() => {
		const id = props.match.params.ID;
		setHolidayId(id);
		if(id || view) {

		getData(id || view);
		}
	}, [holidayId,view]);

	return (
		<>
		{console.log('view',view)}

			<Helmet title={title} />
			<div className="page-header">
				<div className="title-breadcrumb-section">
					<h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
					<Breadcrumb items={items} />
				</div>
			</div>
			{view ? (

			<Button className="float-end" onClick= {() => {history.push('/holidays');setViewID('')}} >Back</Button>
				) : ''}

			<div className="mt-5">
				<StarkFormBuilder
					containerClass=""
					formHeaderClass=""
					formSections={FormSections || jsonSchema}
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

export default withRouter(AddHoliday);
