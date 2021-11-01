import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Helmet, TextInput } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

const validator = new SimpleReactValidator();

function AddPolicy(props) {
  const propsId = props;
  const polId = propsId.match.params.policyId;
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [
    { to: '/', label: 'Home' },
    { label: polId ? 'Edit Policy' : 'Add Policy' },
  ];
  const [count, forceUpdate] = useState(0);
  const [policyId, setPolicyId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [checked, setChecked] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [descriptionErr, setDescriptionErr] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const getData = async (id) => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.policyUrl}${id}/`
    );
    if (!data) {
      swal(message, '', 'error');
    }
    if (data && data.data) {
      setItemName(data.data.title);
      setImageUrl(data.data.image);
      const dp = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(data.data.description)
        )
      );
      setDescription(dp);
    }
  };

  useEffect(() => {
    setTitle('Add Policy');
    if (polId) {
      setTitle('Edit Policy');
      setPolicyId(polId);
      getData(polId);
    }
  }, []);

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

  const submitForm = async () => {
    setShowLoader(true);
    const stringDescription = stateToHTML(description.getCurrentContent());
    const postData = {
      title: itemName,
      description: stringDescription,
      is_email_send: checked,
      id: policyId ? Number(policyId) : '',
    };

    if (imageUrl) {
      postData.image = await uploadFile();
    }

    const payload = customFunctions.cleanObject(postData);

    const callback = policyId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = policyId ? Api.policyUrl : Api.policyUrl;
    const { data, message } = await callback(endPoint, payload);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }

    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        history.push('/policy');
      } else {
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
    });
  };

  const onCancel = () => {
    validator.hideMessages();
    history.push('/policy');
  };

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  };

  const onPolicySubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let discErr = '';
    if (!description.getCurrentContent().hasText()) {
      discErr = 'Description is required';
      isValid = false;
    }
    setDescriptionErr(discErr);
    if (validator.allValid() && isValid) {
      submitForm();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  validator.purgeFields();

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
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">{title}</h5>
              </div>
              <hr />
              <Form autoComplete="off" onSubmit={(e) => onPolicySubmit(e)}>
                <Row>
                  <Col>
                    <TextInput
                      onInputChange={(e) => setItemName(e.target.value)}
                      name="itemName"
                      asterisk="*"
                      label="Policy Title"
                      value={itemName || ''}
                      placeholder="Please enter item name"
                      errorMessage={validator.message(
                        'itemName',
                        itemName,
                        'required'
                      )}
                    />
                  </Col>
                  <Col>
                    <TextInput
                      onInputChange={(e) => {
                        handleImageFileUpload(e);
                      }}
                      label="Policy Image (Allowed file : JPG, PNG)"
                      accept="image/jpeg,image/png,"
                      containerClass="form-group"
                      id="inlineFormInputGroup"
                      type="file"
                      inputClass="form-control"
                    />
                  </Col>
                </Row>
                <Form.Label>
                  Description
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <div className="editor-description-box">
                  <Editor
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    editorState={description}
                    onEditorStateChange={(e) => {
                      onEditorStateChange(e);
                    }}
                    toolbar={{
                      options: [
                        'inline',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'textAlign',
                        'link',
                        'history',
                      ],
                      fontSize: {
                        options: [
                          7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                          22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
                          36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
                          50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76,
                          78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
                        ],
                      },
                      list: {
                        options: ['unordered', 'ordered'],
                      },
                    }}
                  />
                </div>
                <span className="text-danger">{descriptionErr}</span>
                <br />
                <input
                  onChange={(e) => {
                    setChecked(e.target.checked);
                  }}
                  name="checked"
                  type="checkbox"
                  id="checked"
                  className="form-submit-buttons"
                  value={checked}
                />
                <span className="ms-2">Do you want to send Email ?</span>
                <div className="mt-3">
                  <Button variant="primary" type="submit">
                    {policyId ? 'Update' : 'Submit'}
                  </Button>
                  <Button
                    className="ms-4"
                    variant="secondary"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}
export default withRouter(AddPolicy);
