/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
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

const AddLateMarks = () => {
  const state = useLocation();
  const lateMarkId = state?.state?.state?.lateMarkId;
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [employeeList, setEmployeeList] = useState();
  const [deurationType, setDurationType] = useState('');
  const [formDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);
  const [lateMark, setLateMark] = useState('')
  const [lateMarkMonth, setLateMarkMonth] = useState('')

  const history = useHistory();

  const [lateMarkCount, setLateMarkCount] = useState([
    {
      label: '0.5',
      value: 0.5,
    },
    {
      label: '1.0',
      value: 1.0,
    },
    {
      label: '1.5',
      value: 1.5,
    },
    {
      label: '2.0',
      value: 2.0,
    },
    {
      label: '2.5',
      value: 2.5,
    },
    {
      label: '3.0',
      value: 3.0,
    },
    {
      label: '3.5',
      value: 3.5,
    },
    {
      label: '3.0',
      value: 3.0,
    },
    {
      label: '3.5',
      value: 3.5,
    }, {
      label: '3.0',
      value: 3.0,
    },
    {
      label: '3.5',
      value: 3.5,
    }, {
      label: '4.0',
      value: 4.0,
    },
    {
      label: '4.5',
      value: 4.5,
    }, {
      label: '5.0',
      value: 5.0,
    },
    {
      label: '5.5',
      value: 5.5,
    },
    {
      label: '6.0',
      value: 6.0,
    },
    {
      label: '6.5',
      value: 6.5,
    },
    {
      label: '7.0',
      value: 7.0,
    },
  ]);

  useEffect(() => {
    if (lateMarkId) {
      getOldData()
      getEmployee();
    }
  }, [lateMarkId])

  useEffect(() => {
    if (!lateMarkId) {
      getEmployee();
    }
  }, []);

  const getOldData = async () => {
    setShowLoader(true);

    const endPoint = `${Api.lateMarks}${lateMarkId}`;
    const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.getDataFromServer(url);

    if (data && data.success === true) {
      console.log("data", data.data);
      setSelectedEmployee({ label: data.data.full_name, value: data.data.user_id })
      setLateMarkMonth(new Date(data.data.late_mark_month))
      setLateMark({ label: String(data.data.late_marks), value: data.data.late_marks })
      setReason(data.data.reason)


      setShowLoader(false);
    }
  }

  const getEmployee = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}?type=all&is_only_dev=1&status=active&hide_admin=1`
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

  const submit = async () => {
    setShowLoader(true);
    const postData = {
      user: selectedEmployee?.value,
      leave_type: leaveType.label,
      reason: reason,
      late_marks: lateMark?.value,
      late_mark_month: customFunctions.getDate(lateMarkMonth),

    };

    let callback = null
    let endPoint = null
    if (lateMarkId) {
      callback = AuthApi.putDataToServer;
      endPoint = `${Api.lateMarks}${lateMarkId}/`;
    } else {
      callback = AuthApi.postDataToServer;
      endPoint = Api.lateMarks;
    }
    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      let message = ""
      if (lateMarkId) {
        message = 'Late mark updated successfully.'
      } else {
        message = 'Late mark added successfully.'
      }
      swal(message, '', 'success').then(() => {
        history.push('/late-marks');
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const isValid = () => {
    if (validator.current.allValid()) {
      submit();
      validator.current.hideMessages();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      // setDisableButton(false);
    }
  };

  
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
            <Col sm={3}>
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
                  'required'
                )}
              />
            </Col>
            <Col sm={3}>
              <DropdownInput
                label="Late Mark Count"
                placeholder="Select count"
                asterisk="*"
                options={lateMarkCount}
                defaultValue={lateMark}
                onSelectHandler={(select) => {
                  setLateMark(select);
                }}
                errorMessage={validator.current.message(
                  'Late Mark Count',
                  lateMark,
                  'required'
                )}
              />
            </Col>
            <Col sm={2}>
              <Datepicker
                className="form-control w-100"
                asterisk="*"
                label="Late Mark Month"
                name={"endDate"}
                placeholder={"Select For Month"}
                showMonthYearPicker={true}
                dateFormat={"MM/yyyy"}
                maxDate={new Date()}
                selected={lateMarkMonth}
                onChange={(date) => {
                  console.log('date', date.month);
                  setLateMarkMonth(date);
                }}
                errorMessage={validator.current.message(
                  'Late Mark Month',
                  lateMarkMonth,
                  'required'
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <TextInput
                label="Reason"
                placeholder="Enter reason"
                type="text"
                as="textarea"
                asterisk="*"
                rows="3"
                value={reason}
                onInputChange={(e) => {
                  setReason(e.target.value);
                }}
                errorMessage={validator.current.message(
                  'reason',
                  reason,
                  'required'
                )}
              />
            </Col>
          </Row>
          <Button
            onClick={() => {
              isValid();
            }}
          >
            Submit
          </Button>
          <Button
            className="ml-3"
            variant="secondary"
            onClick={() => {
              history.push('/late-marks');
            }}
          >
            Cancel
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default AddLateMarks;
