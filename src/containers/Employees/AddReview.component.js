/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import { Button, Image, Row, Col } from 'react-bootstrap';
import {
  Helmet,
  ModalInput,
  Datepicker,
  TextInput,
  DropdownInput,
} from '../../components/FormInputs';
import SimpleReactValidator from 'simple-react-validator';

const AddReview = (props) => {
  const {
    handleModalCLose,
    reviewEdit,
    pageType,
    reviewId,
    empId,
    callbackBtn,
  } = props;
  const [isShowLoader, setShowLoader] = useState(false);
  const [reviewDate, setReviewDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeList, setEmployeeList] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  console.log('reviewStatus', reviewStatus);
  const [reviewComments, setReviewComments] = useState(null);
  const [reviewTime, setReviewTime] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [count, forceUpdate] = useState(0);

  const validator = useRef(new SimpleReactValidator());

  const convertDateTimeValue = (time) => {
    let f = new Date();
    const now = new Date();
    f =
      now.getMonth() +
      1 +
      '/' +
      now.getDate() +
      '/' +
      now.getFullYear() +
      ' ' +
      time;
    return new Date(f);
  };

  const status = [
    {
      label: 'Pending',
      value: 1,
    },
    {
      label: 'Completed',
      value: 2,
    },
    // {
    //   label: 'Reject',
    //   value: 3,
    // },
    // {
    //   label: '',
    //   value: '',
    // },
  ];

  useEffect(() => {
    getEmployeeList();
    if (pageType === 'edit' || pageType == 'view') {
      getReview();
    }
  }, [reviewId]);

  useEffect(() => {
    setCurrentUserId(customFunctions.getLocalStorage('candidateId'));
  }, []);

  const getEmployeeList = async () => {
    setShowLoader(true);
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_dropdown=1`
    );

    if (data && data.success === true) {
      setShowLoader(false);
      const employeeName = [];
      data &&
        data.data &&
        data.data.length > 0 &&
        data.data.map((item) => {
          if (empId == item?.id) return;
          employeeName.push({
            label: item.full_name,
            value: item.id,
          });
        });
      setEmployeeList(employeeName);
    } else {
      setShowLoader(false);
      swal(message || 'Something went Wrong', '', 'error');
    }
  };

  const getReview = async () => {
    setShowLoader(true);
    const endPoint = `${Api.employeeReviewUrl}${reviewId}`;
    const params = {
      employee_id: currentUserId,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success === true) {
      setShowLoader(false);
      setReviewDate(new Date(data.data.review_date));
      setSelectedEmployee({
        label: data.data.reviewer.full_name,
      });
      setReviewTime(convertDateTimeValue(data?.data?.review_time));
      setReviewComments(data.data.comments);
      setFeedback(data.data.description);
      setReviewStatus({
        label: data.data.status_name,
      });
    } else {
      setShowLoader(false);
      setReviewComments('');
      swal(message || 'Someting went Wrong', '', 'error');
    }
  };

  const addReviewOfEmp = async () => {
    setShowLoader(true);
    let review_id = reviewId;
    const postData = {
      employee: currentUserId,
      reviewer: selectedEmployee?.value,
      review_date: customFunctions.getDate(reviewDate),
      status: reviewStatus?.value,
      comments: reviewComments,
      description: feedback,
      review_time: customFunctions.getTimeAndSec(reviewTime),
    };

    if (review_id) {
      postData.id = review_id;
    }
    const endPoint = review_id
      ? `${Api.employeeReviewUrl}${review_id}/`
      : `${Api.employeeReviewUrl}`;
    const callback = review_id
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success === true) {
      setShowLoader(false);
      swal(
        review_id ? 'Review update successfully!' : 'Review post successfully!',
        ' ',
        'success'
      ).then(() => {
        handleModalCLose(false);
        props?.callbackBtn(false);
      });
    } else {
      setShowLoader(false);
      swal('Something went wrong', ' ', 'err');
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    if (disableButton) return;
    setDisableButton(true);
    if (validator.current.allValid()) {
      addReviewOfEmp();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };


  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <div className="mt-4 ml-3 mr-3">
        <Row>
          <Col>
            <Datepicker
              peekNextMonth={true}
              showMonthDropdown={true}
              showYearDropdown={true}
              dropdownMode="select"
              label="Review Date"
              className="form-control"
              selected={reviewDate}
              asterisk="*"
              disabled={pageType == 'view'}
              placeholder="dd-mm-yyyy"
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              onChange={(e) => {
                setReviewDate(e);
              }}
              errorMessage={validator.current.message(
                'Review Date',
                reviewDate,
                'required'
              )}
            />
          </Col>
          <Col>
            <Datepicker
              className="form-control"
              label="Start Time"
              asterisk="*"
              dateFormat="h:mm aa"
              timeIntervals={10}
              timeCaption="Time"
              disabled={pageType == 'view'}
              selected={reviewTime ? reviewTime : null}
              onChange={(e) => {
                setReviewTime(e);
              }}
              showTimeSelect="showTimeSelect"
              showTimeSelectOnly="showTimeSelectOnly"
              errorMessage={validator.current.message(
                `Start Timee`,
                reviewTime,
                'required'
              )}
            />
          </Col>
          <Col>
            <DropdownInput
              asterisk="*"
              label="Reviewer Name"
              defaultValue={selectedEmployee}
              options={employeeList}
              disabled={pageType == 'view'}
              onSelectHandler={(select) => {
                setSelectedEmployee(select);
              }}
              errorMessage={validator.current.message(
                `Reviewer Name`,
                selectedEmployee,
                'required'
              )}
            />
          </Col>
        </Row>
        <Row>
          {pageType === 'edit' || pageType == 'view' ? (
            <>
              {reviewStatus?.label == 'Completed' && (
                <Col>
                  <TextInput
                    label="Review Comments"
                    type="text"
                    as="textarea"
                    asterisk="*"
                    disabled={pageType == 'view'}
                    placeholder="Write review comment here"
                    value={reviewComments}
                    onInputChange={(e) => {
                      setReviewComments(e.target.value);
                    }}
                    errorMessage={validator.current.message(
                      `Review comments`,
                      reviewComments,
                      'required'
                    )}
                  />
                </Col>
              )}
              <Col sm={6}>
                <DropdownInput
                  asterisk="*"
                  label=" Review Status"
                  defaultValue={reviewStatus}
                  options={status}
                  disabled={pageType == 'view'}
                  onSelectHandler={(select) => {
                    setReviewStatus(select);
                  }}
                  errorMessage={validator.current.message(
                    `Review Status`,
                    reviewStatus,
                    'required'
                  )}
                />
              </Col>
            </>
          ) : null }
        </Row>

        {pageType != 'view' && (
          <div className="mb-3 mt-3">
            <Button
              onClick={(e) => {
                validateForm(e);
                // handleModalCLose(false);
              }}
            >
              Add Review
            </Button>{' '}
            &nbsp;
            <Button
              className="ml-10"
              variant="secondary"
              onClick={() => {
                handleModalCLose(false);
                // reviewEdit(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
        <hr />
        {/* <div>
          <h5 className="ml-3 mt-5">First Review</h5>
        </div>
        <div className="ml-5">
          <h3>Review Date - {customFunctions.getDMYDate(new Date())}</h3>
        </div>
        <div className="ml-5 mt-3 mb-3">
          <Row>
            <Col>
              <h5>Reviewer name</h5>
            </Col>
            <Col className='d-flex justify-content-end'>
                <h4>Status - Pending</h4>
            </Col>
            <Col className='d-flex justify-content-end'>
                <Image style={{height:'20px',width:'20px'}}
                title='Edit Review'
                    src='/images/edit.png'
                    onClick={()=>{

                    }}
                />
            </Col>
          </Row>
        </div> */}
      </div>
    </>
  );
};

export default AddReview;
