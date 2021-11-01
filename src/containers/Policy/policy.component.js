import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PolicyList from './policyList.component';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import { Helmet } from '../../components/FormInputs';

function Policy() {
  const items = [{ to: '/', label: 'Home' }, { label: 'Policy' }];
  const [title, setTitle] = useState('');

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
        <PolicyList/>
      </section>
    </>
  );
}

export default withRouter(Policy);
