import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Card, Button } from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

// Declare columns
const columns = [{
    'id':'index',
    'label': 'Sr.No',
  },
  {
    'id':'emp_code',
    'label': 'Employee ID',
  },
  {
    'id':'full_name',
    'label': 'Employee Name',
  },
  {
    'id':'designation_name',
    'label': 'Designation',
  },
  {
    'id':'sign_in',
    'label': 'Clock-In',
  },
  {
    'id':'sign_out',
    'label': 'Clock-Out',
  },
  {
    'id':'estimation',
    'label': 'Total Working Hours',
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

// Declare variable 
const [rowData, setRowData] = useState([]);
const [totalCount, setTotalCount] = useState(10);
const [limit, setLimit] = useState(5);
const [currentPage, setCurrentPage] = useState(1);
const [filterData, setFilterData] = useState({});
const history = useHistory();
const [userRole, setUserRole] = useState('');

// Declare methods
const getRowData = async (pageNo=1) =>{
    const page = pageNo || currentPage;
    const endPoint = `${Api.timeSheetUrl}`;
    const filterList = filterData && !customFunctions.checkIfEmpty(filterData,'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      page,
      limit,
      ...filterList
      };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = ((page - 1) * limit) + (i + 1);
        return newItem;
      });
      setRowData(data && data.data || []);
    }else{
      console.log('error', message);
    }
};
console.log(setFilterData);
useEffect(()=>{
   const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  getRowData(1);
},[filterData]);

 return (
	  <>
	    <Card>
	      <Card.Header> <h4 className="text-primary mt-2 mb-2">Employee List</h4></Card.Header>
	      <Card.Body>
          <CustomTable
            columns={columns}
            rows={rowData}
            showPagination={true} // eslint-disable-line
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: currentPage,
              onPageChange: (pageNo) => {
                getRowData(pageNo);
              }
            }} 
            emptyRender={()=>{ return ('No record found.');}} 
          />
          <UserRestrictions permittedUsers={[5]} roleId={userRole}>
            <div className="d-flex justify-content-end mr-3">
              <Button onClick={()=> history.push('/emp-timesheet')}>View All</Button>
            </div>
          </UserRestrictions>
	      </Card.Body>
	    </Card>
	  </>
  );
}

export default EmployeeListComponent;