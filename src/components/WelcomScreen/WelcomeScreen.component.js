import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Jumbotron, Button } from 'react-bootstrap';

function WelcomeScreen() {
  return (
    <>
      <Jumbotron className="welcome-box">
        <Row className="align-items-center">
          <Col md={5}>
            <div className="welcome-text">
              <h1>
                Welcome <strong>Alexa,</strong>
              </h1>
              <blockquote className="blockquote quote">
                <p className="mb-0">
                  The secret of your success is determined by your daily agenda
                </p>
              </blockquote>
            </div>
          </Col>
          <Col md={2}>
            <div className="check-in">
              <div className="time-count text-center">
                <span>00 : 00</span>
              </div>
              <Button type="button" className="btn btn-primary">
                Clock In
              </Button>
            </div>
          </Col>
          <Col md={5}>
            <div className="welcome-img text-right">
              <img src="/images/welcome-img.svg" alt="img" />
            </div>
          </Col>
        </Row>
      </Jumbotron>
    </>
  );
}
export default withRouter(WelcomeScreen);
