import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Accordion, Button, Row, Col, Image } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import FilterFormSections from './FilterTechnology.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import AddTechnology from './AddTechnology.component';

function Technology() {
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  // const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [technologyId, setTechnologyId] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
  const [title, setTitle] = useState('');
  const history = useHistory();
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

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeStackUrl}`;
    const filterList = filterData && !customFunctions.checkIfEmpty(filterData, 'O') ? customFunctions.jsonParse(filterData) : {};
    const params = {
      page,
      limit,
      sort_by: 'name',
      ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      // setLimit(data.paginator.limit);
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
     const isAllowed = customFunctions.getLocalStorage('group');
      if(isAllowed !== 1) {
        history.push('/');
        return; // eslint-disable-line
      }
    getRowData(1);
    setTitle('Technology');
  }, [filterData]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
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
                    <StarkFormBuilder
                      containerClass=""
                      formHeaderClass=""
                      formSections={FilterFormSections}
                      onFormSubmit={(formValues) => {
                        submitFilterForm(formValues);
                      }}
                      options={options}
                      callbacks={{}}
                      defaultFormValues={defaultValues}
                      currentUser={currentUser}
                      submitBtnText="Submit"
                      showResetBtn={true} // eslint-disable-line
                      resetBtnText="Clear"
                      btnContainerClass="form-submit-buttons"
                      isStepForm={false}
                      onFormReset={() => {
                        setFilterData('');
                      }}
                    />
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Technology</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mt-3">
                <Col>
                  <AddTechnology 
                  onChange ={()=>getRowData(1)}
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
