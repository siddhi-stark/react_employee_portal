import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { Image, Accordion, Card, Button } from 'react-bootstrap';
import FormSections from './filter.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function SelectedCandidateListing() {
  const handleActionCallback = () => {
    return (
      <>
        <a
          href="#"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // history.push('/add-technology-stack');
            // setModalShow(true);
            // setEmployeeId(id);
            // getRowData(1,index);
            // setAddButton(true);
            // setCntClearFilter(cntClearFilter + 1);
          }}
        >
          <Image src="/images/edit-button.svg" alt="Edit Employee" />
        </a>
      </>
    );
  };

  const handleResumeCallback = () => {
    return (
      <>
        <a
          href="#"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // history.push('/add-technology-stack');
            // setModalShow(true);
            // setEmployeeId(id);
            // getRowData(1,index);
            // setAddButton(true);
            // setCntClearFilter(cntClearFilter + 1);
          }}
        >
          <Image src="/images/dropdown-select.svg" alt="Edit File" />
        </a>
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'full_name',
      label: 'Applicant Name',
    },
    {
      id: 'email',
      label: 'Email ID',
    },
    {
      id: 'mobile',
      label: 'Contact No',
    },
    {
      id: 'resume',
      label: 'Resume',
      render: handleResumeCallback,
    },
    {
      id: 'Action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  const title = 'Employees List';

  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      limit,
      page,
      // ...filterList
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
    console.log(formValues);

    setFilterData(formValues);
  };

  const getTechnologyStack = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      technology_stack: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getTechnologyStack();
  }, []);

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return; // eslint-disable-line
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      position: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getPosition();
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
              <h4 className="text-primary mt-2 mb-2">Employees List</h4>
            </div>
          </Card.Header>
          <Card.Body>
            <CustomTable
              columns={columns}
              rows={rowData}
              tableClass="table-striped"
              showPagination={true}
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
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(SelectedCandidateListing);
