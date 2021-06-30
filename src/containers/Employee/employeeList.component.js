import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import { Card } from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

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
    'id':'clockIn',
    'label': 'Clock-In',
  },
  {
    'id':'clockout',
    'label': 'Clock-Out',
  },
  {
    'id':'total',
    'label': 'Total Working Hours',
  },
];

function EmployeeListComponent() {

// Declare variable 
const [rowData, setRowData] = useState([]);
const [totalCount, setTotalCount] = useState(10);
const [limit, setLimit] = useState(5);
const [currentPage, setCurrentPage] = useState(1);
const [filterData, setFilterData] = useState({});

// Declare methods
const getRowData = async (pageNo=1) =>{
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
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
  getRowData(1);
},[filterData]);

 return (
	  <>
	    <Card>
	      <Card.Header>Employee List</Card.Header>
	      <Card.Body>
          <CustomTable
            columns={columns}
            rows={rowData}
            role={5} 
            showPagination={true}
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
	      </Card.Body>
	    </Card>
	  </>
  );
}

export default EmployeeListComponent;