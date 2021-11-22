import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import moment from 'moment';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './workloadFormschema.json';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { to: '/employee-activity', label: 'Employee Activity' },
];

function EmployeeActivity(props) {
  const propsData = props;
  const userId =
    propsData.location.state &&
    propsData.location.state.userId;
  const propsDate =
    propsData.location.state &&
    propsData.location.state.date;

  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory(); // eslint-disable-line

  // Declare variable
  const [activityData, setActivityData] = useState([]);
  const [filterData, setFilterData] = useState({});

  // Variable declarations
  const [currentUser, updateCurrentUser] = useState(0);

  // Declare methods
  const getRowData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.employeeActivityUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      sort_by:'created_at',
      sort_direction:'descending',
      user_id: userId && userId,
      start_date: filterList.start_date ? filterList.start_date :customFunctions.getDate(propsDate) ,
      end_date:filterList.end_date ? filterList.end_date :customFunctions.getDate(propsDate),
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setActivityData(data.data);
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
    setTitle('Employee Activity');
  }, [filterData]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    const payload = {
      start_date: formValues.start_date && customFunctions.getDate(formValues.start_date),
      end_date: formValues.end_date && customFunctions.getDate(formValues.end_date),
    };
    setFilterData(payload);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee Activity
       <Button
          className="float-end"
          onClick={() => {
            history.push('/emp-timesheet'); // eslint-disable-line
          }}
        >
          Back
        </Button>
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              </div>
              <hr />
              <div className="filter-box-main">
                <StarkFormBuilder
                  containerClass=""
                  formHeaderClass=""
                  formSections={FormSections}
                  formHeading="workload filter"
                  onFormSubmit={(formValues) => {
                    submitForm(formValues);
                  }}
                  callbacks={{}}
                  currentUser={currentUser}
                  submitBtnText="Apply"
                  showResetBtn={true}
                  resetBtnText="Clear"
                  btnContainerClass="form-submit-buttons pull-right"
                  showBtnClass={true}
                  isStepForm={false}
                  onFormReset={() => {
                    setFilterData({});
                  }}
                />
              </div>
            </Card.Body>
          </Card>
              
          <section className="content-area">
          <div className="row">
            <div className="col-sm-12">
               {/* loop for date */}
              { Object.keys(activityData).length ? Object.entries(activityData).map(([datekey, datevalueobject]) => (
                <section className="card">
                  <div className="purple-bg card-header d-flex align-items-center">
                    <h5 className="card-title mb-0" title="ZS Innovation Lab NEw Project">{datekey && (`${moment(datekey).format('dddd Do MMMM')}`)}</h5>
                  </div>
                  <section className="card-body">
                    {/* emnployee loop */}
                    { Object.keys(datevalueobject).length && Object.entries(datevalueobject).map(([employeeName, taskData]) => (
                      <div className="clearfix">
                        <h5>{employeeName}</h5>
                        <ul className="timeline">
                          {/* task loop */}
                          { Object.keys(taskData).length &&  Object.entries(taskData).map((task) => (
                            <li className={`d-flex align-items-center justify-content-between task task-${task[1].status}`}>  
                                 <h6 title={`${task[1].content}`} className="mb-0 task-name">{task[1].content.substring(0,40)} ({task[1].project__name})</h6>
                                 <div className="d-flex align-items-center">
                                    <h6 className="mr-5"> ETA: {task[1].estimation}</h6>
                                    <h6>Status: {task[1].progress && task[1].progress}%
                                      {task[1].progress === 100 ? (` ( ${task[1].hours_sum && task[1].hours_sum}) `) :''}
                                    </h6>
                                 </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>
                </section>
              )) : <Card body className="d-flex align-items-center justify-content-between"> <span>No record found.</span></Card>}           
            </div>
            </div>
            </section>
        </div>
      </section>
    </>
  );
}

export default withRouter(EmployeeActivity);
