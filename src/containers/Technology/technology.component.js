import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button, Form, Row, Col, Image } from 'react-bootstrap';
import FormSections from './addTechnology.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';


const handleActionCallback = () => {
  return (
    <>
      <a
        href="/"
        className=""
      // onClick={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   setDesignationId(id);
      //   setDesignation(name);
      // }}
      >
        <Image src="/images/edit-button.svg" alt="Edit Technology" />
      </a>
      <a
        href="/"
        className="ml-2"
      // onClick={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   removeDesignation(id);
      // }}
      >
        <Image src="/images/delete.png" alt="Delete Technology" />
      </a>
    </>
  );
};

const columns = [{
  'id': 'id',
  'label': 'Sr.No',
},
{
  'id': 'name',
  'label': 'Technology',
},
{
  'id': 'action',
  'label': 'Action',
  render: handleActionCallback
},
];


function Technology() {

  // Declare variable 
  const [rowData, setRowData] = useState([])
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}) // eslint-disable-line

  const title = 'Employees List';

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];


  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);




  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.designationUrl}`;
    // const filterList = filterData && !customFunctions.checkIfEmpty(filterData, 'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      page,
      limit,
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData(data && data.data || []);
    } else {
      console.log('error', message)
    }
  }


  useEffect(() => {
    getRowData(1)
  }, [filterData])


  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);

    const { data } = await AuthApi.putDataToServer(Api.designationUrl, formValues);
    if (!data) {
      // show error
      return; // eslint-disable-line
    }
    // Perform success actions

  };


  // Get data for form
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);






  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Technology</h2>
        <Breadcrumb items={items} />
      </div>
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
                <Card.Body>
                  <Card.Title>
                    <Form>
                      {/* {filterErr && (
                        <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                          <div className="img-text">
                            <img src="/images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )} */}
                      <Row className="mt-3">
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <TextInput
                              inputClass="form-control"
                              // value={searchKeyword}
                              placeholder="search designation"
                            // onInputChange={(e) => {
                            //   setFilterErr('');
                            //   setSearchKeyword(e.target.value);
                            // }}
                            />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="filter-btn">
                            <Button
                              variant="primary"
                              type="submit"
                              className="ms-4"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="primary"
                              type="button"
                              className="ms-4"
                            // onClick={() => onClear()}
                            >
                              Clear
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Designation</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mt-3">
                <Col>
                  <StarkFormBuilder
                    containerClass=''
                    formHeaderClass=''
                    formSections={FormSections}
                    onFormSubmit={(formValues) => { submitForm(formValues); }}
                    options={options}
                    callbacks={{}}
                    defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={true} // eslint-disable-line
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons"
                    isStepForm={false}

                    onFormReset={() => {
                      console.log('form reset callback')
                    }}
                  />


                </Col>
                <Col>
                  <CustomTable
                    columns={columns}
                    rows={rowData}
                    showPagination={true} // eslint-disable-line
                    paginationProps={{
                      totalItems: totalCount,
                      itemsPerPage: limit,
                      activePage: currentPage,
                      onPageChange: (pageNo) => {
                        getRowData(pageNo);
                      }
                    }}
                    emptyRender={() => { return ('No record found.') }}
                  />

                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  )
}

export default withRouter(Technology);