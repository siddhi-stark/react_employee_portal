import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Accordion, Button, Row } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';


// Declare columns
const columns = [{
  'id': 'id',
  'label': 'Sr.No',
},
{
  'id': 'full_name',
  'label': 'EmployeeName',
},
{
  'id': 'Technology',
  'label': 'Technology',
},
{
  'id': 'action',
  'label': 'Action',
},
];


function EmployeeTechListing() {


  // Declare variable 
  const [rowData, setRowData] = useState([])
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState({}) // eslint-disable-line


  const title = 'Employees List';

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee Technology Stack' },
  ];


  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeUrl}`;
    const params = {
      page,
      limit,
    }
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData(data && data.data || []);
    } else {
      console.log('error', message)
    }
  }


  useEffect(() => {
    getRowData(1)
  }, [filterData])





  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employee Technology Stack</h2>
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
                    {/* <StarkFormBuilder
                      containerClass=''
                      formHeaderClass=''
                      formSections={FilterFormSections}
                      onFormSubmit={(formValues) => { submitFilterForm(formValues); }}
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
                        console.log('form reset callback')
                      }}
                    /> */}
                  </Card.Title>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Employees</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <a
                    href="#"
                    // onClick={() => {
                    //   setModalShow(true);
                    //   setEmployeeId();
                    //   setAddButton(true);
                    // }}
                    className="btn-link"
                  >
                    Add Employee
                    </a>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <CustomTable
                  columns={columns}
                  rows={rowData}
                  role={1}
                  showPagination={true}
                  paginationProps={{
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    activePage: currentPage,
                    onPageChange: (pageNo) => {
                      getRowData(pageNo);
                    }
                  }}
                  emptyRender={() => { return ('No record found.') }}
                />

              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  )
}
export default withRouter(EmployeeTechListing);