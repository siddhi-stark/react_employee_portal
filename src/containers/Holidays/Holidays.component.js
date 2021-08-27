import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import { Image, Card, Accordion, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import FormSections from './HolidaysFilter.json';
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
					className="pl-2 ms-4"
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

	// Declare columns
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

	// Declare variable
	const [rowData, setRowData] = useState([]);
	const [totalCount, setTotalCount] = useState(10);
	const [limit, setLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterData, setFilterData] = useState({}); // eslint-disable-line
  const [userRole, setUserRole] = useState('');
	const title = 'Holidays';
  const history = useHistory();
  const items = [{ to: '/', label: 'Home' }, { label: 'Holidays' }];


  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
  const [options, updateOptions] = useState({}); // eslint-disable-line
  const [currentUser, updateCurrentUser] = useState(0);
    


	// Declare methods
	const getRowData = async (pageNo = 1) => {
		const page = pageNo || currentPage;
		const endPoint =
			`${Api.holidayUrll}`

		
		const params = {
			page,
			limit,
			sort_direction:'descending',
			start_date: filterData.start_date ? customFunctions.getDate(filterData.start_date) : '' ,
			end_date: filterData.end_date ? customFunctions.getDate(filterData.end_date) : '',
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



  // Get user role
  const getUserRole = async() => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
  
  setFilterData(formValues); //eslint-disable-line

      
  };
    
	useEffect(() => {
		const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
		getRowData(1);
	}, [filterData]);

  const onResetForm = () => {
    setFilterData('');
    getRowData(1);
    setFilterData(false);
  };

	return (
		<>

 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Holidays</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">

      <div className="mt-5">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="text-primary m-0">Filters</h4>
                  <div className="d-flex align-items-center justify-content-end">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      Expand
                    </Accordion.Toggle>
                  </div>
                </div>
              </Card.Header>

              <Accordion.Collapse eventKey="1">
                <Card.Title>
                    <StarkFormBuilder
							    containerClass='mt-5'
							    formHeaderClass=''
							    formSections={FormSections}
							    onFormSubmit={(formValues) => {submitForm(formValues);}}
							    options={options}
							    callbacks={{}}
							    defaultFormValues={defaultValues}
							    currentUser={currentUser}
							    submitBtnText="Submit"
							    showResetBtn={true}
							    resetBtnText="Clear"
							    btnContainerClass="form-submit-buttons"
							    isStepForm={false}
							    onFormReset={() => {
							        onResetForm();
							    }}
							  />
                </Card.Title>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>

        <div className="mt-5">
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mt-2 mb-2">Holiday</h4>
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
