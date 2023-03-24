import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import FormSections from './SupportTicketFilter.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function SupportTicket() {
  const history = useHistory();
  const [pageTitle, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Support Ticket' }];

  useEffect(() => {
    setTitle('Support Ticket');
  }, []);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isShowLoader, setShowLoader] = useState(false);
  const userRole = customFunctions.getLocalStorage('group');
  const limit = 10;

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line

  const handleActionCallback = ({ id, status_id }) => {
    return (
      <span className="d-flex">
        {status_id !== 2 && (
        <a
          href="javascript:void(0)"
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-support-ticket/${id}`);
          }}
        >
          <Image
            src="/images/edit-button.svg"
            className="delete-edit-view"
            alt="Edit SupportTicket"
          />
        </a>
        )}
        {[9].includes(Number(userRole)) && (
          <a
            href="javascript:void(0)"
            className="ml-2"
            onClick={() => {
              //   e.preventDefault();
              //   e.stopPropagation();
              deleteTicket(id);
            }}
          >
            <Image
              src="/images/delete.png"
              className=""
              alt="Delete Support Ticket"
            />
          </a>
        )}
      </span>
    );
  };

  const columns = [
    {
      id: 'id',
      label: 'Ticket Number',
      isDisplay: false
    },
    {
      id: [1, 2].includes(Number(userRole)) && 'user_full_name',
      label: [1, 2].includes(Number(userRole)) && 'Employee Name',
    },
    {
      id: 'title',
      label: 'Title',
      render: ({ title }) => {
        return <div title={title}> {customFunctions.textAbstract(title, 15)} </div>;
      },
    },
    {
      id: 'comment',
      label: 'Comment',
      render: ({ comment }) => {
        return <div title={comment}> {customFunctions.textAbstract(comment, 20)} </div>;
      },
    },
    {
      id: 'ticket_type_name',
      label: 'Ticket Type',
    },
    {
      id: 'resolved_by_full_name',
      label: 'Resolved By',
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

  const deleteTicket = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this record?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.supportTicketUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getRowData(1);
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  };

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.supportTicketUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      limit,
      page,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
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
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    getUserRole();
    if ([1, 2].includes(Number(currentUser))) {
      getEmployee();
    }
  }, [currentUser]);

  // Submit Form
  const submitForm = async (formValues) => {
    const filterObj = {
      status:
        formValues.status && formValues.status.value
          ? formValues.status.value
          : '',
      user_id:
        formValues.employee && formValues.employee.value
          ? formValues.employee.value
          : '',
      ticket_type:
        formValues.ticket_type && formValues.ticket_type.value
          ? formValues.ticket_type.value
          : '',
    };
    setFilterData(filterObj);
  };

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all`
    );
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

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Support Ticket</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              </div>
              <hr />
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={FormSections}
                onFormSubmit={(formValues) => {
                  if (
                    [1, 2].includes(Number(currentUser)) &&
                    !formValues.employee &&
                    !formValues.ticket_type &&
                    !formValues.status
                  )
                    return;
                  submitForm(formValues);
                }}
                options={options}
                callbacks={{}}
                defaultFormValues={defaultValues}
                currentUser={currentUser}
                submitBtnText="Submit"
                showResetBtn={true}
                resetBtnText="Clear"
                btnContainerClass="form-submit-buttons pull-right"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  setFilterData({});
                }}
              />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Support Ticket</h5>
                <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-support-ticket');
                    }}
                    className="btn-link"
                  >
                    Add Support Ticket
                  </a>
                </div>
              </div>
              <hr />
              <CustomTable
                columns={columns}
                rows={rowData}
                showPagination={true}
                tableClass="table-striped"
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
      </section>
    </>
  );
}

export default withRouter(SupportTicket);
