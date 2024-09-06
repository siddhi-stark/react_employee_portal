
import React, { useEffect,useRef,useState } from 'react';
import { Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import { withRouter ,useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader';

const items = [{ to: '/employee-feedback', label: 'Employee Feedback' }, { label: 'Add Employee Feedback' }];

function AddEmployeeFeedback() {
  const validator = useRef(new SimpleReactValidator({}));
  const history = useHistory(); 
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [questions , setQuestions] = useState([
    {
      questionnaire_id:'',
      employee_rating: '',
      employee_feedback: '',
    }
  ]);
  const [formData, setFormData] = useState({
    submission_date: '',
    review_status:'',
    quarter:''
  });

  useEffect(() => {
    setTitle('Add Employee Feedback');
    getQuestionList();
  }, []);

  const getQuestionList = async () => {
    setShowLoader(true);
    const endPoint = `${Api.questionUrl}`;
    const params = {
      show_all:'true'
    };
    const url = customFunctions.generateUrl(endPoint,params);
    const { data ,message } = await AuthApi.getDataFromServer(url);
    if (data && data.success) {
      setQuestions(data?.data?.map((item)=>{
        return{...item,answer:'',empRating:''};
      }));
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const submitForm = async () => {
    setShowLoader(true);
    // const postData = {
    //   employee_rating: '',
    //   employee_feedback: '',
    //   submission_date: customFunctions.getDMYDateFormate(new Date(),'dmy'),
    //   questionnaire_id:'',
    //   review_status:2,
    //   quarter:formData?.quarter,
    // };
    const questionData = [];

    questions?.length &&
      questions.forEach((item) => {
        const postData = {
          review_status:2,
          quarter: +formData?.quarter,
          submission_date: customFunctions.getDate(new Date()),
        };

        if (item?.empRating) {
          postData.employee_rating = +item?.empRating;
        }

        if (item?.answer) {
          postData.employee_feedback = item?.answer;
        }
        if (item?.id) {
          postData.questionnaire_id = +item?.id;
        }
        questionData.push(postData);
      });
      let obj = null;
      if(questionData)
        obj={
        'data':questionData,
      };

    // let response;
    // if (isEditing) {
    //   response = await AuthApi.putDataToServer(`${Api.empFeedbackUrl}${fid}/`, postData);
    // } else {
    const response = await AuthApi.postDataToServer(Api.empFeedbackUrl, obj);
    // }

    const { data, message } = response;
    if (data) {
      swal(data.message[0], '', 'success').then(() => {
        history.push('/employee-feedback');
      });
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      submitForm();
    } else {
      setFormData({ ...formData });
      validator.current.showMessages();
    }
  };

  const handleClear = () => {
    setFormData({
    employee_rating: '',
    employee_feedback: '',
    submission_date: '',
    questionnaire_id:'',
    review_status:'',
    quarter:''
    });
    // submitForm();
    // window.location.reload();
    validator.current.hideMessages();
    history.push('/employee-feedback');
  };

  return (
    <>
    <Helmet title={title} />
    <div className="title-breadcrumb-section">
      <h2 className="main-content-title tx-24 mg-b-5">Add Employee Feedback</h2>
      <Breadcrumb items={items} />
    </div>
       <Loader showLoader={isShowLoader} needFullPage={false} />
       
    <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Add Feedback</h5>
            </div>
            <hr />
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formQuestionnaire'>
                     	<Form.Label>
                       Quarter <span className="text-danger">*</span>
                     	</Form.Label>
                     	<Form.Control
                       	as='select'
                       	name='quarter'
                       	value={formData?.quarter}
                       	onChange={(e) => {
                        	const data = {...formData};
                          	data.quarter = e?.target?.value;
                          	setFormData(data);
                      	}}
                     	>
                       	<option value='' hidden>Select quarter type</option>
                       	<option value='1'>April - June</option>
                       	<option value='2'>July - September</option>
                       	<option value='3'>October - December</option>
                       	<option value='4'>January - March</option>
                     	</Form.Control>
                   	</Form.Group>
            {questions?.map((item , index) => {
              return <>
            	<Form.Group controlId='formFirstName' key={index+1}>
                      	<Form.Label>
                      	{item?.id}. {item?.name}<span className="text-danger">*</span>
                      	</Form.Label>
                      	<Form.Control
                        	as='textarea'
                        	style={{ height: '100px' }}
                        	type='text'
                        	placeholder='Enter answer'
                        	name='answer'
                        	value={item?.answer}
                        	onChange={(e) => {
                          	const data = [...questions];
                          	data[index].answer = e?.target?.value;
                          	setQuestions(data);
                        	}}
                      	/>
                    	</Form.Group>
                     	<Form.Group controlId={`formRating${index+1}`}>
                     	<Form.Label>
                       	Rating <span className="text-danger">*</span>
                     	</Form.Label>
                     	<Form.Control
                       	as='select'
                       	name='employee_rating'
                       	value={item?.empRating}
                       	onChange={(e) => {
                        	const data = [...questions];
                          	data[index].empRating = e?.target?.value;
                          	setQuestions(data);
                      	}}
                     	>
                       	<option value='' hidden>Select Rating</option>
                       	<option value='1'>1</option>
                       	<option value='2'>2</option>
                       	<option value='3'>3</option>
                       	<option value='4'>4</option>
                       	<option value='5'>5</option>
                     	</Form.Control>
                   	</Form.Group>
            	</>}
            )}
          </Form>
          </Card.Body>
          <div className="d-flex justify-content-end p-2">
                <ButtonGroup className="gap-3 mt-6">
                <Button
                    variant="secondary"
                    className="bg-primary border-0 border-primary h4 m-0 text-white rounded-3"
                    type="submit"
                    onClick={()=>{
                      submitForm();
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    className="h4 m-0 text-black rounded-3"
                    onClick={handleClear}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </div>
        </Card>
      </section>
    </>
  );
}

export default withRouter(AddEmployeeFeedback);