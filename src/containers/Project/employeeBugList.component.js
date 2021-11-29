import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import { Card, Row, Col } from 'react-bootstrap';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function EmployeeBugList(props) {
  const { projectId } = props;
  const [isShowLoader, setShowLoader] = useState(false);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [graphData, setGraphData] = useState({});

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'id',
      isDisplay: false,
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'tasks',
      label: 'Tasks',
    },
    {
      id: 'bug_count',
      label: 'Bugs',
    },
    {
      id: 'employee_reopen_count',
      label: 'Reopen',
    },
    {
      id: 'quality',
      label: 'Quality',
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.teamMemberUrl}`;
    const params = {
      project_id: projectId,
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      const newData = [...data.data.team_member_bug_count];
      newData.map((item) => {
        const newItem = item;
        const qualityCount =
          (100 * (item.bug_count + item.employee_reopen_count * 2)) /
          (item.employee_tasks - item.bug_count);
        newItem.tasks = item.employee_tasks - item.bug_count;
        newItem.quality = `${qualityCount.toFixed(2)} %`;
        newItem.rowClass = qualityCount < 70 ? 'alert-danger' : '';
        return newItem;
      });

      const graph = {
        labels: ['Total Count', 'Reopen'],
        datasets: [
          {
            data: [
              data && data.data && data.data.total_count,
              data && data.data && data.data.reopen_count,
            ],
            backgroundColor: ['#8cc540', '#e3e3e3'],
          },
        ],
      };
      setGraphData(graph);
      setTotalCount(
        data &&
          data.data &&
          data.data.team_member_bug_count &&
          data.data.team_member_bug_count.length
      );
      setLimit(10);
      const startIndex = currentPage * 10 - 10;
      const endIndex = startIndex + 10;
      setRowData(
        (data && data.data.team_member_bug_count).slice(startIndex, endIndex) ||
          []
      );
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
  }, []);

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Row>
          <Col sm={4} className="mb-4">
            <Card className="h-100 pie-chart-graph">
              <Card.Header className="purple-bg">
                <strong>Bug Status</strong>
              </Card.Header>
              <Card.Body>
                {Object.keys(graphData).length &&  <Pie data={graphData} />}
              </Card.Body>
            </Card>
          </Col>
          <Col sm={8} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0 mt-2 ">Employees Bugs</h5>
                </div>
                <hr />
                <CustomTable
                  columns={columns}
                  rows={rowData}
                  showPagination={true}
                  tableClass="table-striped"
                  paginationProps={{
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    activePage: currentPage,
                    onPageChange: (pageNo) => {
                      getRowData(pageNo);
                      setCurrentPage(Number(pageNo));
                    },
                  }}
                  emptyRender={() => {
                    return 'No record found.';
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default withRouter(EmployeeBugList);
