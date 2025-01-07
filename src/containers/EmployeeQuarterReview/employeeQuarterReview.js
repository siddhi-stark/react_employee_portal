/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import CustomTable from 'stark-custom-datatable';

const items = [{ to: '/', label: 'Home' }, { label: 'Employee Quarter Review' }];

function EmployeeQuarterReview() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [empFeedbackdata, setEmpFeedbackdata] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [employeeId, setEmployeeId] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [ShowDelete, setShowDelete] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [pageReferesh, setPageReferesh] = useState(false);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    setTitle('Employee Quarter Review');
    getQuestionList();
  }, [pageReferesh, currentPage, setTable]);

  
  function getQuarterByString(value) {
    switch (value) {
      case 'April - June':
        return 1;
      case 'July - September':
        return 2;
      case 'October - December':
        return 3;
      default:
        return 4;
    }
  }

  const getQuestionList = async (pageNo = currentPage) => {
    setShowLoader(true);
    const endPoint = `${Api.empFeedbackUrl}`;
    const params = {
      page: pageNo || currentPage,
      limit,
      is_reviewers_feedback: setTable,
      is_personal_feedback: !setTable,
      is_show_table: true,
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    console.log('data', data);

    if (data && data.success) {
      let finalData = []

      if (data?.data && data.data.length > 0) {
        data.data.map((item, index) => {
          finalData.push({
            no: (pagination.current_page - 1) * 10 + index + 1,
            id: item?.id,
            quarter: item?.quarter,
            year: item?.year,
            submission_date: item?.submission_date,
            review_status: item?.review_status,
            review_status_name: item?.review_status_name,
            employee_id: item?.employee_id,
            employee_name: item?.employee_name,
            employee_department: item?.employee_department,
            questionnaire_id: item?.questionnaire_id,
            questionnaire: item?.questionnaire,
            questionnaire_for: item?.questionnaire_for,
            questionnaire_for_name: item?.questionnaire_for_name,
          })

        })
      }
      const { current_page, total_count, limit } = data.paginator;
      setPagination({
        current_page: parseInt(current_page, 10),
        totalItems: parseInt(total_count, 10),
        itemsPerPage: parseInt(limit, 10),
      });
      setTotalCount(total_count);
      setLimit(limit);
      setCurrentPage(current_page);
      setEmpFeedbackdata(finalData);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  console.log('final', empFeedbackdata);

  function getParamsData(id) {
    const feedbackItem = empFeedbackdata.find(item => item.id === id);
    if (feedbackItem) {
      const quarter = getQuarterByString(feedbackItem.quarter);
      return {
        empId: feedbackItem.employee_id,
        quarter,
        year: feedbackItem.year,
      };
    }
    return {};
  }

  const deleteTask = async (id) => {
    const endPoint = `${Api.empFeedbackUrl}`;
    const feedbackItem = empFeedbackdata.find(item => item.id === id);
    if (feedbackItem) {
      const quarter = getQuarterByString(feedbackItem.quarter);
      const params = {
        employee_id: feedbackItem.employee_id,
        quarter,
        year: feedbackItem.year,
      };
      const url = customFunctions.generateUrl(endPoint, params);
      const { data } = await AuthApi.deleteDataFromServer(url);
      if (data) {
        swal(data.message[0], '', 'success').then(() => {
          setShowDelete(false);
          setTaskId(null);
          setPageReferesh(true);
        });
      } else {
        swal(data.message[0], '', 'error');
      }
    }
  };

  const columns = [
    { id: 'no', label: 'Sr.No' },
    // { id: 'employee_name', label: 'Name' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
    { id: 'submission_date', label: 'Submission Date' },
    {
      id: 'review_status',
      label: 'Review Status',
      render: (row) => {
        const rowData = row;
        return rowData?.review_status_name
      }
    },
    {
      id: 'action',
      label: 'Action',
      render: (row) => (
        <>
          {row.review_status === 2 && <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const paramsData = getParamsData(row.id);
              paramsData.isUpdateOnly = true
              history.push(`/add-feedback/${row.id}`, { state: paramsData });
            }}
            className="pl-2 me-2"
          >
            <img src="/images/edit.svg" alt="edit icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />
          </a>}

          {row.review_status === 2 || row.review_status === 1 && (<>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const paramsData = getParamsData(row.id);
                paramsData.isViewOnly = true

                history.push(`/add-feedback/${row.id}`, { state: paramsData });
              }}
              className="pl-2 me-2"
            >
              <img src="/images/view-eye.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />
            </a>
          </>)}
          {row.review_status === 2 && (
            <>
              <a
                href="#"
                className="text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDelete(true);
                  setTaskId(row.id);
                }}
              >
                <img src="/images/delete.png" alt="delete icon" />
              </a>
            </>
          )}

        </>
      ),
    },
  ];

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee Quarter Review</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to delete it?"
          error
          showCancel
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
          onConfirm={() => {
            deleteTask(taskId);
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
            setTaskId(null);
          }}
        >
          You will not be able to revert this!
        </SweetAlert>
      )}

      <section className="content-area">
        <div className="card p-2">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0 mt-2">Quarter Review Details</h5>
            <div className="d-flex align-items-center justify-content-end">
              {!setTable && (
                <a
                  href="#"
                  onClick={() => {
                    setTableToggle(false);
                    history.push('/add-feedback');
                  }}
                  className="btn-link"
                >
                  Add Quarterly Evaluation Review
                </a>
              )}
              {/* {!setTable ? (
                <a
                  href="#"
                  onClick={() => setTableToggle(true)}
                  className="btn-link ml-3"
                >
                  Team Feedback Details
                </a>
              ) : (
                <a
                  href="#"
                  onClick={() => setTableToggle(false)}
                  className="btn-link ml-3"
                >
                  Personal Feedback Details
                </a>
              )} */}
            </div>
          </div>
          <CustomTable
            columns={columns}
            rows={empFeedbackdata}
            tableClass="table-striped"
            showPagination={true}
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: pagination.current_page,
              onPageChange: (pageNo) => {
                setCurrentPage(pageNo);
                getQuestionList(pageNo);
              },
            }}
            showCheckbox={false}
            emptyRender={() => <center>No record found.</center>}
          />
        </div>
      </section>
    </>
  );
}

export default withRouter(EmployeeQuarterReview);
