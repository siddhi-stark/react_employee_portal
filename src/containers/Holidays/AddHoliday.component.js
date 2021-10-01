import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Card } from 'react-bootstrap';
import swal from 'sweetalert';
import FormSections from './holiday.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function AddHoliday(props) {
const viewObj = props;
const viewOptions = viewObj.location.state ? viewObj.location.state.isView : '';

	const [defaultValues, updateDefaultValues] = useState({});
	const [options, updateOptions] = useState({}); // eslint-disable-line
	const [currentUser, updateCurrentUser] = useState(0);
	const [holidayId,setHolidayId] = useState('');
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [title,setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
	const hId = props.match.params.ID; // eslint-disable-line
	const viewId = props.match.params.viewID; // eslint-disable-line
	const items = [{ to: '/', label: 'Home' }, { label: hId ? 'Edit Holiday' : 'Add Holiday'   }];
  const history = useHistory();

	 useEffect(() => {
    if (!customFunctions.checkIfEmpty(viewOptions)) {
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
    } else {
    	 const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'occasion' || item.name === 'date'
          )
            itemData.disabled = false;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    }
  }, []);

	const getUserRole = async () => {
		const roleId = await localStorage.getItem('role');
		updateCurrentUser(Number(roleId));
	};

	useEffect(() => {
	getUserRole();
	}, []);

	const submitForm = async (formValues) => {
		setShowLoader(true);
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

    const endPoint =  Api.holidayUrll;
    const { data } = await callback(endPoint, postData);
	
		if (data) {
			setShowLoader(false);
			swal(data.message[0],'','success');
			history.push('/holidays');
			setHolidayId('');
		}
	};

	const getData = async (id) => {
		setShowLoader(true);
		const { data } = await AuthApi.getDataFromServer(`${Api.holidayUrll}${id}/`);
	   
	   if(data){
	   	  setShowLoader(false);
		   	data.data.date = data.data.date ? new Date(customFunctions.getDate(data.data.date)) : '';
				updateDefaultValues(data.data);
	   }

	};

	useEffect(() => {
		const viewID = props.match.params.viewID;
		setHolidayId(hId);
		if(hId || viewID) {
			setTitle('Edit Holiday');
		getData(hId || viewID);
		}else{
			setTitle('Add Holiday');
		}
	}, [holidayId]);

	return (
		<>

			<Helmet title={title} />
			<div className="page-header">
				<div className="title-breadcrumb-section">
					<h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
					<Breadcrumb items={items} />
				</div>
			</div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

			<Card>

				<div className="mt-5">
				<StarkFormBuilder
					containerClass="mb-5"
					formHeaderClass=""
					formSections={jsonSchema}
					onFormSubmit={(formValues) => {
						submitForm(formValues);
					}}
					options={options}
					callbacks={{}}
					defaultFormValues={defaultValues}
					currentUser={currentUser}
					submitBtnText="Submit"
					showResetBtn={true}
					showBtnClass={true}
					resetBtnText="Cancel"
					btnContainerClass={viewOptions ? 'd-none':'form-submit-buttons'}
					isStepForm={false}
					onFormReset={() => {
						history.push('/holidays');
					}}
				/>
			</div>
			</Card>
		</>
	);
}

export default withRouter(AddHoliday);