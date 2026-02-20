import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './formschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { label: 'Archived Project' },
];

function ArchivedProject() {
  const history = useHistory();
  // Declare variable
  const [title, setTitle] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const departmentId = customFunctions.getLocalStorage('department');
  const [options, updateOptions] = useState({});

  // Variable declarations Filter State
  const [currentUser, updateCurrentUser] = useState(0);

  const handleActionCallback = ({ id }) => {
    return (
      <span className="d-flex">
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/view-project/${id}`, {
              isView: true,
              archived: true,
            });
          }}
        >
          <Image alt="view" src="/images/eye.svg" />
        </a>
        <a
          href="/"
          className="pl-2 ms-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-project/${id}`, {
              isView: false,
              archived: true,
            });
          }}
        >
          <Image src="/images/edit-button.svg" />
        </a>
      </span>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Id',
      roleAccess: [4],
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr.No',
      roleAccess: [4],
    },
    {
      id: 'name',
      label: 'Project Name',
      roleAccess: [4],
      render: ({ id, name }) => {
        return (
          <>
            <a
              href="/"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/team-project/${id}`, { archived: true });
              }}
            >
              <strong> {name} </strong>
            </a>
          </>
        );
      },
    },
    {
      id: 'completion',
      label: 'Project Completion',
      roleAccess: [4],
      render: ({ completion }) => {
        return (
          <>
            <strong>{completion}%</strong>
          </>
        );
      },
    },
    {
      id:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'hourly_cost',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Hourly Rate',
      roleAccess: [1],
    },
    {
      id: 'allocated',
      label: 'Estimated Hrs',
      roleAccess: [4],
      render: ({ allocated }) => {
        return <> {allocated.toFixed(2)} </>;
      },
    },
    {
      id:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'hours_allocated',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Hours Allocated',
      roleAccess: [1],
      render: ({ hours_allocated }) => {
        return (
          <span>
            {((Number(currentUser) === 4 && Number(departmentId) === 8) ||
              Number(currentUser) === 1) &&
              hours_allocated.toFixed(2)}
          </span>
        );
      },
    },
    {
      id:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'cost_allocated',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Project Cost',
      roleAccess: [1],
    },
    {
      id: 'Action',
      label:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        'Action',
      render:
        ((Number(currentUser) === 4 && Number(departmentId) === 8) ||
          Number(currentUser) === 1) &&
        handleActionCallback,
    },
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.getProjects}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      sort_by: 'name',
      sort_direction: 'ascending',
      page,
      limit,
      status: 'inactive',
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
        newItem.index = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Archived Project');
  }, [filterData]);

  // Get user role Filter
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValue) => {
    let payload = {};
    const formValues =
      typeof formValue === 'object' &&
      Object.keys(formValue).length &&
      formValue;
    payload = {
      project_id:
        formValues.project_id &&
        formValues.project_id.value &&
        Number(formValues.project_id.value),
    };

    setFilterData(payload);
  };

  useEffect(() => {
    submitForm();
  }, []);

  const getProjectList = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.projectListUrl}?sort_by=name&status=inactive&type=all`
    );

    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.project_id = dpOptions;
    const allOptions = options;
    await updateOptions({ ...allOptions });
  };

  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Dashboard</h2>
        <Breadcrumb items={items} />
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
              <div className="filter-box-main">
                <StarkFormBuilder
                  containerClass=""
                  formHeaderClass=""
                  formSections={FormSections}
                  formHeading="Project Filter"
                  onFormSubmit={(formValues) => {
                    if(!formValues.project_id) return;
                    submitForm(formValues);
                  }}
                  callbacks={{}}
                  options={options}
                  currentUser={currentUser}
                  submitBtnText="Apply"
                  showResetBtn={true}
                  showBtnClass={false}
                  btnContainerClass="col-md-4 filter-apply-btns"
                  formClass="row"
                  resetBtnText="Clear"
                  isStepForm={false}
                  onFormReset={() => {
                    if(filterData && !Object.keys(filterData).length) return;
                    setFilterData({});
                  }}
                />
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Project</h5>
              </div>
              <hr />
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
      </section>
    </>
  );
}

export default withRouter(ArchivedProject);
