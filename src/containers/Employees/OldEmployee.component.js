/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
// import StarkFormBuilder from 'stark-form-builder';
import { Row, Col, Card, Button, Image } from 'react-bootstrap';
// import FormSections from './EmployeeFilterSchema.json';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';
import Loader from '../../components/Loader/index';
import SelectAsyncPaginate from '../../components/ReactSelectPagination/SelectAsyncPaginate';

function OldEmployee() {
  const [employee, setEmployee] = useState([]);
  const [title, setTitle] = useState('');
  const [totalCount, setTotalCount] = useState(9);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState('');
  const [options, updateOptions] = useState({});
  const [defaultValues, updateDefaultValues] = useState({}); //eslint-disable-line
  const [isShowLoader, setShowLoader] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [employeeArr, setEmployeeArr] = useState('');
  const [empClear, setEmpClear] = useState();
  console.log('empClear', empClear);
  const [positionArr, setPositionArr] = useState('');
  const [position, setPosition] = useState('');
  const [count, forceUpdate] = useState(0);
  const [filterErr, setFilterErr] = useState('');
  const history = useHistory();
  console.log('position', position);

  const getEmployee = async (pageNo = 1, filter) => {
    // setShowLoader(true);
    setEmployee([]);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      limit,
      old_employee: 'True',
      page,
      // designation_id: position ? position.value : '',
      //  user_id:
      //     filterData && filterData.employee ? filterData.employee.value : '',
      // user_id: empClear ? empClear.id : '',
    };
    if (filter == 'filter') {
      params.user_id = empClear?.id;
      params.designation_id = position?.value
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      console.log('data--------------', data);
      setShowLoader(false);
      setEmployee([...data.data]);
      setTotalCount(Number(data.paginator.total_count));
      setLimit(Number(data.paginator.limit));
      setCurrentPage(Number(data.paginator.current_page));
    }
  };

  const filterSearch = (e) => {
    let filterSearchErr = '';
    let isValid = true;
    if (
      customFunctions.checkIfEmpty(empClear) &&
      customFunctions.checkIfEmpty(position)
      // customFunctions.checkIfEmpty(designationValues)
    ) {
      filterSearchErr = 'Please select name or select position';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getEmployee(1, 'filter');
    }
  };

  useEffect(() => {
    setTitle('Old Employees');
    getEmployee(1);
    getEmployeeName();
    getPosition();
  }, []);
  // useEffect(() => {
  //   getEmployeeArray();
  // }, []);

  // const getEmployeeArray = async () => {
  //   setShowLoader(true);
  //   const { data, message } = await AuthApi.getDataFromServer(
  //     `${Api.employeeUrl}`
  //   );
  //   console.log('dataa-------->>>>', data);
  // };

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
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!data) {
      return;
    }

    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });
    setPositionArr(dpOptions);
    // await updateOptions({ ...allOptions });
  };

  const isClear = () => {
    console.log('isclearrr');
    setFilterErr('');
    setPosition('');
    setEmployee([]);
    setEmpClear('');
    forceUpdate(count + 1);
    getEmployeeName();
    getEmployee();
    // onClearemp();
  };

  return (
    <>
      <Helmet title={title} />
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section>
        <Card className="mt-3">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
            </div>
            {filterErr && (
              <div className="p-3  bg-danger text-white bg-danger-main table-red-bg mb-3">
                <div className="img-text">
                  <img
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => isClear(e)}
                    src="/images/fail.svg"
                    alt="Success"
                  />{' '}
                  {filterErr}
                </div>
              </div>
            )}
            <div>
              <Row className="mt-3">
                <Col sm={6}>
                  <SelectAsyncPaginate
                    id="degignation"
                    // label="Select employee"
                    // asterisk="*"
                    apiname={'employeeUrl'}
                    endpoint={`${Api.employeeUrl}?old_employee=True&page=1&limit=10`}
                    placeholder="Select Employee"
                    // options={designationValues}
                    value={empClear}
                    // disabled={pageType === 'view'}
                    onSelectChange={(select) => {
                      setEmpClear(select);
                    }}
                    isClearable={true}
                    // errorMessage={validator.current.message(
                    //   'Designation',
                    //   joiningDetails.designation,
                    //   'required'
                    // )}
                  />
                </Col>
                <Col sm={6}>
                  <DropdownInput
                    id="degignation"
                    // label="Select employee"
                    // asterisk="*"
                    placeholder="Select Position"
                    options={positionArr}
                    defaultValue={position}
                    // disabled={pageType === 'view'}
                    onSelectHandler={(select) => {
                      setPosition(select);
                      // setPosition(positionArr)
                    }}
                    isClearable={true}
                    // errorMessage={validator.current.message(
                    //   'Designation',
                    //   joiningDetails.designation,
                    //   'required'
                    // )}
                  />
                </Col>
                <Row>
                  <Col>
                    <Button
                      variant="primary"
                      className="ms-4"
                      onClick={() => {
                        filterSearch();
                      }}
                    >
                      Apply
                    </Button>

                    <Button
                      variant="secondary"
                      className="ms-4"
                      onClick={() => {
                        isClear();
                      }}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </section>

      <section className="content-area">
        <div className="row mt-3 row-cols-1 row-cols-md-3 g-4 employee-grid-list">
          {employee &&
            employee.map((emp) => (
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
                          {emp.relieving_date &&
                            `Relieving Date- ${customFunctions.getDMYDate(
                              emp.relieving_date
                            )}`}
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

export default withRouter(OldEmployee);
