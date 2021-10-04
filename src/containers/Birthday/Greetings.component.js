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
import Loader from '../../components/Loader/index';

function Greetings() {
	const handleActionCallback = (row) => {
		return (
			<>
				<a
					href="/"
					className="pl-2"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						history.push(`/edit-greetings/${row.id}`, { isView: 'true' });
					}}
				>
					<Image alt="view" src="/images/eye.svg" />
				</a>
				<a
					href="/"
					className="pl-2 ms-1"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						history.push(`/edit-greetings/${row.id}`);
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
						deleteBirthday(row.id);
					}}
				>
					<Image src="/images/delete.png" />
				</a>
			</>
		);
	};

	const columns = [
		{
			id: 'greet_type_name',
			label: 'Type',
		},
		{
			id: 'employeeName',
			label: 'Employee Name',
		},
		{
			id: 'message',
			label: 'Message',
		},
		{
			id: 'comment_allow',
			label: 'Comments',
			render: ({ comment_allow }) => { // eslint-disable-line
        return (
          <>
            <span>
              {
                comment_allow ? 'On' : 'Off' // eslint-disable-line
              }
            </span>
          </>
        );
      }, 
		},
		{
			id: 'action',
			label: 'Action',
			render: handleActionCallback,
		},
	];

	// Declare variable
	const [rowData, setRowData] = useState([]);
	const [totalCount, setTotalCount] = useState(10);
	const [limit, setLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
	const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Greetings' }];

  const getEmployee = async (pageNo = 1) => {
  	const page = pageNo;
    const {data} = await AuthApi.getDataFromServer(`${Api.employeeUrl}?type=all&is_dropdown=1`);
    if(data) {
    getRowData(page,data.data);
    }
  };

	// Declare methods
	const getRowData = async (pageNo = 1,empData) => {
		setShowLoader(true);
		const page = pageNo || currentPage;
		const endPoint = Api.greetingsUrl;
		const params = {
			page,
			limit,
			sort_by: 'id',
			sort_direction: 'descending'
		};
		const url = customFunctions.generateUrl(endPoint, params);
		const { data, message } = await AuthApi.getDataFromServer(url);

		if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {

			const newEmpArr = [];
			empData && empData.map((emp) => {
				data && data.data.map((empdata) => {
					if(emp.id === empdata.employee[0]) {
						const newItem = empdata;
						newItem.employeeName = emp.full_name;
						newEmpArr.push(newItem);
					}
				return empdata;
				});
			return emp;
		});
			setShowLoader(false);
			setTotalCount(data.paginator.total_count);
			setLimit(data.paginator.limit);
			setCurrentPage(Number(data.paginator.current_page));
			setRowData((newEmpArr) || []);
		} else {
			setShowLoader(false);
			 swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        swal.close();
      });
		}
	};

	useEffect(() => {
		getEmployee();
		setTitle('Greetings');
	}, []);

	 const deleteBirthday = (id) => {
    if (id) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete the birthday?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result) {
          const { data, message } = await AuthApi.deleteDataFromServer(
            `${Api.greetingsUrl}${id}/`
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
				<h2 className="main-content-title tx-24 mg-b-5">Greetings</h2>
				<Breadcrumb items={items} />
			</div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
			<section className="content-area greeting-list">
					<Card className="mt-4">
						<Card.Body>
						 <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Greetings</h5>
               <div className="d-flex align-items-center justify-content-end">
									
										<a
											href="/add-greetings"
											className="btn-link"
										>
											Add Greeting
										</a>
								</div>
               </div> 
               <hr/> 
							<CustomTable
								columns={columns}
								rows={rowData}
								showPagination={true}
                tableClass="table-striped"
								paginationProps={{
									totalItems: totalCount,
									itemsPerPage: limit,
									activePage: currentPage,
									onPageChange: (pageNo) => {
									getEmployee(pageNo);
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

export default withRouter(Greetings);
