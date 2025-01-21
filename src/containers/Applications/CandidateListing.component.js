/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ProgressBar, Card, Image, Col, Row, Button } from 'react-bootstrap';

import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import SearchFormSections from './searchFormschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet, DropdownInput, } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';
import RevokeOffer from './revokeOffer';

function CandidateListing() {
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  const [revokeStatus, setRevokeStatus] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [applicantId, setApplicantId] = useState();
  const [offerStatus, setOfferStatus] = useState();


  const allOfferStatus = [
    {
      label: "Accepted", value: 1,
    },
    {
      label: "Declined", value: 2,
    },
    {
      label: "Pending", value: 3,
    },
    {
      label: "Revoked", value: 4,
    }
  ]

  const title = 'Candidates';
  const items = [{ to: '/', label: 'Home' }, { label: 'Candidates' }];
  const history = useHistory();

  const actionCallBack = (row) => {

    return (
      <span className="d-flex">
        {row.offer_status_name !== 'Pending' && !row.is_onboard && row.offer_status !== 4 && (
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
        )}
        {new Date(row.joining_date).getTime() <= new Date().getTime() &&
          row.offer_status_name !== 'Declined' && row.offer_status !== 4 &&
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

        {
          new Date().getTime() >= new Date(row.joining_date).getTime() &&
          row.offer_status !== 4 &&
          (
            <a
              href="/"
              title="Revoke Offer Letter"
              className="pl-2 ms-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // history.push(`/onboard/${row.emp_id}`);
                setApplicantId(row.id)
                setModalShow(true)
              }}
            >
              <Image src="/images/logout-profile.svg" />
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
            label={`${completion.completion ? completion.completion : 0
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
      id: 'tech_stack',
      label: 'Technology',
      render: ({ tech_stack }) => {
        return (
          <>
            <span>
              {tech_stack && tech_stack.length > 0
                ? tech_stack.map((tech) => tech.tech_name).join(', ')
                : '-'}
            </span>
          </>
        );
      },
    },
    {
      id: 'offer_status_name',
      label: 'Offer Status',
      render: ({ offer_status_name, offer_status, revoke_reason }) => {
        return (
          <>
            <a
              // href="/"
              className="ms-2 pl-2"
              title={offer_status === 4 ? revoke_reason : `Offer ${offer_status_name}`}
            >
              {offer_status_name}
            </a>
          </>
        );
      },
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
    let endPoint = `${Api.applicantsUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    let params = {
      page,
      limit,
      sort_direction: 'descending',
      status: 4,
      is_candidate_details: true,
      ...filterList,
    };

    if (selectedEmployeeId && selectedEmployeeId != "all_applicants") {
      endPoint = `${Api.applicantsUrl}`
      params.get_by_id = +selectedEmployeeId
    }
    if (offerStatus){
      params.offer_status = +offerStatus.value
    }

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

  const [allEmployes, setAllEmployes] = useState([{ label: 'All Applicants', value: 'all_applicants' }]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Applicants', value: 'all_applicants' });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_applicants');

  const getEmployeeName = async () => {
    setShowLoader(true);

    const params = {
      type: "all",
      sort_direction: 'descending',
      is_candidate_details: true,
      status: 4
    };

    console.log("sdfsdfdsf");

    let url = `${Api.applicantsUrl}`;
    url = customFunctions.generateUrl(url, params);

    const { data, error } = await AuthApi.getDataFromServer(url, params);
    setShowLoader(false);

    if (data && data.success) {
      let allemp = []
      data.data.map((item) => {
        // if (item.status !== 4) return;
        allemp.push({
          label: item.name,
          value: item.id,
          // joiningDate: item.date_joined,
        })
      }
      );

      setAllEmployes([{ label: 'All Applicants', value: 'all_applicants' }, ...allemp]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  useEffect(() => {
    getEmployeeName()
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
            {/* <div className="filter-box-main"> */}


            {/* </div> */}
            <Row>
              <Col sm={4}>
                <DropdownInput
                  label="Select Employee"
                  options={allEmployes}
                  defaultValue={selectedEmployee}
                  onSelectHandler={(select) => {
                    setSelectedEmployee(select)
                    setSelectedEmployeeId(select?.value)
                  }}
                />
              </Col>

              <Col sm={4}>
                <DropdownInput
                  label="Select Offer"
                  options={allOfferStatus}
                  defaultValue={offerStatus}
                  onSelectHandler={(select) => {
                    setOfferStatus(select)
                  }}
                />
              </Col>
              <Col>
                <Button variant="primary" onClick={() => {
                  getRowData()
                }} className='mt-4'>
                  Apply
                </Button>{' '}
                <Button variant="secondary" onClick={() => {
                  setSelectedEmployee({ label: 'All Applicants', value: 'all_applicants' })
                  setSelectedEmployeeId('')
                  setOfferStatus('')

                }} className='mt-4'>
                  Cancel
                </Button>
              </Col>
            </Row>

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
          {modalShow && (
            <RevokeOffer
              show={modalShow}
              applicantId={applicantId}
              handleModalCLose={(e) => setModalShow(e)}
              onStatusUpdate={() => {
                getRowData(1);
              }}
            />
          )}
        </Card>
      </section>
    </>
  );
}

export default withRouter(CandidateListing);
