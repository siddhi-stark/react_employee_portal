import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const Employee =[{
  'name':' Employee 1',
  'designation':'developer',
  'date':'20/05/2021',
  'id':'123'
},
{
  'name':' Employee 2',
  'designation':'developer',
  'date':'20/05/2021',
  'id':'123'
},
{
  'name':' Employee 3',
  'designation':'developer',
  'date':'20/05/2021',
  'id':'123'
},
{
  'name':' Employee 4',
  'designation':'developer',
  'date':'20/05/2021',
  'id':'123'
}
]
function Employees() {
  const title = 'Employees List';

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
                { Employee && Employee.map((emp)=>(
                  <div key={emp.id}>
                  <Card className="mt-3" style={{ 'width': '26rem', 'marginRight': '18px' }}>
                    <Card.Body>
                      {/* <Card.Title>Total Number of Customers</Card.Title> */}
                      <p>emp.name</p>

                    </Card.Body>
                  </Card>
                  </div>
                ))}
                </Tab>

                <Tab eventKey='noticePeriod' title='Serving Notice Period'>
                  <h6>second Tab</h6>
                </Tab>

                <Tab eventKey='oldEmployee' title='Old Employee'>
                  <h6>Third Tab</h6>
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