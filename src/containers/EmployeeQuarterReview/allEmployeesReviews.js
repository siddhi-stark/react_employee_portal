/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import CustomTable from 'stark-custom-datatable';
import { setYear } from 'date-fns';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';



const items = [{ to: '/', label: 'Home' }, { label: 'Employee Feedback' }];

function AllEmployeesReviews() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [empFeedbackdata, setEmpFeedbackdata] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [ShowDelete, setShowDelete] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [pageReferesh, setPageReferesh] = useState(false)
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuarter, setQuarter] = useState({ label: 'All Quarters', value: 'all_quarters' })
  const [allEmployees, setAllEmployes] = useState([{ label: 'All Employess', value: 'all_employess' }]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employess', value: 'all_employess' });
  const [selectedStatus, setStatus] = useState({ label: 'All Reviews', value: 'all_status' });
  const [userRole, setUserRole] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [selectedYear, setReviewYear] = useState('');
  const [isProjectManager, setIsProjectManager] = useState(false);
  useEffect(() => {
    setTitle('Employee Feedback');
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setIsProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);


  useEffect(() => {
    setTitle('Employees Quarters Reviews');
    getQuestionList();
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, [pageReferesh]);

  useEffect(() => {
    if (userRole) {
      getEmployeeName();
    }
  }, [userRole]);

  const allStatus = [
    { label: 'All Reviews', value: 'all_status' },
    { label: 'Completed', value: 1 },
    { label: 'Pending', value: 2 }]

  const allQuarters = [
    { label: 'All Quarters', value: 'all_quarters' },
    { label: 'April - June', value: 1 },
    { label: 'July - September', value: 2 },
    { label: 'October - December', value: 3 },
    { label: 'January - March', value: 4 },
  ]

  function getQuarterByString(value) {
    if (value == 'April - June') {
      return 1
    }
    else if (value == 'July - September') {
      return 2
    }
    else if (value == 'October - December') {
      return 3
    }
    else {
      return 4
    }
  }

  const getEmployeeName = async () => {
    setShowLoader(true);
    const url = `${Api.employeeUrl}?type=all&is_onboard=true`;
    const { data, error } = await AuthApi.getDataFromServer(url);
    setShowLoader(false);

    if (data && data.success) {
      let allemp = []
      data.data.map((item) => {
        if ([1].includes(item.role_id) && !item.is_project_manager) return;
        allemp.push({
          label: item.full_name,
          value: item.id,
          joiningDate: item.date_joined,
        })
      }
      );

      setAllEmployes([{ label: 'All Employess', value: 'all_employess' }, ...allemp]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  const columns = [
    { id: 'no', label: 'Sr.No' },
    { id: 'employee_name', label: 'Name' },
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
              paramsData.isViewOnly = false
              history.push(`/admin-hr-view/${row.id}`, { state: paramsData });
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
                history.push(`/admin-hr-view/${row.id}`, { state: paramsData });
              }}
              className="pl-2 me-2"
            >
              <img src="/images/view-eye.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />
            </a>
          </>)}

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
      ),
    },
  ];

  const applyFilters = () => {
    setCurrentPage(1);
    getQuestionList(1);
  };

  const getQuestionList = async (pageNo) => {
    setShowLoader(true);
    const endPoint = `${Api.empFeedbackUrl}`;
    const params = {
      is_show_table: true,
      page: pageNo || currentPage,
      limit,
    }
    if (selectedEmployeeId !== 'all_employess') {
      params.employee = selectedEmployeeId;
    }
    if (selectedQuarter && selectedQuarter?.value !== 'all_quarters') {
      params.quarter = selectedQuarter?.value;
    }
    if (selectedStatus && selectedStatus?.value !== 'all_status') {
      params.review_status = selectedStatus?.value
    }

    if (selectedYear) {
      params.year = selectedYear.getFullYear();
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      let finalData = []
      const { current_page, total_count, limit } = data.paginator;

      if (data?.data && data.data.length > 0) {

        data.data.map((item, index) => {
          finalData.push({
            no: (current_page - 1) * limit + (index + 1),
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
      setEmpFeedbackdata(finalData);
      setPagination({
        current_page: +current_page,
        totalItems: total_count,
        itemsPerPage: 10,
      });
      setTotalCount(total_count);
      setLimit(limit);
      setCurrentPage(+current_page);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  function getParamsData(id) {
    let empId = null
    let quarter = null
    let year = null
    let departmentId = null
    if (empFeedbackdata) {
      empFeedbackdata?.length && empFeedbackdata.map((item, index) => {
        if (item.id == id) {
          empId = item.employee_id
          quarter = item.quarter
          year = item.year
          departmentId = item.employee_department
        }
      })
    }
    quarter = getQuarterByString(quarter)
    const params = {
      empId: empId,
      quarter: quarter,
      year: year,
      departmentId: departmentId
    }
    return params
  }

  const deleteTask = async (id) => {
    const endPoint = `${Api.empFeedbackUrl}`;

    let empId = null
    let quarter = null
    let year = null

    if (empFeedbackdata) {
      empFeedbackdata?.length && empFeedbackdata.map((item, index) => {
        if (item.id == id) {
          empId = item.employee_id
          quarter = item.quarter
          year = item.year
        }
      })
    }
    quarter = getQuarterByString(quarter)
    const params = {
      employee_id: empId,
      quarter: quarter,
      year: year,
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.deleteDataFromServer(url);
    if (data) {
      swal(data && data?.message[0], '', 'success').then((result) => {
        if (result) {
          setShowDelete(false);
          setTaskId(null);
          setPageReferesh(true)
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };

  return (
    <>

      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees Quarter Review</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col sm={2}>
              <DropdownInput
                options={allEmployees}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                  setSelectedEmployeeId(select?.value);
                }}
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                options={allQuarters}
                defaultValue={selectedQuarter}
                onSelectHandler={(select) => {
                  setQuarter(select);
                }}
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                options={allStatus}
                defaultValue={selectedStatus}
                onSelectHandler={(select) => {
                  setStatus(select);
                }}
              />
            </Col>
            <Col sm={2}>
              <Datepicker
                className="form-control w-100"
                name={"endDate"}
                placeholder={"Select month/year"}
                showYearPicker={true}
                dateFormat={"yyyy"}
                minDate={new Date(2023, 0, 1)}
                maxDate={new Date()}
                selected={selectedYear}
                onChange={(date) => {
                  setReviewYear(date);
                }}
              />
            </Col>

            <Col>
              <Button variant="primary" onClick={applyFilters}>Apply</Button>
              <Button variant="secondary" onClick={() => {
                setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                setSelectedEmployeeId('all_employess')
                setQuarter({ label: 'All Quarters', value: 'all_quarters' })
                setStatus({ label: 'All Reviews', value: 'all_status' })
                setReviewYear('')
                setPageReferesh(true)
              }

              } className='ml-3'>
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0 mt-2">Quarter Review Details</h5>
            <UserRestrictions
              permittedUsers={isProjectManager ? [1, 2, 3, 4, 5, 6, 10] : [2, 3, 4, 5, 6, 10]}
              roleId={userRole}
            >
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
              </div>
            </UserRestrictions>
          </div>
          <div className="d-flex align-items-center justify-content-end">
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
                getQuestionList(pageNo);
              },
            }}
            showCheckbox={false}
            emptyRender={() => <center>No record found.</center>}
          />
        </Card.Body>
      </Card>

      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to delete it?"
          error
          showCancel
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
          onConfirm={() => {
            deleteTask(taskId);
            getQuestionList();
            setShowDelete(false)
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You will not be able to revert this!
        </SweetAlert>
      )}
    </>
  );
}

export default withRouter(AllEmployeesReviews);
