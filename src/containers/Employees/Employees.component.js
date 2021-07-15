import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tabs, Tab, Card, Button, Image } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';
import Pagination from '../../components/Pagination/pagination.component';

// import CurrentEmployee from './CurrentEmployee.component';
// import NoticePeriod from './NoticePeriod.component';
// import OldEmployee from './OldEmployee.component';

function Employees() {
  const title = 'Employees List';
  const [employee, setEmployee] = useState([]);
  // const[employeeId,setId] = useState(null);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

const history = useHistory();
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee' },
  ];

const getEmployee = async (pageNo) => {
  const page = pageNo || 0;
const endPoint = `${Api.employeeUrl}`;
  const params = {
      limit,
      page,

      // ...filterList
    }
     const url = customFunctions.generateUrl(endPoint, params);
    const { data } = await AuthApi.getDataFromServer(url);
      setEmployee(data.data);
      // setId(data.data.id);
      setTotalCount(data.paginator.total_count);
      // setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      // console.log('data.paginator', data.paginator);
  };


useEffect(() => {
getEmployee(1);
},[])


    console.log('employeeData',employee);
    // console.log('noticePeriod',noticePeriod);
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Employees</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">

        <Card>
          <Card.Body>
            <div>
              <Tabs
                defaultActiveKey="currentEmployee"
              // id="uncontrolled-tab-example"

              >
                <Tab eventKey="currentEmployee" title="Current Employee">
                  <div className="row ml-2">
                    {employee && employee.filter(e => e.on_notice_period === false).map((emp) => (
                      <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
                       <span className="mini-stat-icon bg-purple mr-0 float-right">
            <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
            <span className="np-sup">NP</span>
          </span>
                        <div className="mini-stat-info">
                          <span className="counter text-purple">{emp.full_name}</span>
                          {emp.designation_name} <br/>
                           <br/>
                          <p className="text-primary"> confirmation Date-  {emp.confirmation_date ? customFunctions.getDate(emp.confirmation_date) : null}</p> <br/>
                        </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="text-primary">{emp.emp_code}</h4>
                            <div className="d-flex align-items-center justify-content-end">
                              <Button size="sm" onClick={() => history.push(`/employee-profile/${emp.id}`)}>View</Button>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey='noticePeriod' title='Serving Notice Period'>
                   <div className="row ml-2">
                    {employee && employee.filter(e => e.on_notice_period === true).map((emp) => (
                      <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
                        </span>
                        <div className="mini-stat-info">
                          <span className="counter text-purple">{emp.full_name}</span>
                          {emp.designation_name} <br/>
                           <br/>
                          <p className="text-primary"> confirmation Date- {emp.confirmation_date ? customFunctions.getDate(emp.confirmation_date) : null}</p> <br/>
                        </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="text-primary">{emp.emp_code}</h4>
                            <div className="d-flex align-items-center justify-content-end">
                              <Button size="sm">View</Button>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey='oldEmployee' title='Old Employee'>
                   <div className="row ml-2">
                   {employee && employee.filter(e => e.relieved === true).map((emp) => (
                      <div className="mini-stat clearfix bg-white col-md-2 ml-2 mt-3">
                        <span className="mini-stat-icon bg-purple mr-0 float-right">
                          <Image src="/images/edit-profile-img.png" style={{ 'height': '60px' }} />
                        </span>
                        <div className="mini-stat-info">
                          <span className="counter text-purple">{emp.name}</span>
                          {emp.designation} <br/>
                           <br/>
                          <p className="text-primary"> confirmation Date-{emp.date}</p> <br/>
                        </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="text-primary">{emp.id}</h4>
                            <div className="d-flex align-items-center justify-content-end">
                              <Button size="sm">View</Button>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div>
                      <Pagination
                      totalCount={totalCount}
                      currentPage={currentPage}
                      limit={limit}
                      getData={getEmployee}
                    />
            </div>
          </Card.Body>
        </Card>

      </section>
    </>
  );
}

export default withRouter(Employees);