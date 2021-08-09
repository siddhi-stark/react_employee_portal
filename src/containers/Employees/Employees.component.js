import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
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
    {console.log('currentUser',currentUser)}
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Employees</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <section className="content-area">
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
