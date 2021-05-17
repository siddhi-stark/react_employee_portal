import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';

function NotFound() {
  return (
    <section className="content-area mt-5">
      <Form>
        <Form.Label>Route Not Found</Form.Label>
      </Form>
    </section>
  );
}

export default withRouter(NotFound);
