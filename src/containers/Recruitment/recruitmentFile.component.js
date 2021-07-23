import React, { useState, useEffect } from 'react';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image } from 'react-bootstrap';
import FormSections from './formschema.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentFileComponent() {
  const title = 'Batch Upload';

  const items = [{ to: '/', label: 'Home' }, { label: 'Batch Upload' }];

  // Variable declarations Filter form
  const [defaultFilterValues, updateDefaultFilterValues] = useState({}); // eslint-disable-line
  const [filterOptions, updateFilterOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  // const [show, setShow] = useState(false);

  // Declare variable table
  const [filterData, setFilterData] = useState({}); //eslint-disable-line
  let defaultFilterOptions = {};
  // Form

  // Variable declarations
  // const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [fileValue, setFileValue] = useState();


  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

 

  const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = []; 
    data.data.map((op) => {
      dpOptions.push ({ label: op.name, value: op.id });
      return op;
    });
     const allOptions = {
      ...filterOptions,
      ...defaultFilterOptions,
      technology: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateFilterOptions(allOptions);
  };

  useEffect(() => {
    getTechnology();
  }, []); 

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = []; 
    data.data.map((op) => {
      dpOptions.push ({ label: op.name, value: op.id });
      return op;
    });
     const allOptions = {
      ...filterOptions,
      ...defaultFilterOptions,
      position: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateFilterOptions(allOptions);
  };

  useEffect(() => {
    getDesignation();
  }, []);



  // Submit Form
  const submitForm = async (formValues) => {
    // console.log('formValues',formValues);
    console.log('formValues.file_name[0]', fileValue[0],formValues.file_name[0]);
    // console.log('fileValue[0]',fileValue[0]);
    const csvData = fileValue[0];


    const formData = new FormData();
    formData.append('file_name', csvData);
    formData.append('applied_for', formValues.applied_for
          ? formValues.applied_for.value
          : '');

    // const  payload = {}
    // payload.applied_for = formValues.applied_for
    //       ? formValues.applied_for.value
    //       : ''
    // payload.file_name = csvData;
    // console.log('payload',payload);
    console.log('formData',formData, csvData);
    const { data, message } = await AuthApi.postDataToServer(
      Api.batchUploadUrl,
      formData
    );

    if (!data) {
      swal(message, '', 'error');
    }
    swal(data && data.message[0], '', 'success', {
      closeOnClickOutside: false,
      allowOutsideClick: false,
      buttons: false,
      timer: 2000,
    }).then(() => {
      swal.close();
    });
    // Perform success actions
  };

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      applied_for: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Batch Upload</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary m-0">Batch Upload</h4>
              </div>
            </Card.Header>
            <Card.Title>
              <Row>
                <Col>
                  <StarkFormBuilder
                    containerClass=""
                    formHeaderClass=""
                    formSections={FormSections}
                    formHeading="Upload Form"
                    onFormSubmit={(formValues) => {
                      submitForm(formValues);
                    }}
                    options={options}
                    callbacks={{
                       getFileCallback: (value) => {
                         setFileValue(value);
                         console.log('value',value);
                  },
                    }}
                    // defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={false}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons"
                    isStepForm={false}
                    onFormReset={() => {
                      console.log('form reset callback');
                    }}
                  />
                </Col>
                <Col className="mt-4">
                  <div title="Download CSV File">
                    <Image
                      src="/images/download.svg"
                      alt="Download File"
                    />
                  </div>
                </Col>
              </Row>
            </Card.Title>
          </Card>
         
        </div>
      </section>
    </>
  );
}

export default withRouter(RecruitmentFileComponent);
