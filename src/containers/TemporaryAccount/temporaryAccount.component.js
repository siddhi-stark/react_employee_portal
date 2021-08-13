import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Image, ProgressBar, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Personal from './personal.component';
import EducationalDetails from './educational.component';
import PreviousEmployement from './previousEmployement.component';
import EmployementHistory from './employementHistory.component';
import Api from '../../helper/api';

function TemporaryAccount() {
  const title = 'Applications';

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <section className="content-area">
          <div className="col-xl-12" id="main-content">
            <div className="employee-new-profile">
            <Button className="pull-right mb-3">Back</Button>
              <div className="profile-bg">
                <Image src="/images/image.png" alt="image" />
                <div className="profile-img">
                  <Image src={`${Api.s3UrlnoProfile}`} alt="Card image cap" />
                </div>
              </div>
              <h3>full_name</h3>
              <h5>designation_name</h5>
              <div className="table-projects">
                <div className="mt-4 card">
                  <div className="row">
                    <div className="col-md-4">
                      <h6>Email - email</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Contact No - mobile</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Pf Included - mobile</h6>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-3">
                      <h6>Profile Completion -</h6>
                    </div>
                    <div className="col-md-4">
                      <ProgressBar
                        bsPrefix="progress pbar"
                        variant="info"
                        now={60}
                        label="completed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                defaultActiveKey="Personal"
                // onSelect={(e) => handleSelect(e)}
                // id="uncontrolled-tab-example"
              >
                <Tab eventKey="Personal" title="Personal Documents">
                  <div className="row ml-2">
                    <Personal
                    // onBasicInfo={(value) => {
                    //     setProfessionalInfo(value);

                    //   setBasicInfo(value);
                    //   setIsBI(false);
                    // }}
                    />
                  </div>
                </Tab>
                <Tab
                  eventKey="educational"
                  title="Educational Documents"
                  // disabled={isBI}
                >
                  <div className="row ml-2">
                    <EducationalDetails
                    // isBasicInfoId={isBasicInfoId}
                    // onProfDetInfo={(value) => {
                    //   setProfessionalInfo(value);
                    //   {(id) ? setIsPD(false) : setIsPD(true)} //eslint-disable-line
                    // }}
                    />
                  </div>
                </Tab>
                <Tab eventKey="employmentHistory" title="Employment History">
                  <div className="row ml-2">
                    <EmployementHistory
                    // onBasicInfo={(value) => {
                    //     setProfessionalInfo(value);

                    //   setBasicInfo(value);
                    //   setIsBI(false);
                    // }}
                    />
                  </div>
                </Tab>
                <Tab eventKey="previousEmployment" title="Previous Employment">
                  <div className="row ml-2">
                    <PreviousEmployement
                    // onBasicInfo={(value) => {
                    //     setProfessionalInfo(value);

                    //   setBasicInfo(value);
                    //   setIsBI(false);
                    // }}
                    />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(TemporaryAccount);
