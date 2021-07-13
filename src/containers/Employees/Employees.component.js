import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Card, Image, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

// const Employee = [{
//   'name': ' Employee 1',
//   'designation': 'developer',
//   'date': '20/05/2021',
//   'id': 'SDMS23'
// },
// {
//   'name': ' Employee 2',
//   'designation': 'developer',
//   'date': '10/05/2021',
//   'id': 'SDMS123'
// },
// {
//   'name': ' Employee 3',
//   'designation': 'developer',
//   'date': '02/05/2021',
//   'id': 'SDMS12'
// },
// {
//   'name': ' Employee 4',
//   'designation': 'developer',
//   'date': '21/05/2021',
//   'id': 'SDMS3'
// }
// ]
function Employees() {
  const title = 'Employees List';
  const [employee, setEmployee] = useState([]);

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];

const getEmployee = async () => {
 const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}`
      
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setEmployee(data.data);
    }
  };


useEffect(() => {
getEmployee();
},[])


    console.log('employeeData',employee);
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
                    {employee && employee.map((emp) => (
                      <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
                        </span>
                        <div className="mini-stat-info">
                          <span className="counter text-purple">{emp.full_name}</span>
                          {emp.designation_name} <br/>
                           <br/>
                          <p className="text-primary"> confirmation Date-  {emp.confirmation_date ? customFunctions.getDate(emp.confirmation_date) : null}</p> <br/>
                        </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="text-primary">{emp.emp_code}</h4>
                            <div className="d-flex align-items-center justify-content-end">
                              <Button size="sm">View</Button>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey='noticePeriod' title='Serving Notice Period'>
                   <div className="row ml-2">
                    {employee && employee.map((emp) => (
                      <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
                        </span>
                        <div className="mini-stat-info">
                          <span className="counter text-purple">{emp.name}</span>
                          {emp.designation} <br/>
                           <br/>
                          <p className="text-primary"> confirmation Date- {emp.date}</p> <br/>
                        </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="text-primary">{emp.id}</h4>
                            <div className="d-flex align-items-center justify-content-end">
                              <Button size="sm">View</Button>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey='oldEmployee' title='Old Employee'>
                   <div className="row ml-2">
                    {employee && employee.map((emp) => (
                      <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
                        </span>
                        <div className="mini-stat-info">
                          <span className="counter text-purple">{emp.name}</span>
                          {emp.designation} <br/>
                           <br/>
                          <p className="text-primary"> confirmation Date-{emp.date}</p> <br/>
                        </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="text-primary">{emp.id}</h4>
                            <div className="d-flex align-items-center justify-content-end">
                              <Button size="sm">View</Button>
                            </div>
                          </div>
                      </div>
                    ))}
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