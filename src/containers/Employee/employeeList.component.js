import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Card, Button } from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

// Declare columns
const columns = [
  {
    id: 'index',
    label: 'Sr.No',
  },
  {
    id: 'emp_id',
    label: 'Employee ID',
  },
  {
    id: 'emp_name',
    label: 'Employee Name',
  },
  {
    id: 'designatin_name',
    label: 'Designation',
  },
  {
    id: 'sign_in',
    label: 'Clock-In',
  },
  {
    id: 'sign_out',
    label: 'Clock-Out',
  },
  {
    id: 'estimation',
    label: 'Total Working Hours',
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

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
// const y = yesterday.getFullYear();
// const m = yesterday.getMonth();
// const d = yesterday.getDay();
// console.log('y',y,m,d);
const date = customFunctions.getDate(new Date(yesterday));
console.log('date',date);

  const weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';

  const n = weekday[yesterday.getDay()];


// console.log('Today: ' + today); // eslint-disable-line
// console.log('Yesterday: ' + yesterday); // eslint-disable-line

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const history = useHistory();
  const [userRole, setUserRole] = useState('');

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;

    const endPoint = `${Api.employeeTimesheet}?start_date=${date}&limit=${5}&page=${page}`;
    // const filterList =
    //   filterData && !customFunctions.checkIfEmpty(filterData, 'O')
    //     ? customFunctions.jsonParse(filterData)
    //     : {};
    // const params = {
    //   page,
    //   limit:5,
    //   ...filterList,
    // };
    // const url = customFunctions.generateUrl(endPoint, params);
    console.log('endPoint',endPoint);
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
      console.log('error', message);
    }
  };
  // console.log(setFilterData);
  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    getRowData(1);
  }, [filterData]);

  return (
    <>
      <Card>
        <Card.Header>
          {' '}
          <h4 className="text-primary mt-2 mb-2">Employee List - {n}</h4>
        </Card.Header>
        <Card.Body>
          <CustomTable
            columns={columns}
            rows={rowData}

            showPagination={false} 

            role={5}

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
          <UserRestrictions permittedUsers={[5]} roleId={userRole}>
            <div className="d-flex justify-content-end mr-3">
              <Button onClick={() => history.push('/emp-timesheet')}>
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
