/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Helmet } from '../../components/FormInputs';
// import './datesGrid.css';
import { format, getDaysInMonth } from 'date-fns';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import { useHistory, useParams } from 'react-router-dom';

const items = [{ to: '/', label: 'Home' }, { label: 'Project Reports' }];

// DateCard Component
const ProjectReportList = () => {
  const history = useHistory();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [dayDetails, setDaydetails] = useState([]);
  const { id } = useParams();
  const [projectId, setProjectId] = useState(id);
  const UserID = customFunctions.getLocalStorage('userId');
  const [isShowLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const allDates = Array.from({ length: daysInMonth }, (_, i) =>
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i + 1)
    );
    setDates(allDates);
  }, [selectedMonth]);

  useEffect(() => {
    if (selectedMonth) {
      getEachDayDetails()
    }
  }, [selectedMonth])

  const handleDateClick = (date) => {
    setSelectedDate(date);  
    const formattedDate = format(date, 'yyyy-MM-dd');
    history.push(`/report-tasks-list/${projectId}`, { state: { formattedDate: formattedDate } });  // Example: /report/2024-10-15
  };

  const getEachDayDetails = async () => {
    setShowLoader(true);

    const params = {
      project: projectId,
      user: UserID,
      type: 'all'
    };

    // if (filterDate.getDate() !== today.getDate()) {
    //   params.end_date = start_date
    // }

    const url = customFunctions.generateUrl(Api.reportTaskList, params);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      const { current_page, total_count, limit } = data.paginator;
      console.log("hello", data?.data);
      let allPresentDate = []
      data?.data && data.data.length > 0 && data.data.map((item) => {
        allPresentDate.push({ "date": item?.report_date, "reportType": item?.report_type, "morningMail": item?.morning_mail, "eveningMail": item?.evening_mail })
      })
      setDaydetails(allPresentDate);
      setShowLoader(false);

    } else {
      setShowLoader(false);

      swal(data.message || 'Error fetching data', '', 'error');
    }
  }

  console.log('dayDetails', dayDetails);

  const getReportsForDate = (dateItem) => {
    const formattedDate = format(dateItem, 'yyyy-MM-dd');
    const reportsForDate = dayDetails.filter(detail => detail.date === formattedDate);
    return reportsForDate;
  };


  return (
    <>
      <Helmet title={''} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Reports</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={false} needFullPage={false} />
      <Card>
        <Card.Body>
          <section className="content-area">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Report Submitted Daywise.</h5>
              <Button
                variant="secondary"
                className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  { history.push(`/team-project/${projectId}`) }

                }}
              >
                Back
              </Button>
            </div>
            <hr style={{ borderColor: "white" }} />
            <div className="date-card">
              <h5>Select a Month</h5>
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => {
                  setSelectedMonth(date);
                  setSelectedDate(null); // reset selected date when month changes
                }}
                maxDate={new Date()}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                inline
              />
            </div>
          </section>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {/* <section className="content-area"> */}
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Calendar</h5>
          </div>
          <hr style={{ borderColor: "white" }} />
          {/* <Row> */}
          <div className="dates-grid">
            {dates.map((dateItem) => {

              // const isHighlighted = dayDetails.includes(format(dateItem, 'yyyy-MM-dd')); // Check if date is in dayDetails
              const reportsForDate = getReportsForDate(dateItem);

              return (
                <div
                  key={dateItem}
                  role="button"
                  tabIndex={0}
                  className={`date-item ${reportsForDate.length === 1 ? 'single-object' : ''} ${reportsForDate.length === 2 ? 'two-objects' : 'zero-object'}`}
                  onClick={() => handleDateClick(dateItem)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedDate(dateItem);
                    }
                  }}
                  aria-pressed={selectedDate === dateItem}
                >
                  {format(dateItem, 'd')}
                  {reportsForDate.length === 2 && (
            
                    <span className="completed-arrow">
                      &#x2713; 
                    </span>
                  )}
                  {reportsForDate.length === 2 && (
                    <span className="completed-arrow">
                      &#x2713; 
                    </span>
                  )}

                  {reportsForDate.length === 0 && (format(dateItem, 'yyyy-MM-dd')) <= (format(new Date(), 'yyyy-MM-dd')) && (dateItem.getDay() !== 0) && (dateItem.getDay() !== 6) && (
                    <>
                      <div class="date-item zero-object">
                        <span> Reports Are Peanding.<br />😟</span>
                      </div>
                    </>
                  )}

                  {reportsForDate.length === 0 && (format(dateItem, 'yyyy-MM-dd')) > (format(new Date(), 'yyyy-MM-dd')) && (dateItem.getDay() !== 0) && (dateItem.getDay() !== 6) && (
                    <>
                      <div class="date-item upcoming-day">
                        <span> Up-Coming Day.<br />🔜 </span>
                      </div>
                    </>
                  )}

                  {reportsForDate.length === 0 && ((dateItem.getDay() === 0) || (dateItem.getDay() === 6)) && (
                    <div class="date-item week-ends">
                      <span> It's Weekends.🗒️</span>
                    </div>
                  )}
                  
                  {reportsForDate.length === 1 && (
                    <div class="date-item single-object">
                      <span>Morning Report Sent.😊</span>
                    </div>
                  )}

                  {reportsForDate.length === 2 && (
                    <div class="date-item two-objects">
                      <span>Both Reports Sent.😌</span>
                    </div>
                  )}


                  {selectedDate && (
                    history.push('report-task-list', {
                      state: {
                        selectedDate: selectedDate,
                        projectId: projectId
                      }
                    })
                  )}

                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

    </>
  );
};

export default ProjectReportList;
