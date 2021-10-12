import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

const columns = [
  {
    id: 'index',
    label: 'Sr.No',
  },
  {
    id: 'emp_id',
    label: 'ID',
    render: ({ emp_id }) => { 
      return (
        <>
          <span>{
            `SDMS ${emp_id}`
          }</span>
        </>
      );
    },
  },
  {
    id: 'emp_name',
    label: 'Name',
  },
  {
    id: 'designatin_name',
    label: 'Designation',
  },
  {
    id: 'sign_in',
    label: 'In',
  },
  {
    id: 'sign_out',
    label: 'Out',
  },
  {
    id: 'estimation',
    label: 'Total Working',
    render: ({ estimation }) => {
      return (
        <>
          <span>{estimation} Hrs</span>
        </>
      );
    },
  },
];

function EmployeeListComponent() {
  const weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';
  const today = new Date();
  const yesterday = new Date();
  if (weekday[yesterday.getDay()] === 'Monday') {
    yesterday.setDate(today.getDate() - 3);
  } else {
    yesterday.setDate(today.getDate() - 1);
  }
  const date = customFunctions.getDate(new Date(yesterday));
  const dateNew = customFunctions.getFormattedDate(date);
  const n = weekday[yesterday.getDay()];
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const [userRole, setUserRole] = useState('');

  const ViewButtonMenu = new Event('ViewButtonChange', { isUpdated: true });

  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;

    const endPoint = `${
      Api.employeeTimesheet
    }?sort_by=user__full_name&sort_direction=ascending&start_date=${date}&limit=${5}&page=${page}`;
    const { data, message } = await AuthApi.getDataFromServer(endPoint);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * limit + (i + 1);
        return newItem;
      });
      setRowData((data && data.data) || []);
    } else {
      swal(message, 'error', '');
    }
  };
  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    getRowData(1);
  }, []);

  const onViewBtnChange = () => {
    document.dispatchEvent(ViewButtonMenu);
    return true;
  };

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
         <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 "> Employee Timesheet - {n}({dateNew})</h5>
              </div>  
              <hr/>
          <CustomTable
            columns={columns}
            rows={rowData}
            showPagination={false}
            role={5}
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
          <UserRestrictions permittedUsers={[5, 6]} roleId={userRole}>
            <div className="d-flex justify-content-end mr-3">
              <Button
                onClick={() => {
                  history.push('/emp-timesheet');
                  onViewBtnChange();
                }}
              >
                View All
              </Button>
            </div>
          </UserRestrictions>
        </Card.Body>
      </Card>
    </>
  );
}

export default EmployeeListComponent;
