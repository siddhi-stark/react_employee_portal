/* eslint-disable */
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
  const { projectId, bugStatus, bugEmployee } = props;
  const [isShowLoader, setShowLoader] = useState(false);
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
      id: 'bugs',
      label: 'Bugs',
    },
    {
      id: 'reopen',
      label: 'Reopen',
    },
    {
      id: 'quality',
      label: 'Quality %',
    },
  ];

  useEffect(() => {
    if (bugStatus) {
      setGraphData(bugStatus);
    }
  }, [bugStatus]);

  useEffect(() => {
    setDeptBugsData();
  }, []);

  //to set bugs count depart wise with qualitity
  const setDeptBugsData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.allDepartmentProject}`;
    const params = {
      project_id: projectId,
      is_all_data: true,
      is_departments_bugs: true,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data?.success) {
      setShowLoader(false);
      setRowData(data?.data);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

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
                {graphData?.datasets?.length &&
                (graphData?.datasets[0]?.data[0] ||
                  graphData?.datasets[0]?.data[1]) ? (
                  <Pie data={graphData} />
                ) : (
                  'No Record Found'
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col sm={8} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0 mt-2 ">Departments Bugs</h5>
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
                      allDepartment(pageNo);
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
