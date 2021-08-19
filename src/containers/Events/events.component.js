import CustomTable from 'stark-custom-datatable';
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  Card,
  Image,
} from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

function Events() {
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const title = 'Event';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Event' }];

  const handleActionCallback = () => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          // onClick={(e) => {
          //   e.preventDefault();
          //   e.stopPropagation();
          //   history.push(`/edit-employee/${row.user_id}`);
          //   customFunctions.setLocalStorage('employeeName', row.emp_name);
          //   customFunctions.setLocalStorage('userId', row.user_id);
          //   customFunctions.setLocalStorage('date', row.date);
          // }}
        >
          <Image src="/images/edit-button.svg" />
        </a>

        <a
          href="/"
          className="pl-2 ms-4"
          // onClick={(e) => {
          //   e.preventDefault();
          //   e.stopPropagation();
          //   history.push(`/edit-employee/${row.user_id}`);
          //   customFunctions.setLocalStorage('employeeName', row.emp_name);
          //   customFunctions.setLocalStorage('userId', row.user_id);
          //   customFunctions.setLocalStorage('date', row.date);
          // }}
        >
          view
        </a>

        <a
          href="/"
          className="pl-2 ms-4"
          // onClick={(e) => {
          //   e.preventDefault();
          //   e.stopPropagation();
          //   history.push(`/edit-employee/${row.user_id}`);
          //   customFunctions.setLocalStorage('employeeName', row.emp_name);
          //   customFunctions.setLocalStorage('userId', row.user_id);
          //   customFunctions.setLocalStorage('date', row.date);
          // }}
        >
          <Image src="/images/delete.png" />
        </a>
      </>
    );
  };

  const columns = [
    {
      id: 'day',
      label: 'Day',
    },
    {
      id: 'date',
      label: 'Date',
    },
    {
      id: 'Action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;
    const endPoint =
      'https://mvwnj2rhk7.execute-api.ap-south-1.amazonaws.com/dev/api/v1/employee/';
    const params = {
      page,
      limit,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data) || []);
    } else {
      console.log('error', message);
    }
  };

  useEffect(() => {
    getRowData(1);
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, [filterData]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Events</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Add Event</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[5]} roleId={userRole}>
                    <a
                      href="#"
                        onClick={() => {
                          history.push('/add-event');
                        }}
                      className="btn-link"
                    >
                      Add Event
                    </a>
                  </UserRestrictions>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                rows={rowData}
                role={5}
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
        </div>
      </section>
    </>
  );
}

export default withRouter(Events);
