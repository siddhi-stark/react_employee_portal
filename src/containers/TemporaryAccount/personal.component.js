/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import {
  Helmet,
  DropdownInput,
  TextInput,
  ModalInput,
  Datepicker,
} from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import FormSections from './personalFormschema.json';
import { Card, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';

function Personal(props) {
  const { getParentsData } = props;

  const accProps = { props };
  const candidateId = accProps.props.match.params.ID;
  const applicantId = accProps.props.applicantId;
  const employeeId = accProps.props.ID;
  const passwordProps = accProps.props.password;
  const tokenProps = accProps.props.token;
  const nameProps = accProps.props.name;
  const emailProps = accProps.props.email;

  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [docId, setDocId] = useState(null);
  const [isShowLoader, setShowLoader] = useState(false);

  const [panCardUrl, setPanCardData] = useState({
    type: 'panCard',
    file_id: '',
    personal_document_type: 1,
    url: '',
  });
  const [aadharCardData, setAadharCardData] = useState({
    type: 'aadharCard',
    file_id: '',
    personal_document_type: 2,
    url: '',
  });

  const [photoData, setPhotoData] = useState({
    type: 'photo',
    file_id: '',
    personal_document_type: 3,
    url: '',
  });

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // const getData = async () => {
  //   let panCard = '';
  //   let adharCard = '';
  //   let photo = '';
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
  //         if (doc.doc_title === 'Pan') {
  //           panCard = doc.document_url;
  //         } else if (doc.doc_title === 'Aadhar') {
  //           adharCard = doc.document_url;
  //         } else if (doc.doc_title === 'Photo') {
  //           photo = doc.document_url;
  //         }

  //         docIdArr.push({ name: doc.doc_title, id: doc.doc_id });

  //         return doc;
  //       });
  //     updateDefaultValues({
  //       doc_link_pan_card: panCard,
  //       doc_link_adhar_card: adharCard,
  //       doc_link_photo: photo,
  //     });
  //     setDocId(docIdArr);
  //   } else {
  //     swal(message, '', 'error');
  //   }
  // };

  // useEffect(async () => {
  //   if (candidateId || applicantId || employeeId) {
  //     // getData();
  //   }
  // }, []);

  // const fileUpload = async (formValues) => {
  //   const formData = new FormData();

  //   formData.append('file_name', formValues[0]);
  //   console.log("🚀 ~ fileUpload ~ formData:", formData)
  //   // formData.append('email_hash', tokenProps);
  //   // formData.append('password', passwordProps);
  //   // formData.append('employee_name', nameProps);
  //   // formData.append('employee_email', emailProps);
  //   // formData.append('folder_name', 'Personal');

  //   const { data } = await AuthApi.postDataToServer(
  //     `${Api.onBoardingDocUpload}`,
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
  //   // eslint-disable-line
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
  //   console.log("🚀 ~ submitForm ~ formValues:", formValues)
  //   setShowLoader(true);

  //   let pancardfileUrl = '';
  //   let pancardfileUrlId = '';
  //   let adharfileUrl = '';
  //   let adharfileUrlId = '';
  //   let photofileUrl = '';
  //   let photofileUrlId = '';

  //   docId &&
  //     docId.map((document) => {
  //       if (document.name === 'Pan') {
  //         pancardfileUrl = document.id;
  //       } else if (document.name === 'Aadhar') {
  //         adharfileUrl = document.id;
  //       } else if (document.name === 'Photo') {
  //         photofileUrl = document.id;
  //       }
  //       return document;
  //     });

  //   if (formValues.doc_link_pan_card) {
  //     pancardfileUrlId =
  //       typeof formValues.doc_link_pan_card === 'object' &&
  //       (await fileUpload(formValues.doc_link_pan_card));
  //   }
  //   if (formValues.doc_link_adhar_card) {
  //     adharfileUrlId =
  //       typeof formValues.doc_link_adhar_card === 'object' &&
  //       (await fileUpload(formValues.doc_link_adhar_card));
  //   }
  //   if (formValues.doc_link_photo) {
  //     photofileUrlId =
  //       typeof formValues.doc_link_photo === 'object' &&
  //       (await fileUpload(formValues.doc_link_photo));
  //   }

  //   const postData = {
  //     applicant_id: candidateId ? Number(candidateId) : '',
  //     doc_type: 2,
  //     personal_ducuments: [
  //       {
  //         doc_title: 'Aadhar',
  //         doc: adharfileUrlId ? Number(adharfileUrlId) : adharfileUrl,
  //       },
  //       {
  //         doc_title: 'Pan',
  //         doc: pancardfileUrlId ? Number(pancardfileUrlId) : pancardfileUrl,
  //       },
  //       {
  //         doc_title: 'Photo',
  //         doc: photofileUrlId ? Number(photofileUrlId) : photofileUrl,
  //       },
  //     ],
  //   };

  //   if (
  //     pancardfileUrlId ||
  //     (pancardfileUrl && adharfileUrlId) ||
  //     (adharfileUrl && photofileUrlId) ||
  //     photofileUrl
  //   ) {
  //     const { data, message } = await AuthApi.postDataToServer(
  //       `${Api.onBoardingDocUpload}`,
  //       postData
  //     );

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
      console.log('🚀 ~ handelChange ~ data:', data);

      if (type == 'pancard') {
        setPanCardData({
          ...panCardUrl,
          file_id: data?.data?.id,
          url: data?.data?.image,
        });
      }
      if (type == 'aadharcard') {
        setAadharCardData({
          ...aadharCardData,
          file_id: data?.data?.id,
          url: data?.data?.image,
        });
      }

      if (type == 'photo') {
        setPhotoData({
          ...photoData,
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

  const submitPersonalDoc = async () => {
    setShowLoader(true);
    const postData = {
      applicant: applicantId,
      doc_type: 2,
      personal_ducuments: [
        {
          file_id: panCardUrl?.file_id,
          personal_document_type: 1,
        },
        {
          file_id: aadharCardData?.file_id,
          personal_document_type: 2,
        },
        {
          file_id: photoData?.file_id,
          personal_document_type: 3,
        },
      ],
    };
    // const callback = AuthApi.postDataToServer;
    const url = `${Api.postDocumentData}`;
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const { data, message } = await axios.post(url, postData, {
      headers: headers,
    });
    if (data && data.success == true) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success').then(() => {});
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
        formHeading="Personal Details"
        onFormSubmit={(formValues) => {
          submitForm(formValues);
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
                  label="Pan Card"
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
                        handelChange('pancard', e?.target?.files[0]);
                      }
                    } else {
                      swal('File extension is not supported', '', 'error');
                    }
                  }}
                />
                {panCardUrl?.url && (
                  <h5 className="mb-2">
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        window.open(panCardUrl?.url);
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
                label="Aadhar Card"
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
                      handelChange('aadharcard', e?.target?.files[0]);
                    }
                  } else {
                    swal('File extension is not supported', '', 'error');
                  }
                }}
              />
              {aadharCardData?.url && (
                <h5 className="mb-2">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      window.open(aadharCardData?.url);
                    }}
                  >
                    Preview
                  </a>
                </h5>
              )}
            </Col>

            <Col sm={6}>
              <TextInput
                label="Photo"
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
                      handelChange('photo', e?.target?.files[0]);
                    }
                  } else {
                    swal('File extension is not supported', '', 'error');
                  }
                }}
              />
              {photoData?.url && (
                <h5 className="mb-2">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      window.open(photoData?.url);
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
              submitPersonalDoc();
            }}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default withRouter(Personal);
