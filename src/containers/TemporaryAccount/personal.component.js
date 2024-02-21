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

 

  const handelChange = async (type, e) => {
    setShowLoader(true);
    const formData = new FormData();
    formData.append('file_name', e);
    const endPoint = `${Api.onBoardingDocUpload}`;
    const { data, message } = await axios.post(endPoint, formData, {});
    if (data && data.success == true) {

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
    const url = `${Api.postDocumentData}`;
   
    const { data, message } = await axios.post(url, postData);
    if (data && data.success == true) {
      setShowLoader(false);
      swal("Personal documents uploaded successfully", '', 'success').then(() => {
        props.callback("educational",true)
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
            disabled={!panCardUrl?.url || !aadharCardData?.url || !photoData?.url}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default withRouter(Personal);
