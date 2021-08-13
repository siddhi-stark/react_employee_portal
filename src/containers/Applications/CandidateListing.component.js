import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import AuthApi from '../../helper/authApi';

const actionCallBack = () => {
	return (
		<>
			<a
				href="/"
				className="pl-2"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				View
			</a>
		</>
	);
};

const handleProgressCallBack = () => {
	const progress = 60;
	return (
		<>
			<ProgressBar
				bsPrefix="progress pbar"
				variant="success"
				now={60}
				label={`${progress}% completed`}
			/>
		</>
	);
};

// Declare columns
const columns = [
	{
		id: 'name',
		label: 'Candidate Name',
	},
	{
		id: 'applied_for_name',
		label: 'Position',
	},
	{
		id: 'progress',
		label: 'Progress',
		render: handleProgressCallBack,
	},
	{
		id: 'action',
		label: 'Action',
		render: actionCallBack,
	},
];

function CandidateListing() {
	// Declare variable
	const [rowData, setRowData] = useState([]);
	const [totalCount, setTotalCount] = useState(10);
	const [limit, setLimit] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterData, setFilterData] = useState({}); // eslint-disable-line

	// Declare methods
	const getRowData = async (pageNo = 1) => {
		const page = pageNo || currentPage;
		const endPoint =
			'https://mvwnj2rhk7.execute-api.ap-south-1.amazonaws.com/dev/api/v1/applicants/';
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
	}, [filterData]);

	return (
		<div className="mt-5">
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
		</div>
	);
}

export default withRouter(CandidateListing);