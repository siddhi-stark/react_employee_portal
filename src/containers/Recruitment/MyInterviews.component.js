import React, { useState, useEffect } from 'react';
import CustomTable from 'stark-custom-datatable';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import FormSections from './applicationformschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function MyInterviews() {
	const group = customFunctions.getLocalStorage('group');
  const items = [{ to: '/', label: 'Home' }, { label: 'My Interviews' }];
  const history = useHistory();

  // Variable declarations Filter Form
  // const [defaultValues, updateDefaultValues] = useState({});

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  

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

              // history.push('/edit-employee');
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
        {(Number(group) === 4 || Number(group) === 3) || status_name === 'pending' || status_name === 'shortlisted' || status_name === 'reject' || status_name === 'declined' || status_name === 'rejected' ? ( //eslint-disable-line
          ''
        ) : (
          <a
            href="/"
            className="p-r-2 text-info ms-2"
            title="Send Offer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('/generate-offerletter');
              customFunctions.setLocalStorage('applicantId', id);
              rowData &&
                rowData.map((dt) => {
                  if (id === dt.id) {
                    customFunctions.setLocalStorage(
                      'applicantName',
                      dt.name && dt.name
                    );
                    customFunctions.setLocalStorage(
                      'designation',
                      dt.applied_for_name && dt.applied_for_name
                    );
                    customFunctions.setLocalStorage(
                      'offerctc',
                      dt.offered_ctc && dt.offered_ctc
                    );
                    customFunctions.setLocalStorage(
                      'joiningdate',
                      dt.joining_date && dt.joining_date
                    );
                    customFunctions.setLocalStorage(
                      'pfInclude',
                      dt.pf_included && dt.pf_included
                    );
                  }
                  return dt;
                });
            }}
          >
            <Image src="/images/offer.svg" />
          </a>
        )}
      </>
    );
  };

  const handleResumeCallback = (resume) => {
    return (
      <>
      {resume.resume ? (

        <a href={resume.resume} className="pl-2" target="_Blank">
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
    },
    {
      id: 'applied_for_name',
      label: 'Position',
    },
    {
      id: 'tech_stack_name',
      label: 'Technology',
    },
    {
      id: 'notes',
      label: 'Note',
      isDisplay: false,
    },

    {
      id: 'resume',
      label: 'Resume',
      render: handleResumeCallback,
    },
    {
      id: 'status_name',
      label: 'Status',
    },
    {
      id: Number(group) === 5 || Number(group) === 6 ? 'round_status_name' : '',
      label: Number(group) === 5 || Number(group) === 6 ? 'Round Status' : '',
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const page = pageNo || currentPage;

    const endPoint = `${Api.applicantsUrl}`;

    const params = {
      
      my_interview:true,
      page,
      limit,
      sort_direction: 'descending',
      sort_by: 'updated_at',
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
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
      swal(message,'','error');
    }
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Recruitment');
  }, []);

  // filter Form

  // Get user role
  // const getUserRole = async () => {
  //   const roleId = await localStorage.getItem('group');
  //   updateCurrentUser(Number(roleId));
  // };

  // useEffect(() => {
  //   getUserRole();
  // }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">My Interviews</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-primary mt-2 mb-2">My Interviews</h4>
            </div>
          </Card.Header>
          <Card.Body>
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
