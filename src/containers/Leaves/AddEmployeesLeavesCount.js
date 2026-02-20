/* eslint-disable */
/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { withRouter, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import Table from '../../components/ReactTable/simpletable.component';

const items = [{ to: '/', label: 'Home' }, { label: 'Employees Leaves Calculations' }];

const AddEmployeesLeavesCount = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [rowData, setRowsData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState([]);
  const containerRef = useRef(null); // Reference for the scroll container

  console.log("employees", employees)

  const columns = [
    {
      id: 'name',
      label: 'Name',
      render: (row) => row.name || 'N/A',
      roleAccess: [4, 5, 6],
      isDisplay: true,
    },
    {
      id: 'totalLeaveCount',
      label: 'Current Leaves Balance',
      render: (row) => row.totalLeaveCount || 0,
      roleAccess: [4, 5, 6],
      isDisplay: true,
    },
    {
      id: 'newLeaveBalance',
      label: 'Action',
      roleAccess: [4, 5, 6],
      render: (row) => {
        return (
          <>
            <DropdownInput
              options={allLeavesCount}
              defaultValue={row.newLeaveBalance}
              onSelectHandler={(select) => {
                const getData = [...employees];
                getData[row.index - 1].newLeaveBalance = select;
                setEmployees(getData)
              }}
            />
          </>
        );
      },
      isDisplay: true,
    },
  ];

  const allLeavesCount = [
    { label: "0.5", value: 0.5 },
    { label: "1.0", value: 1.0 },
    { label: "1.5", value: 1.5 },

  ]

  // Fetch employee details
  const getEmployeesDetails = async (pageNo = 1) => {
    if (isShowLoader) return; // Prevent multiple requests during loading
    setShowLoader(true);
    const params = {
      page: pageNo,
      limit: 10,
      sort_by: 'full_name',
      hide_admin: 1,
      is_onboard: true,
    };
    const url = `${Api.employeeUrl}`;
    let new_url = customFunctions.generateUrl(url, params);
    const { data, error } = await AuthApi.getDataFromServer(new_url);
    setShowLoader(false);

    if (data && data.success) {
      const employeesData = data?.data?.map((emp, index) => ({
        id: emp.id,
        index: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
        name: emp.full_name,
        totalLeaveCount: emp.leave_count,
        newLeaveBalance: '',
        selected: false,
      }));
      setEmployees((prev) => [...prev, ...employeesData]);
      setRowsData((prev) => [...prev, ...employeesData]);
      const { current_page, total_count, limit } = data.paginator;
      setPagination({
        current_page: parseInt(current_page, 10),
        totalItems: parseInt(total_count, 10),
        itemsPerPage: parseInt(limit, 10),
      });
      setTotalCount(total_count);
      setLimit(limit);
      setCurrentPage(Number(current_page));
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage * limit < totalCount) {
      getEmployeesDetails(currentPage + 1);
    }
  };

  useEffect(() => {
    getEmployeesDetails(1);
  }, [])

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPage, totalCount]);

  const handleClear = () => {
    setEmployees((prev) =>
      prev.map((emp) => ({ ...emp, newLeaveBalance: '' }))
    );
  };

  const handleSubmit = async () => {
    const selectedEmployees = employees.filter((emp) => emp.selected);
    if (selectedEmployees.length === 0) {
      swal('No employees selected', '', 'warning');
      return;
    }

    let newArray = [];

    const payload = employees.map(({ id, newLeaveBalance }) => {
      // Check if the id already exists in newArray
      const existingObj = newArray.find(obj => obj.id === id);

      // If the id doesn't exist, push the new object to newArray
      if (!existingObj && id) {
        const obj = { id, newLeaveBalance };
        newArray.push(obj);
      }
    });

    console.log("newArray", newArray)

    // setShowLoader(true);
    // const { data, error } = await AuthApi.postDataToServer(
    //   Api.updateLeaveBalance,
    //   payload
    // );
    // setShowLoader(false);

    // if (data && data.success) {
    //   swal('Leave balances updated successfully', '', 'success');
    //   getEmployeesDetails(1); // Reset to the first page
    // } else {
    //   swal(error || 'Something went wrong', '', 'error');
    // }
    setShowLoader(false);

  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees Leaves Calculations</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body
          style={{ maxHeight: '700px', overflowY: 'auto' }}
          ref={containerRef}
        >
          <Table
            columns={columns}
            rows={rowData}
            showPagination={true}
            showCheckbox={rowData?.length > 0}
            // paginationProps={{
            //   totalItems: totalCount,
            //   itemsPerPage: limit,
            //   current_page: pagination.current_page,
            //   onPageChange: (page) => {
            //     getEmployeesDetails(page);
            //     setCurrentPage(page);
            //   },
            // }}
            dropdownContainerClass="mb-3"
            selectedRowItems={selectedId}
            onSelectRowsIndexes={async (rowIndex) => {
              const arr = [...rowIndex];
              const arrNew = [];
              await arr.filter((e) => {
                if (!arrNew.includes(e)) {
                  arrNew.push(Number(e));
                }
                return e;
              });
              setSelectedId([...arrNew]);
            }}
            tableClass="table-striped"
            emptyRender={() => (
              <p className="text-center mb-0">No reports found</p>
            )}
          />
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" className="me-2" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {isShowLoader && <div>Loading...</div>}
    </>
  );
};

export default withRouter(AddEmployeesLeavesCount);
