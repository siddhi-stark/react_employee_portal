/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card, Row, Col, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import {
  Datepicker,
  DropdownInput,
  Helmet,
  TextInput,
} from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import SimpleReactValidator from 'simple-react-validator';

const LateMarks = () => {
  const [title, setTitle] = useState('');
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDelete, setShowDelete] = useState(false);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [employeeList, setEmployeeList] = useState();
  const [deurationType, setDurationType] = useState('');
  const [formDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);
  const [lateMark, setLateMark] = useState(0.0)
  const [lateMarkMonth, setLateMarkMonth] = useState('')



  const [lateMarkCount, setLateMarkCount] = useState([
    {
      label: '0.5',
      value: 0.5,
    },
    {
      label: '1.0',
      value: 1.0,
    },
    {
      label: '1.5',
      value: 1.5,
    },
    {
      label: '2.0',
      value: 2.0,
    },
    {
      label: '2.5',
      value: 2.5,
    },
    {
      label: '3.0',
      value: 3.0,
    },
    {
      label: '3.5',
      value: 3.5,
    },
    {
      label: '3.0',
      value: 3.0,
    },
    {
      label: '3.5',
      value: 3.5,
    }, {
      label: '3.0',
      value: 3.0,
    },
    {
      label: '3.5',
      value: 3.5,
    }, {
      label: '4.0',
      value: 4.0,
    },
    {
      label: '4.5',
      value: 4.5,
    }, {
      label: '5.0',
      value: 5.0,
    },
    {
      label: '5.5',
      value: 5.5,
    },
    {
      label: '6.0',
      value: 6.0,
    },
    {
      label: '6.5',
      value: 6.5,
    },
    {
      label: '7.0',
      value: 7.0,
    },
  ]);


  const columns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'full_name',
      label: 'Employee Name',
      render: (rowData) => {
        return <>{rowData?.full_name}</>;
      },
    },
    {
      id: 'late_marks',
      label: 'Late Mark Count',
    },
    {
      id: 'reason',
      label: 'Reason',
    },
    {
      id: 'late_mark_month',
      label: 'For Month',
      render: ((row) => {
        const date = new Date(row?.late_mark_month)
        const month = date.toLocaleString('default', { month: 'short' }); // "December"
        const year = date.getFullYear(); // 2024

        return (
          <>
            {month}-{year}
          </>
        )
      })
    },
    {
      id: 'action',
      label: 'Action',
      render: (row) => {        
        return (
          <>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push(`/add-late-marks`, { state: {
                lateMarkId:row.id
              } });
            }}
            className="pl-2 me-2"
          >
            <img src="/images/edit.svg" alt="edit icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />
          </a>
          <a
            href="#"
            className="text-decoration-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteLateMarks(row.id)
            }}
          >
            <img src="/images/delete.png" alt="delete icon" />
          </a>
        </>
        )
      },
    },
  ]

  useEffect(() => {
    getRowData(1);
    getEmployee();

  }, []);

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_only_dev=1&status=active&hide_admin=1`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      const employess = [];
      data.data &&
        data.data.map((item) => {
          employess.push({
            label: item?.full_name,
            value: item?.id,
          });
        });
      setEmployeeList(employess);
    }
  };

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.lateMarks}`;
    const params = {
      page: page,
      limit: 10,
      sort_direction: 'descending',
    };

    if (selectedEmployee) {
      params.user = selectedEmployee?.value
    }
    if (lateMark) {
      params.late_mark = lateMark?.value
    }
    if (lateMarkMonth){
      params.late_mark_month = customFunctions.getDate(lateMarkMonth)
    }

    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
    }
    if (data && data.success === true) {
      setShowLoader(false);

      const lateMarksData = data.data.map((item, index) => ({
        // no: (pagination.current_page - 1) * 10 + index + 1,
        no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
        id: item.id,
        user_id: item?.user_id,
        full_name: item?.full_name,
        email: item?.email,
        late_marks: item?.late_marks,
        reason: item?.reason,
        created_at: customFunctions.getDate(item?.created_at),
        late_mark_month: customFunctions.getDate(item?.late_mark_month)
      }));

      setRowData(lateMarksData);
    }
  };

  const ApplyFilter = async () => {
    getRowData(1)
  };


  const deleteLateMarks = async (lateMarkId) => {
    setShowLoader(true);

    const endPoint = `${Api.lateMarks}${lateMarkId}`;
    const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.deleteDataFromServer(url);

    if (data && data.success === true) {
      if (data && data.success == true) {
        setShowLoader(false);
        let message = 'Late mark deleted successfully.'
        swal(message, '', 'success').then(() => {
          getRowData(1);
        });
      } else {
        setShowLoader(false);
        swal(message, '', 'error');
      }

    }
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Leave Application</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col sm={2}>
              <DropdownInput
                // label="Select Employee"
                asterisk="*"
                placeholder="Select employee"
                options={employeeList}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                }}
                errorMessage={validator.current.message(
                  'employee',
                  selectedEmployee,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
              <DropdownInput
                // label="Late Mark Count"
                placeholder="Select count"
                asterisk="*"
                options={lateMarkCount}
                defaultValue={lateMark}
                onSelectHandler={(select) => {
                  setLateMark(select);
                }}
                errorMessage={validator.current.message(
                  'Late Mark Count',
                  lateMark,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
              <Datepicker
                className="form-control w-100"
                asterisk="*"
                // label="Late Mark Month"
                name={"endDate"}
                placeholder={"Select For Month"}
                showMonthYearPicker={true}
                dateFormat={"MM/yyyy"}
                maxDate={new Date()}
                selected={lateMarkMonth}
                onChange={(date) => {
                  console.log('date', date.month);
                  setLateMarkMonth(date);
                }}
                errorMessage={validator.current.message(
                  'Late Mark Month',
                  lateMarkMonth,
                  'required'
                )}
              />
            </Col>
            <Col >
              <Button
                onClick={() => {
                  // isValid();
                  getRowData(1)
                }}
              >
                Apply
              </Button>
              <Button
                className="ml-3"
                variant="secondary"
                onClick={() => {
                  setSelectedEmployee('');
                  setLateMark('');
                  setLateMarkMonth('')
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          <hr />
          <a
            className="d-flex justify-content-end"
            href="javascript:void(0)"
            onClick={() => {
              history.push('/add-late-marks', {
              })
            }}
          >
            <u>
              <b>Add Late Marks</b>
            </u>
          </a>
          <Row>
            <CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: Number(currentPage),
                onPageChange: (page) => {
                  setCurrentPage(page)
                  getRowData(page)
                },
              }}
            />
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default LateMarks;
