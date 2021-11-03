import React, { useState, useEffect } from 'react';
import { withRouter, useHistory, Link } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function Broadcast() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Broadcast' }];

  useEffect(() => {
    setTitle('Broadcast');
  }, []);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isShowLoader, setShowLoader] = useState(false);

  const handleActionCallback = ({ id }) => { // eslint-disable-line
    return (
      <span className="d-flex">
        <a
          href="javascript:void(0)"
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-broadcast/${id}`);
          }}
        >
          <Image
            src="/images/edit-button.svg"
            className="delete-edit-view"
            alt="Edit Broadcast"
          />
        </a>
        <a
          href="javascript:void(0)"
          className="ml-2"
          onClick={() => {
            deleteQuotes(id);
          }}
        >
          <Image src="/images/delete.png" className="" alt="Delete Broadcast" />
        </a>
      </span>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay:false
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
        const decString =  strippedString.replace(/\&nbsp;/g, ''); // eslint-disable-line

        return (
          <>
            <span>{
             `${decString}`
            }
            </span>
          </>
        );
      },
    },
    //  {
    //   id: 'action',
    //   label: 'Action',
    //   render: handleActionCallback,
    // },
  ];

  const deleteQuotes = (id) => {
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

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.broadcastUrl}`;
    const params = {
      limit,
      page,
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
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    getRowData(1);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Broadcast</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Broadcast</h5>
              <div className="d-flex align-items-center justify-content-end">
                <Link
                  to={{
                    pathname: '/add-broadcast',
                  }}
                  className="btn-link"
                >
                  Add Broadcast
                </Link>
              </div>
            </div>
            <hr />
            <CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true}
              tableClass="table-striped"
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                },
              }}
              emptyRender={() => {
                return 'No record found.';
              }}
            />
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(Broadcast);
