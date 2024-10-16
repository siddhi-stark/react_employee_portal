/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Helmet } from '../../components/FormInputs';
import './datesGrid.css';
import { format, getDaysInMonth } from 'date-fns';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import { useHistory, useParams } from 'react-router-dom';
import ProjectTaskList from './projectTaskList';



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


  // Generate all dates of the selected month
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
    setSelectedDate(date);  // Highlight the selected date

    // Navigate to another component/page, passing the date in the URL
    const formattedDate = format(date, 'yyyy-MM-dd');
    history.push(`/report-tasks-list/${projectId}`);  // Example: /report/2024-10-15
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

      // setPagination({
      //   current_page: parseInt(current_page, 10),
      //   totalItems: parseInt(total_count, 10),
      //   itemsPerPage: parseInt(limit, 10),
      // });
      let allPresentDate = []
      data?.data && data.data.length > 0 && data.data.map((item) => {
        allPresentDate.push(item?.report_date)
      })
      setDaydetails(allPresentDate);
      setShowLoader(false);

    } else {
      setShowLoader(false);

      swal(data.message || 'Error fetching data', '', 'error');
    }
  }

  console.log('dayDetails', dayDetails);

  return (
    <>
      <Helmet title={''} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Project Report</h2>
        <Breadcrumb items={''} />
      </div>
      <Loader showLoader={false} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="date-card">
            <h5>Select a Month</h5>
            <DatePicker
              selected={selectedMonth}
              onChange={(date) => {
                setSelectedMonth(date);
                setSelectedDate(null); // reset selected date when month changes
              }}
              maxDate={selectedMonth}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              inline
            />
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {/* <Row> */}
          <div className="dates-grid">
            {dates.map((dateItem) => {
              const isHighlighted = dayDetails.includes(format(dateItem, 'yyyy-MM-dd')); // Check if date is in dayDetails

              return (
                <div
                  key={dateItem}
                  role="button"
                  tabIndex={0}
                  className={`date-item ${selectedDate === dateItem ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={() => handleDateClick(dateItem)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedDate(dateItem);
                    }
                  }}
                  aria-pressed={selectedDate === dateItem}
                >
                  {format(dateItem, 'd')}
                  {isHighlighted && (
                    // <span className="completed-arrow">
                    //   &#x2192; {/* Unicode arrow character or use an image/icon */}
                    // </span>
                    <span className="completed-arrow">
                      &#x2713; {/* Unicode checkmark character */}
                    </span>
                  )}

                  {selectedDate && (
                    history.push('report-task-list',{state:{
                      selectedDate:selectedDate,
                      projectId : projectId
                    }})
                    // <div className="report-section">
                    //   <ProjectTaskList selectedDate={selectedDate} projectId={projectId} />
                    // </div>
                  )}
                  
                </div>
              );
            })}
          </div>
          {/* </Row> */}
        </Card.Body>
      </Card>

    </>
  );
};

export default ProjectReportList;
