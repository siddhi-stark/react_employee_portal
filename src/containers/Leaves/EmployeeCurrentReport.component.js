/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Card, Row } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import CustomTable from 'stark-custom-datatable';


function EmployeeCurrentReport(prop) {
  const state = useLocation();
  const empId = state?.state?.state?.empId;
  const clockIn = state?.state?.state?.clockIn
  const clockOut = state?.state?.state?.clockOut
  const reportDate = state?.state?.state?.reportDate
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [title, setTitle] = useState('');
  const [employee, setEmployee] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTimeLog, setTotalTimeLog] = useState(0);
  const [totalEta, setTotalEta] = useState(0);
  const history = useHistory()

  const columns = [
    {
      id: 'no',
      label: 'SR No'
    },
    {
      id: 'project',
      label: 'Project',
      render: (row) => {
        const rowData = row;
        const projectname = rowData?.project_name;
        return projectname;
      },
    },
    {
      id: 'task_name',
      label: 'Task Name',
      render: (row) => {
        const rowData = row;
        return rowData?.taskName?.length > 50 ? (
          <span title={rowData?.taskName}>
            {' '}
            {rowData?.taskName.slice(0, 50) + '' + '...'}
          </span>
        ) : (
          <span title={rowData?.task_name}>{rowData?.task_name}</span>
        );
      },
    },
    {
      id: 'date',
      label: 'Start Date',
      render: (row) => {
        const rowData = row;
        const startd = customFunctions.getDMYDate(rowData?.start_date);
        return startd;
      },
    },
    {
      id: 'date',
      label: 'End Date',
      render: (row) => {
        const rowData = row;
        const startd = customFunctions.getDMYDate(rowData?.end_date);
        return startd;
      },
    },
    {
      id: 'estimation',
      label: 'ETA',
      render: (row) => {
        const rowData = row;
        function convertToHours(minutes) {
          const hours = Math.floor(minutes / 60);
          const minutesRemaining = minutes % 60;
          return `${hours}:${minutesRemaining < 10 ? '0' : ''
            }${minutesRemaining}`;
        }
        const minutes = rowData?.estimation;
        const totaltime = convertToHours(minutes);
        return <span> {setTimedetails(totaltime)} </span>;
      },
    },
    {
      id: 'time_log',
      label: 'Log Time',

      render: (row) => {
        const rowData = row;
        const minutes = rowData?.time_log;
        const totaltime = convertToHours(minutes);
        return <span> {setTimedetails(totaltime)} </span>;
      },
    },
    {
      id: 'progress', label: 'progress',
      render: (row) => {
        const rowData = row;
        const percentage = rowData?.progress;
        return `${percentage}%`
      }
    },
    { id: 'status', label: 'Status' },
  ];

  const getTableData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeCurrentReport}`;
    const params = {
      page,
      limit: pagination.itemsPerPage || 10,
      start_date: customFunctions.getDate(fromDate),
      end_date: customFunctions.getDate(toDate),
      user_id: empId,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success == true) {
      console.log("data?.data", data?.data);

      setAllData(data?.data);
      setTotalCount(data?.paginator?.total_count);
      setLimit(data?.paginator?.limit);
      setCurrentPage(Number(data?.paginator?.current_page));
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    getTableData();
    setTitle("Employee Current Report");
  }, []);

  useEffect(() => {
    setTableData();
  }, [allData]);

  const setTableData = () => {
    if (!allData || allData.length === 0) {
      console.warn('No data to set in table rows');
      setRowData([]);
      return;
    }
    const rowArray = [];
    let totalTime = 0
    let totalEsti = 0
    if (allData) {
      const totaltime = convertToHours(allData[0].total_task_time_log)
      const totaleta = convertToHours(allData[0].total_task_eta);
      setTotalTimeLog(setTimedetails(totaltime))
      setTotalEta(setTimedetails(totaleta))

    }
    allData.forEach((ele, index) => {
      setEmployee(ele.employee_name)
      totalTime += ele.time_log
      totalEsti += ele.estimation

      rowArray.push({
        no: (pagination.current_page - 1) * 10 + index + 1,
        project_name: ele.project_name,
        task_name: ele.task_name,
        estimation: ele.estimation,
        start_date: ele.start_date,
        end_date: ele.end_date,
        time_log: ele.time_log,
        status: ele.status,
        progress: ele.progress,
      });
    });

    console.log('Generated Table Rows:', rowArray);
    setRowData(rowArray);
  };

  const setTimedetails = (timeDetails) => {
    const Arr = timeDetails.split(':');
    const brr = Arr[0];
    const crr = Arr[1];
    return `${brr}h.${crr}m`;

  }

  const convertToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const minutesRemaining = minutes % 60;
    return `${hours}:${minutesRemaining < 10 ? '0' : ''
      }${minutesRemaining}`;
  }

  const newDate = customFunctions.getDate(reportDate);
  const dt = new Date(newDate).getTime();

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
                    {employee ? `Name: ${employee}` : ''}{' '}
                  </h5>
                  <h5 className="ml-3">Total Estimation: {totalEta}</h5>
                  <h5 className="ml-3">Total Time Log:{totalTimeLog} </h5>
                </div>
              </Card.Title>
              <div className="light-bg buttons align-items-center mt-3">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.push(`/daily-report/${dt}/${empId}`, {
                      employeeReport: true,
                      reporterName: employee,
                      pagination: pagination.current_page,
                      state: {
                        empId: empId,
                        clockIn: clockIn,
                        clockout: clockOut
                      }
                    });
                  }}
                  className="float-end"
                >
                  Back
                </Button>
              </div>
              <div className="mt-3">
                {rowData && (
                  <CustomTable
                    columns={columns}
                    rows={rowData}
                    showPagination={true}
                    paginationProps={{
                      totalItems: totalCount,
                      itemsPerPage: limit,
                      activePage: currentPage,
                      onPageChange: (pageNo) => {
                        getTableData(pageNo);
                      },
                    }}
                    tableClass="table-striped"
                    showCheckbox={false}
                    emptyRender={() => {
                      return <center>No record found.</center>;
                    }}
                  />
                )}

              </div>

            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default EmployeeCurrentReport;

