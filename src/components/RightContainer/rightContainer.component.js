import React from 'react';
import { Form, Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const graphData = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      label: 'Student',
      backgroundColor: '#862238',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
    {
      label: 'Tutor',
      backgroundColor: '#393A71',
      borderWidth: 2,
      data: [65, 49, 82, 81, 56],
    },
  ],
};

function RightContainer() {
  return (
    <>
      <Card body>
        <Bar
          data={graphData}
          options={{
            title: {
              display: true,
              text: 'Monthly Joining',
              fontSize: 15,
            },
          }}
        />
      </Card>
      <Card body>
        <Form>
          <Form.Label>Student Registration</Form.Label>
          <Table striped bordered hover>
            <thead variant="primary">
              <tr>
                <th>Student Name</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mark</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Devil</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Adam</td>
                <td>5</td>
              </tr>
              <tr>
                <td>John</td>
                <td>3</td>
              </tr>
            </tbody>
          </Table>
        </Form>
      </Card>
    </>
  );
}

export default RightContainer;
