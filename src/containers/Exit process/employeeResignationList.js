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

const EmployeeResignationList = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const history = useHistory();
  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation Listing' }];

  const handleActionCallback = ({ id, createdDate, name }) => {
    const newDate = customFunctions.getDate(createdDate);
    const dt = new Date(newDate).getTime();
    return (
      <span className="d-flex">
        <>
          <a
            href="javascript.void(0)"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            //   history.push(`/daily-report/${dt}/${id}`, {
            //     employeeReport: true,
            //     reporterName: name,
            //     pagination: pagination.current_page,
            //   });
            }}
          >
            <span className="text-info">View Report</span>
          </a>
        </>
      </span>
    );
  };

  const columns = [
    // {
    //   id: 'no',
    //   label: 'Sr. No',
    //   roleAccess: [1, 2, 3, 4, 5, 6, 7],
    // },
    {
      id: 'employeeId',
      label: 'Employee Id',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      isDisplay: false,
    },
    {
      id: 'name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'designation',
      label: 'Designation',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'department',
      label: 'Department',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'joiningDate',
      label: 'Joining Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'resignationReason',
      label: 'Resignation Reason',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'status',
      label: 'Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'remarks',
      label: 'Remarks',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'relivingDate',
      label: 'Reliving Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: handleActionCallback,
    },
  ];

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
              // rows={rows}
              showPagination
              // paginationProps={{
              //   ...pagination,
              //   activePage: pagination.current_page,
              //   onPageChange: (pageNo) => {
              //     getReports(pageNo);
              //   },
              // }}
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
