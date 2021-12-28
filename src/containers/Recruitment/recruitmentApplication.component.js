import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Image, Button } from 'react-bootstrap';
import FormSections from './applicationformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import AddNote from './AddNote.component';
import Loader from '../../components/Loader/index';

function RecruitmentApplicationComponent() {
  const group = customFunctions.getLocalStorage('group');
  const items = [{ to: '/', label: 'Home' }, { label: 'Recruitment' }];
  const history = useHistory();

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
  const [note, setNote] = useState('');
  const [statusData, setStatusData] = useState('');
  const [allData, setAllData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);

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
      isdisabled: true,
    },
  ];

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    if (Number(group) !== 6 && Number(group) !== 1) {
      if (sectionData.name === 'role_id') {
        sectionData.disabled = true;
      }
    }
    return sectionData;
  });

  const handleActionCallback = ({
    id,
    status_name,
    notes,
  }) => {

    return (
      <>
        {status_name !== 'declined' ? (
          <a
            href="/"
            className="pl-2"
            title="Edit Applicant"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push(`/applications/${id}`, {
                statusObj: status_name,
              });
            }}
          >
            <Image src="/images/edit-button.svg" />
          </a>
        ) : (
          <a
            href="/"
            className="pl-2"
            title="Show Note"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNote(notes);
              customFunctions.setLocalStorage('isClicked', 'true');
              setModalShow(true);
            }}
          >
            <Image src="/images/notes.svg" />
          </a>
        )}
        {Number(group) === 4 ||
        Number(group) === 3 ||
        status_name === 'pending' ||
        status_name === 'shortlisted' ||
        status_name === 'reject' ||
        status_name === 'declined' ||
        status_name === 'rejected' ? ( //eslint-disable-line
          ''
        ) : (
          <a
            href="/"
            className="p-r-2 text-info ms-2"
            title="Send Offer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('/generate-offerletter');
              customFunctions.setLocalStorage('applicantId', id);
              rowData &&
                rowData.map((dt) => {
                  if (id === dt.id) {
                    customFunctions.setLocalStorage(
                      'applicantName',
                      dt.name && dt.name
                    );
                    customFunctions.setLocalStorage(
                      'designation',
                      dt.applied_for_name && dt.applied_for_name
                    );
                    customFunctions.setLocalStorage(
                      'offerctc',
                      dt.offered_ctc && dt.offered_ctc
                    );
                    customFunctions.setLocalStorage(
                      'joiningdate',
                      dt.joining_date && dt.joining_date
                    );
                    customFunctions.setLocalStorage(
                      'pfInclude',
                      dt.pf_included && dt.pf_included
                    ); 
                    customFunctions.setLocalStorage(
                      'misInclude',
                      dt.miscellaneous_included && dt.miscellaneous_included
                    );
                  }
                  return dt;
                });
            }}
          >
            <Image src="/images/offer.svg" />
          </a>
        )}
      </>
    );
  };

  const handleResumeCallback = (resume) => {
    return (
      <>
        {resume.resume ? (
          <a
            href={resume.resume}
            className="pl-2"
            title="View Resume"
            target="_Blank"
          >
            <Image src="/images/download-file.svg" />
          </a>
        ) : (
          ''
        )}
      </>
    );
  };

  const getStatusId = (val) => {
    const data = ApplicantStatus.filter((i) => i.label === val);
    return data.length > 0 ? data[0] : {};
  };
  const handleStatus = (status_name) => {
    // eslint-disable-line
    return (
      <>
        {status_name.status_name === 'pending' &&
        (Number(group) === 5 || Number(group) === 6 || Number(group) === 1) ? ( // eslint-disable-line
          <DropdownInput
            asterisk="*"
            options={getDepartment()}
            placeholder="Select status"
            defaultValue={
              status_name.status_name
                ? getStatusId(status_name.status_name)
                : {}
            }
            onSelectHandler={(select) => {
              setStatusId(status_name.id);
              // {select.label === 'decined'}
              {//eslint-disable-line
                (select.label === 'declined' || select.label === 'shortlisted') && setModalShow(true);
              }
              setStatusData(select);
            }}
            isOptionDisabled={(ApplicantStatus) => ApplicantStatus.isdisabled} //eslint-disable-line
          />
        ) : (
          <span>{status_name.status_name}</span>
        )}
      </>
    );
  };

  const columns = [
    {
      id: 'offered_ctc',
      label: 'offered ctc',
      isDisplay: false,
    },
    {
      id: 'joining_date',
      label: 'joining date',
      isDisplay: false,
    },
    {
      id: 'pf_included',
      label: 'pf included',
      isDisplay: false,
    },
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false,
    },
    {
      id: `{{'int_date'} ? 'int_date': 'created_at'}`, // eslint-disable-line
      label: 'Date',
      render: ({ created_at }) => {
        // eslint-disable-line
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
      isDisplay: false,
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
      isDisplay:
        (activeMenu.includes('Pending') || activeMenu.includes('all')) && true,
    },
    {
      id: 'round_status_name',
      label: 'Round Status',
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

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

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
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
      sort_by: 'updated_at',
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
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
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    getRowData(1);
    getDepartment();
    setTitle('Recruitment');
  }, [filterData]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    getHrName(roleId);
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValue) => {
    let payload = {};
    const formValues =
      typeof formValue === 'object' && Object.keys(formValue).length
        ? formValue
        : allData;
    payload = {
      keyword:
        formValues && formValues.keyword
          ? formValues.keyword
          : formValues.keyword,
      designation_id:
        formValues &&
        formValues.designation_id &&
        formValues.designation_id.value
          ? formValues.designation_id.value
          : formValues.designation_id,
      technology_stack_id:
        formValues &&
        formValues.technology_stack_id &&
        formValues.technology_stack_id.value
          ? formValues.technology_stack_id.value
          : formValues.technology_stack_id,
      start_date:
        formValues && formValues.start_date
          ? customFunctions.getDate(formValues.start_date)
          : formValues.start_date,
      end_date:
        formValues && formValues.end_date
          ? customFunctions.getDate(formValues.end_date)
          : formValues.end_date,
      created_by_id:
        formValues && formValues.role_id && formValues.role_id.value
          ? formValues.role_id.value
          : formValues.created_by_id,
    };

    payload.status = status;

    if (Number(status) === 0) {
      payload.status = '';
    }

    if (formValues) {
      setAllData(payload);
    }
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
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
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

  const getHrName = async (role) => {
    const endPoint =
      Number(role) === 1
        ? `${Api.employeeUrl}?role_id=5&is_dropdown=1`
        : `${Api.teamUrl}?type=all`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({
        label: Number(role) === 1 ? op.full_name : op.employee_name,
        value: Number(role) === 1 ? op.id : op.employee_id,
      });
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
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeStackUrl}?type=all`
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

    options.technology_stack_id = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };
  useEffect(() => {
    getDesignation();
    getTechnology();
  }, []);

  const getApplicantListing = () => {
    getRowData(currentPage);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Recruitment</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
            </div>
            <hr />
            <div className="filter-box-main">
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
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={true}
                btnContainerClass="form-submit-buttons pull-right"
                isStepForm={false}
                onFormReset={() => {
                  setFilterData({});
                  setAllData({});
                }}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Recruitment</h5>
              <div className="d-flex align-items-center justify-content-end">
                <a
                  href="#"
                  onClick={() => {
                    history.push('/applications');
                  }}
                  className="btn-link"
                >
                  {Number(group) === 4 ||
                  Number(group) === 3 ||
                  Number(group) === 2
                    ? ''
                    : 'Add Applicant'}
                </a>
              </div>
            </div>
            <hr />
            <div className="text-end">
              {!(
                Number(group) === 4 ||
                Number(group) === 3 ||
                Number(group) === 2
              ) && (
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
              {!(
                Number(group) === 4 ||
                Number(group) === 3 ||
                Number(group) === 2
              ) && (
                <>
                  <a
                    href="#"
                    className={`mb-2 ${activeMenu === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveMenu('all');
                      setStatus(0);
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
                    Declined
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
            getApplicantListing();
          }}
        />
      )}
    </>
  );
}

export default withRouter(RecruitmentApplicationComponent);
