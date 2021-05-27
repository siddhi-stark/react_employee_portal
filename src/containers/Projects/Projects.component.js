import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Image,
  ProgressBar,
  Button,
  Form,
  Accordion,
} from 'react-bootstrap';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { TextInput, Helmet } from '../../components/FormInputs';
import Table from '../../components/ReactTable/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import constants from '../../helper/constants';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
];

function Projects() {
  let disableButton = false;
  const [rows, setRows] = useState([]);
  // const [disableButton, setDisableButton] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [rtSupport, setRtSupport] = useState('');
  const [title, setTitle] = useState('');
  const [filterErr, setFilterErr] = useState('');
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const columns = [
    {
      id: 'twID',
      label: 'tw ID',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'name',
      label: 'Project Name',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'spend',
      label: 'Spend',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'allocated',
      label: 'Allocated',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'remaining',
      label: 'Remaining/Extra',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'completed',
      label: 'Completed',
      roleAccess: [1, 2, 3, 4],
    },
    {
      id: 'complt',
      label: 'completionData',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    // {
    //   id: 'completion',
    //   label: 'Completion',
    //   roleAccess: [1, 2, 3, 4],
    //   render: ({ complt }) => {
    //     return (
    //       <>
    //         <ProgressBar
    //           bsPrefix="progress pbar"
    //           // { (complt < 50 || complt === 50)  && 'danger'}
    //           // {(complt < 80 || complt === 80) && 'info'}
    //           variant= { (complt < 50 || complt === 50) && 'danger'}
    //           // variant= { (complt <= 50) ? 'danger' : (complt <= 80) ? 'info' : 'success' }
    //           now={complt}
    //           label={`${complt}% completed`}
    //         />
    //       </>
    //     );
    //   },
    // },

    {
      id: 'completion',
      label: 'Completion',
      roleAccess: [1, 2, 3, 4],
      render: ({ complt }) => {
        return (
          <>
            {complt <= 50 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="danger"
                now={complt}
                label={`${complt}% completed`}
              />
            )}
            {complt > 50 && complt <= 80 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="info"
                now={complt}
                label={`${complt}% completed`}
              />
            )}
            {complt > 80 && (
              <ProgressBar
                bsPrefix="progress pbar"
                variant="success"
                now={complt}
                label={`${complt}% completed`}
              />
            )}
          </>
        );
      },
    },
    {
      id: 'support',
      label: 'support',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    {
      id: 'ID',
      label: 'ID',
      roleAccess: [1, 2, 3, 4],
      isDisplay: false,
    },
    {
      id: 'support',
      label: 'RT Support',
      roleAccess: [1, 2, 3, 4],
      render: ({ support, ID }) => {
        return (
          <>
            <Image
              className="rt-support-link"
              src={support ? '/images/success.svg' : '/images/fail.svg'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setProjectId(ID);
                setRtSupport(support);
                setShowUpdate(true);
              }}
            />
          </>
        );
      },
    },

    {
      id: 'link',
      label: 'TW Link',
      roleAccess: [1, 2, 3, 4],
      render: ({ twID }) => {
        return (
          <>
            <a href={`${constants.project}${twID}`} target="_blank" >
              <span>
                <Image src="/images/redirect.png" />
              </span>
            </a>
          </>
        );
      },
    },
  ];

  const onRtSupport = async (id, Support) => {
    const payload = {
      rt_support: Number(!Support),
    };
    const endPoint = `${Api.getProjects}${id}/`;
    const { data } = await AuthApi.putDataToServer(endPoint, payload);

    if (data) {
      disableButton = false;
      swal(data.message && data.message[0], '', 'success');
      setShowUpdate(false);
      setProjectId(null);
      setRtSupport('');
      getTableData(1); // eslint-disable-line
    }else{
      disableButton = false;
    }
  };

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const id = customFunctions.getLocalStorage('userId');
    const api = `${Api.getProjects}?sort_by=name&sort_direction=ascending`;

    const params = {
      limit: pagination.itemsPerPage,
      page,
      keyword: searchKeyword,
      employee: customFunctions.userRestrictions(id, [2, 3, 4]),
    };

    const url = customFunctions.generateUrl(api, params);
    const { data } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O')) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((proj, i) => {
        const setRowData = {
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: proj.name,
          spend: `${proj.spend} Hrs`,
          allocated: `${proj.allocated} Hrs`,
          completed: proj.completed,
          remaining:
            Math.sign(proj.remaining) === 1 ||
            Math.sign(proj.remaining) === 0 ? (
              <span className="text-success">
                {proj.remaining}{' '}
                {Math.sign(proj.remaining) === 0 ? 'Hr' : 'Hrs'}
              </span>
            ) : (
              <span className="text-danger">{proj.remaining} Hrs</span>
            ),
          ID: proj.id,
          support: proj.rt_support,
          twID: proj.tw_id,
          complt: proj.completion,
        };
        row.push(setRowData);

        return proj;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    setTitle('Projects');
  }, []);

  useEffect(() => {
    getTableData(1);
  }, [cntClearFilter]);

  const onClear = () => {
    setFilterErr('');
    setSearchKeyword('');
    setCntClearFilter(cntClearFilter + 1);
  };
  const filterSearch = (e) => {
    e.preventDefault();
    let filterSearchErr = '';
    let isValid = true;

    if (customFunctions.checkIfEmpty(searchKeyword)) {
      filterSearchErr = 'Please enter search keyword';
      setFilterErr(filterSearchErr);
      isValid = false;
    }
    if (isValid) {
      setFilterErr('');
      getTableData(1);
    }
  };

  return (
    <>
      <Helmet title={title} />
      {showUpdate && (
        <SweetAlert
          title="Are you sure you want to change RT support?"
          error
          showCancel
          confirmBtnBsStyle="btn btn-primary btn-lg"
          cancelBtnBsStyle="btn btn-lg btn-secondary"
          onConfirm={() => {
            if(disableButton) return;
            disableButton = true;
            onRtSupport(projectId, rtSupport);
            // disableButton = false;
            
          }}
          onCancel={() => {
            setShowUpdate(false);
            
          }}
        />
      )}
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Projects</h2>
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
                              value={searchKeyword}
                              placeholder="Search keyword"
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
                <h4 className="text-primary mt-2 mb-2">Projects</h4>
              </div>
          </Card.Header>
          <Card.Body>
            <Row>
            <Table
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
}

export default withRouter(Projects);
