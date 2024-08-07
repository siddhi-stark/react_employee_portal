/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Row, Col, Button, Container, Card } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { useHistory, useParams } from 'react-router-dom'; // Import useHistory
import Loader from '../../components/Loader/index';
import {
  Helmet,
  DropdownInput,
  TextInput,
  ModalInput,
  Datepicker,
} from '../../components/FormInputs';

const FormAbscondTermination = () => {
  //for breadcrumbs
  const items = [
    { to: '/', label: 'Home' },
    { to: '/abscound-table', label: 'Terminate and Abscond' },
    { label: 'Terminate and Abscond Form' },
  ];

  const [formData, setFormData] = useState({
    resignationType: '',
  });
  const { aid } = useParams();
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory(); // Initialize useHistory
  const validator = useRef(new SimpleReactValidator({}));
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeList, setEmployeeList] = useState('');
  const [selectedResignationType, setSelectedResignationType] = useState(''); //for placeholder name change
  const [abscondDateFrom, setAbscondDateFrom] = useState('');
  const [abscondDateTo, setAbscondDateTo] = useState('');
  const [reportingDate, setReportingDate] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [resignationType, setResignationType] = useState(''); // State for resignationType

  const resignationOptions = [
    { label: 'Abscond', value: 1 },
    { label: 'Terminate', value: 3 },
  ];

  // const handleResignationTypeChange = (selectedOption) => {
  //   setResignationType(selectedOption);

  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'resignationType') {
      const selectedOption = resignationOptions.find(option => option.value === parseInt(value, 10));
      setFormData({ ...formData, resignationType: selectedOption });
      setSelectedResignationType(selectedOption.label);
      setResignationType(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleClear = () => {
    setFormData({
      resignationType: '',
    });
    history.push('/abscond-table');
    validator.hideMessages();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      addData();
    } else {
      setFormData({ ...formData });

      validator.current.showMessages();
    }
  };

  const currentDate = new Date();
  const minFromDate = new Date();
  minFromDate.setDate(minFromDate.getDate() - 365); // Set minimum date to yesterday for "Absent From Date"

  useEffect(() => {
    if (aid) {
     
      fetchAbscondDetails(aid);
    }
  }, [aid]);

  const fetchAbscondDetails = async (aId) => {
    setShowLoader(true);
    try {
      const response = await AuthApi.getDataFromServer(
        `${Api.employeeAbscond}${aId}`
      );
      const { data, message } = response;
    
      if (data && data.success) {
        setSelectedEmployee({
          label: data.data.employee_full_name,
        });
        setAbscondDateFrom(new Date(data.data.absent_from_date));
        setAbscondDateTo(new Date(data?.data?.absent_to_date));
        setReportingDate(new Date(data?.data?.notice_date));
        setEffectiveDate(new Date(data?.data?.relieving_date));
        setReason(data?.data?.reason);
          const selectedOption = resignationOptions.find(option => option.value === data?.data?.resignation_type);
        setFormData({ ...formData, resignationType: selectedOption });
        setSelectedResignationType(selectedOption.label);
        setResignationType(data?.data?.resignation_type);
        // setResignationType({
        //   label:data?.data?.resignation_type_name,
        //   value:data?.data?.resignation_type,
        // });
      } else {
        swal(message, '', 'error');
      }
    } catch (error) {
      swal(error.message, '', 'error');
    } finally {
      setShowLoader(false);
    }
  };

 
  useEffect(() => {
    getEmployeeList();
  }, []);

  const getEmployeeList = async () => {
    setShowLoader(true);

    try {
      const response = await AuthApi.getDataFromServer(
        `${Api.employeeUrl}?type=all&status=active&show_self=1&hide_admin=1&
        is_onboard=true`
      );

      if (response.data && response.data.success) {
        const employees = response.data.data.map((item) => ({
          label: item.full_name,
          value: item.id,
        }));

        setEmployeeList(employees);
      } else {
        swal(response.data.message || 'Something went wrong', '', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to fetch employees', 'error');
    } finally {
      setShowLoader(false);
    }
  };

 
  const addData = async () => {
    // setShowLoader(true);

    const postData = {
      employee: selectedEmployee?.value,

      resignation_type: formData?.resignationType?.value,
    };
  
    if (formData?.resignationType?.value == '3') {
      (postData.relieving_date =
        effectiveDate && customFunctions.getDate(effectiveDate)),
        (postData.reason = reason);
      postData.abscound_status = 2;
    }
    if (formData?.resignationType?.value == '1') {
      postData.absent_from_date =
        abscondDateFrom && customFunctions.getDate(abscondDateFrom);
      postData.absent_to_date =
        abscondDateTo && customFunctions.getDate(abscondDateTo);
      postData.reporting_date =
        reportingDate && customFunctions.getDate(reportingDate);
      postData.abscound_status = 1;
    }
    
    const callback = aid ? AuthApi.putDataToServer : AuthApi.postDataToServer;
    const endPoint = aid
      ? `${Api.employeeAbscond}${aid}/`
      : `${Api.employeeAbscond}`;

    const { data, message } = await callback(endPoint, postData);

    if (data) {
      setShowLoader(false);
      validator.current.hideMessages();
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          history.push('/abscond-table');
        }
      });
    } else {
      setShowLoader(false);
      swal('Something wents Wrong', '', 'error');
    }
  };

 

  return (
    <Container>
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">
          Termination and Abscond Form
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card className="mt-5 p-3">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <DropdownInput
                asterisk="*"
                label="Employee Name"
                defaultValue={selectedEmployee}
                options={employeeList}
                //   disabled={pageType == 'view'}
                onSelectHandler={(select) => {
                  setSelectedEmployee(select);
                }}
                errorMessage={validator.current.message(
                  `Employee Name`,
                  selectedEmployee,
                  'required'
                )}
              />
            </Col>
            <Col>
              <DropdownInput
                asterisk="*"
                label="Resignation Type"
                defaultValue={formData?.resignationType}
                options={resignationOptions}
                onSelectHandler={(select) => {
                  handleChange({ target: { name: 'resignationType', value: select.value } });
                }}
                errorMessage={validator.current.message(
                  `Resignation Type`,
                  formData?.resignationType,
                  'required'
                )}
              />
            </Col>
          </Row>
          {resignationType == '1' && (
            <Row className="mb-3">
              <Col>
                <Datepicker
                  peekNextMonth={true}
                  showMonthDropdown={true}
                  showYearDropdown={true}
                  dropdownMode="select"
                  label="Select Absent Date From"
                  className="form-control"
                  selected={abscondDateFrom}
                  asterisk="*"
                  // disabled={pageType == 'view'}
                  placeholder="select absentDateFrom "
                  dateFormat="dd/MM/yyyy"
                  minDate={minFromDate} // Set min date to yesterday
                  maxDate={currentDate} // Set max date to today for "Absent To Date"
                  onChange={(e) => {
                    setAbscondDateFrom(e);
                  }}
                  errorMessage={validator.current.message(
                    'abscondDateFrom',
                    abscondDateFrom,
                    'required'
                  )}
                />
              </Col>
              <Col>
                <Datepicker
                  className="form-control"
                  label="Select Absent Date To"
                  asterisk="*"
                  selected={abscondDateTo}
                  onChange={(e) => {
                    setAbscondDateTo(e);
                  }}
                  autoComplete="off"
                  name="abscondDateTo"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select absentDateTo"
                  minDate={abscondDateFrom || minFromDate} // Disable future dates and dates before Abscond Date From
                  maxDate={currentDate} // Set max date to today for "Absent To Date"
                  errorMessage={validator.current.message(
                    'abscondDateTo',
                    abscondDateTo,
                    'required'
                  )}
                />
              </Col>
              <Col>
                <Datepicker
                  className="form-control"
                  label="Select Reporting date"
                  asterisk="*"
                  selected={reportingDate}
                  onChange={(e) => {
                    // const temData = { ...formData };
                    // temData.reportingDate = e;
                    setReportingDate(e);
                    // setReportDate(date);
                  }}
                  autoComplete="off"
                  name="reportingDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select Reporting date"
                  minDate={new Date()} // Allow selecting today and onward
                  errorMessage={validator.current.message(
                    'reportingDate',
                    reportingDate,
                    'required'
                  )}
                />
              </Col>
            </Row>
          )}
          {resignationType == '3' && (
            <Row>
              <Col>
                <Datepicker
                  className="form-control"
                  label="Select Effective date"
                  asterisk="*"
                  selected={effectiveDate}
                  onChange={(e) => {
                    // const temData = { ...formData };
                    // temData.effectiveDate = e;
                    setEffectiveDate(e);
                    // setReliveDate(date);
                  }}
                  autoComplete="off"
                  name="effectiveDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select Effective date"
                  minDate={new Date()}
                  errorMessage={validator.current.message(
                    'effectiveDate',
                    effectiveDate,
                    'required'
                  )}
                />
              </Col>
              <Col>
                <TextInput
                  label=" Reason"
                  placeholder="Enter reason for termination"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="3"
                  value={reason}
                  onInputChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Send Notice
              </Button>{' '}
              <Button
                variant="secondary"
                onClick={() => history.push('/abscond-table')}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default FormAbscondTermination;
