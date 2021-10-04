import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import FormSections from './applicationformschema.json';
import SearchFormSections from './searchFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';

function MyInterviews() {
	const group = customFunctions.getLocalStorage('group');
  const items = [{ to: '/', label: 'Home' }, { label: 'My Interviews' }];
  const history = useHistory();
  
  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);

  // Variable declarations
  const [filterData, setFilterData] = useState({});

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    if (Number(group) !== 6 && Number(group) !== 1) {
      if (sectionData.name === 'role_id') {
        sectionData.disabled = true;
      }
    }
    return sectionData;
  });

  const handleActionCallback = ({ id, status_name, name, applied_for_name, notes, offered_ctc, joining_date, pf_included, }) => { //eslint-disable-line 

    return (
      <>
        {status_name !== 'declined' ? ( //eslint-disable-line
          <a
            href="/"
            className="pl-2"
            title="Edit Applicant"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push(`/applications/${id}`, {
                statusObj: status_name,
                isInterview: true
              });

            }}
          >
            <Image src="/images/edit-button.svg" />
          </a>
        ) : (
          <a
            href="/"
            className="pl-2"
            title="Show Note"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              customFunctions.setLocalStorage('isClicked', 'true');
            }}
          >
            <Image src="/images/notes.svg" />
          </a>
        )}
      </>
    );
  };

  const handleResumeCallback = ({resume,name}) => {
    return (
      <>
        <span> {name} </span>
        {resume ? (

          <a href={resume} className="ms-2 pl-2" title="View Resume" target="_Blank">
            <Image src="/images/download-file.svg" />
          </a>
          ) : ''}
      </>
    );
  };

  // Declare columns
  const columns = [
    {
      id: 'offered_ctc',
      label: 'offered ctc',
      isDisplay: false,
    },
    {
      id: 'joining_date',
      label: 'joining date',
      isDisplay: false,
    },
    {
      id: 'pf_included',
      label: 'pf included',
      isDisplay: false,
    },
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false,
    },
    {
      id: 'interview_date', // eslint-disable-line
      label: 'Interview Date',
    },
    {
      id: 'name',
      label: 'Name',
      render: handleResumeCallback,
    },
    {
      id: 'applied_for_name',
      label: 'Position',
    },
    {
      id: 'notes',
      label: 'Note',
      isDisplay: false,
    },
    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: 'round_status_name',
      label: 'Round Status',
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.applicantsUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      
      my_interview:true,
      page,
      limit,
      sort_direction: 'descending',
      sort_by: 'round_date',
      ...filterList
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newData = [...data.data];
      newData.map((item, i) => {
        const newItem = item;
        newItem.no = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
    } else {
      setShowLoader(false);
      swal(message,'','error');
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Recruitment');
  }, [filterData]);

  // Get user role Filter search
  // Submit Form
  const submitForm = async (formValues) => {
    setFilterData(formValues);
  };
    
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">My Interviews</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
         <Card>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 mt-2 ">Filters</h5>
              </div>  
              <hr/>
            <div className="filter-box-main">
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
              showBtnClass={false}
              btnContainerClass="col-md-4 filter-apply-btns"
              formClass="row"
              isStepForm={false}
              onFormReset={() => {
                setFilterData();
              }}
            />
            </div>
            </Card.Body>
          </Card>
        <Card>
          <Card.Body>
           <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 "> My Interviews</h5>
            </div>
            <hr/>
            <CustomTable
              tableContainerClass="mt-2"
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
              // showCheckbox={Number(group) !== 4 ? true : false} //eslint-disable-line
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
export default withRouter(MyInterviews);
