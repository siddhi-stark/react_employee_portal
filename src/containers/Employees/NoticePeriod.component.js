/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';
import Loader from '../../components/Loader/index';

function NoticePeriodComponent() {
  const [employee, setEmployee] = useState([]);
  const [title, setTitle] = useState('');
  const [totalCount, setTotalCount] = useState(9);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState('');
  const [options, updateOptions] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const history = useHistory();

  const getEmployee = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      limit,
      notice_period: 'True',
      page,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setShowLoader(false);
      setEmployee(data.data);
      setTotalCount(Number(data.paginator.total_count));
      setLimit(Number(data.paginator.limit));
      setCurrentPage(Number(data.paginator.current_page));
    }
  };

  useEffect(() => {
    setTitle('Notice Period Employees');
    getEmployee(1);
    getEmployeeName();
    getPosition();
  }, []);

  const getEmployeeName = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_dropdown=1`
    );

    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.full_name, value: op.id };
      });
    options.employee = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.position = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  return (
    <>
      <Helmet title={title} />
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="row mt-3 row-cols-1 row-cols-md-3 g-4 employee-grid-list">
          {employee &&
            employee.map((emp) => (
            console.log("emo-------------->",emp),
              <Col>
                <Card className="h-100">
                  <Card.Body>
                    <Row>
                      <Col className="col-md-4">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image
                            className="card-img-top"
                            src={
                              emp.profile_image_url
                                ? `${emp.profile_image_url}`
                                : `${Api.s3UrlnoProfile}`
                            }
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
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="col-md-12">
                        <p className="text-primary confirmation-date">
                          {emp.date_joined &&
                            `Joining Date- ${customFunctions.getDMYDate(
                              emp.date_joined
                            )}`}
                          {emp.date_joined && <br />}
                          {emp.confirmation_date &&
                            `Confirmation Date- ${customFunctions.getDMYDate(
                              emp.confirmation_date
                            )}`}
                          {emp.confirmation_date && <br />}
                          {emp.relieved === false ?
                            `Expected Relieving Date- ${customFunctions.getDMYDate(
                              emp.last_working_date
                            )}` : `Relieving Date-${customFunctions.getDMYDate(emp.relieving_date)}`}
                          {emp.relieving_date && <br />}
                        </p>{' '}
                        <br />
                      </Col>
                    </Row>
                  </Card.Body>
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
        {totalCount < 1 && <p className="text-center"> No records found</p>}
      </section>
    </>
  );
}

export default withRouter(NoticePeriodComponent);
