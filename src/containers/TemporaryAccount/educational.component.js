/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './educationalFormschema.json';
import { Card, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import {
  Helmet,
  DropdownInput,
  TextInput,
  ModalInput,
  Datepicker,
} from '../../components/FormInputs';
import axios from 'axios';

function EducationalDetails(props) {
  const { getParentsData } = props;

  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  const applicantId = accProps.props.applicantId;
  // const passwordProps = accProps.props.password;
  // const tokenProps = accProps.props.token;
  // const nameProps = accProps.props.name;
  // const emailProps = accProps.props.email;
  const [docId, setDocId] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);

  const [sscDocData, setSscDocData] = useState({
    type: 'sss',
    file_id: '',
    educational_document_type: 1,
    url: '',
  });
  const [hscDocData, setHscDocData] = useState({
    type: 'hsc',
    file_id: '',
    educational_document_type: 2,
    url: '',
  });
  const [graduationDocData, setGraduationDocData] = useState({
    type: 'graduation',
    file_id: '',
    educational_document_type: 3,
    url: '',
  });
  const [postGraduationDocData, setPostGraduationDocData] = useState({
    type: 'postgraduation',
    file_id: '',
    educational_document_type: 4,
    url: '',
  });

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    if(applicantId){
      getUploadedDocuments()
    }
  }, [applicantId]);

  // const getData = async () => {
  //   let ssc = '';
  //   let hsc = '';
  //   let graduate = '';
  //   let postGraduate = '';
  //   const docIdArr = [];

  //   const endPoint = candidateId
  //     ? `${Api.applicantInfoUrl}?applicant_id=${candidateId}`
  //     : `${Api.applicantInfoUrl}`;

  //   const postData = {
  //     email_hash: tokenProps,
  //     password: passwordProps,
  //   };

  //   const { data, message } = applicantId
  //     ? await AuthApi.postDataToServer(endPoint, postData)
  //     : await AuthApi.postDataToServer(endPoint);

  //   if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
  //     data.data &&
  //       data.data.applicant_documents &&
  //       data.data.applicant_documents.map((doc) => {
  //         if (doc.doc_title === 'SSC') {
  //           ssc = doc.document_url;
  //         } else if (doc.doc_title === 'HSC') {
  //           hsc = doc.document_url;
  //         } else if (doc.doc_title === 'Graduation') {
  //           graduate = doc.document_url;
  //         } else if (doc.doc_title === 'Post Graduate') {
  //           postGraduate = doc.document_url;
  //         }

  //         docIdArr.push({ name: doc.doc_title, id: doc.doc_id });

  //         return doc;
  //       });
  //     updateDefaultValues({
  //       doc_link_ssc: ssc,
  //       doc_link_hsc: hsc,
  //       doc_link_graduate: graduate,
  //       doc_link_post_graduate: postGraduate,
  //     });

  //     setDocId(docIdArr);
  //   } else {
  //     swal(message, '', 'error', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (candidateId || applicantId) {
  //     getData();
  //   }
  // }, []);

  // const fileUpload = async (formValues) => {

  //   const formData = new FormData();

  //   formData.append('file_name', formValues[0]);
  //   formData.append('employee_name', nameProps);
  //   formData.append('employee_email', emailProps);
  //   formData.append('folder_name', 'Educational');
  //   formData.append('email_hash', tokenProps);
  //   formData.append('password', passwordProps);

  //   const { data } = await AuthApi.postDataToServer(
  //     `${Api.googleFileUploadUrl}`,
  //     formData
  //   );

  //   let fileId = null;
  //   if (!data || Object.keys(data).length === 0) {
  //     swal('Document upload failed', '', 'error', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //     });
  //     fileId = null;
  //   }
  //   if (data && Object.keys(data).length && data.success) {
  //     fileId = data.data.id;
  //   }
  //   return fileId;
  // };

  // const getApplicantPercentage = async () => {
  //   const endPoint = applicantId
  //     ? `${Api.applicantPercentageUrl}?applicant_id=${applicantId}`
  //     : `${Api.applicantPercentageUrl}?applicant_id=${candidateId}`;

  //   const { data, message } = await AuthApi.getDataFromServer(endPoint);

  //   if (customFunctions.checkIfEmpty(data)) {
  //     swal(message, '', 'error', {
  //       closeOnClickOutside: false,
  //       allowOutsideClick: false,
  //     });
  //   }
  //   if (!customFunctions.checkIfEmpty(data) && data.success && data.data) {
  //     getParentsData(data.data.completion);
  //   }
  // };

  // const submitForm = async (formValues) => {
  //   setShowLoader(true);

  //   let sscfileUrl = '';
  //   let sscfileUrlId = '';
  //   let hscfileUrl = '';
  //   let hscfileUrlId = '';
  //   let graduatefileUrl = '';
  //   let graduatefileUrlId = '';
  //   let postfileUrl = '';
  //   let postfileUrlId = '';

  //   docId &&
  //     docId.map((document) => {
  //       if (document.name === 'SSC') {
  //         sscfileUrl = document.id;
  //       } else if (document.name === 'HSC') {
  //         hscfileUrl = document.id;
  //       } else if (document.name === 'Graduation') {
  //         graduatefileUrl = document.id;
  //       } else if (document.name === 'Post Graduate') {
  //         postfileUrl = document.id;
  //       }
  //       return document;
  //     });

  //   if (formValues.doc_link_graduate) {
  //     graduatefileUrlId =
  //       typeof formValues.doc_link_graduate === 'object' &&
  //       (await fileUpload(formValues.doc_link_graduate));
  //   }
  //   if (formValues.doc_link_hsc) {
  //     hscfileUrlId =
  //       typeof formValues.doc_link_hsc === 'object' &&
  //       (await fileUpload(formValues.doc_link_hsc));
  //   }
  //   if (formValues.doc_link_post_graduate) {
  //     postfileUrlId =
  //       typeof formValues.doc_link_post_graduate === 'object' &&
  //       (await fileUpload(formValues.doc_link_post_graduate));
  //   }
  //   if (formValues.doc_link_ssc) {
  //     sscfileUrlId =
  //       typeof formValues.doc_link_ssc === 'object' &&
  //       (await fileUpload(formValues.doc_link_ssc));
  //   }

  //   const postData = {
  //     email_hash: tokenProps,
  //     password: passwordProps,
  //     applicant_id: candidateId ? Number(candidateId) : '',
  //     doc_type: 1,
  //     applicant_documents: [
  //       {
  //         doc_title: 'SSC',
  //         doc: sscfileUrlId ? Number(sscfileUrlId) : sscfileUrl,
  //       },
  //       {
  //         doc_title: 'HSC',
  //         doc: hscfileUrlId ? Number(hscfileUrlId) : hscfileUrl,
  //       },
  //       {
  //         doc_title: 'Graduation',
  //         doc: graduatefileUrlId ? Number(graduatefileUrlId) : graduatefileUrl,
  //       },
  //       {
  //         doc_title: 'Post Graduate',
  //         doc: postfileUrlId ? Number(postfileUrlId) : postfileUrl,
  //       },
  //     ],
  //   };

  //   if(graduatefileUrlId || (graduatefileUrl && hscfileUrlId) ||(hscfileUrl && postfileUrlId) ||
  //       (postfileUrl && sscfileUrlId) || sscfileUrl) {

  //   const { data, message } = await AuthApi.postDataToServer(`${Api.applicantDocumentUrl}`, postData);
  //     if (!data) {
  //       setShowLoader(false);
  //       swal(message, '', 'error', {
  //         closeOnClickOutside: false,
  //         allowOutsideClick: false,
  //         buttons: false,
  //         timer: 2000,
  //       }).then(() => {
  //         swal.close();
  //       });
  //     } else {
  //       setShowLoader(false);
  //       swal(data && data.message[0], '', 'success', {
  //         closeOnClickOutside: false,
  //         allowOutsideClick: false,
  //       }).then(() => {
  //         getApplicantPercentage();
  //         if (candidateId) {
  //           getData();
  //         }
  //         swal.close();
  //       });
  //     }
  //   } else {
  //     setShowLoader(false);
  //   }
  // };

  const handelChange = async (type, e) => {
    setShowLoader(true);
    const formData = new FormData();
    formData.append('file_name', e);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const { data, message } = await axios.post(endPoint, formData, {});
    if (data && data.success == true) {
      if (type == 'ssc') {
        setSscDocData({
          ...sscDocData,
          file_id: data?.data?.id,
          url: data?.data?.image,
        });
      }
      if (type == 'hsc') {
        setHscDocData({
          ...hscDocData,
          file_id: data?.data?.id,
          url: data?.data?.image,
        });
      }

      if (type == 'graduation') {
        setGraduationDocData({
          ...graduationDocData,
          file_id: data?.data?.id,
          url: data?.data?.image,
        });
      }

      if (type == 'postgraduation') {
        setPostGraduationDocData({
          ...postGraduationDocData,
          file_id: data?.data?.id,
          url: data?.data?.image,
        });
      }
      setShowLoader(false);
      swal('document uploaded successfully', '', 'success').then(() => {
        // window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getUploadedDocuments = async () => {
    console.log("insidee");
    setShowLoader(true);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const params = {
      applicant: applicantId
    };
    const token = customFunctions.getLocalStorage('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await axios.get(url, {
      // headers: headers,
    });
    if (data && data.success == true) {
      console.log("🚀 ~ getUploadedDocuments ~ data:", data)
      data?.data && data?.data?.map((item)=>{
        if(item?.educational_document_type == 1){
          setSscDocData({
            ...sscDocData,
            file_id: item?.id,
            url: item?.image_url,
          });
        }
        if(item?.educational_document_type == 2){
          setHscDocData({
            ...hscDocData,
            file_id: item?.id,
            url: item?.image_url,
          });
        }
        if(item?.educational_document_type == 3){
          setGraduationDocData({
            ...graduationDocData,
            file_id: item?.id,
            url: item?.image_url,
          });
        }
        if(item?.educational_document_type == 3){
          setPostGraduationDocData({
            ...postGraduationDocData,
            file_id: item?.id,
            url: item?.image_url,
          });
        }
      })
      setShowLoader(false);
    }
  };

  const submitEducationalDoc = async () => {
    setShowLoader(true);
    const postData = {
      applicant: applicantId,
      doc_type: 1,
      // is_submitted: 1,
      educational_documents: [
        {
          file_id: sscDocData?.file_id,
          educational_document_type: 1,
        },
        {
          file_id: hscDocData?.file_id,
          educational_document_type: 2,
        },
        {
          file_id: graduationDocData?.file_id,
          educational_document_type: 3,
        },
        {
          file_id: postGraduationDocData?.file_id,
          educational_document_type: 4,
        },
      ],
    };
    const callback = AuthApi.postDataToServer;
    const endPoint = `${Api.postDocumentData}`;

    const { data, message } = await callback(endPoint, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal({
        title: 'Congratulations',
        text: "You've successfully submitted your documents. You're one step closer to joining our team!",
        icon: 'success',
        confirmBtnBsStyle: 'btn btn-primary btn-lg',
        cancelBtnBsStyle: 'btn btn-lg btn-secondary',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      {/* <StarkFormBuilder
        containerClass=""
        formHeaderClass=""
        formSections={FormSections}
        formHeading="Educational Details"
        onFormSubmit={(formValues) => {
          // submitForm(formValues);
        }}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        showBtnClass={true}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons mb-4"
        isStepForm={false}
      /> */}

      <Card className="mt-3">
        <Card.Body>
          <div className="mt-3">
            <Row>
              <Col sm={6}>
                <TextInput
                  label="SSC"
                  asterisk="*"
                  type="file"
                  onInputChange={(e) => {
                    if (!e?.target?.files || e?.target?.files?.length < 1)
                      return;
                    if (
                      ['png', 'jpeg', 'jpg', 'svg'].includes(
                        e?.target?.files[0].name?.split('.').pop()
                      )
                    ) {
                      if (e?.target?.files[0].size > 2086147) {
                        swal('File size is too big', '', 'error');
                      } else {
                        handelChange('ssc', e?.target?.files[0]);
                      }
                    } else {
                      swal('File extension is not supported', '', 'error');
                    }
                  }}
                />
                {sscDocData?.url && (
                  <h5 className="mb-2">
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        window.open(sscDocData?.url);
                      }}
                    >
                      Preview
                    </a>
                  </h5>
                )}
              </Col>
            </Row>
            <Col sm={6}>
              <TextInput
                label="HSC / Diploma"
                asterisk="*"
                type="file"
                onInputChange={(e) => {
                  if (!e?.target?.files || e?.target?.files?.length < 1) return;
                  if (
                    ['png', 'jpeg', 'jpg', 'svg'].includes(
                      e?.target?.files[0].name?.split('.').pop()
                    )
                  ) {
                    if (e?.target?.files[0].size > 2086147) {
                      swal('File size is too big', '', 'error');
                    } else {
                      handelChange('hsc', e?.target?.files[0]);
                    }
                  } else {
                    swal('File extension is not supported', '', 'error');
                  }
                }}
              />
              {hscDocData?.url && (
                <h5 className="mb-2">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      window.open(hscDocData?.url);
                    }}
                  >
                    Preview
                  </a>
                </h5>
              )}
            </Col>

            <Col sm={6}>
              <TextInput
                label="Graduation"
                asterisk="*"
                type="file"
                onInputChange={(e) => {
                  if (!e?.target?.files || e?.target?.files?.length < 1) return;
                  if (
                    ['png', 'jpeg', 'jpg', 'svg'].includes(
                      e?.target?.files[0].name?.split('.').pop()
                    )
                  ) {
                    if (e?.target?.files[0].size > 2086147) {
                      swal('File size is too big', '', 'error');
                    } else {
                      handelChange('graduation', e?.target?.files[0]);
                    }
                  } else {
                    swal('File extension is not supported', '', 'error');
                  }
                }}
              />
              {graduationDocData?.url && (
                <h5 className="mb-2">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      window.open(graduationDocData?.url);
                    }}
                  >
                    Preview
                  </a>
                </h5>
              )}
            </Col>
            <Col sm={6}>
              <TextInput
                label="Post graduate"
                type="file"
                onInputChange={(e) => {
                  if (!e?.target?.files || e?.target?.files?.length < 1) return;
                  if (
                    ['png', 'jpeg', 'jpg', 'svg'].includes(
                      e?.target?.files[0].name?.split('.').pop()
                    )
                  ) {
                    if (e?.target?.files[0].size > 2086147) {
                      swal('File size is too big', '', 'error');
                    } else {
                      handelChange('postgraduation', e?.target?.files[0]);
                    }
                  } else {
                    swal('File extension is not supported', '', 'error');
                  }
                }}
              />
              {postGraduationDocData?.url && (
                <h5 className="mb-2">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      window.open(postGraduationDocData?.url);
                    }}
                  >
                    Preview
                  </a>
                </h5>
              )}
            </Col>
          </div>

          <Button
            onClick={() => {
              swal({
                title: 'Are you sure?',
                text: 'Do you want to submit these documents?',
                icon: 'warning',
                confirmBtnBsStyle: 'btn btn-primary btn-lg',
                cancelBtnBsStyle: 'btn btn-lg btn-secondary',
                dangerMode: true,
                buttons: true,
                closeOnClickOutside: false,
                allowOutsideClick: false,
              }).then((Click) => {
                if (Click) {
                  submitEducationalDoc();
                }
              });
            }}
            disabled={
              !sscDocData?.url || !hscDocData?.url || !graduationDocData?.url
            }
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default withRouter(EducationalDetails);
