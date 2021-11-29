import React, { useState, useEffect } from 'react';
import { withRouter, Link, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import swal from 'sweetalert';
import { Card, Image } from 'react-bootstrap';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

function PolicyCategory() {
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Policy Category' }];
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, updateCurrentUser] = useState(0);

  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'id',
      isDisplay: false,
    },
    {
      id: 'index',
      label: 'Sr. No',
    },
    {
      id: 'name',
      label: 'Category Name',
    },
    {
      id: 'action',
      label: '',
      render: ({ id }) => {
        return (
          <>
            <a
              href="/"
              title="Edit Category"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/edit-policy-category/${id}`);
              }}
            >
              <Image src="/images/edit-button.svg" />
            </a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setTitle('Policy Category');
    getUserRole();
  }, []);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.policyCategoryUrl}`;
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
      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.index = (page - 1) * limit + (i + 1);
        return newItem;
      });
      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    getRowData(1);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Link
          className="float-end mb-3 btn btn-primary"
          to={{
            pathname: '/policy',
          }}
        >
          Back
        </Link>
        <h2 className="main-content-title tx-24 mg-b-5">{title}</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Policy Category</h5>
              <div className="d-flex align-items-center justify-content-end">
                {(Number(currentUser) === 1 ||
                  Number(currentUser) === 5 ||
                  Number(currentUser) === 6) && (
                  <>
                    <Link
                      to={{
                        pathname: '/add-policy-category',
                      }}
                      className="btn-link ms-3"
                    >
                      Add Policy Category
                    </Link>
                  </>
                )}
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

export default withRouter(PolicyCategory);
