import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Row, Col, Card, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function EmployeePolicyList() {
  const [totalCount, setTotalCount] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [isShowLoader, setShowLoader] = useState(false);
  const initialData = {
    title: '',
    description: '',
    image: '',
  };
  const [policyData, setPolicyData] = useState(initialData);
  const [policyModal, setPolicyModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  let timmer = null;

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false,
    },
    {
      id: 'title',
      label: 'Title',
      render: ({ id, title }) => {
        return (
          <>
            <a
              href="#"
              onClick={() => {
                getPolicyById(id);
                setPolicyModal(true);
              }}
            >
              {title}
            </a>
          </>
        );
      },
    },
    {
      id: 'created_at',
      label: 'Date',
      render: ({ created_at }) => {
        return (
          <span>{created_at && customFunctions.getDMYDate(created_at)}</span>
        );
      },
    },
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.policyUrl}`;
    const params = {
      page,
      limit,
      sort_direction: 'descending',
      is_publish: 'True',
    };

    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };
  
  const getPolicyById = async (id) => {
    const { data } = await AuthApi.getDataFromServer(`${Api.policyUrl}${id}/`);
    if (data && data.data) {
      const originalString = `${data.data.description}`;
      const strippedString = originalString.replace(/<\/?[^>]+(>|$)/g, ''); // eslint-disable-line
      const decString = strippedString.replace(/\&nbsp;/g, ''); // eslint-disable-line

      setPolicyData({
        title: data.data.title,
        description: decString,
        image: data.data.image,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
  }, []);

  const onCancel = () => {
    setPolicyModal(false);

    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getRowData(1);
    }, 1000);
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Policy</h5>
          </div>
          <hr />
          <CustomTable
            columns={columns}
            rows={rowData}
            showPagination={true}
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: currentPage,
              onPageChange: (pageNo) => {
                getRowData(pageNo);
              },
            }}
            tableClass="table-striped"
            emptyRender={() => {
              return 'No record found.';
            }}
          />
        </Card.Body>
        {policyModal && (
            <ModalInput
              size="md"
              centered
              show={policyModal}
              onHide={onCancel}
              label={policyData.title}
              // label={employeeId ? 'Update Employee' : 'Add Employee'}
              id="contained-modal-title-vcenter"
              modalBody={
                <>
                  {policyData.image && (
                    <Row>
                      <Col className="col-md-4">
                        <Image
                          className="card-img-top"
                          src={
                            policyData.image
                              ? `${policyData.image}`
                              : `${Api.s3UrlnoProfile}`
                          }
                          alt="Policy Image"
                        />
                      </Col>
                    </Row>
                  )}
                  <Row className="mt-3">
                    <Col className="col-md-12">
                      <div className="policy-modal-description">
                        <p>{policyData.description}</p>{' '}
                      </div>
                      <br />
                    </Col>
                  </Row>
                </>
              }
            />
          )}

      </Card>
    </>
  );
}

export default withRouter(EmployeePolicyList);
