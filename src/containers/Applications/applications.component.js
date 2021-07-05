import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import BasicInformation from './BasicINfo.component';
import ProfessonalDetails from './ProfessionalDetails.component';
import InterviewRounds from './InterviewRounds.component';

function Applications() {
  const title = 'Applications';

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Applications' },
  ];
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Applications</h2>
        <Breadcrumb items={items} />
        <section className="content-area">
          <Card>
            <Card.Body>
              <div>
                <Tabs
                  defaultActiveKey="currentEmployee"
                // id="uncontrolled-tab-example"

                >
                  <Tab eventKey="currentEmployee" title="Basic Information">
                    <div className="row ml-2">
                      <BasicInformation />
                    </div>
                  </Tab>
                  <Tab eventKey='noticePeriod' title='Professional Details'>
                    <div className="row ml-2">
                      <ProfessonalDetails />
                    </div>
                  </Tab>
                  <Tab eventKey='old period' title='Interview Rounds'>
                    <div className="row ml-2">
                      <InterviewRounds />
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>
    </>
  );
}

export default withRouter(Applications);