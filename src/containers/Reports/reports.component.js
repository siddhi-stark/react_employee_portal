/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Card, Row } from 'react-bootstrap';
import { useHistory, withRouter, useLocation } from 'react-router-dom';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Table from '../../components/ReactTable/simpletable.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function Reports(props) {
  const { match, location } = props;
  const state = useLocation();
  console.log("🚀 ~ Reports ~ state:", state)
  const [rows, setRows] = useState([]);
  const [showButton, setShowButton] = useState(1);
  const [reportDate, setReportDate] = useState('');
  const [title, setTitle] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [isShowLoader, setShowLoader] = useState(false);
  const [page, setPage] = useState();
  const [clockIn, setClockIn] = useState();
  const [clockOut, setClockOut] = useState();
  const [userName, setUserName] = useState();
  const history = useHistory();
  const report = props;

  
useEffect(()=>{
  setClockIn(state?.state?.state?.clockIn)
  setClockOut(state?.state?.state?.clockout)
},[state])
  console.log("🚀 ~ useEffect ~ state?.state?.clockIn:", state?.state?.clockIn)


  const employeeReport = report.location.state
    ? report.location.state.employeeReport
    : '';
  const teamReport = report.location.state ? report.location.state : '';
  const reporterName = report.location.state
    ? report.location.state.reporterName
    : '';
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  // useEffect(() => {
  //   setPage(state.state.pagination);
  // });

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: 'task',
      label: 'Todays Task',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: 'project',
      label: 'Project',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: 'eta',
      label: 'Total ETA',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: 'actual_estimation',
      label: 'Remaining ETA',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: showButton ? '' : 'at',
      label: showButton ? '' : 'AT',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
    {
      id: showButton ? '' : 'status',
      label: showButton ? '' : 'status',
      roleAccess: [1, 2, 3, 4, 5, 7],
    },
  ];

  const getTableData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pagination.current_page || pageNo;
    const dt = customFunctions.getDate(new Date(Number(match.params.date)));
    const userId = match.params.id;
    setReportDate(customFunctions.getFormattedDate(dt));
    const endPoint = `${Api.dailyReportUrl}`;
    const params = {
      page,
      limit: pagination.itemsPerPage || 10,
      date: dt,
      user_id: userId,
    };
    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.getDataFromServer(url);
    // setClockIn(customFunctions.formatAMPM(data.data.morning_data[0].sign_in));
    // setClockOut( data.data.morning_data[0].sign_out ? customFunctions.formatAMPM(data.data.morning_data[0].sign_out):  "-");
    setUserName(data.data.morning_data[0].user);

    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setShowLoader(false);
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: (pagination && pagination.itemsPerPage) || 10,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      const reportData = showButton
        ? data.data.morning_data
        : data.data.evening_data;
      reportData.map((proj, i) => {
        const setRowData = {
          no:
            (page - 1) * ((pagination && pagination.itemsPerPage) || 10) +
            (i + 1),
          task: proj.activity,
          project: proj.project_name,
          eta: proj.estimation,
          status: proj.task_status,
          at: proj.actual_estimation,
          actual_estimation: proj.actual_estimation,
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
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <Card.Title>
                <div className="d-flex">
                  <h5>
                    {employeeReport || teamReport ? `Name: ${userName}` : ''}{' '}
                    &nbsp; &nbsp; Date: {reportDate}{' '}
                  </h5>
                  <h5 className="ml-3">Sign in:{clockIn}</h5>
                  <h5 className="ml-3">Sign out:{clockOut} </h5>
                </div>
              </Card.Title>
              <div className="light-bg buttons align-items-center mt-3">
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
                <Button
                  type="button"
                  onClick={() => {
                    if (teamReport) {
                      history.push('/reports', {
                        state: {
                          EmpId: report.match.params.id,
                          reporterName: report.location.state.reporterName,
                          pageee: page,
                        },
                      });
                    } else {
                      history.push(
                        employeeReport ? '/employee-report' : '/my-report',
                        {}
                      );
                    }
                  }}
                  className="float-end"
                >
                  Back
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
