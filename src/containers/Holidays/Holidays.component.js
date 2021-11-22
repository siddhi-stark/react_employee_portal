import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Image, Card } from 'react-bootstrap';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';
import Loader from '../../components/Loader/index';

function Holidays() {
  const employeeRole = customFunctions.getLocalStorage('group');

  const handleActionCallback = (row) => {
    return (
      <>
        {Number(employeeRole) === 4 ||
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
                history.push(`/edit-holiday/${row.id}`);
              }}
            >
              <Image src="/images/edit-button.svg" />
            </a>

            <a
              href="/"
              className="pl-2 ms-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeHoliday(row.id);
              }}
            >
              <Image src="/images/delete.png" />
            </a>
          </>
        )}
      </>
    );
  };

  const columns = [
    {
      id: 'occasion',
      label: 'Occasion',
    },
    {
      id: 'date',
      label: 'Date',
      render: ({ date }) => {
        return (
          <>
            <span>{customFunctions.getDMYDate(date)}</span>
          </>
        );
      },
    },
    {
      id:
        Number(employeeRole) === 4 ||
        Number(employeeRole) === 3 ||
        Number(employeeRole) === 2
          ? ''
          : 'action',
      label:
        Number(employeeRole) === 4 ||
        Number(employeeRole) === 3 ||
        Number(employeeRole) === 2
          ? ''
          : 'Action',
      render: handleActionCallback,
    },
  ];

  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoader, setShowLoader] = useState(false);
  const [userRole, setUserRole] = useState('');
  const title = 'Holidays';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Holidays' }];

  const getRowData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.holidayUrll}?type=all`;

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

  const removeHoliday = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to remove the holiday?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.holidayUrll}${id}/`
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

  useEffect(() => {
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    getRowData(1);
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Holidays</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <section className="content-area">
        <Card className="mt-5 schedular">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Holidays</h5>
              <div className="d-flex align-items-center justify-content-end">
                <UserRestrictions permittedUsers={[1, 5, 6]} roleId={userRole}>
                  <a
                    href="#"
                    onClick={() => {
                      history.push('/add-holiday');
                    }}
                    className="btn-link"
                  >
                    Add Holiday
                  </a>
                </UserRestrictions>
              </div>
            </div>
            <hr />
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
      </section>
    </>
  );
}

export default withRouter(Holidays);
