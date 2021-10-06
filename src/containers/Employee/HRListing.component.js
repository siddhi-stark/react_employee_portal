import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Card } from 'react-bootstrap';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';

const columns = [
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'sign_in',
    label: 'ClockIn',
  },
  {
    id: 'sign_out',
    label: 'ClockOut',
  },
  {
    id: 'estimation',
    label: 'Total Working Hours',
  },
];
const Name = customFunctions.getLocalStorage('name');

function HRListing() {
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); //eslint-disable-line
  const title = 'Timesheet';

  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const UserId = customFunctions.getLocalStorage('userId');
    const endPoint = `${Api.employeeTimesheet}?employee_id=${UserId}&limit=${limit}&page=${page}`;
    const { data, message } = await AuthApi.getDataFromServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <div className="mt-5">
        <Card>
          <Card.Body>
           <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 "> Employee Timesheet - {Name}</h5>
            </div>
            <hr/>
            <CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true}
              tableClass="table-striped"
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                },
              }}
              emptyRender={() => {
                return 'No record found.';
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(HRListing);
