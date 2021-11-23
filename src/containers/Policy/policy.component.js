import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PolicyList from './policyList.component';
import EmployeeList from './employeePolicyList.component';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';

function Policy() {
  const items = [{ to: '/', label: 'Home' }, { label: 'Policy' }];
  const [title, setTitle] = useState('');

  const [currentUser, updateCurrentUser] = useState(0);

  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('group');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
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
        {[1,2,5,6].includes(Number(currentUser)) ? (
          <PolicyList />
        ):(
          <EmployeeList />
        )}
      </section>
    </>
  );
}

export default withRouter(Policy);
