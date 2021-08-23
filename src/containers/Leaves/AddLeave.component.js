import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddLeave.json';
import { Helmet } from '../../components/FormInputs';
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

  const columns = [
    {
      id: 'occasion',
      label: 'Occasion',
    },
    {
      id: 'day',
      label: 'Day',
    },
    {
      id: 'date',
      label: 'Date',
    },
    {
      id: 'action',
      label: 'Action',
    },
  ];

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    setTitle(leaveId ? 'Edit Leaves' : 'Add Leaves');
  }, []);

  const getTask = async (fromDate, toDate) => {
    const userId = customFunctions.getLocalStorage('userId');
    const endPoint = `${Api.employeeTask}`;
    const params = {
      user_id: userId,
      start_date: fromDate && customFunctions.getDate(fromDate),
      end_date: toDate && customFunctions.getDate(toDate),
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setRowData((data && data.data) || []);
    } else {
      console.log('error', message);
    }
  };

  // Submit Form
  const submitForm = async (formValues) => {
    const fromType =
      formValues.leave_from_type &&
      formValues.leave_from_type.value === 'Full Day'
        ? 2
        : 1;
    const toType =
      formValues.leave_to_type && formValues.leave_to_type.value === 'Full Day'
        ? 2
        : 1;
    const postData = {
      leave_type: formValues.leave_type ? formValues.leave_type.value : '',
      reason: formValues.reason,
      leave_from_date: formValues.leave_from_date
        ? customFunctions.getDate(formValues.leave_from_date)
        : '',
      leave_from_type: formValues.leave_from_type && fromType,
      leave_to_type: formValues.leave_to_type.value && toType,
      leave_to_date: formValues.leave_to_date
        ? customFunctions.getDate(formValues.leave_to_date)
        : '',
      leave_from_time: formValues.leave_from_time
        ? customFunctions.getTime(formValues.leave_from_time)
        : '9:30 AM',
      leave_to_time: formValues.leave_to_time
        ? customFunctions.getTime(formValues.leave_to_time)
        : '6:30 PM',
    };
    if (leaveId) postData.id = Number(leaveId);
    getTask(
      customFunctions.getDate(formValues.leave_from_date),
      customFunctions.getDate(formValues.leave_to_date)
    );

    const callback = leaveId
      ? AuthApi.putDataToServer
      : AuthApi.postDataToServer;

    const endPoint = Api.leavesUrl;

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
        swal.close();
      });
    }
    // Perform success actions
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
      leave_from_time:
        data.data.leave_from_time &&
        new Date(`
          ${customFunctions.getDate(
            data.data.leave_from_date
          )} ${customFunctions.convertTime12to24(data.data.leave_from_time)}
          `),
      leave_to_date:
        data.data.leave_to_date &&
        new Date(customFunctions.getDate(data.data.leave_to_date)),
      leave_to_time:
        data.data.leave_to_time &&
        new Date(`
          ${customFunctions.getDate(
            data.data.leave_to_date
          )} ${customFunctions.convertTime12to24(data.data.leave_to_time)}
          `),
      leave_to_type: data.data.leave_to_type_name && {
        label: data.data.leave_to_type_name,
        value: data.data.leave_to_type_name,
      },
    });
  };

  // Call get data method on load
  useEffect(() => {
    if (leaveId) getData();
  }, []);

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

  const getLeaveFromType = async () => {
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
      leave_from_type: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getLeaveFromType();
  }, []);

  const getLeaveToType = async () => {
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
      leave_to_type: dpOptions,
    };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getLeaveToType();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Leaves</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <StarkFormBuilder
              containerClass=""
              formHeaderClass=""
              formSections={FormSections}
              formHeading="Leave"
              onFormSubmit={(formValues) => {
                submitForm(formValues);
              }}
              options={options}
              callbacks={{}}
              defaultFormValues={defaultValues}
              currentUser={currentUser}
              submitBtnText="Check task"
              showResetBtn={true}
              resetBtnText="Cancel"
              btnContainerClass="form-submit-buttons"
              isStepForm={false}
              onFormReset={() => {
                history.push('/leaves');
              }}
            />
            <div className="mt-5 mx-4">
              <CustomTable
                columns={columns}
                rows={rowData}
                tableClass="table-striped"
                role={5}
                emptyRender={() => {
                  return 'No record found.';
                }}
              />
              {!customFunctions.checkIfEmpty(rowData) && (
                <Button
                  // href="#"
                  // onClick={() => {
                  //   history.push('/add-leave');
                  // }}
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
