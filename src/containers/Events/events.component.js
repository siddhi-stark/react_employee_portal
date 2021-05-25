import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Accordion, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { Helmet, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import Table from '../../components/ReactTable/simpletable.component';

function Events() {
    const [title, setTitle] = useState('');
    const [filterErr, setFilterErr] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [cntClearFilter, setCntClearFilter] = useState(0);
    const [userRole, setUserRole] = useState('');
    const items = [
        { to: '/', label: 'Home' },
        { to: '/events', label: 'Events' },
      ];

    const columns = [
          {
              id: 'no',
              label: 'Sr. No',
              roleAccess: [1],
              
          },
          {
              id: 'date',
              label: 'Date',
              roleAccess: [1],
          },
          {
            id: 'event',
            label: 'Event Name',
            roleAccess: [1],
          },
          {
              id: 'time',
              label: 'Time',
              roleAccess: [1],
          },

    ]  

    useEffect(() => {
        setTitle('Events');
        const role = customFunctions.getLocalStorage('group');
        setUserRole(role);

    });


    const filterSearch = (e) => {
        e.preventDefault();
        let filterSearchErr = '';
        let isValid = true;
    
        if (customFunctions.checkIfEmpty(searchKeyword)) {
          filterSearchErr = 'Please enter search keyword';
          setFilterErr(filterSearchErr);
          isValid = false;
        }
        if (isValid) {
          setFilterErr('');
        //   getTableData(1);
        }
      };

      const onClear = () => {
        setFilterErr('');
        setSearchKeyword('');
        setCntClearFilter(cntClearFilter + 1);
      };  

    return (
        <>
           <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Events</h2>
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
      <Form onSubmit={(e) => filterSearch(e)}>
      {filterErr && (
                        <div className="p-3  bg-danger text-white bg-danger-main table-red-bg">
                          <div className="img-text">
                            <img src="images/fail.svg" alt="Success" />{' '}
                            {filterErr}
                          </div>
                        </div>
                      )}
                      <Row className="mt-3">
                        <Col sm={3}>
                          <div className="search-bar-input">
                            <TextInput
                              value={searchKeyword}
                              placeholder="Search keyword"
                              onInputChange={(e) => {
                                setFilterErr('');
                                setSearchKeyword(e.target.value);
                              }}
                            />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="filter-btn">
                            <Button
                              variant="primary"
                              type="submit"
                              className="ms-4"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="primary"
                              type="button"
                              className="ms-4"
                              onClick={() => onClear()}
                            >
                              Clear
                            </Button>
                          </div>
                        </Col>
                      </Row>
      </Form>
      </Card.Title>
      </Card.Body>
      </Accordion.Collapse>
      </Card>
      </Accordion>
      <Card>
      <Card.Header>
      <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Add Event</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[1]} roleId={userRole}>
                    <a
                      href="#"
                    //   onClick={() => {
                    //     setModalShow(true);
                    //     setEmployeeId();
                    //   }}
                      className="btn-link"
                    >
                      Add Event
                    </a>
                  </UserRestrictions>
                </div>
              </div>
      </Card.Header>
      <Card.Body>
      <Row>
                <Table
                  columns={columns}
                //   rows={rows}
                //   showPagination="true"
                //   paginationProps={{
                //     ...pagination,
                //     activePage: pagination.current_page,
                //     onPageChange: (pageNo) => {
                //       getTableData(pageNo);
                //     },
                //   }}
                  tableClass="table-striped"
                  dropdownContainerClass="mb-3"
                  emptyRender={() => (
                    <p className="text-center mb-0">No record found</p>
                  )}
                />
              </Row>
      </Card.Body>
      </Card>
      </div>
      </section>
        </>
    )
}

export default withRouter(Events);