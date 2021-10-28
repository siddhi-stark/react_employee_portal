import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import {Card } from 'react-bootstrap';
import swal from 'sweetalert';
import { Editor } from 'react-draft-wysiwyg';
import FormSections from './formschema.json';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function AddBroadcast(props) {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Add Broadcast' }];

  useEffect(() => {
    setTitle('Add Broadcast');
  }, []);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [quotesId, setQuotesId] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitForm = async (formValues) => {
    console.log('formValues',formValues);
    setShowLoader(true);
    // emailContent &&
    //   emailContent.map((emp) => {
    //     if (emp.id === templateId) {

    //       description = emp.content;
    //     }
    //     return emp;
    //   });
    // const stringDescription = stateToHTML(description.getCurrentContent());
    
    const payload = customFunctions.cleanObject(formValues);

    const callback = quotesId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = quotesId
      ? `${Api.broadcastUrl}${quotesId}/`
      : Api.broadcastUrl;
    const { data, message } = await callback(endPoint, payload);

    if (!data) {
      setShowLoader(false);
      swal(message, '', 'error');
    }
    
    setShowLoader(false);
    swal(data && data.message[0], '', 'success').then((result) => {
      if (result) {
        setShowLoader(false);
        history.push('/quotes');
      }
    });
    
  };

  const getData = async (id) => {
    const { data, message } = await AuthApi.getDataFromServer(`${Api.broadcastUrl}${id}/`);
    if (!data) {
      swal(message, '', 'error');
      return;
    }
    // setEmailBody(data.data.body);
    //     const dp = data.data.body &&
    //       EditorState.createWithContent(
    //         ContentState.createFromBlockArray(convertFromHTML(data.data.body))
    //       );
    //   setEmailContent(dp);

    updateDefaultValues({

      content: data.data.content});
  };

  useEffect(() => {
    const id = props.match.params.qid;
    if(id){
      setQuotesId(id);
      getData(id);
    }
  }, []);
  
  // const onEditorStateChange = (editorState, index) => {
  //   const emlContent = [...emailContent];
  //   const data = emlContent.map((d, i) => {
  //     if (i === index) {
  //       d.content = editorState; //eslint-disable-line
  //     }
  //     return d;
  //   });
  //   setEmailContent([...data]);
  // };
 

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Add Broadcast</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Add Broadcast</h5>
            </div>  
            <hr/>
             <Editor
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                // editorState={emailContent}
                 // onEditorStateChange={(e) => {
                 //        onEditorStateChange(e, index);
                 //      }}
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
            <StarkFormBuilder
              containerClass=''
              formHeaderClass=''
              formSections={FormSections}
              formHeading="Broadcast Form"
              onFormSubmit={(formValues) => {submitForm(formValues);}}
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Submit"
              showResetBtn={true}
              resetBtnText="Cancel"
              btnContainerClass="form-submit-buttons"
              showBtnClass={true}
              isStepForm={false}
              
              onFormReset={() => {
                history.push('/broadcast');

              }}
            />
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(AddBroadcast);
