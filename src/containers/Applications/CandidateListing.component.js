import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ProgressBar, Card, Image } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';



function CandidateListing() {
	// Declare variable
	const [rowData, setRowData] = useState([]);
	const [totalCount, setTotalCount] = useState(10);
	const [limit, setLimit] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterData, setFilterData] = useState({}); // eslint-disable-line
 const title = 'Canidates'
  const items = [{ to: '/', label: 'Home' }, { label: 'Candidates' }];
const history = useHistory();

const actionCallBack = (row) => {
	return (
		<>
			<a
				href="/"
				className="pl-2 ms-3"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					history.push(`/candidates/${row.id}`)
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
					history.push(`/onboard/${row.id}`)
				}}
			>
				 On-Board
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
		id: 'email',
		label: 'Email',
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

	// Declare methods
	const getRowData = async (pageNo = 1) => {
		const page = pageNo || currentPage;
		const endPoint =
			`${Api.applicantsUrl}`;
		const params = {
			page,
			limit,
   'offer_status':1
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
		<>
	  <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Candidates</h2>
        <Breadcrumb items={items} />
      </div>
       <section className="content-area">

 <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">
               Candidates
              </h4>
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
       </section>
		</>
	);
}

export default withRouter(CandidateListing);