import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button,Row, Col, Image } from 'react-bootstrap';
import FormSections from './addTechnology.json';
import RecruitmentFilterFormSections from './recruitmentFilterformschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

function RecruitmentFileComponent() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
    
  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);
    
    setFilterData(formValues);
      
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Technology</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary m-0">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Card.Title>
                      <StarkFormBuilder
                        containerClass=''
                        formHeaderClass=''
                        formSections={FormSections}
                        formHeading="Filter Form "
                        onFormSubmit={(formValues) => {submitForm(formValues);}}
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
                          console.log('form reset callback')
                        }}
                      />
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Technology</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mt-3">
                <Col>
                  <StarkFormBuilder
                    containerClass=''
                    formHeaderClass=''
                    formSections={FormSections}
                    onFormSubmit={(formValues) => { submitForm(formValues); }}
                    options={options}
                    callbacks={{}}
                    defaultFormValues={defaultValues}
                    currentUser={currentUser}
                    submitBtnText="Submit"
                    showResetBtn={true} // eslint-disable-line
                    resetBtnText="Clear"
                    btnContainerClass="form-submit-buttons"
                    isStepForm={false}

                    onFormReset={() => {
                      setToggle(false);
                      console.log('form reset callback')
                    }}
                  />
                </Col>
                <Col>
                  <CustomTable
                    columns={columns}
                    rows={rowData}
                    showPagination={true} // eslint-disable-line
                    paginationProps={{
                      totalItems: totalCount,
                      itemsPerPage: limit,
                      activePage: currentPage,
                      onPageChange: (pageNo) => {
                        getRowData(pageNo);
                      }
                    }}
                    emptyRender={() => { return ('No record found.') }}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  )
}

export default withRouter(RecruitmentFileComponent);