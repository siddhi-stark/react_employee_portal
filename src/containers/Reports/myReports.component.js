import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const columns = [
  {
    id: 'no',
    label: 'Sr. No',
  },
  {
    id: 'name',
    label: 'Employee Name',
  },
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'clockin',
    label: 'Clock in',
  },
  {
    id: 'clockout',
    label: 'Clock Out',
  },
  {
    id: 'total',
    label: 'Total Working',
  },
];

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Reports' },
];

function AllReports() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const getReports = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.timeSheetUrl}?limit=${pagination.itemsPerPage}&page=${page}`;

    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });
      const row = [];
      data.data.map((report, i) => {
        console.log('report', report);
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: report.emp_name,
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: report.estimation,
        });
        return report;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    async function getData() {
      getReports(1);
      // const Id = localStorage.getItem('userId');
      // setUserId(Id);
      setTitle('Reports');
    }
    getData();
  }, []);

  useEffect(() => {
    getReports(1);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">My Report</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title className="d-flex align-items-center justify-content-between">
              <h5 className="m-0">My Report</h5>
            </Card.Title>
            <Row>
              <Col className="mt-3">
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  paginationProps={{
                    ...pagination,
                    activePage: pagination.current_page,
                    onPageChange: (pageNo) => {
                      getReports(pageNo);
                    },
                  }}
                  dropdownContainerClass="mb-3"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(AllReports);
