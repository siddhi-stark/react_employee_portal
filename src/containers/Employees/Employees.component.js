import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Tabs, Tab, Accordion, Card, Button } from 'react-bootstrap';
import FormSections from './EmployeeFilterSchema.json';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

import CurrentEmployee from './CurrentEmployee.component';
import NoticePeriod from './NoticePeriod.component';
import OldEmployee from './OldEmployee.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function Employees() {
  // const title = 'Employees List';
  const [title, setTitle] = useState('');

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
    

  const items = [{ to: '/', label: 'Home' }, { label: 'Employees' }];


  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    getTechnology();
    getEmployee();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    
    setFilterData(formValues); //eslint-disable-line
      
  };
    
 const getEmployee = async () => {
    // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all`);
    
    
     const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.full_name, value: op.id };

    });
    options.employee = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});
  }
      
   const getTechnology = async () => {
      // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if(!data) {
      // show error
      return;
    }
    
 const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technology = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});

  }  
      


  useEffect(() => {
    setTitle('Employees');
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Employees</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <section className="content-area">
      <div className="mt-5">

       <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary m-0">Filters</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Expand
                  </Accordion.Toggle>
                </div>
              </div>
            </Card.Header>

            <Accordion.Collapse eventKey="1">
              <Card.Title>
  <StarkFormBuilder
    containerClass='mt-5'
    formHeaderClass=''
    formSections={FormSections}
    formHeading="filter form"
    onFormSubmit={(formValues) => {submitForm(formValues);}}
    options={options}
    callbacks={{}}
    defaultFormValues={defaultValues}
    currentUser={currentUser}
    submitBtnText="Submit"
    showResetBtn={true}
    resetBtnText="Clear"
    btnContainerClass="form-submit-buttons pull-right mb-3"
    isStepForm={false}
    
    onFormReset={() => {
      console.log('form reset callback')
    }}
  />
    

              </Card.Title>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
        <div>
          <Tabs
            defaultActiveKey="currentEmployee"
            // id="uncontrolled-tab-example"
          >
            <Tab eventKey="currentEmployee" title="Current Employee">
              <CurrentEmployee />
            </Tab>

            <Tab eventKey="noticePeriod" title="Serving Notice Period">
              <NoticePeriod />
            </Tab>

            <Tab eventKey="oldEmployee" title="Old Employee">
              <OldEmployee />
            </Tab>
          </Tabs>
        </div>
      </section>
    </>
  );
}

export default withRouter(Employees);
