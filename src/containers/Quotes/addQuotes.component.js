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
import customFunctions from '../../helper/customFunctions';
import FormSections from './formschema.json';

function AddQuotes(props) {
  const { match } = props;
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Quote' }];

  useEffect(() => {
    setTitle('Add Quote');
  }, []);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [quotesId, setQuotesId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    setShowLoader(true);

    const payload = customFunctions.cleanObject(formValues);

    const callback = quotesId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = quotesId ? `${Api.quotesUrl}${quotesId}/` : Api.quotesUrl;
    const { data, message } = await callback(endPoint, payload);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }

    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        history.push('/quotes');
      }
    });
  };

  const getData = async (id) => {
    const { data } = await AuthApi.getDataFromServer(`${Api.quotesUrl}${id}/`);
    if (!data) {
      return;
    }
    updateDefaultValues({ content: data.data.content });
  };

  useEffect(() => {
    const id = match.params.qid;
    if (id) {
      setQuotesId(id);
      getData(id);
    }
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Add Quote</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Add Quote</h5>
            </div>
            <hr />
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              formHeading="Content"
              onFormSubmit={(formValues) => {
                submitForm(formValues);
              }}
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
                history.push('/quotes');
              }}
            />
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(AddQuotes);
