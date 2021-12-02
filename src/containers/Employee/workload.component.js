import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
// import StarkFormBuilder from 'stark-form-builder';
// import FormSections from './workloadFormschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { to: '/workload', label: 'Workload' },
];

function Workload() {

  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory(); // eslint-disable-line

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line

  // Variable declarations
  const [currentUser, updateCurrentUser] = useState(0); // eslint-disable-line

  // Declare columns
  const columns = [
    {
      id: 'user_id',
      label: 'Id',
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr. No',
    },
    {
      id: 'user_name',
      label: 'Employee Name',
    },
    {
      id: 'estimation',
      label: 'Estimation',
    },
    {
      id: 'spend',
      label: 'Spend Hrs',
    },
    {
      id: 'opened_task',
      label: 'Open Task',
    },
    {
      id: 'completed_task',
      label: 'Complete Task',
    },
    {
      id: 'total_project',
      label: 'Total Project',
    }
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.workloadUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      page,
      limit,
      ...filterList
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
        newItem.opened_task =
          item.project_data && item.project_data.opened_task;
        newItem.total_project =
          item.project_data && item.project_data.total_project;
        newItem.completed_task =
          item.project_data && item.project_data.completed_task;
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
    setTitle('Workload');
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
  // const submitForm = async (formValues) => {
  //   const payload = {
  //     start_date: formValues.start_date && customFunctions.getDate(formValues.start_date),
  //     end_date: formValues.end_date && customFunctions.getDate(formValues.end_date),
  //   };
  //   setFilterData(payload);
  // };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Workload
        <Button
          className="float-end"
          onClick={() => {
            history.push('/emp-timesheet'); // eslint-disable-line
          }}
        >
          Back
        </Button>
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
        {/*  <Card>
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
                  formHeading="workload filter"
                  onFormSubmit={(formValues) => {
                    submitForm(formValues);
                  }}
                  callbacks={{}}
                  currentUser={currentUser}
                  submitBtnText="Apply"
                  showResetBtn={true}
                  resetBtnText="Clear"
                  btnContainerClass="form-submit-buttons pull-right"
                  showBtnClass={true}
                  isStepForm={false}
                  onFormReset={() => {
                    setFilterData({});
                  }}
                />
              </div>
            </Card.Body>
          </Card> */}
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Workload</h5>
              </div>
              <hr />
              <CustomTable
                columns={columns}
                rows={rowData}
                role={1}
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

export default withRouter(Workload);
