import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Image, Card, Row, Col, Button } from 'react-bootstrap';
import AddHistory from './AddHistory.component';
import EditEmployee from './EditPersonalDetails.component';

function EmployeeProfile() {

  const [showEmployee, setShowEMployee] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [editEmployee, updateEditEmployee] = useState(false);
  const history = useHistory();
  

  return (
    <>
      <h6 className="mt-3">Employee Profile Page</h6>
      <Image src="/images/edit-profile-img.png" style={{ 'height': '90px' }} />
      <div className="table-projects">
       
        {showPersonalDetails ?  (
          <Card className="mt-3">
          <EditEmployee 
          handleModalCLose={(e) => setShowPersonalDetails(e)}
          />
          </Card>
          ) : (
           <Card className="mt-4">
          {/* <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2 ml-2">Employee Name</h4>
                <div className="d-flex align-items-center justify-content-between">
                 <h7>Birthdate</h7>
                </div>
              </div> */}
          <div className="d-flex align-items-center justify-content-between">
            <h3><strong>Employee Name</strong></h3>
            <div className="date-edit-option d-flex align-items-center">
              <h6>Birthday - 30/10/1991</h6>
               <a
                        href="javascript:void()"
                        onClick={() => {
                         setShowPersonalDetails(true)
                        }}
                      >
                        <img src="/images/edit-button.svg" alt="Edit Profile" />
                      </a>

              
            </div>
          </div>
          <p>Designation</p>
          <Row>
            <Col md={4}>
              <h7>Joining Date - DD/MM/YYYY</h7>
            </Col>

            <Col md={4}>
              <h7>Email Id - admin@starkdigtial.net</h7>
            </Col>

            <Col md={4}>
              <h7>Email Id - admin@gmail.com</h7>
            </Col>
          </Row><br />

          <Row>
            <Col md={4}>
              <h7>Contact No - 8765434212</h7>
            </Col>

            <Col md={2}>
              <h7>Confirmation Date - DD/MM/YYYY</h7>
            </Col>
            <Col md={2}>
              <Button onClick={() => history.push('/confirmation')}>Confirm</Button>
            </Col>

            <Col md={4}>
              <h7>Reliving Date - DD/MM/YYYY</h7>
            </Col>
          </Row>
        </Card>
          )}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4><b>Employee History</b></h4>
        <Button onClick={() => setShowEMployee(true)}>Add History</Button>

      </div>
      {showEmployee && (
        <Card className="mt-4">

          <AddHistory
            handleModalCLose={(e) => setShowEMployee(e)}
          />
        </Card>
      )}
      <card className="mt-4">
      {editEmployee ? (

          <AddHistory />

        ) : (
        <div className="d-flex align-items-start justify-content-between">
          <div className="address-content">
            <p><strong>Senior Engineer</strong> </p>
            <p>Stark Digital Media Services Pvt Ltd <br /> Mar | 2021</p>
            <p>Pune, India</p><hr />
          </div>
            <a
                        href="javascript:void()"
                        onClick={() => {
                         updateEditEmployee(true)
                        }}
                      >
                        <img src="/images/edit-button.svg" alt="Edit Profile" />
                      </a>
        </div>

        )}

          {editEmployee ? (

          <AddHistory />

        ) : (
        <div className="d-flex align-items-start justify-content-between">
          <div className="address-content">
            <p><strong>Software Engineer</strong> </p>
            <p>Stark Digital Media Services Pvt Ltd <br /> Mar | 2021</p>
            <p>Pune, India</p><hr />
          </div>
          <a
                        href="javascript:void()"
                        onClick={() => {
                         updateEditEmployee(true)
                        }}
                      >
                        <img src="/images/edit-button.svg" alt="Edit Profile" />
                      </a>
        </div>

        )}
       

        <div className="d-flex align-items-start justify-content-between">
          <div className="address-content">
            <p><strong>Software Developer</strong> </p>
            <p>Stark Digital Media Services Pvt Ltd <br /> Mar | 2021</p>
            <p>Pune, India</p><hr />
          </div>
          <a
                        href="javascript:void()"
                        onClick={() => {
                         updateEditEmployee(true)
                        }}
                      >
                        <img src="/images/edit-button.svg" alt="Edit Profile" />
                      </a>
        </div>

        <div className="d-flex align-items-start justify-content-between">
          <div className="address-content">
            <p><strong>Android Developer</strong> </p>
            <p>Stark Digital Media Services Pvt Ltd <br /> Mar | 2021</p>
            <p>Pune, India</p><hr />
          </div>
          <a
                        href="javascript:void()"
                        onClick={() => {
                         updateEditEmployee(true)
                        }}
                      >
                        <img src="/images/edit-button.svg" alt="Edit Profile" />
                      </a>
        </div>
      </card>
    </>
  )
}

export default withRouter(EmployeeProfile);