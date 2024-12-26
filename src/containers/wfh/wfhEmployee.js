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

const items = [{ to: '/', label: 'Home' }, { label: 'Employees WFH' }];

const WfhEmployee = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [whfId, setWfhId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [allEmployes, setAllEmployes] = useState([{ label: 'All Employess', value: 'all_employess' }]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employess', value: 'all_employess' });
  const [selectedDate, setSelecteddate] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [refereshPage, setRefereshPage] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [title, setTitle] = useState('');
  const [isProjectManager, setProjectManager] = useState(false)
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // 'January', 'February', etc.
  const currentYear = currentDate.getFullYear(); // 2024


  useEffect(() => {
    setTitle("Employees WFH");
    if (!apiCalled && userId) {
      setRefereshPage(false)
      getWfhDetails(currentPage);
    }
  }, [currentPage, refereshPage, userId]);

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);

  useEffect(() => {
    setTitle("Employees WFH")
    if (userRole) {
      getEmployeeName();
    }
  }, [userRole]);

  useEffect(() => {
    setTitle("Employees WFH")
    const uRole = customFunctions.getLocalStorage('group');
    const userId = customFunctions.getLocalStorage('userId');
    setUserRole(Number(uRole));
    setUserId(Number(userId))
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}-${year}`;
  };


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

  console.log("pagination", pagination);

  const getWfhDetails = async (pageNo = 1) => {
    if (apiCalled) return;

    setApiCalled(true);
    setShowLoader(true);

    const params = {
      page: pageNo,
      limit,
      employee: userId,
      sort_direction: 'descending'
    };



    // if (joiningDate) {
    //   params.start_date = customFunctions.getDate(joiningDate);
    // }
    if (selectedDate) {
      params.start_date = customFunctions.getDate(selectedDate)
    }

    const url = customFunctions.generateUrl(Api.wfh, params);
    try {
      const { data } = await AuthApi.getDataFromServer(url);
      setShowLoader(false);

      if (data && data.success) {
        const finalData = data.data.map((item, index) => ({
          // no: (pagination.current_page - 1) * 10 + index + 1,
          no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
          id: item.id,
          start_date: item.start_date,
          end_date: item.end_date,
          status: item.status,
          status_name: item.status_name,
          reason: item.reason,
          note: item.note,
          employee_id: item.employee_id,
          employee_name: item.employee_name,
          duration_type: item.duration_type
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
    getWfhDetails(1);
  };

  const columns = [
    { id: 'no', label: 'SR No' },
    // {
    //   id: 'employee_name',
    //   label: 'Name',
    //   render: (row) => row.employee_name || 'N/A',
    // },
    {
      id: 'start_date',
      label: 'Start Date',
      render: (row) => row.start_date || 'N/A',
    },
    {
      id: 'end_date',
      label: 'End Date',
      render: (row) => row.end_date,
    },
    {
      id: 'status_name',
      label: 'Status',
      render: (row) => row.status_name,
    },
    {
      id: 'reason',
      label: 'Reason',
      render: (row) => row.reason,
    },

    {
      id: 'action',
      label: 'Action',
      render: ({ id }) => (
        <>
          <>
            <a
              href="/"

              onClick={(e) => {
                e.preventDefault();
                history.push("/add-wfh", { state: { wfhId: id } });
              }}
            >
              <Image src="/images/edit.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />

            </a>
          </>
          <a
            href="/"
            className="ml-1"
            onClick={(e) => {
              e.preventDefault();
              setShowDelete(true);
              setWfhId(id);
            }}
          >
            <Image src="/images/delete.png" alt="Delete" />
          </a>
        </>
      ),
    },
  ];

  const deleteTask = async () => {
    const url = customFunctions.generateUrl(`${Api.wfh}${whfId}`);
    const { data } = await AuthApi.deleteDataFromServer(url);
    if (data.success) {
      swal('Deleted successfully', '', 'success').then(() => {
        setShowDelete(false);
        setJoiningDate(null)
        setRefereshPage(true)

      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees WFH</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            {/* <Col sm={2}>
              <DropdownInput
                options={allEmployes}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                  setSelectedEmployeeId(select?.value);
                }}
              />
            </Col> */}
            <Col sm={2}>
              <Datepicker
                className="form-control"
                selected={selectedDate}
                onChange={(e) => setSelecteddate(e)}
                autoComplete="off"
                name="endDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select Date"
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={applyFilters}>Submit</Button>
              <Button variant="secondary" onClick={() => {
                setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                setSelectedEmployeeId('all_employess')
                setJoiningDate(null)
                setSelecteddate(null)
                setApiCalled(false)
                setRowData([])
                // setRefereshPage(true)
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
                  history.push('/add-wfh');
                }}
                className="btn-link"
              >
                Add WFH
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

                setCurrentPage(page), setApiCalled(false)
              },
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

export default WfhEmployee;
