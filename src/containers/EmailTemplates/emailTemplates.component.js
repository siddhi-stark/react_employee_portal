import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import swal from 'sweetalert';
import FormSections from './formschema.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function EmailTemplatesComponent() {
  const title = 'Employees List';

  const items = [{ to: '/', label: 'Home' }, { label: 'Email Templates' }];
  // Variable declarations
  // const [defaultValues, updateDefaultValues] = useState({});
  // const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [emailContent, setEmailContent] = useState([]);
  const [placeholdersData, setPlaceholdersData] = useState([]);
  const [toggle, setToggle] = useState(false);

  // Email

  const [description, setDescription] = useState(EditorState.createEmpty());

  const getEmailTemplateData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.emailTemplates}`
    );
    if (data) {
      await data.data.map((email) => {
        // console.log('email', email);
        const dp = EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(email.body))
        );
        email.content = dp; //eslint-disable-line
        console.log('desc', dp);
        return email;
      });
      setEmailContent(data.data);
    } else {
      swal(message, '', 'error');
    }
  };

  const getPlaceholders = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.placeholders}`
    );
    if (data) {
      setPlaceholdersData(data.data);
    } else {
      swal(message, '', 'error');
    }
  };

  const onEditorStateChange = (editorState,index) => {
    if(!index) return;
    setDescription(editorState);
  };

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    getPlaceholders();
    getEmailTemplateData();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    let stringDescription = '';
    const payload = {
      name: formValues.emailName,
      subject: formValues.emailSubject,
    };
    convertToRaw(description.getCurrentContent()) &&
      convertToRaw(description.getCurrentContent()).blocks &&
      convertToRaw(description.getCurrentContent()).blocks.map((desc) => {
        stringDescription += `${desc.text}\n`;
        return desc;
      });
    formValues = stringDescription; //eslint-disable-line
    payload.body = formValues;
    console.log('payload', payload);
    const { data, message } = await AuthApi.postDataToServer(
      Api.emailTemplates,
      payload
    );
    swal(data && data.message[0], '', 'success');
    if (!data) {
      swal(message, '', 'error');
      // show error
    }
    // Perform success actions
  };

  const copyToClipboard = (id) => {
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    const selectedNode = document.getElementById(id);
    range.selectNode(selectedNode);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  };
  console.log('emailContent',emailContent);
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Email Templates</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body>
        <StarkFormBuilder
          containerClass=""
          formHeaderClass=""
          formSections={FormSections}
          formHeading="Email Templates"
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          // options={options}
          callbacks={{}}
          // defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Submit"
          showResetBtn={false}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />

        <p className="mt-3">
          <b>
            Note:-The given list of words are the dynamic content which will
            replaced by the appropriate words while sending mail. Please use
            word as per the need as it is, do not make changes into them.
          </b>
          {placeholdersData &&
            placeholdersData.map((place) => (
              <p // eslint-disable-line
                id={place.name}
                title={toggle ? 'copied' : 'copy'}
                onClick={() => {
                  setToggle(true);
                  copyToClipboard(place.name);
                }}
              >
                {place.name}
              </p>
            ))}
        </p>
        {emailContent &&
          emailContent.map((eml,index) => {
            return (
              <>
                <b>{eml.name}</b>
                <Editor
                  // readOnly={viewType}
                  wrapperClassName="demo-wrapper mt-4"
                  editorClassName="demo-editor"
                  editorState={eml.content}
                  onEditorStateChange={(e) => {
                    console.log('e', e);
                    onEditorStateChange(e,index);
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
              </>
            );
          })}
      </Card>
    </>
  );
}

export default withRouter(EmailTemplatesComponent);
