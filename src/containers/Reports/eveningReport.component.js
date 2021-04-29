import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const columns = [
  {
    id: 'task',
    label: 'Todays Task',
  },
  {
    id: 'project',
    label: 'Project',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'eta',
    label: 'ETA',
  },
  {
    id: 'at',
    label: 'AT',
  },
];

function EveningReport() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const getTableData = async (dt, pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.dailyReportUrl}?date=${dt}&page=${page}&limit=${pagination.itemsPerPage}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.evening_data.map((proj) => {
        row.push({
          task: proj.activity,
          project: proj.project_name,
          status: proj.status,
          eta: proj.duration,
          at: proj.end_date,
        });
        return proj;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    const date = localStorage.getItem('date');
    getTableData(date);
  }, []);

  return (
    <>
      <div className="mt-3">
        <Row>
          <Col className="mt-3">
            <Table
              tableClass="table table-striped"
              columns={columns}
              rows={rows}
              showPagination
              showCheckbox
              paginationProps={{
                ...pagination,
                onPageChange: (pageNo) => {
                  getTableData(pageNo);
                },
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default withRouter(EveningReport);
