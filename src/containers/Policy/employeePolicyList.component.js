import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, Image, Button } from 'react-bootstrap';
import { ModalInput } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';

function EmployeePolicyList() {
  const [totalCount, setTotalCount] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [isShowLoader, setShowLoader] = useState(false);
  const initialData = {
    title: '',
    description: '',
    image: '',
    createdBy: '',
  };
  const [policyData, setPolicyData] = useState(initialData);
  const [modalShow, setModalShow] = useState(false);
  const [policy, setPolicy] = useState([]);
  let timmer = null;

  const getPolicyData = async () => {
    setShowLoader(true);
    setPolicy([]);

    const endPoint = `${Api.policyUrl}`;

    const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.getDataFromServer(url);
    if (data) {
      setShowLoader(false);
      setPolicy([...data.data]);

      setTotalCount(Number(data.paginator.total_count));
      setLimit(Number(data.paginator.limit));
      setCurrentPage(Number(data.paginator.current_page));
    }
  };

  useEffect(() => {
    getPolicyData();
  }, []);

  const getBroadcastById = async (id) => {
    const { data } = await AuthApi.getDataFromServer(`${Api.policyUrl}${id}/`);
    if (data && data.data) {
      setPolicyData({
        title: data.data.title,
        description: data.data.description,
        image: data.data.image,
        createdBy: data.data.created_by_name,
      });
    }
  };

  const onCancel = () => {
    setModalShow(false);
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getPolicyData(1);
    }, 1000);
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <div className="row mt-3 row-cols-1 row-cols-md-3 g-4 employee-grid-list">
        {policy &&
          policy.map((pl) => (
            <Col className="mb-4">
              <Card className="h-100 pie-chart-graph">
                <Card.Header className="purple-bg">
                  <strong>{pl.title}</strong>
                </Card.Header>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col className="col-md-4">
                      <span className="mini-stat-icon bg-purple mr-0 float-right">
                        <Image
                          className="card-img-top"
                          // src={pl.image ? `${pl.image}` : `${Api.s3UrlnoProfile}`}
                          src="/images/5.jpg"
                          alt="Card image cap"
                        />
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col className="col-md-12">
                      <p className="text-primary confirmation-date">
                        {pl.description}
                      </p>{' '}
                      <br />
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="card-footer-view d-flex align-items-center justify-content-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setModalShow(true);
                      getBroadcastById(pl.id);
                    }}
                  >
                    View
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
      </div>
      <Pagination
        totalItems={totalCount}
        current_page={currentPage}
        itemsPerPage={limit}
        onPageChange={(pageNo) => {
          getPolicyData(pageNo);
        }}
      />
      {totalCount < 1 && <p className="text-center"> No records found</p>}

      <ModalInput
        size="md"
        centered
        show={modalShow}
        onHide={onCancel}
        label={policyData.title}
        // label={employeeId ? 'Update Employee' : 'Add Employee'}
        id="contained-modal-title-vcenter"
        modalBody={
          <>
            <Row>
              <Col className="col-md-4">
                <Image
                  className="card-img-top"
                  // src={policyData.image ?`${policyData.image}` :`${Api.s3UrlnoProfile}`}
                  src="/images/5.jpg"
                  alt="Card image cap"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="col-md-12">
                <div className="policy-modal-description">
                  <p>{policyData.description}</p>{' '}
                </div>
                <br />
              </Col>
              {/*
              <Col className="col-md-12">
                <p className="text-primary confirmation-date text-end">
                  Created By: <br/> {policyData.createdBy}
                </p>{' '}
              </Col> */}
            </Row>
          </>
        }
      />
    </>
  );
}

export default withRouter(EmployeePolicyList);
