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

      {/* <Card>
            <Card.Body>
              <Row>
                <Col md={2}>
                  <h5 className="card-title mb-0">Weekly Status</h5>
                  <div className="weekly-status">
                    <ul className="list-unstyled p-0">
                      <li>
                        Completed <span className="bluebg">65%</span>
                      </li>
                      <li>
                        Pending <span className="pinkbg">25%</span>
                      </li>
                      <li>
                        Remaining <span className="yellowbg">10%</span>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="persentage-circle">
                    <img src="/images/persentage-circle.svg" alt="img" />
                  </div>
                </Col>
              </Row>
              <div className="last-week">
                <a href="#">
                  <img src="/images/previous.svg" alt="" /> Last Week
                </a>
              </div>
            </Card.Body>
          </Card> */}
    </>
  );
}
export default withRouter(WelcomeScreen);
