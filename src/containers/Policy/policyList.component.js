import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Image, Row, Col } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import { ModalInput } from '../../components/FormInputs';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import ApprovalStatus from './appovalStatus.component';

function PolicyList() {

  const initialData ={
    title: '',
    description: '',
    image: '',
    createdBy: '',
  };
  const [policyData, setPolicyData] = useState(initialData);
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [userRole, setUserRole] = useState('');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoader, setShowLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [policyModal, setPolicyModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalId, setApprovalId] = useState('');
  let timmer = null;

  const handleActionCallback = ({ id }) => {
    return (
      <span className="d-flex">
        {(Number(userRole) === 1 ||
          Number(userRole) === 5 ||
          Number(userRole) === 6) && (
          <Link
            to={{
              pathname: `/edit-policy/${id}`,
            }}
            className="btn-link"
          >
            <Image
              src="/images/edit-button.svg"
              className="delete-edit-view"
              alt="Edit Policy"
            />
          </Link>
        )}
        {Number(userRole) === 1 && (
          <Link
            className="ml-2"
            onClick={() => {
              deletePolicy(id);
            }}
          >
            <Image src="/images/delete.png" className="" alt="Delete Policy" />
          </Link>
        )}
      </span>
    );
  };

  const handleApprovalAction = ({ id,is_admin_approved}) => {
    return (
      <span className="d-flex">
        {(Number(userRole) === 1) ? (
          <Link
            onClick={() => {
              setApprovalStatus(is_admin_approved);
              setApprovalId(id);
              setModalShow(true);
            }}
          >
            {is_admin_approved === true ? 'Approve' : 'Pending'}
          </Link>
        ) : (
          <span>{is_admin_approved === true ? 'Approve' : 'Pending'}</span>
        )}
      </span>
    );
  };

  const handlePublishAction = ({ id, is_publish, is_admin_approved }) => {
    return (
      <span className="d-flex">
        {((Number(userRole) === 1 ||
                Number(userRole) === 5 ||
                Number(userRole) === 6) && is_admin_approved === true) ? (
          <Link
            onClick={() => {
              changePublishStatus(id, is_publish);
            }}
          >
            {is_publish === true ? 'Publish':'Draft'}
          </Link>
        ) : (
          <span>{is_publish === true ? 'Publish':'Draft'}</span>
        )}
      </span>
    );
  };

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
          {(Number(userRole) !== 1 && Number(userRole) !== 5 && Number(userRole) !== 6) ?(
            <Link
            onClick={() => {
              getPolicyById(id);
              setPolicyModal(true);
            }}
          >
            {title}
          </Link>
          ) : <span>{title}</span> }
          </>
        );
      },
    },
    // {
    //   id: 'description',
    //   label: 'Description',
    //   render: ({ description }) => {
    //     const originalString = `${description}`;
    //     const strippedString = originalString.replace(/<\/?[^>]+(>|$)/g, ""); // eslint-disable-line
    //     return (
    //       <>
    //         <span>{
    //          `${strippedString}`
    //         }
    //         </span>
    //       </>
    //     );
    //   },
    // },
    {
      id: (Number(userRole) === 4 || Number(userRole) === 3) ? '' : 'created_by_name',
      label: (Number(userRole) === 4 || Number(userRole) === 3) ? '' : 'Added By',
    },
    {
      id: (Number(userRole) === 4 || Number(userRole) === 3) ? '' : 'is_admin_approved;',
      label: 'Approval Status',
      render: handleApprovalAction,
    },
    {
      id: (Number(userRole) === 4 || Number(userRole) === 3 ) ? '' : 'is_publish',
      label: 'Publish Status',
      render: handlePublishAction,
    },
    {
      id: 'created_at',
      label: 'Date',
      render: ({ created_at }) => {
        return (
          <span>
           {created_at && customFunctions.getDMYDate(created_at)}
          </span>
        );
      },
    },
    // {
    //   id: 'status',
    //   label: 'Status',
    //   render: ({ status }) => {
    //     return (
    //       <>
    //         <img
    //           src={
    //             Number(status) === 1
    //               ? '/images/success.svg'
    //               : './images/fail.svg'
    //           }
    //           alt="status"
    //           title={Number(status) === 1 ? 'Active' : 'Inactive'}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      id: 'action',
      label: '',
      render: handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.policyUrl}`;
    const params = {
      page,
      limit,
      sort_direction:'descending'
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

  const deletePolicy = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this policy?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.quotesUrl}${id}/`
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getRowData(1);
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

  // status methods
  const changePublishStatus = (policyId) => {
    if (policyId) {
      swal({
        title: 'Are you sure?',
        text: `You want to publish this policy?`,
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
        const params = {
          status: 6,
          ids: [policyId],
        };
          const { data, message } = await AuthApi.putDataToServer(
            `${Api.policyStatusUrl}`,params
          );
          if (data) {
            swal(data && data.message[0], '', 'success', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
              buttons: false,
              timer: 2000,
            }).then(() => {
              swal.close();
              getRowData(1);
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

  const getPolicyById = async (id) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.policyUrl}${id}/`
    );
    if (data && data.data) {
      const originalString = `${data.data.description}`;
      const strippedString = originalString.replace(/<\/?[^>]+(>|$)/g, ""); // eslint-disable-line
      setPolicyData({
        title: data.data.title,
        description: strippedString,
        image: data.data.image,
        createdBy: data.data.created_by_name,
      });
    }
  };

  const onCancel = () => {
    setPolicyModal(false);
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      getRowData(1);
    }, 1000);
  };

  useEffect(() => {
    const id = customFunctions.getLocalStorage('group');
    setUserRole(id);
    getRowData(1);
  }, []);

  const handleChangeActiveStatus = async (selectedIds) => { // eslint-disable-line
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 1,
        ids: selectedIds,
      };
      const endpoint = `${Api.policyStatusUrl}`;
      const successHandle = (e) => {
        swal(e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(currentPage);
        });
      };

      const errorHandle = (e) => swal(e, '', 'error');

      await customFunctions.changeStatus(
        endpoint,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  const handleChangeInactiveStatus = async (selectedIds) => { // eslint-disable-line
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 2,
        ids: selectedIds,
      };
      const endpoint = `${Api.policyStatusUrl}`;
      const successHandle = (e) => {
        swal(e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(currentPage);
        });
      };

      const errorHandle = (e) => swal(e, '', 'error');

      await customFunctions.changeStatus(
        endpoint,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  const handleChangeDeleteStatus = async (selectedIds) => {
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 3,
        ids: selectedIds,
      };
      const endpoint = `${Api.policyStatusUrl}`;
      const successHandle = (e) => {
        swal(e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(currentPage);
        });
      };

      const errorHandle = (e) => swal(e, '', 'error');

      await customFunctions.changeStatus(
        endpoint,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  const handleChangeDisapproveStatus = async (selectedIds) => {
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 5,
        ids: selectedIds,
      };
      const endpoint = `${Api.policyStatusUrl}`;
      const successHandle = (e) => {
        swal(e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(currentPage);
        });
      };

      const errorHandle = (e) => swal(e, '', 'error');

      await customFunctions.changeStatus(
        endpoint,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  const handleChangeApproveStatus = async (selectedIds) => {
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 4,
        ids: selectedIds,
      };
      const endpoint = `${Api.policyStatusUrl}`;
      const successHandle = (e) => {
        swal(e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(currentPage);
        });
      };

      const errorHandle = (e) => swal(e, '', 'error');

      await customFunctions.changeStatus(
        endpoint,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  const handleChangePublishStatus = async (selectedIds) => {
    if (!customFunctions.checkIfEmpty(selectedIds, 'A')) {
      const params = {
        status: 6,
        ids: selectedIds,
      };
      const endpoint = `${Api.policyStatusUrl}`;
      const successHandle = (e) => {
        swal(e.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          getRowData(currentPage);
        });
      };

      const errorHandle = (e) => swal(e, '', 'error');

      await customFunctions.changeStatus(
        endpoint,
        params,
        'put',
        successHandle,
        errorHandle
      );
    }
  };

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Policy</h5>
            <div className="d-flex align-items-center justify-content-end">
              {(Number(userRole) === 1 || Number(userRole) === 5 || Number(userRole) === 6) && (
                <Link
                  to={{
                    pathname: '/add-policy',
                  }}
                  className="btn-link"
                >
                  Add Policy
                </Link>
              )}
            </div>
          </div>
          <hr />

          <CustomTable
            columns={columns}
            rows={rowData}
            bulkActionsLabel="Apply"
            bulkActions={
              [5, 6].includes(Number(userRole))
                ? [
                    {
                      actionTitle: 'Publish',
                      actionCallback: handleChangePublishStatus,
                    },
                  ]
                : [1].includes(Number(userRole)) && [
                    {
                      actionTitle: 'Approve',
                      actionCallback: handleChangeApproveStatus,
                    },
                    {
                      actionTitle: 'Disapprove',
                      actionCallback: handleChangeDisapproveStatus,
                    },
                    {
                      actionTitle: 'Publish',
                      actionCallback: handleChangePublishStatus,
                    },
                    {
                      actionTitle: 'Delete',
                      actionCallback: handleChangeDeleteStatus,
                    },
                  ]
            }
            showPagination={true}
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: currentPage,
              onPageChange: (pageNo) => {
                getRowData(pageNo);
              },
            }}
            showCheckbox={[1,3,2].includes(Number(userRole)) ? false : true} // eslint-disable-line
            tableClass="table-striped"
            emptyRender={() => {
              return 'No record found.';
            }}
          />

           {modalShow && (
              <ApprovalStatus
                show={modalShow}
                approvalStatus={approvalStatus}
                approvalId={approvalId}
                handleModalCLose={(e) => setModalShow(e)}
                onStatusUpdate={() => {
                  getRowData(1);
                }}
              />
            )}
           {
             policyModal && (

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
                  src={policyData.image ?`${policyData.image}` :`${Api.s3UrlnoProfile}`}
                  alt="Policy Image"
                />
              </Col>
            </Row>
            )}
            <Row className="mt-3">
              <Col className="col-md-12">
                <div className="policy-modal-description">
                  <p >
                  {policyData.description}</p>{' '}
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
              )
           }
        </Card.Body>
      </Card>
    </>
  );
}

export default withRouter(PolicyList);
