import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';

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
];

function OldEmployee() {
  const history = useHistory();
  return (
    <>
      {Employee && Employee.map((emp) => (
        <Card className="mt-3 me-3" style={{ width: '30%' }}>
            <Card.Body>
              <Row>
                <Col>
                  <Image
                    className="card-img-top"
                    src="/images/edit-profile-img.png"
                    alt="Card image cap"
                    style={{ width: '80px', height: '80px' }}
                  />
                </Col>
                <Col>
                  <Card.Title>{emp.name}</Card.Title>
                  <p className="card-text">
                    {emp.designation}
                    {emp.designation} <br />
                  </p>
                  <p className="text-primary"> confirmation Date-{emp.date}</p>{' '}
                  <br />
                </Col>
              </Row>
              <Card.Footer>
                <h4 className="text-primary">
                  {emp.id}
                  <Button
                    size="sm"
                    className="pull-right"
                    onClick={() => history.push('/employee-profile')}
                  >
                    View
                  </Button>
                </h4>
              </Card.Footer>
            </Card.Body>
          </Card>
      ))}
    </>
  );
}

export default withRouter(OldEmployee);