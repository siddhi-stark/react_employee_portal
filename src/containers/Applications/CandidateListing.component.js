import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ProgressBar, Card, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import SearchFormSections from './searchFormschema.json';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';

function CandidateListing() {
	// Declare variable
	const [rowData, setRowData] = useState([]);
	const [totalCount, setTotalCount] = useState(10);
	const [limit, setLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [isShowLoader, setShowLoader] = useState(false);

	const title = 'Candidates';
	const items = [{ to: '/', label: 'Home' }, { label: 'Candidates' }];
	const history = useHistory();

	const actionCallBack = (row) => {
		return (
			<>
				<a
					href="/"
					title="Edit Candidate"
					className="pl-2 ms-2"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						history.push(`/candidates/${row.id}`);
					}}
				>
					<Image src="/images/edit-button.svg" />
				</a>
				{new Date(row.joining_date).getTime() <= new Date().getTime() &&
					row.offer_status_name !== 'Declined' &&
					!row.employee_id && (
						<a
							href="/"
							title="Onboard Candidate"
							className="pl-2 ms-1"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								history.push(`/onboard/${row.id}`);
							}}
						>
							<Image src="/images/onboard.svg" />
						</a>
					)}
			</>
		);
	};

	const handleProgressCallBack = (completion) => {
		return (
			<>
				{completion.offer_status_name !== 'Declined' && (
					<ProgressBar
						bsPrefix="progress pbar"
						variant="success"
						now={completion.completion ? completion.completion : 0}
						label={`${
							completion.completion ? completion.completion : 0
						}% completed`}
					/>
				)}
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
			id: 'mobile',
			label: 'Mobile',
		},
		{
			id: 'tech_stack_name',
			label: 'Technology',
		},
		{
			id: 'offer_status_name',
			label: 'Offer Status',
		},
		{
			id: 'joining_date',
			label: 'Joining Date',
			render: ({ joining_date }) => { // eslint-disable-line
				return (
					<>
						<span>{customFunctions.getDMYDate(joining_date)}</span>
					</>
				);
			},
		},
		{
			id: 'completion',
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
		setShowLoader(true);
		const page = pageNo || currentPage;
		const endPoint = `${Api.applicantsUrl}`;
		const filterList = filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};
		const params = {
			page,
			limit,
			sort_direction: 'descending',
			status: 4,
      ...filterList
		};
		const url = customFunctions.generateUrl(endPoint, params);
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
	}, [filterData]);
  
  // Submit Form
  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };

	return (
		<>
			<Helmet title={title} />
			<div className="title-breadcrumb-section">
				<h2 className="main-content-title tx-24 mg-b-5">Candidates</h2>
				<Breadcrumb items={items} />
			</div>
            <Loader showLoader={isShowLoader} needFullPage={false} />
			<section className="content-area">
				<Card>
					<Card.Header>
						<div className="d-flex align-items-center justify-content-between">
							<h4 className="text-primary mt-2 mb-2">Candidates</h4>
						</div>
					</Card.Header>
					<Card.Body>
					 <StarkFormBuilder
              containerClass=''
              formHeaderClass=''
              formSections={SearchFormSections}
              formHeading=""
              onFormSubmit={(formValues) => {submitForm(formValues);}}
              callbacks={{}}
              submitBtnText="Apply"
              showResetBtn={true}
              resetBtnText="Clear"
              btnContainerClass="form-submit-buttons pull-right mb-3"
              isStepForm={false}
              onFormReset={() => {
                setFilterData();
              }}
            />
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
