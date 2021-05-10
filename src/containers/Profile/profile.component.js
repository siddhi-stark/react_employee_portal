import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import {
  TextInput,
  DropdownInput,
  ModalInput,
} from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

const validator = new SimpleReactValidator();

const items = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
];

function Profile() {
  const email = 'mrunaliPatil04@gmail.com';
//   const mobile = '7757774289';
  const birthday = '30 Oct 1997';
  const [date, setDate] = useState('');
  // const [employeeId, setEmployeeId] = useState('');
  const [companyEmail, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [id, setId] = useState(null);
  const [department, setDepartment] = useState('');
  const [modalShow, setModalShow] = useState('');
  const [count, forceUpdate] = useState(0);
  const [designation, setDesignation] = useState([]);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );

  const getProfile = async () => {
    const { data } = await AuthApi.getDataFromServer(
        `${Api.profileUrl}`
      );
    if(customFunctions.checkIfEmpty(data && data.data)) {
      setEmail(data.data.email);
        setName(data.data.full_name);
        setMobile(data.data.mobile);
        setId(data.data.id);
        setSelectedDesignationOption({
          label: data.data.designation_name,
          id: data.data.designation_id,
        });

    }
  }

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (data) {
      setDesignation(data.data);
    }
  };

useEffect(() => {
   getProfile();
   getDesignation();
}, [])

  const onCancel = () => {
    setModalShow(false);
  };

  const getDesignationList = () => {
    if (!designation) return [];
    const options = [];
    designation.map((desgn) => {
      return options.push({
        label: desgn.name,
        id: desgn.id,
      });
    });
    return options;
  };

  const updateProfileData = async () => {
    const payload = {
      id: localStorage.getItem('userId'),
      full_name: name,
      companyEmail,
      mobile,
    };
    const { data } = await AuthApi.putDataToServer(
      `${Api.profileUrl}`,
      payload
    );
    if (data) {
      setModalShow(false)
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setModalShow(false);
          setName('');
          setEmail('');
          setMobile('');
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };

  const updateProfile = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      updateProfileData();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">My Profile</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Card body>
        <Card.Header>
          <div className="mb-3">
            My Profile
            <Button
              className="float-end"
              variant="primary"
              type="submit"
              onClick={(e) =>{ 
                e.preventDefault();
                  e.stopPropagation();
                  setModalShow(true);
                  getProfile();
                  // setCntClearFilter(cntClearFilter + 1);
                
                }}
            >
              Edit Profile
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <h3 className="main-notification-title">{name}</h3>
              <Row>
                <div
                  className="edit-profile-image mb-4"
                  style={{ height: '70px' }}
                >
                  <img src="/images/edit-profile-img.png" alt="Edit Profile" />
                  <div className="profile-edit">
                    <img src="/images/edit-profile.svg" alt="" />
                  </div>
                </div>
              </Row>

              <h5>Personal Information</h5>
              <Col sm={3}>
                <Form.Label>
                  <Image
                    src="/images/up-coming-birthday.svg"
                    className="svg me-3"
                  />
                  {birthday}
                </Form.Label>
              </Col>
              <Col sm={3}>
                <Form.Label>
                  <Image src="/images/Mobile-num.svg" className="svg me-3" />
                  {mobile}
                </Form.Label>
              </Col>
              <Col sm={6}>
                <Form.Label>
                  <Image src="/images/mail.svg" className="svg me-3" />
                  {email}
                </Form.Label>
              </Col>
            </Row>
            <Row className="mb-4">
              <h5>Job Information</h5>
              <Col sm={4}>
                <TextInput
                  onInputChange={(e) => setDate(e.target.value)}
                  label="Joining Date"
                  containerClass="form-group"
                  type="date"
                  name="date"
                  value={date}
                />
              </Col>
              <Col sm={4}>
                <TextInput
                  // onInputChange={(e) => setEmployeeId(e.target.value)}
                  label="Employee Id"
                  containerClass="form-group"
                  type="employeeId"
                  name="employeeId"
                  value={id}
                />
              </Col>
              <Col sm={4}>
                <TextInput
                  onInputChange={(e) => setEmail(e.target.value)}
                  label="Company Email"
                  containerClass="form-group"
                  type="email"
                  name="email"
                  value={companyEmail}
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => setDepartment(e.target.value)}
                  label="Department"
                  containerClass="form-group"
                  type="department"
                  name="department"
                  value={department}
                />
              </Col>
              <Col sm={5}>
              <DropdownInput
                  label="Designation"
                  asterisk="*"
                  options={getDesignationList()}
                  disabled
                  placeholder="Select Subject"
                   defaultValue={selectedDesignationOption}
                  onSelectHandler={(select) =>
                    setSelectedDesignationOption(select)
                    
                  }
                
                />
              </Col>
              <Col sm={5}>
                <DropdownInput
                  label="Reporting To"
                  asterisk="*"
                  // options={getDesignationList()}
                  placeholder="Select Subject"
                  //  defaultValue={selectedDesignationOption}
                  // onSelectHandler={(select) =>
                  //   setSelectedDesignationOption(select)
                  // }
                />
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <ModalInput
        size="md"
        centered
        // className="small-popup"
        show={modalShow}
        label={<h4>Edit Profile</h4>}
        id="contained-modal-title-vcenter"
        modalBody={
          <Form>
            <Row>
              <Col sm={12}>
                <TextInput
                  onInputChange={(e) => setName(e.target.value)}
                  label="Full Name"
                  containerClass="form-group"
                  asterisk="*"
                  type="text"
                  name="fullname"
                  value={name}
                  placeholder="Alexa"
                  errorMessage={validator.message(
                    'Full Name',
                    name,
                    'required'
                  )}
                />
              </Col>
            </Row>
            

            <Row>
              <Col sm={12}>
                <TextInput
                    onInputChange={(e) => setMobile(e.target.value)}
                  name="mobile"
                  label="Contact Number"
                  asterisk="*"
                  containerClass="form-group"
                  id="inlineFormInputGroup"
                  inputVarible="+91"
                  inputClass="form-control"
                    value={mobile}
                  preValueClass="contact-number"
                  placeholder="9876576894"
                    errorMessage={validator.message(
                      'mobile',
                      mobile,
                      'required|phone|max:10'
                    )}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <TextInput
                   onInputChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  label="Personal Email"
                  asterisk="*"
                  containerClass="form-group"
                  id="inlineFormInputGroup"
                  inputClass="form-control"
                  value={companyEmail}
                    
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <TextInput
                  //   onInputChange={(e) => handleInputChange(e)}
                  name="mobile"
                  label="Profile Picture"
                  // asterisk="*"
                  containerClass="form-group"
                  id="inlineFormInputGroup"
                  type="file"
                  inputClass="form-control"
                  //   value={userData.mobile}
                  placeholder="Enter your mobile"
                  //   errorMessage={validator.message(
                  //     'mobile',
                  //     userData.mobile,
                  //     'required|phone|max:10'
                  //   )}
                />
              </Col>
            </Row>
          </Form>
        }
        modalFooter={
          <div className="float-end">
            <Button variant="secondary" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-4"
              onClick={(e) => updateProfile(e)}
            >
              Update
            </Button>
          </div>
        }
      />
      <section className="content-area" />
    </>
  );
}

export default withRouter(Profile);