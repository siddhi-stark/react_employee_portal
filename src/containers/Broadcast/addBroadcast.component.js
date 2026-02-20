import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Helmet, TextInput, Datepicker } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

const validator = new SimpleReactValidator();

function AddBroadcast(props) {
  const propsId = props;
  const broadId = propsId.match.params.broadid;
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [
    { to: '/', label: 'Home' },
    { label: broadId ? 'Edit Broadcast' : 'Add Broadcast' },
  ];
  const [count, forceUpdate] = useState(0);
  const [broadcastId, setBroadcastId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [checked, setChecked] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [descriptionErr, setDescriptionErr] = useState('');
  const [broadcastDate, setBroadcastDate] = useState('');

  const getData = async (id) => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.broadcastUrl}${id}/`
    );
    if (!data) {
      swal(message, '', 'error');
    }
    if (data && data.data) {
      setItemName(data.data.title);
      setBroadcastDate(
        data.data.display_date && new Date(data.data.display_date)
      );
      const dp = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(data.data.description)
        )
      );
      setDescription(dp);
    }
  };

  useEffect(() => {
    setTitle('Add Broadcast');
    if (broadId) {
      setTitle('Edit Broadcast');
      setBroadcastId(broadId);
      getData(broadId);
    }
  }, []);

  const submitForm = async () => {
    setShowLoader(true);
    const stringDescription = stateToHTML(description.getCurrentContent());
    const postData = {
      title: itemName,
      description: stringDescription,
      is_email_send: checked,
      self_check: true,
      self_cc: true,
      display_date: customFunctions.getDate(broadcastDate),
      id: broadcastId ? Number(broadcastId) : '',
    };

    const payload = customFunctions.cleanObject(postData);

    const callback = broadcastId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = broadcastId ? Api.broadcastUrl : Api.broadcastUrl;
    const { data, message } = await callback(endPoint, payload);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }

    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        history.push('/broadcast');
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
    history.push('/broadcast');
  };

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  };

  const onBroadcastSubmit = (e) => {
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
              <Form autoComplete="off" onSubmit={(e) => onBroadcastSubmit(e)}>
                <Row>
                  <Col>
                    <TextInput
                      onInputChange={(e) => setItemName(e.target.value)}
                      name="itemName"
                      asterisk="*"
                      label="Title"
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
                    <Datepicker
                      label="Broadcast Date"
                      asterisk="*"
                      className="form-control"
                      selected={broadcastDate}
                      minDate={new Date()}
                      placeholder="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      onChange={(e) => {
                        setBroadcastDate(e);
                      }}
                      errorMessage={validator.message(
                        'broadcastDate',
                        broadcastDate,
                        'required'
                      )}
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
                          7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
                          34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
                          47, 48, 49, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68,
                          70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94,
                          96, 98, 100,
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
                    {broadcastId ? 'Update' : 'Submit'}
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
export default withRouter(AddBroadcast);
