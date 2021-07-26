import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import BasicInformation from './BasicINfo.component';
import ProfessonalDetails from './ProfessionalDetails.component';
import NewInterviewRounds from './NewInterviewRounds.component';

function Applications() {
  const title = 'Applications';

  const items = [{ to: '/', label: 'Home' }, { label: 'Applications' }];
 //  const [isBasicInfoId, setBasicInfo ] = useState(null);
 // const [isProfessionalInfoId, setProfessionalInfo ] = useState(null);
 // const [isBI, setBI ] = useState(true);
 // const [isPD, setPD ] = useState(true);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Applications</h2>
        <Breadcrumb items={items} />
        <section className="content-area">
          <div>
            <Tabs
              defaultActiveKey="currentEmployee"
              // id="uncontrolled-tab-example"
            >
              <Tab eventKey="currentEmployee" title="Basic Information">
                <div className="row ml-2">
                  <BasicInformation  />
                </div>
              </Tab>
              <Tab eventKey="noticePeriod" title="Professional Details" >
                <div className="row ml-2">
                
                        <ProfessonalDetails />
                    
                
                </div>
              </Tab>
              <Tab eventKey="old period" title="Interview Rounds" > 
                <div className="row ml-2">
                
                      <NewInterviewRounds  />
                    
                
                </div>
              </Tab>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(Applications);
