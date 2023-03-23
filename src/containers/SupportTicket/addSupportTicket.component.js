import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import FormSections from './formschema.json';

function AddSupportTicket(props) {
  const { match } = props;
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Support Ticket' }];

  useEffect(() => {
    setTitle('Add Support Ticket');
  }, []);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [supportId, setSupportId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [options] = useState({});
  const [jsonSchema, updateJsonSchema] = useState(FormSections);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    const formSchema = [...FormSections];
    if ([1, 2].includes(currentUser)) {
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'title' ||
            item.name === 'ticket_type' ||
            item.name === 'description'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    } else {
      updateDefaultValues({ status: '1' });
    }
  }, [currentUser]);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    const postData = {
      title: formValues.title,
      description: formValues.description,
      ticket_type: formValues.ticket_type ? formValues.ticket_type.value : '',
      comment: formValues.comment,
      status:
        formValues.status && formValues.status.value
          ? Number(formValues.status.value)
          : Number(formValues.status),
    };
    if (supportId) postData.id = supportId;

    const callback = supportId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = supportId
      ? `${Api.supportTicketUrl}${supportId}/`
      : Api.supportTicketUrl;
    const { data, message } = await callback(endPoint, postData);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }

    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        history.push('/support-ticket');
      }
    });
  };

  const getData = async (id) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.supportTicketUrl}${id}/`
    );
    if (!data) {
      return;
    }

    updateDefaultValues({
      ...defaultValues,
      title: data.data.title,
      comment: data.data.comment,
      description: data.data.description,
      status: String(data.data.status_id),
      ticket_type: {
        label: data.data.ticket_type_name,
        value: String(data.data.ticket_type),
      },
    });
  };

  useEffect(() => {
    const id = match.params.supportId;
    if (id) {
      setSupportId(id);
      getData(id);
    }
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Add Support Ticket
          </h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Add Support Ticket</h5>
            </div>
            <hr />
            {jsonSchema && jsonSchema.length > 0 && (
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={jsonSchema}
                formHeading="Support Ticket"
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
                btnContainerClass="form-submit-buttons"
                isStepForm={false}
                onFormReset={() => {
                  history.push('/support-ticket');
                }}
              />
            )}
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(AddSupportTicket);
