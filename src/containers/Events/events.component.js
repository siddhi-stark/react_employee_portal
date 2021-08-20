import CustomTable from 'stark-custom-datatable';
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  Card,
  Image,
} from 'react-bootstrap';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

function Events() {
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const title = 'Events';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Events' }];

  const handleActionCallback = (row) => {
    return (
      <>
        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/edit-event/${row.id}`);
          }}
        >
          <Image src="/images/edit-button.svg" />
        </a>

        <a
          href="/"
          className="pl-2 ms-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             history.push(`/edit-event/${row.id}`, {
isView: true,
});
          }}
        >
          view
        </a>

        <a
          href="/"
          className="pl-2 ms-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeHoliday(row.id);
          }}
        >
          <Image src="/images/delete.png" />
        </a>
      </>
    );
  };

  const columns = [
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'theme',
      label: 'Theme',
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
      `${Api.eventsUrl}`
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

    const removeHoliday = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the event?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.eventsUrl}${id}/`
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
        <h2 className="main-content-title tx-24 mg-b-5">Events</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Events</h4>
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
