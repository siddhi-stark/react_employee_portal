import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Card, Row, Col, Button, Form, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { TextInput, ModalInput, Helmet, Datepicker } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import Loader from '../../components/Loader/index';

const validator = new SimpleReactValidator();

const items = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'My Profile' },
];

function Profile() {
  const [date, setDate] = useState('');
  const [companyEmail, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState([]);
  const [mobile, setMobile] = useState('');
  const [id, setId] = useState(null);
  const [modalShow, setModalShow] = useState('');
  const [count, forceUpdate] = useState(0);
  const [title, setTitle] = useState('');
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    null
  );
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedManager, setSelectedManager] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [birthDate, setBirthdate] = useState('');
  const [imageProfile, setImageProfile] = useState('');
  const [profileId, setProfileId] = useState('');
  const [companyList,setCompanyList] = useState([]);
  const [isShowLoader,setShowLoader] = useState(false);
  const [employeeDocument, setEmployeeDocument] = useState([]);
  const [rowEducationalData, setRowEducationalData] = useState([]);
  const [rowPersonalData, setRowPersonalData] = useState([]);
  const [rowEmploymentData, setRowEmploymentData] = useState([]);
  const [rowOtherData, setRowOtherData] = useState([]);

  const personalColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => { // eslint-disable-line
        return (
          <>
            <a href={document_url} target="_blank" // eslint-disable-line
            > 
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const educationalColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => { // eslint-disable-line
        return (
          <>
            <a href={document_url} target="_blank" // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const employmentColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => {  // eslint-disable-line
        return (
          <>
            <a href={document_url} target="_blank"  // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

  const otherColumns = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
      render: ({ document_url }) => { // eslint-disable-line
        return (
          <>
            <a href={document_url} target="_blank" // eslint-disable-line
            >
              <Image src="/images/download-file.svg" />
            </a>
          </>
        );
      },
    },
  ];

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
    setShowLoader(true);
    const { data } = await AuthApi.getDataFromServer(`${Api.profileUrl}`);
    if (!customFunctions.checkIfEmpty(data.data, 'O')) {
      getEmployeeDocument(data.data.full_name);

      setShowLoader(false);
      setEmail(data.data.email);
      setName(data.data.full_name);
      setMobile(data.data.mobile);
      setId(data.data.emp_code);
      setBirthdate(data.data.dob ? customFunctions.getFormattedDate(data.data.dob):'-');
      setImageProfile(data.data.profile_image_url);
      setSelectedDesignationOption(data.data.designation_name);
      setSelectedDepartment(data.data.deparment_name);
      setProfileId(data.data.profile_id);
      const managerList = data.data.assigned_managers.map((assgnmgmr) => {
        return assgnmgmr.report_head__full_name;
      });
      setSelectedManager(managerList.length > 0 ? managerList.join(', ') : '');
      setDate(data.data.date_joined ? new Date(data.data.date_joined) : '');
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

   const getEmployeeHIstory = async () => {
    setShowLoader(true); 
    const employeeId = customFunctions.getLocalStorage('userId');
    const endPoint = `${Api.historyUrl}?sort_direction=descending&employee_id=${employeeId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setShowLoader(false);
      setCompanyList(data.data);
    }
  };

  useEffect(() => {
    async function getData() {
      const uRole = customFunctions.getLocalStorage('group');
      setTitle('My Profile');
      setRole(Number(uRole));
      getDepartment();
      getProfile();
      getEmployeeHIstory();
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
    setShowLoader(true);
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
      setShowLoader(false);
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
      setShowLoader(false);
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

 const getEmployeeDocument = async (fullName) => {
    setShowLoader(true);
    const formData = new FormData();

    formData.append('employee_name', fullName);

    const endPoint = `${Api.driveUploadDocumentUrl}`;
    const { data, message } = await AuthApi.postDataToServer(
      endPoint,
      formData
    );
    if (data) {
      setShowLoader(false);
      setEmployeeDocument(data.data);
      data.data &&
        data.data.map((document) => {
          if (document.title === 'Personal') {
            setRowPersonalData(document.files);
          } else if (document.title === 'Educational') {
            setRowEducationalData(document.files);
          } else if (document.title === 'Employment') {
            setRowEmploymentData(document.files);
          } else if (document.title === 'Other Documents') {
            setRowOtherData(document.files);
          }
          return document;
        });
    }
    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  return (
    <>
     <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">My Profile</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
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

                  {imageProfile ? (

                    <img
                      src={`${imageProfile}` ? `${imageProfile}` : `${Api.s3UrlnoProfile}`}
                      // src={imageProfile} 
                      alt="Edit Profile"
                      style={{ 'height': '100%' }} />
                  ) : <img
                    src={Api.s3UrlnoProfile}
                    alt="Edit Profile"
                    style={{ 'height': '100%' }}
                  />}

                </div>
              </Col>
              <Col sm={9}>
                <h3 className="main-notification-title text-primary">
                  <b>{name}</b>
                </h3>
                <h5 className="mt-5">Personal Information</h5>
                <div className="personal-info-date-number">
                  <Form.Label>
                    <UserRestrictions permittedUsers={[2, 3, 4,5]} roleId={role}>
                      <Image
                        src="/images/up-coming-birthday.svg"
                        className="svg me-3"
                      />
                      <span>{birthDate}</span>
                    </UserRestrictions>
                    <UserRestrictions permittedUsers={[1]} roleId={role}>
                      <Image
                        src="/images/mail.svg"
                        className="svg me-3"
                      />
                      <span> {companyEmail} </span>
                    </UserRestrictions>

                  </Form.Label>

                  <Form.Label>
                    <Image
                      src="/images/Mobile-num.svg"
                      className="svg me-3 ms-3"
                    />
                    <span>{mobile}</span>
                  </Form.Label>
                </div>

                <UserRestrictions permittedUsers={[2, 3, 4, 5]} roleId={role}>
                  <h5 className="mt-5">Job Information</h5>
                  <Row>
                    <Col sm={3}>
                    <Datepicker
                  label="Joining Date"
                  disabled
                  className="form-control"
                  selected={date}
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                 
                />
                    </Col>
                    <Col sm={3}>
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
                </UserRestrictions>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
     
     {companyList && companyList.length >= 1 ? (
      <div className="profile-details">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0 mt-2 ">Employment History</h5>
                   </div> 
                   <hr/> 
                    {companyList &&
                      companyList.map((comp) => (
                        <>
                          <div className="d-flex align-items-start justify-content-between">
                            <div className="media">
                              <Image
                                src={(comp.company_name === 'Stark Digital') ? '/images/stark-logo.png':'/images/sample-logo.png'}
                                className="mr-3"
                                alt="image"
                              />
                              <div className="media-body">
                                <h5 className="mt-0">{comp.designation}</h5>
                                <p>{comp.company_name}</p>
                                <p>
                                  {comp.start_date_formate} -{' '}
                                  {comp.end_date_formate} {comp.date}|{' '}
                                  {comp.duration}
                                </p>
                                <h6>{comp.location}</h6>
                              </div>
                            </div>
                          </div>
                          <hr />
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
       ) : ''}
     
       {employeeDocument && employeeDocument.length > 0 ? (
                  <>
                  <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0 mt-2 ">Documents</h5>
                   </div> 
                   <hr/> 
                    {employeeDocument &&
                      employeeDocument.map((document) => (
                        <>
                          {document.title === 'Personal' && (
                            <div className="row">
                              <h5 className="mb-3">Personal</h5>
                              <CustomTable
                                tableContainerClass="mt-2"
                                columns={personalColumns}
                                rows={rowPersonalData}
                                tableClass="table-striped"
                                showPagination={true}
                                emptyRender={() => {
                                  return 'No record found.';
                                }}
                              />
                            </div>
                          )}
                          {document.title === 'Educational' && (
                            <div className="row">
                              <h5 className="mb-3">Educational</h5>
                              <CustomTable
                                tableContainerClass="mt-2"
                                columns={educationalColumns}
                                rows={rowEducationalData}
                                tableClass="table-striped"
                                showPagination={true}
                                emptyRender={() => {
                                  return 'No record found.';
                                }}
                              />
                            </div>
                          )}
                          {document.title === 'Employment' && (
                            <div className="row">
                              <h5 className="mb-3">Previous Employment</h5>
                              <CustomTable
                                tableContainerClass="mt-2"
                                columns={employmentColumns}
                                rows={rowEmploymentData}
                                tableClass="table-striped"
                                showPagination={true}
                                emptyRender={() => {
                                  return 'No record found.';
                                }}
                              />
                            </div>
                          )}
                          {document.title === 'Other Documents' && (
                            <div className="row">
                              <h5 className="mb-3">Other Documents</h5>
                              <CustomTable
                                tableContainerClass="mt-2"
                                columns={otherColumns}
                                rows={rowOtherData}
                                tableClass="table-striped"
                                showPagination={true}
                                emptyRender={() => {
                                  return 'No record found.';
                                }}
                              />
                            </div>
                          )}
                        </>
                      ))}
                  </div>
                </div>
                  </>
                  ) : ''}
      <ModalInput
        size="md"
        centered
        show={modalShow}
        onHide={onCancel}
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
                      <img src={imageProfile || Api.s3UrlnoProfile} alt="Profile" style={{ 'height': '40px' }} />
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="float-end">

              <Button variant="primary" type="submit" className="ms-4">
                Update 
              </Button>
              <Button variant="secondary ms-4" onClick={() => onCancel()}>
                Cancel
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
