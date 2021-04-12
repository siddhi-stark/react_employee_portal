import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ModalInput, TextInput, DropdownInput } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const columns = [
 
  {
    id: 'name',
    label: 'Full Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'mobile',
    label: 'Mobile',
  },
  {
    id: 'action',
    label: 'Action',
  },
];

const validator = new SimpleReactValidator();

function Employee() {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [designationId, setDesignationId] = useState(null);
  const [ShowDelete, setShowDelete] = useState(false);
  const [designation, setDesignation] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.employeeUrl}?page=${page}&limit=${pagination.itemsPerPage}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((emp) => {
        row.push({
          name: emp.full_name,
          email: emp.email,
          mobile: emp.mobile,
          action: (
            <>
              <a
                href="/"
                className="pl-2"
                // onClick={(e) => {
                //   setModalShow(true);
                //   e.preventDefault();
                //   e.stopPropagation();
                //   setDesignationId(desgn.id);
                //   setDesignation(desgn.name);
                // }}
              >
                <Image src="images/edit.svg" />
              </a>
              <a
                href="/"
                className=""
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   setShowDelete(true);
                //   setDesignationId(desgn.id);
                //   // removeDesignation(desgn.id); //eslint-disable-line
                // }}
              >
                <Image src="images/delete.png" />
              </a>
            </>
          ),
        });
        return emp;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    getTableData(1);
  }, []);

  const removeDesignation = async (id) => {
    const { data } = await AuthApi.deleteDataFromServer(
      `${Api.designationUrl}${id}/`
    );
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setShowDelete(false);
          setDesignationId(null);
          getTableData(1);
        }
      });
    } else {
      swal(data && data.message[0], '', 'error');
    }
  };

  const onCancel = () => {
    validator.hideMessages();
    setDesignation();
    setModalShow(false);
  };

  const addDesignation = async () => {
    const postData = {
      name: designation,
      is_deleted: 'false',
    };
    const callback = designationId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = designationId
      ? `${Api.designationUrl}${designationId}/`
      : Api.designationUrl;
    const { data } = await callback(endPoint, postData);

    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setModalShow(false);
          getTableData(1);
        }
      });
    } else {
      swal(data && data.message, '', 'error');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      addDesignation();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  return (
    <>
      {ShowDelete && (
        <SweetAlert
          title="Are you sure, do you want to remove the designation ?"
          error
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            removeDesignation(designationId);
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You wont be able to revert this!
        </SweetAlert>
      )}

      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <Row>
                <Col>
                  <h4>Employee</h4>
                </Col>
                <Col>
                  <div className="float-end">
                    <Button
                      size="sm"
                      variant="primary"
                      type="submit"
                      onClick={() => {
                        setModalShow(true);
                        setDesignationId();
                      }}
                    >
                      Add Employee
                    </Button>
                  </div>
                </Col>
              </Row>

              <Col className="mt-3">
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  showCheckbox
                  paginationProps={{
                    ...pagination,
                    onPageChange: (pageNo) => {
                      getTableData(pageNo);
                    },
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <ModalInput
          size="lg"
          centered
          show={modalShow}
          label="Add Employee"
          id="contained-modal-title-vcenter"
          modalBody={
            <Form>
              <Row>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setDesignation(e.target.value)}
                    label="First Name"
                    containerClass="form-group"
                    type="text"
                    name="designationtitle"
                    value={designation}
                    placeholder="Enter designation"
                    errorMessage={validator.message(
                      'name',
                      designation,
                      'required'
                    )}
                  />
                </Col>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setDesignation(e.target.value)}
                    label="Last Name"
                    containerClass="form-group"
                    type="text"
                    name="designationtitle"
                    value={designation}
                    placeholder="Enter designation"
                    errorMessage={validator.message(
                      'designation',
                      designation,
                      'required'
                    )}
                  />
                </Col>
              </Row>
              <Row>
              <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setDesignation(e.target.value)}
                    label="Email"
                    containerClass="form-group"
                    type="text"
                    name="designationtitle"
                    value={designation}
                    placeholder="Enter designation"
                    errorMessage={validator.message(
                      'designation',
                      designation,
                      'required'
                    )}
                  />
                </Col> 
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setDesignation(e.target.value)}
                    label="Mobile"
                    containerClass="form-group"
                    type="text"
                    name="designationtitle"
                    value={designation}
                    placeholder="Enter designation"
                    errorMessage={validator.message(
                      'designation',
                      designation,
                      'required'
                    )}
                  />
                </Col> 
              </Row>
              <Row>
              <Col sm={6}>
              <DropdownInput
                      label="Designation"
                      asterisk="*"
                      options={getSubjectData()}
                      placeholder='Select Subject'
                      defaultValue={selectOptionSubject}
                      onSelectHandler={(select) =>
                        setSelectOptionSubject(select)
                      }
                      errorMessage={validator.message(
                        'selectOptionSubject',
                        selectOptionSubject,
                        'required'
                      )}
                    />
                </Col>   
              </Row>
            </Form>
          }
          modalFooter={
            <div className="float-end">
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ms-4"
                onClick={(e) => onSubmit(e)}
              >
                Add
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
}

export default withRouter(Employee);
