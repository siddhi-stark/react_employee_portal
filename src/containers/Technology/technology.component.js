import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FilterFormSections from './FilterTechnology.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import AddTechnology from './AddTechnology.component';
import Loader from '../../components/Loader/index';

function Technology() {
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [technologyId, setTechnologyId] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isShowLoader, setShowLoader] = useState(false);
  const [currentUser, updateCurrentUser] = useState(0);
  const [title, setTitle] = useState('');
  const limit = 10;
  const items = [{ to: '/', label: 'Home' }, { label: 'Technology' }];

  const handleActionCallback = ({ id }) => {
    return (
      <>
        <a
          href="javascript:void(0)"
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTechnologyId(id);
          }}
        >
          <Image src="/images/edit-button.svg" alt="Edit Technology" />
        </a>
        <a
          href="javascript:void(0)"
          className="ml-2"
          onClick={() => {
            //   e.preventDefault();
            //   e.stopPropagation();
            deleteTechnolody(id);
          }}
        >
          <Image src="/images/delete.png" alt="Delete Technology" />
        </a>
      </>
    );
  };

  const columns = [
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'name',
      label: 'Technology',
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeStackUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
    const params = {
      page,
      limit,
      sort_by: 'name',
      ...filterList,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
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
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Technology');
  }, [filterData]);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const submitFilterForm = async (formValues) => {
    setFilterData(formValues);
  };

  const deleteTechnolody = (id) => {
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
            `${Api.employeeStackUrl}${id}/`
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

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Technology</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              </div>
              <hr />
              <div className="filter-box-main">
                <StarkFormBuilder
                  containerClass=""
                  formHeaderClass=""
                  formSections={FilterFormSections}
                  onFormSubmit={(formValues) => {
                    submitFilterForm(formValues);
                  }}
                  callbacks={{}}
                  currentUser={currentUser}
                  submitBtnText="Apply"
                  showResetBtn={true}
                  resetBtnText="Clear"
                  showBtnClass={false}
                  btnContainerClass="col-md-4 filter-apply-btns"
                  formClass="row"
                  isStepForm={false}
                  onFormReset={() => {
                    setFilterData('');
                  }}
                />
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Technology</h5>
              </div>
              <hr />
              <Row className="mt-3">
                <Col>
                  <AddTechnology
                    onChange={() => getRowData(1)}
                    technologyId={technologyId}
                    afterSubmitTech={() => {
                      setTechnologyId('');
                    }}
                  />
                </Col>
                <Col>
                  <CustomTable
                    columns={columns}
                    rows={rowData}
                    tableClass="table-striped"
                    showPagination={true} // eslint-disable-line
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
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(Technology);
