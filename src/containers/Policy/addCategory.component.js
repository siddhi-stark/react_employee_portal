import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Card } from 'react-bootstrap';
import swal from 'sweetalert';
import FormSections from './categoryFormschema.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function AddCategory(props) {
  const { match } = props;
  const categoryId = match.params.categoryId;
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('Add Policy Category');
  const history = useHistory();

  const items = [
    { to: '/', label: 'Home' },
    { label: categoryId ? 'Edit Policy Category' : 'Add Policy Category' },
  ];

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    setTitle('Add Policy Category');

    if (categoryId) {
      setTitle('Edit Policy Category');
    }
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    setShowLoader(true);
    const postData = {
      id: categoryId ? Number(categoryId):'',
      name: formValues ? formValues.title :''
    };
    const callback = categoryId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint = Api.policyCategoryUrl;
    const { data, message } = await callback(endPoint, postData);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
      // show error
      return;
    }
    if (data) {
      setShowLoader(false);
      swal(data.message[0], '', 'success');
      history.push('/policy-category');
    }
    // Perform success actions
  };

  // Get data for form
  const getData = async () => {
    setShowLoader(true);

    const { data, message } = await AuthApi.getDataFromServer(`${Api.policyCategoryUrl}${categoryId}/`);
    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
      // show error
      return;
    }
     if (data && data.data) {
      setShowLoader(false);
      updateDefaultValues({title:data.data.name});
    }
  };

  // Call get data method on load
  useEffect(() => {
    if(categoryId){
      getData();
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
          <StarkFormBuilder
            containerClass=""
            formHeaderClass=""
            formSections={FormSections}
            formHeading=""
            onFormSubmit={(formValues) => {
              submitForm(formValues);
            }}
            callbacks={{}}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Submit"
            showResetBtn={true}
            resetBtnText="Cancel"
            btnContainerClass="form-submit-buttons"
            showBtnClass={true}
            isStepForm={false}
            onFormReset={() => {
              history.push('/policy-category');
            }}
          />
        </Card>
      </div>
    </>
  );
}

export default withRouter(AddCategory);
