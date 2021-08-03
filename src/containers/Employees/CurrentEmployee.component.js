import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';

import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';

function CurrentEmployee() {

  const [employee, setEmployee] = useState([]);
  const [totalCount, setTotalCount] = useState(9);
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState('');

  const history = useHistory();
  // const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];

  const getEmployee = async (pageNo = 1) => {
    setEmployee([]);

    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      sort_by:'full_name',
      limit,
      page,

      // ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setEmployee([...data.data]);
      // setId(data.data.id);
     
      setTotalCount(Number(data.paginator.total_count));
      setLimit(Number(data.paginator.limit));
      setCurrentPage(Number(data.paginator.current_page));
      // console.log('data.paginator', data.paginator);
    }
  };

  useEffect(() => {
    setTitle('Current Employees');
    getEmployee(1);
  }, [title]);

  return (
    <>
     <Helmet title={title} />
      <section className="content-area">
               <div className="row mt-3 employee-grid-list">
                {employee &&
                  employee.map((emp) => (
                    <Col className="col-md-4 h-100">
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col className="col-md-4">
                              <span className="mini-stat-icon bg-purple mr-0 float-right">
                                <Image
                                  className="card-img-top"
                                  src={emp.profile_image_url ? `${emp.profile_image_url}` : `${Api.s3UrlnoProfile}`}
                                  alt="Card image cap"
                                />
                                {(emp.on_notice_period === true) && (
                                  <span className="np-sup">NP</span>
                                )}
                              </span>
                            </Col>
                            <Col className="col-md-8">
                              <Card.Title>{emp.name}</Card.Title>
                              <p className="card-text employee-details">
                                {emp.full_name}
                               <span> {emp.designation_name}</span>
                              </p>
                              <p className="text-primary confirmation-date">
                                {' '}
                                 {emp.confirmation_date && !emp.on_notice_period && `confirmation Date-`}
                                {emp.confirmation_date && !emp.on_notice_period &&
                                   customFunctions.getDMYDate(
                                      emp.confirmation_date
                                    )
                                 }
                                    {!emp.confirmation_date && emp.joined_date && !emp.on_notice_period && `Joining Date-`}
                                {!emp.confirmation_date && emp.joined_date && !emp.on_notice_period &&
                                   customFunctions.getDMYDate(
                                      emp.joined_date
                                    )
                                 }

                                  { emp.on_notice_period && emp.notice_period_date && `Relieving Date-`}
                                {emp.on_notice_period && emp.notice_period_date &&
                                   customFunctions.getDMYDate(
                                      emp.relieving_date
                                    )
                                 }

                              </p>{' '}
                              <br />
                            </Col>
                          </Row>
                          <Card.Footer className="card-footer-view">
                            <h4 className="text-primary">SDMS{emp.emp_code}</h4>
                            <Button
                              size="sm"
                              className="pull-right"
                              onClick={() => {
                                history.push(`/employee-profile/${emp.id}`);
                                localStorage.setItem(
                                  'employeeName',
                                  emp.full_name
                                );
                                customFunctions.setLocalStorage(
                                  'title',
                                  emp.designation_name
                                );
                                localStorage.setItem('candidateId', emp.id);
                              }}
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
              onPageChange = {(pageNo) => {
                getEmployee(pageNo);
              }}
            />
            </section>

    </>
  );
}

export default withRouter(CurrentEmployee);
