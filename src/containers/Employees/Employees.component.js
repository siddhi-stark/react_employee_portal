import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

import CurrentEmployee from './CurrentEmployee.component';
import NoticePeriod from './NoticePeriod.component';
import OldEmployee from './OldEmployee.component';

function Employees() {
  // const title = 'Employees List';
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('currentEmployee');
  const items = [{ to: '/', label: 'Home' }, { label: 'Employees' }];

  const group = customFunctions.getLocalStorage('group');

  useEffect(() => {
    
    setTitle('Employees');
  }, []);

  const handleSelect = (emp)=>{
    if(emp === 'currentEmployee'){
      setKey('currentEmployee');
    } else if(emp === 'noticePeriod') {
      setKey('noticePeriod');
    } else if(emp === 'oldEmployee'){
      setKey('oldEmployee');
    }
  }

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
        <div>
          <Tabs
            defaultActiveKey="currentEmployee"
            onSelect={(e)=>handleSelect(e)}
            // id="uncontrolled-tab-example"
          >
            <Tab eventKey="currentEmployee" title="Current Employee">
            { (key ==='currentEmployee') && (
              <CurrentEmployee key='1'/>
            )}
            </Tab>

            {Number(group) !== 2 ? (

            <Tab eventKey="noticePeriod" title="Serving Notice Period">
            { (key ==='noticePeriod') && (
              <NoticePeriod key={key}/>
            )}
            </Tab>
              ) : ''}

              {Number(group) !== 2 ? (

            <Tab eventKey="oldEmployee" title="Old Employee">
            { (key ==='oldEmployee') && (
              <OldEmployee />
            )}
            </Tab>
                ) : ''}
          </Tabs>
        </div>
      </section>
    </>
  );
}

export default withRouter(Employees);
