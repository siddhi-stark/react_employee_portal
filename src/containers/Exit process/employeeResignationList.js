/* eslint-disable */
import React, { useState, useRef } from 'react';
import { Helmet, DropdownInput, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const EmployeeResignationList = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const history = useHistory();
  const navigate = useLocation();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation Listing' }];

  useEffect(() => {
    employeeResignationList();
  }, []);

  const handleActionCallback = ({ id, createdDate, name }) => {
    const newDate = customFunctions.getDate(createdDate);
    const dt = new Date(newDate).getTime();

    // console.log('id', id);
    return (
      <span className="d-flex">
        <>
          <a
            href="javascript.void(0)"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push(`/resignation-details`, {
                state: {
                  resignationId: id,
                },
                //   reporterName: name,
                //   pagination: pagination.current_page,
              });
            }}
          >
            <span className="text-info">View Details</span>
          </a>
        </>
      </span>
    );
  };

  const columns = [
    {
      id: 'employeeId',
      label: 'Employee Id',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return `SDMS - ${rowdata.user.emp_code}`;
      },
    },
    {
      id: 'full_name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return `${rowdata.user.full_name}`;
      },
    },
    {
      id: 'designation',
      label: 'Designation',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return `${rowdata.user.designation_name}`;
      },
    },
    // {
    //   id: 'department',
    //   label: 'Department',
    //   roleAccess: [1, 2, 3, 4, 5, 6, 7],
    // },
    {
      id: 'joiningDate',
      label: 'Joining Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return `${rowdata.user.date_joined}`;
      },
    },
    {
      id: 'resignationReason',
      label: 'Resignation Reason',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return `${rowdata.resignation_reason}`;
      },
    },
    {
      id: 'status',
      label: 'Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata.resignation_status == '3'
          ? 'Pending'
          : rowdata.resignation_status == '2'
          ? 'Decline'
          : 'Approve';
      },
    },
    {
      id: 'remarks',
      label: 'Remarks',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata.resign_remark
          ? rowdata.resign_remark
          : rowdata.retention_decline_reason
          ? rowdata.retention_decline_reason
          : '-';
      },
    },
    {
      id: 'relivingDate',
      label: 'Reliving Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata.user.relieving_date ? rowdata.user.relieving_date : '-';
      },
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: handleActionCallback,
    },
  ];

  const employeeResignationList = async (pageNo) => {
    setShowLoader(true);
    const endPoint = `${Api.getResignationListUrl}`;
    const params = {
      sort_direction: 'descending',
      page:pageNo
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      // console.log('data', data);
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: Number(data.paginator.current_page),
        itemsPerPage: Number(data.paginator.limit),
        totalItems: data.paginator.total_count,
      });
      setRowData(data.data);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Resignation From Employees
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">
              List Of Resigned Employees{' '}
            </h5>
          </div>
          <hr />
          <Row>
            <Table
              columns={columns}
              rows={rowData}
              showPagination
              paginationProps={{
                ...pagination,
                activePage: pagination.current_page,
                onPageChange: (pageNo) => {
                  employeeResignationList(pageNo);
                },
              }}
              tableClass="table-striped"
              dropdownContainerClass="mb-3"
              emptyRender={() => (
                <p className="text-center mb-0">No record found</p>
              )}
            />
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default EmployeeResignationList;
