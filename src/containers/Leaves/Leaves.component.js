import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Image, Card } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function Leaves() {
	const handleActionCallback = ({ id, status_name, leave_from_date }) => { // eslint-disable-line
		return (
			<>
				<a
					href="/"
					className="pl-2"
					title={(status_name !== 'Pending' || status_name === 'Approved') ? 'View Leave':'Edit Leave'}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
							if(status_name !== 'Pending' || status_name === 'Approved'){
								history.push(`/edit-leave/${id}`, { isViewLeave : true });
							} else {
								history.push(`/edit-leave/${id}`,{ isViewLeave : false, isView: 'false' });
							}
					}}
				>
					{(status_name !== 'Pending' || status_name === 'Approved') ?
					<Image src="/images/eye.svg" />
					:  <Image alt="view" src="/images/edit-button.svg" />}
				</a>
				{ new Date(leave_from_date).getTime() >= new Date().getTime() && (
				<a
					href="/"
					className="ms-2 pl-2"
					title="Cancel Leave"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
							changeStatus(id);
						}}
				>
				{(status_name === 'Approved' || status_name === 'Pending') && (
					<Image src="/images/fail.svg" />
				)}
				</a>
				)}
			</>
		);
	};
	
	// Declare columns
	const columns = [
		{
			id: 'id',
			label: 'id',
			isDisplay: false,
		},
		{
			id: 'index',
			label: 'Sr.No',
		},
		{
      id: 'leave_date',
      label: 'Leave Date',
      roleAccess: [3],
      render: ({ leave_from_date, leave_to_date }) => { // eslint-disable-line
        return (
          <>
            <span>{`${customFunctions.getNewFormattedDate(
              leave_from_date
            )} to ${customFunctions.getNewFormattedDate(
              leave_to_date
            )}`}</span>
          </>
        );
      },
    },
		{
			id: 'leave_type',
			label: 'Type',
		},
		{
			id: 'leave_count',
			label: 'Days',
			roleAccess: [4],
		},
		{
			id: 'status_name',
			label: 'Status',
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
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const limit = 10;
	const [title, setTitle] = useState('');
	const [userRole, setUserRole] = useState('');
	const [isShowLoader,setShowLoader] = useState(false);
	const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];

	const history = useHistory();

	const getRowData = async (pageNo = 1) => {
		setShowLoader(true);
		const page = pageNo || currentPage;
		const endPoint = `${Api.leavesUrl}`;

		const params = {
			page,
			limit,
      my_leaves: true,
			sort_by: 'leave_from_date',
			sort_direction: 'descending',
		};
		const url = customFunctions.generateUrl(endPoint, params);
		const { data, message } = await AuthApi.getDataFromServer(url);

		if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
			setShowLoader(false);
			setTotalCount(data.paginator.total_count);
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
			setShowLoader(false);
			swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
		}
	};

	const changeStatus = async (id) => {
		setShowLoader(true);
		const endPoint = `${Api.leavesUrl}${id}/`;

		const postData = {
			status: 4,
		};

   	const callback = AuthApi.putDataToServer;

    const { data, message } = await callback(endPoint, postData);

		if (data) {
			setShowLoader(false);
			swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
 				getRowData(1);
        swal.close();
      });
		} else {
			setShowLoader(false);
			swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
		}
	};

	useEffect(() => {
		const uRole = customFunctions.getLocalStorage('group');
		setUserRole(Number(uRole));
		getRowData(1);
		setTitle('Leaves');
	}, []);

	return (
		<>
			<Helmet title={title} />
			<div className="title-breadcrumb-section">
				<h2 className="main-content-title tx-24 mg-b-5">My Leaves</h2>
				<Breadcrumb items={items} />
			</div>
    <Loader showLoader={isShowLoader} needFullPage={false} />
			<section className="content-area">
					<Card>
						<Card.Body>
						<div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Leaves</h5>
                <div className="d-flex align-items-center justify-content-end">
                	{ Number(userRole) !== 1 && (
										<a
											href="#"
											onClick={() => {
												history.push('/add-leave',{ isViewLeave : false });
											}}
											className="btn-link"
										>
											Apply Leave
										</a>
										)}
								</div>
               </div> 
               <hr/> 
							<CustomTable
								columns={columns}
								rows={rowData}
								tableClass="table-striped"
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
									return 'No Leaves Applied Yet.';
								}}
							/>
						</Card.Body>
					</Card>
			</section>
		</>
	);
}

export default withRouter(Leaves);
