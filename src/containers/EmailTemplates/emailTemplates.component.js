import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import {
  EditorState,
  ContentState,
  convertFromHTML,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import swal from 'sweetalert';
import FormSections from './formschema.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function EmailTemplatesComponent() {
  const title = 'Employees List';

  const items = [{ to: '/', label: 'Home' }, { label: 'Email Templates' }];
 
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [emailContent, setEmailContent] = useState([]);
  const [templateId, setTemplateId] = useState(null);
  const [placeholdersData, setPlaceholdersData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [isShowLoader,setShowLoader] = useState(false);
  let [description] = useState(EditorState.createEmpty());

  const getEmailTemplateData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.emailTemplates}`
    );
    if (data) {
      data.data.map((email) => {

        const dp =
          email.body &&
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(email.body))
          );
        email.content = dp; //eslint-disable-line
        if (templateId === email.id) {
          updateDefaultValues({
            emailName: { label: email.name, value: email.id },
            emailSubject: email.subject,
          });
        }
        return email;
      });
      setEmailContent(data.data);
    } else {
      swal(message, '', 'error');
    }
  };

  const getPlaceholders = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.placeholders}?type=all`
    );
    if (data) {
      setPlaceholdersData(data.data);
    } else {
      swal(message, '', 'error');
    }
  };

  const onEditorStateChange = (editorState, index) => {
    
    const emlContent = [...emailContent];
    const data = emlContent.map((d, i) => {
      if (i === index) {
        d.content = editorState; //eslint-disable-line
      }
      return d;
    });
    setEmailContent([...data]);
  };
 
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
     
    getUserRole();
    getPlaceholders();
  }, []);

  useEffect(() => {
    if (templateId) getEmailTemplateData();
  }, [templateId]);

  const submitForm = async (formValues) => {
    setShowLoader(true);
    emailContent &&
      emailContent.map((emp) => {
        if (emp.id === templateId) {

          description = emp.content;
        }
        return emp;
      });
    const stringDescription = stateToHTML(description.getCurrentContent());
    const payload = {
      id: templateId ? Number(templateId) : '',
      name: formValues.emailName ? formValues.emailName.label : '',
      subject: formValues.emailSubject,
    };

    formValues = stringDescription; //eslint-disable-line
    payload.body = formValues;
    const { data, message } = await AuthApi.putDataToServer(
      Api.emailTemplates,
      payload
    );
    if (data) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
        updateDefaultValues({});
        setEmailContent([]);
      });
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
      
    }
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

  const getEmailTemplateName = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.emailTemplates);
    if (!data) {
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
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
      <Loader showLoader={isShowLoader} needFullPage={false} />
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
              getTemplateValue(value);
            },
          }}
          currentUser={currentUser}
          defaultFormValues={defaultValues}
          submitBtnText="Submit"
          showResetBtn={false}
          showBtnClass={true}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {}}
        />

        <p className="mt-3 container">
          <Row>
            <b className="mt-2 mb-2">
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
                          'image',
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
          </p>
      </Card>
    </>
  );
}

export default withRouter(EmailTemplatesComponent);
