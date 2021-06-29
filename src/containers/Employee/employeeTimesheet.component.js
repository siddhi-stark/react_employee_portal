import CustomTable from "stark-custom-datatable";
import React, { useState, useEffect } from 'react';
import customFunctions from '../../../helper/customFunctions';
import AuthApi from '../../../helper/authApi';


// Declare columns
const columns = [{
    "id": "id",
    "label": "SrNo",
},
{
    "id": "emp_code",
    "label": "EmployeeID",
},
{
    "id": "full_name",
    "label": "EmployeeName",
},
{
    "id": "designation_name",
    "label": "Designation ",
},
{
    "id": "clockIn",
    "label": "Clock-In",
},
{
    "id": "clockout",
    "label": "Clock-Out",
},
{
    "id": "total",
    "label": "Total Working Hours",
},
{
    "id": "action",
    "label": "Action",
},
];


function EmployeeTimesheet() {

    // Declare variable 
    const [rowData, setRowData] = useState([])
    const [total_count, setTotal_count] = useState(10);
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterData, setFilterData] = useState({})


    // Declare methods
    const getRowData = async (pageNo = 1) => {
        const page = pageNo || currentPage;
        const endPoint = 'https://mvwnj2rhk7.execute-api.ap-south-1.amazonaws.com/dev/api/v1/employee/';
        const filterList = filterData && !customFunctions.checkIfEmpty(filterData, 'O') ? customFunctions.jsonParse(filterData) : {};
        const params = {
            page,
            limit: limit,
            ...filterList
        }
        const url = customFunctions.generateUrl(endPoint, params);
        const { data, message } = await AuthApi.getDataFromServer(url);

        if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
            setTotal_count(data.paginator.total_count);
            setLimit(data.paginator.limit);
            setCurrentPage(Number(data.paginator.current_page));
            setRowData(data && data.data || []);
        } else {
            console.log('error', message)
        }
    }


    useEffect(() => {
        getRowData(1)
    }, [filterData])

    return (
        <Card>
            <Card.Header>
                <CustomTable
                    columns={columns}
                    rows={rowData}
                    role={5}
                    showPagination={true}
                    paginationProps={{
                        totalItems: total_count,
                        itemsPerPage: limit,
                        activePage: currentPage,
                        onPageChange: (pageNo) => {
                            getRowData(pageNo);
                        }
                    }}
                    emptyRender={() => { return ("No record found.") }}
                />

            </Card.Header>
        </Card>
    )



}