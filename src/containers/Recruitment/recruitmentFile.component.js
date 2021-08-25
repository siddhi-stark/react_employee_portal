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
    { Candidate_Name: 'Lata Patil', Email: 'lata12@gmail.com', Mobile_No: '9871234587', Locality: 'Pune' , Current_CTC: '200000', Expected_CTC: '300000', Notice_Period: '3', Total_Exp: '3' ,
     Relevant_Exp: '2', Resume_Source: 'Naukri', Reason_Job_Change: 'Better Opportunity', Resume: '',Gender:'Female', Fresher : 'Yes' },
  ];

   const csvHeader = [
    { label: 'Candidate Name', key: 'Candidate_Name' },
    { label: 'Email', key: 'Email' },
    { label: 'Mobile No', key: 'Mobile_No' },
    { label: 'Locality', key: 'Locality' },  
    { label: 'Current CTC', key: 'Current_CTC' },
    { label: 'Expected CTC', key: 'Expected_CTC' },
    { label: 'Notice Period', key: 'Notice_Period' },  
    { label: 'Total Exp.', key: 'Total_Exp' },
    { label: 'Relevant Exp.', key: 'Relevant_Exp' },
    { label: 'Resume Source', key: 'Resume_Source' },
    { label: 'Reason Job Change', key: 'Reason_Job_Change' },
    { label: 'Resume', key: 'Resume' },
    { label: 'Gender', key: 'Gender' },
    { label: 'Fresher', key: 'Fresher' }
  ];

  const csvReport = {
    data: csvdata,
    headers: csvHeader,
    filename: 'sample.csv'
  };

  const items = [{ to: '/', label: 'Home' }, { label: 'Bulk Upload' }];

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
    setTitle('Bulk Upload');
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
    const csvData = fileValue[0];

    const formData = new FormData();
    formData.append('file_name', csvData);
    formData.append('applied_for', formValues.applied_for
          ? formValues.applied_for.value
          : '');
    formData.append('technology_stack',formValues.technology ?
      formValues.technology.value : '');

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
        <h2 className="main-content-title tx-24 mg-b-5">Bulk Upload</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary m-0">Bulk Upload</h4>
              </div>
            </Card.Header>
            <Card.Title>
              <Row>
                <Col className="mt-4 ms-4 col-md-6">
                                
                  <div title="Download sample.csv File" className='mt-2'>
                <p>sample file download
                  <CSVLink {...csvReport}  target="_blank">
                    <Image
                    className="ml-3"
                      src="/images/download.svg"
                      alt="Download File"
                    />
                  </CSVLink>
                  </p>
                  </div>
                </Col>
                </Row>
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
                    }}
                  />
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
