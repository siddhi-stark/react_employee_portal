import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

import CurrentEmployee from './CurrentEmployee.component';
import NoticePeriod from './NoticePeriod.component';
import OldEmployee from './OldEmployee.component';

function Employees() {
  // const title = 'Employees List';
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Employees' }];

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
