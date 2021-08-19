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

function AddEvent(props) {
	// Variable declarations
	const [defaultValues, updateDefaultValues] = useState({});
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
	const [view,setView] = useState('');
	const title = 'Add Title';
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Event' }];
  const [eventId,setEventId] = useState('');

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

			if(eventId) {
		postData.id = eventId;	
		} 

		const callback = eventId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint =  Api.eventsUrl;
    const { data } = await callback(endPoint, postData);

		if (data) {
			swal(data.message[0],'','success');
			setEventId('');
		}
		// Perform success actions
	};

	// Get data for form
	const getData = async (id) => {
		const { data } = await AuthApi.getDataFromServer(`${Api.eventsUrl}${id}/`);
		console.log('data',data);

		 data.data.time = data.data.time ? new Date(
            `${customFunctions.getDate(data.data.date)} ${customFunctions.convertTime12to24(data.data.time)}`
          ) : '';

		  data.data.date = data.data.date ? new Date(customFunctions.getDate(data.data.date)) : '';

		 // if (!customFunctions.checkIfEmpty(dt.int_time)) {
   //        newTime = new Date(
   //          `${customFunctions.getDate(dt.int_date)} ${customFunctions.convertTime12to24(dt.int_time)}`
   //        );
   //      }

        // const obj = {
        // 	...data.data,
        // }

		updateDefaultValues(data.data);
	};

	const disableFields = () => {
		const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'title' || item.name === 'date' || item.name === 'time' || item.name === 'description' || item.name === 'theme'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
	}

	// Call get data method on load
	useEffect(() => {

    const ID = props.match.params.id;
    setEventId(ID);
    if(ID) {
      getData(ID)
    }
	}, []);

		useEffect(() => {
			console.log('view useEffect');
    const viewid = props.match.params.id;
    setView(viewid);
    if(viewid) {
    	disableFields();
      getData(viewid)
    }
	}, [view]);


	return (
<>
{console.log('id',eventId)}
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
				formSections={FormSections || jsonSchema}
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
				btnContainerClass= { view ? 'd-none' : 'form-submit-buttons' } 
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
