import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Image,
  Accordion,
} from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { TextInput, Helmet } from '../../components/FormInputs';
import ReactTable from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { to: '/designation', label: 'Designation' },
];

function Designation() {
  let searchFormSubmit = false;
  const validator = useRef(new SimpleReactValidator());
  const [rows, setRows] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [count, forceUpdate] = useState(0);
  const [designationId, setDesignationId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [designation, setDesignation] = useState('');
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });
  const [filterErr, setFilterErr] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [cntClearFilter, setCntClearFilter] = useState(0);
  let timmer = null;
  const columns = [
    {
      id: 'id',
      label: 'Id',
      roleAccess: [1],
      isDisplay: false,
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1],
    },
    {
      id: 'name',
      label: 'Designation',
      roleAccess: [1],
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1],
      render: ({ id, name }) => {
        return (
          <>
            <a
              href="/"
              className=""
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDesignationId(id);
                setDesignation(name);
              }}
            >
              <Image src="/images/edit-button.svg" alt="Edit Designation" />
            </a>
            <a
              href="/"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeDesignation(id);
              }}
            >
              <Image src="images/delete.png" alt="Delete Designation" />
            </a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    async function getData() {
      getTableData(pagination.current_page);
      setTitle('Designation');
      const uRole = customFunctions.getLocalStorage('group');
      setUserRole(Number(uRole));
    }
    getData();
  }, [cntClearFilter]);

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;

    const endPoint = `${Api.designationUrl}?sort_by=name&sort_direction=ascending`;

    const params = {
      limit: pagination.itemsPerPage,
      page,
      keyword: searchFormSubmit ? searchKeyword : '',
    };

    const url = customFunctions.generateUrl(endPoint, params);

    const { data } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
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
          id: desgn.id,
          name: desgn.name,
        });
        return desgn;
      });
      setRows(row);
    }
  };

  const removeDesignation = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure, do you want to remove the designation ?',
        icon: 'warning',
        confirmBtnBsStyle: 'btn btn-primary btn-lg',
        cancelBtnBsStyle: 'btn btn-lg btn-secondary',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.designationUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getTableData(pagination.current_page);
            });
          } else {
            swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  };

  const onCancel = () => {
    validator.current.hideMessages();
    setDesignation('');
    setDesignationId('');
    if (disableButton) return;

    setDisableButton(true);

    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getTableData(1);
      setDisableButton(false);
    }, 1000);
  };

  const addDesignation = async () => {
    const postData = {
      name: designation,
      is_deleted: 'false',
    };

    const payload = customFunctions.cleanObject(postData);

    const callback = designationId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;
    const endPoint = designationId
      ? `${Api.designationUrl}${designationId}/`
      : `${Api.designationUrl}`;

    const { data, message } = await callback(endPoint, payload);

    if (data) {
      validator.current.hideMessages();
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          setDisableButton(false);
          getTableData(pagination.current_page);
          setDesignation('');
          setDesignationId('');
        }
      });
    } else {
      setDisableButton(false);
      swal(message, '', 'error');
      getTableData(1);
      setDesignation('');
      setDesignationId('');
    }
  };

  const onClear = () => {
    searchFormSubmit= false;
    setFilterErr('');
    setSearchKeyword('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      addDesignation();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (customFunctions.checkIfEmpty(searchKeyword)) {
      searchFormSubmit = false;
      filterSearchErr = 'Please enter keyword';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      searchFormSubmit=true;
      setFilterErr('');
      getTableData(1);
    }
  };

  const bulkActions = [
    {
      id: 'delete',
      actionTitle: 'Delete',
      actionCallback: (selectedIndexes) => {
        const endPoint = `${Api.bullkDesignation}`;
        if (!customFunctions.checkIfEmpty(selectedIndexes, 'A')) {
          const params = { designations: selectedIndexes};
          swal({
            title: 'Are you sure?',
            text: 'Are you sure that you want to delete this record?',
            icon: 'warning',
            dangerMode: true,
            buttons: true,
            closeOnClickOutside: false,
            allowOutsideClick: false,
          }).then(async (result) => {
            if (result) {
              const successHandle = (e) => {
                swal(e && e.message[0], '', 'success', {
                  closeOnClickOutside: false,
                  allowOutsideClick: false,
                  buttons: false,
                  timer: 2000,
                }).then(() => {
                  swal.close();
                  getTableData(1);
                });
              };
              const errorHandle = (e) => {
                swal(e, '', 'error', {
                  closeOnClickOutside: false,
                  allowOutsideClick: false,
                });
              };
              await customFunctions.changeStatus(
                endPoint,
                params,
                'POST',
                successHandle,
                errorHandle
              );
            }
          });
        }
      },
    }
  ];

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Designation</h2>
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
                    <Form onSubmit={(e) => filterSearch(e)}>
                      {filterErr && (
                        <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                          <div className="img-text">
                            <img src="images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )}
                      <Row className="mt-3">
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <TextInput
                              inputClass="form-control"
                              value={searchKeyword}
                              placeholder="search designation"
                              onInputChange={(e) => {
                                setFilterErr('');
                                setSearchKeyword(e.target.value);
                              }}
                            />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="filter-btn">
                            <Button
                              variant="primary"
                              type="submit"
                              className="ms-4"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="primary"
                              type="button"
                              className="ms-4"
                              onClick={() => onClear()}
                            >
                              Clear
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Designation</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mt-3">
                <Col>
                  <Form autoComplete="off" onSubmit={(e) => submitForm(e)}>
                    <TextInput
                      onInputChange={(e) => {
                        const re = /^[a-zA-Z .]*$/;
                        if (
                          customFunctions.checkIfEmpty(e.target.value) ||
                          re.test(e.target.value)
                        ) {
                          setDesignation(e.target.value);
                        }
                      }}
                      label="Designation Name"
                      containerClass="form-group"
                      type="text"
                      name="designationtitle"
                      value={designation}
                      placeholder="Enter designation"
                      errorMessage={validator.current.message(
                        'designation',
                        designation,
                        'required'
                      )}
                    />
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onCancel();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="ms-4">
                      {designationId ? 'Update' : 'Add'}
                    </Button>
                  </Form>
                </Col>
                <Col>
                  <ReactTable
                    columns={columns}
                    rows={rows}
                    showPagination="true"
                    showCheckbox
                    paginationProps={{
                      ...pagination,
                      activePage: pagination.current_page,
                      onPageChange: (pageNo) => {
                        getTableData(pageNo);
                      },
                    }}
                    bulkActionsLabel="Apply"
                    bulkActions={Number(userRole) === 1 ? bulkActions : ''}
                    tableClass="table-striped"
                    dropdownContainerClass="mb-3"
                    emptyRender={() => (
                      <p className="text-center mb-0">No record found</p>
                    )}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(Designation);
