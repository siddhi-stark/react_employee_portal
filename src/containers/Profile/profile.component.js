import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { TextInput, ModalInput } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

const validator = new SimpleReactValidator();

const items = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'My Profile' },
];

function Profile() {
  const [date, setDate] = useState('');
  const [companyEmail, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [id, setId] = useState(null);
  const [modalShow, setModalShow] = useState('');
  const [count, forceUpdate] = useState(0);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedManager, setSelectedManager] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [birthDate, setBirthdate] = useState('');
  const [imageProfile, setImageProfile] = useState('');
  const [image, setImage] = useState('');
  const [profileId, setProfileId] = useState('');

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

  const event = new Event('ProfileUpdate', { isUpdated: true });
  const getProfile = async () => {
    const { data } = await AuthApi.getDataFromServer(`${Api.profileUrl}`);
    if (!customFunctions.checkIfEmpty(data.data, 'O')) {
      setEmail(data.data.email);
      setName(data.data.full_name);
      setMobile(data.data.mobile);
      setId(data.data.emp_code);
      setBirthdate(data.data.dob);
      setImageProfile(data.data.profile_image_url);
      setSelectedDesignationOption(data.data.designation_name);
      setSelectedDepartment(data.data.deparment_name);
      setImage(data.data.profile_image_url);
      setProfileId(data.data.profile_id);
      data.data.assigned_managers.map((assgnmgmr) => {
        setSelectedManager(assgnmgmr.report_head__full_name);
        return assgnmgmr;
      });
      setDate(customFunctions.getDate(data.data.joined_date));
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

  useEffect(() => {
    async function getData() {
      getDepartment();
      getProfile();
    }
    getData();
  }, []);

  const onCancel = () => {
    setModalShow(false);
  };
  const handleImageFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageUrl(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    let imgId = '';

    const formData = new FormData();
    formData.append('file_name', imageUrl);

    const { data } = await AuthApi.postDataToServer(
      `${Api.fileUploadUrl}`,
      formData
    );
    if (data) {
      imgId = data.data.id;
    }
    return imgId;
  };

  const updateProfileData = async () => {
    const payload = {
      id: customFunctions.getLocalStorage('userId'),
      full_name: name,
      companyEmail,
      mobile,
      profile: profileId,
    };

    if (imageUrl) {
      payload.profile = await uploadFile();
    }

    const postData = customFunctions.cleanObject(payload);

    const { data } = await AuthApi.putDataToServer(
      `${Api.profileUrl}`,
      postData
    );
    if (data) {
      setModalShow(false);
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setModalShow(false);
          document.dispatchEvent(event);
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
      updateProfileData();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  const getImageName = (profileImage) => {
    const img = profileImage
      ? profileImage.split(Api.s3Url)
      : imageUrl.split(Api.s3Url);
    let img1 = '';

    if (img.length > 1) {
      img1 = img[1].split('?').length > 1 ? img[1].split('?')[0] : img[0];
    }
    return img1;
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
        <div>
          <div className="mb-3">
            <div className="custom-header-wrapper">
              <Col>
                <div className="pull-left">
                  <h4>My Profile</h4>
                </div>
              </Col>
              <Col>
                <div className="pull-right">
                  <Button
                    className="float-end"
                    variant="primary"
                    type="Button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalShow(true);
                      getProfile();
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
              </Col>
            </div>
          </div>
        </div>
        <Card.Body>
          <Form>
            <Row>
              <Col sm={3}>
                <div
                  className="edit-profile-image mb-4"
                  style={{ height: '70px' }}
                >
                  <img src={imageProfile} alt="Edit Profile" />
                </div>
              </Col>
              <Col sm={9}>
                <h3 className="main-notification-title text-primary">
                  <b>{name}</b>
                </h3>
                <h5 className="mt-5">Personal Information</h5>

                <Form.Label>
                  <Image
                    src="/images/up-coming-birthday.svg"
                    className="svg me-3"
                  />
                  {birthDate}
                </Form.Label>

                <Form.Label>
                  <Image
                    src="/images/Mobile-num.svg"
                    className="svg me-3 ms-3"
                  />
                  {mobile}
                </Form.Label>

                <h5 className="mt-5">Job Information</h5>
                <Row>
                  <Col sm={4}>
                    <TextInput
                      label="Joining Date"
                      containerClass="form-group"
                      type="date"
                      name="date"
                      value={date}
                      disabled
                    />
                  </Col>
                  <Col sm={2}>
                    <TextInput
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
                <Row>
                  <Col sm={6}>
                    <TextInput
                      onInputChange={(e) =>
                        setSelectedDepartment(e.target.value)
                      }
                      label="Department"
                      containerClass="form-group"
                      name="selectedDepartment"
                      value={selectedDepartment}
                      disabled
                    />
                  </Col>
                  <Col sm={4}>
                    <TextInput
                      onInputChange={(e) =>
                        setSelectedDesignationOption(e.target.value)
                      }
                      label="Designation"
                      containerClass="form-group"
                      name="selectedDesignationOption"
                      value={selectedDesignationOption}
                      disabled
                    />
                  </Col>
                  <Col sm={6}>
                    <TextInput
                      onInputChange={(e) => setSelectedManager(e.target.value)}
                      label="Reporting To"
                      containerClass="form-group"
                      name="selectedManager"
                      value={selectedManager}
                      disabled
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <ModalInput
        size="md"
        centered
        show={modalShow}
        label={<h4>Edit Profile</h4>}
        id="contained-modal-title-vcenter"
        modalBody={
          <Form onSubmit={(e) => updateProfile(e)}>
            <Row>
              <Col sm={12}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[a-zA-Z ]*$/;
                    if (
                      customFunctions.checkIfEmpty(e.target.value) ||
                      re.test(e.target.value)
                    ) {
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
                    if (
                      customFunctions.checkIfEmpty(e.target.value) ||
                      re.test(e.target.value)
                    ) {
                      setMobile(e.target.value);
                    }
                  }}
                  name="mobile"
                  label="Contact Number"
                  asterisk="*"
                  containerClass="form-group contact-number"
                  id="inlineFormInputGroup"
                  inputVarible="+91"
                  inputClass="form-control"
                  value={mobile}
                  maxlength="10"
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
                  onInputChange={(e) => {
                    handleImageFileUpload(e);
                  }}
                  label="Profile Picture(Allowed file : JPG, PNG)"
                  asterisk="*"
                  accept=".xls,.txt,.pdf,.doc,image/jpeg,image/png,"
                  containerClass="form-group"
                  id="inlineFormInputGroup"
                  type="file"
                  inputClass="form-control"
                />
                <Row>
                  <Col>
                    <span className="span-container">
                      {image && getImageName(image)}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="float-end">
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="ms-4">
                Update
              </Button>
            </div>
          </Form>
        }
      />
      <section className="content-area" />
    </>
  );
}

export default withRouter(Profile);
