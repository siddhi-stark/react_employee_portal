import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button, Row, Col, Image } from 'react-bootstrap';
import FormSections from './formschema.json';
import RecruitmentFilterFormSections from './recruitmentFilterformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentFileComponent() {
  const title = 'Batch Upload';

  const items = [{ to: '/', label: 'Home' }, { label: 'Batch Upload' }];

  // Variable declarations Filter form
  const [defaultFilterValues, updateDefaultFilterValues] = useState({}); // eslint-disable-line
  const [filterOptions, updateFilterOptions] = useState({}); //eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [show, setShow] = useState(false);

  const formSchema = [...RecruitmentFilterFormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });
  // Declare variable table
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  let defaultFilterOptions = {};
  // Form

  // Variable declarations
  // const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [fileValue, setFileValue] = useState();

  const handleActionCallback = () => {
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
          <Image src="/images/edit-button.svg" alt="Edit File" />
        </a>
      </>
    );
  };

  const handleResumeCallback = () => {
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
          <Image src="/images/download-file.svg" alt="Download File" />
        </a>
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Id',
      isDisplay: false,
    },
    {
      id: 'name',
      label: 'Applicant Name',
    },
    {
      id: 'email',
      label: 'Email Id',
    },
    {
      id: 'mobile',
      label: 'Contact No',
    },
    {
      id: 'locality',
      label: 'Locality',
    },
    {
      id: 'current_ctc',
      label: 'Current CTC',
    },
    {
      id: 'expected_ctc',
      label: 'Expected CTC',
    },
    {
      id: 'notice_period',
      label: 'Notice Period',
    },
    {
      id: 'total_exp',
      label: 'Total Exp',
    },
    {
      id: 'rel_exp',
      label: 'Relevant Exp',
    },
    {
      id: 'resume_source',
      label: 'Resume Source',
    },
    {
      id: 'reason_job_change',
      label: 'Reason Job Change',
    },
    {
      id: 'gender_name',
      label: 'Gender',
    },
  
    {
      id: 'created_at',
      label: 'Date',
      render: ({ created_at }) => { // eslint-disable-line
        return (
          <>
            <span>{customFunctions.getFormattedDate(created_at)}</span>
          </>
        );
      },
    },
    {
      id: 'resume',
      label: 'Download Resume',
      render: handleResumeCallback,
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form Filter
  const submitFilterForm = async (formValues) => {
      const  payload = {
        technology_id: formValues.technology
          ? formValues.technology.value
          : '',
        designation_id: formValues.position
          ? formValues.position.value
          : '',
        start_date: formValues.start_date
          ? customFunctions.getDate(formValues.start_date)
          : '',
        end_date: formValues.end_date
          ? customFunctions.getDate(formValues.end_date)
          : '',
      };
      
    setFilterData(payload);
    setShow(true);
  };

  const getTechnology = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = []; 
    data.data.map((op) => {
      dpOptions.push ({ label: op.name, value: op.id });
      return op;
    });
     const allOptions = {
      ...filterOptions,
      ...defaultFilterOptions,
      technology: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateFilterOptions(allOptions);
  };

  useEffect(() => {
    getTechnology();
  }, []); 

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = []; 
    data.data.map((op) => {
      dpOptions.push ({ label: op.name, value: op.id });
      return op;
    });
     const allOptions = {
      ...filterOptions,
      ...defaultFilterOptions,
      position: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateFilterOptions(allOptions);
  };

  useEffect(() => {
    getDesignation();
  }, []);

  // const getPosition = async () => {
  //   const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
  //   if (!data) {
  //     // show error
  //     return;
  //   }
  //   const dpOptions = [];
  //   data.data.map((op) => {
  //     // Change appropriate keys
  //     dpOptions.push({ label: op.full_name, value: op.id });
  //     return op;
  //   });
  //   const allOptions = {
  //     ...filterOptions,
  //     ...defaultFilterOptions,
  //     position: dpOptions,
  //   };
  //   defaultFilterOptions = { ...allOptions };
  //   updateFilterOptions(allOptions);
  // };

  // useEffect(() => {
  //   getPosition();
  // }, []);

  // table method
  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.applicantsUrl}`;
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

  // Upload Form

  // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);
    console.log('formValues.file_name[0]',formValues.file_name[0]);
    const csvData = fileValue[0];
    const  payload = {}
    payload.applied_for = formValues.applied_for
          ? formValues.applied_for.value
          : ''
    payload.file_name = csvData;
    console.log('payload',payload);
    const { data, message } = await AuthApi.postDataToServer(
      Api.batchUploadUrl,
      payload
    );

    if (!data) {
      swal(message, '', 'error');
    }
    swal(data && data.message[0], '', 'success', {
      closeOnClickOutside: false,
      allowOutsideClick: false,
      buttons: false,
      timer: 2000,
    }).then(() => {
      swal.close();
    });
    // Perform success actions
  };

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      applied_for: dpOptions,
    };
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Batch Upload</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary m-0">Batch Upload</h4>
              </div>
            </Card.Header>
            <Card.Title>
              <Row>
                <Col>
                  <StarkFormBuilder
                    containerClass=""
                    formHeaderClass=""
                    formSections={FormSections}
                    formHeading="Upload Form"
                    onFormSubmit={(formValues) => {
                      submitForm(formValues);
                    }}
                    options={options}
                    callbacks={{
                       getFileCallback: (value) => {
                         setFileValue(value);
                         console.log('value',value);
                  },
                    }}
                    // defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={false}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons"
                    isStepForm={false}
                    onFormReset={() => {
                      console.log('form reset callback');
                    }}
                  />
                </Col>
                <Col className="mt-4">
                  <div title="Download CSV File">
                    <Image
                      src="/images/download.svg"
                      alt="Download File"
                    />
                  </div>
                </Col>
              </Row>
            </Card.Title>
          </Card>
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary mt-2 mb-2">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <>
                  <StarkFormBuilder
                    containerClass=""
                    formHeaderClass=""
                    formSections={RecruitmentFilterFormSections}
                    formHeading="Filter"
                    onFormSubmit={(formValues) => {
                      submitFilterForm(formValues);
                    }}
                    options={filterOptions}
                    callbacks={{}}
                    defaultFormValues={defaultFilterValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={true}
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons pull-right mb-4"
                    isStepForm={false}
                    onFormReset={() => {
                      setFilterData();
                    }}
                  />

                  {show && (
                    <div className="mt-5">
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
                          },
                        }}
                        emptyRender={() => {
                          return 'No record found.';
                        }}
                      />
                    </div>
                  )}
                </>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </section>
    </>
  );
}

export default withRouter(RecruitmentFileComponent);
