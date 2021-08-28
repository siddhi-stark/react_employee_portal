import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddLeave.json';
import { Helmet, TextInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function AddLeave(props) {
  const idProps = props;
  const leaveId = idProps.match.params.leaveId;

  const history = useHistory();
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [rowData, setRowData] = useState([]);
  const items = [{ to: '/', label: 'Home' }, { label: 'Leaves' }];
  const [title, setTitle] = useState('');

  const [totalCount, setTotalCount] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formValuesData, setFormValuesData] = useState({});
  const [changeDate, setChangeDate] = useState(true);
  const [status, setStatus] = useState('Pending');
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [reason, setReason] = useState('');

  const columns = [
    {
      id: 'id',
      label: 'id',
      isDisplay:false
    }, 
    {
      id: 'index',
      label: 'Sr.No',
    },
    {
      id: 'project_name',
      label: 'Project',
    },
    {
      id: 'content',
      label: 'Task',
    },
    {
      id: 'start_date',
      label: 'Task Start Date',
      render: ({ start_date }) => { // eslint-disable-line
        return (
          <>
            <span>{customFunctions.getNewFormattedDate(start_date)}</span>
          </>
        );
      },
    },
    {
      id: 'end_date',
      label: 'Task Completion Date',
      render: ({ end_date }) => { // eslint-disable-line
        return (
          <>
            <span>{customFunctions.getNewFormattedDate(end_date)}</span>
          </>
        );
      },
    },
    {
      id: 'is_overdue',
      label: 'Overdue Task',
    },
    {
      id: 'project_end_date',
      label: 'Project Deadline',
      render: ({ project_end_date }) => { // eslint-disable-line
        return (
          <>
            <span>{project_end_date ? customFunctions.getNewFormattedDate(project_end_date) :'' // eslint-disable-line
            }</span>
          </>
        );
      },
    },
  ];

 useEffect(() => {
    const formViewSchema = [...FormSections];
   let updatedSchema = [];
   if(status !== 'Pending') {
     updatedSchema = formViewSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'leave_type' ||
            item.name === 'reason' ||
            item.name === 'leave_from_date' ||
            item.name === 'leave_from_type' ||
            item.name === 'leave_from_time' ||
            item.name === 'leave_to_date' ||
            item.name === 'leave_to_type' ||
            item.name === 'leave_to_time'
          )
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });

      updateJsonSchema([...updatedSchema]);
   }
     
     else{

       updatedSchema = formViewSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (
            item.name === 'leave_type' ||
            item.name === 'reason' ||
            item.name === 'leave_from_date' ||
            item.name === 'leave_from_type' ||
            item.name === 'leave_from_time' ||
            item.name === 'leave_to_date' ||
            item.name === 'leave_to_type' ||
            item.name === 'leave_to_time'
          )
            itemData.disabled = false;
          return itemData;
        });
        return s;
      });
}  
      updateJsonSchema([...updatedSchema]);
  }, [status]);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (
      sectionData.name === 'leave_from_date' ||
      sectionData.name === 'leave_to_date'
    ) {
      const date = new Date();
      sectionData.minDate = date;
    }
    return sectionData;
  });

  useEffect(() => {
    getUserRole();
    setTitle(leaveId ? 'Edit Leaves' : 'Add Leaves');
  }, []);

 const ApplyLeave = async (formValues) => {
    const defaultValuesFromType = 
    defaultValues.leave_from_type && (defaultValues.leave_from_type === 'Full Day')
        ? 2
        : 1;

    const defaultValuesToType =
      defaultValues.leave_to_type && (defaultValues.leave_to_type.value === 'Full Day')
        ? 2
        : 1;

    const fromType =
      formValues.leave_from_type &&
      (formValues.leave_from_type.value === 'Full Day') 
        ? 2
        : 1;
    const toType =
      formValues.leave_to_type && (formValues.leave_to_type.value === 'Full Day') || defaultValues.leave_to_type && (defaultValues.leave_to_type === 'Full Day')
        ? 2
        : 1;
    const postData = {
      leave_type: formValues.leave_type ? formValues.leave_type.value : defaultValues.leave_type.value,
      reason: formValues.reason ? formValues.reason : defaultValues.reason,
      leave_from_date: formValues.leave_from_date
        ? customFunctions.getDate(formValues.leave_from_date)
        : customFunctions.getDate(defaultValues.leave_from_date),
      leave_from_type: formValues.leave_from_type ? fromType : defaultValuesFromType,
      leave_to_type: formValues.leave_to_type ? toType : defaultValuesToType,
      leave_to_date: formValues.leave_to_date
        ? customFunctions.getDate(formValues.leave_to_date)
        : customFunctions.getDate(defaultValues.leave_to_date),
      leave_from_time: formValues.leave_from_time && formValues.leave_from_time.value
        ? formValues.leave_from_time.value
        : '9:30 AM',
      leave_to_time: formValues.leave_to_time && formValues.leave_to_time.value 
        ? formValues.leave_to_time.value
        : '6:30 PM',
    };
    if (leaveId) postData.id = Number(leaveId);
    if (defaultValues.leave_from_time && defaultValues.leave_to_time) {
      postData.leave_to_time = defaultValues.leave_to_time && defaultValues.leave_to_time.value;
      postData.leave_from_time = defaultValues.leave_from_time && defaultValues.leave_from_time.value;
    }
    const callback = leaveId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint = Api.leavesUrl;
    if(!customFunctions.checkIfEmpty(rowData)) {
    const { data, message } = await callback(endPoint, postData);

      if (!data) {
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
          buttons: false,
          timer: 2000,
        }).then(() => {
          // updateDefaultValues({});
          swal.close();
        });
        // show error
        // return;
      } else {
        swal(data && data.message[0], '', 'success', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        }).then(() => {
          history.push('/leaves');
          swal.close();
        });
      }
    }
      // Perform success actions
  };

  // Submit Form
  const submitForm = async (formValues) => {
    if(formValues.leave_from_date && formValues.leave_to_date){
      setStartDate(formValues.leave_from_date);
      setEndDate(formValues.leave_to_date);
    }
    setFormValuesData(formValues);
  };

  // Get data for form
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.leavesUrl}${leaveId}/`
    );
    if (!data) {
      // show error
      return;
    }
    if(data && data.data){
      setStartDate(data.data.leave_from_date);
      setEndDate(data.data.leave_to_date);
      setStatus(data.data.status_name);
      setReason(data.data.declined_reason);
    }

    updateDefaultValues({
      leave_type: data.data.leave_type && {
        label: data.data.leave_type,
        value: data.data.leave_type,
      },
      reason: data.data.reason && data.data.reason,
      leave_from_date:
        data.data.leave_from_date &&
        new Date(customFunctions.getDate(data.data.leave_from_date)),
      leave_from_type: data.data.leave_from_type_name && {
        label: data.data.leave_from_type_name,
        value: data.data.leave_from_type_name,
      },
      leave_from_time: data.data.leave_from_time && {
        label: data.data.leave_from_time,
        value: data.data.leave_from_time,
      },
      leave_to_date:
        data.data.leave_to_date &&
        new Date(customFunctions.getDate(data.data.leave_to_date)),
      leave_to_time: data.data.leave_to_time && {
        label: data.data.leave_to_time,
        value: data.data.leave_to_time,
      },
      leave_to_type: data.data.leave_to_type_name && {
        label: data.data.leave_to_type_name,
        value: data.data.leave_to_type_name,
      },
    });
  };

  // Call get data method on load
  useEffect(() => {
    if (leaveId) getData();
  }, [status]);

  const getLeaveType = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.undefined);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.title, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      leave_type: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getLeaveType();
  }, []);

  // Declare methods
  const getRowData = async (pageNo = 1) => {
    const userId = customFunctions.getLocalStorage('userId');
    const page = pageNo || currentPage;
    const endPoint = `${Api.employeeTask}`;
    const params = {
      page,
      limit,
      user_id: userId ? Number(userId) : leaveId,
      start_date: startDate && customFunctions.getDate(startDate),
      end_date: endDate && customFunctions.getDate(endDate),
      sort_direction: 'descending',
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
        newItem.index = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData((data && data.data) || []);
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      getRowData(1);
    }
  }, [startDate, endDate]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Leave Application</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card body>
          { (status !== 'Pending') &&
           <Button className="float-end" onClick= {() =>  history.push('/leaves')} >Back</Button>
          }
            <Row className="ms-3">

            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={jsonSchema}
              formHeading="Leave application"
              onFormSubmit={(formValues) => {
                submitForm(formValues);
                setChangeDate(true);
              }}
              options={options}
              callbacks={{
                getHandleFromDate : () => {
                  setChangeDate(false);
                },
                getHandleToDate: () => {
                  setChangeDate(false);
                },
              }}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Check task"
              showResetBtn={true}
              resetBtnText="Cancel"
              btnContainerClass= {(status === 'Pending') ? 'form-submit-buttons':'d-none'}
              isStepForm={false}
              onFormReset={() => {
                history.push('/leaves');
              }}
            />
              </Row>
              <Row className="ms-3">
            {(status === 'Declined') && (
            <TextInput
                inputClass="form-control"
                label="Declined Reason"
                containerClass="form-group"
                type="textarea"
                disabled
                name="reason"
                value={reason}
              />
             )}
              </Row>

              <div className="mt-5 mx-4">
                { (totalCount > 0) && (status === 'Pending') &&  (
                  <>

                    <Card.Header>
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 className="text-primary mt-2 mb-2">Employee Task List</h4>
                      </div>
                    </Card.Header>
                      <Card.Body>
                          <CustomTable
                            columns={columns}
                            rows={rowData}
                            tableClass="table-striped"
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
                              return 'No task available.';
                            }}
                          />
                          <br />         
                      </Card.Body>

                  </>
                      )}
                   { (totalCount > 0) && (
                    <p className="text-danger ms-3">
                    Note: The highlighted task shows the high priority and may
                    affect the project deadline. Kindly look into and the
                    apply for leave </p>
                  )}
                   { (totalCount === 0) && (status === 'Pending') && (
                    <p className="text-success"> Note: Make sure No task affecting the project deadline and associated task are taken care. </p>
                  )}
                { (totalCount === 0) && changeDate && (status === 'Pending') &&  (
                  <Button
                    onClick={() => {
                      ApplyLeave(formValuesData);
                    }}
                    className="mb-4"
                  >
                    Apply Leave
                  </Button>
                )}
              </div>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(AddLeave);
