import React from 'react';

function Breadcrumb() {
  return (
    <>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Project Dashboard
        </li>
      </ol>
    </>
  );
}

export default Breadcrumb;
