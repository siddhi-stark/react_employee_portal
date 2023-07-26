/* eslint-disable */
import React, { useEffect, useState } from 'react';
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

const AddReview = (props) => {
  const { handleModalCLose, reviewEdit, pageType, reviewId } = props;
  const [isShowLoader, setShowLoader] = useState(false);
  const [reviewDate, setReviewDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeList, setEmployeeList] = useState();
  const [feedback, setFeedback] = useState('');
  const [currentUserId, setCurrentUserId] = useState();
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewComments, setReviewComments] = useState('');

  console.log('reviewStatus-----', reviewStatus.value);

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
    if (pageType === 'edit') {
      getReview();
    }
  }, []);

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
    const endPoint = `${Api.employeeReviewUrl}${reviewId}/`;
    const params = {
      employee_id: currentUserId,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success === true) {
      setShowLoader(false);
      console.log('reviewData', data.data.description);
      setReviewDate(new Date(data.data.review_date));
      setSelectedEmployee({
        label: data.data.reviewer.full_name,
      });
      setReviewComments(data.data.comments);
      setFeedback(data.data.description);
      setReviewStatus({
        label: data.data.status_name,
      });
    } else {
      setShowLoader(false);
      swal(message || 'Someting went Wrong', '', 'error');
    }
  };

  const addReview = async () => {
    setShowLoader(true);
    let review_id = reviewId;
    console.log('review_idreview_idreview_id', review_id);
    const postData = {
      employee: currentUserId,
      reviewer: selectedEmployee.value,
      review_date: customFunctions.getDate(reviewDate),
      status: reviewStatus.value,
      comments: reviewComments,
      description: feedback,
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
      });
    } else {
      setShowLoader(false);
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
              placeholder="dd-mm-yyyy"
              dateFormat="dd-MM-yyyy"
              onChange={(e) => {
                setReviewDate(e);
              }}
              //   errorMessage={validator.current.message(
              //     'Joining Date',
              //     joiningDetails.joiningDate,
              //     'required'
              //   )}
            />
          </Col>
          <Col>
            <DropdownInput
              asterisk="*"
              label="Conducted By"
              defaultValue={selectedEmployee}
              options={employeeList}
              onSelectHandler={(select) => {
                setSelectedEmployee(select);
              }}
            />
          </Col>
        </Row>
        <Row>
          {/* <Col>
            <TextInput
              label="Review Feedback"
              type="text"
              as="textarea"
              placeholder="Write review feedback here"
              value={feedback}
              onInputChange={(e) => {
                setFeedback(e.target.value);
              }}
            />
          </Col> */}
          {pageType === 'edit' && (
            <>
              {reviewStatus.value === 2 && (
                <Col>
                  <TextInput
                    label="Review Comments"
                    type="text"
                    as="textarea"
                    placeholder="Write review comment here"
                    value={reviewComments}
                    onInputChange={(e) => {
                      setReviewComments(e.target.value);
                    }}
                  />
                </Col>
              )}
              <Col sm={6}>
                <DropdownInput
                  asterisk="*"
                  label=" Review Status"
                  defaultValue={reviewStatus}
                  options={status}
                  onSelectHandler={(select) => {
                    setReviewStatus(select);
                  }}
                />
              </Col>
            </>
          )}
        </Row>

        <div className="mb-3 mt-3">
          <Button
            onClick={(e) => {
              addReview();
              handleModalCLose(false);
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
              //   reviewEdit(false)
            }}
          >
            Cancel
          </Button>
        </div>
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
