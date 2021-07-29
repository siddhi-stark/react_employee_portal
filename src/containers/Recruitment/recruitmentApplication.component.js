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
  const [title,setTitle] = useState('');
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
  
  const handleActionCallback = ({id}) => {
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
          <Image src="/images/edit-button.svg" />
        </a>
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
    },
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
      label: 'Applicant Name',
    },
    {
      id: 'applied_for_name',
      label: 'Application For Position',
    },
    {
      id: 'techstacks',
      label: 'Technology',
    },
    {
      id: 'total_exp',
      label: 'Total Experience',
    },
    {
      id: 'notice_period',
      label: 'Notice Period',
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
      id: 'education',
      label: 'Education',
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
    
    const endPoint =  (Number(group) === 4) ? `${Api.interviewUrl}` : `${Api.applicantsUrl}`;
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
    console.log('data',data);

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
              ids: selectedIds
            }
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
      } 

const handleChangeInactiveStatus = async (selectedIds) => {
          if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
            const params = {
              status: 6,
              ids: selectedIds
            }
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
      } 


  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues,'----',status);
    let payload = {};
    
    if(formValues) {
      payload = {
        keyword: formValues.keyword ? formValues.keyword:'',
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
                   {Number(group) === 4 ? '' : 'Add New'}
                </a>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div>
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
            <div>
              <Button
                variant="primary"
                className="mb-2"
                onClick={() => {
                  setFilterData();
                }}
              >
                All
              </Button>
              <Button
                variant="primary"
                className="ml-2 mb-2"
                onClick={() => {
                  setStatus(1);
                }}
              >
                Selected
              </Button>
                {!(Number(group) === 4) && (
                <>
                  <Button
                    variant="primary"
                    className="ml-2 mb-2"
                    onClick={() => {
                      setStatus(2);
                    }}
                  >
                    Shortlisted
                  </Button>
                  <Button
                    variant="primary"
                    className="ml-2 mb-2"
                    onClick={() => {
                      setStatus(3);
                    }}
                  >
                    Rejected
                  </Button>
                  <Button
                    variant="primary"
                    className="ml-2 mb-2"
                    onClick={() => {
                      setStatus(4);
                    }}
                  >
                    Offer Send
                  </Button>
                </>
              )}
            </div>
             <CustomTable
    columns={columns}
    rows={rowData}
bulkActions={Number(group) === 5 ? [{'actionTitle' : 'Shortlisted','actionCallback' : handleChangeActiveStatus},{'actionTitle' : 'Declined','actionCallback' : handleChangeInactiveStatus},] : ''} 
showPagination={true} 
paginationProps={{
            totalItems: totalCount,
            itemsPerPage: limit,
            activePage: currentPage,
            onPageChange: (pageNo) => {
              getRowData(pageNo);
            }
          }} 
showCheckbox={true} 
emptyRender={()=>{ return ('No record found.')}} 
/>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(RecruitmentApplicationComponent);