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

const FormAbscond = () => {
  //for breadcrumbs
  const items = [
    { to: '/', label: 'Home' },
    { to: '/abscound-table', label: 'Terminate and Abscond' },
    { label: 'Terminate and Abscond Form' },
  ];

  const [formData, setFormData] = useState({
    resignationType: '',
    abscondDateFrom: '',
    abscondDateTo: null,
    reportingDate: '',
    effectiveDate: '',
    reason: '',
  });
  const { aid } = useParams();
  const [isShowLoader, setShowLoader] = useState(false);
  const history = useHistory(); // Initialize useHistory
  const validator = useRef(new SimpleReactValidator({}));
  const [employeeList, setEmployeeList] = useState('');
  const [resignationType, setResignationType] = useState('');
  const [selectedResignationType, setSelectedResignationType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [abscondDateFrom, setAbscondDateFrom] = useState(null); // State for abscondDateFrom
  const [minFromDate] = useState(new Date()); // Minimum date (e.g., today) for DatePicker
  const [currentDate] = useState(new Date());
  const [options, setOptions] = useState({ full_name: [] });
  let filterOptions = {};
  const handleChange = (date) => {
    setAbscondDateFrom(date); // Update abscondDateFrom state
  };

  const handleChangeResignation = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    //placeholder name change
    if (name === 'resignationType') {
      setSelectedResignationType(value);
    }
  };

  const handleClear = () => {
    setFormData({
      resignationType: '',
      abscondDateFrom: '',
      abscondDateTo: '',
      reportingDate: '',
      effectiveDate: '',
      reason: '',
    });
    history.push('/abscond-table');
    validator.hideMessages();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      addData();
    } else {
      // Force re-render to show error messages
      setFormData({ ...formData });

      validator.current.showMessages();
    }
  };

  //   const currentDate = new Date();
  //   const minFromDate = new Date();
  minFromDate.setDate(minFromDate.getDate() - 365); // Set minimum date to yesterday for "Absent From Date"

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
        // setResignationType({
        //     label:data?.data?.resignation_type_name,
        //   });

        setFormData({
          resignationType: {
            label: data?.data?.resignation_type_name,
            value: data?.data?.resignation_type,
          },
          abscondDateFrom: data?.data?.absent_from_date,
          abscondDateTo: data?.data?.absent_to_date,
          reportingDate: data?.data?.notice_date,
          // effectiveDate: data?.data?.relieving_date,
          // reason: data?.data?.reason,
        });
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
    if (aid) {
      fetchAbscondDetails(aid);
    }
  }, [aid]);

  const addData = async () => {
    setShowLoader(true);

    const postData = {
      employee: selectedEmployee?.value,
      // abscound_status: formData.status,
      resignation_type: selectedResignationType?.value,
    };
    if (formData.resignationType === '3') {
      (postData.relieving_date =
        formData?.effectiveDate &&
        customFunctions.getDate(formData?.effectiveDate)),
        (postData.reason = formData.reason);
      postData.abscound_status = 2;
    }
    if (formData.resignationType === '1') {
      postData.absent_from_date =
        formData?.abscondDateFrom &&
        customFunctions.getDate(formData?.abscondDateFrom);
      postData.absent_to_date =
        formData?.abscondDateTo &&
        customFunctions.getDate(formData?.abscondDateTo);
      postData.reporting_date =
        formData?.reportingDate &&
        customFunctions.getDate(formData?.reportingDate);
      postData.abscound_status = 1;
    }

    const callback = aid ? AuthApi.putDataToServer : AuthApi.postDataToServer;
    // const { data } = await AuthApi.postDataToServer(
    //   `${Api.employeeAbscond}`,
    //   postData
    // );
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

  const getEmployeeList = async () => {
    setShowLoader(true);

    try {
      const response = await AuthApi.getDataFromServer(
        `${Api.employeeUrl}?type=all&status=active&show_self=1`
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

  useEffect(() => {
    getEmployeeList();
  }, []);

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
                  `Reviewer Name`,
                  selectedEmployee,
                  'required'
                )}
              />
            </Col>

            {/* <DropdownInput
              asterisk="*"
              label="Resignation Type"
              defaultValue={selectedResignationType}
              options={resignationTypeOptions}
            //   disabled={pageType == 'view'}
              onSelectHandler={(select) => {
                setSelectedResignationType(select);
              }}
              errorMessage={validator.current.message(
                `Resignation Type`,
                selectedResignationType,
                'required'
              )}
            /> */}

            <Form.Group as={Col} controlId="resignationType">
              <Form.Label>
                Select Resignation Type<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="select"
                name="resignationType"
                value={formData.resignationType}
                onChange={handleChangeResignation}
              >
                <option value="" hidden>
                  Select Resignation Type
                </option>
                <option value="1">Abscond</option>
                <option value="3">Terminate</option>
              </Form.Control>
              <span className="text-danger">
                {validator.current.message(
                  'resignationType',
                  formData.resignationType,
                  'required'
                )}
              </span>
            </Form.Group>
          </Row>
          <Row>
            {/* <Col>
            {formData.resignationType === '1' && (

            )}
            </Col> */}
          </Row>
          {formData.resignationType === '1' && (
            <Row className="mb-3">
              <Col>
                {/* <Datepicker
                  className="form-control"
                  label="Select Abscond Date From"
                  asterisk="*"
                  selected={formData.abscondDateFrom}
                  onChange={(e) => {
                    const temData = { ...formData };
                    temData.abscondDateFrom = e;
                    setFormData(temData);
                    (date) => handleChange('abscondDateFrom', date);
                  }}
                  autoComplete="off"
                  name="abscondDateFrom"
                  dateFormat="dd/MM/yyyy"
                  minDate={minFromDate} // Set min date to yesterday
                  maxDate={currentDate} // Set max date to today for "Absent To Date"
                  placeholder="Select abscondDateFrom date"
                  errorMessage={validator.current.message(
                    'abscondDateFrom',
                    formData.abscondDateFrom,
                    'required'
                  )}
                /> */}
                <Datepicker
                  className="form-control"
                  label="Select Abscond Date From"
                  selected={abscondDateFrom}
                  onChange={handleChange}
                  autoComplete="off"
                  name="abscondDateFrom"
                  dateFormat="dd/MM/yyyy"
                  minDate={minFromDate} // Set min date to today
                  maxDate={currentDate} // Set max date to today
                  placeholder="Select abscondDateFrom date"
                />
              </Col>
              <Col>
                <Datepicker
                  className="form-control"
                  label="Select Abscond Date To"
                  asterisk="*"
                  selected={formData.abscondDateTo}
                  onChange={(e) => {
                    const temData = { ...formData };
                    temData.abscondDateTo = e;
                    setFormData(temData);
                    (date) => handleChange('abscondDateTo', date);
                  }}
                  autoComplete="off"
                  name="abscondDateTo"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select abscondDateTo date"
                  minDate={formData.abscondDateFrom || minFromDate} // Disable future dates and dates before Abscond Date From
                  maxDate={currentDate} // Set max date to today for "Absent To Date"
                  errorMessage={validator.current.message(
                    'abscondDateTo',
                    formData.abscondDateTo,
                    'required'
                  )}
                />
              </Col>
              <Col>
                <Datepicker
                  className="form-control"
                  label="Select Reporting date"
                  asterisk="*"
                  selected={formData?.reportingDate}
                  onChange={(e) => {
                    const temData = { ...formData };
                    temData.reportingDate = e;
                    setFormData(temData);
                    // setReportDate(date);
                  }}
                  autoComplete="off"
                  name="reportingDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select Reporting date"
                  minDate={new Date()} // Allow selecting today and onward
                  errorMessage={validator.current.message(
                    'reportingDate',
                    formData.reportingDate,
                    'required'
                  )}
                />
              </Col>
            </Row>
          )}
          <Row>
            {/* <Col>
                  <Datepicker
                className="form-control"
                label="Select Reporting date"
                asterisk="*"
                selected={formData.reportingDate}
                onChange={(e) => {
                  const temData = { ...formData };
                  temData.reportingDate = e;
                  setFormData(temData);
                  // setReportDate(date);
                }}
                autoComplete="off"
                name="reportingDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select Reporting date"
                minDate={new Date()} // Allow selecting today and onward
                errorMessage={validator.current.message(
                  'reportingDate',
                  formData.reportingDate,
                  'required'
                )}
              />
            </Col> */}
          </Row>
          {/* )} */}

          {formData.resignationType === '3' && (
            <Row>
              <Col>
                <Datepicker
                  className="form-control"
                  label="Select Effective date"
                  asterisk="*"
                  selected={formData.effectiveDate}
                  onChange={(e) => {
                    const temData = { ...formData };
                    temData.effectiveDate = e;
                    setFormData(temData);
                    // setReliveDate(date);
                  }}
                  autoComplete="off"
                  name="effectiveDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select Effective date"
                  minDate={new Date()} // Allow selecting today and onward
                  errorMessage={validator.current.message(
                    'effectiveDate',
                    formData.effectiveDate,
                    'required'
                  )}
                />
              </Col>
              <Col>
                <TextInput
                  placeholder="Reason for Terminate"
                  label="Reason"
                  asterisk="*"
                  type="text"
                  as="textarea"
                  rows="5"
                  value={formData.reason}
                  maxlength={255}
                  onInputChange={(e) => {
                    setFormData({
                      ...formData,
                      reason: e.target.value,
                    });
                  }}
                  errorMessage={validator.current.message(
                    'reason',
                    formData.reason,
                    'required'
                  )}
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

export default FormAbscond;
