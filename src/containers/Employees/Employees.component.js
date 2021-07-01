import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import CurrentEmployee from './CurrentEmployee.component';
import NoticePeriod from './NoticePeriod.component';
import OldEmployee from './OldEmployee.component';


function Employees() {
  const title = 'Employees List';
  //  const history = useHistory();
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <Card>
          <Card.Body>
            <div>
              <Tabs
                defaultActiveKey="currentEmployee"
              // id="uncontrolled-tab-example"

              >
                <Tab eventKey="currentEmployee" title="Current Employee">
                  <div className="row ml-2">
                    <CurrentEmployee />
                  </div>
                </Tab>

                <Tab eventKey='noticePeriod' title='Serving Notice Period'>
                  <div className="row ml-2">
                    <NoticePeriod />
                  </div>
                </Tab>

                <Tab eventKey='oldEmployee' title='Old Employee'>
                  <div className="row ml-2">
                    <OldEmployee />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </Card.Body>
        </Card>
      </section>
    </>
  )
}

export default withRouter(Employees);