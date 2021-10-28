import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import EmployeePolicyList from './employeePolicyList.component';
import PolicyList from './policyList.component';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';

function Policy() {
  const items = [{ to: '/', label: 'Home' }, { label: 'Policy' }];
  const [title, setTitle] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const id = customFunctions.getLocalStorage('group');
    setUserRole(id);
    setTitle('Policy');
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Policy</h2>
        <Breadcrumb items={items} />
      </div>
      <section className="content-area">
      { (Number(userRole) !== 5 && Number(userRole) !== 6) && (
        <EmployeePolicyList/>
        )
      }
      { (Number(userRole) === 5 || Number(userRole) === 6) && (
        <PolicyList/>
        )
      }
      </section>
    </>
  );
}

export default withRouter(Policy);
