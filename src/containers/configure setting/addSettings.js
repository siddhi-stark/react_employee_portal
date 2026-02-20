/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form, Col, Row } from 'react-bootstrap';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet, TextInput, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';


const items = [{ to: '/employee-feedback', label: 'Employee KRA-KPI' }, { label: 'Fill KRA-KPI' }];

const AddSettings = () => {
  const validator = useRef(new SimpleReactValidator());
  const state = useLocation();
  const history = useHistory();
  const settingId = state?.state?.state?.settingId
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [refereshPage, setRefereshPage] = useState(false);

  const [showTable, setshowTable] = useState(false)
  const [userRole, setUserRole] = useState(null);

  const [showAddPopUp, setAddPopUp] = useState(false)
  const [count, forceUpdate] = useState(0)
  const [message, setMessage] = useState('')
  const [selectedMonth, setSetSelectedMonth] = useState('')
  const [cronTitle, setCronTitle] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [cronDesciption, setCronDesciption] = useState('')
  const [selectedType, setType] = useState();



  const [configureData, setConfigureData] = useState({
    title: "",
    description: "",
    type: "",
    time: ""
  })

  const allType = [
    { label: "Incomplete Estimations Cron", value: 1 },
    { label: "Test One", value: 2 },
    { label: "Test Three", value: 3 },
    { label: "Test Four", value: 4 },
  ]

  useEffect(() => {
    if (settingId) {
      getUpdateData()
    }
  }, [settingId])

  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.configureSetting}${settingId}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data, _ } = await AuthApi.getDataFromServer(url);

    console.log("setShowLoader", data.data);

    if (data && data.success) {
      let item = data?.data
      setType({ label: item?.event_type_name, value: item?.event_type })
      setCronTitle(item?.title)
      setCronDesciption(item?.description)
      setSelectedTime(new Date(item?.event_time))


    }

    setShowLoader(false)
  }

  const submitForm = async () => {
    setShowLoader(true);

    let obj = {
      "title": cronTitle,
      "description": cronDesciption,
      "event_time": selectedTime,
      "event_type": selectedType?.value,
    };

    setShowLoader(false);


    let url = Api.configureSetting
    let response = ''

    if (settingId) {
      url = `${Api.configureSetting}${settingId}`
      response = await AuthApi.putDataToServer(url, obj);
    } else {
      let url = Api.configureSetting
      response = await AuthApi.postDataToServer(url, obj);
    }

    let { data, message } = response;
    if (!message) {
      message = response?.data?.message
    }

    if (data?.success) {
      swal('Setting configure succesfully. ', '', 'success').then(() => {
        history.push('/settings');
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const handleClear = () => {
    history.push('/settings');
  };

  const applyFilters = () => {
    setReset(false)
    getKraKpiDetails(1);
  };

  const clearFilter = () => {
    setFormData({
      departments: '',
      position_level: '',
    });

  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Setting Configuration</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Configure Setting</h5>
              <Button
                variant="secondary"
                className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                type="submit"
                onClick={handleClear}
              >
                Back
              </Button>
            </div>
            <hr style={{ borderColor: "white" }} />

            <Row>
              <Col sm={4}>
                <TextInput
                  onInputChange={(e) => {
                    setCronTitle(e.target.value);
                  }}
                  autocomplete="off"
                  label="Title"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="cronTitle"
                  value={cronTitle}
                  placeholder="Enter Title"
                  errorMessage={validator.current.message(
                    'cronTitle',
                    cronTitle,
                    'required'
                  )}
                />
              </Col>

              <Col sm={4}>
                <TextInput
                  onInputChange={(e) => {
                    setCronDesciption(e.target.value);
                  }}
                  autocomplete="off"
                  label="Desciption"
                  // asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="cronDesciption"
                  value={cronDesciption}
                  placeholder="Enter Description"
                // errorMessage={validator.current.message(
                //   'cronDesciption',
                //   cronDesciption,
                //   'required'
                // )}
                />
              </Col>

              <Col sm={2}>
                <Datepicker
                  label="Time"
                  asterisk="*"
                  className="form-control w-100"
                  name={"cronTime"}
                  placeholder={"Select time"}
                  showTimeSelect={true}
                  showTimeSelectOnly={true}
                  timeIntervals={30}
                  dateFormat={"hh:mm aa"}
                  selected={selectedTime}
                  disabled={false}
                  onChange={(date) => {
                    console.log('date: ', date);

                    setSelectedTime(date);
                  }}
                  errorMessage={validator.current.message(
                    'Time',
                    selectedTime,
                    'required'
                  )}
                />
              </Col>
              <Col sm={2}>
                <DropdownInput
                  label="Event Type"
                  asterisk="*"
                  options={allType}
                  defaultValue={selectedType}
                  onSelectHandler={(select) => {
                    setType(select)
                  }}
                  disabled={false}
                  errorMessage={validator.current.message(
                    'Event Type',
                    selectedType,
                    'required'
                  )}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end p-2">
              <ButtonGroup className="gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (validator.current.allValid()) {
                      setAddPopUp(true);
                    } else {
                      validator.current.showMessages()
                      forceUpdate(count + 1)
                    }
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  className="h4 m-0 text-black rounded-3"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear()
                    setAddPopUp(false);
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>

            </div>
          </Card.Body>
        </Card >
        {showAddPopUp && (
          <SweetAlert
            warning
            showCancel
            title="Are you sure you want to submit?"
            confirmBtnText="Submit"
            cancelBtnBsStyle="light"
            onConfirm={() => {
              submitForm();
              setAddPopUp(false)

            }}
            onCancel={() => {
              setAddPopUp(false)
            }}
          />
        )
        }
      </section >
    </>
  );
}

export default AddSettings;
