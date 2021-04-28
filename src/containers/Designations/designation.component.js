import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ModalInput, TextInput } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const columns = [
  {
    id: 'name',
    label: 'Designation',
  },
  {
    id: 'action',
    label: 'Action',
  },
];

const validator = new SimpleReactValidator();

function Projects() {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [designationId, setDesignationId] = useState(null);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [designation, setDesignation] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.designationUrl}?keyword=${keyword}&limit=${pagination.itemsPerPage}&page=${page}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((desgn) => {
        row.push({
          name: desgn.name,
          action: (
            <>
              <a
                href="/"
                className="pl-2"
                onClick={(e) => {
                  setModalShow(true);
                  e.preventDefault();
                  e.stopPropagation();
                  setDesignationId(desgn.id);
                  setDesignation(desgn.name);
                }}
              >
                <Image src="images/edit.svg" />
              </a>
              <a
                href="/"
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDelete(true);
                  setDesignationId(desgn.id);
                }}
              >
                <Image src="images/delete.png" />
              </a>
            </>
          ),
        });
        return desgn;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    async function getData() {
      getTableData(1);
    }
    getData();
  }, []);

  useEffect(() => {
    getTableData(1);
  }, [cntClearFilter]);

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
    const { data, message } = await callback(endPoint, postData);
    if (data) {
      setModalShow(false);
      setDesignation();
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          getTableData(1);
          setModalShow(false);
        }
      });
    } else {
      swal(message, '', 'error');
      setModalShow(false);
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

  const onClear = () => {
    setKeyword('');
    setCntClearFilter(cntClearFilter + 1);
  };

  return (
    <>
      {showDelete && (
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
                  <div className="pull-left">
                    <h5>Designation</h5>
                  </div>
                </Col>
                <Col>
                  <div className="pull-right">
                    <Button
                      size="sm"
                      variant="primary"
                      type="submit"
                      onClick={() => {
                        setModalShow(true);
                        setDesignationId();
                      }}
                    >
                      Add Designation
                    </Button>
                  </div>
                </Col>
              </Row>
              <Form>
                <Row className="mt-3">
                  <Col md={4}>
                    <div className="search-bar-input">
                      <TextInput
                        inputClass="form-control"
                        value={keyword}
                        placeholder="search.."
                        onInputChange={(e) => {
                          setKeyword(e.target.value);
                        }}
                      />
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => getTableData(1)}
                      >
                        <Image src="images/search.svg" className="svg" />
                      </Button>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="mt-1">
                      <Button
                        size="sm"
                        variant="primary"
                        type="reset"
                        onClick={() => onClear()}
                      >
                        Clear
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>

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
          size="md"
          centered
          show={modalShow}
          label="Add Designation"
          id="contained-modal-title-vcenter"
          modalBody={
            <Form>
              <Row>
                <Col sm={6}>
                  <TextInput
                    onInputChange={(e) => setDesignation(e.target.value)}
                    label="Desination Name"
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
                {designationId ? 'Update' : 'Add'}
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
}

export default withRouter(Projects);
