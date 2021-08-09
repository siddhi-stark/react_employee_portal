import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Datepicker, Helmet, DropdownInput } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function Confirmation() {
  const history = useHistory();
  const firstName = '{{Employee:FullName}}';
  const confirmDate = '{{confirmation_date}}';
  const name = customFunctions.getLocalStorage('employeeName');
  const jobTitle = customFunctions.getLocalStorage('title');
  const id = localStorage.getItem('candidateId');
  const [confirmationDate, setConfirmationDate] = useState('');

  const validator = new SimpleReactValidator({ autoForceUpdate: this });
  // const name = localStorage.getItem('employeeName');
  const title = 'Confirmation';

  const items = [{ to: '/', label: 'Home' }, { label: 'Confirmation' }];

  const test =
    `Dear {{Employee:FullName}},,<br />With reference to the thorough evaluation of your performance during the probation {{Employee:confirmation_date}}, we are pleased to inform you that your employment is being confirmed as Job Title from Date of Confirmation. </br> The terms and conditions of your employment and your job responsibilities will continue to remain the same. We thank you for your valuable contribution made to your process and hope that you will perform with equal enthusiasm in future.</br>All the very best in all your endeavors with Stark!!</br>All the very best for a fruitful carrear with Stark !!</br>Regards,`;
  const [description, setDescription] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(test))
    )
  );
  const [key_element, setKeyElement] = useState(EditorState.createEmpty()); //eslint-disable-line

  const [selectedDesignationOption, setSelectedDesignationOption] = useState([]);
  const [designation, setDesignation] = useState([]);

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  };

  const getDesignation = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.designationUrl}?type=all`
    );
    if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
      setDesignation(data.data);
    }
  };

  useEffect(() => {
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

  const sendConfirmationLetter = async (emailbody) => {
    const postData = {
      name: 'Confirmation Letter',
      subject: 'Confirmation Subject',
      employee_id: id,
      body: emailbody,
      designation_id: selectedDesignationOption ? Number(selectedDesignationOption.id):'',
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
    let stringDescription = '';
    convertToRaw(description.getCurrentContent()) &&
      convertToRaw(description.getCurrentContent()).blocks &&
      convertToRaw(description.getCurrentContent()).blocks.map((desc) => {
        //eslint-disable-line
        // const str = desc.text.substring(5,19).replace(name);
        const strNew = desc.text
          .replace('Employee Name', `${name}`)
          .replace('Job Title', `${jobTitle}`);
        // stringDescription+=`${desc.text}\n`;
        stringDescription = strNew;
        return desc;
      });
    // (("Employee Name  gygbu Job Title gdnwfef").replace('Employee Name', 'Gaurav')).replace('Job Title',  'Full Stack')

    const postData = {
      employee_id: id,
      designation_id: selectedDesignationOption ? Number(selectedDesignationOption.id):'',
      confirmation_date: confirmationDate
        ? customFunctions.getDate(confirmationDate)
        : '',
      email_type: 'confirmation_mail',
      subject: 'ConfirmationSubject',
      name: 'ConfirmationLetter',
      body: stringDescription,
    };
    // console.log('postData',postData);

    // const callback =  AuthApi.postDataToServer;
    //  const endPoint = `${Api.generateContentUrl}`;

    //  const { data } = await callback(endPoint, postData);

    const endPoint = `${Api.generateContentUrl}`;
    const { data } = await AuthApi.postDataToServer(endPoint, postData);
    if (data) {
      // swal(data && data.message[0]);

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
                // maxDate={maxdate}
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
              <div className="justify-content-left mt-4 preview-send-btn">
                <Button type="submit" variant="primary">
                  Save and Send Mail
                </Button>
              </div>

              <p className="mt-3">
                <b>
                  Note:-The given list of words are the dynamic content which
                  will replaced by the appropriate words while sending mail.
                  Please use word as per the need as it is, do not make changes
                  into them.
                </b>
                {firstName}, {confirmDate}
              </p>
              <Editor
                // readOnly={viewType}
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
            </Form>
          </section>
        </div>
      </Card>
    </>
  );
}

export default withRouter(Confirmation);
