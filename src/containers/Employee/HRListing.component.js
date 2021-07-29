import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Card } from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';

// Declare columns
const columns = [{
        'id':'date',
        'label': 'Date',
},
{
        'id':'sign_in',
        'label': 'ClockIn',
},
{
        'id':'sign_out',
        'label': 'ClockOut',
},
{
        'id':'estimation',
        'label': 'Total Working Hours',
},
];
const Name = customFunctions.getLocalStorage('name');

function HRListing() {

// Declare variable 
const [rowData, setRowData] = useState([])
const [totalCount, setTotalCount] = useState(10);
const [limit, setLimit] = useState(5);
const [currentPage, setCurrentPage] = useState(1);
const [filterData, setFilterData] = useState({}) //eslint-disable-line
 const title = 'Timesheet'

  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];


// Declare methods
const getRowData = async (pageNo=1) =>{
    const page = pageNo || currentPage;
    const UserId = customFunctions.getLocalStorage('userId');
    const endPoint = `${Api.employeeTimesheet}?employee_id=${UserId}&limit=${limit}&page=${page}`;
    // const params = {
    //   page,
    //   limit,
    //   }
    const { data, message } = await AuthApi.getDataFromServer(endPoint);
    
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData(data && data.data || []);
    }else{
      console.log('error', message)
    }
} 


useEffect(()=>{
  getRowData(1)
},[filterData])


	return (
<>
 <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>  
      <div className='mt-5'>
      <Card>
       <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">Employee Timesheet - {Name}</h4>
            </div>
          </Card.Header>
          <Card.Body>

<CustomTable
    columns={columns}
    rows={rowData}
showPagination={true} 
paginationProps={{
            totalItems: totalCount,
            itemsPerPage: limit,
            activePage: currentPage,
            onPageChange: (pageNo) => {
              getRowData(pageNo);
            }
          }} 
emptyRender={()=>{ return ('No record found.')}} 
/>
</Card.Body>
      </Card>

      </div>         
</>

		)
}

export default withRouter(HRListing);