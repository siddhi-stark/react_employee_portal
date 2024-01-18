/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import {
  Helmet,
  DropdownInput,
  TextInput,
  Datepicker,
} from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const ResignationDetails = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const [count, forceUpdate] = useState(0);
  const [managerDeclineToggle, setManagerDeclineToggle] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);

 


  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation-details' }];

  const [documentsList, setDocumentList] = useState([
    {
      name: 'Exit Form',
      isCheck: false,
    },
    {
      name: 'Feedback Form',
      isCheck: false,
    },
    {
      name: 'Handover Document',
      isCheck: false,
    },
    {
      name: 'Experience Letter',
      isCheck: false,
    },
    {
      name: 'Exit Interview Documents',
      isCheck: false,
    },
    {
      name: 'Relieving Document',
      isCheck: false,
    },
    {
      name: 'Other Document',
      isCheck: false,
    },
  ]);

console.log("documentsList",documentsList);

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    ,
  ];

  useEffect(() => {
    getResignationDetails();
  }, []);

  const getResignationDetails = async () => {
    setShowLoader(true);
    const endPoint = `${Api.getResignationListUrl}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      setRowData(data.data);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const updateResignation = async () =>{

  }

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Resignation From Employees
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Row>
            <Col sm={4}>
              <h5>Employee details</h5>
              <Table
                columns={columns}
                // rows={rows}
                showPagination
                // paginationProps={{
                //   ...pagination,
                //   activePage: pagination.current_page,
                //   onPageChange: (pageNo) => {
                //     getReports(pageNo);
                //   },
                // }}
                tableClass="table-striped"
                dropdownContainerClass="mb-3"
                emptyRender={() => (
                  <p className="text-center mb-0">No record found</p>
                )}
              />
            </Col>
            <Col sm={8}>
              <h5 className="d-flex justify-content-start">
                Resignation Intimation
              </h5>
              <h6 className="d-flex justify-content-start">
                <b>The reason {rowData[0]?.user?.full_name} has applied for resignation</b>
              </h6>
              <Alert className="" variant="secondary">
                <Alert.Heading>
                  <h6>{rowData[0]?.resignation_reason}</h6>
                </Alert.Heading>
              </Alert>
              <TextInput
                label="Enter Remarks"
                placeholder="Type here..."
                type="text"
                as="textarea"
                rows="5"
                // value={resignationReason}
                maxlength={100}
              />
              <div>
                <h6>
                  <b>Remarks form the reporting manager</b>
                </h6>
                <Alert className="" variant="secondary">
                  <Alert.Heading>
                    <h6>{rowData[0]?.resign_remark ? rowData[0]?.resign_remark : ""}</h6>
                  </Alert.Heading>
                </Alert>
              </div>

              <Row>
                <Col>
                  <Button
                  onClick={()=>{

                  }}
                  >Approve</Button>
                </Col>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setManagerDeclineToggle(true);
                    }}
                  >
                    Decline
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            {managerDeclineToggle && (
              <TextInput
                label="Reason for decline"
                type="text"
                as="textarea"
                rows="5"
              />
            )}
            <hr />
            <Row>
              <Col sm={6}>
                <h5>Upload Exit Documents</h5>
                <Card>
                  <Card.Body>
                    {documentsList &&
                      documentsList.map((item, index) => (
                        <ul>
                          <input
                            className=""
                            type={'checkbox'}
                            value={item?.isCheck}
                            checked={item?.isCheck}
                            // disabled={index === 1 ? false : true}
                            id="flexCheckDefaultBeneficiary"
                            onChange={(e) => {
                              let temData = [];
                              documentsList &&
                                documentsList.map((dt, ind) => {
                                  if (index == ind) {
                                    temData.push({
                                      name: dt.name,
                                      isCheck: true,
                                    });
                                  } else {
                                    temData.push({
                                      name: dt.name,
                                      isCheck: false,
                                    });
                                  }
                                });
                              setDocumentList(temData);
                              forceUpdate(count + 1);
                            }}
                          />{' '}
                          &nbsp;
                          {item?.name}
                        </ul>
                      ))}
                  </Card.Body>
                </Card>
                <TextInput type="file" />
                <Button>Upload</Button>
              </Col>
              <Col sm={6}>
                <h5>Enter Relieving Date</h5>
                <Datepicker
                  className="form-control"
                  //   selected={fromDate}
                  //   onChange={(e) => {
                  //     setFilterErr('');
                  //     setFromDate(e);
                  //   }}
                  autoComplete="off"
                  name="startDate"
                  dateFormat="dd/MM/yyyy"
                  placeholder="Select relieving date"
                  maxDate={new Date()}
                />
                <TextInput
                  className="mt-5"
                  placeholder="Enter reason for relieving date"
                  type="text"
                  as="textarea"
                  rows="5"
                />

                <Button className="mr-5 mb-3">Approve</Button>

                <Button
                  className="ml-5 mb-3"
                  variant="secondary"
                  onClick={() => {
                    setManagerDeclineToggle(true);
                  }}
                >
                  Decline
                </Button>
                {managerDeclineToggle && (
                  <TextInput
                    placeholder="Enter reason for decline"
                    type="text"
                    as="textarea"
                    rows="5"
                  />
                )}
              </Col>
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ResignationDetails;
