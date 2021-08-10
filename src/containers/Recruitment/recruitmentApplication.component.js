import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image, Button, Accordion } from 'react-bootstrap';
import FormSections from './applicationformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import AddNote from './AddNote.component';


function RecruitmentApplicationComponent() {
  // const title = 'Recruitment';
  const group = customFunctions.getLocalStorage('group');
  const items = [{ to: '/', label: 'Home' }, { label: 'Recruitment' }];
  const history = useHistory();

  // Variable declarations Filter Form
  // const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [modalShow, setModalShow] = useState(false);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [activeMenu, setActiveMenu] = useState('all');
  const [title, setTitle] = useState('');
  const [statusId, setStatusId] = useState('');
  const [note,setNote] = useState('');
  const [statusData, setStatusData] = useState('');
  // const [statusLabel,setStatusLabel] = useState('');
  // const [selectedStatusOption,setSelectedStatusOption] = useState(null);
  let filterOptions = {};


   const ApplicantStatus = [
    {
      id: 2,
      value: 'Shortlisted',
      label: 'shortlisted',
    },
    {
      id: 6,
      value: 'Declined',
      label: 'declined',
    },
    
    {
      id: 4,
      value: 'Pending',
      label: 'pending',
    }
  ];

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    if(Number(group) !== 6) {
      console.log('roleee');
      if(sectionData.name === 'role_id') {
        sectionData.disabled = true;
      }
    }
    return sectionData;
  });

  const handleActionCallback = ({ id, status_name,name,applied_for_name,notes }) => { //eslint-disable-line
    return (
      <>
      {(status_name !== 'declined') ? ( //eslint-disable-line

        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/applications/${id}`, {
              statusObj: status_name,
            });

            // history.push('/edit-employee');
          }}
        >
            <Image src="/images/edit-button.svg" />
         


        </a>
        ) : (
         <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setNote(notes);
            customFunctions.setLocalStorage('isClicked','true');
            setModalShow(true);

          }}
        >
           <Image src="/images/notes.svg" />
         


        </a>
        ) }
        { (Number(group) === 4 || status_name === 'pending' || status_name === 'shortlisted' || status_name === 'reject' || status_name === 'offered' || status_name === 'declined' || status_name === 'rejected') ? ( //eslint-disable-line

       ''
        ) : 
 <a
        href="/"
        className="p-r-2 text-info ms-3"
        onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        history.push('/generate-offerletter');
        customFunctions.setLocalStorage('applicantName',name);
        customFunctions.setLocalStorage('designation',applied_for_name);
        }}
        >
        Send Offer
        </a>
         }
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

  const getStatusId = (val) => {
    const data = ApplicantStatus.filter((i) => i.label === val);
    return data.length > 0 ? data[0] : {};

  }
  const handleStatus = (status_name) => { // eslint-disable-line
    return(
      <>
      {(status_name.status_name === 'pending' && Number(group) === 5) ? ( // eslint-disable-line

      <DropdownInput
                  asterisk="*"
                  options={getDepartment()}
                  placeholder="Select status"
                  defaultValue={status_name.status_name ? getStatusId(status_name.status_name)  : {}}
                  onSelectHandler={(select) => {
                    // setSelectedStatusOption(select);
                    // setStatusLabel(select.label);
                    // onStatusClick(select,status_name.id,status_name);
                     setStatusId(status_name.id); 
                    // {select.label === 'decined'}
                    {(select.label === 'declined' || select.label === 'shortlisted') ? setModalShow(true) : ''} //eslint-disable-line
                     // setModalShow(true);
                     setStatusData(select);
                  }}
                  // errorMessage={validator.message(
                  //   'Designation',
                  //   selectedDesignationOption,
                  //   'required'
                  // )}
                />
        ): (<span>{status_name.status_name}</span>)}

      </>
      )
  }


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
            <span>{customFunctions.getNewFormattedDate(created_at)}</span>
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
      id: 'notes',
      label: 'Note',
      isDisplay: false
    },
    
    
    {
      id: 'resume',
      label: 'Resume',
      render: handleResumeCallback,
    },
    {
      id: 'status_name',
      label: 'Status',
      render: handleStatus,
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];


  //  const onStatusClick = async (statusData,statusId,status_name) => { //eslint-disable-line
  //   const postData = {
  //     ids:[statusId],
  //     status: statusData.label === 'declined' ? 6 : 2
  //   }
  //   // setStatusLabel(status_name.status_name);

  //   const { data } = await AuthApi.putDataToServer(
  //     `${Api.bulkStatusUrl}`,
  //     postData
  //   );
  //   if(data) {
  //      swal({
  //       title: data.message[0],
  //       icon: 'success',
  //     })
  //       .then(okAction => {
  //         if (okAction) {
  //           getRowData(currentPage);
  //           if(postData.status === 6 || statusData.label === 'shortlisted'){ setStatusId(statusId); setModalShow(true); }
  //         }
  //       });
  //   }
  // };


const getDepartment = () => {
    if (!ApplicantStatus) return [];
    const depart = [];
    ApplicantStatus.map((dep) => {
      return depart.push({
        label: dep.label,
        id: dep.id,
        value: dep.value,
      });
    });
    return depart;
  };

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
    getDepartment();
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

  

  // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);
    let payload = {};

    if (formValues) {
      payload = {
        keyword: formValues.keyword ? formValues.keyword : '',
        designation_id: formValues.designation_id
          ? formValues.designation_id.value
          : '',
        technology_stack_id: formValues.technology_stack_id ? 
        formValues.technology_stack_id.value
        : '', 
        start_date: formValues.start_date
          ? customFunctions.getDate(formValues.start_date)
          : '',
        end_date: formValues.end_date
          ? customFunctions.getDate(formValues.end_date)
          : '',
        created_by_id: formValues.role_id
          ? formValues.role_id.value
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

   const getHrName = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.teamUrl}?type=all`
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
      role_id: dpOptions,
    };
    filterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  const getTechnology = async () => {
      // const id = props.match.params.stackId;
    const {data} = await AuthApi.getDataFromServer(Api.employeeStackUrl);
    if(!data) {
      // show error
      return;
    }
    
 const dpOptions = await data && data.data.length > 0 && data.data.map((op) => {
      return { label: op.name, value: op.id };
    });

    options.technology_stack_id = dpOptions;
    const allOptions = options;
    await updateOptions({...allOptions});

  }  


  useEffect(() => {
    getHrName();
    getDesignation();
    getTechnology();
  }, []);

  const getApplicantListing = () => {
    getRowData(currentPage);
  }

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
                  <a
                    href="#"
                    className={`ml-2 mb-2 ${
                      activeMenu === 'Pending' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveMenu('Pending');
                      setStatus(5);
                    }}
                  >
                    Pending
                  </a>
                </>
              )}
            </div>
            <CustomTable
              tableContainerClass="mt-2"
              columns={columns}
              rows={rowData}
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                },
              }}
              // showCheckbox={Number(group) !== 4 ? true : false} //eslint-disable-line
              emptyRender={() => {
                return 'No record found.';
              }}
            />
          </Card.Body>
        </Card>
      </section>
      {modalShow && (
        <AddNote
         show={modalShow}
         statusId={statusId}
         statusData={statusData}
         note={note}
         handleModalCLose={(e) => setModalShow(e)}
          onStatusUpdate={() => {
            getApplicantListing()
          }}
         />
        )}
    </>
  );
}

export default withRouter(RecruitmentApplicationComponent);
