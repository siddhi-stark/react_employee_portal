/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Table from '../../components/ReactTable/simpletable.component';


function EmployeeDetails(props) {
  const { match } = props;
  const year = customFunctions.getLocalStorage('year');

  function formatDateToShort(inputDate) {
    // Convert the string to a Date object
    const dateObj = new Date(inputDate);

    // Extract day, month, and year
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    // Map month number to short month name
    const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthShortNames[dateObj.getMonth()];

    // Format and return the date
    return `${day}-${month}-${year}`;
  }
  // Declare columns
  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 4, 5, 6],
      isDisplay: true,
    },
    {
      id: 'reason',
      label: 'Leave Reason',
      render: ({ reason }) => {
        return (
          <span>{reason ? `${reason}` : '-'}</span>
        );
      },
      roleAccess: [1, 4, 5, 6],
      isDisplay: true,

    },
    {
      id: 'leave_count',
      label: 'Leave Days',
      render: ({ leave_count }) => {
        return (
          <span>{leave_count ? `${leave_count}` : '0'}</span>
        );
      },
      roleAccess: [1, 4, 5, 6],
      isDisplay: true,

    },
    {
      id: 'leave_from_date',
      label: 'From Date',
      render: ({ leave_from_date }) => {
        return (
          <span>{leave_from_date ? `${formatDateToShort(leave_from_date)}` : '-'}</span>
        );
      },
      roleAccess: [1, 4, 5, 6],
      isDisplay: true,

    },
    {
      id: 'leave_to_date',
      label: 'To Date',
      render: ({ leave_to_date }) => {
        return (
          <span>{leave_to_date ? `${formatDateToShort(leave_to_date)}` : '-'}</span>
        );
      },
      roleAccess: [1, 4, 5, 6],
      isDisplay: true,

    },
    {
      id: 'leave_payment_type',
      label: 'Leave Payment Type',
      roleAccess: [8],
      render: ({ leave_payment_type }) => {
        return (<>
          {leave_payment_type ? (leave_payment_type === 1 ? "Paid" : "Unpaid") : "-"}
        </>)
      },
    },
    {
      id: 'leave_type',
      label: 'Leave Type',
      render: ({ leave_type }) => {
        return (
          <span>{leave_type ? `${leave_type}` : '-'}</span>
        );
      },
      roleAccess: [1, 4, 5, 6],
      isDisplay: true,

    },
    {
      id: 'half_day_status',
      label: 'Leave Durations',
      roleAccess: [8],
      render: ({ half_day_status }) => {
        return (<>
          {half_day_status ? (half_day_status === 1 ? "Half Day in First Half" : "Half Day in Second Half") : "Full Day"}
        </>)
      },
    },

    {
      id: 'status_name',
      label: 'Status',
      render: ({ status_name }) => {
        return (
          <span>{status_name ? `${status_name}` : '-'}</span>
        );
      },
      isDisplay: true,
      roleAccess: [1, 4, 5, 6],
    },
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState([]);

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee Leaves Report' },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const endPoint = `${Api.leavesUrl}`;
    const params = {
      employee: match.params.viewId,
      year,
      page: pageNo,
      limit: 10
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      if (data && data.data) {
        setName(data?.data[0]?.user_name);
      }
      let finalData = []
      data && data?.data.length > 0 && data.data.map((item, index) => {
        finalData.push({
          no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
          reason: item.reason,
          status_name: item.status_name,
          leave_type: item.leave_type,
          leave_count: item.leave_count,
          leave_from_date: item.leave_from_date,
          leave_to_date: item.leave_to_date,
          leave_payment_type: item.leave_payment_type,
          half_day_status: item.half_day_status
        })
      })
      const { current_page, total_count, limit } = data.paginator;
      setPagination({
        current_page: parseInt(current_page, 10),
        totalItems: parseInt(total_count, 10),
        itemsPerPage: parseInt(limit, 10),
      });
      setTotalCount(total_count);
      setLimit(limit);
      setCurrentPage(current_page);

      setRowData((finalData) || []);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    setTitle('Employee Leaves Report');
    if (match && match.params) {
      getRowData();
    }
  }, [match]);

  const getExportCSV = async () => {
    setShowLoader(true);
    const endPoint = `${Api.leavesUrl}`;
    const params = {
      employee: match.params.viewId,
      year,
      type: 'all',
      is_export_details: true
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data?.data?.length > 0 && data && data.success) {
      setShowLoader(false);
      window.open(`${data.data.file_name}`, '_blank');
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
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">
          Leaves Report
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card className="schedular">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">{name} Leaves Report for Year {year}</h5>
              <div className="float-right">
                <Button
                  title="Download Report"
                  onClick={() => {
                    getExportCSV();
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Download Report
                </Button>
                <Link
                  to={{ pathname: '/employee-leaves', reportTable: false }}
                  type="button"
                  onClick={() => customFunctions.removeLocalStorage('year')}
                  className="btn btn-primary ms-3"
                >
                  Back
                </Link>
              </div>
            </div>
            <hr />
            <Table
              columns={columns}
              rows={rowData}
              tableClass="table-striped"
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                current_page: pagination.current_page,

                onPageChange: (page) => {
                  getRowData(page);
                  setCurrentPage(page)
                },
              }}
              dropdownContainerClass="mb-3"
              emptyRender={() => {
                return 'No record found.';
              }}
            />
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(EmployeeDetails);
