import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function EmployeePolicyList() {
  const handleActionCallback = ({ id }) => {
    return (
      <span className="d-flex">
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
        {/* <Link
          className="ml-2"
          onClick={() => {
            deletePolicy(id);
          }}
        >
          <Image src="/images/delete.png" className="" alt="Delete Policy" />
        </Link> */}
      </span>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr. No',
    },
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'description',
      label: 'Description',
      render: ({ description }) => {
        const originalString = `${description}`;
        const strippedString = originalString.replace(/<\/?[^>]+(>|$)/g, ""); // eslint-disable-line
        return (
          <>
            <span>{
             `${strippedString}`
            }
            </span>
          </>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      render: ({status}) => {
        return (
          <>
            <img
              src={
                Number(status) === 1
                  ? '/images/success.svg'
                  : './images/fail.svg'
              }
              alt="status"
              title={
                Number(status) === 1 ? 'Active' : 'Inactive'
              }
            />
          </>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoader, setShowLoader] = useState(false);

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.policyUrl}`;
    const params = {
      page,
      limit,
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

  const deletePolicy = (id) => { // eslint-disable-line
    if (id) {
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

  useEffect(() => {
    getRowData(1);
  }, []);

  const handleChangeActiveStatus = async (selectedIds) => {
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

  const handleChangeInactiveStatus = async (selectedIds) => {
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

  return (
    <>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0 mt-2 ">Policy</h5>
            <div className="d-flex align-items-center justify-content-end">
              <Link
                to={{
                  pathname: '/add-policy',
                }}
                className="btn-link"
              >
                Add Policy
              </Link>
            </div>
          </div>
          <hr />

          <CustomTable
            columns={columns}
            rows={rowData}
            bulkActionsLabel="Apply"
            bulkActions={[
              {
                actionTitle: 'Active',
                actionCallback: handleChangeActiveStatus,
              },
              {
                actionTitle: 'Inactive',
                actionCallback: handleChangeInactiveStatus,
              },
            ]}
            showPagination={true}
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: currentPage,
              onPageChange: (pageNo) => {
                getRowData(pageNo);
              },
            }}
            showCheckbox={true}
            tableClass="table-striped"
            emptyRender={() => {
              return 'No record found.';
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
}

export default withRouter(EmployeePolicyList);
