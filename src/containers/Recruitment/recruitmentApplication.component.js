import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter } from 'react-router-dom';
import { Card, Image, Button, Accordion } from 'react-bootstrap';
import FormSections from './applicationformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentApplicationComponent() {
  const title = 'Application';

  const items = [{ to: '/', label: 'Home' }, { label: 'Application' }];

  // Variable declarations Filter Form
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line

  const handleEducationCallback = (row) => {
    console.log('row', row.id);
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // history.push('/edit-employee');
          }}
        >
          Edit
        </a>
      </>
    );
  };

  const handleActionCallback = (row) => {
    console.log('row', row.id);
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // history.push('/edit-employee');
          }}
        >
          <Image src="/images/edit-button.svg" />
        </a>
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'no',
      label: 'Sr.No',
    },
    {
      id: 'Date',
      label: 'Date',
    },
    {
      id: 'applicantname',
      label: 'ApplicantName',
    },
    {
      id: 'position',
      label: 'ApplicationForPosition',
    },
    {
      id: 'technology',
      label: 'Technology',
    },
    {
      id: 'experience',
      label: 'Total Experience',
    },
    {
      id: 'noticeperiod',
      label: 'NoticePeriod',
    },
    {
      id: 'email',
      label: 'EmailId',
    },
    {
      id: 'mobile',
      label: 'ContactNo',
    },
    {
      id: 'education',
      label: 'Education',
      render: handleEducationCallback,
    },
    {
      id: 'status',
      label: 'Status',
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
    const endPoint = `${Api.timeSheetUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      page,
      limit,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  // filter Form

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues, updateDefaultValues);
    
    setFilterData(formValues);
      
  };
    
  const getDesignation = async () => {
    const {data} = await AuthApi.getDataFromServer(Api.designationUrl);
    if(!data) {
      // show error
      return;
    }
    
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({label: op.title, value: op.id});
      return op;
    });
    const allOptions = {
      ...options,
      designation: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getDesignation();
  }, []);
      

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Application</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
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
                  containerClass=''
                  formHeaderClass=''
                  formSections={FormSections}
                  formHeading="Filter Form"
                  onFormSubmit={(formValues) => {submitForm(formValues);}}
                  options={options}
                  callbacks={{}}
                  defaultFormValues={defaultValues}
                  currentUser={currentUser}
                  submitBtnText="Submit"
                  showResetBtn={true}
                  resetBtnText="Clear"
                  btnContainerClass="form-submit-buttons pull-right mb-3"
                  isStepForm={false}
                  
                  onFormReset={() => {
                    console.log('form reset callback')
                  }}
                />
              </Card.Title>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">Application</h4>
              <div className="d-flex align-items-center justify-content-end">
                <a href="#" onClick={() => {}} className="btn-link">
                  Add New
                </a>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Button variant="primary" className="mb-2">All</Button>
            <Button variant="primary" className="ml-2 mb-2">Selected</Button>
            <Button variant="primary" className="ml-2 mb-2">Shortlisted</Button>
            <Button variant="primary" className="ml-2 mb-2">Rejected</Button>
            <Button variant="primary" className="ml-2 mb-2">Offer Send</Button>
            <CustomTable
              columns={columns}
              rows={rowData}
              role={5}
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
      </section>
    </>
  );
}

export default withRouter(RecruitmentApplicationComponent);
