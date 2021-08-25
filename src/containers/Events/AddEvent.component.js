import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
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
	const viewObj = props;
const viewOptions = viewObj.location.state ? viewObj.location.state.isView : '';
	const [defaultValues, updateDefaultValues] = useState({});
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [imageUrl, setImageUrl] = useState('');
	const [title,setTitle] = useState('');
	const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Event' }];
  const [eventId,setEventId] = useState('');


  useEffect(() => {
    if (!customFunctions.checkIfEmpty(viewOptions)) {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'title' || item.name === 'date' || item.name === 'time' || item.name === 'description'  || item.name === 'theme'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    } else {
    	 const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
           if (item.name === 'title' || item.name === 'date' || item.name === 'time' || item.name === 'description'  || item.name === 'theme'
          )
            itemData.disabled = false;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    }
  }, []);


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

const handleImageFileUpload = (e) => {
  	console.log('handleImageFileUpload',e);
  	 if (!e) return;
    setImageUrl(e[0]);
  }

  const uploadFile = async () => {
  	console.log('uploadFIle');
    let imgId = '';

    const formData = new FormData();
    formData.append('file_name', imageUrl);

    const { data } = await AuthApi.postDataToServer(
      `${Api.fileUploadUrl}`,
      formData
    );
    if (data) {
      imgId = data.data.id;
    }
    return imgId;
  };


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


		 if (imageUrl) {
      postData.image = await uploadFile();
    }
		const callback = eventId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint =  Api.eventsUrl;
    const { data } = await callback(endPoint, postData);

		if (data) {
			swal(data.message[0],'','success');
			setEventId('');
			history.push('/event');
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

	// Call get data method on load
	useEffect(() => {

    const ID = props.match.params.id;
    const viewID = props.match.params.viewEvent;
    setEventId(ID);
    if(ID || viewID) {
      getData(ID || viewID)
    }
   
    setTitle('View Event');
        if(ID) {
    	setTitle('Edit Event');
    }else{
    	setTitle('Add Event');
    }
	}, [eventId]);

		
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
				callbacks={{ handleimage: (value) => { handleImageFileUpload(value); }, }}
				defaultFormValues={defaultValues}
				currentUser={currentUser}
				submitBtnText="Submit"
				showResetBtn={true}
				resetBtnText="Cancel"
				btnContainerClass={viewOptions ? 'd-none':'form-submit-buttons'}
				isStepForm={false}
				onFormReset={() => {
					history.push('/event')
					console.log('form reset callback');
				}}
			/>
		</div>
		</>
	);
}

export default withRouter(AddEvent);
