import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextInput } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
// import DashboardNew from '../../components/Dashboard/dashboard.component';

const columns = [
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
  {
    id: 'report',
    label: 'View Report',
  },
];

function AllReports() {
  const [rows, setRows] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [showDailyReport, setShowDailyReport] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const getReports = async () => {
    const postData = {
      userId: [userId],
    };
    const { data } = await AuthApi.postDataToServer(Api.reportUrl, postData);
    if (data) {
      console.log('reportData', data.data);
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });
      const row = [];
      data.data.map((report) => {
        row.push({
          date: customFunctions.getFormattedDate(report.created_at),
          clockin: report.sign_in,
          clockout: report.sign_out,
          total: report.estimation,
          // report: <a 
          // href="/daily-report"
          // onClick={(e) =>{
          // e.preventDefault();
          // e.stopPropagation();
          //  setShowDailyReport(true);
          //   }}
          // >
          // <span>View Report</span>
          // </a>,
          
        });
        return report;
      });
      setRows(row);
    }
  };

  // const getTableData = async (pageNo = 0) => {
  //   const page = pageNo || pagination.current_page;
  //   const endPoint = `${Api.reportUrl}?page=${page}&limit=${pagination.itemsPerPage}`;
  //   const { data } = await AuthApi.getDataFromServer(endPoint);
  //   if (data && data.data) {
  //     setPagination({
  //       activePage: data.paginator.current_page,
  //       itemsPerPage: data.paginator.limit,
  //       totalItems: data.paginator.total_count,
  //     });

  //     const row = [];

  //     data.data.map((proj) => {
  //       row.push({
  //         name: proj.name,
  //         spend: proj.spend,
  //         allocated: proj.allocated,
  //         completed: proj.completed,
  //         remaining: proj.remaining,
  //         link: (
  //           <a href="/reports">
  //             <span>View Report</span>
  //           </a>
  //         ),
  //       });
  //       return proj;
  //     });
  //     setRows(row);
  //   }
  // };
  useEffect(() => {
    const Id = localStorage.getItem('userId');
    setUserId(Id);
  });

  useEffect(() => {
    // getTableData();
    getReports();
  }, []);

  return (
    <>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <Row>
                <Col>
                  <div className="pull-left">
                    <h5>All Reports</h5>
                  </div>
                </Col>
                <Col>
                  <div className="pull-right">
                    <a
                      href="/"
                      className=""
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowFilter(true);
                        // removeDesignation();
                      }}
                    >
                      <img src="images/filter.svg" alt="filter" />
                    </a>
                  </div>
                </Col>
              </Row>

              {showFilter === true && (
                <Row className="mt-3">
                  <Col sm={3}>
                    <div className="search-bar-input">
                      <TextInput
                        inputClass="form-control"
                        // value={keyword}
                        placeholder="employee name"
                        //   onInputChange={(e) => {
                        //     setKeyword(e.target.value);
                        //  }}
                      />
                    </div>
                  </Col>

                  <Col sm={3}>
                    <DatePicker
                      className="form-control"
                      // selected={date}
                      // onChange={(date) => {
                      //   this.setState({ workOrderDate: date });
                      //   this.restrictCompletionDate(date);
                      // }}
                      // onChange={(e) => { this.setState({ workOrderDate: e }); this.restrictCompletionDate(e) }}
                      // onChange={this.dateChange}
                      autoComplete="off"
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                      placeholderText=" MM/DD/YYYY"
                    />
                  </Col>

                  <Col sm={3}>
                    <DatePicker
                      className="form-control"
                      // selected={date}
                      // onChange={(date) => {
                      //   this.setState({ workOrderDate: date });
                      //   this.restrictCompletionDate(date);
                      // }}
                      // onChange={(e) => { this.setState({ workOrderDate: e }); this.restrictCompletionDate(e) }}
                      // onChange={this.dateChange}
                      autoComplete="off"
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                      placeholderText=" MM/DD/YYYY"
                    />
                  </Col>

                  <Col sm={2}>
                    <div className="form-group">
                      <Button type="button" className="btn btn-primary">
                        Filter
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

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
                      getReports(pageNo);
                    },
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      {/* { showDailyReport && (
        <DashboardNew  dailyReport={(e) => setShowDailyReport(e)} />
      ) } */}
      
    </>
  );
}

export default withRouter(AllReports);
