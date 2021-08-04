import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function Quotes() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Quotes' }];

  useEffect(() => {
    setTitle('Quotes');
  }, []);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  // const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // const [quotesId, setQuotesId] = useState('');
  const [filterData, setFilterData] = useState({}); // eslint-disable-line

  const limit = 10;


  const handleActionCallback = ({ id }) => {
    return (
      <>
        <a
          href="javascript:void(0)"
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-quotes/${id}`);
          }}
        >
          <Image src="/images/edit-button.svg" alt="Edit Quotes" />
        </a>
        <a
          href="javascript:void(0)"
          className="ml-2"
          onClick={() => {
            //   e.preventDefault();
            //   e.stopPropagation();
            deleteQuotes(id);
          }}
        >
          <Image src="/images/delete.png" alt="Delete Quotes" />
        </a>
      </>
    );
  };
  // Declare columns
  const columns = [
    {
      id: 'index',
      label: 'Sr. No',
    },
    {
      id: 'content',
      label: 'Content',
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
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
    const page = pageNo || currentPage;
    const endPoint = `${Api.quotesUrl}`;
    const params = {
      limit,
      page,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setItemsPerPage(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * itemsPerPage + (i + 1);
        return newItem;
      });
      setRowData((data && data.data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
  }, [filterData]);

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Quotes</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <section className="content-area">
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">Quotes</h4>
               <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-quotes');
                    }}
                    className="btn-link"
                  >
                    Add Quote
                  </a>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
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

export default withRouter(Quotes);
