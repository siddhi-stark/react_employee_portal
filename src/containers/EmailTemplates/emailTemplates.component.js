import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
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
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [emailContent, setEmailContent] = useState([]);
  const [templateId, setTemplateId] = useState(null); // eslint-disable-line
  const [placeholdersData, setPlaceholdersData] = useState([]);
  const [toggle, setToggle] = useState(false);

  // Email

  const [description] = useState(EditorState.createEmpty());
  // const test =
  //   'Dear Employee First Name,<br />With reference to the thorough evaluation of your performance during the probation period from Start Date to End Date, we are pleased to inform you that your employment is being confirmed as Job Title from Date of Confirmation. </br> The terms and conditions of your employment and your job responsibilities will continue to remain the same. We thank you for your valuable contribution made to your process and hope that you will perform with equal enthusiasm in future.</br>All the very best in all your endeavors with Stark!!</br>All the very best for a fruitful carrear with Stark !!</br>Regards,';
  // const [description, setDescription] = useState(
  //   EditorState.createWithContent(
  //     ContentState.createFromBlockArray(convertFromHTML(test))
  //   )
  // );

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
        // console.log('desc', dp);
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

  const onEditorStateChange = (editorState, index) => {
    console.log('index', index);
    console.log('editorState', editorState);
    // setDescription(editorState);
    const emlContent = [...emailContent];
    const data = emlContent.map((d, i) => {
      if (i === index) {
        d.content = editorState; //eslint-disable-line
      }
      return d;
    });
    console.log('data---',data);
    setEmailContent([...data]);
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
      name: formValues.emailName ? formValues.emailName.label:'',
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
    const { data, message } = await AuthApi.postDataToServer(
      Api.emailTemplates,
      payload
    );
    swal(data && data.message[0], '', 'success');
    if (!data) {
      console.log('message',message);
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
  console.log('emailContent', emailContent);

  const getEmailTemplateName = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.emailTemplates);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      emailName: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getEmailTemplateName();
  }, []);

  const getTemplateValue = (value) => {
    if (!value) return;
    setTemplateId(value.value);
  };

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
          options={options}
          callbacks={{
            selectHandler: (value) => {
              console.log('value--', value);
              getTemplateValue(value);
            },
          }}
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
          <Row>
            <b className='mt-2 mb-2'>
              Note:-The given list of words are the dynamic content which will
              replaced by the appropriate words while sending mail. Please use
              word as per the need as it is, do not make changes into them.
            </b>
            {placeholdersData &&
              placeholdersData.map((place) => (
                <Col md={4}>
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
                </Col>
              ))}
          </Row>
        </p>
        {emailContent &&
          emailContent.map((eml, index) => {
            if (!templateId) return;
            return ( // eslint-disable-line
              <>
                {templateId === eml.id && (
                  <>
                    <b>{eml.name}</b>
                    <Editor
                      // readOnly={viewType}
                      wrapperClassName="demo-wrapper mt-4"
                      editorClassName="demo-editor"
                      editorState={eml.content}
                      onEditorStateChange={(e) => {
                        console.log('e', e);
                        onEditorStateChange(e, index);
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
                  </>
                )}
              </>
            );
          })}
      </Card>
    </>
  );
}

export default withRouter(EmailTemplatesComponent);
