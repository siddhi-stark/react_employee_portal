import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import { Image, Card } from 'react-bootstrap';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function Greetings() {
	const handleActionCallback = () => {
		return (
			<>
				<a
					href="/"
					className="pl-2"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						// history.push(`/edit-event/${row.id}`, { isView: 'true' });
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
						// history.push(`/edit-event/${row.id}`);
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
						// removeHoliday(row.id);
					}}
				>
					<Image src="/images/delete.png" />
				</a>
			</>
		);
	};

	// Declare columns
	const columns = [
		{
			id: 'greet_type_name',
			label: 'Type',
		},
		{
			id: 'message',
			label: 'Message',
		},
		{
			id: 'comment_allow',
			label: 'Comments',
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
	const [limit, setLimit] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);
	const title = 'Greetings';
  const items = [{ to: '/', label: 'Home' }, { label: 'Greetings' }];

	// Declare methods
	const getRowData = async (pageNo = 1) => {
		const page = pageNo || currentPage;
		const endPoint = Api.greetingsUrl;
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
	}, []);

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
									
										<a
											href="#"
											// onClick={() => {
											// 	history.push('/add-event');
											// }}
											className="btn-link"
										>
											Add Event
										</a>
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

export default withRouter(Greetings);
