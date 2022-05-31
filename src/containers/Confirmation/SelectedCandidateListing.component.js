import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import FormSections from './filter.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function SelectedCandidateListing() {
  const handleActionCallback = () => {
    return (
      <>
        <a
          href="#"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Image src="/images/edit-button.svg" alt="Edit Employee" />
        </a>
      </>
    );
  };

  const handleResumeCallback = () => {
    return (
      <>
        <a
          href="#"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Image src="/images/dropdown-select.svg" alt="Edit File" />
        </a>
      </>
    );
  };

  const columns = [
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'full_name',
      label: 'Applicant Name',
    },
    {
      id: 'email',
      label: 'Email ID',
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
      id: 'Action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);
  const title = 'Employees List';

  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      limit,
      page,
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
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };

  const getTechnologyStack = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      technology_stack: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getTechnologyStack();
  }, []);

  const getPosition = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.designationUrl);
    if (!data) {
      return; // eslint-disable-line
    }

    const dpOptions = [];
    data.data.map((op) => {
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      position: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">
          Employee Technology Stack
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Filters</h5>
          </div>
          <hr />
          <Card.Title>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              onFormSubmit={(formValues) => {
                if(!formValues.technology_stack && !formValues.position) return;
                submitForm(formValues);
              }}
              options={options}
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Submit"
              showResetBtn={true}
              showBtnClass={true}
              resetBtnText="Clear"
              btnContainerClass="form-submit-buttons pull-right"
              isStepForm={false}
              onFormReset={() => {
                if(filterData && !Object.keys(filterData).length) return;
                setFilterData();
              }}
            />
          </Card.Title>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Employees List</h5>
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
    </>
  );
}

export default withRouter(SelectedCandidateListing);
