import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// Import section
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './AddBasicInfo.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function BasicInformation() {

    // Variable declarations
    const [defaultValues, updateDefaultValues] = useState({}); // eslint-disable-line
    const [options, updateOptions] = useState({});
    const [currentUser, updateCurrentUser] = useState(0);


    // Get user role
    const getUserRole = async () => {
        const roleId = await localStorage.getItem('role');
        updateCurrentUser(Number(roleId));
    };

    useEffect(() => {
        getUserRole();
    }, []);

    // Submit Form
    const submitForm = async (formValues) => {
        console.log(formValues);

        const { data } = await AuthApi.postDataToServer(Api.employeeUrl, formValues);
        if (!data) {
            // show error
            return; // eslint-disable-line
        }
        // Perform success actions

    };

    const getTechnology = async () => {
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
            technology: dpOptions
        };
        updateOptions(allOptions);
    }

    useEffect(() => {
        getTechnology();
    }, []);


    return (

        // Usage
        <StarkFormBuilder
            containerClass='mt-3'
            formHeaderClass=''
            formSections={FormSections}
            formHeading="Basic Information"
            onFormSubmit={(formValues) => { submitForm(formValues); }}
            options={options}
            callbacks={{}}
            defaultFormValues={defaultValues}
            currentUser={currentUser}
            submitBtnText="Save"
            showResetBtn={false}
            resetBtnText="Clear"
            btnContainerClass="form-submit-buttons"
            isStepForm={false}

            onFormReset={() => {
                console.log('form reset callback')
            }}
        />


    )
}

export default withRouter(BasicInformation);