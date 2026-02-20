/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Col, Row } from 'react-bootstrap';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';


const items = [{ to: '/employee-feedback', label: 'Employee WFH' }, { label: 'Add WFH' }];

const AddWfh = () => {
  const history = useHistory();
  const validator = useRef(new SimpleReactValidator());
  const state = useLocation();
  const { id } = useParams();
  const wfhId = state?.state?.state?.wfhId;
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedType, setType] = useState()
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [reason, setReason] = useState()
  const [count, forceUpdate] = useState(0)
  const [isProjectManager, setProjectManager] = useState(false)

  const durationType = [
    { label: "Half Day", value: 1 },
    { label: "Full Day", value: 2 }
  ]

  useEffect(() => {
    setTitle("Add WFH");
  }, []);

  useEffect(() => {
    if (wfhId) {
      getUpdateData()
    }
  }, [wfhId])

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);

  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.wfh}${wfhId}`;
    const url = customFunctions.generateUrl(endPoint);
    const { data, _ } = await AuthApi.getDataFromServer(url);

    if (data && data?.data && data.success) {
      let obj = data.data
      setType({ label: obj.duration_type_name, value: obj.duration_type })
      setReason(obj.reason)
      setFromDate(new Date(obj?.start_date))
      setToDate(new Date(obj?.end_date))
      setShowLoader(false)
    }
    else {
      swal('Error fetching data', '', 'error');
      setShowLoader(false)
    }
  }

  const submitForm = async () => {
    setShowLoader(true);
    const obj = {
      "duration_type": selectedType?.value,
      "start_date": customFunctions.getDate(fromDate),
      "end_date": customFunctions.getDate(toDate),
      'reason': reason,
    }
    setShowLoader(false);
    let response = null
    if (wfhId) {
      let url = `${Api.wfh}${wfhId}/`
      response = await AuthApi.putDataToServer(url, obj);
    } else {
      response = await AuthApi.postDataToServer(Api.wfh, obj);
    }
    let { data, message } = response;
    if (!message) {
      message = response?.data?.message
    }

    if (data) {
      if (wfhId) {
        swal('WFH Updated succesfully. ', '', 'success').then(() => {
          if (isProjectManager) {
            history.push('/wfh');
          } else {
            history.push('/wfh-employees');
          }
        });
      } else {
        swal('WFH Created succesfully. ', '', 'success').then(() => {
          if (isProjectManager) {
            history.push('/wfh');
          } else {
            history.push('/wfh-employees');
          }
        });
      }

    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const applyFilters = () => {
    {
      if (validator.current.allValid()) {
        validator.current.hideMessages()
        submitForm();

      } else {
        validator.current.showMessages()
        forceUpdate(count + 1)
      }
    }
  };

  const clearFilter = () => {
    setType('')
    setFromDate('')
    setToDate('')
    setReason('')
  }

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Add WFH</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0 mt-2 "></h5>
        <Button
          variant="secondary"
          className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
          type="submit"
          onClick={() => {
            if (isProjectManager) {
              history.push('/wfh');
            } else {
              history.push('/wfh-employees');
            }
          }}
        >
          Back
        </Button>
      </div>
      <hr style={{ borderColor: "white" }} />
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col >
              <DropdownInput
                label="Duration Type"
                asterisk="*"
                options={durationType}
                defaultValue={selectedType}
                onSelectHandler={(select) => {
                  setType(select);
                }}
                errorMessage={validator.current.message(
                  'Duration Type',
                  selectedType,
                  'required'
                )}
              />

            </Col>
            <Col>
              <Datepicker
                className="form-control"
                label="From Date"
                asterisk="*"
                selected={fromDate}
                onChange={(e) => {
                  setFromDate(e)
                }}
                autoComplete="off"
                name="fromDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select From Date"
                errorMessage={validator.current.message(
                  'From Date',
                  fromDate,
                  'required'
                )}
              />
            </Col>

            <Col>
              <Datepicker
                className="form-control"
                label="To Date"
                asterisk="*"
                selected={toDate}
                onChange={(e) => {
                  setToDate(e)
                }}
                minDate={fromDate}
                autoComplete="off"
                name="fromDate"
                dateFormat="dd/MM/yyyy"
                placeholder="Select To Date"
                errorMessage={validator.current.message(
                  'To Date',
                  toDate,
                  'required'
                )}
              />
            </Col>
            <div>
              <Form>
                <Form.Group controlId='formSupervision' key={10}>
                  <Form.Label>
                    Reason<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    style={{ height: '100px' }}
                    type='text'
                    placeholder='Enter Reason'
                    name='reason'
                    value={reason}
                    onChange={(e) => {
                      setReason(e?.target?.value)
                    }}
                  />

                </Form.Group>
                <Form.Group controlId={`formSupervision`}></Form.Group>
                <p className='text-danger'>
                  {validator.current.message(
                    'Reason',
                    reason,
                    'required'
                  )}
                </p>
              </Form>
            </div>

          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick={applyFilters}>Submit</Button>
              <Button variant="secondary" onClick={() => { clearFilter() }}
                className='ml-3'>
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default AddWfh;
