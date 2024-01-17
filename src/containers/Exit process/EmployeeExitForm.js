/* eslint-disable */
import React, { useState, useRef } from 'react';
import { Helmet, DropdownInput, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import swal from 'sweetalert';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Table from '../../components/ReactTable/simpletable.component';
import SimpleReactValidator from 'simple-react-validator';

const EmployeeExitForm = (props) => {
  const [pageTitle, setPageTitle] = useState('Resignation');
  const [isShowLoader, setShowLoader] = useState(false);
  const [resignationReason, setResignationReason] = useState('');
  const items = props.data
    ? null
    : [{ to: '/', label: 'Home' }, { label: 'Resignation' }];
  const validator = useRef(new SimpleReactValidator({}));
  const [count, forceUpdate] = useState(0);

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'eoployeeId',
      label: 'Employee Id',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
      isDisplay: false,
    },
    {
      id: 'resignationStatus',
      label: 'Resignation Status',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'joiningDate',
      label: 'Joining Date',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'resignationReason',
      label: 'Resignation Reason',
      roleAccess: [1, 2, 3, 4, 5, 6, 7],
    },
    ,
  ];

  const onSubmit = () => {
    if (validator.current.allValid()) {
      submitForm();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      // setDisableButton(false);
    }
  };

  return (
    <>
      <Helmet title={pageTitle} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">
            Resignation Application
          </h2>
          <Breadcrumb items={items} />
          <div className="d-flex justify-content-end mb-3">
            <Button>Retain Me</Button>
          </div>
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={5}>
                  <h6>Resignation Intimation</h6>
                  <Row>
                    <Col>
                      <h6>
                        Why you want to Resign from Stark Digital Media Services
                        Pvt Ltd?
                      </h6>
                    </Col>
                  </Row>
                </Col>
                <Col sm={7}>
                  <TextInput
                    placeholder="Reason why you want to resign from stark digital..."
                    type="text"
                    as="textarea"
                    rows="5"
                    value={resignationReason}
                    maxlength={100}
                    onInputChange={(e) => {
                      setResignationReason(e.target.value);
                    }}
                    errorMessage={validator.current.message(
                      'reason',
                      resignationReason,
                      'required'
                    )}
                  />
                  <h6 className="content-title text-count-box float-end">
                    {`${resignationReason?.length}/100`}
                  </h6>
                  <Row>
                    <Col>
                      <Button
                        onClick={() => {
                          onSubmit();
                        }}
                      >
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="secondary">Cancel</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <hr />
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">My Resignation </h5>
              </div>
              <hr />
              <Row>
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
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
};

export default EmployeeExitForm;
