import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function Reports(props) {
  const [rows, setRows] = useState([]);
  const [showButton, setShowButton] = useState(1);
  const [reportDate, setReportDate] = useState('');
  const [title, setTitle] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'task',
      label: 'Todays Task',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'project',
      label: 'Project',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'status',
      label: 'Status',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'eta',
      label: 'ETA',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'at',
      label: 'AT',
      roleAccess: [1, 2, 3, 4],
    },
  ];

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const dt = customFunctions.getDate(
      new Date(Number(props.match.params.date))
    );
    const userId = props.match.params.id;
    setReportDate(customFunctions.getFormattedDate(dt));
    const endPoint = `${Api.dailyReportUrl}`;
    const params = {
      page,
      limit: pagination.itemsPerPage,
      date: dt,
      user_id: userId,
    };
    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: pagination.itemsPerPage,
        totalItems: data.paginator.total_count,
      });

      const row = [];
      const reportData = showButton
        ? data.data.morning_data
        : data.data.evening_data;
      reportData.map((proj, i) => {
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          task: proj.activity,
          project: proj.project_name,
          status: proj.status,
          eta: proj.duration,
          at: proj.end_date,
        };
        row.push(setRowData);
        return proj;
      });
      setRows(row);
    }
  };
  useEffect(() => {
    getTableData();
    setTitle('Detail Report');
  }, [cntClearFilter]);

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
                    setCntClearFilter(cntClearFilter + 1);
                  }}
                  variant={`${showButton ? 'primary ml-1' : 'secondary ml-1'}`}
                >
                  Morning Report
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowButton(0);
                    setCntClearFilter(cntClearFilter + 1);
                  }}
                  variant={`${!showButton ? 'primary ml-1' : 'secondary ml-1'}`}
                >
                  Evening Report
                </Button>
              </div>
              <div className="mt-3">
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  paginationProps={{
                    ...pagination,
                    activePage: pagination.current_page,
                    onPageChange: (pageNo) => {
                      getTableData(pageNo);
                    },
                  }}
                  dropdownContainerClass="mb-3"
                />
              </div>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(Reports);
