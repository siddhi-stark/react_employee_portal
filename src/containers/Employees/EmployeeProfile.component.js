import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Image, Card, Row, Col, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import AddHistory from './AddHistory.component';
import EditPersonalDetails from './EditPersonalDetails.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function EmployeeProfile(props) {

  const [showEmployee, setShowEMployee] = useState(false);
  const [dataa, setData] = useState({});
  const [employeeDetails,setEmployeeDetails] = useState({});
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [companyList,setCompanyList] = useState([]);
  const history = useHistory();
  
  const getEmployeeDetails = async () => {
    const employeeId = props.match.params.id;
    customFunctions.setLocalStorage('id',employeeId);
    const { data } = await AuthApi.getDataFromServer(`${Api.employeeUrl}${employeeId}/`);
    // console.log('data',data.data);
    
      setEmployeeDetails(data.data);
    
  }

  const getEmployeeHIstory = async () => {
    const employeeId = props.match.params.id;
    const endPoint =  `${Api.historyUrl}?employee_id=${employeeId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    // customFunctions.setLocalStorage('historyId',data.data.id);
    // console.log('data',data.data);
    setCompanyList(data.data);

  }

  useEffect(() => {
    getEmployeeHIstory();
    getEmployeeDetails();
  },[])

  const onChangeInHistory = () => {
    getEmployeeHIstory();
    getEmployeeDetails();
  }


const onEmployeePersonalDetails = () => {
  getEmployeeDetails();
}

const deleteEmployeeHistory = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the employee history?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.historyUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getEmployeeHIstory();
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  };

  return (
    <>
      <h6 className="mt-3">Employee Profile Page</h6>
      <Image src="/images/edit-profile-img.png" style={{ 'height': '90px' }} />
      <div className="table-projects">
       
        {showPersonalDetails ?  (
          <Card className="mt-3">
          <EditPersonalDetails 
          handleModalCLose={(e) => setShowPersonalDetails(e)}
          onPersonalDetailChanges={() => {
            onEmployeePersonalDetails();
          }}
          />
          </Card>
          ) : (
           <Card className="mt-4">
          {/* <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2 ml-2">Employee Name</h4>
                <div className="d-flex align-items-center justify-content-between">
                 <h7>Birthdate</h7>
                </div>
              </div> */}
          <div className="d-flex align-items-center justify-content-between">
            <h3><strong>{employeeDetails.full_name}</strong></h3>
            <div className="date-edit-option d-flex align-items-center">
              <h6>Birthday - 30/10/1991</h6>
               <a
                        href="javascript:void()"
                        onClick={() => {
                         setShowPersonalDetails(true)
                        }}
                      >
                        <img src="/images/edit-button.svg" alt="Edit Profile" />
                      </a>

              
            </div>
          </div>
          <p>Designation</p>
          <Row>
            <Col md={4}>
              <h7>Joining Date -  {employeeDetails.joined_date ? customFunctions.getFormattedDate(employeeDetails.joined_date) : ''}</h7>
            </Col>

            <Col md={4}>
              <h7>Email Id - {employeeDetails.email}</h7>
            </Col>

            <Col md={4}>
              <h7>Email Id - admin@gmail.com </h7>
            </Col>
          </Row><br />

          <Row>
            <Col md={4}>
              <h7>Contact No - {employeeDetails.mobile}</h7>
            </Col>

            <Col md={2}>
              <h7>Confirmation Date - {employeeDetails.confirmation_date ? customFunctions.getFormattedDate(employeeDetails.confirmation_date) : ''}</h7>
            </Col>
            <Col md={2}>
              <Button onClick={() => history.push('/confirmation')}>Confirm</Button>
            </Col>

            <Col md={4}>
              <h7>Reliving Date - DD/MM/YYYY</h7>
            </Col>
          </Row>
        </Card>
          )}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4><b>Employee History</b></h4>
        <Button onClick={() => setShowEMployee(true)}>Add History</Button>

      </div>
      {showEmployee && (
        <Card className="mt-4">

          <AddHistory
            optionsData={dataa}
            handleModalCLose={(e) => setShowEMployee(e)}
            onChanges={() => {
            onChangeInHistory();
          }}
          />
        </Card>
      )}
      <card className="mt-4">{
      companyList && companyList.map((comp)=>(
        <div className="d-flex align-items-start justify-content-between">
          <div className="address-content">
            <p><strong>{comp.designation}</strong> </p>
            <p>{comp.company_name} - {comp.employement_type_name} <br /> {comp.date}| {comp.duration}</p>
            <p>{comp.location}</p><hr />
          </div>
          <div className="address-edit-delete">
          <Image src="/images/edit-button.svg" alt="Edit Profile" onClick={()=>{
            setData(comp);
            setShowEMployee(true);
            customFunctions.setLocalStorage('hisotryID',comp.id);
            console.log('idddd',comp.id);
            // history.push(`/profile-history/id=${comp.id}`)
          }}/>

          <Image src="/images/delete.png" alt="Edit Profile" onClick={() => {
            deleteEmployeeHistory(comp.id)
          }} />
</div>
        </div>
        ))
      }
       
      </card>
    </>
  );
}

export default withRouter(EmployeeProfile);
