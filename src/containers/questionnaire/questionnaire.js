/* eslint-disable */
import React, { useState, useRef } from 'react';
import { Helmet, DropdownInput, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Form, Accordion } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';


const Questionnaire = () => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const history = useHistory();
  const navigate = useLocation();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const [ShowDelete, setShowDelete] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [selectedDepartment, setDepartment] = useState({ label: "All Departements", value: 3 })
  const [filterDepartment, setFilterDepartment] = useState('')
  const [pageReferesh, setPageReferesh] = useState(false)

  const departmentList = [
    {
      label: "All Departements",
      value: 3,
    },

    {
      label: "Development and Design Teams",
      value: 1,
    },

    {
      label: "Marketing",
      value: 2,
    },

  ]

  useEffect(() => {
    getQuestionList();
  }, [filterDepartment])

  useEffect(() => {
    getQuestionList();
  }, [pageReferesh])

  const handleDropdownChange = (e) => {
    setFilterDepartment(selectedDepartment);
  };

  const getQuestionList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.questionUrl}`;
    const params = {}
    if (selectedDepartment && selectedDepartment?.value < 3) {
      params.questionnaire_type = selectedDepartment?.value
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setRowData(data?.data);
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
    const endPoint = `${Api.questionUrl}${id}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.deleteDataFromServer(url);
    if (data) {
      swal(data && data?.message[0], '', 'success').then((result) => {
        if (result) {
          setShowDelete(false);
          setPageReferesh(true)
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };


  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Employees Feedback Questionnaire
          </h2>
          {/* <Breadcrumb items="Hello world" /> */}
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
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
            deleteTask(questionId);
            getQuestionList();
            setShowDelete(false)
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
        >
          You will not be able to revert this!
        </SweetAlert>
      )}

      <Card>
        <Card.Body>
          <Row>
            <Col>
              <DropdownInput
                // label="Select Department"
                options={departmentList}
                defaultValue={selectedDepartment}
                onSelectHandler={(select) => {
                  setDepartment(select);
                }}
              // isMulti
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={handleDropdownChange}>
                Apply
              </Button>{' '}
              <Button variant="secondary" onClick={() => {
                setDepartment({ label: "All Departements", value: 3 });
                setFilterDepartment('');
              }
              } className='ml-2' >
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <section className="content-area">
            <div className="table">
              <div className="card p-2">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 mt-2">Employee Feedback Questionnaire</h5>
                  <div className="d-flex align-items-center justify-content-end">
                    <a
                      href="#"
                      onClick={() => {
                        history.push('/add-questionnaire');
                      }}
                      className="btn-link"
                    >
                      Add Questionnaire
                    </a>
                  </div>
                </div>
                <div >
                  <div className="table-responsive">
                    <table className="table table-striped m-0">
                      <thead>
                        <tr>
                          <th scope="col">Sr.No</th>
                          <th scope="col">Name</th>
                          <th scope="col">Department</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length
                          ? rowData.map((item, index) => (
                            <tr key={index + 1}>
                              <td>{index + 1}</td>
                              <td>
                                {item?.name ? item?.name : 'N/A'}
                              </td>
                              <td>{item?.questionnaire_for_name ? item?.questionnaire_for_name : 'N/A'}</td>

                              <td>
                                <a

                                  onClick={() => {
                                    if (!setTable) {
                                      console.log('Hello from personal')
                                      let paramsData = getParamsData(item?.id)
                                      history.push(`/add-feedback/${item?.id}`, { state: paramsData });

                                    } else {
                                      console.log('Hello from Team')
                                      let paramsData = getParamsData(item?.id)
                                      history.push(`/update-feedback/${item?.id}`, { state: paramsData });
                                    }
                                  }}
                                  className="pl-2 me-2"
                                >
                                  <img
                                    src="/images/edit.svg"
                                    alt="edit icon"
                                    style={{
                                      filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)",
                                    }}
                                  />
                                </a>

                                <a
                                  href='\'
                                  className="text-decoration-none"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowDelete(true);
                                    setQuestionId(item?.id);
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
            </div>
          </section>
        </Card.Body>
      </Card>

    </>
  );
};

export default Questionnaire;
