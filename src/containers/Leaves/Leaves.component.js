import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Image, Card } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import UserRestrictions from '../../components/UserRestrictions/userrestrictions.component';

function Leaves() {
	const handleActionCallback = () => {
		return (
			<>
				<a
					href="/"
					className="pl-2"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						// history.push(`/edit-holiday/${row.id}`);
					}}
				>
					<Image src="/images/edit-button.svg" />
				</a>
			</>
		);
	};
	// Declare columns
	const columns = [
		{
			id: 'index',
			label: 'Sr.No',
		},
		{
			id: 'leave_from_date',
			label: 'From',
		},
		{
			id: 'leave_to_date',
			label: 'To',
		},
		{
			id: 'leave_type',
			label: 'Type',
		},
		{
			id: 'reason',
			label: 'Reason',
		},
		{
			id: 'leave_count',
			label: 'Days',
		},
		{
			id: 'status',
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
	const [filterData, setFilterData] = useState({}); // eslint-disable-line
	const [title, setTitle] = useState('');
	const [userRole, setUserRole] = useState('');
	const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];

	const history = useHistory();

	const getRowData = async (pageNo = 1) => {
		const page = pageNo || currentPage;
		const endPoint =
			'https://mvwnj2rhk7.execute-api.ap-south-1.amazonaws.com/dev/api/v1/projects/';
		const params = {
			page,
			limit,
		};
		const url = customFunctions.generateUrl(endPoint, params);
		const { data, message } = await AuthApi.getDataFromServer(url);

		if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
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
			console.log('error', message);
		}
	};

	useEffect(() => {
		const uRole = customFunctions.getLocalStorage('group');
		setUserRole(Number(uRole));
		getRowData(1);
		setTitle('Leaves');
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
								<h4 className="text-primary mt-2 mb-2">Holiday</h4>
								<div className="d-flex align-items-center justify-content-end">
									<UserRestrictions permittedUsers={[4]} roleId={userRole}>
										<a
											href="#"
											onClick={() => {
												history.push('/add-leave');
											}}
											className="btn-link"
										>
											Apply Leave
										</a>
									</UserRestrictions>
								</div>
							</div>
						</Card.Header>
						<Card.Body>
							<CustomTable
								columns={columns}
								rows={rowData}
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

export default withRouter(Leaves);
