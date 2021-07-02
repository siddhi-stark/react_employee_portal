import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button, Row, Col } from 'react-bootstrap';
import FormSections from './formschema.json';
import SelectFileFormSections from './selectFileformschema.json';
import RecruitmentFilterFormSections from './recruitmentFilterformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentFileComponent() {
  const title = 'Recruitment';

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Recruitment' },
  ];

  // Variable declarations Filter form
  const [defaultFilterValues, updateDefaultFilterValues] = useState({});
  const [filterOptions, updateFilterOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [show, setShow] = useState(false);

  // Declare variable table
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});

  // Variable declarations Form
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  let defaultFilterOptions = {};
  
  // Variable declarations select File
  const [defaultSelectValues, updateDefaultSelectValues] = useState({});
  const [selectOptions, updateSelectedOptions] = useState({});

  // Declare columns
  const columns = [{
    'id':'id',
    'label': 'Id',
    'isDisplay':false
  },
  {
    'id':'name',
    'label': 'Applicant Name',
  },
  {
    'id':'email',
    'label': 'Email Id',
  },
  {
    'id':'mobile',
    'label': 'Contact No',
  },
  {
    'id':'ctc',
    'label': 'CTC',
  },
  {
    'id':'expected_ctc',
    'label': 'Expected CTC',
  },
  {
    'id':'notice',
    'label': 'Notice Period',
  },
  {
    'id':'date',
    'label': 'Date',
  },
  {
    'id':'resume',
    'label': 'Download Resume',
  },
  {
    'id':'action',
    'label': 'Action',
  },
  ];

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitFilterForm = async (formValues) => {
    console.log(formValues, updateDefaultFilterValues);
    setFilterData(formValues);
    setShow(true);
  };
    
  const getTechnology = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...filterOptions,
      ...defaultFilterOptions,
      technology: dpOptions
    };
    defaultFilterOptions = {...allOptions};
    updateFilterOptions(allOptions);
  };

  useEffect(() => {
    getTechnology();
  }, []);
      
  const getPosition = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...filterOptions,
      ...defaultFilterOptions,
      position: dpOptions
    };
    defaultFilterOptions = {...allOptions};
    updateFilterOptions(allOptions);
  };

  useEffect(() => {
    getPosition();
  }, []);
      
// table method
// Declare methods
const getRowData = async (pageNo=1) =>{
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const filterList = filterData && !customFunctions.checkIfEmpty(filterData,'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      page,
      limit,
      ...filterList
      };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData(data && data.data || []);
    }else{
      console.log('error', message);
    }
}; 
  
  useEffect(()=>{
    getRowData(1);
  },[filterData]);

// upload form

  // // Get user role
  // const getUserRole = async() => {
  //   const roleId = await localStorage.getItem('role');
  //   updateCurrentUser(Number(roleId));
  // };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues,updateDefaultValues,updateOptions);
    
      const { data } = await AuthApi.postDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
      }
      // Perform success actions
  };

  // Select files to download 
  // Submit Form
  const submitSelectedForm = async (formValues) => {
    console.log(formValues, updateDefaultSelectValues);
    
      const { data } = await AuthApi.postDataToServer(Api.employeeUrl, formValues);
      if(!data) {
        // show error
      }
      // Perform success actions
  };
    
  const getUpload = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.employeeUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.full_name, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      upload: dpOptions
    };
    defaultFilterOptions = {...allOptions};
    updateSelectedOptions(allOptions);
  };

  useEffect(() => {
    getUpload();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className='title-breadcrumb-section'>
        <h2 className='main-content-title tx-24 mg-b-5'>Recruitment</h2>
        <Breadcrumb items={items} />
      </div>
      <section className='content-area'>
        <div className='mt-5'>
          <Accordion defaultActiveKey='0'>
            <Card>
              <Card.Header>
                <div className='d-flex align-items-center justify-content-between'>
                  <h4 className='text-primary m-0'>Filters</h4>
                  <div className='d-flex align-items-center justify-content-end'>
                    <Accordion.Toggle as={Button} variant='link' eventKey='1'>
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey='1'>
                <Card.Body>
                  <Card.Title>
                    <StarkFormBuilder
                      containerClass=''
                      formHeaderClass=''
                      formSections={RecruitmentFilterFormSections}
                      formHeading='Filter'
                      onFormSubmit={(formValues) => {submitFilterForm(formValues);}}
                      options={filterOptions}
                      callbacks={{}}
                      defaultFormValues={defaultFilterValues}
                      currentUser={currentUser}
                      submitBtnText='Submit'
                      showResetBtn={true}
                      resetBtnText='Clear'
                      btnContainerClass='form-submit-buttons pull-right'
                      isStepForm={false}
                      
                      onFormReset={() => {
                        console.log('form reset callback');
                      }}
                    />
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='text-primary mt-2 mb-2'>Technology</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
               <Col>   
              <StarkFormBuilder
                containerClass=''
                formHeaderClass=''
                formSections={FormSections}
                formHeading="Upload File"
                onFormSubmit={(formValues) => {submitForm(formValues);}}
                options={options}
                callbacks={{}}
                defaultFormValues={defaultValues}
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
              <Col>
              <StarkFormBuilder
                containerClass=''
                formHeaderClass=''
                formSections={SelectFileFormSections}
                formHeading="Select File"
                onFormSubmit={(formValues) => {submitSelectedForm(formValues);}}
                options={selectOptions}
                callbacks={{}}
                defaultFormValues={defaultSelectValues}
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
              </Row>

              { show && (
                <div className="mt-5">
                  <CustomTable
                    columns={columns}
                    rows={rowData}
                    showPagination={true} 
                    paginationProps={{
                      totalItems: totalCount,
                      itemsPerPage: limit,
                      activePage: currentPage,
                      onPageChange: (pageNo) => {
                        getRowData(pageNo);
                      }
                    }} 
                    emptyRender={()=>{ return ('No record found.');}} 
                  />
                </div>
                )
              }
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(RecruitmentFileComponent);