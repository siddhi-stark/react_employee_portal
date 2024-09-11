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


const AddQuestionnaire = () => {
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

  useEffect(()=>{
    getQuestionList();
  },[pageReferesh])

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


  const getUpdateData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.questionUrl}`;
    const params = {};

    if (selectedDepartment && selectedDepartment < 3){
      params.questionnaire_type = 1
    }

    const url = customFunctions.generateUrl(endPoint, params);
    console.log("url", url);

    const { data, _ } = await AuthApi.getDataFromServer(url);

    let oldData = []

    if (data && data.success) {
      data?.data.length > 0 && data.data.map((item, index) => {
        oldData.push({
          id: item.id,
          name: item?.questionnaire,
          questionnaire_id: item?.questionnaire_id,
          answer: item?.employee_feedback,
          empRating: item?.employee_rating,
          reviewerAnswer: item?.reviewer_feedback,
          reviewerRating: item?.reviewer_rating,
          submission_date: item?.submission_date,
          review_status: item?.review_status,
          quarter: String(getQuarterByString(item?.quarter))
        })
      })
    }
    setFormData(({
      ...formData,
      quarter: oldData?.length ? oldData[0]?.quarter : '',
      review_status: oldData?.length ? oldData[0]?.review_status : 2,

    }))
    if (oldData?.length && oldData[0].review_status == 1){
      setFieldsDisabled(true)
    }
    console.log("oldData", oldData);
    setQuestions(oldData)
    setShowLoader(false);
  }


  return (
    <>
    
    </>
  );
};

export default AddQuestionnaire;
