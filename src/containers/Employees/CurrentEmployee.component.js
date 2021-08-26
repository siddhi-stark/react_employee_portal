import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Row, Col, Card, Button, Image, Accordion } from 'react-bootstrap';
import FormSections from './EmployeeFilterSchema.json';
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
  const [options, updateOptions] = useState({});
  // const [currentUser, updateCurrentUser] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line

  const history = useHistory();
  // const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];

  const getEmployee = async (pageNo = 1) => {
    setEmployee([]);

    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      sort_by: 'full_name',
      limit,
      page,
      designation_id:
        filterData && filterData.position ? filterData.position.value : '',
      user_id:
        filterData && filterData.employee ? filterData.employee.value : '',
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
    }
  };

  useEffect(() => {
    setTitle('Current Employees');
    getEmployee(1);
    getEmployeeName();
    getPosition();
  }, [filterData]);

  // Submit Form
  const submitForm = async (formValues) => {
    setFilterData(formValues); //eslint-disable-line
  };

  const getEmployeeName = async () => {
    // const id = props.match.params.stackId;
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
    // const id = props.match.params.stackId;
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
    if (!data) {
      // show error
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
      <section className="content-area">
        <div className="mt-5">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary m-0">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>

              <Accordion.Collapse eventKey="1">
                <Card.Title>
                  <StarkFormBuilder
                    containerClass="mt-5"
                    formHeaderClass=""
                    formSections={FormSections}
                    formHeading="filter form"
                    onFormSubmit={(formValues) => {
                      submitForm(formValues);
                    }}
                    options={options}
                    callbacks={{}}
                    defaultFormValues={defaultValues}
                    // currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={true}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons pull-right mb-3"
                    isStepForm={false}
                    onFormReset={() => {
                      setFilterData({});
                    }}
                  />
                </Card.Title>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
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
                          <span> {emp.designation_name}</span>
                        </p>
                        <p className="text-primary confirmation-date">
                          {' '}
                          {emp.confirmation_date &&
                            !emp.on_notice_period &&
                            `confirmation Date-`}
                          {emp.confirmation_date &&
                            !emp.on_notice_period &&
                            customFunctions.getDMYDate(emp.confirmation_date)}
                          {!emp.confirmation_date &&
                            emp.date_joined &&
                            !emp.on_notice_period &&
                            `Joining Date-`}
                          {!emp.confirmation_date &&
                            emp.date_joined &&
                            !emp.on_notice_period &&
                            customFunctions.getDMYDate(emp.date_joined)}
                          {emp.on_notice_period &&
                            emp.notice_period_date &&
                            `Relieving Date-`}
                          {emp.on_notice_period &&
                            emp.notice_period_date &&
                            customFunctions.getDMYDate(emp.relieving_date)}
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
                          localStorage.setItem('employeeName', emp.full_name);
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
          onPageChange={(pageNo) => {
            getEmployee(pageNo);
          }}
        />
        {(totalCount < 1 ) && (
        <p className="text-center"> No records found</p>
      )}
      </section>
    </>
  );
}

export default withRouter(CurrentEmployee);
