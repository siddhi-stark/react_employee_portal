import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FormSections from './formschema.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function EmailTemplatesComponent() {
  const title = 'Employees List';

  const items = [{ to: '/', label: 'Home' }, { label: 'Email Templates' }];
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);

  // Email
  const test =
    'Dear Employee First Name,<br />With reference to the thorough evaluation of your performance during the probation period from Start Date to End Date, we are pleased to inform you that your employment is being confirmed as Job Title from Date of Confirmation. </br> The terms and conditions of your employment and your job responsibilities will continue to remain the same. We thank you for your valuable contribution made to your process and hope that you will perform with equal enthusiasm in future.</br>All the very best in all your endeavors with Stark!!</br>All the very best for a fruitful carrear with Stark !!</br>Regards,';

  const placeholderOptions = [
    { key: 'firstName', value: '{{firstName}}', text: 'First Name' },
    { key: 'lastName', value: '{{lastName}}', text: 'Last name' },
    { key: 'company', value: '{{company}}', text: 'Company' },
    { key: 'address', value: '{{address}}', text: 'Address' },
    { key: 'zip', value: '{{zip}}', text: 'Zip' },
    { key: 'city', value: '{{city}}', text: 'City' },
  ];
  const getPlaceholder = () => {
    if (!placeholderOptions) return [];
    const op = [];
    placeholderOptions.map((sub) => {
      return op.push({
        label: sub.text,
        id: sub.key,
        value: sub.value,
      });
    });
    return op;
  };

  const [description, setDescription] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(test))
    )
  );

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  };

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues, updateDefaultValues, updateOptions);

    const { data } = await AuthApi.postDataToServer(
      Api.employeeUrl,
      formValues
    );
    if (!data) {
      // show error
    }
    // Perform success actions
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
          callbacks={{}}
          defaultFormValues={defaultValues}
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
              // 'placeholder',
              'history',
            ],
            fontSize: {
              options: [
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                52,
                54,
                56,
                58,
                60,
                62,
                64,
                66,
                68,
                70,
                72,
                74,
                76,
                78,
                80,
                82,
                84,
                86,
                88,
                90,
                92,
                94,
                96,
                98,
                100,
              ],
            },
            list: {
              options: ['unordered', 'ordered'],
            },
            // placeholder: {
            //   inDropdown: true,
            //   options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
            // },
          }}
          toolbarCustomButtons={[
            <DropdownInput
            containerClass="col-md-2"
              options={getPlaceholder()}
              // defaultValue={}
              onSelectHandler={(select) => {
                console.log('select ', select);
              }}
            />,
          ]}
        />
      </Card>
    </>
  );
}

export default withRouter(EmailTemplatesComponent);
