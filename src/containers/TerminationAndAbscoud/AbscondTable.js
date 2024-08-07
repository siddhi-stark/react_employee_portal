/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  // Accordion,
  Card,
  // Table,
  Container,
  Row,
  Image,
} from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const AbscondTable = () => {
  const router = useHistory();
  const [roleId, setRoleId] = useState();
  const history = useHistory();
  //for breadcrumbs
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Terminate and Abscond' },
  ];

  //pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  // const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [filterData, setFilterData] = useState({});

  // const [isShowLoader, setShowLoader] = useState(false);  //for loader
  // const [searchTerm, setSearchTerm] = useState('');
  // const [validationError, setValidationError] = useState('');

  const actionCallBack = (row) => {
    return (
      <span className="d-flex">
        <a
          href="/"
          title="Edit Abscond"
          className="pl-2 ms-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-abscond-form/${row?.id}`);
          }}
        >
          <span className="text-info">View Details</span>
          {/* <Image src="/images/edit-button.svg" /> */}
        </a>
        {/* <a
          href="/"
          className="pl-2 ms-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteAbscond(row?.id);
          }}
        >
          <Image src="/images/delete.png" />
        </a> */}
      </span>
    );
  };
  const columns = [
    {
      id: 'employee_sdms_id',
      label: 'Employee ID',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata?.employee_sdms_id;
      },
    },

    {
      id: 'employee_full_name',
      label: 'Employee Name',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata?.employee_full_name ? rowdata?.employee_full_name : '-';
      },
    },

    {
      id: 'designation',
      label: 'Designation',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata?.designation ? rowdata?.designation : '_';
      },
    },

    {
      id: 'joined_date',
      label: 'Joining Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: ({ joined_date }) => {
        return (
          <>
            <span>
              {joined_date ? customFunctions.getDMYDate(joined_date) : '-'}
            </span>
          </>
        );
      },
    },

    {
      id: 'absent_from_date',
      label: 'Absent From',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: ({ absent_from_date }) => {
        return (
          <>
            <span>
              {absent_from_date ? customFunctions.getDMYDate(absent_from_date) : '-'}
            </span>
          </>
        );
      },
    },
    {
      id: 'absent_to_date',
      label: 'Absent To',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: ({ absent_to_date }) => {
        return (
          <>
            <span>
              {absent_to_date ? customFunctions.getDMYDate(absent_to_date) : '-'}
            </span>
          </>
        );
      },
    },
    {
      id: 'notice_date',
      label: 'Reporting Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: ({ notice_date }) => {
        return (
          <>
            <span>
              {notice_date ? customFunctions.getDMYDate(notice_date) : '-'}
            </span>
          </>
        );
      },
    },

    {
      id: 'abscond_status',
      label: 'Absent Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      render: (row) => {
        const rowdata = row;
        return rowdata.resignation_status == '3'
          ? 'Pending'
          : rowdata.resignation_status == '2'
          ? 'Declined'
          : rowdata.resignation_status == '4'
          ? 'Cancelled'
          : rowdata?.user?.relieved == true
          ? 'Relieved'
          : 'Completed';
      },
    },
    // {
    //   id: 'action',
    //   label: 'Action',
    //   roleAccess: [1, 2, 3, 4, 5, 6, 7],
    //   render: actionCallBack,
    // },
  ];

  useEffect(() => {
    setRoleId(customFunctions.getLocalStorage('group'));
  }, [roleId]);

  useEffect(() => {
    getRowData(1);
  }, []);

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.employeeAbscond}`;
    const params = {
      limit,
      page,
      sort_direction: 'descending',
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setPagination({
        current_page: data.paginator ? Number(data?.paginator?.current_page) : 0,
        activePage: data.paginator ? data?.paginator?.current_page : 0,
        itemsPerPage: data.paginator ? data.paginator.limit : 0,
        totalItems: data.paginator ? data.paginator.total_count : 0,
      });

      const newData = [...data?.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = 1 * 1 + (i + 1);
        return newItem;
      });
      setRowData((data && data?.data));
    } else {
      setShowLoader(false);
      swal('Something Wents wrong', '', 'error');
    }
  };

  //Delete Faq
  const deleteAbscond = (id) => {
    setShowLoader(true);
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this record?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.employeeAbscond}${id}/`
          );
          if (data) {
            setShowLoader(false);
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getRowData(1);
            });
          } else {
            setShowLoader(false);
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  };

 

  return (
    <>
      <Container>
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Termination and Abscond
          </h2>
          <Breadcrumb items={items} />
        </div>
        <Card className="mt-5">
          <Card.Header>
            {['1', '2', '3', '5', '6'].includes(roleId) && (
              <div className="d-flex justify-content-end">
                <a
                  href="#"
                  onClick={() => {
                    router.push('/abscond-form');
                  }}
                  className="btn-link d-flex justify-content-end"
                >
                  Add New Resignation/Termination
                </a>
              </div>
            )}
          </Card.Header>
          <Card.Body>
            <Row>
              <Table
                columns={columns}
                rows={rowData}
                showPagination
                paginationProps={{
                  ...pagination,
                  activePage: pagination.current_page,
                  onPageChange: (pageNo) => {
                   getRowData(pageNo);
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
      </Container>
    </>
  );
};

export default withRouter(AbscondTable);
