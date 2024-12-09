/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

const items = [{ to: '/', label: 'Home' }, { label: 'Milestone Predictions' }];

const Predictions = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [wfhId, setWfhId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [predictions, setPredictions] = useState()
  const [allEmployes, setAllEmployes] = useState([{ label: 'All Employess', value: 'all_employess' }]);
  const [selectedEmployee, setSelectedEmployee] = useState({ label: 'All Employess', value: 'all_employess' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [userRole, setUserRole] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [refereshPage, setRefereshPage] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [title, setTitle] = useState('');
  const [isProjectManager, setProjectManager] = useState(false)
  const [modalShow, setModalShow] = useState(false);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // 'January', 'February', etc.
  const currentYear = currentDate.getFullYear(); // 2024
  const [statusId, setStatusId] = useState(null);
  const [prevData, setPrevData] = useState({})
  const [userId, setUserId] = useState(null)


  useEffect(() => {
    setTitle("Milestone Predictions");
    if (!apiCalled) {
      setRefereshPage(false)
      getWfhDetails(currentPage);
    }
  }, [currentPage, refereshPage]);

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);

  useEffect(() => {
    setTitle("Milestone Predictions")
    if (userRole) {
      getPredictions();
    }
  }, [userRole]);

  useEffect(() => {
    setTitle("Milestone Predictions")
    const uRole = customFunctions.getLocalStorage('group');
    const userId = customFunctions.getLocalStorage('userId');
    setUserRole(Number(uRole));
    setUserId(Number(userId));

  }, []);


  const getPredictions = async () => {
    setShowLoader(true);
    // const url = `${Api.getEmployees}?type=all&is_only_dev=1&status=active&hide_admin=1`;
    // const { data, error } = await AuthApi.getDataFromServer(url);
    // setShowLoader(false);

    if (userRole) {
      // setPredictions(data.data.reports);
      // setPredictions(data.data.reports);
    } else {
      swal(error || 'Something went wrong', '', 'error');
    }
  };

  console.log("pagination", pagination);

  const getWfhDetails = async (pageNo = 1) => {
    setApiCalled(true);
    setShowLoader(true);

    const params = {
      page: pageNo,
      limit,
      sort_direction: 'descending'
    };

    if (selectedEmployeeId !== 'all_employess') {
      params.employee = selectedEmployeeId;
    }
    if (selectedDate) {
      params.start_date = customFunctions.getDate(selectedDate)
    }

    const url = customFunctions.generateUrl(Api.wfh, params);
    try {
      const { data } = await AuthApi.getDataFromServer(url);
      setShowLoader(false);

      if (data && data.success) {
        const finalData = data.data.map((item, index) => ({
          // no: (pagination.current_page - 1) * 10 + index + 1,
          no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
          id: item.id,
          start_date: item.start_date,
          end_date: item.end_date,
          status: item.status,
          status_name: item.status_name,
          reason: item.reason,
          note: item.note,
          employee_id: item.employee_id,
          employee_name: item.employee_name,
          duration_type: item.duration_type

        }));

        const { current_page, total_count, limit } = data.paginator;
        setRowData(finalData);
        setPagination({
          current_page: parseInt(current_page, 10),
          totalItems: parseInt(total_count, 10),
          itemsPerPage: parseInt(limit, 10),
        });
        setTotalCount(total_count);
        setLimit(Number(limit));
        setCurrentPage(current_page);
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      swal('Error fetching data', '', 'error');
    } finally {
      setShowLoader(false);
      setApiCalled(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getWfhDetails(1);
  };

  const columns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'employee_name',
      label: 'Name',
      render: (row) => row.employee_name || 'N/A',
    },
    {
      id: 'start_date',
      label: 'Start Date',
      render: (row) => row.start_date || 'N/A',
    },
    {
      id: 'end_date',
      label: 'End Date',
      render: (row) => row.end_date,
    },
    // {
    //   id: 'status_name',
    //   label: 'Status',
    //   render: (row) => row.status_name,
    // },
    {
      id: 'reason',
      label: 'Reason',
      render: (row) => row.reason,
    },
    {
      id: 'note',
      label: 'Note',
      render: (row) => row.note ? row.note : '-',
    },
    {
      id: 'status_name',
      label: 'Status',
      render: ({ id, status_name, reason, start_date, end_date, employee_id, status, duration_type }) => {
        return (
          <>
            {/* customFunctions.getDate(new Date()) <= leave_from_date ?  */}

            {status_name === 'Pending' && isProjectManager == false ? (
              <>
                <Image
                  title="Accept"
                  onClick={() => {
                    setWfhId(id);
                    setStatusId(1);
                    setPrevData({
                      "duration_type": duration_type,
                      "reason": reason,
                      "start_date": start_date,
                      "end_date": end_date,
                      "employee_id": employee_id,
                      // "status" : status
                    })
                    setModalShow(true);
                  }}
                  alt="Accept"
                  src="/images/success.svg"
                />
                <Image
                  title="Declined"
                  onClick={() => {
                    setWfhId(id);
                    setStatusId(3);
                    setPrevData({
                      "duration_type": duration_type,
                      "reason": reason,
                      "start_date": start_date,
                      "end_date": end_date,
                      "employee_id": employee_id,
                      // "status" : status
                    })
                    setModalShow(true);
                  }}
                  alt="Declined"
                  src="/images/fail.svg"
                  className="ms-2"
                />
              </>
            ) : (
              <span> {status_name} </span>
            )}
          </>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ id, employee_id, status }) => (
        <>
          {isProjectManager == false && (<>
            <a
              href="/"
              className="ml-1"
              onClick={(e) => {
                e.preventDefault();
                setShowDelete(true);
                setWfhId(id);
              }}
            >
              <Image src="/images/delete.png" alt="Delete" />
            </a>
          </>)
          }

          {
            isProjectManager == true && userId == employee_id && status == 2 && (<>
              <a
                href="/"

                onClick={(e) => {
                  e.preventDefault();
                  history.push("/add-wfh", { state: { wfhId: id } });
                }}
              >
                <Image src="/images/edit.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />

              </a>

              <a
                href="/"
                className="ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDelete(true);
                  setWfhId(id);
                }}
              >
                <Image src="/images/delete.png" alt="Delete" />
              </a>
            </>
            )
          }

        </>
      ),
    },
  ];

  const deleteTask = async () => {
    const url = customFunctions.generateUrl(`${Api.wfh}${wfhId}`);
    const { data } = await AuthApi.deleteDataFromServer(url);
    if (data.success) {
      swal('Deleted successfully', '', 'success').then(() => {
        setShowDelete(false);
        setSelectedEmployee()
        setJoiningDate(null)
        setRefereshPage(true)

      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Milestone Predictions</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <>
            <style>
              {`
      .report-container {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .report-title {
        text-align: center;
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
      .milestone-section {
        margin-bottom: 30px;
      }
      .milestone-title {
        font-size: 20px;
        color: #2c3e50;
        margin-bottom: 10px;
      }
      .milestone-details {
        font-size: 16px;
        color: #34495e;
        line-height: 1.6;
      }
      .suggestions, .recommendations {
        margin-top: 15px;
      }
      .section-title {
        font-size: 18px;
        color: #2980b9;
        margin-bottom: 8px;
      }
      .list {
        margin: 0;
        padding-left: 20px;
      }
      .list-item {
        list-style-type: disc;
        margin-bottom: 5px;
      }
    `}
            </style>
            <div className="report-container">
              <h1 className="report-title">Milestone Analysis Report</h1>

              {/* Milestone 1 */}
              <div className="milestone-section">
                <h2 className="milestone-title">ca-erp prediction ONE</h2>
                <div className="milestone-details">
                  <p><strong>Deadline:</strong> 2024-12-06</p>
                  <p><strong>Completed Tasks:</strong> 9</p>
                  <p><strong>Pending Tasks:</strong> 9</p>
                  <p><strong>Completed Bugs:</strong> 4</p>
                  <p><strong>Pending Bugs:</strong> 4</p>
                  <p><strong>Total Logged Time:</strong> 33 Hrs 45 Mins</p>
                </div>
                <div className="suggestions">
                  <h3 className="section-title">Suggestions</h3>
                  <ul className="list">
                    <li className="list-item">Allocate additional resources to pending tasks to ensure timely completion.</li>
                    <li className="list-item">Conduct a bug-fix session to resolve pending issues faster.</li>
                  </ul>
                </div>
                <div className="recommendations">
                  <h3 className="section-title">Recommendations</h3>
                  <ul className="list">
                    <li className="list-item">Streamline task priorities to focus on high-impact items.</li>
                    <li className="list-item">Introduce daily progress reviews to monitor team efficiency.</li>
                  </ul>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="milestone-section">
                <h2 className="milestone-title">ca-erp prediction TWO</h2>
                <div className="milestone-details">
                  <p><strong>Deadline:</strong> 2024-12-09</p>
                  <p><strong>Completed Tasks:</strong> 8</p>
                  <p><strong>Pending Tasks:</strong> 8</p>
                  <p><strong>Completed Bugs:</strong> 4</p>
                  <p><strong>Pending Bugs:</strong> 4</p>
                  <p><strong>Total Logged Time:</strong> 29 Hrs 15 Mins</p>
                </div>
                <div className="suggestions">
                  <h3 className="section-title">Suggestions</h3>
                  <ul className="list">
                    <li className="list-item">Introduce a sprint for rapid bug fixes to meet deadlines.</li>
                    <li className="list-item">Reduce multitasking to enhance task focus and completion rate.</li>
                  </ul>
                </div>
                <div className="recommendations">
                  <h3 className="section-title">Recommendations</h3>
                  <ul className="list">
                    <li className="list-item">Leverage time management tools to optimize team hours.</li>
                    <li className="list-item">Encourage team collaboration through daily standups.</li>
                  </ul>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="milestone-section">
                <h2 className="milestone-title">Employee Portal Prediction ONE</h2>
                <div className="milestone-details">
                  <p><strong>Deadline:</strong> 2024-12-06</p>
                  <p><strong>Completed Tasks:</strong> 9</p>
                  <p><strong>Pending Tasks:</strong> 9</p>
                  <p><strong>Completed Bugs:</strong> 4</p>
                  <p><strong>Pending Bugs:</strong> 4</p>
                  <p><strong>Total Logged Time:</strong> 36 Hrs 45 Mins</p>
                </div>
                <div className="suggestions">
                  <h3 className="section-title">Suggestions</h3>
                  <ul className="list">
                    <li className="list-item">Assign dedicated resources to accelerate pending task resolution.</li>
                    <li className="list-item">Increase the frequency of progress reviews to identify blockers early.</li>
                  </ul>
                </div>
                <div className="recommendations">
                  <h3 className="section-title">Recommendations</h3>
                  <ul className="list">
                    <li className="list-item">Adopt agile methodologies for quicker milestone achievements.</li>
                    <li className="list-item">Encourage cross-team collaboration to reduce delays.</li>
                  </ul>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="milestone-section">
                <h2 className="milestone-title">Employee Portal Prediction TWO</h2>
                <div className="milestone-details">
                  <p><strong>Deadline:</strong> 2024-12-09</p>
                  <p><strong>Completed Tasks:</strong> 8</p>
                  <p><strong>Pending Tasks:</strong> 8</p>
                  <p><strong>Completed Bugs:</strong> 4</p>
                  <p><strong>Pending Bugs:</strong> 4</p>
                  <p><strong>Total Logged Time:</strong> 36 Hrs 0 Mins</p>
                </div>
                <div className="suggestions">
                  <h3 className="section-title">Suggestions</h3>
                  <ul className="list">
                    <li className="list-item">Plan parallel task completion for critical dependencies.</li>
                    <li className="list-item">Conduct a team-wide bug triage to address critical issues.</li>
                  </ul>
                </div>
                <div className="recommendations">
                  <h3 className="section-title">Recommendations</h3>
                  <ul className="list">
                    <li className="list-item">Reallocate resources to high-priority areas for faster execution.</li>
                    <li className="list-item">Set up a rewards system to boost team morale and productivity.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>

        </Card.Body>
      </Card>

      {showDelete && (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to delete?"
          confirmBtnText="Yes, Delete"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="light"
          onConfirm={() => {
            deleteTask();
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
        />
      )}
    </>
  );
};


export default Predictions;
