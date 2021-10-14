import React, { useState, useEffect } from 'react';
import { withRouter, useHistory, Link } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Image, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import AddHistory from './AddHistory.component';
import EditPersonalDetails from './EditPersonalDetails.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Helmet } from '../../components/FormInputs';
import AddBondHistory from './AddBondHistory.component';

function EmployeeProfile(props) {
  const [showEmployee, setShowEMployee] = useState(false);
  const [dataa, setData] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [title, setTitle] = useState('');
  const [employeeDocument, setEmployeeDocument] = useState([]);
  const [rowEducationalData, setRowEducationalData] = useState([]);
  const [rowPersonalData, setRowPersonalData] = useState([]);
  const [rowEmploymentData, setRowEmploymentData] = useState([]);
  const [rowOtherData, setRowOtherData] = useState([]);
  const [isShowLoader,setShowLoader] = useState(false);
  const [showBond,setShowBond] = useState(false);
  const [bondList, setBondList] = useState([]);
  const [bondData, setBondData] = useState({});
  const employeeData = {props};
  const employeeID = employeeData.props.match.params.id;

  const items = [{ to: '/', label: 'Home' }, { label: 'Employee' }];
  const history = useHistory();

  const getEmployeeDetails = async () => {
    setShowLoader(true);
    const employeeId = props.match.params.id;
    customFunctions.setLocalStorage('id', employeeId);
    const { data } = await AuthApi.getDataFromServer(
      `${Api.employeeUrl}${employeeId}/`
    );
    if (data) {
      setShowLoader(false);
      setEmployeeDetails(data.data);
      getEmployeeDocument(data.data && data.data.full_name);
    }
  };

  const getEmployeeHIstory = async () => {
    setShowLoader(true);
    const employeeId = props.match.params.id;
    const endPoint = `${Api.historyUrl}?sort_direction=descending&employee_id=${employeeId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setShowLoader(false);
      setCompanyList(data.data);
    }
  };

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
            <a href={document_url} target="_blank" // eslint-disable-line
            > 
              <Image className="ms-1"  src="/images/delete.png" />
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
            <a href={document_url} target="_blank" // eslint-disable-line
            > 
              <Image className="ms-1"  src="/images/delete.png" />
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
            <a href={document_url} target="_blank" // eslint-disable-line
            > 
              <Image className="ms-1"  src="/images/delete.png" />
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
            <a href={document_url} target="_blank" // eslint-disable-line
            > 
              <Image className="ms-1"  src="/images/delete.png" />
            </a>
          </>
        );
      },
    },
  ];

  const getEmployeeDocument = async (name) => {
    setShowLoader(true);
    const formData = new FormData();

    formData.append('employee_name', name);

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

  useEffect(() => {
    getEmployeeHIstory();
    getEmployeeDetails();
    getBondHistory();
    setTitle('Employee Profile');
  }, []);

  const onChangeInHistory = () => {
    getEmployeeHIstory();
    getEmployeeDetails();
  };

  const onEmployeePersonalDetails = () => {
    getEmployeeDetails();
  };

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

  const getBondHistory = async () => {
    setShowLoader(true);
    const employeeId = props.match.params.id;
    const endPoint = `${Api.employeeBondDetailsUrl}?sort_direction=descending&employee_id=${employeeId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setShowLoader(false);
      setBondList(data.data);
    }
  };
  
  const onChangeInBondHistory = () => {
    getBondHistory();
  };

  const deleteBondHistory = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the bond history?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.employeeBondDetailsUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getBondHistory();
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
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Button className="float-end mt-2 mb-2 mr-3" onClick={() => history.push('/employees')} >Back</Button>
      <div className="col-xl-12" id="main-content">
        <div className="employee-new-profile">
          <div className="profile-bg">
            <Image src="/images/image.png" alt="image" />
            <div className="profile-img">
              <Image
                src={
                  employeeDetails.profile_image_url
                    ? `${employeeDetails.profile_image_url}`
                    : `${Api.s3UrlnoProfile}`
                }
                alt="Card image cap"
              />
            </div>
          </div>
          <h3>{employeeDetails.full_name}</h3>
          <h5>{employeeDetails.designation_name}</h5>
          <div className="table-projects">
            {showPersonalDetails ? (
              <div className="mt-4 card">
                <div className="card-body">
                  <EditPersonalDetails
                    handleModalCLose={(e) => setShowPersonalDetails(e)}
                    onPersonalDetailChanges={() => {
                      onEmployeePersonalDetails();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 card">
                <div className="card-body">

                <div className=" d-flex align-items-center justify-content-between mb-2">
                  <div className="date-edit-option d-flex align-items-center justify-content-between w-100">
                    <h6 className="me-5">
                      DOB -{' '}
                      {employeeDetails.dob
                        ? customFunctions.getDMYDate(employeeDetails.dob)
                        : ''}
                    </h6>
                    <a
                      href="javascript:void()"
                      onClick={() => {
                        setShowPersonalDetails(true);
                      }}
                    >
                      {!employeeDetails.relieved && (
                        <Image
                          src="/images/edit-button.svg"
                          alt="Edit Profile"
                        />
                      )}
                    </a>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <h6>
                      Joining Date -{' '}
                      {employeeDetails.date_joined
                        ? customFunctions.getDMYDate(
                            employeeDetails.date_joined
                          )
                        : ''}
                    </h6>
                  </div>
                  <div className="col-md-4">
                    <h6>Email - {employeeDetails.email}</h6>
                  </div>
                  <div className="col-md-5">
                    <h6>Personal Email - {employeeDetails.personal_email}</h6>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-3">
                    <h6>Contact No - {employeeDetails.mobile}</h6>
                  </div>
                  <div className="col-md-4">
                    {employeeDetails.relieving_date ? (
                      <h6>
                        Relieving Date -{' '}
                        {employeeDetails.relieving_date
                          ? customFunctions.getDMYDate(
                              employeeDetails.relieving_date
                            )
                          : ''}
                      </h6>
                    ) : (
                      <h6>
                        Confirmation Date -{' '}
                        {employeeDetails.confirmation_date
                          ? customFunctions.getDMYDate(
                              employeeDetails.confirmation_date
                            )
                          : ''}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-5">
                    {employeeDetails &&
                      !employeeDetails.confirmation_date &&
                      !employeeDetails.relieving_date && (
                        <button
                          onClick={() => {
                            history.push('/confirmation');
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Confirm
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
             )}
          </div>
          <div className="profile-details">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-4">
                      {!companyList.length < 1 && (
                        <h5 className="card-title">Experience</h5>
                      )}

                      {!employeeDetails.relieved && (
                        <button
                          onClick={() => {
                            setShowEMployee(true);
                            customFunctions.removeLocalStorage('hisotryID');
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Add History
                        </button>
                      )}
                    </div>
                    {showEmployee && (
                      <div className="mt-4 card">
                        <AddHistory
                          optionsData={dataa}
                          handleModalCLose={(e) => setShowEMployee(e)}
                          onChanges={() => {
                            onChangeInHistory();
                          }}
                        />
                      </div>
                    )}
                    {companyList &&
                      companyList.map((comp) => (
                        <>
                          <div className="d-flex align-items-start justify-content-between">
                            <div className="media">
                              <Image
                                src={
                                  comp.company_name === 'Stark Digital'
                                    ? '/images/stark-logo.png'
                                    : '/images/sample-logo.png'
                                }
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
                            <div className="address-edit-delete d-flex align-items-center">
                              <a href="javascript:void()">
                                <Image
                                  src="/images/edit-button.svg"
                                  title="Edit Profile"
                                  onClick={() => {
                                    setData(comp);
                                    setShowEMployee(true);
                                    customFunctions.setLocalStorage(
                                      'hisotryID',
                                      comp.id
                                    );
                                    // history.push(`/profile-history/id=${comp.id}`)
                                  }}
                                />
                              </a>
                              <a href="javascript:void()">
                                <Image
                                  src="/images/delete.png"
                                  title="Edit Profile"
                                  onClick={() => {
                                    deleteEmployeeHistory(comp.id);
                                  }}
                                />
                              </a>
                            </div>
                          </div>
                          <hr />
                        </>
                      ))}
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-4">
                        <h5 className="card-title">Bond History</h5>

                        <button
                          onClick={() => {
                            setShowBond(true);
                            customFunctions.removeLocalStorage('bondHistoryID');
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Add Bond
                        </button>
                    </div>
                   {showBond && (
                      <div className="mt-4 card">
                        <AddBondHistory
                          optionsData={bondData}
                          handleModalCLose={(e) => setShowBond(e)}
                          onChanges={() => {
                            onChangeInBondHistory();
                          }}
                        />
                      </div>
                    )}
                    {bondList &&
                      bondList.map((bond) => (
                        <>
                          <div className="d-flex align-items-start justify-content-between">
                            <div className="media">
                              <div className="media-body">
                                <p>
                                  Start Date: {bond.start_date && customFunctions.getDMYDate( bond.start_date)} &nbsp;
                                  End Date: {bond.end_date && customFunctions.getDMYDate(bond.end_date)} <br/>
                                
                                Document Link: 
                                  <Link
                                    className="mt-3 ms-2"
                                    title="Document Link"
                                    to={{ pathname: `${bond.file_name}`}}
                                    target="_blank"
                                  >
                                   { bond.file_name && decodeURI(bond.file_name.split(decodeURI(Api.s3url))).substring(55)}
                                  </Link>
                                </p>
                              </div>
                            </div>
                            <div className="address-edit-delete d-flex align-items-center">
                              <a href="javascript:void()">
                                <Image
                                  src="/images/edit-button.svg"
                                  title="Edit Profile"
                                  onClick={() => {
                                    setBondData(bond);
                                    setShowBond(true);
                                    customFunctions.setLocalStorage(
                                      'bondHistoryID',
                                      bond.id
                                    );
                                    // history.push(`/profile-history/id=${comp.id}`)
                                  }}
                                />
                              </a>
                              <a href="javascript:void()">
                                <Image
                                  src="/images/delete.png"
                                  title="Edit Profile"
                                  onClick={() => {
                                    deleteBondHistory(bond.id);
                                  }}
                                />
                              </a>
                            </div>
                          </div>
                          <hr />
                        </>
                      ))}
                  </div>
                </div>
               
               {employeeDocument && employeeDocument.length > 0 ?  (
                  <>
                  <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0 mt-2 ">Documents</h5>
                      <button
                          onClick={() => {
                            setShowBond(true);
                            history.push(`/addemployement-history/${employeeID}`,{email:employeeDetails.email,name: employeeDetails.full_name});
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Add Documents
                        </button>
                   </div> 
                   <hr/> 
                   <div className="row">
                    {employeeDocument &&
                      employeeDocument.map((document) => (
                        <>
                          {document.title === 'Personal' && (
                            <div className="col-md-4">
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
                            <div className="col-md-4">
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
                            <div className="col-md-4">
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
                            <div className="col-md-4">
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
                </div>
                  </>
                 ) : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(EmployeeProfile);
