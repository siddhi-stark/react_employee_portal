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
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [userRole, setUserRole] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [refereshPage, setRefereshPage] = useState(false);
  const [setTable, setTableToggle] = useState(false);


  useEffect(() => {
    if (!apiCalled) {
      getKraKpiDetails();
    }
  }, [currentPage]);

  useEffect(() => {
    getKraKpiDetails();
  }, [refereshPage])

  useEffect(() => {
    if (userRole) {
      getEmployeeName();
    }
  }, [userRole]);

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  const getEmployeeName = async () => {
    setShowLoader(true);
    const url = [1, 8].includes(userRole)
      ? `${Api.employeeUrl}?type=all&status=active&hide_admin=1`
      : '';
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

  const getKraKpiDetails = async (pageNo = currentPage) => {
    if (apiCalled) return;

    setApiCalled(true);
    setShowLoader(true);

    const params = {
      page: pageNo,
      limit,
      show_table: true,
    };

    if (selectedEmployeeId !== 'all_employess') {
      params.user = selectedEmployeeId;
    }
    if (joiningDate) {
      params.start_date = customFunctions.getDate(joiningDate);
    }

    const url = customFunctions.generateUrl(Api.kraKpiUrl, params);
    try {
      const { data } = await AuthApi.getDataFromServer(url);
      setShowLoader(false);
      setApiCalled(false);

      if (data && data.success) {
        const finalData = data.data.map((item, index) => ({
          no: (pagination.current_page - 1) * 10 + index + 1,
          id: item.id,
          to_user: item.to_user,
          average_rating: item.average_rating,
          created_at: item.created_at,
        }));

        const { current_page, total_count, limit } = data.paginator;
        setRowData(finalData);
        setPagination({
          current_page: parseInt(current_page, 10),
          totalItems: parseInt(total_count, 10),
          itemsPerPage: parseInt(limit, 10),
        });
        setTotalCount(total_count);
        setLimit(limit);
        setCurrentPage(current_page);
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      setShowLoader(false);
      setApiCalled(false);
      swal('Error fetching data', '', 'error');
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
      id: 'created_at',
      label: 'Created date',
      render: (row) => row.created_at ? customFunctions.getDate(row.created_at) : 'N/A',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id }) => (
        <>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              history.push('/add-questionnaire', { state: { feedbackId: id } });
            }}
          >
            <Image src="/images/edit-button.svg" alt="Edit" />
          </a>
          <a
            href="/"
            className="ml-2"
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
      swal(data.message || 'Deleted successfully', '', 'success').then(() => {
        setShowDelete(false);
        setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
        setJoiningDate(null)
        setRefereshPage(true)

      });
    }
  };

  return (
    <>
      <Helmet title="Employee Feedback Questionnaire" />
      <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: 'Employee Feedback / Questionnaire' }]} />
      <Loader showLoader={isShowLoader} />

      <Card>
        <Card.Body>
          <Row>
            <Col>
              <DropdownInput
                options={allEmployes}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                  setSelectedEmployeeId(select?.value);
                }}
              />
            </Col>
            <Col>
              <Datepicker
                className="form-control"
                selected={joiningDate}
                placeholder="Created date"
                dateFormat="dd/MM/yyyy"
                onChange={(e) => {
                  setJoiningDate(e);
                }}
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={applyFilters}>Apply</Button>
              <Button variant="secondary" onClick={() => {
                setSelectedEmployee({ label: 'All Employess', value: 'all_employess' })
                setJoiningDate(null)
                setRefereshPage(true)
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
                Add Feedback
              </a>
            )}
            <CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                currentPage: pagination.current_page,
                handlePageChange: (page) => setCurrentPage(page),
              }}
            />
          </div>
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
          onConfirm={deleteTask}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
};

export default KraKpi;
