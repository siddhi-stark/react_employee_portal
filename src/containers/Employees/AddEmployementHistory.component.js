import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import PersonalDocument from './PersonalDocument.component';
import EducationalDetails from './EducationalDocument.component';
import PreviousEmployement from './PreviousEmployment.component';

function AddEmployementHistory(props) {
  const title = 'Employement History';
  const items = [{ to: '/', label: 'Home' }, { label: 'Employment History' }];
  const history = useHistory();
  const employee = props;
  const employeeId = employee.match.params.ID;
  const email = employee.location.state.email;
  const name = employee.location.state.name;

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button
          className="float-end"
          onClick={() => {
            history.push('/employees'); // eslint-disable-line
          }}
        >
          Back
        </Button>
        <h2 className="main-content-title tx-24 mg-b-5">Employement History</h2>
        <Breadcrumb items={items} />
        <section className="content-area">
          <div>
            <Tabs defaultActiveKey="Personal">
              <Tab eventKey="Personal" title="Personal Documents">
                <div className="row ml-2">
                  <PersonalDocument ID={employeeId} email={email} name={name} />
                </div>
              </Tab>
              <Tab eventKey="currentEmployee" title="Educational Documents">
                <div className="row ml-2">
                  <EducationalDetails
                    ID={employeeId}
                    email={email}
                    name={name}
                  />
                </div>
              </Tab>

              <Tab eventKey="previousEmployment" title="Previous Employment">
                <div className="row ml-2">
                  <PreviousEmployement
                    ID={employeeId}
                    email={email}
                    name={name}
                  />
                </div>
              </Tab>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(AddEmployementHistory);
