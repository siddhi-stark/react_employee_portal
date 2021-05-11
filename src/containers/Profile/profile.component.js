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
  const userId = localStorage.getItem('userId');

  const email = 'mrunaliPatil04@gmail.com';
  //   const mobile = '7757774289';
  // const birthday = '30 Oct 1997';
  const [date, setDate] = useState('');
  // const [employeeId, setEmployeeId] = useState('');
  const [companyEmail, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [id, setId] = useState(null);
  const [modalShow, setModalShow] = useState('');
  const [count, forceUpdate] = useState(0);
  const [designation, setDesignation] = useState([]);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [manager, setManager] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [birthDate, setBirthdate] = useState('');
  const [imageProfile, setImageProfile] = useState('');
  // const [imageFile, setImageFile] = useState(''); 
  const Department = [
    {
      id: 1,
      value: 'Management',
      label: 'Management',
    },
    {
      id: 2,
      value: 'Development',
      label: 'Development',
    },
    {
      id: 3,
      value: 'Design',
      label: 'Design',
    },
    {
      id: 4,
      value: 'Quality Analyst',
      label: 'Quality Analyst',
    },
    {
      id: 5,
      value: 'Other',
      label: 'Other',
    },
  ];

  const getProfile = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.profileUrl}`
    );
    if (customFunctions.checkIfEmpty(data && data.data,'A')) {

      const managerList = [];
      setEmail(data.data.email);
      setName(data.data.full_name);
      setMobile(data.data.mobile);
      setId(data.data.id);
      setBirthdate(data.data.dob);
      setImageProfile(data.data.profile_image_url);
      setSelectedDesignationOption({
        label: data.data.designation_name,
        id: data.data.designation_id,
      });
      Department.map((dept) => {

        if (data.data.department_id === dept.id) {
          setSelectedDepartment(dept);
        }
        return dept;
      });
      console.log('manager', manager);
      manager.map((mngr) => {
       data.data.assigned_managers.map((assgnmgmr) => {
          if (Number(mngr.id) === Number(assgnmgmr.report_head_id)) {
            managerList.push({
              id: mngr.id,
              label: mngr.full_name,
              value: mngr.full_name
            });
          }
          return assgnmgmr;
        });
        setSelectedManager(managerList);
        return mngr;
      });
      setDate(customFunctions.getDate(data.data.joined_date));

    }
  }

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!customFunctions.checkIfEmpty(data && data.data,'A')) {
      setDesignation(data.data);
    }
  };

  const getDepartment = () => {
    if (!Department) return [];
    const depart = [];
    Department.map((dep) => {
      return depart.push({
        label: dep.label,
        id: dep.id,
        value: dep.value,
      });
    });
    return depart;
  };

  const getManager = async () => {
    return  new Promise(async (resolve) =>  { // eslint-disable-line
      const { data } = await AuthApi.getDataFromServer(
        `${Api.employeeUrl}?role_id=${2}`
      );
      if (!customFunctions.checkIfEmpty(data && data.data)) {
        console.log('managerData', data.data);
        setManager(data.data);
        
        setTimeout(() => {resolve();}, 500)
      }else{
        resolve();
        console.log('else block');
      }

    })
  }



  useEffect(() => {
    
    async function getData() {
    await getManager();
      getDesignation();
      getDepartment();
      getProfile();
    }
    getData();

  }, [])

  useEffect(() => {
    if(userId) {
      getProfile();

    }
  }, [userId])

  const getManagerList = () => {
    if (!manager) return [];
    const options = [];
    manager.map((data) => {
      return options.push({
        label: data.full_name,
        id: data.id,
        value: data.full_name,
      });
    });
    return options;
  };

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

  const handleImageFileUpload = (e) => {




    // if (!e.target.files[0].name) return;
    // const url = URL.createObjectURL(e.target.files[0]);
    // setImageFile(e.target.files[0]);
    if (e.target.files && e.target.files.length > 0) {
      setImageUrl(e.target.files[0]);
    }


  };

  const uploadFile = async () => {

    const formData = new FormData();
    formData.append('file_name', imageUrl);
    
    const { data } = await AuthApi.postDataToServer(
      `${Api.fileUploadUrl}`,
      formData
    );
    if (data) {
      updateProfileData(data.data.id);
    }
  }

  const updateProfileData = async (imgId) => {

    const payload = {
      id: localStorage.getItem('userId'),
      full_name: name,
      companyEmail,
      mobile,
      profile: imgId
      
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
          getProfile();
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
      uploadFile();
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
              onClick={(e) => {
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
                  <img src= {imageProfile} alt="Edit Profile" />
                  {/* <div className="profile-edit">
                    <img src="/images/edit-profile.svg" alt="" />
                  </div> */}
                </div>
              </Row>

              <h5>Personal Information</h5>
              <Col sm={3}>
                <Form.Label>
                  <Image
                    src="/images/up-coming-birthday.svg"
                    className="svg me-3"
                  />
                  {birthDate}
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
                  // onInputChange={(e) => setDate(e.target.value)}
                  label="Joining Date"
                  containerClass="form-group"
                  type="date"
                  name="date"
                  value={date}
                  disabled
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
                  disabled
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
                  disabled
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col sm={6}>
                <DropdownInput
                  label="Department"
                  // asterisk="*"
                  options={getDepartment()}
                  placeholder="Select Department"
                  defaultValue={selectedDepartment}
                  disabled
                  onSelectHandler={(select) => setSelectedDepartment(select)}
                  // errorMessage={
                  //   selectedDepartment && selectedDepartment.length > 0
                  //     ? validator.message(
                  //         'Department',
                  //         selectedDesignationOption,
                  //         'required'
                  //       )
                  //     : ''
                  // }
                  isMulti={false}
                />
              </Col>
              <Col sm={5}>
                <DropdownInput
                  label="Designation"
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
                  label="Manager"
                  // asterisk="*"
                  options={getManagerList()}
                  placeholder="Select Manager"
                  defaultValue={selectedManager}
                  isMulti
                  onSelectHandler={(select) => setSelectedManager(select)}
                // errorMessage={
                //   selectedManager && selectedManager > 0
                //     ? validator.message(
                //         'Manager',
                //         selectedDesignationOption,
                //         'required'
                //       )
                //     : ''
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
                  onInputChange={(e) => {
                      const re =  /^[a-zA-Z ]*$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setName(e.target.value);
                      }
                    }}
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
                  onInputChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setMobile(e.target.value);
                      }
                    }}
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
              {/* <Col sm={12}>
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
              </Col> */}
            </Row>
            <Row>
              <Col sm={12}>
                <TextInput
                  onInputChange={(e) => {
                    handleImageFileUpload(e);
                  }}
                  label="Profile Picture"
                  asterisk="*"
                  accept=".xls,.txt,.pdf,.doc,image/jpeg,image/png,"
                  containerClass="form-group"
                  id="inlineFormInputGroup"
                  type="file"
                  inputClass="form-control"
                //   value={userData.mobile}
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