/* eslint-disable */
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
  let defaultFilterOptions = {};
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [options, updateOptions] = useState({});

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

  const handleActionCallback = ({ id, status_name }) => {
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
                isInterview: true,
                pageType: 'My_Interview',
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

  const handleResumeCallback = ({ resume, name }) => {
    return (
      <>
        <span> {name} </span>
        {resume ? (
          <a
            href={resume}
            className="ms-2 pl-2"
            title="View Resume"
            target="_blank"
          >
            <Image src="/images/download-file.svg" />
          </a>
        ) : (
          ' '
        )}
      </>
    );
  };

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
      render: (status_name) => {
        const status = status_name;
        
        return (
          <>
            <span>
              {`${customFunctions.capitalizeFirstLetter(status.status_name)}`}
            </span>
          </>
        );
      },
    },
    {
      id: 'round_one',
      label: 'Round 1',
      render: (round_one) => {
        const categoryData = round_one.round_one; //eslint-disable-line
        return (
          <>
            <span>
              {
                `${categoryData.status_name}` //eslint-disable-line
              }
            </span>
          </>
        );
      },
    },
    {
      id: 'round_two',
      label: 'Round 2',
      render: (round_two) => {
        const categoryData = round_two.round_two; //eslint-disable-line
        return (
          <>
            <span>{categoryData.status_name}</span>
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

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.applicantsUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      my_interview: true,
      page,
      limit,
      sort_direction: 'descending',
      sort_by: 'round_date',
      my_interview_round: 'true',
      ...filterList,
    };
    
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newInterwArr = await data.data.map((dt) => {
        if (dt.applicant_round_list && dt.applicant_round_list.length > 0) {
          dt.round_one = dt.applicant_round_list[0]; //eslint-disable-line
          dt.round_two = dt.applicant_round_list[1]; //eslint-disable-line
        }
        return dt;
      });

      const newData = [newInterwArr];
      newData.map((item, i) => {
        const newItem = item;
        newItem.no = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData(newInterwArr || []);
      
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getRoundsStatus = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=applicant_status`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    (await data.data) &&
      data.data.applicant_status.map((op) => {
        dpOptions.push({
          label: op?.name, // Capitalize first letter
          value: op.id,
        });
        return op;
      });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      status_name: dpOptions,
    };
    
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Recruitment');
  }, [filterData]);

  useEffect(() => {
    getRoundsStatus();
  }, []);

  const submitForm = async (formValues) => {
    const capitalizeFirstLetter = (string) => {
      
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const payload = {
      keyword: formValues && formValues.keyword ? formValues.keyword : '',
      // status:
      //   formValues && formValues.status_name && formValues.status_name.value
      //     ? formValues.status_name.value
      //     : '',
      status:formValues?.status_name?.value 
      // formValues && formValues.status_name && formValues.status_name.value
      // ? capitalizeFirstLetter(formValues.status_name)
      // : '',
    };
    
    setFilterData(payload);
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
            <hr />
            <div className="filter-box-main">
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={SearchFormSections}
                formHeading=""
                options={options}
                onFormSubmit={(formValues) => {
                  // if (!formValues.keyword || !formValues.status_name) return;
                  submitForm(formValues);
                }}
                callbacks={{}}
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={false}
                btnContainerClass="col-md-4 filter-apply-btns"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  setFilterData({});
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
            <hr />
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
