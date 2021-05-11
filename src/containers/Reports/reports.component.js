import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

const columns = [
  {
    id: 'no',
    label: 'Sr. No',
  },
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

function Reports(props) {
  const [rows, setRows] = useState([]);
  const [showButton, setShowButton] = useState(1);
  const [reportDate, setReportDate] = useState('');
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const dt = customFunctions.getDate(
      new Date(Number(props.match.params.date))
    );
    setReportDate(dt);
    const endPoint = `${Api.dailyReportUrl}?date=${dt}&user_id=${props.match.params.id}&page=${page}&limit=${pagination.itemsPerPage}`;

    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      if (data.paginator && Object.keys(data.paginator).length > 0) {
        setPagination({
          activePage: data.paginator.current_page,
          itemsPerPage: pagination.itemsPerPage,
          totalItems: data.paginator.total_count,
        });
      }
      const row = [];
      const reportData = showButton
        ? data.data.morning_data
        : data.data.evening_data;
      reportData.map((proj, i) => {
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
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
    getTableData();
    setTitle('Detail Report');
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <Card.Title>Reports: {reportDate}</Card.Title>
              <div className="light-bg buttons d-flex align-items-center mt-3">
                <Button
                  type="button"
                  onClick={() => {
                    setShowButton(1);
                    getTableData(1);
                  }}
                  variant={showButton ? 'primary ml-1' : ''}
                >
                  Morning Report
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowButton(0);
                    getTableData(1);
                  }}
                  variant={!showButton ? 'secondary ml-1' : ''}
                >
                  Evening Report
                </Button>
              </div>

              <Col className="mt-3">
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  paginationProps={{
                    ...pagination,
                    onPageChange: (pageNo) => {
                      getTableData(pageNo);
                    },
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(Reports);
