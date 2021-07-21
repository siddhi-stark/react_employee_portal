import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tabs, Tab, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';

// import CurrentEmployee from './CurrentEmployee.component';
// import NoticePeriod from './NoticePeriod.component';
// import OldEmployee from './OldEmployee.component';

function Employees() {
  const title = 'Employees List';
  const [employee, setEmployee] = useState([]);
  // const[employeeId,setId] = useState(null);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

const history = useHistory();
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];

const getEmployee = async (pageNo = 1) => {
  const page = pageNo || currentPage;
const endPoint = `${Api.employeeUrl}`;
  const params = {
      limit,
      page,

      // ...filterList
    }
     const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
      setEmployee(data.data);
      // setId(data.data.id);
      setTotalCount(data.paginator.total_count);
      // setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      // console.log('data.paginator', data.paginator);
  };


useEffect(() => {
getEmployee(1);
},[])


    console.log('employeeData',employee);
    // console.log('noticePeriod',noticePeriod);
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">

            <div>
              <Tabs
                defaultActiveKey="currentEmployee"
              // id="uncontrolled-tab-example"

              >
                <Tab eventKey="currentEmployee" title="Current Employee">
                  <div className="row ml-2">
                    {employee && employee.map((emp) => (
                     <Card className="mt-3 me-3" style={{ width: '30%' }}>
            <Card.Body>
              <Row>
                <Col className="col-md-4">
                 <span className="mini-stat-icon bg-purple mr-0 float-right">
                  <Image
                    className="card-img-top"
                    src="/images/edit-profile-img.png"
                    alt="Card image cap"
                    style={{ width: '80px', height: '80px' }}
                  />
                  {emp.on_notice_period && (
                    <span className="np-sup">NP</span>
                    )}
                  
                  </span>
                </Col>
                <Col className="col-md-8">
                  <Card.Title>{emp.name}</Card.Title>
                  <p className="card-text">
                    {emp.full_name} <br />
                    {emp.designation_name} <br />
                  </p>
                  <p className="text-primary confirmation-date"> confirmation Date- {emp.confirmation_date ? customFunctions.getDate(emp.confirmation_date) : null}</p>{' '}
                  <br />
                </Col>
              </Row>
              <Card.Footer className="card-footer-view">
                <h4 className="text-primary">
                 SDMS{emp.emp_code}
                </h4>
                <Button size="sm" className="pull-right" onClick={() => {history.push(`/employee-profile/${emp.id}`); localStorage.setItem('employeeName',emp.full_name) ; localStorage.setItem('candidateId',emp.id)}}>View</Button>
              </Card.Footer>
            </Card.Body>
          </Card>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey='noticePeriod' title='Serving Notice Period'>
                   <div className="row ml-2">
                    {employee && employee.filter(e => e.on_notice_period === true).map((emp) => (
                             <Card className="mt-3 me-3" style={{ width: '30%' }}>
            <Card.Body>
              <Row>
                <Col>
                 <span className="mini-stat-icon bg-purple mr-0 float-right">
                  <Image
                    className="card-img-top"
                    src="/images/edit-profile-img.png"
                    alt="Card image cap"
                    style={{ width: '80px', height: '80px' }}
                  />
                   <span className="np-sup">NP</span>
                   </span>
                </Col>
                <Col>
                  <Card.Title>{emp.name}</Card.Title>
                  <p className="card-text">
                    {emp.full_name}
                    {emp.designation_name} <br />
                  </p>
                  <p className="text-primary confirmation-date"> confirmation Date- {emp.confirmation_date ? customFunctions.getDate(emp.confirmation_date) : null}</p>{' '}
                  <br />
                </Col>
              </Row>
              <Card.Footer>
                <h4 className="text-primary">
                  {emp.emp_code}
                  <Button size="sm" className="pull-right"  onClick={() => history.push(`/employee-profile/${emp.id}`)}>View</Button>
                </h4>
              </Card.Footer>
            </Card.Body>
          </Card>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey='oldEmployee' title='Old Employee'>
                   <div className="row ml-2">
                   {employee && employee.filter(e => e.relieved === true).map((emp) => (
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
                    {emp.full_name}
                    {emp.designation_name} <br />
                  </p>
                  <p className="text-primary confirmation-date"> confirmation Date- <br /> {emp.confirmation_date ? customFunctions.getDate(emp.confirmation_date) : null}</p>{' '}
                  <br />
                </Col>
              </Row>
              <Card.Footer>
                <h4 className="text-primary">
                  {emp.emp_code}
                  <Button size="sm" className="pull-right" onClick={() => history.push(`/employee-profile/${emp.id}`)}>View</Button>
                </h4>
              </Card.Footer>
            </Card.Body>
          </Card>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div>
                      <Pagination
                      totalCount={totalCount}
                      currentPage={currentPage}
                      limit={limit}
                      getData={getEmployee}
                    />
            </div>

      </section>
    </>
  );
}

export default withRouter(Employees);