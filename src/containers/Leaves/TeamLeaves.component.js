import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card, Button, Accordion } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './filterFormschema.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

function TeamLeaves() {
  const [currentUser, updateCurrentUser] = useState(0);

  const handleActionCallback = ({ id, status_name }) => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          title={(status_name !== 'Pending') ? 'View Leave':'Edit Leave'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/view-leave/${id}`);
          }}
        >
           {(status_name !== 'Pending') ?
          <Image src="/images/eye.svg" />
          :  <Image alt="view" src="/images/edit-button.svg" />}
        </a>
      </>
    );
  };
  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'id',
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'user_name',
      label: 'Name',
      roleAccess: [4],
    },
    {
      id: 'leave_date',
      label: 'Leave Date',
      roleAccess: [3],
      render: ({ leave_from_date, leave_to_date }) => { // eslint-disable-line
        return (
          <>
            <span>{`${customFunctions.getNewFormattedDate(
              leave_from_date
            )} to ${customFunctions.getNewFormattedDate(
              leave_to_date
            )}`}</span>
          </>
        );
      },
    },
    {
      id: 'leave_type',
      label: 'Type',
    },
    {
      id: 'leave_count',
      label: 'Days',
      roleAccess: [4],
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

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const limit = 10;
  const [filterData, setFilterData] = useState({});
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  let filterOptions = {};

  // Variable declarations Filter
  // const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});

  const history = useHistory();

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.leavesUrl}`;
     const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      page,
      limit,
      my_team:true,
      sort_direction: 'descending',
      ...filterList
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
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    getRowData(1);
    setTitle('Leaves');
  }, [filterData]);

  // Get user role Filter
  // Submit Form
  const submitForm = async (formValues) => {
    const payload = {
        employee_id: formValues.employee_id
          ? formValues.employee_id.value
          : '',
        start_date: formValues.start_date
          ? customFunctions.getDate(formValues.start_date)
          : '',
        end_date: formValues.end_date
          ? customFunctions.getDate(formValues.end_date)
          : '',
      };
    setFilterData(payload);
  };

  const getEmployee = async () => {
    const endPoint = (Number(currentUser) === 3 || Number(currentUser) === 6 || Number(currentUser) === 2) ? `${Api.teamUrl}?type=all` : `${Api.employeeUrl}?type=all&is_dropdown=1`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (!data) {
      // show error
      return;
    }
    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: (Number(currentUser) === 3 || Number(currentUser) === 6 || Number(currentUser) === 2) ? op.employee_name : op.full_name, value: (Number(currentUser) === 3 || Number(currentUser) === 6 || Number(currentUser) === 2) ? op.employee_id :op.id });
      return op;
    });
    const allOptions = {
      ...filterOptions,
      ...options,
      employee_id: dpOptions,
    };
    filterOptions = {...allOptions};
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmployee();
  }, [currentUser]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Team Leaves</h2>
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
                  containerClass=""
                  formHeaderClass=""
                  formSections={FormSections}
                  formHeading="Leaves Filter "
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
                  btnContainerClass="form-submit-buttons pull-right mb-3"
                  isStepForm={false}
                  onFormReset={() => {
                    setFilterData({});
                  }}
                />
              </Card.Title>
            </Accordion.Collapse>
          </Card>
        </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Leaves</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[4]} roleId={currentUser}>
                    <a
                      href="#"
                      onClick={() => {
                        history.push('/add-leave');
                      }}
                      className="btn-link"
                    >
                      Apply Leave
                    </a>
                  </UserRestrictions>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
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
      </section>
    </>
  );
}

export default withRouter(TeamLeaves);
