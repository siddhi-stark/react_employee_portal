import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';

function RightContainer() {
  return (
    <>
      <Card className="flex-fill w-100 weekly-status-box">
        <Card.Body>
          <Row>
            <Col md={6}>
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
            <Col md={6}>
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
      </Card>
      <div className="table-projects time-sheet-table">
        <div className="card">
          <div className="table-title">
            <h5 className="card-title">Time Sheet</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-striped m-0">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Clock in</th>
                  <th scope="col">Clock out</th>
                  <th scope="col">Total working</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">15/06/2021</th>
                  <td>10:30</td>
                  <td>9:00</td>
                  <td>8.00</td>
                </tr>
                <tr>
                  <th scope="row">16/06/2021</th>
                  <td>10:30</td>
                  <td>9:00</td>
                  <td>8.00</td>
                </tr>
                <tr>
                  <th scope="row">17/06/2021</th>
                  <td>10:30</td>
                  <td>9:00</td>
                  <td>8.00</td>
                </tr>
                <tr>
                  <th scope="row">18/06/2021</th>
                  <td>10:30</td>
                  <td>9:00</td>
                  <td>8.00</td>
                </tr>
                <tr>
                  <th scope="row">19/06/2021</th>
                  <td>10:30</td>
                  <td>9:00</td>
                  <td>8.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="last-week">
        <a href="#">
          <img src="/images/previous.svg" alt="" /> Last Week
        </a>
      </div>

      <div className="holidays-applied">
        <div className="row">
          <div className="col-xl-6">
            <div className="upcoming-bg">
              <div className="upcoming-event-box">
                <div className="upcoming-event-img">
                  <img src="/images/leaves-holiday.svg" alt="Upcoming event" />
                  <p>Up Coming Holidays</p>
                </div>
                <div className="event-title">
                  <p>Monday 25 June, 2021</p>
                </div>
                <div className="date">
                  <span>Rakshabandhan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="upcoming-bg faint-orange">
              <div className="upcoming-event-box">
                <div className="upcoming-event-img">
                  <img src="/images/leaves-holiday.svg" alt="Upcoming event" />
                  <p>Leaves Applied</p>
                </div>
                <div className="event-title">
                  <p>2 Leaves</p>
                </div>
                <div className="date">
                  <span>26, 27 June (Casual)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="social-media">
        <div className="card flex-fill w-100">
          <div className="card-body">
            <div className="table-title">
              <h5 className="card-title mb-0">Social Media</h5>
            </div>
            <div className="weekly-status">
              <ul className="list-unstyled p-0 d-flex align-items-center justify-content-between">
                <li>
                  <a href="#">
                    <img src="/images/social-media4.png" alt="img" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="/images/social-media4.png" alt="img" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="/images/social-media4.png" alt="img" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="/images/social-media4.png" alt="img" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default withRouter(RightContainer);
