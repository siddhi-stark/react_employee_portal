import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap';

const Employee = [{
  'name': ' Employee 1',
  'designation': 'developer',
  'date': '20/05/2021',
  'id': 'SDMS23'
},
{
  'name': ' Employee 2',
  'designation': 'developer',
  'date': '10/05/2021',
  'id': 'SDMS123'
},
{
  'name': ' Employee 3',
  'designation': 'developer',
  'date': '02/05/2021',
  'id': 'SDMS12'
},
{
  'name': ' Employee 4',
  'designation': 'developer',
  'date': '21/05/2021',
  'id': 'SDMS3'
}
]

function OldEmployee() {
  const history = useHistory();
  return (
    <>
      {Employee && Employee.map((emp) => (
        <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
          <span className="mini-stat-icon bg-purple mr-0 float-right">
            <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
          </span>
          <div className="mini-stat-info">
            <span className="counter text-purple">{emp.name}</span>
            {emp.designation} <br />
            <br />
            <p className="text-primary"> confirmation Date-{emp.date}</p> <br />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="text-primary">{emp.id}</h4>
            <div className="d-flex align-items-center justify-content-end">
              <Button size="sm" onClick={() => history.push('/employee-profile')}>View</Button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default withRouter(OldEmployee);