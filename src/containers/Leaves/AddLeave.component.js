import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddLeave.json';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import customFunctions from '../../helper/customFunctions';

function AddLeave() {
  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);
  const [jsonSchema, updateJsonSchema] = useState(FormSections);
  const [rowData, setRowData] = useState([]);


const columns = [

    {
      id: 'occasion',
      label: 'Occasion',
    },{
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
  }, []);

  const getTask = async (fromDate,toDate) => {
    console.log('fromDate',fromDate,'toDate',toDate);
    const endPoint =
      `${Api.employeeTask}`
    const params = {
      user_id: 35,
      start_date: fromDate,
      end_date: toDate,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setRowData((data && data.data) || []);
    } else {
      console.log('error', message);
    }
  }

  // Submit Form
  const submitForm = async (formValues) => {
    console.log('formValues',formValues);

    const postData = {
      leave_type: formValues.leave_type ? formValues.leave_type.value : '',
      reason: formValues.reason,
      leave_from_date: formValues.leave_from_date ? customFunctions.getDate(formValues.leave_from_date) : '',
      leave_from_type: formValues.leave_from_type ? formValues.leave_from_type.value : '',
      leave_to_type: formValues.leave_to_type ? formValues.leave_to_type.value : '',
      leave_to_date: formValues.leave_to_date ? customFunctions.getDate(formValues.leave_to_date) : '',
      leave_from_time: formValues.leave_from_time ? customFunctions.getTime(formValues.leave_from_time) : '',
      leave_to_time: formValues.leave_to_time ? customFunctions.getTime(formValues.leave_to_time) : ''

    }
    console.log('postData',postData);
    getTask(customFunctions.getDate(formValues.leave_from_date),customFunctions.getDate(formValues.leave_to_date));

    const { data } = await AuthApi.putDataToServer(Api.employeeUrl, formValues);
    if (!data) {
      // show error
      // return;
    }
    // Perform success actions
  };

  // Get data for form
  const getData = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
    if (!data) {
      // show error
      return;
    }
    updateDefaultValues(data);
  };

  // Call get data method on load
  useEffect(() => {
    getData();
  }, []);

  const getLeaveType = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
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
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
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
    const { data } = await AuthApi.getDataFromServer(Api.employeeUrl);
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

  const onFromLeaveTypeSubmit = (value) => {
    console.log('value', value.label);
    if (value.label === 'Half Day') {

       const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'leave_from_time')
            itemData.disabled = false;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]); 
    } else {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'leave_from_time')
            itemData.disabled = true;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]); 
    }
  };

  const onToLeaveTypeSubmit = (value) => {
    console.log('value', value);
    if (value.label === 'Half Day') {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'leave_to_time') itemData.disabled = false;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    } else {
      const formSchema = [...FormSections];
      const updatedSchema = formSchema.map((section) => {
        const s = { ...section };
        s.fields = section.fields.map((item) => {
          const itemData = item;
          if (item.name === 'leave_to_time') itemData.disabled = true;
          return itemData;
        });
        return s;
      });
      updateJsonSchema([...updatedSchema]);
    }
  };

  return (
    <>
      <div className="mt-5">
        <StarkFormBuilder
          containerClass=""
          formHeaderClass=""
          formSections={FormSections || jsonSchema}
          formHeading="Leave"
          onFormSubmit={(formValues) => {
            submitForm(formValues);
          }}
          options={options}
          callbacks={{
            onFromLeaveType: (value) => {
              onFromLeaveTypeSubmit(value);
            },
            onToLeaveType: (value) => {
              onToLeaveTypeSubmit(value);
            },
          }}
          defaultFormValues={defaultValues}
          currentUser={currentUser}
          submitBtnText="Check task"
          showResetBtn={true}
          resetBtnText="Clear"
          btnContainerClass="form-submit-buttons"
          isStepForm={false}
          onFormReset={() => {
            console.log('form reset callback');
          }}
        />
        <div className="mt-5">

        <Card>

          <CustomTable
      columns={columns}
      rows={rowData}
      role={5}
      emptyRender={() => {
        return 'No record found.';
      }}
    />
        </Card>
        </div>
      </div>
    </>
  );
}

export default withRouter(AddLeave);
