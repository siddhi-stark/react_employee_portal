import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Image } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';

function EmployeeLeavesDetails(props) {
  const { year, filters } = props;
  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'total_leaves',
      label: 'Allocated',
      render: ({ total_leaves }) => {
        return (
        <span>{total_leaves ? `${total_leaves}` : '0'}</span>
        );
      },
    },
    {
      id: 'total_leave_taken',
      label: 'Taken',
      render: ({ total_leave_taken }) => {
        return (
        <span>{total_leave_taken ? `${total_leave_taken}` : '0'}</span>
        );
      },
    },
    {
      id: 'casual_leave',
      label: 'Casual',
      render: ({ casual_leave }) => {
        return (
        <span>{casual_leave ? `${casual_leave}` : '0'}</span>
        );
      },
    },
    {
      id: 'sick_leave',
      label: 'Sick',
      render: ({ sick_leave }) => {
        return (
        <span>{sick_leave ? `${sick_leave}` : '0'}</span>
        );
      },
    },
    {
      id: 'pending_leave',
      label: 'Pending',
      render: ({ pending_leave }) => {
        return (
        <span>{pending_leave ? `${pending_leave}` : '0'}</span>
        );
      },
    },
    {
      id: 'unpaid_leave',
      label: 'Unpaid',
      render: ({ unpaid_leave }) => {
        return (
        <span>{unpaid_leave ? `${unpaid_leave}` : '0'}</span>
        );
      },
    },
    {
      id: 'action',
      label: '',
      render: ({ id }) => {
        return (
          <Link
          className="pl-2"
          title='View Report'
          onClick={()=> customFunctions.setLocalStorage('year',customFunctions.getYear(year))}
          to={{pathname: `/employee-leaves-report/${id}`}}
        >
          <Image alt="view" src="/images/edit.png" />
        </Link>
        );
      },
    }
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  // const [totalCount, setTotalCount] = useState(10);
  // const [limit, setLimit] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoader, setShowLoader] = useState(false);

  // Declare methods
  const getRowData = async () => {
    setShowLoader(true);
    // const page = pageNo || currentPage;
    const endPoint = `${Api.leavesCountDataUrl}`;
    const params = {
      // page: filters ? '' : page,
      // limit: filters ? '' : limit,
      year: year && customFunctions.getYear(year),
      start_date: filters && filters.start_date,
      end_date: filters && filters.end_date,
      employee_id: filters && filters.employee_id
    };
    
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      // setLimit(10);
      // const startIndex = currentPage * 10 - 10;
      // const endIndex = startIndex + 10;
      // setTotalCount(
      //   data &&
      //     data.data &&
      //     data.data.length
      // );
      // const employeeData = data && data.data;
      // setRowData(filters ? employeeData : employeeData.slice(startIndex, endIndex) || []);
      setRowData(data && data.data || []);
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
    getRowData();
  }, [year,filters]);

  return (
    <div className="schedular">
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <CustomTable
        columns={columns}
        rows={rowData}
        tableClass="table-striped"
        showPagination={true}
        paginationProps={{
          // totalItems: totalCount,
          // itemsPerPage: limit,
          // activePage: currentPage,
          onPageChange: (pageNo) => {
            getRowData(pageNo);
            // setCurrentPage(Number(pageNo));
          },
        }}
        emptyRender={() => {
          return 'No record found.';
        }}
      />
    </div>
  );
}

export default withRouter(EmployeeLeavesDetails);
