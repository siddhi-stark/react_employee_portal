/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert'; // Ensure this is correctly imported
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';

const Questionnaire = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionId, setQuestionId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDepartment, setDepartment] = useState({ label: "All Departments", value: 12 });
  const [filterDepartment, setFilterDepartment] = useState({ label: "All Departments", value: 12 });

  const departmentList = [
    { label: "All Departments", value: 12 },
    { label: "Development and Design Teams", value: 1 },
    { label: "Marketing Team", value: 2 },
    { label: "QA Team", value: 3 },
    { label: "Project management team", value: 4 }
  ];

  useEffect(() => {
    getQuestionList();
  }, [currentPage, selectedDepartment]);

  const getQuestionList = async (pageNo = currentPage) => {
    setShowLoader(true);

    const params = {
      page: pageNo || currentPage,
      limit,
      questionnaire_type: selectedDepartment.value < 12 ? selectedDepartment.value : undefined,
    };

    const url = customFunctions.generateUrl(Api.questionUrl, params);

    try {
      const { data } = await AuthApi.getDataFromServer(url);
      console.log('Fetched Data:', data); 
      if (data && data.success) {
        if (data.data.length === 0) {
          swal('No records found', '', 'warning');
        }
        
        let finalData = []; 
        data?.data.length > 0 && data.data.map((item, index) => {
          finalData.push({
            no: (pagination.current_page - 1) * 10 + index + 1,
            id: item?.id,
            name: item?.name,
            questionnaire_for_name: item?.questionnaire_for_name,
          });
        });
        setRowData(finalData);
        const { current_page, total_count, limit } = data.paginator;
        setPagination({
          current_page: parseInt(current_page, 10),
          totalItems: parseInt(total_count, 10),
          itemsPerPage: parseInt(limit, 10),
        });

        setTotalCount(total_count); 
        setLimit(limit);           
        setCurrentPage(current_page); 
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      swal('Error fetching data', '', 'error');
    }

    setShowLoader(false);
  };

  const columns = [
    {
      id: 'no',
      label: 'SR No'
    },
    {
      id: 'name',
      label: 'Name',
      render: (row) => {
        const name = row?.name || 'N/A'; // Default to 'N/A' if name is undefined
        return <span>{name}</span>;
      },
    },
    {
      id: 'questionnaire_for_name',
      label: 'Department',
      render: (row) => {
        const department = row?.questionnaire_for_name || 'N/A'; // Default to 'N/A' if department is undefined
        return department;
      },
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id }) => {
        return (
          <>
            <a
              href="/"
              className=""
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push('/add-questionnaire', { state: { questionId: id } });
              }}
            >
              <Image src="/images/edit-button.svg" alt="Edit Designation" />
            </a>
            <a
              href="/"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDelete(true);
                setQuestionId(id);
              }}
            >
              <Image src="/images/delete.png" alt="Delete Designation" />
            </a>
          </>
        );
      },
    }
  ];

  const deleteTask = async () => {
    try {
      const url = customFunctions.generateUrl(`${Api.questionUrl}${questionId}`);
      const { data } = await AuthApi.deleteDataFromServer(url);
      if (data.success) {
        swal(data?.message?.[0] || 'Deleted successfully', '', 'success').then(() => {
          setShowDelete(false);
          getQuestionList();
        });
      } else {
        // swal(data.message || 'Error', '', 'error');
      }
    } catch (error) {
      // console.error('Error deleting data:', error);
      // swal('Error deleting data', '', 'error');
    }
  };

  return (
    <>
      <Helmet title="Employee Feedback Questionnaire" />
      <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: 'Employee Feedback / Questionnaire' }]} />
      <Loader showLoader={isShowLoader} />

      <Card>
        <Card.Body>
          <Row>
            <Col sm={4}>
              <DropdownInput
                options={departmentList}
                defaultValue={filterDepartment}
                onSelectHandler={(option) => setFilterDepartment(option)}
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={() => setDepartment(filterDepartment)}>Apply</Button>
              <Button variant="secondary" onClick={() => setDepartment({ label: "All Departments", value: 12 })} className='ml-3'>Cancel</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
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
                setCurrentPage(pageNo);        
                getQuestionList(pageNo);       
              },
            }}
            tableClass="table-striped"
            showCheckbox={false}
            emptyRender={() => {
              return <center>No record found.</center>;
            }}
          />
        </Card.Body>
      </Card>

      {showDelete && (
        <SweetAlert
          title="Are you sure?"
          showCancel
          confirmBtnBsStyle="primary"
          cancelBtnBsStyle="secondary"
          onConfirm={() => deleteTask()}
          onCancel={() => setShowDelete(false)}
        >
          You will not be able to revert this!
        </SweetAlert>
      )}
    </>
  );
};

export default Questionnaire;
