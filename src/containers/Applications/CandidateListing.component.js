import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ProgressBar, Card, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import SearchFormSections from './searchFormschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';

function CandidateListing() {
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);

  const title = 'Candidates';
  const items = [{ to: '/', label: 'Home' }, { label: 'Candidates' }];
  const history = useHistory();

  const actionCallBack = (row) => {
    return (
      <span className="d-flex">
        <a
          href="/"
          title="Edit Candidate"
          className="pl-2 ms-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/candidates/${row.emp_id}`);
          }}
        >
          <Image src="/images/edit-button.svg" />
        </a>
        {new Date(row.joining_date).getTime() <= new Date().getTime() &&
          row.offer_status_name !== 'Declined' &&
          !row.is_onboard && (
            <a
              href="/"
              title="Onboard Candidate"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/onboard/${row.emp_id}`);
              }}
            >
              <Image src="/images/onboard.svg" />
            </a>
          )}
      </span>
    );
  };

  const handleProgressCallBack = (completion) => {
    return (
      <>
        {completion.offer_status_name !== 'Declined' && (
          <ProgressBar
            bsPrefix="progress pbar"
            variant="success pe-2"
            now={completion.completion ? completion.completion : 0}
            label={`${
              completion.completion ? completion.completion : 0
            }% completed`}
          />
        )}
      </>
    );
  };

  const columns = [
    {
      id: 'name',
      label: 'Candidate Name',
    },
    {
      id: 'applied_for_name',
      label: 'Position',
    },
    {
      id: 'mobile',
      label: 'Mobile',
    },
    {
      id: 'tech_stack_name',
      label: 'Technology',
    },
    {
      id: 'offer_status_name',
      label: 'Offer Status',
    },
    {
      id: 'joining_date',
      label: 'Joining Date',
      render: ({ joining_date }) => {
        return (
          <>
            <span>
              {joining_date ? customFunctions.getDMYDate(joining_date) : '-'}
            </span>
          </>
        );
      },
    },
    {
      id: 'completion',
      label: 'Progress',
      render: handleProgressCallBack,
    },
    {
      id: 'action',
      label: 'Action',
      render: actionCallBack,
    },
  ];

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
      status: 4,
      is_candidate_details: true,
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
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

  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Candidates</h2>
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
                containerClass=""
                formHeaderClass=""
                formSections={SearchFormSections}
                formHeading=""
                onFormSubmit={(formValues) => {
                  if (!formValues.keyword) return;
                  submitForm(formValues);
                }}
                callbacks={{}}
                submitBtnText="Apply"
                showResetBtn={true}
                showBtnClass={false}
                btnContainerClass="col-md-4 filter-apply-btns"
                formClass="row"
                resetBtnText="Clear"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  setFilterData();
                }}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Candidates</h5>
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
      </section>
    </>
  );
}

export default withRouter(CandidateListing);
