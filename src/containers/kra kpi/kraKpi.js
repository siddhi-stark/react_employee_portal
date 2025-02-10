/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import moment from 'moment';


const items = [{ to: '/', label: 'Home' }, { label: 'Employees KRA-KPI' }];

const KraKpi = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackId, setFeedbackId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [allEmployes, setAllEmployes] = useState([{ label: 'All Employess', value: 'all_employess' }]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employess', value: 'all_employess' });
  const [selectedMonth, setSetSelectedMonth] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [userRole, setUserRole] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [refereshPage, setRefereshPage] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [title, setTitle] = useState('');

  const formatMonthDate = (dateString) => {
    return moment(dateString).format('MMMM-YYYY'); 
  };

  useEffect(() => {
    setTitle("Employees KRA-KPI");
    if (!apiCalled) {
      setRefereshPage(false)
      getKraKpiDetails(currentPage);
    }
  }, [currentPage, refereshPage]);

  useEffect(() => {
    setTitle("Employees KRA-KPI")
    if (userRole) {
      getEmployeeName();
    }
  }, [userRole]);

  useEffect(() => {
    setTitle("Employees KRA-KPI")
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  const getEmployeeName = async () => {
    setShowLoader(true);
    const url = `${Api.getEmployees}?type=all&is_only_dev=1&status=active&hide_admin=1`;
    const { data, error } = await AuthApi.getDataFromServer(url);
    setShowLoader(false);

    if (data && data.success) {
      const allemp = data.data.map((item) => ({
        label: item.full_name,
        value: item.id,
        joiningDate: item.date_joined,
      }));

      setAllEmployes([{ label: 'All Employess', value: 'all_employess' }, ...allemp]);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  const getKraKpiDetails = async (pageNo=1) => {
    if (apiCalled) return;

    setApiCalled(true);
    setShowLoader(true);

    const params = {
      page: pageNo,
      limit,
      sort_direction: 'descending',

    };


    if (selectedEmployeeId !== 'all_employess') {
      params.user = selectedEmployeeId;
    }
    if (joiningDate) {
      params.start_date = customFunctions.getDate(joiningDate);
    }
    if (selectedMonth){
      params.date = formatDate(selectedMonth)
    }

    const url = customFunctions.generateUrl(Api.kraKpiUrl, params);
    try {
      const { data } = await AuthApi.getDataFromServer(url);
      setShowLoader(false);

      if (data && data.success) {
        const finalData = data.data.map((item, index) => ({
          no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
          id: item.id,
          to_user: item.to_user,
          average_rating: item.average_rating,
          created_at: item.created_at,
          to_user_id: item.to_user_id,
          submited_date:item.submited_date
        }));

        const { current_page, total_count, limit } = data.paginator;
        setRowData(finalData);
        setPagination({
          current_page: parseInt(current_page, 10),
          totalItems: parseInt(total_count, 10),
          itemsPerPage: parseInt(limit, 10),
        });
        setTotalCount(total_count);
        setLimit(Number(limit));
        setCurrentPage(current_page);
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      swal('Error fetching data', '', 'error');
    } finally {
      setShowLoader(false);
      setApiCalled(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getKraKpiDetails(1);
  };

  const columns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'to_user',
      label: 'Name',
      render: (row) => row.to_user || 'N/A',
    },
    {
      id: 'average_rating',
      label: 'Average Rating',
      render: (row) => row.average_rating || 'N/A',
    },
    {
      id: 'submited_date',
      label: 'Submitted For Date',
      render: (row) => row.created_at ? formatMonthDate(row.submited_date) : 'N/A',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id, created_at, to_user_id, to_user }) => (
        <>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              history.push("/add-kra-kpi", { state: { feedbackId: id, feddbackCreatedDate: created_at, toUserId: to_user_id, toUserName: to_user, isFromView: true } });
            }}
          >
            <Image src="/images/view-eye.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />

          </a>
          <a
            href="/"
            className="ml-1"
            onClick={(e) => {
              e.preventDefault();
              setShowDelete(true);
              setFeedbackId(id);
            }}
          >
            <Image src="/images/delete.png" alt="Delete" />
          </a>
        </>
      ),
    },
  ];

  const deleteTask = async () => {
    const url = customFunctions.generateUrl(`${Api.kraKpiUrl}${feedbackId}`);
    const { data } = await AuthApi.deleteDataFromServer(url);
    if (data.success) {
      swal('Deleted successfully', '', 'success').then(() => {
        setShowDelete(false);
        setSelectedEmployee()
        setJoiningDate(null)
        setRefereshPage(true)

      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees KRA-KPI</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col sm={2}>
              <DropdownInput
                options={allEmployes}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                  setSelectedEmployeeId(select?.value);
                }}
              />
            </Col>
            <Col sm={2}>
              <Datepicker
                className="form-control w-100"
                name={"endDate"}
                placeholder={"Select month/year"}
                showMonthYearPicker={true}
                dateFormat={"MM/yyyy"}
                maxDate={new Date()}
                selected={selectedMonth}
                onChange={(date) => {
                  console.log('date', date.month);
                  setSetSelectedMonth(date);
                }}
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={applyFilters}>Apply</Button>
              <Button variant="secondary" onClick={() => {
                setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                setSelectedEmployeeId('all_employess')
                setJoiningDate(null)
                setSetSelectedMonth(null)
                setApiCalled(false)
                setRowData([])
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
          <div className="d-flex align-items-center justify-content-end">

            {!setTable && (
              <a
                href="#"
                onClick={() => {
                  setTableToggle(false);
                  history.push('/add-kra-kpi');
                }}
                className="btn-link"
              >
                Add Kra Kpi
              </a>
            )}
          </div>
          <CustomTable
            columns={columns}
            rows={rowData}
            showPagination={true}
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: pagination.current_page,
              onPageChange: (page) => {
                console.log("Page", page);
                
                setCurrentPage(page), setApiCalled(false)},
            }}
          />
        </Card.Body>
      </Card>

      {showDelete && (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to delete?"
          confirmBtnText="Yes, Delete"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="light"
          onConfirm={() => {
            deleteTask();
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
        />
      )}
    </>
  );
};

export default KraKpi;
