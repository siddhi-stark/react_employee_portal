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

function Holidays() {
  const employeeRole = customFunctions.getLocalStorage('group');
 
  const handleActionCallback = (row) => {
		return (
			<>
      {(Number(employeeRole) === 4 || Number(employeeRole) === 3 || Number(employeeRole) === 2) ? '' : (
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
			id: employeeRole ?  '' : 'action' ,
			label: employeeRole ?  '' : 'action' ,
			render: handleActionCallback,
		},
	];

	const [rowData, setRowData] = useState([]);
	const [totalCount, setTotalCount] = useState(10);
	const [limit, setLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [userRole, setUserRole] = useState('');
	const title = 'Holidays';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Holidays' }];
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({}); // eslint-disable-line

	const getRowData = async () => {
		const endPoint =
			`${Api.holidayUrll}?type=all`;

		const url = customFunctions.generateUrl(endPoint);
		const { data, message } = await AuthApi.getDataFromServer(url);

		if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
			setTotalCount(data.paginator.total_count);
			setLimit(data.paginator.limit);
			setCurrentPage(Number(data.paginator.current_page));
			setRowData((data && data.data) || []);
		} else {
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
	}, [filterData]);

	return (
		<>

 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Holidays</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">

        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Holidays</h4>
                <div className="d-flex align-items-center justify-content-end">
                  <UserRestrictions permittedUsers={[1,5,6]} roleId={userRole}>
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

export default withRouter(Holidays);
