import React from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function Applications() {
  const title = 'Applications';

  const items = [
    { to: '/', label: 'Home' },
    { label: 'Applications' },
  ];
  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Applications</h2>
        <Breadcrumb items={items} />
      </div>
    </>
  )
}

export default withRouter(Applications);