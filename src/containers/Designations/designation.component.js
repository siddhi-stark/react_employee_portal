import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ModalInput, TextInput, Helmet } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const columns = [
  {
    id: 'no',
    label: 'Sr. No',
  },
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

const items = [
  { to: '/', label: 'Home' },
  { to: '/reports', label: 'Designation' },
];

function Designation() {
  const [rows, setRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [count, forceUpdate] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [designationId, setDesignationId] = useState(null);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [designation, setDesignation] = useState('');
  const [searchErr, setSearchErr] = useState('');
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.designationUrl}?keyword=${keyword}&limit=${pagination.itemsPerPage}&page=${page}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((desgn, i) => {
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: desgn.name,
          action: (
            <>
              <a
                href="/"
                className=""
                onClick={(e) => {
                  setModalShow(true);
                  e.preventDefault();
                  e.stopPropagation();
                  setDesignationId(desgn.id);
                  setDesignation(desgn.name);
                }}
              >
                <Image src="images/edit.png" />
              </a>
              <a
                href="/"
                className="ml-2"
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
      setTitle('Designation');
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
      swal('Designation Updated Successfully', '', 'success').then((result) => {
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
    setSearchErr('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const filterSearch = (e) => {
    e.preventDefault();
    let searchError = '';
    let isValid = true;

    if (keyword === '') {
      searchError = 'Please enter some keyword';
      setSearchErr(searchError);
      isValid = false;
    }
    if (isValid) {
      setSearchErr('');
      getTableData(1);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Designation</h2>
        <Breadcrumb items={items} />
      </div>

      {showDelete && (
        <SweetAlert
          title="Are you sure, do you want to remove the designation ?"
          error
          showCancel
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
          onConfirm={() => {
            removeDesignation(designationId);
          }}
          onCancel={() => {
            setShowDelete(false);
            setShowDelete(null);
          }}
        >
          You will not be able to revert this!
        </SweetAlert>
      )}

      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <div className="custom-header-wrapper">
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
              </div>
              <Form onSubmit={(e) => filterSearch(e)}>
                <Row className="mt-3">
                  <Col md={4}>
                    <div className="search-bar-input">
                      <TextInput
                        inputClass="form-control"
                        value={keyword}
                        placeholder="search.."
                        onInputChange={(e) => {
                          setSearchErr('');
                          setKeyword(e.target.value);
                        }}
                      />
                      <div className="text-danger">{searchErr}</div>

                      <Button variant="primary" type="submit">
                        <Image src="images/search.svg" className="svg" />
                      </Button>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="clear-btn">
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
              {pagination.totalItems > 0 ? (
                <Col className="mt-3">
                  <Table
                    tableClass="table table-striped"
                    columns={columns}
                    rows={rows}
                    showPagination
                    paginationProps={{
                      ...pagination,
                      activePage: pagination.current_page,
                      onPageChange: (pageNo) => {
                        getTableData(pageNo);
                      },
                    }}
                    dropdownContainerClass="mb-3"
                  />
                </Col>
              ) : (
                <Col>
                  <p className="text-center mb-0">No record found</p>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
        <ModalInput
          size="md"
          centered
          show={modalShow}
          label={designationId ? 'Update Designation' : 'Add Designation'}
          id="contained-modal-title-vcenter"
          modalBody={
            <Form>
              <Row>
                <Col sm={6}>
                  <TextInput
                    // onInputChange={(e) => setDesignation(e.target.value)}
                    onInputChange={(e) => {
                      const re = /^[a-zA-Z .]*$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setDesignation(e.target.value);
                      }
                    }}
                    label="Designation Name"
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
            <div className="cancel-update-btn justify-content-between d-flex align-items-center w-100">
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

export default withRouter(Designation);
