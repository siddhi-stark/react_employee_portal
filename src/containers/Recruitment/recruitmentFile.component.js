import React, { useState, useEffect } from 'react';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import FormSections from './formschema.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentFileComponent() {
  // const title = 'Batch Upload';

  const csvdata = [
    { Candidate_Name: '', Email: '', Mobile_No: '', Locality: '' , Current_CTC: '', Expected_CTC: '', Notice_Period: '', Total_Exp: '' ,
     Relevant_Exp: '', Resume_Source: '', Reason_Job_Change: '', Resume: '',Gender:'' },
  ];

   const csvHeader = [
  { label: 'Candidate Name', key: 'Candidate_Name' },
  { label: 'Email', key: 'Email' },
  { label: 'Mobile No', key: 'Mobile_No' },
  { label: 'Locality', key: 'Locality' },  
  { label: 'Last Current CTC', key: 'Current_CTC' },
  { label: 'Expected CTC', key: 'Expected_CTC' },
  { label: 'Notice Period', key: 'Notice_Period' },  
  { label: 'Total Exp', key: 'Total_Exp' },
  { label: 'Relevant Exp', key: 'Relevant_Exp' },
  { label: 'ResumeSource', key: 'Resume_Source' },
  { label: 'Reason Job Change', key: 'Reason_Job_Change' },
  { label: 'Resume', key: 'Resume' },
  { label: 'Gender', key: 'Gender' }
  ];

  const csvReport = {
    data: csvdata,
    headers: csvHeader,
    filename: 'sample.csv'
  };

  const items = [{ to: '/', label: 'Home' }, { label: 'Batch Upload' }];

  // Variable declarations Filter form
  const [defaultFilterValues, updateDefaultFilterValues] = useState({}); // eslint-disable-line
  const [filterOptions, updateFilterOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [title,setTitle] = useState('');
  const history = useHistory();
  // const [show, setShow] = useState(false);

  // Declare variable table
  const [filterData, setFilterData] = useState({}); //eslint-disable-line
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
    setTitle('Batch Upload');
  }, []);

  const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeStackUrl}?type=all`);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technology = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  };

  useEffect(() => {
    getTechnology();
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
    formData.append('technology_stack',formValues.technology ?
      formValues.technology.value : '');
      

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
      history.push('/recruitment');
    });
    // Perform success actions
  };

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
    if (!data) {
      // show error
      return;
    }

     const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.applied_for = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
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
                <Col className="mt-4 col-md-1">
                                
                  <div title="Download CSV File">
                  <CSVLink {...csvReport}  target="_blank">
                    <Image
                      src="/images/download.svg"
                      alt="Download File"
                    />
                  </CSVLink>
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
