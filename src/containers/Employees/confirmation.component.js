import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Datepicker, Helmet, DropdownInput } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function Confirmation() {
  const history = useHistory();
  const name = customFunctions.getLocalStorage('employeeName');
  const id = localStorage.getItem('candidateId');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [emailContent, setEmailContent] = useState(EditorState.createEmpty());
  const [emailBody, setEmailBody] = useState('');

  const validator = new SimpleReactValidator({ autoForceUpdate: this });
  const title = 'Confirmation';

  const items = [{ to: '/', label: 'Home' }, { label: 'Confirmation' }];

  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    []
  );
  const [designation, setDesignation] = useState([]);

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setDesignation(data.data);
    }
  };

  useEffect(() => {
    getEmailTemplateData();
    getDesignation();
  }, []);

  const getDesignationList = () => {
    if (!designation) return [];
    const options = [];
    designation.map((desgn) => {
      return options.push({
        label: desgn.name,
        id: desgn.id,
      });
    });
    return options;
  };

  const getEmailTemplateData = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.emailTemplates}?name=Confirmation Letter`
    );
    if (data) {
      setEmailBody(data.data.body);
      const dp =
        data.data.body &&
        EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(data.data.body))
        );
      setEmailContent(dp);
    } else {
      swal(message, '', 'error');
    }
  };

  const sendConfirmationLetter = async (emlBody) => {
    const postData = {
      name: 'Confirmation Letter',
      subject: 'Employee Confirmation',
      employee_id: id,
      body: emlBody,
      designation_id: selectedDesignationOption
        ? Number(selectedDesignationOption.id)
        : '',
      confirmation_date: confirmationDate
        ? customFunctions.getDate(confirmationDate)
        : '',
      email_type: 'confirmation_mail',
    };
    const endPoint = `${Api.sendMailUrl}`;
    const { data, message } = await AuthApi.postDataToServer(
      endPoint,
      postData
    );
    if (data) {
      swal({
        title: data && data.message[0],
        icon: 'success',
      }).then((okAction) => {
        if (okAction) {
          customFunctions.setLocalStorage('isEmployeeConfirmed', 'true');
          history.push('/employees');
        }
      });
    } else {
      swal({
        title: message,
        icon: 'warning',
      });
    }
  };

  const sendMail = async () => {
    const postData = {
      employee_id: id,
      designation_id: selectedDesignationOption
        ? Number(selectedDesignationOption.id)
        : '',
      confirmation_date: confirmationDate
        ? customFunctions.getDate(confirmationDate)
        : '',
      email_type: 'confirmation_mail',
      subject: 'ConfirmationSubject',
      name: 'ConfirmationLetter',
      body: emailBody,
    };

    const endPoint = `${Api.generateContentUrl}`;
    const { data } = await AuthApi.postDataToServer(endPoint, postData);
    if (data) {
      sendConfirmationLetter(data.data.body);
    }
  };

  const onSubmitButton = (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      sendMail();
    } else {
      validator.showMessages();
    }
  };
  validator.purgeFields();

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Confirmation</h2>
        <Breadcrumb items={items} />
      </div>
      <Card body className="confirmation-content-box">
        <div className="mt-2">
          <p>Employee Name - {name}</p>
          <section className="content-area">
            <Form
              onSubmit={(e) => {
                onSubmitButton(e);
              }}
              autocomplete="off"
            >
              <Row>
                <Col>
                  <Datepicker
                    label="Confirmation Date"
                    asterisk="*"
                    className="form-control"
                    selected={confirmationDate}
                    placeholder="dd/mm/yyyy"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    onChange={(e) => {
                      setConfirmationDate(e);
                    }}
                    errorMessage={validator.message(
                      'Confirm Date',
                      confirmationDate,
                      'required'
                    )}
                  />
                </Col>
                <Col>
                  <DropdownInput
                    label="Position"
                    options={getDesignationList()}
                    placeholder="Select Position"
                    asterisk="*"
                    defaultValue={selectedDesignationOption}
                    onSelectHandler={(select) => {
                      setSelectedDesignationOption(select);
                    }}
                    errorMessage={validator.message(
                      'position',
                      selectedDesignationOption,
                      'required'
                    )}
                  />
                </Col>
              </Row>
              <div className="justify-content-left mt-4 preview-send-btn mb-4">
                <Button type="submit" variant="primary">
                  Save and Send Mail
                </Button>
              </div>
              {emailContent && (
                <Editor
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  editorState={emailContent}
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
              )}
            </Form>
          </section>
        </div>
      </Card>
    </>
  );
}

export default withRouter(Confirmation);
