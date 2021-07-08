import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button,Row, Col, Image } from 'react-bootstrap';
import FormSections from './addTechnology.json';
import FilterFormSections from './FilterTechnology.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function Technology() {

  // Declare variable 
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  // const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [technologyId, setTechnologyId] = useState('');
   const [itemsPerPage, setItemsPerPage] = useState(5);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);


  const title = 'Employees List';
  const limit = 5;
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];

  const handleActionCallback = ({index,name}) => {
    return (
      <>
        <a
          href="/"
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTechnologyId(index);
            updateDefaultValues({name})
          }}
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
    'id': 'index',
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

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeStackUrl}`;
    // const filterList = filterData && !customFunctions.checkIfEmpty(filterData, 'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      // setLimit(data.paginator.limit);
        setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });


      setRowData(data && data.data || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

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

    const postData = {
      name: formValues.name
    }

    console.log('postData',postData);

    const payload = customFunctions.cleanObject(postData);
    const callback = 2
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = 2
      ? `${Api.employeeStackUrl}${2}/`
      : Api.employeeStackUrl;
 const { data } = await callback(endPoint, payload);
    // const { data } = await AuthApi.postDataToServer(Api.employeeStackUrl, payload);
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
    data.data.map((dt) => {
      if (technologyId) {
        updateDefaultValues({ name: dt.name });
      }
      return dt;
    });
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

  // Submit Form
  const submitFilterForm = async (formValues) => {
    console.log(formValues);
    setFilterData(formValues);
  };

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
                    <StarkFormBuilder
                      containerClass=''
                      formHeaderClass=''
                      formSections={FilterFormSections}
                      onFormSubmit={(formValues) => { submitFilterForm(formValues); }}
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
                        console.log('form reset callback');
                      }}
                    />
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Technology</h4>
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
                      console.log('form reset callback');
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
                    emptyRender={() => { return ('No record found.'); }}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(Technology);