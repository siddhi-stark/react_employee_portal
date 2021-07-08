import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Datepicker, DropdownInput, Helmet } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function Confirmation() {
  const title = 'Confirmation';

  const items = [{ to: '/', label: 'Home' }, { label: 'Confirmation' }];

  const test =
    'Dear Employee First Name,<br />With reference to the thorough evaluation of your performance during the probation period from Start Date to End Date, we are pleased to inform you that your employment is being confirmed as Job Title from Date of Confirmation. </br> The terms and conditions of your employment and your job responsibilities will continue to remain the same. We thank you for your valuable contribution made to your process and hope that you will perform with equal enthusiasm in future.</br>All the very best in all your endeavors with Stark!!</br>All the very best for a fruitful carrear with Stark !!</br>Regards,';
  const [description, setDescription] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(test))
    )
  );
  const [designation, setDesignation] = useState([]);
  const [selectedDesignationOption, setSelectedDesignationOption] = useState(
    ''
  );
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

  return (
    <>
     <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Confirmation</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="mt-4">
        <p>Employee Name - John</p>
        <section className="content-area">
          <Form>
            <Row>
              <Col md={4}>
                <Datepicker
                  label="Confirmation Date"
                  className="form-control"
                  // selected={joiningDate}
                  placeholder="dd/mm/yyyy"
                  // maxDate={maxdate}
                  dateFormat="dd/MM/yyyy"
                  // maxDate={new Date()}
                  // onChange={(e) => {
                  //   setJoiningDate(e);
                  // }}
                  // errorMessage={validator.message(
                  //   'Joining Date',
                  //   joiningDate,
                  //   'required'
                  // )}
                />

                <DropdownInput
                  label="Designation"
                  options={getDesignationList()}
                  placeholder="Select Designation"
                  defaultValue={selectedDesignationOption}
                  onSelectHandler={(select) => {
                    setSelectedDesignationOption(select);
                  }}
                />

                <div className="justify-content-left mt-4">
                  <Button variant="primary">Save</Button>

                  <Button variant="primary" type="submit" className="ms-4">
                    Preview and Send
                  </Button>
                </div>
              </Col>

              <Col md={6}>
                <p className="mt-3">
                  <b>
                    Note:-The given list of words are the dynamic content which
                    will replaced by the appropriate words while sending mail.
                    Please use word as per the need as it is, do not make
                    changes into them.
                  </b>
                  [first_name], [last_name], [joining_date]
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
                  }}
                />
              </Col>
            </Row>
          </Form>
        </section>
      </div>
    </>
  );
}

export default withRouter(Confirmation);
