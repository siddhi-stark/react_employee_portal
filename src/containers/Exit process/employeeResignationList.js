/* eslint-disable */
import React, { useState, useRef } from 'react';
import { Helmet, DropdownInput, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button,Form,Accordion } from 'react-bootstrap';
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
  const [roleId, setRoleId] = useState();
  const [resignationType, setResignationType] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const handleDropdownChange = (e) => {
    setResignationType(e.target.value);
  };

  const handleApplyFilter = () => {
    const filtered = rowData.filter((row) => row.resignation_Type === resignationType);
    setFilteredData(filtered);
    setIsFilterOpen(false);
  };

  const handleCancelFilter = () => {
    setResignationType('');
    setFilteredData([]);
    setIsFilterOpen(false);
  };
  // useEffect(() => {
  //   if (roleId == '4') {
  //     localStorage.clear();
  //     window.location.href = '/login';
  //   }
  // }, [roleId]);

  useEffect(() => {
    setRoleId(localStorage.getItem('group'));
  }, []);

  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation applications' }];

  useEffect(() => {
    employeeResignationList();
  }, [roleId]);

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
              history.push(`/resignation-detail/${id}`, {
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
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return `SDMS - ${rowdata?.user?.emp_code}`;
      },
    },
    {
      id: 'full_name',
      label: 'Name',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return rowdata?.user?.full_name ? rowdata?.user?.full_name : '-';
      },
    },
    {
      id: 'designation',
      label: 'Designation',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return rowdata?.user?.designation_name
          ? rowdata?.user?.designation_name
          : '_';
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
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return customFunctions.getDMYDate(rowdata?.user?.date_joined);
      },
    },
    {
      id: 'created_at',
      label: 'Resignation Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return customFunctions.getDMYDate(rowdata?.created_at);
      },
    },
    {
      id: 'resignationReason',
      label: 'Resignation Reason',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return rowdata?.resignation_reason.length > 15 ? (
          <span title={rowdata?.resignation_reason}>
            {' '}
            {rowdata?.resignation_reason.slice(0, 15) + '' + '...'}
          </span>
        ) : (
          <span title={rowdata?.resignation_reason}>
            {rowdata?.resignation_reason}
          </span>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return rowdata.resignation_status =='3'
          ? 'Pending'
          : rowdata.resignation_status == '2'
          ? 'Declined'
          : rowdata.resignation_status =='4'
          ? 'Cancelled'
          : rowdata?.user?.relieved == true
          ? 'Relieved'
          : 'Approved';
      },
    },
    // {
    //   id: 'remarks',
    //   label: 'Remarks',
    //   roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
    //   render: (row) => {
    //     console.log("🚀 ~ EmployeeResignationList ~ row:", row)
    //     const rowdata = row;
    //     return rowdata?.resign_remark ? (
    //       <span title={rowdata?.resign_remark}>
    //         {rowdata?.resign_remark.slice(0, 15) + '' + '..'}
    //       </span>
    //     ) : rowdata?.retention_decline_reason ? (
    //       <span title={rowdata?.retention_decline_reason}>
    //         {rowdata?.retention_decline_reason.slice(0, 15) + '' + '...'}
    //       </span>
    //     ) : (
    //       '-'
    //     );
    //   },
    // },
    {
      id: 'remarks',
      label: 'Remarks',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 10],
      render: (row) => {
        const rowdata = row;
        if (rowdata.resignation_type === 2) {
          return rowdata?.resign_remark ? (
            <span title={rowdata?.resign_remark}>
              {rowdata?.resign_remark.slice(0, 15) + '...'}
            </span>
          ) : rowdata?.retention_decline_reason ? (
            <span title={rowdata?.retention_decline_reason}>
              {rowdata?.retention_decline_reason.slice(0, 15) + '...'}
            </span>
          ) : (
            '-'
          );
        } else {
          return null; // Return null or empty element if resignation_type is not 3
        }
      },
    },
    

    {
      id: 'relievingDate',
      label: 'Relieving Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: (row) => {
        const rowdata = row;
        return [2, 4].includes(rowdata?.resignation_status)
          ? '-'
          : rowdata?.user?.relieving_date
          ? customFunctions.getDMYDate(rowdata?.user?.relieving_date)
          : '-';
      },
    },
    // {
    //   id: 'resignationType',
    //   label: 'Resignation Type',
    //   roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
    //   render: (row) => {
    //     const rowdata = row;
    //     return rowdata.resignation_Type == '3'
    //       ? 'Terminated'
    //       : rowdata.resignation_Type == '2'
    //       ? 'Resigned'
    //       : rowdata.resignation_Type == '4'
    //       ? ''
    //       : rowdata?.user?.relieved == true
    //       ? ''
    //       : '';
    //   },
    // },
    {
      id: 'resignationType',
      label: 'Resignation Type',
      roleAccess: [1, 2, 3, 4, 5, 6, 7, 10],
      render: (row) => {
        return row.resignation_type_name || ''; // Directly access the resignation_type_name property
      },
    },

    {
      id: 'action',
      label: 'Action',
      roleAccess: [1, 2, 3, 4, 5, 6, 7,10],
      render: handleActionCallback,
    },
  ];

  const employeeResignationList = async (pageNo) => {
    setShowLoader(true);
    const endPoint = `${Api.getResignationListUrl}`;
    const params = {
      sort_direction: 'descending',
      page: pageNo,
      show_all: true,
    };
    if (roleId == '5') {
      params.show_all = true;
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
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
     
      <Accordion defaultActiveKey="0" className='mt-4'>
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            Filter
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Row>
                <Col>
              <Form.Group controlId="resignationType">
                <Form.Label>Resignation Type</Form.Label>
                <Form.Control as="select" value={resignationType} onChange={handleDropdownChange}>
                  <option value=""hidden>Select Resignation Type</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Control>
              </Form.Group>
              </Col>
              <Col>
             <Button variant="primary" onClick={handleApplyFilter}className='mt-4'>
                Apply
              </Button>{' '}
              <Button variant="secondary" onClick={handleCancelFilter}className='mt-4'>
                Cancel
              </Button>
              </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Applications List </h5>
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
