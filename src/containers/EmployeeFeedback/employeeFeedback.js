/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Helmet } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

const items = [{ to: '/', label: 'Home' }, { label: 'Employee Feedback' }];

function EmployeeFeedback() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [empFeedbackdata, setEmpFeedbackdata] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [ShowDelete, setShowDelete] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [pageReferesh,setPageReferesh] = useState(false)
  const [feedbackTitle, setFeedbackTitle] = useState('Team Feedback Details')
  
  useEffect(() => {
    setTitle('Employee Feedback');
    getQuestionList();
  }, []);

  useEffect(() => {
    setTitle('Employee Feedback');
    getQuestionList();
  }, [pageReferesh]);

  useEffect(() => {
    setTitle('Employee Feedback');
    getQuestionList();
  }, [setTable]);

  function getQuarterByString(value){
    if (value == 'April - June'){
        return 1}
    else if (value == 'July - September'){
        return 2}
    else if (value == 'October - December'){
        return 3}
    else{
        return 4
      }
  }

  const getQuestionList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.empFeedbackUrl}`;
    const params = {}
    if (setTable){
      params.is_reviewers_feedback = true
      params.is_show_table= true

    }
    else{
      params.is_personal_feedback = true
      params.is_show_table= true
    }

    const url = customFunctions.generateUrl(endPoint, params);
    console.log('url', url)
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setEmpFeedbackdata(data?.data);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const deleteTask = async (id) => {
  const endPoint = `${Api.empFeedbackUrl}`;
  
  let empId = null
  let quarter = null
  let year = null

  if(empFeedbackdata){
    empFeedbackdata?.length && empFeedbackdata.map((item, index) => {
      if (item.id == id){
        empId   = item.employee_id
        quarter= item.quarter
        year= item.year
      }
    })
  }
  quarter = getQuarterByString(quarter)  
  const params={
    employee_id: empId,
    quarter:quarter,
    year:year,
  }
  const url = customFunctions.generateUrl(endPoint, params);
  const { data } = await AuthApi.deleteDataFromServer(url);
    if (data) {
      swal(data && data?.message[0], '', 'success').then((result) => {
        if (result) {
          setShowDelete(false);
          setTaskId(null);
          setPageReferesh(true)
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee Feedback</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to delete it?"
          error
          showCancel
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
          onConfirm={() => {
            deleteTask(taskId);
            getQuestionList();
            setShowDelete(false)
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You will not be able to revert this!
        </SweetAlert>
      )}

      <section className="content-area">
        <div className="table">
          <div className="card p-2">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0 mt-2">Feedback Details</h5>
              <div className="d-flex align-items-center justify-content-end">
              {!setTable && (
                <a
                  href="#"
                  onClick={() => {
                    setTableToggle(false)
                    history.push('/add-feedback');
                  }}
                  className="btn-link"
                >
                  Add Feedback
                </a>
                )}

                {!setTable ? (<a
                  href="#"
                  onClick={() => {
                    setTableToggle(true)
                  }}
                  className="btn-link ml-3"
                >
                  Team Feedback Details
                </a>):(
                  <a
                  href="#"
                  onClick={() => {
                    setTableToggle(false)
                  }}
                  className="btn-link ml-3"
                >
                  Personal Feedback Details
                </a>
                )}

              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped m-0">
                <thead>
                  <tr>
                    <th scope="col">Sr.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quater</th>
                    <th scope="col">Year</th>
                    <th scope="col">Submission Date</th>
                    <th scope="col">Review Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {empFeedbackdata?.length
                    ? empFeedbackdata.map((item, index) => (
                        <tr key={index + 1}>
                          <td>{index+1}</td>
                          <td>
                            {item?.employee_name ? item?.employee_name : 'N/A'}
                          </td>
                          <td>{item?.quarter ? item?.quarter : 'N/A'}</td>
                          <td>{item?.year ? item?.year : 'N/A'}</td>
                          <td>
                            {item?.submission_date
                              ? item?.submission_date
                              : 'N/A'}
                          </td>
                          <td>
                            {item?.review_status_name
                              ? item?.review_status_name
                              : 'N/A'}
                          </td>
                          <td>
                            <a
                              href={`/add-feedback/${item?.id}`}
                              className="pl-2 me-2"
                              // onClick={() => {
                              //   setPageTypes('edit');
                              // }}
                            >
                              <img src="/images/edit.svg" alt="edit icon" />
                            </a>
                            <a
                              href='\'
                              className="text-decoration-none"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDelete(true);
                                setTaskId(item?.id);
                                console.log('item?.id',item?.id);
                              }}
                            >
                              <img src="/images/delete.png" alt="delete icon" />
                            </a>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default withRouter(EmployeeFeedback);
