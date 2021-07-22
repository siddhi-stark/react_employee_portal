import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import hrInterviewFormSections from './hrInterviewFormschema.json';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function InterviewRounds(props) {
  
// Declare columns
const columns = [{
        'id':'index',
        'label': 'Sr.No',
},
{
        'id':'int_date',
        'label': 'Interview Date',
},
{
        'id':'int_time',
        'label': 'Interview Time',
},
{
        'id':'round_type_name',
        'label': 'InterviewRound',
},
{
        'id':'applicant_name',
        'label': 'Applicant Name',
},
{
        'id':'interviewer_name',
        'label': 'InterviewerName',
},
{
        'id':'interviewer_status_name',
        'label': 'InterviewStatus',
},
{
        'id':'status_name',
        'label': 'Status',
},
];



// Declare variable 
const [rowData, setRowData] = useState([])
const [totalCount, setTotalCount] = useState(10);
const limit = 5;
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [modalShow, setModalShow] = useState('false');
 const [currentUser, updateCurrentUser] = useState(0);

 const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({});

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // useEffect(() => {
  //   updatedJsonSchema();
  // }, [currentUser]);

// Declare methods
const getRowData = async (pageNo = 1,id) =>{
  const page = pageNo || currentPage;
  console.log('interviewRounds',id);
    const endPoint = `${Api.roundsUrl}`;


     const params = {
      limit,
      page,
      applicant_id : id
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);


    
    // const url = customFunctions.generateUrl(endPoint, params);
    // const { data, message } = await AuthApi.getDataFromServer(url);
    
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
       setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));


      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });

      setRowData(data && data.data || []);
    }else{
      console.log('error', message)
    }
} 


useEffect(()=>{
  // const id = customFunctions.getLocalStorage('InterviewId');
  console.log('props.isProfessionalInfoId',props.isProfessionalInfoId);
  getRowData(1,props.isProfessionalInfoId);
},[])

const onCancel = () => {
setModalShow(false);
}

  const submitForm = async (formValues) => {
    const id = customFunctions.getLocalStorage('applicantId');
    console.log('formValues',formValues);
    const postData = {
      int_date: formValues.int_date ? customFunctions.getDate(formValues.int_date) : '',
      int_time: formValues.int_time ? customFunctions.getTime(formValues.int_time) : '',
      round_status: formValues.round_status ? formValues.round_status.value : '',
      interviewer: formValues.interviewer ? formValues.interviewer.value : '',
      applicant: id
    }
    console.log('postData',postData);
    const { data } = await AuthApi.postDataToServer(
      Api.roundsUrl,
      postData
    );
    if (data) {
      console.log('data',data);
      

       swal({
        title: data && data.message[0],
        icon: 'success',
      })
        .then(okAction => {
          if (okAction) {
            setModalShow(false);
          }
        });

    }
  };

  const getHrInterviewer = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.full_name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      interviewer: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getHrInterviewer();
  }, []);

  const getRound = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.undefined);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      round: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getRound();
  }, []);


 // const submitForm = async (formValues) => {
 //    const id = customFunctions.getLocalStorage('applicantId');
 //    console.log('formValues',formValues);
 //    const postData = {
 //      int_date: formValues.int_date ? customFunctions.getDate(formValues.int_date) : '',
 //      int_time: formValues.int_time ? customFunctions.getTime(formValues.int_time) : '',
 //      round_status: formValues.round_status ? formValues.round_status.value : '',
 //      interviewer: formValues.interviewer ? formValues.interviewer.value : '',
 //      applicant: id
 //    }
 //    console.log('postData',postData);
 //    const { data } = await AuthApi.postDataToServer(
 //      Api.roundsUrl,
 //      postData
 //    );
 //    if (data) {
 //      console.log('data',data);
 //    }
 //  };

  return (
    <>  
     <div className="mt-5">

       <Card>
         <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Interview Rounds</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    onClick={() => {
                      // history.push('/add-technology-stack');
                       setModalShow(true);
                    }}
                    className="btn-link"
                  >
                    Add Round
                  </a>
                </div>
              </div>
            </Card.Header>
          <Card.Body>

<CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true} // eslint-disable-line
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                },
              }}
              emptyRender={() => {
                return 'No record found.';
              }}
            />
          </Card.Body>
        </Card>


     </div>    

     <ModalInput
        size="lg"
        centered
        show={modalShow}
        onHide={onCancel}
        label='Add Interview Round'
        id="contained-modal-title-vcenter"
        modalBody={
          <StarkFormBuilder
          containerClass="mt-4"
          formHeaderClass=""
          formSections={hrInterviewFormSections}
          formHeading="HR Interview Form"
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}

          options={options}
          callbacks={{}}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText={
            Number(currentUser) === 4 ? 'Reschedule' : 'Schedule Interview'
          }
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />
        }
      />  

    </>
  );
}
export default withRouter(InterviewRounds);
