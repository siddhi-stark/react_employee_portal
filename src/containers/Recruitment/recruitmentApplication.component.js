import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image, Button, Accordion } from 'react-bootstrap';
import swal from 'sweetalert';
import FormSections from './applicationformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentApplicationComponent() {
  // const title = 'Recruitment';
  const group = customFunctions.getLocalStorage('group');
  const items = [{ to: '/', label: 'Home' }, { label: 'Recruitment' }];
  const history = useHistory();

  // Variable declarations Filter Form
  // const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [activeMenu, setActiveMenu] = useState('all');
  const [title, setTitle] = useState('');
  let filterOptions = {};

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    return sectionData;
  });

  const handleActionCallback = ({ id, status_name }) => { //eslint-disable-line
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/applications/${id}`);

            // history.push('/edit-employee');
          }}
        >
          {Number(group) === 5 ? (
            <Image
              src={ status_name === ('shortlisted' || 'selected') ? '/images/edit-button.svg' : '' } // eslint-disable-line
            />
          ) : (
            <Image src="/images/edit-button.svg" />
          )}
        </a>
      </>
    );
  };

  const handleResumeCallback = (resume) => {
    return (
      <>
        <a href={resume.resume} className="pl-2" target="_Blank">
          <Image src="/images/download-file.svg" />
        </a>
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false,
    },
    {
      id: `{{'int_date'} ? 'int_date': 'created_at'}`, // eslint-disable-line
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
      id: 'name',
      label: 'Name',
    },
    {
      id: 'applied_for_name',
      label: 'Position',
    },
    {
      id: 'tech_stack_name',
      label: 'Technology',
    },
    {
      id: 'total_exp',
      label: 'Experence',
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
      id: 'resume',
      label: 'Resume',
      render: handleResumeCallback,
    },
    {
      id: 'status_name',
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
    
    const endPoint = `${Api.applicantsUrl}`;

    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      page,
      limit,
      sort_direction: 'descending',
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.no = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Recruitment');
  }, [filterData]);

  // filter Form

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const handleChangeActiveStatus = async (selectedIds) => {
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 2,
        ids: selectedIds,
      };
      const successHandle = (e) => {
        swal(e && e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          swal.close();
          getRowData(1);
        });
      };
      const errorHandle = (e) => {
        swal(e && e.message[0], '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          swal.close();
          getRowData(1);
        });
      };
      await customFunctions.changeStatus(
        `${Api.bulkStatusUrl}`,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  const handleChangeInactiveStatus = async (selectedIds) => {
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 6,
        ids: selectedIds,
      };
      const successHandle = (e) => {
        swal(e && e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          swal.close();
          getRowData(1);
        });
      };
      const errorHandle = (e) => {
        swal(e && e.message[0], '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          swal.close();
          getRowData(1);
        });
      };
      await customFunctions.changeStatus(
        `${Api.bulkStatusUrl}`,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    let payload = {};

    if (formValues) {
      payload = {
        keyword: formValues.keyword ? formValues.keyword : '',
        designation_id: formValues.designation_id
          ? formValues.designation_id.value
          : '',
        start_date: formValues.start_date
          ? customFunctions.getDate(formValues.start_date)
          : '',
        end_date: formValues.end_date
          ? customFunctions.getDate(formValues.end_date)
          : '',
      };
    }
    payload.status = status;
    setFilterData(payload);
  };

  useEffect(() => {
    submitForm();
  }, [status]);

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
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
      ...filterOptions,
      ...options,
      designation_id: dpOptions,
    };
    filterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getDesignation();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Recruitment</h2>
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
                  containerClass="select-options"
                  formHeaderClass=""
                  formSections={FormSections}
                  formHeading="Filter Form"
                  onFormSubmit={(formValues) => {
                    submitForm(formValues);
                  }}
                  options={options}
                  callbacks={{}}
                  // defaultFormValues={defaultValues}
                  currentUser={currentUser}
                  submitBtnText="Submit"
                  showResetBtn={true}
                  resetBtnText="Clear"
                  btnContainerClass="form-submit-buttons pull-right mb-3"
                  isStepForm={false}
                  onFormReset={() => {
                    setFilterData();
                  }}
                />
              </Card.Title>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">Recruitment</h4>
              <div className="d-flex align-items-center justify-content-end">
                <a
                  href="#"
                  onClick={() => {
                    history.push('/applications');
                  }}
                  className="btn-link"
                >
                  {Number(group) === 4 ? '' : 'Add Applicant'}
                </a>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="text-end">
              {!(Number(group) === 4) && (
                <Button
                  variant="primary"
                  className="mb-2"
                  onClick={() => {
                    history.push('/batch-upload');
                  }}
                >
                  Bulk Upload
                </Button>
              )}
            </div>
            <div className="recruitment-links-wrapper">
              <a
                href="#"
                className={`mb-2 ${activeMenu === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMenu('all');
                  setFilterData();
                }}
              >
                All
              </a>
              <a
                href="#"
                className={`ml-2 mb-2 ${
                  activeMenu === 'selected' ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveMenu('selected');
                  setStatus(1);
                }}
              >
                Selected
              </a>
              {!(Number(group) === 4) && (
                <>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'Shortlisted' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('Shortlisted');
                      setStatus(2);
                    }}
                  >
                    Shortlisted
                  </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'Rejected' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('Rejected');
                      setStatus(3);
                    }}
                  >
                    Rejected
                  </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'Decline' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('Decline');
                      setStatus(6);
                    }}
                  >
                    Decline
                  </a>
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'Offer' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('Offer');
                      setStatus(4);
                    }}
                  >
                    Offer Send
                  </a>
                </>
              )}
            </div>
            <CustomTable
              tableContainerClass="mt-2"
              columns={columns}
              rows={rowData}
              bulkActions={
                Number(group) === 5
                  ? [
                      {
                        actionTitle: 'Shortlist',
                        actionCallback: handleChangeActiveStatus,
                      },
                      {
                        actionTitle: 'Decline',
                        actionCallback: handleChangeInactiveStatus,
                      },
                    ]
                  : ''
              }
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                },
              }}
              showCheckbox={Number(group) !== 4 ? true : false} //eslint-disable-line
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
