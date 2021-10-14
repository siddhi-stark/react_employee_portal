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
import Loader from '../../components/Loader/index';

function Events() {

  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const title = 'Events';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Events' }];
  const employeeRole = customFunctions.getLocalStorage('group');
  
  const handleActionCallback = (row) => {
    return (
      <> {Number(employeeRole) === 4 ||
        Number(employeeRole) === 3 ||
        Number(employeeRole) === 2 ? (
          ''
        ) : (
        <>

        <a
          href="/"
          className="pl-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             history.push(`/edit-event/${row.id}`, { isView: 'true' });
          }}
        >
          <Image alt="view" src="/images/eye.svg" />
        </a>
       {(Number(employeeRole) === 4 || Number(employeeRole) === 3 || Number(employeeRole) === 2 ? '' : (
         <>
        <a
          href="/"
          className="pl-2 ms-1"
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
          className="pl-2 ms-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeHoliday(row.id);
          }}
        >
          <Image src="/images/delete.png" />
        </a>
        </>
        ))}
       </>)}
      </>
    );
  };

  const columns = [
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'datetime',
      label: 'Date',
    },
    {
      id:  Number(employeeRole) === 4 ||
        Number(employeeRole) === 3 ||
        Number(employeeRole) === 2 ? '' :'action',
      label:   Number(employeeRole) === 4 ||
        Number(employeeRole) === 3 ||
        Number(employeeRole) === 2 ? '' :'Action',
      render: handleActionCallback,
    },
  ];

  const getRowData = async () => {
    setShowLoader(true);
    const endPoint =
      `${Api.eventsUrl}?type=all`;
    const url = customFunctions.generateUrl(endPoint);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));
      setRowData((data && data.data) || []);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
              closeOnClickOutside: false,
              allowOutsideClick: false,
            });
    }
  };

  useEffect(() => {
    getRowData(1);
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

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
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Events</h5>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[1,5,6]} roleId={userRole}>
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
               <hr/> 
              <CustomTable
                columns={columns}
                rows={rowData}
                role={5}
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
        </div>
      </section>
    </>
  );
}

export default withRouter(Events);
