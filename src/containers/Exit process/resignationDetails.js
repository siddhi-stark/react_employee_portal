/* eslint-disable */
import React, { useState, useRef } from 'react';
import { Helmet, DropdownInput, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';
import customFunctions from '../../helper/customFunctions';
import { withRouter, useHistory, useLocation } from 'react-router-dom';

const ResignationDetails = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');

  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation-details' }];

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },

    ,
  ];

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Resignation From Employees
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3"></div>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Row>
            <Col sm={4}>
              <h5>Employee details</h5>
              <Table
                columns={columns}
                // rows={rows}
                showPagination
                // paginationProps={{
                //   ...pagination,
                //   activePage: pagination.current_page,
                //   onPageChange: (pageNo) => {
                //     getReports(pageNo);
                //   },
                // }}
                tableClass="table-striped"
                dropdownContainerClass="mb-3"
                emptyRender={() => (
                  <p className="text-center mb-0">No record found</p>
                )}
              />
            </Col>
            <Col  sm={8}>
              <h5 className="d-flex justify-content-start">
                Resignation Intimation
              </h5>
              <h6 className="d-flex justify-content-start">
                The reason employee name has applied for resignation
              </h6>
              <Alert className="" variant="secondary">
                <Alert.Heading>
                  <h6>Reason</h6>
                </Alert.Heading>
              </Alert>
              <TextInput
                  label="Enter Remarks"
                  placeholder="Type here..."
                    type="text"
                    as="textarea"
                    rows="5"
                    // value={resignationReason}
                    maxlength={100}
              />
              <Row>
                  <Col>
                      <Button>Approve</Button>
                  </Col>
                  <Col>
                      <Button
                      variant='secondary'
                      >Decline</Button>
                  </Col>
              </Row>
            </Col>
          </Row>
          <Row className='mt-3'>
              <TextInput
                  label="Reason for decline"
                  type="text"
                    as="textarea"
                    rows="5"
              />
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ResignationDetails;
