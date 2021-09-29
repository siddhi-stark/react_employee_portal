import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import { Row, Col, Card, Button, Image } from 'react-bootstrap';
import FormSections from './EmployeeFilterSchema.json';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
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
  const [filterData, setFilterData] = useState({});
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [isShowLoader, setShowLoader] = useState(false);

  const history = useHistory();

  const getEmployee = async (pageNo = 1) => {
    setShowLoader(true);
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
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setShowLoader(false);
      setEmployee([...data.data]);

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
    const { data } = await AuthApi.getDataFromServer(`${Api.designationUrl}?type=all`);
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
        <div className="mt-5">
            <Card>
            <Card.Body>
             <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
            </div>  
            <hr/>
              <StarkFormBuilder
                containerClass=""
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
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                btnContainerClass="form-submit-buttons pull-right"
                isStepForm={false}
                onFormReset={() => {
                  setFilterData({});
                }}
              />
            </Card.Body>
            </Card>
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
