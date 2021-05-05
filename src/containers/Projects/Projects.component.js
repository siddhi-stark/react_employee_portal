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
} from 'react-bootstrap';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { TextInput, Helmet } from '../../components/FormInputs';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import constants from '../../helper/constants';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const columns = [
  {
    id: 'no',
    label: 'Sr. No',
  },
  {
    id: 'name',
    label: 'Project Name',
  },
  {
    id: 'spend',
    label: 'Spend',
  },
  {
    id: 'allocated',
    label: 'Allocated',
  },
  {
    id: 'remaining',
    label: 'Remaining/Extra',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
  {
    id: 'completion',
    label: 'Completion',
  },
  {
    id: 'support',
    label: 'RT Support',
  },
  {
    id: 'link',
    label: 'TW Link',
  },
];

const items = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
];

function Projects() {
  const [rows, setRows] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [rtSupport, setRtSupport] = useState('');
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 10,
    totalItems: 10,
  });

  const onRtSupport = async (id, Support) => {
    const payload = {
      rt_support: Number(!Support),
    };
    const endPoint = `${Api.getProjects}${id}/`;
    const { data } = await AuthApi.putDataToServer(endPoint, payload);

    if (data) {
      swal(data.message && data.message[0], '', 'success');
      setShowUpdate(false);
      setProjectId(null);
      setRtSupport('');
      getTableData(1); // eslint-disable-line
    }
  };

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.getProjects}?keyword=${keyword}&limit=${pagination.itemsPerPage}&page=${page}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        current_page: Number(data.paginator.current_page),
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((proj, i) => {
        row.push({
          no: (page - 1) * pagination.itemsPerPage + (i + 1),
          name: proj.name,
          spend: `${proj.spend} Hrs`,
          allocated: `${proj.allocated} Hrs`,
          completed: proj.completed,
          remaining:
            Math.sign(proj.remaining) === 1 ? (
              `${proj.remaining} Hrs`
            ) : (
              <span className="text-danger">{proj.remaining} Hrs</span>
            ),
          support:
            proj.rt_support === true ? (
              <Image
                src="/images/success.svg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProjectId(proj.id);
                  setRtSupport(proj.rt_support);
                  setShowUpdate(true);
                  // onRtSupport(proj.id, proj.rt_support);
                }}
              />
            ) : (
              <Image
                src="/images/fail.svg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProjectId(proj.id);
                  setRtSupport(proj.rt_support);
                  setShowUpdate(true);
                  // onRtSupport(proj.id, proj.rt_support);
                }}
              />
            ),
          completion: (
            <ProgressBar
              variant="success"
              now={proj.completion}
              label={`${proj.completion}% completed`}
            />
          ),
          link: (
            <a href={`${constants.project}${proj.tw_id}`} target="_blank">
              <span>
                <Image src="/images/redirect.png" />
              </span>
              {/* {proj.tw_id} */}
            </a>
          ),
        });
        return proj;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    getTableData(1);
    setTitle('Projects');
  }, []);

  useEffect(() => {
    getTableData(1);
  }, [cntClearFilter]);

  const onClear = () => {
    setKeyword('');
    setCntClearFilter(cntClearFilter + 1);
  };

  const filterSearch = (e) => {
    e.preventDefault();
    getTableData(1);
  };

  return (
    <>
      <Helmet title={title} />
      {showUpdate && (
        <SweetAlert
          title="Are you sure, do you want to update the project ?"
          error
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            onRtSupport(projectId, rtSupport);
          }}
          onCancel={() => {
            setShowUpdate(false);
            setShowUpdate(null);
          }}
        >
          You wont be able to revert this!
        </SweetAlert>
      )}
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Projects</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-3">
          <Card>
            <Card.Body>
              <Row>
                <Row>
                  <Col>
                    <div className="pull-left">
                      <h5>Projects</h5>
                    </div>
                  </Col>
                </Row>
                <Form onSubmit={(e) => filterSearch(e)}>
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
                          type="submit"
                          // onClick={() => getTableData(1)}
                        >
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
        </div>
      </section>
    </>
  );
}

export default withRouter(Projects);
