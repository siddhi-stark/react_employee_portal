/* eslint-disable */
import React, { useState, useEffect,useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card, Row, Col, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import {
  Datepicker,
  DropdownInput,
  Helmet,
  TextInput,
} from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import SimpleReactValidator from 'simple-react-validator';

const AccountAddleaveComponent = () => {
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [employeeList, setEmployeeList] = useState();
  const [deurationType, setDurationType] = useState('');
  const [formDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);

  const limit = 10;
  const history = useHistory();

  const [leavetype, setType] = useState([
    {
      label: 'Casual Leave',
      value: '1',
    },
    {
      label: 'Sick Leave',
      value: '2',
    },
  ]);

  const [duration, setDuration] = useState([
    {
      label: 'Half Day',
      value: '1',
    },
    {
      label: 'Full  Day',
      value: '2',
    },
  ]);

  useEffect(() => {
    getEmployee();
  }, []);
  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_dropdown=1`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      const employess = [];
      data.data &&
        data.data.map((item) => {
          employess.push({
            label: item?.full_name,
            value: item?.id,
          });
        });
      setEmployeeList(employess);
    }
  };

  const ApplyLeave = async () => {
    setShowLoader(true);
    const postData = {
      user_id: selectedEmployee?.value,
      leave_type: leaveType.label,
      reason: leaveReason,
      leave_from_date: customFunctions.getDate(formDate),
      leave_from_type: deurationType.value,
      leave_to_type: leaveType.value,
      leave_to_date: customFunctions.getDate(toDate),
    };
    console.log('🚀 ~ ApplyLeave ~ postData:', postData);

    const callback = AuthApi.postDataToServer;
    const endPoint = Api.leavesUrl;
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal('Leave applied successfully', '', 'success').then(() => {
        history.push('/accountant-leaves');
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

const isValid = () =>{
  if (validator.current.allValid()) {
    ApplyLeave();
    validator.current.hideMessages()
  } else {
    validator.current.showMessages();
    forceUpdate(count + 1);
    // setDisableButton(false);
  }
}

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Leave Application</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col>
              <DropdownInput
                label="Select Employee"
                asterisk="*"
                placeholder="Select employee"
                options={employeeList}
                defaultValue={selectedEmployee}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                }}
                errorMessage={validator.current.message(
                  'employee',
                  selectedEmployee,
                  'required|email'
                )}
              />
            </Col>
            <Col>
              <DropdownInput
                label="Leave Type"
                placeholder="Select type"
                asterisk="*"
                options={leavetype}
                defaultValue={leaveType}
                onSelectHandler={(select) => {
                  setLeaveType(select);
                }}
                errorMessage={validator.current.message(
                  'leave type',
                  leaveType,
                  'required|email'
                )}
              />
            </Col>
            <Col>
              <TextInput
                label="Reason"
                placeholder="Enter reason"
                type="text"
                as="textarea"
                asterisk="*"
                rows="3"
                value={leaveReason}
                onInputChange={(e) => {
                  setLeaveReason(e.target.value);
                }}
                errorMessage={validator.current.message(
                  'reason',
                  leaveReason,
                  'required|email'
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <DropdownInput
                label="Duration Time"
                asterisk="*"
                options={duration}
                defaultValue={deurationType}
                onSelectHandler={(select) => {
                  setDurationType(select);
                }}
                errorMessage={validator.current.message(
                  'duration type',
                  deurationType,
                  'required|email'
                )}
              />
            </Col>
            <Col>
              <Datepicker
                className="form-control"
                label="From Date"
                asterisk="*"
                autoComplete="off"
                name="fromDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select from date"
                selected={formDate}
                onChange={(e) => {
                  setFromDate(e);
                }}
                errorMessage={validator.current.message(
                  'from date',
                  formDate,
                  'required|email'
                )}
              />
            </Col>
            <Col>
              <Datepicker
                className="form-control"
                label="To Date"
                asterisk="*"
                autoComplete="off"
                name="toDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select from date"
                selected={toDate}
                onChange={(e) => {
                  setToDate(e);
                }}
                errorMessage={validator.current.message(
                  'to date',
                  toDate,
                  'required|email'
                )}
              />
            </Col>
          </Row>

          <Button
            onClick={() => {
              isValid();
            }}
          >
            Apply
          </Button>
          <Button
            className="ml-3"
            variant="secondary"
            onClick={() => {
              history.push('/accountant-leaves');
            }}
          >
            Cancle
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default AccountAddleaveComponent;
