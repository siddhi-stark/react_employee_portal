import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button, Row, Image } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './EmployeeTechFilter.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function EmployeeTechListing() {
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  // const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [toggle, setToggle] = useState(false);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  const limit = 10;

  const title = 'Employees List';

  const history = useHistory();
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee Technology Stack' },
  ];

  const handleActionCallback = ({id}) => {
    return (
      <>
        <a
          href="#"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-technology-stack/${id}`);
            // setModalShow(true);
            // setEmployeeId(id);
            // getRowData(1,index);
            // setAddButton(true);
            // setCntClearFilter(cntClearFilter + 1);
          }}
        >
          <Image src="/images/edit-button.svg" alt="Edit Designation" />
        </a>
      </>
    );
  };

  const columns = [
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'full_name',
      label: 'EmployeeName',
    },
    {
      id: 'techstacks',
      label: 'Technology',
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    let id;
    console.log('filterData', filterData.employee);
    if (
      toggle &&
      filterData &&
      filterData.employee &&
      filterData.employee.value
    ) {
      id = filterData.employee.value;
    }
    const endPoint = `${Api.employeeStack}`;
    const params = {
      id,
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
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
    console.log('formValues', formValues);
    setToggle(true);
    setFilterData(formValues);
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      employee: dpOptions,
    };
    updateOptions(allOptions);
  };

   const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technology = dpOptions;
    const allOptions = options;
    await updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployee();
    getTechnology();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">
          Employee Technology Stack
        </h2>
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
                      containerClass=""
                      formHeaderClass=""
                      formSections={FormSections}
                      onFormSubmit={(formValues) => {
                        submitForm(formValues);
                      }}
                      options={options}
                      callbacks={{}}
                      defaultFormValues={defaultValues}
                      currentUser={currentUser}
                      submitBtnText="Submit"
                      showResetBtn={true}
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
                <h4 className="text-primary mt-2 mb-2">Employees</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-technology-stack');
                    }}
                    className="btn-link"
                  >
                    Add Technology
                  </a>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <CustomTable
                  columns={columns}
                  rows={rowData}
                  tableClass="table-striped"
                  showPagination={true} // eslint-disable-line
                  paginationProps={{
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    activePage: currentPage,
                    onPageChange: (pageNo) => {
                      getRowData(pageNo);
                    },
                  }}
                  emptyRender={() => {
                    return 'No record found.';
                  }}
                />
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}
export default withRouter(EmployeeTechListing);
