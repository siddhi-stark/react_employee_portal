import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';

import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';

function NoticePeriodComponent() {
  const [employee, setEmployee] = useState([]);
  const [title, setTitle] = useState('');
  const [totalCount, setTotalCount] = useState(9);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState('');

  const history = useHistory();
  // const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];

  const getEmployee = async (pageNo = 1) => {
    console.log('currentPage', currentPage);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      limit,
      notice_period: 'True',
      page,

      // ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      console.log('data.paginator--', data.data);
      setEmployee(data.data);
      // setId(data.data.id);
      setTotalCount(Number(data.paginator.total_count));
      setLimit(Number(data.paginator.limit));
      setCurrentPage(Number(data.paginator.current_page));
      // console.log('data.paginator', data.paginator);
    }
  };

  useEffect(() => {
    getEmployee(1);
    setTitle('Notice Period Employees');
  }, [title]);

  console.log('employeeData', employee);

  return (
    <>
      <Helmet title={title} />
      <section className="content-area">
        <div className="row mt-3">
          {employee &&
            employee.map((emp) => (
              <Col className="col-md-4">
                <Card>
                  <Card.Body>
                    <Row>
                      <Col className="col-md-4">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image
                            className="card-img-top"
                            src="/images/edit-profile-img.png"
                            alt="Card image cap"
                          />
                          {emp.on_notice_period === true && (
                            <span className="np-sup">NP</span>
                          )}
                        </span>
                      </Col>
                      <Col className="col-md-8">
                        <Card.Title>{emp.name}</Card.Title>
                        <p className="card-text employee-details">
                          {emp.full_name}
                         <span> {emp.designation_name} </span>
                        </p>
                        <p className="text-primary confirmation-date">
                          {' '}
                          Relieving Date-{' '}
                          {emp.relieving_date
                            ? customFunctions.getDMYDate(emp.relieving_date)
                            : null}
                        </p>{' '}
                        <br />
                      </Col>
                    </Row>
                    <Card.Footer className="card-footer-view">
                      <h4 className="text-primary">SDMS{emp.emp_code}</h4>
                      <Button
                        size="sm"
                        className="pull-right"
                        onClick={() =>
                          history.push(`/employee-profile/${emp.id}`)
                        }
                      >
                        View
                      </Button>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </div>
        <Pagination
          totalItems={totalCount}
          current_page={currentPage}
          itemsPerPage={limit}
          onPageChange={(pageNo) => {
            getEmployee(pageNo);
          }}
        />
      </section>
    </>
  );
}

export default withRouter(NoticePeriodComponent);
