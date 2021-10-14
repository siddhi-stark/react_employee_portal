import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import FormSections from './event.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function AddEvent(props) {
  const viewObj = props;
  const viewOptions = viewObj.location.state ? viewObj.location.state.isView : '';
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [imageUrl, setImageUrl] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('Add Event');
  const history = useHistory();
  const Event = props;
  const EditEventId = Event.match.params.event;
  const items = [{ to: '/', label: 'Home' }, { label: EditEventId ? 'Edit Event' : 'Add Event' }]; 
  const [eventId, setEventId] = useState('');

  items.map((it) => {
    if(viewOptions) {
      items[1].label = 'View Event';
    }
    return it;
  });

   const formSchemaNew = [...FormSections];
  formSchemaNew[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'date') {
      const date = new Date();
      sectionData.minDate = date;
    }
    return sectionData;
  });

  useEffect(() => {
    if (!customFunctions.checkIfEmpty(viewOptions)) {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'title' ||
            item.name === 'date' ||
            item.name === 'time' ||
            item.name === 'description' ||
            item.name === 'theme' || 
            item.name === 'image'  
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
          if (
            item.name === 'title' ||
            item.name === 'date' ||
            item.name === 'time' ||
            item.name === 'description' ||
            item.name === 'theme' ||
            item.name === 'image'
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

  const handleImageFileUpload = (e) => {
    if (!e) return;
    setImageUrl(e[0]);
  };

  const uploadFile = async () => {
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

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const postData = {
      title: formValues.title,
      description: formValues.description,
      theme: formValues.theme,
      date: formValues.date ? customFunctions.getDate(formValues.date) : '',
      time: formValues.time
        ? `${customFunctions.getTime(formValues.time)}`
        : '',
    };

    if (eventId) {
      postData.id = eventId;
    }

    if (imageUrl) {
      postData.image = await uploadFile();
    }
    const callback = eventId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint = Api.eventsUrl;
    const { data, message } = await callback(endPoint, postData);

    if (data) {
      setShowLoader(false);
      swal(data.message[0], '', 'success');
      setEventId('');
      history.push('/event');
    }else{
       setShowLoader(false);
       swal(message, '', 'error');
    }
  };

  const getData = async (id) => {
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(`${Api.eventsUrl}${id}/`);
    if(data) {
      setShowLoader(false);
    data.data.time = data && data.data &&  data.data.time
      ? new Date(
          `${customFunctions.getDate(
            data.data.date
          )} ${customFunctions.convertTime12to24(data.data.time)}`
        )
      : '';

    data.data.date = data && data.data && data.data.date
      ? new Date(customFunctions.getDate(data.data.date))
      : '';

    updateDefaultValues(data.data);
    }

  };

  useEffect(() => {
    
    setEventId(EditEventId);
    if (EditEventId) {
      getData(EditEventId);
    }

    if(viewOptions === 'true')  setTitle('View Event');

    if (EditEventId) {
      setTitle('Edit Event');
    }
    
    if(EditEventId && viewOptions === 'true'){
      setTitle('View Event');
    }
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
      <Loader showLoader={isShowLoader} needFullPage={false} />

       <div className="mt-4 edit-timelog">
        <Card body>
        {viewOptions ? (

        <Button className="float-end" onClick= {() => history.push('/event')} >Back</Button>
          ) : ''}
        <StarkFormBuilder
          containerClass="mt-2 mb-2"
          formHeaderClass=""
          formSections={FormSections || jsonSchema}
          formHeading="Event Form"
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          callbacks={{
            handleimage: (value) => {
              handleImageFileUpload(value);
            },
          }}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Submit"
          showResetBtn={true}
          showBtnClass={true}
          resetBtnText="Cancel"
          btnContainerClass={viewOptions ? 'd-none' : 'form-submit-buttons'}
          isStepForm={false}
          onFormReset={() => {
            history.push('/event');
          }}
        />
      </Card>
      </div>
    </>
  );
}

export default withRouter(AddEvent);
