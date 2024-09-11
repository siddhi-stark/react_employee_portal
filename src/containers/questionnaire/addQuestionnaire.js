/* eslint-disable */
import React, { useState, useRef } from 'react';
import { Helmet, DropdownInput, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { ButtonGroup, Card, Row, Col, Button, Form, Accordion } from 'react-bootstrap';
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
const items = [{ to: '/', label: 'Home' }, { label: 'Employee Feedback / Questionnaire' }];


const AddQuestionnaire = () => {
  const state = useLocation();
  const questionId = state?.state?.state?.questionId
  
  const [pageTitle, setPageTitle] = useState('Resignation');
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const [ShowDelete, setShowDelete] = useState(false);
  // const [questionId, setQuestionId] = useState(null);
  const [selectedDepartment, setDepartment] = useState()
  const [filterDepartment, setFilterDepartment] = useState('')
  const [pageReferesh, setPageReferesh] = useState(false)
  const [questionnaire, setQuestionnaire] = useState([]);
  const [question, setQuestion] = useState();

  const [fieldsDisabled, setFieldsDisabled] = useState(false)
  const [title, setTitle] = useState('');

  console.log("=======", selectedDepartment, question);
  

  const departmentList = [
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
    // getQuestionList();
    // getUpdateData()
    setTitle('Employee Feedback Questionnaire');

  }, [filterDepartment])

  useEffect(() => {
    if (questionId){
      getUpdateData()
    }
    setTitle('Employee Feedback Questionnaire');

  }, [questionId])

  useEffect(() => {
    // getQuestionList();
    setTitle('Employee Feedback Questionnaire');

  }, [pageReferesh])

  const submitForm = async () => {
    setShowLoader(true);
    const postData = {
      name: question,
      questionnaire_type: +selectedDepartment?.value
    };
    if (questionId) {
      postData.id = questionId;
    }
    const endPoint = questionId
      ? `${Api.questionUrl}${questionId}/`
      : `${Api.questionUrl}`;
      
    const callback = questionId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal(
        data?.message?.[0],
        ' ',
        'success'
      ).then(() => {
        history.push('/questionnaire');
      });
    } else {
      setShowLoader(false);
      swal(data?.message?.[0], ' ', 'error');
    }

  }

  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.questionUrl}${questionId}`;
    const params = {};

    const url = customFunctions.generateUrl(endPoint, params);
    console.log("url", url);

    const { data, message } = await AuthApi.getDataFromServer(url);

    if (data && data.success) {
      console.log("ahhah", data?.data);
      
      setQuestion(data?.data?.name)
      setDepartment({'label':data?.data?.questionnaire_for_name, 'value':data?.data?.questionnaire_for})
    
    }
    setShowLoader(false);
  }

  return (
    <><Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Add Employee Feedback</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Add Questionnaire</h5>
            </div>
            <hr style={{ borderColor: "white" }} />
            <Card>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <TextInput
                      label="Question"
                      type="text"
                      as="textarea"
                      asterisk="*"
                      placeholder="Write question here"
                      value={question}
                      onInputChange={(e) => {
                        setQuestion(e.target.value);
                      }}
                    />
                  </Col>
                  <Col sm={6}>
                    <DropdownInput
                      asterisk="*"
                      label="Department"
                      defaultValue={selectedDepartment}
                      options={departmentList}
                      placeholder="Select department"
                      onSelectHandler={(select) => {
                        setDepartment(select);
                      }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <div className="d-flex justify-content-end p-2">
              <ButtonGroup className="gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                  type="submit"
                  onClick={() => {
                    submitForm();
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  className="h4 m-0 text-black rounded-3"
                  onClick={() => {
                    history.push('/questionnaire');
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </div>
          </Card.Body>
        </Card>
      </section >
    </>
  );
};

export default AddQuestionnaire;
